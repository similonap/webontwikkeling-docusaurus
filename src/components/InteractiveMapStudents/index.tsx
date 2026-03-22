import React, { useRef, useCallback } from 'react';
import styles from './styles.module.css';
import { useReduceAnimation } from '../shared/useReduceAnimation';
import type { AnimationRefs, BadgeAnimation } from '../shared/useReduceAnimation';
import ReduceControls from '../shared/ReduceControls';
import FlyingBadgeDisplay from '../shared/FlyingBadgeDisplay';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type Student = { id: number; name: string };

type MapStep =
    | { type: 'highlight-element'; index: number }
    | { type: 'move-to-param'; index: number }
    | { type: 'highlight-body'; index: number }
    | { type: 'show-result'; name: string }
    | { type: 'push-to-dest'; index: number; name: string }
    | { type: 'add-to-dest'; index: number; name: string }
    | { type: 'done'; result: string[] };

interface VisualState {
    highlightedSourceIndex: number | null;
    paramHighlighted: boolean;
    paramStudent: Student | null;
    valueArriveKey: number;
    bodyHighlighted: boolean;
    resultName: string | null;
    destResults: (string | null)[];
    isDone: boolean;
    finalResult: string[] | null;
}

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const STUDENTS: Student[] = [
    { id: 0, name: 'Andie' },
    { id: 1, name: 'John' },
    { id: 2, name: 'Jessie' },
];

