import React, { useRef, useCallback } from 'react';
import { withMaximize } from '../shared/Maximizable';
import styles from './styles.module.css';
import { useReduceAnimation } from '../shared/useReduceAnimation';
import type { AnimationRefs, BadgeAnimation } from '../shared/useReduceAnimation';
import ReduceControls from '../shared/ReduceControls';
import FlyingBadgeDisplay from '../shared/FlyingBadgeDisplay';

// ---------------------------------------------------------------------------
// InteractiveFilterDedup — visualises how `filter` together with the `index`
// parameter removes duplicates from an array:
//
//   numbers.filter((value, index) => numbers.indexOf(value) === index)
//
// An element is kept only when its own index equals the index of the *first*
// occurrence of that value (indexOf). Duplicates therefore get rejected.
// ---------------------------------------------------------------------------

type Step =
    | { type: 'highlight-element'; index: number }
    | { type: 'move-to-param'; index: number; value: number }
    | { type: 'enter-body'; value: number; index: number }
    | { type: 'show-result'; value: number; index: number; firstIndex: number; passes: boolean }
    | { type: 'push-to-dest'; value: number }
    | { type: 'add-to-dest'; results: number[] }
    | { type: 'reject-element'; index: number }
    | { type: 'done'; result: number[] };

interface VisualState {
    highlightedSourceIndex: number | null;
    paramHighlighted: boolean;
    paramValue: number | null;
    paramIndex: number | null;
    valueArriveKey: number;
    bodyValue: number | null;
    bodyIndex: number | null;
    bodyFirstIndex: number | null;
    bodyPasses: boolean | null;
    rejectedIndices: number[];
    destResults: number[];
    isDone: boolean;
    finalResult: number[] | null;
}

const DATA = [3, 1, 3, 2, 1];

const STEP_DURATION: Record<Step['type'], number> = {
    'highlight-element': 600,
    'move-to-param': 800,
    'enter-body': 700,
    'show-result': 1100,
    'push-to-dest': 800,
    'add-to-dest': 400,
    'reject-element': 800,
    'done': 0,
};

function generateSteps(): Step[] {
    const steps: Step[] = [];
    const results: number[] = [];

    for (let i = 0; i < DATA.length; i++) {
        const value = DATA[i];
        const firstIndex = DATA.indexOf(value);
        const passes = firstIndex === i;
        steps.push({ type: 'highlight-element', index: i });
        steps.push({ type: 'move-to-param', index: i, value });
        steps.push({ type: 'enter-body', value, index: i });
        steps.push({ type: 'show-result', value, index: i, firstIndex, passes });
        if (passes) {
            steps.push({ type: 'push-to-dest', value });
            results.push(value);
            steps.push({ type: 'add-to-dest', results: [...results] });
        } else {
            steps.push({ type: 'reject-element', index: i });
        }
    }
    steps.push({ type: 'done', result: [...results] });
    return steps;
}

const STEPS = generateSteps();

function deriveVisualState(stepIndex: number): VisualState {
    const state: VisualState = {
        highlightedSourceIndex: null,
        paramHighlighted: false,
        paramValue: null,
        paramIndex: null,
        valueArriveKey: 0,
        bodyValue: null,
        bodyIndex: null,
        bodyFirstIndex: null,
        bodyPasses: null,
        rejectedIndices: [],
        destResults: [],
        isDone: false,
        finalResult: null,
    };
    if (stepIndex < 0) return state;

    for (let i = 0; i <= stepIndex; i++) {
        const step = STEPS[i];
        switch (step.type) {
            case 'highlight-element':
                state.highlightedSourceIndex = step.index;
                state.paramHighlighted = false;
                state.paramValue = null;
                state.paramIndex = null;
                state.bodyValue = null;
                state.bodyIndex = null;
                state.bodyFirstIndex = null;
                state.bodyPasses = null;
                break;
            case 'move-to-param':
                state.paramHighlighted = true;
                state.valueArriveKey = i;
                break;
            case 'enter-body':
                state.paramHighlighted = false;
                state.paramValue = step.value;
                state.paramIndex = step.index;
                state.bodyValue = step.value;
                state.bodyIndex = step.index;
                break;
            case 'show-result':
                state.bodyFirstIndex = step.firstIndex;
                state.bodyPasses = step.passes;
                break;
            case 'push-to-dest':
                break;
            case 'add-to-dest':
                state.destResults = [...step.results];
                state.bodyValue = null;
                state.bodyIndex = null;
                state.bodyFirstIndex = null;
                state.bodyPasses = null;
                state.paramValue = null;
                state.paramIndex = null;
                break;
            case 'reject-element':
                state.rejectedIndices = [...state.rejectedIndices, step.index];
                state.bodyValue = null;
                state.bodyIndex = null;
                state.bodyFirstIndex = null;
                state.bodyPasses = null;
                state.paramValue = null;
                state.paramIndex = null;
                break;
            case 'done':
                state.isDone = true;
                state.finalResult = step.result;
                break;
        }
    }
    return state;
}

