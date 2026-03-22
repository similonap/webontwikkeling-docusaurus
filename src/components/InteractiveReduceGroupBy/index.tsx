import React, { useRef, useCallback } from 'react';
import styles from './styles.module.css';
import { useReduceAnimation } from '../shared/useReduceAnimation';
import type { AnimationRefs, BadgeAnimation } from '../shared/useReduceAnimation';
import ReduceControls from '../shared/ReduceControls';
import FlyingBadgeDisplay from '../shared/FlyingBadgeDisplay';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface Employee {
    name: string;
    dept: string;
}

type GroupByStep =
    | { type: 'code-dim' }
    | { type: 'highlight-initial' }
    | { type: 'move-to-acc' }
    | { type: 'highlight-element'; index: number }
    | { type: 'move-to-cur'; index: number; employee: Employee }
    | { type: 'show-dept'; dept: string }
    | { type: 'show-push'; dept: string; name: string }
    | { type: 'show-init'; dept: string; name: string }
    | { type: 'update-acc'; dept: string; acc: Record<string, string[]> }
    | { type: 'done'; result: Record<string, string[]> };

interface VisualState {
    codeDimmed: boolean;
    highlightedToken: 'initial' | 'acc-param' | 'cur-param' | null;
    highlightedArrayIndex: number | null;
    acc: Record<string, string[]>;
    accArriveKey: number;
    cur: Employee | null;
    curArriveKey: number;
    computedDept: string | null;
    bodyPhase: 'dept' | 'push' | 'init' | null;
    lastUpdatedKey: string | null;
    lastUpdatedKeyId: number;
    isDone: boolean;
    finalResult: Record<string, string[]> | null;
}

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const EMPLOYEES: Employee[] = [
    { name: 'Alice', dept: 'IT' },
    { name: 'Bob',   dept: 'HR' },
    { name: 'Eve',   dept: 'IT' },
];

const STEP_DURATION: Record<GroupByStep['type'], number> = {
    'code-dim': 500,
    'highlight-initial': 700,
    'move-to-acc': 800,
    'highlight-element': 700,
    'move-to-cur': 800,
    'show-dept': 900,
    'show-push': 900,
    'show-init': 900,
    'update-acc': 700,
    'done': 0,
};

// ---------------------------------------------------------------------------
// Step generation
// ---------------------------------------------------------------------------

function generateSteps(): GroupByStep[] {
    const steps: GroupByStep[] = [];
    steps.push({ type: 'code-dim' });
    steps.push({ type: 'highlight-initial' });
    steps.push({ type: 'move-to-acc' });

    const acc: Record<string, string[]> = {};
    for (let i = 0; i < EMPLOYEES.length; i++) {
        const employee = EMPLOYEES[i];
        steps.push({ type: 'highlight-element', index: i });
        steps.push({ type: 'move-to-cur', index: i, employee });
        steps.push({ type: 'show-dept', dept: employee.dept });
        if (acc[employee.dept]) {
            steps.push({ type: 'show-push', dept: employee.dept, name: employee.name });
            acc[employee.dept] = [...acc[employee.dept], employee.name];
        } else {
            steps.push({ type: 'show-init', dept: employee.dept, name: employee.name });
            acc[employee.dept] = [employee.name];
        }
        steps.push({ type: 'update-acc', dept: employee.dept, acc: JSON.parse(JSON.stringify(acc)) });
    }
    steps.push({ type: 'done', result: JSON.parse(JSON.stringify(acc)) });
    return steps;
}

const STEPS = generateSteps();

// ---------------------------------------------------------------------------
// Visual state derivation
// ---------------------------------------------------------------------------

