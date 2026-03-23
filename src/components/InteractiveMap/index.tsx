import React, { useRef, useCallback, useState } from 'react';
import styles from './styles.module.css';
import { useReduceAnimation } from '../shared/useReduceAnimation';
import type { AnimationRefs, BadgeAnimation } from '../shared/useReduceAnimation';
import ReduceControls from '../shared/ReduceControls';
import FlyingBadgeDisplay from '../shared/FlyingBadgeDisplay';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type MapStep =
    | { type: 'highlight-element'; index: number }
    | { type: 'move-to-param'; index: number; value: number }
    | { type: 'enter-body'; value: number }
    | { type: 'show-result'; result: number }
    | { type: 'push-to-dest'; index: number; result: number }
    | { type: 'add-to-dest'; index: number; result: number }
    | { type: 'done'; result: number[] };

interface VisualState {
    highlightedSourceIndex: number | null;
    paramHighlighted: boolean;
    paramValue: number | null;
    valueArriveKey: number;
    bodyValue: number | null;
    bodyResult: number | null;
    destResults: (number | null)[];
    lastFilledIndex: number;
    isDone: boolean;
    finalResult: number[] | null;
}

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const DATA = [1, 2, 3, 4, 5];

const STEP_DURATION: Record<MapStep['type'], number> = {
    'highlight-element': 600,
    'move-to-param': 800,
    'enter-body': 700,
    'show-result': 900,
    'push-to-dest': 800,
    'add-to-dest': 400,
    'done': 0,
};

// ---------------------------------------------------------------------------
// Step generation
// ---------------------------------------------------------------------------

function generateSteps(): MapStep[] {
    const steps: MapStep[] = [];

    for (let i = 0; i < DATA.length; i++) {
        const value = DATA[i];
        const result = value * 2;
        steps.push({ type: 'highlight-element', index: i });
        steps.push({ type: 'move-to-param', index: i, value });
        steps.push({ type: 'enter-body', value });
        steps.push({ type: 'show-result', result });
        steps.push({ type: 'push-to-dest', index: i, result });
        steps.push({ type: 'add-to-dest', index: i, result });
    }
    steps.push({ type: 'done', result: DATA.map(v => v * 2) });
    return steps;
}

const STEPS = generateSteps();

// ---------------------------------------------------------------------------
// Visual state derivation
// ---------------------------------------------------------------------------