const STEP_DURATION: Record<MapStep['type'], number> = {
    'highlight-element': 600,
    'move-to-param': 800,
    'highlight-body': 700,
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
    for (let i = 0; i < STUDENTS.length; i++) {
        const { name } = STUDENTS[i];
        steps.push({ type: 'highlight-element', index: i });
        steps.push({ type: 'move-to-param', index: i });
        // highlight-body fires after badge has landed — object replaces "student" here
        steps.push({ type: 'highlight-body', index: i });
        steps.push({ type: 'show-result', name });
        steps.push({ type: 'push-to-dest', index: i, name });
        steps.push({ type: 'add-to-dest', index: i, name });
    }
    steps.push({ type: 'done', result: STUDENTS.map(s => s.name) });
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
        paramStudent: null,
        valueArriveKey: 0,
        bodyHighlighted: false,
        resultName: null,
        destResults: Array(STUDENTS.length).fill(null),
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
                state.paramStudent = null;
                state.bodyHighlighted = false;
                state.resultName = null;
                break;
            case 'move-to-param':
                // badge is flying — keep showing "(student)" with glow, no substitution yet
                state.paramHighlighted = true;
                state.valueArriveKey = i;
                break;
            case 'highlight-body':
                // badge has landed — now replace "student" with the actual object
                state.paramHighlighted = false;
                state.paramStudent = STUDENTS[step.index];
                state.bodyHighlighted = true;
                break;
            case 'show-result':
                state.resultName = step.name;
                break;
            case 'push-to-dest':
                break;
            case 'add-to-dest': {
                const newResults = [...state.destResults];
                newResults[step.index] = step.name;
                state.destResults = newResults;
                state.paramStudent = null;
                state.bodyHighlighted = false;
                state.resultName = null;
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

export default function InteractiveMapStudents() {
    const calcResultRef = useRef<HTMLSpanElement>(null);
    const destElementRefs = useRef<(HTMLDivElement | null)[]>([]);

    const getBadgeAnimation = useCallback((
        step: MapStep,
        { arrayElementRefs, accBoxRef }: AnimationRefs,
    ): BadgeAnimation | null => {
        if (step.type === 'move-to-param')
            return {
                source: { current: arrayElementRefs.current[step.index] },
                dest: accBoxRef,
                value: STUDENTS[step.index].name,
            };
        if (step.type === 'push-to-dest')
            return {
                source: calcResultRef,
                dest: { current: destElementRefs.current[step.index] },
                value: `"${step.name}"`,
            };
        return null;
    }, []);

    const {
        stepIndex, isPlaying, badge, isDone, isRunning,
        containerRef, accBoxRef, arrayElementRefs,
        handleStart, handleStep, reset,
    } = useReduceAnimation({ steps: STEPS, stepDuration: STEP_DURATION, getBadgeAnimation });

    const vis = deriveVisualState(stepIndex);

    function renderSourceRow(student: Student) {
        return (
            <>
                <span className={styles.punct}>{'{ '}</span>
                <span className={styles.propKey}>id</span>
                <span className={styles.punct}>: </span>
                <span className={styles.numLit}>{student.id}</span>
                <span className={styles.punct}>{', '}</span>
                <span className={styles.propKey}>name</span>
                <span className={styles.punct}>: </span>
                <span className={styles.strLit}>"{student.name}"</span>
                <span className={styles.punct}>{' }'}</span>
            </>
        );
    }

    function renderParam() {
        if (vis.paramStudent === null) {
            return <span className={styles.paramName}>student</span>;
        }
        // Object arrived — show the full object in accent color with pop animation
        return (
            <span className={styles.substituted}>
                <span key={`param-${vis.valueArriveKey}`} className={styles.substitutedValue}>
                    {'{ id: '}{vis.paramStudent.id}{', name: "'}{vis.paramStudent.name}{'" }'}
                </span>
            </span>
        );
    }

    function renderBody() {
        return (
            <>
                <span className={styles.paramName}>student</span>
                <span className={styles.punct}>.name</span>
                {vis.resultName !== null && (
                    <span className={styles.calcResultInline}>
                        {' = '}
                        <span ref={calcResultRef} className={styles.calcResultValue}>
                            "{vis.resultName}"
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
                <div className={styles.codeHeader}>map-students.ts</div>
                <div className={styles.codeBody}>
                    <div className={styles.codeLine}>
                        <span className={styles.kwConst}>const</span>
                        {' '}
                        <span className={styles.varName}>students</span>
                        <span className={styles.punct}>: {'{ '}</span>
                        <span className={styles.propKey}>id</span>
                        <span className={styles.punct}>: </span>
                        <span className={styles.typeName}>number</span>
                        <span className={styles.punct}>{', '}</span>
                        <span className={styles.propKey}>name</span>
                        <span className={styles.punct}>: </span>
                        <span className={styles.typeName}>string</span>
                        <span className={styles.punct}>{' }[] = [...]'}</span>
                    </div>
                    <div className={styles.codeBlankLine}>&nbsp;</div>
                    <div className={styles.codeLine}>
                        <span className={styles.kwLet}>let</span>
                        {' '}
                        <span className={styles.varName}>studentNames</span>
                        <span className={styles.punct}>: </span>
                        <span className={styles.typeName}>string</span>
                        <span className={styles.punct}>{'[] = students.map('}</span>
                        {/* accBoxRef on this div — badge lands here; shows object after landing */}
                        <div
                            ref={accBoxRef}
                            className={`${styles.paramArea} ${vis.paramHighlighted ? styles.tokenHighlight : ''}`}
                        >
                            <span className={styles.punct}>(</span>
                            {renderParam()}
                            <span className={styles.punct}>)</span>
                        </div>
                        <span className={styles.punct}>{' => '}</span>
                        <span className={vis.bodyHighlighted ? styles.bodyHighlight : ''}>
                            {renderBody()}
                        </span>
                        <span className={styles.punct}>{');'}</span>
                    </div>
                </div>
            </div>

            {/* ---- Two-column Vertical Panel ---- */}
            <div className={styles.columnsPanel}>
                {/* Source column */}
                <div className={styles.columnSection}>
                    <div className={styles.columnHeader}>students</div>
                    <div className={styles.columnElements}>
                        {STUDENTS.map((student, i) => (
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
                                {renderSourceRow(student)}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Destination column — pre-populated with placeholders */}
                <div className={styles.columnSection}>
                    <div className={styles.columnHeader}>studentNames</div>
                    <div className={styles.columnElements}>
                        {vis.destResults.map((name, i) =>
                            name === null ? (
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
                                    <span className={styles.strLit}>"{name}"</span>
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
                        studentNames = <strong>["{vis.finalResult!.join('", "')}"]</strong>
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
