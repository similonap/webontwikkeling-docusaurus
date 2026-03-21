import React, { useState, useRef, useEffect, useCallback } from 'react';
import styles from './styles.module.css';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type FreqStep =
    | { type: 'code-dim' }
    | { type: 'highlight-initial' }
    | { type: 'move-to-acc' }
    | { type: 'highlight-element'; index: number }
    | { type: 'move-to-word'; index: number; word: string }
    | { type: 'highlight-body' }
    | { type: 'show-lookup'; word: string; count: number }
    | { type: 'show-calc'; word: string; oldCount: number; newCount: number }
    | { type: 'update-acc'; word: string; newCount: number; acc: Record<string, number> }
    | { type: 'done'; result: Record<string, number> };

interface VisualState {
    codeDimmed: boolean;
    highlightedToken: 'initial' | 'acc-param' | 'word-param' | null;
    highlightedArrayIndex: number | null;
    acc: Record<string, number>;
    accArriveKey: number;
    word: string | null;
    wordArriveKey: number;
    bodyHighlighted: boolean;
    lookupWord: string | null;
    lookupCount: number | null;
    calcNewCount: number | null;
    lastUpdatedKey: string | null;
    lastUpdatedKeyId: number;
    isDone: boolean;
    finalResult: Record<string, number> | null;
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

const WORDS = [
    'apple', 'banana', 'apple', 'cherry', 'banana',
    'apple', 'date', 'cherry', 'banana', 'date',
];

const STEP_DURATION: Record<FreqStep['type'], number> = {
    'code-dim': 500,
    'highlight-initial': 700,
    'move-to-acc': 800,
    'highlight-element': 700,
    'move-to-word': 800,
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
    for (let i = 0; i < WORDS.length; i++) {
        const word = WORDS[i];
        steps.push({ type: 'highlight-element', index: i });
        steps.push({ type: 'move-to-word', index: i, word });
        steps.push({ type: 'highlight-body' });
        const currentCount = acc[word] ?? 0;
        steps.push({ type: 'show-lookup', word, count: currentCount });
        const newCount = currentCount + 1;
        steps.push({ type: 'show-calc', word, oldCount: currentCount, newCount });
        acc[word] = newCount;
        steps.push({ type: 'update-acc', word, newCount, acc: { ...acc } });
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
        word: null,
        wordArriveKey: 0,
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
            case 'move-to-word':
                state.word = step.word;
                state.wordArriveKey = i;
                state.highlightedToken = 'word-param';
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
    const [stepIndex, setStepIndex] = useState(-1);
    const [isPlaying, setIsPlaying] = useState(false);
    const [badge, setBadge] = useState<FlyingBadge | null>(null);

    const containerRef = useRef<HTMLDivElement>(null);
    const initialValueRef = useRef<HTMLSpanElement>(null);
    const accParamRef = useRef<HTMLSpanElement>(null);
    const wordParamRef = useRef<HTMLSpanElement>(null);
    const arrayElementRefs = useRef<(HTMLDivElement | null)[]>([]);
    const accBoxRef = useRef<HTMLDivElement>(null);
    const wordBoxRef = useRef<HTMLDivElement>(null);

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
            launchBadge(initialValueRef, accBoxRef, '{}', () => { });
        } else if (nextStep.type === 'move-to-word') {
            setStepIndex(nextIndex);
            const elRef = { current: arrayElementRefs.current[nextStep.index] };
            launchBadge(elRef as React.RefObject<HTMLDivElement>, wordBoxRef, nextStep.word, () => { });
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
    // Helpers
    // ------------------------------------------------------------------

    const accEntries = Object.entries(vis.acc);

    const formatResult = (result: Record<string, number>) =>
        '{ ' + Object.entries(result).map(([k, v]) => `${k}: ${v}`).join(', ') + ' }';

    // ------------------------------------------------------------------
    // Body line substitution rendering
    // ------------------------------------------------------------------

    function renderBodyLine() {
        // acc[word] = (acc[word] ?? 0) + 1;
        if (vis.lookupWord === null) {
            // Plain text
            return (
                <>
                    <span className={styles.paramName}>acc</span>
                    <span className={styles.punct}>[</span>
                    <span className={styles.paramName}>word</span>
                    <span className={styles.punct}>] = (</span>
                    <span className={styles.paramName}>acc</span>
                    <span className={styles.punct}>[</span>
                    <span className={styles.paramName}>word</span>
                    <span className={styles.punct}>] ?? 0) + 1;</span>
                </>
            );
        }
        // Substituted form: acc["apple"] = (0 ?? 0) + 1;
        const wordStr = `"${vis.lookupWord}"`;
        const countStr = String(vis.lookupCount ?? 0);
        return (
            <>
                <span className={styles.paramName}>acc</span>
                <span className={styles.punct}>[</span>
                <span className={styles.substituted}>
                    <span key={`wk-${vis.wordArriveKey}`} className={styles.substitutedValue}>{wordStr}</span>
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

    // ------------------------------------------------------------------
    // Render
    // ------------------------------------------------------------------

    return (
        <div className={styles.container} ref={containerRef}>
            {/* ---- Code Panel ---- */}
            <div className={`${styles.codePanel} ${vis.codeDimmed ? styles.codeDimmed : ''}`}>
                <div className={styles.codeHeader}>reduce-freq.ts</div>
                <div className={styles.codeBody}>
                    <div className={styles.codeLine}>
                        <span className={styles.kwConst}>const</span>
                        {' '}
                        <span className={styles.varName}>freq</span>
                        <span className={styles.punct}>{' = words.reduce<'}</span>
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
                            ref={wordParamRef}
                            className={`${styles.paramName} ${vis.highlightedToken === 'word-param' ? styles.tokenHighlight : ''}`}
                        >word</span>
                        <span className={styles.punct}>{') => {'}</span>
                    </div>
                    {/* Body line 1 */}
                    <div className={`${styles.codeLine} ${vis.bodyHighlighted ? styles.codeLineHighlight : ''}`}>
                        <span className={styles.punct}>&nbsp;&nbsp;&nbsp;&nbsp;</span>
                        {renderBodyLine()}
                    </div>
                    {/* Body line 2 */}
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
                <span className={styles.arrayLabel}>words</span>
                <div className={styles.arrayElements}>
                    {WORDS.map((w, i) => (
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
                {/* acc box */}
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

                {/* word box */}
                <div className={styles.wordBox}>
                    <div className={styles.stateLabel}>word</div>
                    <div
                        ref={wordBoxRef}
                        className={`${styles.stateValue} ${vis.word !== null ? styles.stateValueFilled : ''}`}
                    >
                        {vis.word !== null ? (
                            <span key={vis.wordArriveKey} className={styles.valueArrive}>{vis.word}</span>
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