function deriveVisualState(stepIndex: number): VisualState {
    const state: VisualState = {
        highlightedSourceIndex: null,
        paramHighlighted: false,
        paramValue: null,
        valueArriveKey: 0,
        bodyValue: null,
        bodyResult: null,
        destResults: Array(DATA.length).fill(null),
        lastFilledIndex: -1,
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
                state.bodyValue = null;
                state.bodyResult = null;
                break;
            case 'move-to-param':
                // badge is flying — don't replace "element" yet
                state.paramHighlighted = true;
                state.valueArriveKey = i;
                break;
            case 'enter-body':
                // badge has landed — now replace "element" with the value
                state.paramHighlighted = false;
                state.paramValue = step.value;
                state.bodyValue = step.value;
                break;
            case 'show-result':
                state.bodyResult = step.result;
                break;
            case 'push-to-dest':
                break;
            case 'add-to-dest': {
                const newResults = [...state.destResults];
                newResults[step.index] = step.result;
                state.destResults = newResults;
                state.lastFilledIndex = step.index;
                state.bodyValue = null;
                state.bodyResult = null;
                state.paramValue = null;
                break;
            }
            case 'done':
                state.isDone = true;
                state.finalResult = step.result;
                break;
        }
    }
    return state;
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export default function InteractiveMap() {
    const [typeInference, setTypeInference] = useState(false);
    const [returnStatement, setReturnStatement] = useState(false);

    const calcResultRef = useRef<HTMLSpanElement>(null);
    // One ref per dest slot so the badge can fly to the exact target block
    const destElementRefs = useRef<(HTMLDivElement | null)[]>([]);

    const getBadgeAnimation = useCallback((
        step: MapStep,
        { arrayElementRefs, accBoxRef }: AnimationRefs,
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
                dest: { current: destElementRefs.current[step.index] },
                value: String(step.result),
            };
        return null;
    }, []);

    const {
        stepIndex, isPlaying, badge, isDone, isRunning,
        containerRef, accBoxRef, arrayElementRefs,
        handleStart, handleStep, reset,
    } = useReduceAnimation({ steps: STEPS, stepDuration: STEP_DURATION, getBadgeAnimation });

    const vis = deriveVisualState(stepIndex);

    function renderBody() {
        if (vis.bodyValue === null) {
            return (
                <>
                    <span className={styles.paramName}>element</span>
                    <span className={styles.punct}> * </span>
                    <span className={styles.numLit}>2</span>
                </>
            );
        }
        return (
            <>
                <span className={styles.substituted}>
                    <span key={`body-${vis.valueArriveKey}`} className={styles.substitutedValue}>{vis.bodyValue}</span>
                </span>
                <span className={styles.punct}> * </span>
                <span className={styles.numLit}>2</span>
                {vis.bodyResult !== null && (
                    <span className={styles.calcResultInline}>
                        {' = '}
                        <span ref={calcResultRef} className={styles.calcResultValue}>{vis.bodyResult}</span>
                    </span>
                )}
            </>
        );
    }

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
            <div className={styles.codePanel}>
                <div className={styles.codeHeader}>map-doubled.ts</div>
                <div className={styles.codeBody}>
                    <div className={styles.codeLine}>
                        <span className={styles.kwLet}>let</span>
                        {' '}
                        <span className={styles.varName}>numbers</span>
                        {!typeInference && (
                            <>
                                <span className={styles.punct}>: </span>
                                <span className={styles.typeName}>number</span>
                                <span className={styles.punct}>[]</span>
                            </>
                        )}
                        <span className={styles.punct}>{' = ['}</span>
                        <span className={styles.numLit}>1, 2, 3, 4, 5</span>
                        <span className={styles.punct}>];</span>
                    </div>
                    <div className={styles.codeBlankLine}>&nbsp;</div>
                    <div className={styles.codeLine}>
                        <span className={styles.kwLet}>let</span>
                        {' '}
                        <span className={styles.varName}>doubled</span>
                        {!typeInference && (
                            <>
                                <span className={styles.punct}>: </span>
                                <span className={styles.typeName}>number</span>
                                <span className={styles.punct}>[]</span>
                            </>
                        )}
                        <span className={styles.punct}>{' = numbers.map('}</span>
                        {/* accBoxRef on this div — badge lands here when value flies to param */}
                        <div
                            ref={accBoxRef}
                            className={`${styles.paramArea} ${vis.paramHighlighted ? styles.tokenHighlight : ''}`}
                        >
                            <span className={styles.punct}>(</span>
                            {vis.paramValue !== null ? (
                                <span className={styles.substituted}>
                                    <span key={`param-${vis.valueArriveKey}`} className={styles.substitutedValue}>
                                        {vis.paramValue}
                                    </span>
                                </span>
                            ) : (
                                <>
                                    <span className={styles.paramName}>element</span>
                                    {!typeInference && (
                                        <>
                                            <span className={styles.punct}>: </span>
                                            <span className={styles.typeName}>number</span>
                                        </>
                                    )}
                                </>
                            )}
                            <span className={styles.punct}>)</span>
                        </div>
                        {!typeInference && (
                            <>
                                <span className={styles.punct}>: </span>
                                <span className={styles.typeName}>number</span>
                            </>
                        )}
                        <span className={styles.punct}>{returnStatement ? ' => {' : ' => '}</span>
                        {returnStatement && <span className={styles.kwLet}>{' return '}</span>}
                        <span className={vis.bodyValue !== null ? styles.bodyHighlight : ''}>
                            {renderBody()}
                        </span>
                        {returnStatement && <span className={styles.punct}>{'; }'}</span>}
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
                            <div
                                key={i}
                                ref={el => { arrayElementRefs.current[i] = el; }}
                                className={[
                                    styles.arrayElement,
                                    vis.highlightedSourceIndex === i ? styles.arrayElementHighlighted : '',
                                    (vis.isDone || (isRunning && vis.highlightedSourceIndex !== null && i < vis.highlightedSourceIndex))
                                        ? styles.arrayElementUsed : '',
                                ].join(' ')}
                            >
                                {val}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Destination column — pre-populated with placeholders */}
                <div className={styles.columnSection}>
                    <div className={styles.columnHeader}>doubled</div>
                    <div className={styles.columnElements}>
                        {vis.destResults.map((n, i) =>
                            n === null ? (
                                <div
                                    key={`empty-${i}`}
                                    ref={el => { destElementRefs.current[i] = el; }}
                                    className={styles.destElementEmpty}
                                />
                            ) : (
                                <div
                                    key={`filled-${i}`}
                                    ref={el => { destElementRefs.current[i] = el; }}
                                    className={`${styles.destElement} ${styles.destElementNew}`}
                                >
                                    {n}
                                </div>
                            )
                        )}
                    </div>
                </div>
            </div>

            {/* ---- Done result ---- */}
            {vis.isDone && (
                <div className={`${styles.resultPanel} ${styles.resultPanelDone}`}>
                    <span className={styles.resultDone}>
                        doubled = <strong>[{vis.finalResult!.join(', ')}]</strong>
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
