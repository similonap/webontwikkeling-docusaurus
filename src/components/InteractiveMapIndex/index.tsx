import React, { useRef, useCallback, useState } from 'react';
import styles from './styles.module.css';
import { useReduceAnimation } from '../shared/useReduceAnimation';
import type { AnimationRefs, BadgeAnimation } from '../shared/useReduceAnimation';
import ReduceControls from '../shared/ReduceControls';
import FlyingBadgeDisplay from '../shared/FlyingBadgeDisplay';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type MapIndexStep =
    | { type: 'highlight-element'; index: number }
    | { type: 'move-to-param'; index: number; value: string }
    | { type: 'enter-body'; index: number; value: string }
    | { type: 'show-result'; index: number; value: string; result: string }
    | { type: 'push-to-dest'; index: number; result: string }
    | { type: 'add-to-dest'; index: number; result: string }
    | { type: 'done'; result: string[] };

interface VisualState {
    highlightedSourceIndex: number | null;
    paramHighlighted: boolean;
    paramTaakValue: string | null;
    paramIndexValue: number | null;
    valueArriveKey: number;
    bodyTaakValue: string | null;
    bodyIndexValue: number | null;
    bodyResult: string | null;
    destResults: (string | null)[];
    isDone: boolean;
    finalResult: string[] | null;
}

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const DATA: string[] = ['Afwassen', 'Stofzuigen', 'Gras maaien'];

