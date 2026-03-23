import React, { useRef, useCallback, useState } from 'react';
import styles from './styles.module.css';
import { useReduceAnimation } from '../shared/useReduceAnimation';
import type { AnimationRefs, BadgeAnimation } from '../shared/useReduceAnimation';
import ReduceControls from '../shared/ReduceControls';
import FlyingBadgeDisplay from '../shared/FlyingBadgeDisplay';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type UniqueStep =
    | { type: 'code-dim' }
    | { type: 'highlight-initial' }
    | { type: 'move-to-acc' }
    | { type: 'highlight-element'; index: number }
    | { type: 'move-to-cur'; index: number; value: number }
    | { type: 'show-includes'; cur: number; result: boolean }
    | { type: 'show-skip' }
    | { type: 'show-add'; cur: number }
    | { type: 'update-acc'; acc: number[] }
    | { type: 'done'; result: number[] };

interface VisualState {
    codeDimmed: boolean;
    highlightedToken: 'initial' | 'acc-param' | 'cur-param' | null;
    highlightedArrayIndex: number | null;
    acc: number[];
    accArriveKey: number;
    cur: number | null;
    curArriveKey: number;
    bodyPhase: 'includes' | 'skip' | 'add' | null;
    includesResult: boolean | null;
    lastAddedId: number;
    isDone: boolean;
    finalResult: number[] | null;
}

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const DATA = [1, 2, 2, 3, 1, 4, 3];

const STEP_DURATION: Record<UniqueStep['type'], number> = {
    'code-dim': 500,
    'highlight-initial': 700,
    'move-to-acc': 800,
    'highlight-element': 700,
    'move-to-cur': 800,
    'show-includes': 1000,
    'show-skip': 800,
    'show-add': 800,
    'update-acc': 700,
    'done': 0,
};

// ---------------------------------------------------------------------------
// Step generation
// ---------------------------------------------------------------------------