function InteractiveFilterDedup() {
    const calcResultRef = useRef<HTMLSpanElement>(null);

    const getBadgeAnimation = useCallback((
        step: Step,
        { arrayElementRefs, accBoxRef, curBoxRef }: AnimationRefs,
    ): BadgeAnimation | null => {
        if (step.type === 'move-to-param')
            return {
                source: { current: arrayElementRefs.current[step.index] },
                dest: accBoxRef,
                value: String(step.value),
            };
        if (step.type === 'push-to-dest')
            return {
                source: calcResultRef,
                dest: curBoxRef,
                value: String(step.value),
            };
        return null;
    }, []);

    const {
        stepIndex, isPlaying, badge, isDone, isRunning,
        containerRef, accBoxRef, curBoxRef, arrayElementRefs,
        handleStart, handleStep, reset,
    } = useReduceAnimation({ steps: STEPS, stepDuration: STEP_DURATION, getBadgeAnimation });

    const vis = deriveVisualState(stepIndex);

    function getSourceClass(i: number) {
        const isHighlighted = vis.highlightedSourceIndex === i;
        const isRejected = vis.rejectedIndices.includes(i);
        const isProcessed = vis.isDone || (isRunning && vis.highlightedSourceIndex !== null && i < vis.highlightedSourceIndex);

        return [
            styles.arrayElement,
            isHighlighted ? styles.arrayElementHighlighted : '',
            isProcessed && isRejected ? styles.arrayElementRejected : '',
            isProcessed && !isRejected ? styles.arrayElementUsed : '',
        ].join(' ');
    }

    function renderBody() {
        if (vis.bodyValue === null) {
            return (
                <>
                    <span className={styles.varName}>numbers</span>
                    <span className={styles.punct}>.indexOf(</span>
                    <span className={styles.paramName}>value</span>
                    <span className={styles.punct}>) === </span>
                    <span className={styles.paramName}>index</span>
                </>
            );
        }
        return (
            <>
                <span className={styles.varName}>numbers</span>
                <span className={styles.punct}>.indexOf(</span>
                <span className={styles.substituted}>
                    <span key={`bv-${vis.valueArriveKey}`} className={styles.substitutedValue}>{vis.bodyValue}</span>
                </span>
                <span className={styles.punct}>)</span>
                {vis.bodyFirstIndex !== null && (
                    <>
                        <span className={styles.punct}> </span>
                        <span className={styles.muted}>/* = {vis.bodyFirstIndex} */</span>
                    </>
                )}
                <span className={styles.punct}> === </span>
                <span className={styles.substituted}>{vis.bodyIndex}</span>
                {vis.bodyPasses !== null && (
                    <span className={vis.bodyPasses ? styles.resultTrue : styles.resultFalse}>
                        {' = '}
                        <span ref={calcResultRef} className={styles.resultValue}>
                            {String(vis.bodyPasses)}
                        </span>
                    </span>
                )}
            </>
        );
    }

    return (
        <div className={styles.container} ref={containerRef}>
            {/* ---- Code Panel ---- */}
            <div className={styles.codePanel}>
                <div className={styles.codeHeader}>dedup.ts</div>
                <div className={styles.codeBody}>
                    <div className={styles.codeLine}>
                        <span className={styles.kwLet}>let</span>
                        {' '}
                        <span className={styles.varName}>numbers</span>
                        <span className={styles.punct}>: </span>
                        <span className={styles.typeName}>number</span>
                        <span className={styles.punct}>[] = [</span>
                        <span className={styles.numLit}>3, 1, 3, 2, 1</span>
                        <span className={styles.punct}>];</span>
                    </div>
                    <div className={styles.codeBlankLine}>&nbsp;</div>
                    <div className={styles.codeLine}>
                        <span className={styles.kwLet}>let</span>
                        {' '}
                        <span className={styles.varName}>uniek</span>
                        <span className={styles.punct}>{'[] = numbers.filter('}</span>
                        <div
                            ref={accBoxRef}
                            className={`${styles.paramArea} ${vis.paramHighlighted ? styles.tokenHighlight : ''}`}
                        >
                            <span className={styles.punct}>(</span>
                            {vis.paramValue !== null ? (
                                <>
                                    <span className={styles.substituted}>
                                        <span key={`pv-${vis.valueArriveKey}`} className={styles.substitutedValue}>
                                            {vis.paramValue}
                                        </span>
                                    </span>
                                    <span className={styles.punct}>, </span>
                                    <span className={styles.substituted}>{vis.paramIndex}</span>
                                </>
                            ) : (
                                <>
                                    <span className={styles.paramName}>value</span>
                                    <span className={styles.punct}>, </span>
                                    <span className={styles.paramName}>index</span>
                                </>
                            )}
                            <span className={styles.punct}>)</span>
                        </div>
                        <span className={styles.punct}>{' => '}</span>
                        <span className={vis.bodyValue !== null ? styles.bodyHighlight : ''}>
                            {renderBody()}
                        </span>
                        <span className={styles.punct}>{');'}</span>
                    </div>
                </div>
            </div>

            {/* ---- Two-column Array Panel ---- */}
            <div className={styles.columnsPanel}>
                {/* Source column */}
                <div className={styles.columnSection}>
                    <div className={styles.columnHeader}>numbers</div>
                    <div className={styles.columnElements}>
                        {DATA.map((val, i) => (
                            <div key={i} className={styles.elementWithIndex}>
                                <div
                                    ref={el => { arrayElementRefs.current[i] = el; }}
                                    className={getSourceClass(i)}
                                >
                                    {val}
                                </div>
                                <div className={styles.indexLabel}>{i}</div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Destination column */}
                <div className={styles.columnSection}>
                    <div className={styles.columnHeader}>uniek</div>
                    <div ref={curBoxRef} className={styles.columnElements}>
                        {vis.destResults.length === 0 ? (
                            <span className={styles.destPlaceholder}>–</span>
                        ) : (
                            vis.destResults.map((n, i) => (
                                <div
                                    key={`dest-${n}-${i}`}
                                    className={`${styles.destElement} ${i === vis.destResults.length - 1 ? styles.destElementNew : ''}`}
                                >
                                    {n}
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>

            {/* ---- Done result ---- */}
            {vis.isDone && (
                <div className={`${styles.resultPanel} ${styles.resultPanelDone}`}>
                    <span className={styles.resultDone}>
                        uniek = <strong>[{vis.finalResult!.join(', ')}]</strong>
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

export default withMaximize(InteractiveFilterDedup);
