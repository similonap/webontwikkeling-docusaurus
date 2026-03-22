import React, { useState, useRef, useEffect, useCallback } from 'react';
import styles from './styles.module.css';

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
    const [stepIndex, setStepIndex] = useState(-1);
    const [isPlaying, setIsPlaying] = useState(false);
    const [badge, setBadge] = useState<FlyingBadge | null>(null);

    const containerRef = useRef<HTMLDivElement>(null);
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

        if (nextStep.type === 'move-first-to-acc') {
            setStepIndex(nextIndex);
            const elRef = { current: arrayElementRefs.current[0] };
            launchBadge(elRef as React.RefObject<HTMLDivElement>, accBoxRef, String(nextStep.value), () => { });
        } else if (nextStep.type === 'move-to-cur') {
            setStepIndex(nextIndex);
            const elRef = { current: arrayElementRefs.current[nextStep.index] };
            launchBadge(elRef as React.RefObject<HTMLDivElement>, curBoxRef, String(nextStep.value), () => { });
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

    // cur > acc
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

    // ------------------------------------------------------------------
    // Render
    // ------------------------------------------------------------------

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
                    {/* comparison line */}
                    <div className={`${styles.codeLine} ${vis.bodyPhase === 'compare' ? styles.codeLineHighlight : ''}`}>
                        <span className={styles.punct}>&nbsp;&nbsp;&nbsp;&nbsp;</span>
                        {renderCompareLine()}
                    </div>
                    {/* ? cur */}
                    <div className={`${styles.codeLine} ${vis.bodyPhase === 'cur-wins' ? styles.codeLineHighlightWin : ''}`}>
                        <span className={styles.punct}>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>
                        <span className={styles.punct}>{'? '}</span>
                        <span className={styles.paramName}>cur</span>
                    </div>
                    {/* : acc */}
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
                {/* acc box */}
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

                {/* cur box */}
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
