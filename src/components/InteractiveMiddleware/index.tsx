import React, { useState, useEffect } from 'react';
import styles from './styles.module.css';

const DEFAULT_CODE = `app.use((req, res, next) => {
  console.log(\`\${req.method} \${req.path}\`);
  next();
});

app.get('/', (req, res) => {
  res.send('Hello World');
});`;

type SimulationEvent =
    | { type: 'system', text: string, nodeId?: string }
    | { type: 'log', level: 'info' | 'error', text: string }
    | { type: 'response', body: string, nodeId?: string }
    | { type: 'timeout', nodeId?: string }
    | { type: 'done' };

interface PipelineNode {
    id: string;
    label: string;
    type: 'client' | 'middleware' | 'route' | 'response';
}

export default function InteractiveMiddleware() {
    const [code, setCode] = useState(DEFAULT_CODE);
    const [events, setEvents] = useState<SimulationEvent[]>([]);
    const [stepIndex, setStepIndex] = useState(-1);
    const [isPlaying, setIsPlaying] = useState(false);
    const [pipelineNodes, setPipelineNodes] = useState<PipelineNode[]>([]);
    const [urlPath, setUrlPath] = useState('/');
    const [urlInput, setUrlInput] = useState('/');

    // Derived UI state
    const visibleEvents = stepIndex >= 0 ? events.slice(0, stepIndex + 1) : [];

    const logs = visibleEvents.filter(e => e.type === 'log' || e.type === 'system') as any[];
    const responseEvent = visibleEvents.find(e => e.type === 'response') as Extract<SimulationEvent, { type: 'response' }> | undefined;
    const timeoutEvent = visibleEvents.find(e => e.type === 'timeout');
    const isDone = visibleEvents.some(e => e.type === 'done');

    const getActiveNodeId = () => {
        if (stepIndex === -1) return null;
        for (let i = stepIndex; i >= 0; i--) {
            const ev = events[i];
            if ('nodeId' in ev && ev.nodeId) return ev.nodeId;
        }
        return null;
    };

    const activeNodeId = getActiveNodeId();

    useEffect(() => {
        let timer: NodeJS.Timeout;
        if (isPlaying && stepIndex < events.length - 1) {
            timer = setTimeout(() => {
                setStepIndex(prev => prev + 1);
            }, 800);
        } else if (isPlaying && stepIndex >= events.length - 1) {
            setIsPlaying(false);
        }
        return () => clearTimeout(timer);
    }, [isPlaying, stepIndex, events.length]);

    const handleCodeChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setCode(e.target.value);
        resetSimulation();
    };

    const resetSimulation = () => {
        setEvents([]);
        setStepIndex(-1);
        setIsPlaying(false);
        setPipelineNodes([]);
    };

    const compileAndRecord = (path: string): SimulationEvent[] => {
        const newEvents: SimulationEvent[] = [];
        let responseSent = false;
        const middlewares: Function[] = [];
        const routes: { path: string, id: string, fn: Function }[] = [];

        const discoveredNodes: PipelineNode[] = [
            { id: 'client', label: 'Client Request', type: 'client' }
        ];

        const mockApp = {
            use: (fn: Function) => {
                const id = `mw-${middlewares.length}`;
                const label = fn.name || `Middleware ${middlewares.length + 1}`;
                discoveredNodes.push({ id, label, type: 'middleware' });
                middlewares.push((req: any, res: any, next: any) => {
                    newEvents.push({ type: 'system', text: `[${label}] executing...`, nodeId: id });
                    fn(req, res, next);
                });
            },
            get: (path: string, fn: Function) => {
                const id = 'route-handler';
                if (!discoveredNodes.find(n => n.id === id)) {
                    discoveredNodes.push({ id, label: 'Route Handler', type: 'route' });
                }
                routes.push({
                    path,
                    id,
                    fn: (req: any, res: any) => {
                        newEvents.push({ type: 'system', text: `[Route Handler] executing for '${path}'...`, nodeId: id });
                        fn(req, res);
                    }
                });
            }
        };

        const mockConsole = {
            log: (...args: any[]) => newEvents.push({ type: 'log', level: 'info', text: args.join(' ') }),
            error: (...args: any[]) => newEvents.push({ type: 'log', level: 'error', text: args.join(' ') }),
        };

        try {
            const evaluator = new Function('app', 'console', code);
            evaluator(mockApp, mockConsole);
            discoveredNodes.push({ id: 'response', label: 'Response', type: 'response' });
            setPipelineNodes(discoveredNodes);
        } catch (err: any) {
            newEvents.push({ type: 'log', level: 'error', text: `Syntax Error: ${err.message}` });
            newEvents.push({ type: 'done' });
            return newEvents;
        }

        const req = { method: 'GET', path: path };
        const res = {
            send: (body: string) => {
                if (responseSent) return;
                responseSent = true;
                newEvents.push({ type: 'system', text: `res.send() called.`, nodeId: 'response' });
                newEvents.push({ type: 'response', body, nodeId: 'response' });
                newEvents.push({ type: 'done' });
            },
            json: (body: any) => {
                if (responseSent) return;
                responseSent = true;
                newEvents.push({ type: 'system', text: `res.json() called.`, nodeId: 'response' });
                newEvents.push({ type: 'response', body: JSON.stringify(body, null, 2), nodeId: 'response' });
                newEvents.push({ type: 'done' });
            },
            status: () => res
        };

        let currentLayer = 0;

        const processNext = () => {
            if (responseSent) return;

            if (currentLayer < middlewares.length) {
                const mw = middlewares[currentLayer++];
                try {
                    mw(req, res, next);
                } catch (e: any) {
                    newEvents.push({ type: 'log', level: 'error', text: `Middleware Error: ${e.message}` });
                }
            } else {
                const route = routes.find(r => r.path === req.path);
                if (route) {
                    try {
                        route.fn(req, res);
                    } catch (e: any) {
                        newEvents.push({ type: 'log', level: 'error', text: `Route Error: ${e.message}` });
                    }
                } else {
                    newEvents.push({ type: 'system', text: `No routes matched requested path.`, nodeId: 'response' });
                    newEvents.push({ type: 'response', body: '404 Not Found', nodeId: 'response' });
                    newEvents.push({ type: 'done' });
                    responseSent = true;
                }
            }
        };

        const next = () => {
            if (responseSent) return;
            newEvents.push({ type: 'system', text: `next() called.` });
            processNext();
        };

        // Start request
        newEvents.push({ type: 'system', text: `--- Incoming Request: GET ${path} ---`, nodeId: 'client' });
        processNext();

        if (!responseSent) {
            // Find current node for timeout
            let lastNodeId = 'client';
            for (let i = newEvents.length - 1; i >= 0; i--) {
                const e = newEvents[i];
                if ('nodeId' in e && e.nodeId) {
                    lastNodeId = e.nodeId;
                    break;
                }
            }
            newEvents.push({ type: 'timeout', nodeId: lastNodeId });
            newEvents.push({ type: 'done' });
        }

        return newEvents;
    };

    const startSimulation = (path: string, autoPlay: boolean) => {
        const recorded = compileAndRecord(path);
        setEvents(recorded);
        setStepIndex(0);
        if (autoPlay) {
            setIsPlaying(true);
        }
    };

    const handleStep = () => {
        if (events.length === 0) {
            startSimulation(urlInput, false);
        } else if (stepIndex < events.length - 1) {
            setStepIndex(prev => prev + 1);
        }
    };

    const handlePlayPause = () => {
        if (events.length === 0) {
            startSimulation(urlInput, true);
        } else if (stepIndex >= events.length - 1) {
            startSimulation(urlInput, true);
        } else {
            setIsPlaying(prev => !prev);
        }
    };

    const lineCount = code.split('\n').length;

    return (
        <div className={styles.container}>
            <div className={styles.pipeline}>
                {pipelineNodes.length > 0 ? (
                    pipelineNodes.map((node, i) => (
                        <React.Fragment key={node.id}>
                            <div
                                className={`${styles.pipelineNode} ${activeNodeId === node.id ? styles.pipelineNodeActive : ''} ${timeoutEvent && activeNodeId === node.id ? styles.pipelineNodeTimeout : ''}`}
                            >
                                {node.label}
                            </div>
                            {i < pipelineNodes.length - 1 && (
                                <div className={`${styles.pipelineEdge} ${activeNodeId === pipelineNodes[i + 1].id || (activeNodeId === node.id && !timeoutEvent) || pipelineNodes.findIndex(n => n.id === activeNodeId) > i ? styles.pipelineEdgeActive : ''}`}></div>
                            )}
                        </React.Fragment>
                    ))
                ) : (
                    <>
                        <div className={styles.pipelineNode}>Client Request</div>
                        <div className={styles.pipelineEdge}></div>
                        <div className={styles.pipelineNode}>Middleware</div>
                        <div className={styles.pipelineEdge}></div>
                        <div className={styles.pipelineNode}>Route Handler</div>
                        <div className={styles.pipelineEdge}></div>
                        <div className={styles.pipelineNode}>Response</div>
                    </>
                )}
            </div>

            <div className={styles.editorContainer}>
                <div className={styles.editorHeader}>
                    <span>server.ts (Editable)</span>
                    <button className={styles.resetBtn} onClick={() => { setCode(DEFAULT_CODE); resetSimulation(); }}>Reset Code</button>
                </div>
                <div className={styles.editorContent}>
                    <div className={styles.lineNumbers}>
                        {Array.from({ length: lineCount }).map((_, i) => (
                            <div key={i} className={styles.lineNumber}>{i + 1}</div>
                        ))}
                    </div>
                    <div className={styles.textAreaContainer}>
                        <textarea
                            className={styles.codeTextarea}
                            value={code}
                            onChange={handleCodeChange}
                            spellCheck={false}
                            disabled={isPlaying}
                        />
                    </div>
                </div>
            </div>

            <div className={styles.simulators}>
                <div className={styles.console}>
                    <div className={styles.consoleHeader}>
                        Terminal
                    </div>
                    <div className={styles.content}>
                        {logs.map((log, i) => (
                            <div key={i} className={`${styles.logLine} ${log.level === 'error' ? styles.logError : ''} ${log.type === 'system' ? styles.logSystem : ''}`}>
                                {log.type === 'system' ? `[sys] ${log.text}` : `> ${log.text}`}
                            </div>
                        ))}
                        {isPlaying && !isDone && <div className={styles.loadingText}>Executing...</div>}
                    </div>
                </div>

                <div className={styles.browser}>
                    <div className={styles.browserHeader}>
                        <div className={styles.dots}>
                            <div className={`${styles.dot} ${styles.dotRed}`}></div>
                            <div className={`${styles.dot} ${styles.dotYellow}`}></div>
                            <div className={`${styles.dot} ${styles.dotGreen}`}></div>
                        </div>
                        <div className={styles.browserActions}>
                            <button
                                className={styles.navButton}
                                onClick={() => { setUrlPath(urlInput); startSimulation(urlInput, true); }}
                                title="Refresh / Go"
                            >
                                {isPlaying ? '⏹' : '⟳'}
                            </button>
                            <button
                                className={styles.navButton}
                                onClick={handleStep}
                                disabled={isPlaying || isDone}
                                title="Step Next"
                            >
                                ➔
                            </button>
                        </div>
                        <div className={styles.addressBar}>
                            <span className={styles.protocol}>localhost:3000</span>
                            <input
                                type="text"
                                className={styles.addressInput}
                                value={urlInput}
                                onChange={(e) => setUrlInput(e.target.value)}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter') {
                                        setUrlPath(urlInput);
                                        startSimulation(urlInput, true);
                                    }
                                }}
                                disabled={isPlaying || (stepIndex > -1 && !isDone)}
                            />
                        </div>
                    </div>
                    <div className={`${styles.content} ${styles.browserContent}`}>
                        {responseEvent ? (
                            <div className={styles.browserPage}>
                                <h1>{responseEvent.body}</h1>
                            </div>
                        ) : timeoutEvent ? (
                            <div className={styles.browserPage}>
                                <div>
                                    <h1 style={{ color: '#ff5f56', fontSize: '1.2rem' }}>&#9888;&#65039; Request Timed Out</h1>
                                    <p>The browser is spinning forever.<br />Did you forget to call <code>next()</code> or <code>res.send()</code>?</p>
                                </div>
                            </div>
                        ) : (
                            <div className={styles.loadingText}>
                                {stepIndex > -1 && !isDone ? (
                                    <div className={styles.spinner}>
                                        <div className={styles.loadingIcon}>&#8987;</div>
                                        <div>Waiting for response...</div>
                                    </div>
                                ) : 'Press Enter in the address bar to send a request'}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
