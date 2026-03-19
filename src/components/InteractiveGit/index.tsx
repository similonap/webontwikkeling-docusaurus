import React, { useState, useRef, useLayoutEffect } from 'react';
import styles from './styles.module.css';

type FileStatus = 'modified' | 'untracked';

interface WDFile {
    name: string;
    status: FileStatus;
}

interface StagedFile {
    name: string;
    status: FileStatus;
}

interface GitCommit {
    hash: string;
    message: string;
}

interface GitConfig {
    name: string;
    email: string;
}

interface TerminalLine {
    type: 'command' | 'output' | 'error' | 'success' | 'info';
    text: string;
}

interface GitState {
    workingDir: WDFile[];
    stagingArea: StagedFile[];
    localCommits: GitCommit[];
    remoteCommits: GitCommit[];
    config: GitConfig;
    branch: string;
}

const INITIAL_STATE: GitState = {
    workingDir: [
        { name: 'README.md', status: 'modified' },
        { name: 'nieuw_bestand.md', status: 'untracked' },
    ],
    stagingArea: [],
    localCommits: [{ hash: 'a1b2c3d', message: 'Initial commit' }],
    remoteCommits: [{ hash: 'a1b2c3d', message: 'Initial commit' }],
    config: { name: '', email: '' },
    branch: 'main',
};

const EXAMPLES = [
    { label: 'git config user.name', cmd: 'git config --global user.name "Jan Peeters"' },
    { label: 'git config user.email', cmd: 'git config --global user.email "jan@example.com"' },
    { label: 'git add README.md', cmd: 'git add README.md' },
    { label: 'git add nieuw_bestand.md', cmd: 'git add nieuw_bestand.md' },
    { label: 'git add -A', cmd: 'git add -A' },
    { label: 'git add .', cmd: 'git add .' },
    { label: 'git status', cmd: 'git status' },
    { label: 'git commit -m "..."', cmd: 'git commit -m "Eerste commit"' },
    { label: 'git push', cmd: 'git push' },
];

function randomHash(): string {
    return Math.random().toString(36).slice(2, 9);
}

