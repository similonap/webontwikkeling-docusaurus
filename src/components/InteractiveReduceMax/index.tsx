import React, { useRef, useCallback } from 'react';
import styles from './styles.module.css';
import { useReduceAnimation } from '../shared/useReduceAnimation';
import type { AnimationRefs, BadgeAnimation } from '../shared/useReduceAnimation';
import ReduceControls from '../shared/ReduceControls';
import FlyingBadgeDisplay from '../shared/FlyingBadgeDisplay';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type MaxStep =
    | { type: 'code-dim' }
    | { type: 'highlight-first'; value: number }
    | { type: 'move-first-to-acc'; value: number }
    | { type: 'highlight-element'; index: number }
    | { type: 'move-to-cur'; index: number; value: number }
    | { type: 'show-compare'; cur: number; acc: number; result: boolean }
    | { type: 'show-cur-wins' }
    | { type: 'show-acc-wins' }
    | { type: 'update-acc'; acc: number }
    | { type: 'done'; result: number };

interface VisualState {
    codeDimmed: boolean;
    highlightedToken: 'acc-param' | 'cur-param' | null;
    highlightedArrayIndex: number | null;
    initialElement: boolean;
    acc: number | null;
    accArriveKey: number;
    cur: number | null;
    curArriveKey: number;
    bodyPhase: 'compare' | 'cur-wins' | 'acc-wins' | null;
    compareResult: boolean | null;
    isDone: boolean;
    finalResult: number | null;
}

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const NUMBERS = [1, 5, 3, -2, 5, 6];

const STEP_DURATION: Record<MaxStep['type'], number> = {
    'code-dim': 500,
    'highlight-first': 700,
    'move-first-to-acc': 800,
    'highlight-element': 700,
    'move-to-cur': 800,
    'show-compare': 1000,
    'show-cur-wins': 800,
    'show-acc-wins': 800,
    'update-acc': 700,
    'done': 0,
};

// ---------------------------------------------------------------------------
// Step generation
// ---------------------------------------------------------------------------

