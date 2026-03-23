import React, { useRef, useCallback, useState } from 'react';
import styles from './styles.module.css';
import { useReduceAnimation } from '../shared/useReduceAnimation';
import type { AnimationRefs, BadgeAnimation } from '../shared/useReduceAnimation';
import ReduceControls from '../shared/ReduceControls';
import FlyingBadgeDisplay from '../shared/FlyingBadgeDisplay';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type FindStep =
    | { type: 'highlight-element'; index: number }
    | { type: 'move-to-param'; index: number; value: number }
    | { type: 'enter-body'; value: number }
    | { type: 'show-result'; value: number; passes: boolean }
    | { type: 'found'; index: number; value: number }
    | { type: 'reject-element'; index: number }
    | { type: 'done'; result: number | undefined };

interface VisualState {
    highlightedSourceIndex: number | null;
    paramHighlighted: boolean;
    paramValue: number | null;
    valueArriveKey: number;
    bodyValue: number | null;
    bodyPasses: boolean | null;
    rejectedIndices: number[];
    foundIndex: number | null;
    isDone: boolean;
    finalResult: number | undefined | null;
}

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const DATA = [1, 2, 3, 4, 5];

const STEP_DURATION: Record<FindStep['type'], number> = {
    'highlight-element': 600,
    'move-to-param': 800,
    'enter-body': 700,
    'show-result': 1000,
    'found': 800,
    'reject-element': 700,
    'done': 0,
};

// ---------------------------------------------------------------------------
// Step generation
// ---------------------------------------------------------------------------

function generateSteps(): FindStep[] {
    const steps: FindStep[] = [];
    for (let i = 0; i < DATA.length; i++) {
        const value = DATA[i];
        const passes = value % 2 === 0;
        steps.push({ type: 'highlight-element', index: i });
        steps.push({ type: 'move-to-param', index: i, value });
        steps.push({ type: 'enter-body', value });
        steps.push({ type: 'show-result', value, passes });
        if (passes) {
            steps.push({ type: 'found', index: i, value });
            steps.push({ type: 'done', result: value });
            return steps;
        } else {
            steps.push({ type: 'reject-element', index: i });
        }
    }
    steps.push({ type: 'done', result: undefined });
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
        bodyPasses: null,
        rejectedIndices: [],
        foundIndex: null,
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
                state.bodyPasses = null;
                break;
            case 'move-to-param':
                state.paramHighlighted = true;
                state.valueArriveKey = i;
                break;
            case 'enter-body':
                state.paramHighlighted = false;
                state.paramValue = step.value;
                state.bodyValue = step.value;
                break;
            case 'show-result':
                state.bodyPasses = step.passes;
                break;
            case 'found':
                state.foundIndex = step.index;
                state.bodyValue = null;
                state.bodyPasses = null;
                state.paramValue = null;
                break;
            case 'reject-element':
                state.rejectedIndices = [...state.rejectedIndices, step.index];
                state.bodyValue = null;
                state.bodyPasses = null;
                state.paramValue = null;
                break;
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

export default function InteractiveFind() {
    const [typeInference, setTypeInference] = useState(false);
    const [returnStatement, setReturnStatement] = useState(false);

    const calcResultRef = useRef<HTMLSpanElement>(null);

    const getBadgeAnimation = useCallback((
        step: FindStep,
        { arrayElementRefs, accBoxRef, curBoxRef }: AnimationRefs,
    ): BadgeAnimation | null => {
        if (step.type === 'move-to-param')
            return {
                source: { current: arrayElementRefs.current[step.index] },
                dest: accBoxRef,
                value: String(step.value),
            };
        if (step.type === 'found')
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
        const isCurrentlyHighlighted = vis.highlightedSourceIndex === i && vis.foundIndex === null;
        const isFound = vis.foundIndex === i;
        const isRejected = vis.rejectedIndices.includes(i);
        const isSkipped = vis.foundIndex !== null && i > vis.foundIndex;

        return [
            styles.arrayElement,
            isCurrentlyHighlighted ? styles.arrayElementHighlighted : '',
            isFound ? styles.arrayElementFound : '',
            isRejected ? styles.arrayElementRejected : '',
            isSkipped ? styles.arrayElementSkipped : '',
        ].join(' ');
    }

    function renderBody() {
        if (vis.bodyValue === null) {
            return (
                <>
                    <span className={styles.paramName}>element</span>
                    <span className={styles.punct}> % </span>
                    <span className={styles.numLit}>2</span>
                    <span className={styles.punct}> === </span>
                    <span className={styles.numLit}>0</span>
                </>
            );
        }
        return (
            <>
                <span className={styles.substituted}>
                    <span key={`body-${vis.valueArriveKey}`} className={styles.substitutedValue}>{vis.bodyValue}</span>
                </span>
                <span className={styles.punct}> % </span>
                <span className={styles.numLit}>2</span>
                <span className={styles.punct}> === </span>
                <span className={styles.numLit}>0</span>
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
                <div className={styles.codeHeader}>find-even.ts</div>
                <div className={styles.codeBody}>
                    <div className={styles.codeLine}>
                        <span className={styles.kwLet}>let</span>
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
                        <span className={styles.kwLet}>let</span>
                        {' '}
                        <span className={styles.varName}>firstEven</span>
                        {!typeInference && (
                            <>
                                <span className={styles.punct}>: </span>
                                <span className={styles.typeName}>number</span>
                                <span className={styles.punct}> | </span>
                                <span className={styles.typeName}>undefined</span>
                            </>
                        )}
                        <span className={styles.punct}>{' = numbers.find('}</span>
                        {/* accBoxRef — badge lands here when value flies to param */}
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
                                <span className={styles.typeName}>boolean</span>
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
                                className={getSourceClass(i)}
                            >
                                {val}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Result column — badge lands here, single value or undefined */}
                <div className={styles.columnSection} ref={curBoxRef}>
                    <div className={styles.columnHeader}>firstEven</div>
                    <div className={styles.columnElements}>
                        {vis.finalResult === null ? (
                            <div className={styles.resultEmpty} />
                        ) : vis.finalResult === undefined ? (
                            <div className={`${styles.resultBox} ${styles.resultBoxUndefined} ${styles.resultBoxNew}`}>
                                undefined
                            </div>
                        ) : (
                            <div className={`${styles.resultBox} ${styles.resultBoxNew}`}>
                                {vis.finalResult}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* ---- Done result ---- */}
            {vis.isDone && (
                <div className={`${styles.resultPanel} ${vis.finalResult !== undefined ? styles.resultPanelDone : styles.resultPanelUndefined}`}>
                    <span className={vis.finalResult !== undefined ? styles.resultDone : styles.resultUndefined}>
                        firstEven = <strong>{vis.finalResult !== undefined ? String(vis.finalResult) : 'undefined'}</strong>
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