function processCommand(cmd: string, state: GitState): { newState: GitState; lines: TerminalLine[] } {
    const lines: TerminalLine[] = [{ type: 'command', text: `$ ${cmd}` }];
    let newState = { ...state };

    const parts = cmd.match(/(?:[^\s"']+|"[^"]*"|'[^']*')+/g) || [];
    const unquote = (s: string) => s.replace(/^["']|["']$/g, '');

    if (parts[0] !== 'git') {
        lines.push({ type: 'error', text: `command not found: ${parts[0]}` });
        return { newState: state, lines };
    }

    const sub = parts[1];

    switch (sub) {
        case 'config': {
            const isGlobal = parts[2] === '--global';
            const key = isGlobal ? parts[3] : parts[2];
            const value = unquote(isGlobal ? (parts[4] ?? '') : (parts[3] ?? ''));

            if (key === 'user.name') {
                newState = { ...newState, config: { ...newState.config, name: value } };
                lines.push({ type: 'success', text: `user.name ingesteld op "${value}"` });
            } else if (key === 'user.email') {
                newState = { ...newState, config: { ...newState.config, email: value } };
                lines.push({ type: 'success', text: `user.email ingesteld op "${value}"` });
            } else {
                lines.push({ type: 'error', text: `Onbekende config sleutel: ${key ?? '(geen)'}` });
            }
            break;
        }

        case 'add': {
            const arg = parts[2];
            if (!arg) {
                lines.push({ type: 'error', text: 'Nothing specified, nothing added.' });
                break;
            }

            let toStage: WDFile[];
            if (arg === '-A' || arg === '.') {
                toStage = [...state.workingDir];
            } else {
                const file = state.workingDir.find(f => f.name === unquote(arg));
                if (!file) {
                    lines.push({ type: 'error', text: `fatal: pathspec '${unquote(arg)}' did not match any files` });
                    return { newState: state, lines };
                }
                toStage = [file];
            }

            if (toStage.length === 0) {
                lines.push({ type: 'output', text: 'nothing to add' });
                break;
            }

            const stagedNames = new Set(toStage.map(f => f.name));
            const newWD = state.workingDir.filter(f => !stagedNames.has(f.name));
            const existingStaged = new Set(state.stagingArea.map(f => f.name));
            const newStaged = [
                ...state.stagingArea,
                ...toStage.filter(f => !existingStaged.has(f.name)),
            ];

            toStage.forEach(f => {
                lines.push({ type: 'success', text: `staged: ${f.name}` });
            });

            newState = { ...newState, workingDir: newWD, stagingArea: newStaged };
            break;
        }

        case 'status': {
            const unsynced = state.localCommits.filter(
                c => !state.remoteCommits.find(r => r.hash === c.hash)
            );

            lines.push({ type: 'output', text: `On branch ${state.branch}` });

            if (unsynced.length > 0) {
                lines.push({ type: 'output', text: `Your branch is ahead of 'origin/${state.branch}' by ${unsynced.length} commit(s).` });
            } else {
                lines.push({ type: 'output', text: `Your branch is up to date with 'origin/${state.branch}'.` });
            }

            lines.push({ type: 'output', text: '' });

            if (state.stagingArea.length > 0) {
                lines.push({ type: 'output', text: 'Changes to be committed:' });
                lines.push({ type: 'output', text: '  (use "git restore --staged <file>..." to unstage)' });
                state.stagingArea.forEach(f => {
                    const label = f.status === 'modified' ? 'modified:  ' : 'new file:  ';
                    lines.push({ type: 'success', text: `        ${label} ${f.name}` });
                });
                lines.push({ type: 'output', text: '' });
            }

            const modified = state.workingDir.filter(f => f.status === 'modified');
            const untracked = state.workingDir.filter(f => f.status === 'untracked');

            if (modified.length > 0) {
                lines.push({ type: 'output', text: 'Changes not staged for commit:' });
                lines.push({ type: 'output', text: '  (use "git add <file>..." to update what will be committed)' });
                modified.forEach(f => {
                    lines.push({ type: 'error', text: `        modified:   ${f.name}` });
                });
                lines.push({ type: 'output', text: '' });
            }

            if (untracked.length > 0) {
                lines.push({ type: 'output', text: 'Untracked files:' });
                lines.push({ type: 'output', text: '  (use "git add <file>..." to include in what will be committed)' });
                untracked.forEach(f => {
                    lines.push({ type: 'error', text: `        ${f.name}` });
                });
                lines.push({ type: 'output', text: '' });
            }

            if (state.stagingArea.length === 0 && state.workingDir.length === 0) {
                lines.push({ type: 'output', text: 'nothing to commit, working tree clean' });
            }

            break;
        }

        case 'commit': {
            const mIdx = parts.indexOf('-m');
            const message = mIdx !== -1 ? unquote(parts[mIdx + 1] ?? '') : null;

            if (!message) {
                lines.push({ type: 'error', text: `error: switch 'm' requires a value` });
                lines.push({ type: 'output', text: `Gebruik: git commit -m "Jouw boodschap"` });
                break;
            }

            if (!state.config.name || !state.config.email) {
                lines.push({ type: 'error', text: '*** Please tell me who you are.' });
                lines.push({ type: 'error', text: 'Run:' });
                lines.push({ type: 'error', text: '  git config --global user.name "Jouw Naam"' });
                lines.push({ type: 'error', text: '  git config --global user.email "jouw@email.com"' });
                break;
            }

            if (state.stagingArea.length === 0) {
                lines.push({ type: 'output', text: `On branch ${state.branch}` });
                lines.push({ type: 'output', text: 'nothing to commit, working tree clean' });
                break;
            }

            const hash = randomHash();
            const newCommit: GitCommit = { hash, message };
            lines.push({ type: 'success', text: `[${state.branch} ${hash}] ${message}` });
            lines.push({ type: 'output', text: ` ${state.stagingArea.length} file(s) changed` });

            newState = {
                ...newState,
                stagingArea: [],
                localCommits: [...state.localCommits, newCommit],
            };
            break;
        }

        case 'push': {
            const unsynced = state.localCommits.filter(
                c => !state.remoteCommits.find(r => r.hash === c.hash)
            );

            if (unsynced.length === 0) {
                lines.push({ type: 'output', text: 'Everything up-to-date' });
                break;
            }

            const oldHash = state.remoteCommits[state.remoteCommits.length - 1].hash;
            const newHash = unsynced[unsynced.length - 1].hash;

            lines.push({ type: 'output', text: `Enumerating objects: ${unsynced.length}, done.` });
            lines.push({ type: 'output', text: `Writing objects: 100% (${unsynced.length}/${unsynced.length}), done.` });
            lines.push({ type: 'success', text: `To https://github.com/gebruiker/project.git` });
            lines.push({ type: 'success', text: `   ${oldHash}..${newHash}  ${state.branch} -> ${state.branch}` });

            newState = { ...newState, remoteCommits: [...state.localCommits] };
            break;
        }

        default:
            lines.push({ type: 'error', text: `git: '${sub}' is not a git command. See 'git --help'.` });
    }

    return { newState, lines };
}

export default function InteractiveGit() {
    const [git, setGit] = useState<GitState>(INITIAL_STATE);
    const [input, setInput] = useState('');
    const [history, setHistory] = useState<TerminalLine[]>([
        { type: 'info', text: 'Welkom! Typ een git commando of klik op een voorbeeld hieronder.' },
        { type: 'info', text: 'Begin met: git config --global user.name "Jouw Naam"' },
    ]);
    const terminalRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    useLayoutEffect(() => {
        if (terminalRef.current) {
            terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
        }
    }, [history]);

    const runCommand = (cmd: string) => {
        if (!cmd.trim()) return;
        const { newState, lines } = processCommand(cmd.trim(), git);
        setGit(newState);
        setHistory(prev => [...prev, ...lines]);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        runCommand(input);
        setInput('');
    };

    const handleReset = () => {
        setGit(INITIAL_STATE);
        setHistory([
            { type: 'info', text: 'Simulator gereset.' },
            { type: 'info', text: 'Begin met: git config --global user.name "Jouw Naam"' },
        ]);
        setInput('');
    };

    const unsyncedCount = git.localCommits.filter(
        c => !git.remoteCommits.find(r => r.hash === c.hash)
    ).length;

    return (
        <div className={styles.container}>

            {/* Git areas */}
            <div className={styles.areas}>

                {/* Working Directory */}
                <div className={styles.area}>
                    <div className={styles.areaHeader}>
                        <span>📁 Working Directory</span>
                    </div>
                    <div className={styles.areaContent}>
                        {git.workingDir.length === 0 ? (
                            <div className={styles.emptyArea}>Geen wijzigingen</div>
                        ) : (
                            git.workingDir.map(f => (
                                <div key={f.name} className={styles.file}>
                                    <span className={styles.fileName}>{f.name}</span>
                                    <span className={`${styles.badge} ${f.status === 'modified' ? styles.badgeModified : styles.badgeUntracked}`}>
                                        {f.status === 'modified' ? 'M' : '?'}
                                    </span>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                <div className={styles.arrow}>
                    <div className={styles.arrowLabel}>git add</div>
                    <div className={styles.arrowBody}>→</div>
                </div>

                {/* Staging Area */}
                <div className={styles.area}>
                    <div className={styles.areaHeader}>
                        <span>📋 Staging Area</span>
                    </div>
                    <div className={styles.areaContent}>
                        {git.stagingArea.length === 0 ? (
                            <div className={styles.emptyArea}>Geen bestanden</div>
                        ) : (
                            git.stagingArea.map(f => (
                                <div key={f.name} className={`${styles.file} ${styles.fileStaged}`}>
                                    <span className={styles.fileName}>{f.name}</span>
                                    <span className={`${styles.badge} ${styles.badgeStaged}`}>
                                        {f.status === 'modified' ? 'M' : 'A'}
                                    </span>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                <div className={styles.arrow}>
                    <div className={styles.arrowLabel}>git commit</div>
                    <div className={styles.arrowBody}>→</div>
                </div>

                {/* Local Repository */}
                <div className={styles.area}>
                    <div className={styles.areaHeader}>
                        <span>🗄️ Local Repo</span>
                        {unsyncedCount > 0 && (
                            <span className={styles.aheadBadge}>↑{unsyncedCount}</span>
                        )}
                    </div>
                    <div className={styles.areaContent}>
                        {git.localCommits.map((c, i) => (
                            <div key={c.hash} className={`${styles.commit} ${i === git.localCommits.length - 1 ? styles.commitLatest : ''}`}>
                                <span className={styles.commitHash}>{c.hash}</span>
                                <span className={styles.commitMsg}>{c.message}</span>
                            </div>
                        ))}
                    </div>
                </div>

                <div className={styles.arrow}>
                    <div className={styles.arrowLabel}>git push</div>
                    <div className={styles.arrowBody}>→</div>
                </div>

                {/* Remote Repository */}
                <div className={styles.area}>
                    <div className={styles.areaHeader}>
                        <span>☁️ Remote (GitHub)</span>
                    </div>
                    <div className={styles.areaContent}>
                        {git.remoteCommits.map((c, i) => (
                            <div key={c.hash} className={`${styles.commit} ${i === git.remoteCommits.length - 1 ? styles.commitLatest : ''}`}>
                                <span className={styles.commitHash}>{c.hash}</span>
                                <span className={styles.commitMsg}>{c.message}</span>
                            </div>
                        ))}
                    </div>
                </div>

            </div>

            {/* Git config info strip */}
            {(git.config.name || git.config.email) && (
                <div className={styles.configStrip}>
                    <span className={styles.configLabel}>git config: </span>
                    {git.config.name && <span className={styles.configValue}>{git.config.name}</span>}
                    {git.config.name && git.config.email && <span className={styles.configSep}> &lt;</span>}
                    {git.config.email && <span className={styles.configValue}>{git.config.email}</span>}
                    {git.config.name && git.config.email && <span className={styles.configSep}>&gt;</span>}
                </div>
            )}

            {/* Example command buttons */}
            <div className={styles.examples}>
                <span className={styles.examplesLabel}>Voorbeelden:</span>
                <div className={styles.exampleBtns}>
                    {EXAMPLES.map(ex => (
                        <button
                            key={ex.cmd}
                            className={styles.exampleBtn}
                            onClick={() => {
                                setInput(ex.cmd);
                                inputRef.current?.focus();
                            }}
                        >
                            {ex.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Terminal */}
            <div className={styles.terminal}>
                <div className={styles.terminalHeader}>
                    <div className={styles.dots}>
                        <div className={`${styles.dot} ${styles.dotRed}`}></div>
                        <div className={`${styles.dot} ${styles.dotYellow}`}></div>
                        <div className={`${styles.dot} ${styles.dotGreen}`}></div>
                    </div>
                    <span className={styles.terminalTitle}>Terminal — bash</span>
                    <button className={styles.resetBtn} onClick={handleReset}>Reset</button>
                </div>
                <div className={styles.terminalOutput} ref={terminalRef}>
                    {history.map((line, i) => (
                        <div key={i} className={`${styles.terminalLine} ${styles[`line_${line.type}`]}`}>
                            {line.text || '\u00A0'}
                        </div>
                    ))}
                </div>
                <form className={styles.terminalInputRow} onSubmit={handleSubmit}>
                    <span className={styles.prompt}>$</span>
                    <input
                        ref={inputRef}
                        type="text"
                        value={input}
                        onChange={e => setInput(e.target.value)}
                        className={styles.inputField}
                        placeholder="typ een git commando en druk Enter..."
                        spellCheck={false}
                        autoComplete="off"
                    />
                </form>
            </div>
        </div>
    );
}
