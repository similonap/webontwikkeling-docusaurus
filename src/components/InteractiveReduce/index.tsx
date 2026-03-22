import React, { useRef, useCallback } from 'react';
import styles from './styles.module.css';
import { useReduceAnimation } from '../shared/useReduceAnimation';
import type { AnimationRefs, BadgeAnimation } from '../shared/useReduceAnimation';
import ReduceControls from '../shared/ReduceControls';
import FlyingBadgeDisplay from '../shared/FlyingBadgeDisplay';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type ReduceStep =
    | { type: 'code-dim' }
    | { type: 'highlight-initial'; value: number }
    | { type: 'move-to-acc'; value: number }
    | { type: 'highlight-element'; index: number }
    | { type: 'move-to-cur'; index: number; value: number }
    | { type: 'highlight-return' }
    | { type: 'move-acc-to-result'; acc: number }
    | { type: 'move-cur-to-result'; cur: number }
    | { type: 'show-calculation'; acc: number; cur: number; result: number }
    | { type: 'move-result-to-acc'; result: number }
    | { type: 'done'; result: number };

interface VisualState {
    codeDimmed: boolean;
    highlightedToken: 'initial' | 'acc-param' | 'cur-param' | 'return-line' | null;
    highlightedArrayIndex: number | null;
    acc: number | null;
    accArriveKey: number;
    cur: number | null;
    curArriveKey: number;
    returnAccValue: number | null;
    returnCurValue: number | null;
    returnResult: number | null;
    isDone: boolean;
    finalResult: number | null;
}

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const ARRAY = [1, 2, 3, 4, 5];
const INITIAL_VALUE = 0;
const REDUCER = (acc: number, cur: number) => acc + cur;

const STEP_DURATION: Record<ReduceStep['type'], number> = {
    'code-dim': 500,
    'highlight-initial': 700,
    'move-to-acc': 800,
    'highlight-element': 700,
    'move-to-cur': 800,
    'highlight-return': 600,
    'move-acc-to-result': 800,
    'move-cur-to-result': 800,
    'show-calculation': 1000,
    'move-result-to-acc': 800,
    'done': 0,
};

// ---------------------------------------------------------------------------
// Step generation
// ---------------------------------------------------------------------------

