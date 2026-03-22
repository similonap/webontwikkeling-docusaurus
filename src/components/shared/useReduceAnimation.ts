import { useState, useRef, useEffect, useCallback } from 'react';
import type { RefObject } from 'react';
import type { FlyingBadge } from './types';

export interface AnimationRefs {
    containerRef: RefObject<HTMLDivElement | null>;
    accBoxRef: RefObject<HTMLDivElement | null>;
    curBoxRef: RefObject<HTMLDivElement | null>;
    arrayElementRefs: RefObject<(HTMLDivElement | null)[]>;
}

export interface BadgeAnimation {
    source: RefObject<HTMLElement | HTMLDivElement | null>;
    dest: RefObject<HTMLElement | HTMLDivElement | null>;
    value: string;
}

interface Config<TStep extends { type: string }> {
    steps: TStep[];
    stepDuration: Record<string, number>;
    getBadgeAnimation: (step: TStep, refs: AnimationRefs) => BadgeAnimation | null;
}

export function useReduceAnimation<TStep extends { type: string }>({
    steps,
    stepDuration,
    getBadgeAnimation,
}: Config<TStep>) {
    const [stepIndex, setStepIndex] = useState(-1);
    const [isPlaying, setIsPlaying] = useState(false);
    const [badge, setBadge] = useState<FlyingBadge | null>(null);

    const containerRef = useRef<HTMLDivElement>(null);
    const accBoxRef = useRef<HTMLDivElement>(null);
    const curBoxRef = useRef<HTMLDivElement>(null);
    const arrayElementRefs = useRef<(HTMLDivElement | null)[]>([]);
    const cleanupRef = useRef<(() => void) | null>(null);

    const refs: AnimationRefs = { containerRef, accBoxRef, curBoxRef, arrayElementRefs };

    const isDone = stepIndex === steps.length - 1;
    const isRunning = stepIndex >= 0 && !isDone;

    // ------------------------------------------------------------------
    // Flying badge
    // ------------------------------------------------------------------

    const launchBadge = useCallback((
        sourceRef: RefObject<HTMLElement | HTMLDivElement | null>,
        destRef: RefObject<HTMLDivElement | null>,
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
        if (nextIndex >= steps.length) {
            setIsPlaying(false);
            return;
        }

        const nextStep = steps[nextIndex];
        setStepIndex(nextIndex);

        const animation = getBadgeAnimation(nextStep, refs);
        if (animation) {
            launchBadge(animation.source, animation.dest as RefObject<HTMLDivElement>, animation.value, () => { });
        }
    }, [steps, getBadgeAnimation, launchBadge]); // eslint-disable-line react-hooks/exhaustive-deps

    // Auto-play
    useEffect(() => {
        if (!isPlaying) return;
        if (isDone) { setIsPlaying(false); return; }

        const currentStep = stepIndex >= 0 ? steps[stepIndex] : null;
        const delay = currentStep ? stepDuration[currentStep.type] : 200;

        const timer = setTimeout(() => {
            advanceStep(stepIndex);
        }, delay);

        return () => clearTimeout(timer);
    }, [isPlaying, stepIndex, isDone, advanceStep, steps, stepDuration]);

    // ------------------------------------------------------------------
    // Handlers
    // ------------------------------------------------------------------

    const handleStart = useCallback(() => {
        if (isDone) { reset(); return; }
        if (stepIndex < 0) {
            setStepIndex(0);
            setIsPlaying(true);
        } else {
            setIsPlaying(prev => !prev);
        }
    }, [isDone, stepIndex]);

    const handleStep = useCallback(() => {
        if (isDone) return;
        if (stepIndex < 0) {
            setStepIndex(0);
        } else {
            advanceStep(stepIndex);
        }
        setIsPlaying(false);
    }, [isDone, stepIndex, advanceStep]);

    const reset = useCallback(() => {
        cleanupRef.current?.();
        cleanupRef.current = null;
        setBadge(null);
        setStepIndex(-1);
        setIsPlaying(false);
    }, []);

    return {
        stepIndex,
        isPlaying,
        badge,
        isDone,
        isRunning,
        containerRef,
        accBoxRef,
        curBoxRef,
        arrayElementRefs,
        handleStart,
        handleStep,
        reset,
    };
}