function generateSteps(): UniqueStep[] {
    const steps: UniqueStep[] = [];
    steps.push({ type: 'code-dim' });
    steps.push({ type: 'highlight-initial' });
    steps.push({ type: 'move-to-acc' });

    const acc: number[] = [];
    for (let i = 0; i < DATA.length; i++) {
        const cur = DATA[i];
        steps.push({ type: 'highlight-element', index: i });
        steps.push({ type: 'move-to-cur', index: i, value: cur });
        const result = acc.includes(cur);
        steps.push({ type: 'show-includes', cur, result });
        if (result) {
            steps.push({ type: 'show-skip' });
        } else {
            steps.push({ type: 'show-add', cur });
            acc.push(cur);
        }
        steps.push({ type: 'update-acc', acc: [...acc] });
    }
    steps.push({ type: 'done', result: [...acc] });
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
        acc: [],
        accArriveKey: 0,
        cur: null,
        curArriveKey: 0,
        bodyPhase: null,
        includesResult: null,
        lastAddedId: 0,
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
                state.acc = [];
                state.accArriveKey = i;
                state.highlightedToken = 'acc-param';
                break;
            case 'highlight-element':
                state.highlightedArrayIndex = step.index;
                state.highlightedToken = null;
                state.bodyPhase = null;
                state.includesResult = null;
                break;
            case 'move-to-cur':
                state.cur = step.value;
                state.curArriveKey = i;
                state.highlightedToken = 'cur-param';
                break;
            case 'show-includes':
                state.bodyPhase = 'includes';
                state.includesResult = step.result;
                state.highlightedToken = null;
                break;
            case 'show-skip':
                state.bodyPhase = 'skip';
                break;
            case 'show-add':
                state.bodyPhase = 'add';
                break;
            case 'update-acc':
                state.acc = [...step.acc];
                state.accArriveKey = i;
                state.lastAddedId = i;
                state.bodyPhase = null;
                state.includesResult = null;
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

export default function InteractiveReduceUnique() {
    const [typeInference, setTypeInference] = useState(false);
    const [returnStatement, setReturnStatement] = useState(false);

    const initialValueRef = useRef<HTMLSpanElement>(null);
    const accParamRef = useRef<HTMLSpanElement>(null);
    const curParamRef = useRef<HTMLSpanElement>(null);

    const getBadgeAnimation = useCallback((
        step: UniqueStep,
        { arrayElementRefs, accBoxRef, curBoxRef }: AnimationRefs,
    ): BadgeAnimation | null => {
        if (step.type === 'move-to-acc')
            return { source: initialValueRef, dest: accBoxRef, value: '[]' };
        if (step.type === 'move-to-cur')
            return { source: { current: arrayElementRefs.current[step.index] }, dest: curBoxRef, value: String(step.value) };
        return null;
    }, []);

    const {
        stepIndex, isPlaying, badge, isDone, isRunning,
        containerRef, accBoxRef, curBoxRef, arrayElementRefs,
        handleStart, handleStep, reset,
    } = useReduceAnimation({ steps: STEPS, stepDuration: STEP_DURATION, getBadgeAnimation });

    const vis = deriveVisualState(stepIndex);

    function renderIncludesLine() {
        if (vis.bodyPhase !== 'includes' || vis.cur === null) {
            return (
                <>
                    <span className={styles.paramName}>acc</span>
                    <span className={styles.punct}>.includes(</span>
                    <span className={styles.paramName}>cur</span>
                    <span className={styles.punct}>)</span>
                </>
            );
        }
        return (
            <>
                <span className={styles.paramName}>acc</span>
                <span className={styles.punct}>.includes(</span>
                <span className={styles.substituted}>
                    <span key={`inc-${vis.curArriveKey}`} className={styles.substitutedValue}>{vis.cur}</span>
                </span>
                <span className={styles.punct}>)</span>
                <span className={vis.includesResult ? styles.resultTrue : styles.resultFalse}>
                    {' = '}
                    <span key={`incr-${vis.curArriveKey}`} className={styles.calcResultValue}>
                        {String(vis.includesResult)}
                    </span>
                </span>
            </>
        );
    }

    function renderAddValue() {
        if (vis.bodyPhase !== 'add' || vis.cur === null) {
            return (
                <>
                    <span className={styles.punct}>{', '}</span>
                    <span className={styles.paramName}>cur</span>
                </>
            );
        }
        return (
            <>
                <span className={styles.punct}>{', '}</span>
                <span className={styles.substituted}>
                    <span key={`add-${vis.curArriveKey}`} className={styles.substitutedValue}>{vis.cur}</span>
                </span>
            </>
        );
    }

    function renderAddLine() {
        if (vis.bodyPhase !== 'add' || vis.cur === null) {
            return (
                <>
                    <span className={styles.punct}>{': [...'}</span>
                    <span className={styles.paramName}>acc</span>
                    <span className={styles.punct}>{', '}</span>
                    <span className={styles.paramName}>cur</span>
                    <span className={styles.punct}>]</span>
                </>
            );
        }
        return (
            <>
                <span className={styles.punct}>{': [...'}</span>
                <span className={styles.paramName}>acc</span>
                <span className={styles.punct}>{', '}</span>
                <span className={styles.substituted}>
                    <span key={`add-${vis.curArriveKey}`} className={styles.substitutedValue}>{vis.cur}</span>
                </span>
                <span className={styles.punct}>]</span>
            </>
        );
    }

    const bodyHighlightClass =
        vis.bodyPhase === 'includes' ? styles.codeLineHighlight :
        vis.bodyPhase === 'skip' ? styles.codeLineHighlightTrue :
        vis.bodyPhase === 'add' ? styles.codeLineHighlightFalse : '';

    return (
        <div className={styles.container} ref={containerRef}>
            {/* ---- Checkboxes ---- */}
            <div className={styles.checkboxRow}>
                <label className={styles.checkboxLabel}>
                    <input
                        type="checkbox"
                        checked={typeInference}
                        onChange={e => setTypeInference(e.target.checked)}
                    />
                    gebruik type inference
                </label>
                <label className={styles.checkboxLabel}>
                    <input
                        type="checkbox"
                        checked={returnStatement}
                        onChange={e => setReturnStatement(e.target.checked)}
                    />
                    gebruik return statement
                </label>
            </div>

            {/* ---- Code Panel ---- */}
            <div className={`${styles.codePanel} ${vis.codeDimmed ? styles.codeDimmed : ''}`}>
                <div className={styles.codeHeader}>reduce-unique.ts</div>
                <div className={styles.codeBody}>
                    <div className={styles.codeLine}>
                        <span className={styles.kwConst}>const</span>
                        {' '}
                        <span className={styles.varName}>data</span>
                        <span className={styles.punct}>: </span>
                        <span className={styles.typeName}>number</span>
                        <span className={styles.punct}>[] = [</span>
                        <span className={styles.numLit}>1, 2, 2, 3, 1, 4, 3</span>
                        <span className={styles.punct}>];</span>
                    </div>
                    <div className={styles.codeBlankLine}>&nbsp;</div>
                    <div className={styles.codeLine}>
                        <span className={styles.kwConst}>const</span>
                        {' '}
                        <span className={styles.varName}>unique</span>
                        <span className={styles.punct}>{' = data.reduce<'}</span>
                        <span className={styles.typeName}>number</span>
                        <span className={styles.punct}>{'[]>('}</span>
                    </div>
                    <div className={`${styles.codeLine} ${bodyHighlightClass}`}>
                        <span className={styles.punct}>&nbsp;&nbsp;(</span>
                        <span
                            ref={accParamRef}
                            className={`${styles.paramName} ${vis.highlightedToken === 'acc-param' ? styles.tokenHighlight : ''}`}
                        >acc</span>
                        {!typeInference && (
                            <>
                                <span className={styles.punct}>: </span>
                                <span className={styles.typeName}>number</span>
                                <span className={styles.punct}>[]</span>
                            </>
                        )}
                        <span className={styles.punct}>{', '}</span>
                        <span
                            ref={curParamRef}
                            className={`${styles.paramName} ${vis.highlightedToken === 'cur-param' ? styles.tokenHighlight : ''}`}
                        >cur</span>
                        {!typeInference && (
                            <>
                                <span className={styles.punct}>: </span>
                                <span className={styles.typeName}>number</span>
                            </>
                        )}
                        <span className={styles.punct}>)</span>
                        <span className={styles.punct}>{returnStatement ? ' => { ' : ' => '}</span>
                        {returnStatement && <span className={styles.kwReturn}>return </span>}
                        {renderIncludesLine()}
                        <span className={styles.punct}>{' ? '}</span>
                        <span className={`${styles.paramName} ${vis.bodyPhase === 'skip' ? styles.tokenHighlightTrue : ''}`}>acc</span>
                        <span className={styles.punct}>{' : ['}</span>
                        <span className={`${vis.bodyPhase === 'add' ? styles.tokenHighlightFalse : ''}`}>
                            <span className={styles.punct}>{'...'}</span>
                            <span className={styles.paramName}>acc</span>
                            {renderAddValue()}
                        </span>
                        <span className={styles.punct}>]</span>
                        {returnStatement && <span className={styles.punct}>{'; }'}</span>}
                        <span className={styles.punct}>{','}</span>
                    </div>
                    <div className={styles.codeLine}>
                        <span className={styles.punct}>&nbsp;&nbsp;</span>
                        <span
                            ref={initialValueRef}
                            className={`${styles.punct} ${vis.highlightedToken === 'initial' ? styles.tokenHighlight : ''}`}
                        >[]</span>
                    </div>
                    <div className={styles.codeLine}>
                        <span className={styles.punct}>{');'}</span>
                    </div>
                </div>
            </div>

            {/* ---- Array Panel ---- */}
            <div className={styles.arrayPanel}>
                <span className={styles.arrayLabel}>data</span>
                <div className={styles.arrayElements}>
                    {DATA.map((val, i) => (
                        <div
                            key={i}
                            ref={el => { arrayElementRefs.current[i] = el; }}
                            className={`${styles.arrayElement} ${vis.highlightedArrayIndex === i ? styles.arrayElementHighlighted : ''} ${vis.isDone || (isRunning && vis.highlightedArrayIndex !== null && i < vis.highlightedArrayIndex) ? styles.arrayElementUsed : ''}`}
                        >
                            {val}
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
                        className={`${styles.accValue} ${vis.acc.length > 0 ? styles.accValueFilled : ''}`}
                    >
                        {vis.acc.length === 0 ? (
                            <span className={styles.emptyArr}>
                                {stepIndex < 0 ? (
                                    <span className={styles.statePlaceholder}>–</span>
                                ) : (
                                    <span key={vis.accArriveKey} className={styles.valueArrive}>[]</span>
                                )}
                            </span>
                        ) : (
                            <div className={styles.accChips}>
                                {vis.acc.map((n, i) => (
                                    <span
                                        key={`${n}-${i}`}
                                        className={`${styles.accChip} ${i === vis.acc.length - 1 ? styles.accChipNew : ''}`}
                                        style={i === vis.acc.length - 1 ? { animationName: 'chipPop', animationDuration: '0.4s' } as React.CSSProperties : undefined}
                                    >
                                        {n}
                                    </span>
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
                            <span key={vis.curArriveKey} className={styles.valueArrive}>{vis.cur}</span>
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
                        unique = <strong>[{vis.finalResult!.join(', ')}]</strong>
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
