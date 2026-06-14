import React, { useState, useEffect, useCallback } from 'react';
import styles from './Maximizable.module.css';

// ---------------------------------------------------------------------------
// Maximizable — wraps any interactive component and adds a button that
// expands it into a full-screen overlay. The children are never remounted
// (only the wrapper gets a class toggled), so internal animation state is
// preserved when entering / leaving full-screen.
// ---------------------------------------------------------------------------

interface MaximizableProps {
    children: React.ReactNode;
}

function ExpandIcon() {
    return (
        <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
            <path d="M6 2H2v4M10 2h4v4M6 14H2v-4M10 14h4v-4" />
        </svg>
    );
}

function CollapseIcon() {
    return (
        <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
            <path d="M2 6h4V2M14 6h-4V2M2 10h4v4M14 10h-4v4" />
        </svg>
    );
}

export default function Maximizable({ children }: MaximizableProps) {
    const [maximized, setMaximized] = useState(false);

    const toggle = useCallback(() => setMaximized(m => !m), []);

    // Clicking the dimmed backdrop (but not the demo itself) closes the overlay.
    const onBackdropClick = useCallback((e: React.MouseEvent) => {
        if (e.target === e.currentTarget) setMaximized(false);
    }, []);

    // While maximized: lock body scroll and allow Escape to close.
    useEffect(() => {
        if (!maximized) return;

        const onKey = (e: KeyboardEvent) => {
            if (e.key === 'Escape') setMaximized(false);
        };
        document.addEventListener('keydown', onKey);

        const prevOverflow = document.body.style.overflow;
        document.body.style.overflow = 'hidden';

        return () => {
            document.removeEventListener('keydown', onKey);
            document.body.style.overflow = prevOverflow;
        };
    }, [maximized]);

    return (
        <div
            className={`${styles.wrapper} ${maximized ? styles.maximized : ''}`}
            onClick={maximized ? onBackdropClick : undefined}
        >
            <div className={styles.content}>
                <button
                    type="button"
                    className={styles.toggleButton}
                    onClick={toggle}
                    aria-label={maximized ? 'Verklein' : 'Maximaliseer'}
                    title={maximized ? 'Verklein (Esc)' : 'Maximaliseer'}
                >
                    {maximized ? <CollapseIcon /> : <ExpandIcon />}
                </button>
                {children}
            </div>
        </div>
    );
}

// ---------------------------------------------------------------------------
// HOC: wrap a component's default export so every usage gets the maximize
// button for free, without touching the component's own markup.
// ---------------------------------------------------------------------------

export function withMaximize<P extends object>(Component: React.ComponentType<P>) {
    function Wrapped(props: P) {
        return (
            <Maximizable>
                <Component {...props} />
            </Maximizable>
        );
    }
    Wrapped.displayName = `withMaximize(${Component.displayName || Component.name || 'Component'})`;
    return Wrapped;
}
