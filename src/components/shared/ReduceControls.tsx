import React from 'react';

interface ReduceControlsProps {
    isDone: boolean;
    stepIndex: number;
    isPlaying: boolean;
    onStart: () => void;
    onStep: () => void;
    onReset: () => void;
    styles: { readonly [key: string]: string };
}

export default function ReduceControls({
    isDone,
    stepIndex,
    isPlaying,
    onStart,
    onStep,
    onReset,
    styles,
}: ReduceControlsProps) {
    return (
        <div className={styles.controls}>
            <button className={styles.btnPrimary} onClick={onStart}>
                {isDone ? '↺ Opnieuw' : stepIndex < 0 ? '▶ Start' : isPlaying ? '⏸ Pauze' : '▶ Verder'}
            </button>
            <button
                className={styles.btnSecondary}
                onClick={onStep}
                disabled={isPlaying || isDone}
            >
                Stap →
            </button>
            <button
                className={styles.btnSecondary}
                onClick={onReset}
                disabled={stepIndex < 0 && !isDone}
            >
                ↺ Reset
            </button>
        </div>
    );
}