function generateSteps(): ReduceStep[] {
    const steps: ReduceStep[] = [];
    steps.push({ type: 'code-dim' });
    steps.push({ type: 'highlight-initial', value: INITIAL_VALUE });
    steps.push({ type: 'move-to-acc', value: INITIAL_VALUE });

    let acc = INITIAL_VALUE;
    for (let i = 0; i < ARRAY.length; i++) {
        const cur = ARRAY[i];
        steps.push({ type: 'highlight-element', index: i });
        steps.push({ type: 'move-to-cur', index: i, value: cur });
        steps.push({ type: 'highlight-return' });
        steps.push({ type: 'move-acc-to-result', acc });
        steps.push({ type: 'move-cur-to-result', cur });
        const result = REDUCER(acc, cur);
        steps.push({ type: 'show-calculation', acc, cur, result });
        steps.push({ type: 'move-result-to-acc', result });
        acc = result;
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
        acc: null,
        accArriveKey: 0,
        cur: null,
        curArriveKey: 0,
        returnAccValue: null,
        returnCurValue: null,
        returnResult: null,
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
                state.acc = step.value;
                state.accArriveKey = i;
                state.highlightedToken = 'acc-param';
                break;
            case 'highlight-element':
                state.highlightedArrayIndex = step.index;
                state.highlightedToken = null;
                break;
            case 'move-to-cur':
                state.cur = step.value;
                state.curArriveKey = i;
                state.highlightedToken = 'cur-param';
                break;
            case 'highlight-return':
                state.highlightedToken = 'return-line';
                state.returnAccValue = null;
                state.returnCurValue = null;
                state.returnResult = null;
                break;
            case 'move-acc-to-result':
                state.highlightedToken = 'return-line';
                state.returnAccValue = step.acc;
                break;
            case 'move-cur-to-result':
                state.highlightedToken = 'return-line';
                state.returnCurValue = step.cur;
                break;
            case 'show-calculation':
                state.highlightedToken = 'return-line';
                state.returnResult = step.result;
                break;
            case 'move-result-to-acc':
                state.acc = step.result;
                state.accArriveKey = i;
                state.returnAccValue = null;
                state.returnCurValue = null;
                state.returnResult = null;
                state.highlightedToken = 'acc-param';
                break;
            case 'done':
                state.isDone = true;
                state.finalResult = step.result;
                state.highlightedToken = null;
                break;
        }
    }
    return state;
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export default function InteractiveReduce() {
    const initialValueRef = useRef<HTMLSpanElement>(null);
    const accParamRef = useRef<HTMLSpanElement>(null);
    const curParamRef = useRef<HTMLSpanElement>(null);
    const accInReturnRef = useRef<HTMLSpanElement>(null);
    const curInReturnRef = useRef<HTMLSpanElement>(null);
    const returnResultRef = useRef<HTMLSpanElement>(null);

    const getBadgeAnimation = useCallback((
        step: ReduceStep,
        { arrayElementRefs, accBoxRef, curBoxRef }: AnimationRefs,
    ): BadgeAnimation | null => {
        if (step.type === 'move-to-acc')
            return { source: initialValueRef, dest: accBoxRef, value: String(step.value) };
        if (step.type === 'move-to-cur')
            return { source: { current: arrayElementRefs.current[step.index] }, dest: curBoxRef, value: String(step.value) };
        if (step.type === 'move-acc-to-result')
            return { source: accBoxRef, dest: accInReturnRef, value: String(step.acc) };
        if (step.type === 'move-cur-to-result')
            return { source: curBoxRef, dest: curInReturnRef, value: String(step.cur) };
        if (step.type === 'move-result-to-acc')
            return { source: returnResultRef, dest: accBoxRef, value: String(step.result) };
        return null;
    }, []);

    const {
        stepIndex, isPlaying, badge, isDone, isRunning,
        containerRef, accBoxRef, curBoxRef, arrayElementRefs,
        handleStart, handleStep, reset,
    } = useReduceAnimation({ steps: STEPS, stepDuration: STEP_DURATION, getBadgeAnimation });

    const vis = deriveVisualState(stepIndex);
    const returnLineHighlighted = vis.highlightedToken === 'return-line';

    return (
        <div className={styles.container} ref={containerRef}>
            {/* ---- Code Panel ---- */}
            <div className={`${styles.codePanel} ${vis.codeDimmed ? styles.codeDimmed : ''}`}>
                <div className={styles.codeHeader}>reduce.ts</div>
                <div className={styles.codeBody}>
                    <div className={styles.codeLine}>
                        <span className={styles.kwConst}>const</span>
                        {' '}
                        <span className={styles.varName}>numbers</span>
                        <span className={styles.punct}>: </span>
                        <span className={styles.typeName}>number</span>
                        <span className={styles.punct}>[] = [</span>
                        <span className={styles.numLit}>1, 2, 3, 4, 5</span>
                        <span className={styles.punct}>];</span>
                    </div>
                    <div className={styles.codeBlankLine}>&nbsp;</div>
                    <div className={styles.codeLine}>
                        <span className={styles.kwConst}>const</span>
                        {' '}
                        <span className={styles.varName}>sum</span>
                        <span className={styles.punct}>: </span>
                        <span className={styles.typeName}>number</span>
                        <span className={styles.punct}>{' = numbers.reduce('}</span>
                    </div>
                    <div className={styles.codeLine}>
                        <span className={styles.punct}>&nbsp;&nbsp;{'('}</span>
                        <span
                            ref={accParamRef}
                            className={`${styles.paramName} ${vis.highlightedToken === 'acc-param' ? styles.tokenHighlight : ''}`}
                        >acc</span>
                        <span className={styles.punct}>: </span>
                        <span className={styles.typeName}>number</span>
                        <span className={styles.punct}>{', '}</span>
                        <span
                            ref={curParamRef}
                            className={`${styles.paramName} ${vis.highlightedToken === 'cur-param' ? styles.tokenHighlight : ''}`}
                        >cur</span>
                        <span className={styles.punct}>: </span>
                        <span className={styles.typeName}>number</span>
                        <span className={styles.punct}>{') => {'}</span>
                    </div>
                    <div className={`${styles.codeLine} ${returnLineHighlighted ? styles.codeLineHighlight : ''}`}>
                        <span className={styles.kwReturn}>&nbsp;&nbsp;&nbsp;&nbsp;return</span>
                        {' '}
                        <span
                            ref={accInReturnRef}
                            className={`${vis.returnAccValue !== null ? styles.returnSubstituted : styles.returnPart}`}
                        >
                            {vis.returnAccValue !== null
                                ? <span key={`ra-${vis.returnAccValue}`} className={styles.substitutedValue}>{vis.returnAccValue}</span>
                                : 'acc'}
                        </span>
                        <span className={`${styles.punct} ${returnLineHighlighted ? styles.returnOpHighlight : ''}`}>{' + '}</span>
                        <span
                            ref={curInReturnRef}
                            className={`${vis.returnCurValue !== null ? styles.returnSubstituted : styles.returnPart}`}
                        >
                            {vis.returnCurValue !== null
                                ? <span key={`ri-${vis.returnCurValue}`} className={styles.substitutedValue}>{vis.returnCurValue}</span>
                                : 'cur'}
                        </span>
                        {vis.returnResult !== null && (
                            <span ref={returnResultRef} className={styles.returnResultInline}>
                                {' = '}
                                <span key={`rr-${vis.returnResult}`} className={styles.returnResultValue}>{vis.returnResult}</span>
                            </span>
                        )}
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
                            className={`${styles.numLit} ${vis.highlightedToken === 'initial' ? styles.tokenHighlight : ''}`}
                        >0</span>
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
                    {ARRAY.map((val, i) => (
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
                <div className={styles.stateBox}>
                    <div className={styles.stateLabel}>acc</div>
                    <div
                        ref={accBoxRef}
                        className={`${styles.stateValue} ${vis.acc !== null ? styles.stateValueFilled : ''}`}
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
                        sum = <strong>{vis.finalResult}</strong>
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