const STEP_DURATION: Record<MapIndexStep['type'], number> = {
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

function generateSteps(): MapIndexStep[] {
    const steps: MapIndexStep[] = [];
    for (let i = 0; i < DATA.length; i++) {
        const value = DATA[i];
        const result = `Taak ${i + 1}: ${value}`;
        steps.push({ type: 'highlight-element', index: i });
        steps.push({ type: 'move-to-param', index: i, value });
        steps.push({ type: 'enter-body', index: i, value });
        steps.push({ type: 'show-result', index: i, value, result });
        steps.push({ type: 'push-to-dest', index: i, result });
        steps.push({ type: 'add-to-dest', index: i, result });
    }
    steps.push({ type: 'done', result: DATA.map((v, i) => `Taak ${i + 1}: ${v}`) });
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
        paramTaakValue: null,
        paramIndexValue: null,
        valueArriveKey: 0,
        bodyTaakValue: null,
        bodyIndexValue: null,
        bodyResult: null,
        destResults: Array(DATA.length).fill(null),
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
                state.paramTaakValue = null;
                state.paramIndexValue = null;
                state.bodyTaakValue = null;
                state.bodyIndexValue = null;
                state.bodyResult = null;
                break;
            case 'move-to-param':
                state.paramHighlighted = true;
                state.valueArriveKey = i;
                break;
            case 'enter-body':
                state.paramHighlighted = false;
                state.paramTaakValue = step.value;
                state.paramIndexValue = step.index;
                state.bodyTaakValue = step.value;
                state.bodyIndexValue = step.index;
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
                state.bodyTaakValue = null;
                state.bodyIndexValue = null;
                state.bodyResult = null;
                state.paramTaakValue = null;
                state.paramIndexValue = null;
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

export default function InteractiveMapIndex() {
    const [typeInference, setTypeInference] = useState(false);
    const [returnStatement, setReturnStatement] = useState(false);

    const calcResultRef = useRef<HTMLSpanElement>(null);
    const destElementRefs = useRef<(HTMLDivElement | null)[]>([]);

    const getBadgeAnimation = useCallback((
        step: MapIndexStep,
        { arrayElementRefs, accBoxRef }: AnimationRefs,
    ): BadgeAnimation | null => {
        if (step.type === 'move-to-param')
            return {
                source: { current: arrayElementRefs.current[step.index] },
                dest: accBoxRef,
                value: `"${step.value}"`,
            };
        if (step.type === 'push-to-dest')
            return {
                source: calcResultRef,
                dest: { current: destElementRefs.current[step.index] },
                value: `"${step.result}"`,
            };
        return null;
    }, []);

    const {
        stepIndex, isPlaying, badge, isDone, isRunning,
        containerRef, accBoxRef, arrayElementRefs,
        handleStart, handleStep, reset,
    } = useReduceAnimation({ steps: STEPS, stepDuration: STEP_DURATION, getBadgeAnimation });

    const vis = deriveVisualState(stepIndex);

    function renderParam() {
        if (vis.paramTaakValue === null) {
            return (
                <>
                    <span className={styles.paramName}>taak</span>
                    {!typeInference && (
                        <>
                            <span className={styles.punct}>: </span>
                            <span className={styles.typeName}>string</span>
                        </>
                    )}
                    <span className={styles.punct}>, </span>
                    <span className={styles.paramName}>index</span>
                    {!typeInference && (
                        <>
                            <span className={styles.punct}>: </span>
                            <span className={styles.typeName}>number</span>
                        </>
                    )}
                </>
            );
        }
        return (
            <span className={styles.substituted}>
                <span key={`param-${vis.valueArriveKey}`} className={styles.substitutedValue}>
                    "{vis.paramTaakValue}", {vis.paramIndexValue}
                </span>
            </span>
        );
    }

    function renderBody() {
        if (vis.bodyTaakValue === null) {
            return (
                <>
                    <span className={styles.strLit}>`Taak </span>
                    <span className={styles.punct}>{'${'}</span>
                    <span className={styles.paramName}>index</span>
                    <span className={styles.punct}>{' + '}</span>
                    <span className={styles.numLit}>1</span>
                    <span className={styles.punct}>{'}'}</span>
                    <span className={styles.strLit}>{': '}</span>
                    <span className={styles.punct}>{'${'}</span>
                    <span className={styles.paramName}>taak</span>
                    <span className={styles.punct}>{'}'}</span>
                    <span className={styles.strLit}>`</span>
                </>
            );
        }
        return (
            <>
                <span className={styles.strLit}>`Taak </span>
                <span className={styles.punct}>{'${'}</span>
                <span className={styles.substituted}>
                    <span key={`bidx-${vis.valueArriveKey}`} className={styles.substitutedValue}>
                        {vis.bodyIndexValue}
                    </span>
                </span>
                <span className={styles.punct}>{' + '}</span>
                <span className={styles.numLit}>1</span>
                <span className={styles.punct}>{'}'}</span>
                <span className={styles.strLit}>{': '}</span>
                <span className={styles.punct}>{'${'}</span>
                <span className={styles.substituted}>
                    <span key={`btaak-${vis.valueArriveKey}`} className={styles.substitutedValue}>
                        "{vis.bodyTaakValue}"
                    </span>
                </span>
                <span className={styles.punct}>{'}'}</span>
                <span className={styles.strLit}>`</span>
                {vis.bodyResult !== null && (
                    <span className={styles.calcResultInline}>
                        {' = '}
                        <span ref={calcResultRef} className={styles.calcResultValue}>
                            "{vis.bodyResult}"
                        </span>
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
                <div className={styles.codeHeader}>map-index.ts</div>
                <div className={styles.codeBody}>
                    <div className={styles.codeLine}>
                        <span className={styles.kwConst}>const</span>
                        {' '}
                        <span className={styles.varName}>taken</span>
                        {!typeInference && (
                            <>
                                <span className={styles.punct}>: </span>
                                <span className={styles.typeName}>string</span>
                                <span className={styles.punct}>[]</span>
                            </>
                        )}
                        <span className={styles.punct}>{' = ['}</span>
                        <span className={styles.strLit}>"Afwassen", "Stofzuigen", "Gras maaien"</span>
                        <span className={styles.punct}>];</span>
                    </div>
                    <div className={styles.codeBlankLine}>&nbsp;</div>
                    <div className={styles.codeLine}>
                        <span className={styles.kwConst}>const</span>
                        {' '}
                        <span className={styles.varName}>genummerdeTaken</span>
                        {!typeInference && (
                            <>
                                <span className={styles.punct}>: </span>
                                <span className={styles.typeName}>string</span>
                                <span className={styles.punct}>[]</span>
                            </>
                        )}
                        <span className={styles.punct}>{' = taken.map('}</span>
                        <div
                            ref={accBoxRef}
                            className={`${styles.paramArea} ${vis.paramHighlighted ? styles.tokenHighlight : ''}`}
                        >
                            <span className={styles.punct}>(</span>
                            {renderParam()}
                            <span className={styles.punct}>)</span>
                        </div>
                        {!typeInference && (
                            <>
                                <span className={styles.punct}>: </span>
                                <span className={styles.typeName}>string</span>
                            </>
                        )}
                        <span className={styles.punct}>{returnStatement ? ' => {' : ' => '}</span>
                        {returnStatement && <span className={styles.kwConst}>{' return '}</span>}
                        <span className={vis.bodyTaakValue !== null ? styles.bodyHighlight : ''}>
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
                    <div className={styles.columnHeader}>taken</div>
                    <div className={styles.columnElements}>
                        {DATA.map((val, i) => (
                            <div
                                key={i}
                                ref={el => { arrayElementRefs.current[i] = el; }}
                                className={[
                                    styles.sourceRow,
                                    vis.highlightedSourceIndex === i ? styles.sourceRowHighlighted : '',
                                    (vis.isDone || (isRunning && vis.highlightedSourceIndex !== null && i < vis.highlightedSourceIndex))
                                        ? styles.sourceRowUsed : '',
                                ].join(' ')}
                            >
                                <span className={styles.indexLabel}>{i}</span>
                                <span className={styles.strLit}>"{val}"</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Destination column */}
                <div className={styles.columnSection}>
                    <div className={styles.columnHeader}>genummerdeTaken</div>
                    <div className={styles.columnElements}>
                        {vis.destResults.map((result, i) =>
                            result === null ? (
                                <div
                                    key={`empty-${i}`}
                                    ref={el => { destElementRefs.current[i] = el; }}
                                    className={styles.destRowEmpty}
                                />
                            ) : (
                                <div
                                    key={`filled-${i}`}
                                    ref={el => { destElementRefs.current[i] = el; }}
                                    className={`${styles.destRow} ${styles.destRowNew}`}
                                >
                                    <span className={styles.strLit}>"{result}"</span>
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
                        genummerdeTaken = <strong>["{vis.finalResult!.join('", "')}"]</strong>
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
