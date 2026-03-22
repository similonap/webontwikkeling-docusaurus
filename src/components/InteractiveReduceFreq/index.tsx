import React, { useRef, useCallback } from 'react';
import styles from './styles.module.css';
import { useReduceAnimation } from '../shared/useReduceAnimation';
import type { AnimationRefs, BadgeAnimation } from '../shared/useReduceAnimation';
import ReduceControls from '../shared/ReduceControls';
import FlyingBadgeDisplay from '../shared/FlyingBadgeDisplay';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type FreqStep =
    | { type: 'code-dim' }
    | { type: 'highlight-initial' }
    | { type: 'move-to-acc' }
    | { type: 'highlight-element'; index: number }
    | { type: 'move-to-cur'; index: number; cur: string }
    | { type: 'highlight-body' }
    | { type: 'show-lookup'; word: string; count: number }
    | { type: 'show-calc'; word: string; oldCount: number; newCount: number }
    | { type: 'update-acc'; word: string; newCount: number; acc: Record<string, number> }
    | { type: 'done'; result: Record<string, number> };

interface VisualState {
    codeDimmed: boolean;
    highlightedToken: 'initial' | 'acc-param' | 'cur-param' | null;
    highlightedArrayIndex: number | null;
    acc: Record<string, number>;
    accArriveKey: number;
    cur: string | null;
    curArriveKey: number;
    bodyHighlighted: boolean;
    lookupWord: string | null;
    lookupCount: number | null;
    calcNewCount: number | null;
    lastUpdatedKey: string | null;
    lastUpdatedKeyId: number;
    isDone: boolean;
    finalResult: Record<string, number> | null;
}

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const LETTERS = ['a', 'b', 'a', 'c', 'b', 'a', 'd', 'c', 'b', 'd'];

const STEP_DURATION: Record<FreqStep['type'], number> = {
    'code-dim': 500,
    'highlight-initial': 700,
    'move-to-acc': 800,
    'highlight-element': 700,
    'move-to-cur': 800,
    'highlight-body': 600,
    'show-lookup': 900,
    'show-calc': 900,
    'update-acc': 700,
    'done': 0,
};

// ---------------------------------------------------------------------------
// Step generation
// ---------------------------------------------------------------------------

