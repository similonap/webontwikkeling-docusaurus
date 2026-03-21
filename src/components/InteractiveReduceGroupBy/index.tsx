import React, { useState, useRef, useEffect, useCallback } from 'react';
import styles from './styles.module.css';

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

interface FlyingBadge {
    value: string;
    startX: number;
    startY: number;
    endX: number;
    endY: number;
    moving: boolean;
    id: number;
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
    const [stepIndex, setStepIndex] = useState(-1);
    const [isPlaying, setIsPlaying] = useState(false);
    const [badge, setBadge] = useState<FlyingBadge | null>(null);

    const containerRef = useRef<HTMLDivElement>(null);
    const initialValueRef = useRef<HTMLSpanElement>(null);
    const accParamRef = useRef<HTMLSpanElement>(null);
    const curParamRef = useRef<HTMLSpanElement>(null);
    const arrayElementRefs = useRef<(HTMLDivElement | null)[]>([]);
    const accBoxRef = useRef<HTMLDivElement>(null);
    const curBoxRef = useRef<HTMLDivElement>(null);

    const cleanupRef = useRef<(() => void) | null>(null);

    const vis = deriveVisualState(stepIndex);
    const isDone = vis.isDone;
    const isRunning = stepIndex >= 0 && !isDone;

    // ------------------------------------------------------------------
    // Flying badge
    // ------------------------------------------------------------------

    const launchBadge = useCallback((
        sourceRef: React.RefObject<HTMLElement | HTMLDivElement | null>,
        destRef: React.RefObject<HTMLElement | HTMLDivElement | null>,
        value: string,
        onLand: () => void,
    ) => {
        const container = containerRef.current;
        const source = sourceRef.current;
        const dest = destRef.current;
        if (!container || !source || !dest) { onLand(); return; }

        const cRect = container.getBoundingClientRect();
        const sRect = source.getBoundingClientRect();
        const dRect = dest.getBoundingClientRect();

        const startX = sRect.left - cRect.left + sRect.width / 2;
        const startY = sRect.top - cRect.top + sRect.height / 2;
        const endX = dRect.left - cRect.left + dRect.width / 2;
        const endY = dRect.top - cRect.top + dRect.height / 2;

        const newBadge: FlyingBadge = {
            value, startX, startY, endX, endY, moving: false, id: Date.now(),
        };
        setBadge(newBadge);

        const raf1 = requestAnimationFrame(() => {
            const raf2 = requestAnimationFrame(() => {
                setBadge(prev => prev?.id === newBadge.id ? { ...prev, moving: true } : prev);
                const timer = setTimeout(() => {
                    setBadge(prev => prev?.id === newBadge.id ? null : prev);
                    onLand();
                }, 450);
                cleanupRef.current = () => { clearTimeout(timer); setBadge(null); };
            });
            cleanupRef.current = () => { cancelAnimationFrame(raf2); setBadge(null); };
        });
        cleanupRef.current = () => { cancelAnimationFrame(raf1); setBadge(null); };
    }, []);

    // ------------------------------------------------------------------
    // Step advancement
    // ------------------------------------------------------------------

    const advanceStep = useCallback((currentIndex: number) => {
        const nextIndex = currentIndex + 1;
        if (nextIndex >= STEPS.length) {
            setIsPlaying(false);
            return;
        }

        const nextStep = STEPS[nextIndex];

        if (nextStep.type === 'move-to-acc') {
            setStepIndex(nextIndex);
            launchBadge(initialValueRef, accBoxRef, '{}', () => { });
        } else if (nextStep.type === 'move-to-cur') {
            setStepIndex(nextIndex);
            const elRef = { current: arrayElementRefs.current[nextStep.index] };
            launchBadge(elRef as React.RefObject<HTMLDivElement>, curBoxRef, nextStep.employee.name, () => { });
        } else {
            setStepIndex(nextIndex);
        }
    }, [launchBadge]);

    // Auto-play
    useEffect(() => {
        if (!isPlaying) return;
        if (isDone) { setIsPlaying(false); return; }

        const currentStep = stepIndex >= 0 ? STEPS[stepIndex] : null;
        const delay = currentStep ? STEP_DURATION[currentStep.type] : 200;

        const timer = setTimeout(() => {
            advanceStep(stepIndex);
        }, delay);

        return () => clearTimeout(timer);
    }, [isPlaying, stepIndex, isDone, advanceStep]);

    // ------------------------------------------------------------------
    // Handlers
    // ------------------------------------------------------------------

    const handleStart = () => {
        if (isDone) { reset(); return; }
        if (stepIndex < 0) {
            setStepIndex(0);
            setIsPlaying(true);
        } else {
            setIsPlaying(prev => !prev);
        }
    };

    const handleStep = () => {
        if (isDone) return;
        if (stepIndex < 0) {
            setStepIndex(0);
        } else {
            advanceStep(stepIndex);
        }
        setIsPlaying(false);
    };

    const reset = () => {
        cleanupRef.current?.();
        cleanupRef.current = null;
        setBadge(null);
        setStepIndex(-1);
        setIsPlaying(false);
    };

    // ------------------------------------------------------------------
    // Body line rendering
    // ------------------------------------------------------------------

    // if (acc[cur.dept]) {
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

    // acc[cur.dept].push(cur.name);
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

    // acc[cur.dept] = [cur.name];
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

    // ------------------------------------------------------------------
    // Helpers
    // ------------------------------------------------------------------

    const accEntries = Object.entries(vis.acc);

    const formatResult = (result: Record<string, string[]>) =>
        '{ ' + Object.entries(result).map(([k, v]) => `${k}: ['${v.join("', '")}']`).join(', ') + ' }';

    // ------------------------------------------------------------------
    // Render
    // ------------------------------------------------------------------

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
                    {/* if line */}
                    <div className={`${styles.codeLine} ${vis.bodyPhase === 'dept' ? styles.codeLineHighlight : ''}`}>
                        <span className={styles.punct}>&nbsp;&nbsp;&nbsp;&nbsp;</span>
                        {renderIfLine()}
                    </div>
                    {/* push line */}
                    <div className={`${styles.codeLine} ${vis.bodyPhase === 'push' ? styles.codeLineHighlight : ''}`}>
                        <span className={styles.punct}>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>
                        {renderPushLine()}
                    </div>
                    <div className={styles.codeLine}>
                        <span className={styles.punct}>&nbsp;&nbsp;&nbsp;&nbsp;{'} else {'}</span>
                    </div>
                    {/* init line */}
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
                {/* acc box */}
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

                {/* cur box */}
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

            {/* ---- Controls ---- */}
            <div className={styles.controls}>
                <button className={styles.btnPrimary} onClick={handleStart}>
                    {isDone ? '↺ Opnieuw' : stepIndex < 0 ? '▶ Start' : isPlaying ? '⏸ Pauze' : '▶ Verder'}
                </button>
                <button
                    className={styles.btnSecondary}
                    onClick={handleStep}
                    disabled={isPlaying || isDone}
                >
                    Stap →
                </button>
                <button
                    className={styles.btnSecondary}
                    onClick={reset}
                    disabled={stepIndex < 0 && !isDone}
                >
                    ↺ Reset
                </button>
            </div>

            {/* ---- Flying Badge ---- */}
            {badge && (
                <div
                    key={badge.id}
                    className={styles.flyingBadge}
                    style={{
                        left: badge.moving ? badge.endX : badge.startX,
                        top: badge.moving ? badge.endY : badge.startY,
                    }}
                >
                    {badge.value}
                </div>
            )}
        </div>
    );
}
