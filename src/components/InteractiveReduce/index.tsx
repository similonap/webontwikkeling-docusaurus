import React, { useState, useRef, useEffect, useCallback } from 'react';
import styles from './styles.module.css';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type ReduceStep =
    | { type: 'code-dim' }
    | { type: 'highlight-initial'; value: number }
    | { type: 'move-to-acc'; value: number }
    | { type: 'highlight-element'; index: number }
    | { type: 'move-to-item'; index: number; value: number }
    | { type: 'highlight-return' }
    | { type: 'move-acc-to-result'; acc: number }
    | { type: 'move-item-to-result'; item: number }
    | { type: 'show-calculation'; acc: number; item: number; result: number }
    | { type: 'move-result-to-acc'; result: number }
    | { type: 'done'; result: number };

interface VisualState {
    codeDimmed: boolean;
    highlightedToken: 'initial' | 'acc-param' | 'item-param' | 'return-line' | null;
    highlightedArrayIndex: number | null;
    acc: number | null;
    accArriveKey: number;
    item: number | null;
    itemArriveKey: number;
    // Inline substitution in the return expression
    returnAccValue: number | null;
    returnItemValue: number | null;
    returnResult: number | null;
    isDone: boolean;
    finalResult: number | null;
}

interface FlyingBadge {
    value: string | number;
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

const ARRAY = [1, 2, 3, 4, 5];
const INITIAL_VALUE = 0;
const REDUCER = (acc: number, item: number) => acc + item;

const STEP_DURATION: Record<ReduceStep['type'], number> = {
    'code-dim': 500,
    'highlight-initial': 700,
    'move-to-acc': 800,
    'highlight-element': 700,
    'move-to-item': 800,
    'highlight-return': 600,
    'move-acc-to-result': 800,
    'move-item-to-result': 800,
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
        const item = ARRAY[i];
        steps.push({ type: 'highlight-element', index: i });
        steps.push({ type: 'move-to-item', index: i, value: item });
        steps.push({ type: 'highlight-return' });
        steps.push({ type: 'move-acc-to-result', acc });
        steps.push({ type: 'move-item-to-result', item });
        const result = REDUCER(acc, item);
        steps.push({ type: 'show-calculation', acc, item, result });
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
        item: null,
        itemArriveKey: 0,
        returnAccValue: null,
        returnItemValue: null,
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
            case 'move-to-item':
                state.item = step.value;
                state.itemArriveKey = i;
                state.highlightedToken = 'item-param';
                break;
            case 'highlight-return':
                state.highlightedToken = 'return-line';
                state.returnAccValue = null;
                state.returnItemValue = null;
                state.returnResult = null;
                break;
            case 'move-acc-to-result':
                state.highlightedToken = 'return-line';
                state.returnAccValue = step.acc;
                break;
            case 'move-item-to-result':
                state.highlightedToken = 'return-line';
                state.returnItemValue = step.item;
                break;
            case 'show-calculation':
                state.highlightedToken = 'return-line';
                state.returnResult = step.result;
                break;
            case 'move-result-to-acc':
                state.acc = step.result;
                state.accArriveKey = i;
                state.returnAccValue = null;
                state.returnItemValue = null;
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
    const [stepIndex, setStepIndex] = useState(-1);
    const [isPlaying, setIsPlaying] = useState(false);
    const [badge, setBadge] = useState<FlyingBadge | null>(null);

    const containerRef = useRef<HTMLDivElement>(null);
    const initialValueRef = useRef<HTMLSpanElement>(null);
    const accParamRef = useRef<HTMLSpanElement>(null);
    const itemParamRef = useRef<HTMLSpanElement>(null);
    // Refs for the three parts of the return expression
    const accInReturnRef = useRef<HTMLSpanElement>(null);
    const itemInReturnRef = useRef<HTMLSpanElement>(null);
    const returnResultRef = useRef<HTMLSpanElement>(null);
    const arrayElementRefs = useRef<(HTMLDivElement | null)[]>([]);
    const accBoxRef = useRef<HTMLDivElement>(null);
    const itemBoxRef = useRef<HTMLDivElement>(null);

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
        value: string | number,
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
            launchBadge(initialValueRef, accBoxRef, nextStep.value, () => { });
        } else if (nextStep.type === 'move-to-item') {
            setStepIndex(nextIndex);
            const elRef = { current: arrayElementRefs.current[nextStep.index] };
            launchBadge(elRef as any, itemBoxRef, nextStep.value, () => { });
        } else if (nextStep.type === 'move-acc-to-result') {
            // Badge flies from acc box → 'acc' token inside the return expression
            setStepIndex(nextIndex);
            launchBadge(accBoxRef, accInReturnRef, nextStep.acc, () => { });
        } else if (nextStep.type === 'move-item-to-result') {
            // Badge flies from item box → 'item' token inside the return expression
            setStepIndex(nextIndex);
            launchBadge(itemBoxRef, itemInReturnRef, nextStep.item, () => { });
        } else if (nextStep.type === 'move-result-to-acc') {
            // Badge flies from the inline '= result' back to the acc box
            setStepIndex(nextIndex);
            launchBadge(returnResultRef, accBoxRef, nextStep.result, () => { });
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
    // Render
    // ------------------------------------------------------------------

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
                            ref={itemParamRef}
                            className={`${styles.paramName} ${vis.highlightedToken === 'item-param' ? styles.tokenHighlight : ''}`}
                        >item</span>
                        <span className={styles.punct}>: </span>
                        <span className={styles.typeName}>number</span>
                        <span className={styles.punct}>{') => {'}</span>
                    </div>
                    {/* Return line — highlighted as a whole, values substituted inline */}
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
                            ref={itemInReturnRef}
                            className={`${vis.returnItemValue !== null ? styles.returnSubstituted : styles.returnPart}`}
                        >
                            {vis.returnItemValue !== null
                                ? <span key={`ri-${vis.returnItemValue}`} className={styles.substitutedValue}>{vis.returnItemValue}</span>
                                : 'item'}
                        </span>
                        {vis.returnResult !== null && (
                            <span
                                ref={returnResultRef}
                                className={styles.returnResultInline}
                            >
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
                    <div className={styles.stateLabel}>item</div>
                    <div
                        ref={itemBoxRef}
                        className={`${styles.stateValue} ${vis.item !== null ? styles.stateValueFilled : ''}`}
                    >
                        {vis.item !== null ? (
                            <span key={vis.itemArriveKey} className={styles.valueArrive}>{vis.item}</span>
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