function generateSteps(): FreqStep[] {
    const steps: FreqStep[] = [];
    steps.push({ type: 'code-dim' });
    steps.push({ type: 'highlight-initial' });
    steps.push({ type: 'move-to-acc' });

    const acc: Record<string, number> = {};
    for (let i = 0; i < LETTERS.length; i++) {
        const cur = LETTERS[i];
        steps.push({ type: 'highlight-element', index: i });
        steps.push({ type: 'move-to-cur', index: i, cur });
        steps.push({ type: 'highlight-body' });
        const currentCount = acc[cur] ?? 0;
        steps.push({ type: 'show-lookup', word: cur, count: currentCount });
        const newCount = currentCount + 1;
        steps.push({ type: 'show-calc', word: cur, oldCount: currentCount, newCount });
        acc[cur] = newCount;
        steps.push({ type: 'update-acc', word: cur, newCount, acc: { ...acc } });
    }
    steps.push({ type: 'done', result: { ...acc } });
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
        bodyHighlighted: false,
        lookupWord: null,
        lookupCount: null,
        calcNewCount: null,
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
                state.bodyHighlighted = false;
                state.lookupWord = null;
                state.lookupCount = null;
                state.calcNewCount = null;
                break;
            case 'move-to-cur':
                state.cur = step.cur;
                state.curArriveKey = i;
                state.highlightedToken = 'cur-param';
                break;
            case 'highlight-body':
                state.bodyHighlighted = true;
                state.highlightedToken = null;
                state.lookupWord = null;
                state.lookupCount = null;
                state.calcNewCount = null;
                break;
            case 'show-lookup':
                state.lookupWord = step.word;
                state.lookupCount = step.count;
                state.calcNewCount = null;
                break;
            case 'show-calc':
                state.lookupWord = step.word;
                state.lookupCount = step.oldCount;
                state.calcNewCount = step.newCount;
                break;
            case 'update-acc':
                state.acc = { ...step.acc };
                state.accArriveKey = i;
                state.lastUpdatedKey = step.word;
                state.lastUpdatedKeyId = i;
                state.bodyHighlighted = false;
                state.lookupWord = null;
                state.lookupCount = null;
                state.calcNewCount = null;
                break;
            case 'done':
                state.isDone = true;
                state.finalResult = step.result;
                state.highlightedToken = null;
                state.bodyHighlighted = false;
                break;
        }
    }
    return state;
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export default function InteractiveReduceFreq() {
    const initialValueRef = useRef<HTMLSpanElement>(null);
    const accParamRef = useRef<HTMLSpanElement>(null);
    const curParamRef = useRef<HTMLSpanElement>(null);

    const getBadgeAnimation = useCallback((
        step: FreqStep,
        { arrayElementRefs, accBoxRef, curBoxRef }: AnimationRefs,
    ): BadgeAnimation | null => {
        if (step.type === 'move-to-acc')
            return { source: initialValueRef, dest: accBoxRef, value: '{}' };
        if (step.type === 'move-to-cur')
            return { source: { current: arrayElementRefs.current[step.index] }, dest: curBoxRef, value: step.cur };
        return null;
    }, []);

    const {
        stepIndex, isPlaying, badge, isDone, isRunning,
        containerRef, accBoxRef, curBoxRef, arrayElementRefs,
        handleStart, handleStep, reset,
    } = useReduceAnimation({ steps: STEPS, stepDuration: STEP_DURATION, getBadgeAnimation });

    const vis = deriveVisualState(stepIndex);
    const accEntries = Object.entries(vis.acc);

    const formatResult = (result: Record<string, number>) =>
        '{ ' + Object.entries(result).map(([k, v]) => `${k}: ${v}`).join(', ') + ' }';

    function renderBodyLine() {
        if (vis.lookupWord === null) {
            return (
                <>
                    <span className={styles.paramName}>acc</span>
                    <span className={styles.punct}>[</span>
                    <span className={styles.paramName}>cur</span>
                    <span className={styles.punct}>] = (</span>
                    <span className={styles.paramName}>acc</span>
                    <span className={styles.punct}>[</span>
                    <span className={styles.paramName}>cur</span>
                    <span className={styles.punct}>] ?? 0) + 1;</span>
                </>
            );
        }
        const wordStr = `"${vis.lookupWord}"`;
        const countStr = String(vis.lookupCount ?? 0);
        return (
            <>
                <span className={styles.paramName}>acc</span>
                <span className={styles.punct}>[</span>
                <span className={styles.substituted}>
                    <span key={`wk-${vis.curArriveKey}`} className={styles.substitutedValue}>{wordStr}</span>
                </span>
                <span className={styles.punct}>] = (</span>
                <span className={styles.substituted}>
                    <span key={`lk-${vis.lookupCount}-${vis.lookupWord}`} className={styles.substitutedValue}>{countStr}</span>
                </span>
                <span className={styles.punct}> ?? 0) + 1</span>
                {vis.calcNewCount !== null && (
                    <span className={styles.calcResult}>
                        {' = '}
                        <span key={`ck-${vis.calcNewCount}`} className={styles.calcResultValue}>{vis.calcNewCount}</span>
                    </span>
                )}
                <span className={styles.punct}>;</span>
            </>
        );
    }

    return (
        <div className={styles.container} ref={containerRef}>
            {/* ---- Code Panel ---- */}
            <div className={`${styles.codePanel} ${vis.codeDimmed ? styles.codeDimmed : ''}`}>
                <div className={styles.codeHeader}>reduce-freq.ts</div>
                <div className={styles.codeBody}>
                    <div className={styles.codeLine}>
                        <span className={styles.kwConst}>const</span>
                        {' '}
                        <span className={styles.varName}>letters</span>
                        <span className={styles.punct}>: </span>
                        <span className={styles.typeName}>string</span>
                        <span className={styles.punct}>[] = [</span>
                        <span className={styles.strLit}>{'\'a\', \'b\', \'a\', \'c\', \'b\', \'a\', \'d\', \'c\', \'b\', \'d\''}</span>
                        <span className={styles.punct}>];</span>
                    </div>
                    <div className={styles.codeBlankLine}>&nbsp;</div>
                    <div className={styles.codeLine}>
                        <span className={styles.kwConst}>const</span>
                        {' '}
                        <span className={styles.varName}>freq</span>
                        <span className={styles.punct}>{' = letters.reduce<'}</span>
                        <span className={styles.typeName}>Record</span>
                        <span className={styles.punct}>{'<'}</span>
                        <span className={styles.typeName}>string</span>
                        <span className={styles.punct}>{', '}</span>
                        <span className={styles.typeName}>number</span>
                        <span className={styles.punct}>{'>>('}
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
                    <div className={`${styles.codeLine} ${vis.bodyHighlighted ? styles.codeLineHighlight : ''}`}>
                        <span className={styles.punct}>&nbsp;&nbsp;&nbsp;&nbsp;</span>
                        {renderBodyLine()}
                    </div>
                    <div className={`${styles.codeLine} ${vis.bodyHighlighted ? styles.codeLineHighlight : ''}`}>
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
                <span className={styles.arrayLabel}>letters</span>
                <div className={styles.arrayElements}>
                    {LETTERS.map((w, i) => (
                        <div
                            key={i}
                            ref={el => { arrayElementRefs.current[i] = el; }}
                            className={`${styles.arrayElement} ${vis.highlightedArrayIndex === i ? styles.arrayElementHighlighted : ''} ${vis.isDone || (isRunning && vis.highlightedArrayIndex !== null && i < vis.highlightedArrayIndex) ? styles.arrayElementUsed : ''}`}
                        >
                            {w}
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
                                {accEntries.map(([key, count]) => (
                                    <div
                                        key={key}
                                        className={`${styles.accRow} ${vis.lastUpdatedKey === key ? styles.accRowUpdated : ''}`}
                                        style={vis.lastUpdatedKey === key ? { animationName: `rowPulse`, animationDuration: '0.5s' } as React.CSSProperties : undefined}
                                    >
                                        <span className={styles.accKey}>{key}</span>
                                        <span className={styles.accColon}>:</span>
                                        <span
                                            className={styles.accCount}
                                            key={`${key}-${count}-${vis.lastUpdatedKeyId}`}
                                        >
                                            {count}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
                <div className={styles.wordBox}>
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
                        freq = <strong>{formatResult(vis.finalResult!)}</strong>
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
