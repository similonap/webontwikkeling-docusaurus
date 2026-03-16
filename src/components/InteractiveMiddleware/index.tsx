import React, { useState, useEffect } from 'react';
import styles from './styles.module.css';

const CODE_LINES = [
    "app.use((req, res, next) => {",
    "  console.log(`${req.method} ${req.path}`);",
    "  next();",
    "});",
    "",
    "app.get('/', (req, res) => {",
    "  res.send('Hello World');",
    "});"
];

export default function InteractiveMiddleware() {
    const [step, setStep] = useState(0);
    const [activeLine, setActiveLine] = useState<number | null>(null);
    const [logs, setLogs] = useState<string[]>([]);
    const [response, setResponse] = useState<string | null>(null);

    useEffect(() => {
        return () => {
            // cleanup
        };
    }, []);

    const handleSendRequest = () => {
        if (step > 0 && step < 6) return;

        setStep(1);
        setActiveLine(0); // Hit app.use
        setLogs([]);
        setResponse(null);

        setTimeout(() => {
            setStep(2);
            setActiveLine(1); // console.log()

            setTimeout(() => {
                setLogs(['GET /']);
                setStep(3);
                setActiveLine(2); // next()

                setTimeout(() => {
                    setStep(4);
                    setActiveLine(5); // app.get()

                    setTimeout(() => {
                        setStep(5);
                        setActiveLine(6); // res.send()
                        setResponse('Hello World');

                        setTimeout(() => {
                            setStep(6);
                            setActiveLine(null);
                        }, 1000);
                    }, 1000);
                }, 1000);
            }, 1000);
        }, 1000);
    };

    const handleReset = () => {
        setStep(0);
        setActiveLine(null);
        setLogs([]);
        setResponse(null);
    };

    return (
        <div className={styles.container}>
            <div className={styles.editorContainer}>
                <div className={styles.editorHeader}>server.ts</div>
                <div className={styles.editorContent}>
                    {CODE_LINES.map((line, index) => (
                        <div
                            key={index}
                            className={`${styles.codeLine} ${activeLine === index ? styles.activeLine : ''}`}
                        >
                            <div className={styles.arrowContainer}>
                                {activeLine === index && <span>&#10148;</span>}
                            </div>
                            <div className={styles.lineNumber}>{index + 1}</div>
                            <div className={styles.codeText}>{line}</div>
                        </div>
                    ))}
                </div>
            </div>

            <div className={styles.simulators}>
                <div className={styles.console}>
                    <div className={styles.consoleHeader}>
                        Terminal
                    </div>
                    <div className={styles.content}>
                        {logs.map((log, i) => (
                            <div key={i} className={styles.logLine}>&gt; {log}</div>
                        ))}
                        {step === 0 && <div className={styles.loadingText}>Server listening on port 3000...</div>}
                    </div>
                </div>

                <div className={styles.browser}>
                    <div className={styles.browserHeader}>
                        <div className={styles.dots}>
                            <div className={`${styles.dot} ${styles.dotRed}`}></div>
                            <div className={`${styles.dot} ${styles.dotYellow}`}></div>
                            <div className={`${styles.dot} ${styles.dotGreen}`}></div>
                        </div>
                        <span>localhost:3000/</span>
                    </div>
                    <div className={`${styles.content} ${styles.browserContent}`}>
                        {response ? (
                            <div className={styles.browserPage}>
                                <h1>{response}</h1>
                            </div>
                        ) : (
                            <div className={styles.loadingText}>
                                {step > 0 && step < 6 ? <span style={{ fontSize: '2rem' }}>&#8987;</span> : 'Empty page'}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <div className={styles.controls}>
                <button
                    className={`button button--${step === 6 ? 'secondary' : 'primary'}`}
                    onClick={step === 6 ? handleReset : handleSendRequest}
                    disabled={step > 0 && step < 6}
                >
                    {step === 0 ? 'Send Request' : step === 6 ? 'Reset Simulation' : 'Processing...'}
                </button>
            </div>
        </div>
    );
}