function generateSteps(): MaxStep[] {
    const steps: MaxStep[] = [];
    steps.push({ type: 'code-dim' });
    steps.push({ type: 'highlight-first', value: NUMBERS[0] });
    steps.push({ type: 'move-first-to-acc', value: NUMBERS[0] });

    let acc = NUMBERS[0];
    for (let i = 1; i < NUMBERS.length; i++) {
        const cur = NUMBERS[i];
        steps.push({ type: 'highlight-element', index: i });
        steps.push({ type: 'move-to-cur', index: i, value: cur });
        const result = cur > acc;
        steps.push({ type: 'show-compare', cur, acc, result });
        if (result) {
            steps.push({ type: 'show-cur-wins' });
            acc = cur;
        } else {
            steps.push({ type: 'show-acc-wins' });
        }
        steps.push({ type: 'update-acc', acc });
    }
    steps.push({ type: 'done', result: acc });
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
        initialElement: false,
        acc: null,
        accArriveKey: 0,
        cur: null,
        curArriveKey: 0,
        bodyPhase: null,
        compareResult: null,
        isDone: false,
        finalResult: null,
    };
    if (stepIndex < 0) return state;

    for (let i = 0; i <= stepIndex; i++) {
        const step = STEPS[i];
        switch (step.type) {
            case 'code-dim':
                state.codeDimmed = true;
                break;
            case 'highlight-first':
                state.highlightedArrayIndex = 0;
                state.initialElement = true;
                break;
            case 'move-first-to-acc':
                state.acc = step.value;
                state.accArriveKey = i;
                state.highlightedToken = 'acc-param';
                state.initialElement = false;
                break;
            case 'highlight-element':
                state.highlightedArrayIndex = step.index;
                state.initialElement = false;
                state.highlightedToken = null;
                state.bodyPhase = null;
                state.compareResult = null;
                break;
            case 'move-to-cur':
                state.cur = step.value;
                state.curArriveKey = i;
                state.highlightedToken = 'cur-param';
                break;
            case 'show-compare':
                state.bodyPhase = 'compare';
                state.compareResult = step.result;
                state.highlightedToken = null;
                break;
            case 'show-cur-wins':
                state.bodyPhase = 'cur-wins';
                break;
            case 'show-acc-wins':
                state.bodyPhase = 'acc-wins';
                break;
            case 'update-acc':
                state.acc = step.acc;
                state.accArriveKey = i;
                state.bodyPhase = null;
                state.compareResult = null;
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

export default function InteractiveReduceMax() {
    const accParamRef = useRef<HTMLSpanElement>(null);
    const curParamRef = useRef<HTMLSpanElement>(null);

    const getBadgeAnimation = useCallback((
        step: MaxStep,
        { arrayElementRefs, accBoxRef, curBoxRef }: AnimationRefs,
    ): BadgeAnimation | null => {
        if (step.type === 'move-first-to-acc')
            return { source: { current: arrayElementRefs.current[0] }, dest: accBoxRef, value: String(step.value) };
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

    function renderCompareLine() {
        if (vis.bodyPhase !== 'compare' || vis.cur === null || vis.acc === null) {
            return (
                <>
                    <span className={styles.paramName}>cur</span>
                    <span className={styles.punct}>{' > '}</span>
                    <span className={styles.paramName}>acc</span>
                </>
            );
        }
        return (
            <>
                <span className={styles.substituted}>
                    <span key={`cv-${vis.curArriveKey}`} className={styles.substitutedValue}>{vis.cur}</span>
                </span>
                <span className={styles.punct}>{' > '}</span>
                <span className={styles.substituted}>
                    <span key={`av-${vis.accArriveKey}`} className={styles.substitutedValue}>{vis.acc}</span>
                </span>
                <span className={vis.compareResult ? styles.resultTrue : styles.resultFalse}>
                    {' = '}
                    <span key={`cr-${vis.curArriveKey}`} className={styles.calcResultValue}>
                        {String(vis.compareResult)}
                    </span>
                </span>
            </>
        );
    }

    return (
        <div className={styles.container} ref={containerRef}>
            {/* ---- Code Panel ---- */}
            <div className={`${styles.codePanel} ${vis.codeDimmed ? styles.codeDimmed : ''}`}>
                <div className={styles.codeHeader}>reduce-max.ts</div>
                <div className={styles.codeBody}>
                    <div className={styles.codeLine}>
                        <span className={styles.kwLet}>let</span>
                        {' '}
                        <span className={styles.varName}>numbers</span>
                        <span className={styles.punct}>: </span>
                        <span className={styles.typeName}>number</span>
                        <span className={styles.punct}>[] = [</span>
                        <span className={styles.numLit}>1, 5, 3, -2, 5, 6</span>
                        <span className={styles.punct}>];</span>
                    </div>
                    <div className={styles.codeBlankLine}>&nbsp;</div>
                    <div className={styles.codeLine}>
                        <span className={styles.varName}>numbers</span>
                        <span className={styles.punct}>.reduce(</span>
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
                        <span className={styles.punct}>{') =>'}</span>
                    </div>
                    <div className={`${styles.codeLine} ${vis.bodyPhase === 'compare' ? styles.codeLineHighlight : ''}`}>
                        <span className={styles.punct}>&nbsp;&nbsp;&nbsp;&nbsp;</span>
                        {renderCompareLine()}
                    </div>
                    <div className={`${styles.codeLine} ${vis.bodyPhase === 'cur-wins' ? styles.codeLineHighlightWin : ''}`}>
                        <span className={styles.punct}>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>
                        <span className={styles.punct}>{'? '}</span>
                        <span className={styles.paramName}>cur</span>
                    </div>
                    <div className={`${styles.codeLine} ${vis.bodyPhase === 'acc-wins' ? styles.codeLineHighlightKeep : ''}`}>
                        <span className={styles.punct}>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>
                        <span className={styles.punct}>{'  : '}</span>
                        <span className={styles.paramName}>acc</span>
                    </div>
                    <div className={styles.codeLine}>
                        <span className={styles.punct}>{');'}</span>
                    </div>
                </div>
            </div>

            {/* ---- Array Panel ---- */}
            <div className={styles.arrayPanel}>
                <span className={styles.arrayLabel}>numbers</span>
                <div className={styles.arrayElements}>
                    {NUMBERS.map((val, i) => (
                        <div
                            key={i}
                            ref={el => { arrayElementRefs.current[i] = el; }}
                            className={[
                                styles.arrayElement,
                                vis.highlightedArrayIndex === i && vis.initialElement ? styles.arrayElementInitial : '',
                                vis.highlightedArrayIndex === i && !vis.initialElement ? styles.arrayElementHighlighted : '',
                                (vis.isDone || (isRunning && vis.highlightedArrayIndex !== null && i < vis.highlightedArrayIndex && !vis.initialElement)) ? styles.arrayElementUsed : '',
                            ].join(' ')}
                        >
                            {val}
                        </div>
                    ))}
                </div>
            </div>

            {/* ---- State Panel ---- */}
            <div className={styles.statePanel}>
                <div className={styles.stateBox}>
                    <div className={styles.stateLabel}>acc</div>
                    <div
                        ref={accBoxRef}
                        className={`${styles.stateValue} ${vis.acc !== null ? styles.stateValueFilled : ''} ${vis.bodyPhase === 'cur-wins' ? styles.stateValueWin : ''}`}
                    >
                        {vis.acc !== null ? (
                            <span key={vis.accArriveKey} className={styles.valueArrive}>{vis.acc}</span>
                        ) : (
                            <span className={styles.statePlaceholder}>–</span>
                        )}
                    </div>
                </div>
                <div className={styles.stateBox}>
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
                        max = <strong>{vis.finalResult}</strong>
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
