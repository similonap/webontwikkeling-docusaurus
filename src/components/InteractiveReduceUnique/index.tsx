import React, { useState, useRef, useEffect, useCallback } from 'react';
import styles from './styles.module.css';

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
    const [stepIndex, setStepIndex] = useState(-1);
    const [isPlaying, setIsPlaying] = useState(false);
    const [badge, setBadge] = useState<FlyingBadge | null>(null);

    const containerRef = useRef<HTMLDivElement>(null);
    const initialValueRef = useRef<HTMLSpanElement>(null);
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

        if (nextStep.type === 'move-to-acc') {
            setStepIndex(nextIndex);
            launchBadge(initialValueRef, accBoxRef, '[]', () => { });
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

    // acc.includes(cur)
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

    // : [...acc, cur]
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

    // ------------------------------------------------------------------
    // Render
    // ------------------------------------------------------------------

    return (
        <div className={styles.container} ref={containerRef}>
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
                    {/* includes line */}
                    <div className={`${styles.codeLine} ${vis.bodyPhase === 'includes' ? styles.codeLineHighlight : ''}`}>
                        <span className={styles.punct}>&nbsp;&nbsp;&nbsp;&nbsp;</span>
                        {renderIncludesLine()}
                    </div>
                    {/* ? acc (skip) */}
                    <div className={`${styles.codeLine} ${vis.bodyPhase === 'skip' ? styles.codeLineHighlightTrue : ''}`}>
                        <span className={styles.punct}>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>
                        <span className={styles.punct}>{'? '}</span>
                        <span className={styles.paramName}>acc</span>
                    </div>
                    {/* : [...acc, cur] (add) */}
                    <div className={`${styles.codeLine} ${vis.bodyPhase === 'add' ? styles.codeLineHighlightFalse : ''}`}>
                        <span className={styles.punct}>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>
                        {renderAddLine()}
                    </div>
                    <div className={styles.codeLine}>
                        <span className={styles.punct}>{', '}</span>
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
                {/* acc box */}
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

                {/* cur box */}
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