function deriveVisualState(stepIndex: number): VisualState {
    const state: VisualState = {
        codeDimmed: false,
        highlightedToken: null,
        highlightedArrayIndex: null,
        acc: {},
        accArriveKey: 0,
        cur: null,
        curArriveKey: 0,
        computedDept: null,
        bodyPhase: null,
        lastUpdatedKey: null,
        lastUpdatedKeyId: 0,
        isDone: false,
        finalResult: null,
    };
    if (stepIndex < 0) return state;

    for (let i = 0; i <= stepIndex; i++) {
        const step = STEPS[i];
        switch (step.type) {
            case 'code-dim':
                state.codeDimmed = true;
                state.highlightedToken = null;
                break;
            case 'highlight-initial':
                state.highlightedToken = 'initial';
                break;
            case 'move-to-acc':
                state.acc = {};
                state.accArriveKey = i;
                state.highlightedToken = 'acc-param';
                break;
            case 'highlight-element':
                state.highlightedArrayIndex = step.index;
                state.highlightedToken = null;
                state.bodyPhase = null;
                state.computedDept = null;
                break;
            case 'move-to-cur':
                state.cur = step.employee;
                state.curArriveKey = i;
                state.highlightedToken = 'cur-param';
                break;
            case 'show-dept':
                state.computedDept = step.dept;
                state.bodyPhase = 'dept';
                state.highlightedToken = null;
                break;
            case 'show-push':
                state.bodyPhase = 'push';
                break;
            case 'show-init':
                state.bodyPhase = 'init';
                break;
            case 'update-acc':
                state.acc = { ...step.acc };
                state.accArriveKey = i;
                state.lastUpdatedKey = step.dept;
                state.lastUpdatedKeyId = i;
                state.bodyPhase = null;
                state.computedDept = null;
                break;
            case 'done':
                state.isDone = true;
                state.finalResult = step.result;
                state.highlightedToken = null;
                state.bodyPhase = null;
                break;
        }
    }
    return state;
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export default function InteractiveReduceGroupBy() {
    const initialValueRef = useRef<HTMLSpanElement>(null);
    const accParamRef = useRef<HTMLSpanElement>(null);
    const curParamRef = useRef<HTMLSpanElement>(null);

    const getBadgeAnimation = useCallback((
        step: GroupByStep,
        { arrayElementRefs, accBoxRef, curBoxRef }: AnimationRefs,
    ): BadgeAnimation | null => {
        if (step.type === 'move-to-acc')
            return { source: initialValueRef, dest: accBoxRef, value: '{}' };
        if (step.type === 'move-to-cur')
            return { source: { current: arrayElementRefs.current[step.index] }, dest: curBoxRef, value: step.employee.name };
        return null;
    }, []);

    const {
        stepIndex, isPlaying, badge, isDone, isRunning,
        containerRef, accBoxRef, curBoxRef, arrayElementRefs,
        handleStart, handleStep, reset,
    } = useReduceAnimation({ steps: STEPS, stepDuration: STEP_DURATION, getBadgeAnimation });

    const vis = deriveVisualState(stepIndex);
    const accEntries = Object.entries(vis.acc);

    const formatResult = (result: Record<string, string[]>) =>
        '{ ' + Object.entries(result).map(([k, v]) => `${k}: ['${v.join("', '")}']`).join(', ') + ' }';

    function renderIfLine() {
        if (vis.bodyPhase !== 'dept' || vis.computedDept === null) {
            return (
                <>
                    <span className={styles.kwIf}>if</span>
                    <span className={styles.punct}>{' (acc['}</span>
                    <span className={styles.paramName}>cur</span>
                    <span className={styles.punct}>.dept]) {'{'}</span>
                </>
            );
        }
        return (
            <>
                <span className={styles.kwIf}>if</span>
                <span className={styles.punct}>{' (acc['}</span>
                <span className={styles.substituted}>
                    <span key={`dept-${vis.curArriveKey}`} className={styles.substitutedValue}>'{vis.computedDept}'</span>
                </span>
                <span className={styles.punct}>{']) {'}</span>
            </>
        );
    }

    function renderPushLine() {
        if (vis.bodyPhase !== 'push' || vis.computedDept === null) {
            return (
                <>
                    <span className={styles.punct}>acc[</span>
                    <span className={styles.paramName}>cur</span>
                    <span className={styles.punct}>.dept].push(</span>
                    <span className={styles.paramName}>cur</span>
                    <span className={styles.punct}>.name);</span>
                </>
            );
        }
        return (
            <>
                <span className={styles.punct}>acc[</span>
                <span className={styles.substituted}>
                    <span key={`pdept-${vis.curArriveKey}`} className={styles.substitutedValue}>'{vis.computedDept}'</span>
                </span>
                <span className={styles.punct}>{'].push('}</span>
                <span className={styles.substituted}>
                    <span key={`pname-${vis.curArriveKey}`} className={styles.substitutedValue}>'{vis.cur?.name}'</span>
                </span>
                <span className={styles.punct}>);</span>
            </>
        );
    }

    function renderInitLine() {
        if (vis.bodyPhase !== 'init' || vis.computedDept === null) {
            return (
                <>
                    <span className={styles.punct}>acc[</span>
                    <span className={styles.paramName}>cur</span>
                    <span className={styles.punct}>.dept] = [</span>
                    <span className={styles.paramName}>cur</span>
                    <span className={styles.punct}>.name];</span>
                </>
            );
        }
        return (
            <>
                <span className={styles.punct}>acc[</span>
                <span className={styles.substituted}>
                    <span key={`idept-${vis.curArriveKey}`} className={styles.substitutedValue}>'{vis.computedDept}'</span>
                </span>
                <span className={styles.punct}>{'] = ['}</span>
                <span className={styles.substituted}>
                    <span key={`iname-${vis.curArriveKey}`} className={styles.substitutedValue}>'{vis.cur?.name}'</span>
                </span>
                <span className={styles.punct}>];</span>
            </>
        );
    }

    return (
        <div className={styles.container} ref={containerRef}>
            {/* ---- Code Panel ---- */}
            <div className={`${styles.codePanel} ${vis.codeDimmed ? styles.codeDimmed : ''}`}>
                <div className={styles.codeHeader}>reduce-groupby.ts</div>
                <div className={styles.codeBody}>
                    <div className={styles.codeLine}>
                        <span className={styles.kwConst}>const</span>
                        {' '}
                        <span className={styles.varName}>employees</span>
                        <span className={styles.punct}>: </span>
                        <span className={styles.typeName}>Employee</span>
                        <span className={styles.punct}>[] = [</span>
                    </div>
                    {EMPLOYEES.map((e, i) => (
                        <div key={i} className={styles.codeLine}>
                            <span className={styles.punct}>&nbsp;&nbsp;{'{ '}</span>
                            <span className={styles.varName}>name</span>
                            <span className={styles.punct}>: </span>
                            <span className={styles.strLit}>'{e.name}'</span>
                            <span className={styles.punct}>{', '}</span>
                            <span className={styles.varName}>dept</span>
                            <span className={styles.punct}>: </span>
                            <span className={styles.strLit}>'{e.dept}'</span>
                            <span className={styles.punct}>{' }' + (i < EMPLOYEES.length - 1 ? ',' : '')}</span>
                        </div>
                    ))}
                    <div className={styles.codeLine}>
                        <span className={styles.punct}>];</span>
                    </div>
                    <div className={styles.codeBlankLine}>&nbsp;</div>
                    <div className={styles.codeLine}>
                        <span className={styles.kwConst}>const</span>
                        {' '}
                        <span className={styles.varName}>grouped</span>
                        <span className={styles.punct}>{' = employees.reduce<'}</span>
                        <span className={styles.typeName}>Record</span>
                        <span className={styles.punct}>{'<'}</span>
                        <span className={styles.typeName}>string</span>
                        <span className={styles.punct}>{', '}</span>
                        <span className={styles.typeName}>string</span>
                        <span className={styles.punct}>{'[]>>('}
                        </span>
                    </div>
                    <div className={styles.codeLine}>
                        <span className={styles.punct}>&nbsp;&nbsp;{'('}</span>
                        <span
                            ref={accParamRef}
                            className={`${styles.paramName} ${vis.highlightedToken === 'acc-param' ? styles.tokenHighlight : ''}`}
                        >acc</span>
                        <span className={styles.punct}>{', '}</span>
                        <span
                            ref={curParamRef}
                            className={`${styles.paramName} ${vis.highlightedToken === 'cur-param' ? styles.tokenHighlight : ''}`}
                        >cur</span>
                        <span className={styles.punct}>{') => {'}</span>
                    </div>
                    <div className={`${styles.codeLine} ${vis.bodyPhase === 'dept' ? styles.codeLineHighlight : ''}`}>
                        <span className={styles.punct}>&nbsp;&nbsp;&nbsp;&nbsp;</span>
                        {renderIfLine()}
                    </div>
                    <div className={`${styles.codeLine} ${vis.bodyPhase === 'push' ? styles.codeLineHighlight : ''}`}>
                        <span className={styles.punct}>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>
                        {renderPushLine()}
                    </div>
                    <div className={styles.codeLine}>
                        <span className={styles.punct}>&nbsp;&nbsp;&nbsp;&nbsp;{'} else {'}</span>
                    </div>
                    <div className={`${styles.codeLine} ${vis.bodyPhase === 'init' ? styles.codeLineHighlight : ''}`}>
                        <span className={styles.punct}>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>
                        {renderInitLine()}
                    </div>
                    <div className={styles.codeLine}>
                        <span className={styles.punct}>&nbsp;&nbsp;&nbsp;&nbsp;{'}'}</span>
                    </div>
                    <div className={styles.codeLine}>
                        <span className={styles.kwReturn}>&nbsp;&nbsp;&nbsp;&nbsp;return</span>
                        {' '}
                        <span className={styles.paramName}>acc</span>
                        <span className={styles.punct}>;</span>
                    </div>
                    <div className={styles.codeLine}>
                        <span className={styles.punct}>&nbsp;&nbsp;{'}'}</span>
                        <span className={styles.punct}>{','}</span>
                    </div>
                    <div className={styles.codeLine}>
                        <span className={styles.punct}>&nbsp;&nbsp;</span>
                        <span
                            ref={initialValueRef}
                            className={`${styles.punct} ${vis.highlightedToken === 'initial' ? styles.tokenHighlight : ''}`}
                        >{'{}'}</span>
                    </div>
                    <div className={styles.codeLine}>
                        <span className={styles.punct}>{');'}</span>
                    </div>
                </div>
            </div>

            {/* ---- Array Panel ---- */}
            <div className={styles.arrayPanel}>
                <span className={styles.arrayLabel}>employees</span>
                <div className={styles.arrayElements}>
                    {EMPLOYEES.map((emp, i) => (
                        <div
                            key={i}
                            ref={el => { arrayElementRefs.current[i] = el; }}
                            className={`${styles.arrayElement} ${vis.highlightedArrayIndex === i ? styles.arrayElementHighlighted : ''} ${vis.isDone || (isRunning && vis.highlightedArrayIndex !== null && i < vis.highlightedArrayIndex) ? styles.arrayElementUsed : ''}`}
                        >
                            <span className={styles.empName}>{emp.name}</span>
                            <span className={styles.empDept}>{emp.dept}</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* ---- State Panel ---- */}
            <div className={styles.statePanel}>
                <div className={styles.accBox}>
                    <div className={styles.stateLabel}>acc</div>
                    <div
                        ref={accBoxRef}
                        className={`${styles.accValue} ${accEntries.length > 0 ? styles.accValueFilled : ''}`}
                    >
                        {accEntries.length === 0 ? (
                            <span className={styles.emptyObj}>
                                {stepIndex < 0 ? (
                                    <span className={styles.statePlaceholder}>–</span>
                                ) : (
                                    <span key={vis.accArriveKey} className={styles.valueArrive}>{'{}'}</span>
                                )}
                            </span>
                        ) : (
                            <div className={styles.accList}>
                                {accEntries.map(([key, names]) => (
                                    <div
                                        key={key}
                                        className={`${styles.accRow} ${vis.lastUpdatedKey === key ? styles.accRowUpdated : ''}`}
                                    >
                                        <span className={styles.accKey}>{key}</span>
                                        <span className={styles.accColon}>:</span>
                                        <span
                                            className={styles.accCount}
                                            key={`${key}-${names.join(',')}-${vis.lastUpdatedKeyId}`}
                                        >
                                            ['{names.join("', '")}']
                                        </span>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
                <div className={styles.curBox}>
                    <div className={styles.stateLabel}>cur</div>
                    <div
                        ref={curBoxRef}
                        className={`${styles.stateValue} ${vis.cur !== null ? styles.stateValueFilled : ''}`}
                    >
                        {vis.cur !== null ? (
                            <div key={vis.curArriveKey} className={styles.curValue}>
                                <span className={styles.empName}>{vis.cur.name}</span>
                                <span className={styles.empDept}>{vis.cur.dept}</span>
                            </div>
                        ) : (
                            <span className={styles.statePlaceholder}>–</span>
                        )}
                    </div>
                </div>
            </div>

            {/* ---- Done result ---- */}
            {vis.isDone && (
                <div className={`${styles.resultPanel} ${styles.resultPanelDone}`}>
                    <span className={styles.resultDone}>
                        grouped = <strong>{formatResult(vis.finalResult!)}</strong>
                    </span>
                </div>
            )}

            <ReduceControls
                isDone={isDone}
                stepIndex={stepIndex}
                isPlaying={isPlaying}
                onStart={handleStart}
                onStep={handleStep}
                onReset={reset}
                styles={styles}
            />
            <FlyingBadgeDisplay badge={badge} styles={styles} />
        </div>
    );
}
