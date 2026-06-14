import React, { useEffect, useMemo, useState } from 'react';
import { withMaximize } from '../shared/Maximizable';
import styles from './styles.module.css';

const SERVER_LINES = [
  'app.get("/hello", (req, res) => {',
  '  const name = req.query.name;',
  '  res.render("hello", { name: name });',
  '});',
];

const EJS_LINES = [
  '<html>',
  '  <body>',
  '    <h1><%= name %></h1>',
  "    <button onclick=\"alert('Hallo!')\">",
  '      Klik mij',
  '    </button>',
  '  </body>',
  '</html>',
];

type Zone = 'client' | 'network' | 'server';

interface Step {
  zone: Zone;
  badge: string;
  title: string;
  description: string;
  browser: 'start' | 'loading' | 'page' | 'notfound';
  packet?: { dir: 'toServer' | 'toClient'; label: string };
  serverLine?: number;
  ejsLine?: number;
  htmlLine?: number;
  htmlBuilt?: boolean;
  valueBubble?: string;
  awaitClick?: boolean;
}

interface Simulation {
  steps: Step[];
  name: string | null;
  path: string;
  input: string;
}

function buildSimulation(input: string): Simulation {
  const qIndex = input.indexOf('?');
  const path = (qIndex === -1 ? input : input.slice(0, qIndex)) || '/';
  const query = qIndex === -1 ? '' : input.slice(qIndex + 1);
  const name = new URLSearchParams(query).get('name');
  const nameShown = name === null ? 'undefined' : `"${name}"`;

  const steps: Step[] = [
    {
      zone: 'client',
      badge: 'CLIENT',
      browser: 'loading',
      title: 'De browser verstuurt een request',
      description: `Je typt ${input} in de adresbalk en drukt op Enter. De browser maakt een HTTP GET-request. Op dit moment is er nog geen enkele regel van onze server-code uitgevoerd.`,
    },
    {
      zone: 'network',
      badge: 'NETWERK',
      browser: 'loading',
      packet: { dir: 'toServer', label: `GET ${input}` },
      title: 'De request reist naar de server',
      description: 'De HTTP-request verlaat de browser en reist over het netwerk naar onze Node.js-server op localhost:3000.',
    },
  ];

  if (path !== '/hello') {
    steps.push(
      {
        zone: 'server',
        badge: 'SERVER',
        browser: 'loading',
        title: 'Express vindt geen route',
        description: `Express vergelijkt het pad ${path} met alle geregistreerde routes. Er is enkel app.get("/hello", ...), dus geen enkele route komt overeen. Express antwoordt met 404 Not Found.`,
      },
      {
        zone: 'network',
        badge: 'NETWERK',
        browser: 'loading',
        packet: { dir: 'toClient', label: '404 Not Found' },
        title: 'De foutmelding reist terug',
        description: 'De server stuurt een 404-antwoord terug naar de browser.',
      },
      {
        zone: 'client',
        badge: 'CLIENT',
        browser: 'notfound',
        title: 'De browser toont de foutpagina',
        description: `De browser toont "Cannot GET ${path}". Probeer opnieuw met /hello?name=Joske.`,
      }
    );
    return { steps, name, path, input };
  }

  steps.push(
    {
      zone: 'server',
      badge: 'SERVER',
      browser: 'loading',
      serverLine: 0,
      title: 'Express matcht de route',
      description: 'De server ontvangt de request. Express vergelijkt het pad /hello met de geregistreerde routes en voert de bijbehorende handler-functie uit. Alles wat nu volgt, gebeurt op de server.',
    },
    {
      zone: 'server',
      badge: 'SERVER',
      browser: 'loading',
      serverLine: 1,
      valueBubble: `name = ${nameShown}`,
      title: 'De query parameter wordt uitgelezen',
      description:
        name === null
          ? 'req.query.name wordt uitgelezen, maar de URL bevat geen ?name=... — de variabele is dus undefined. Kijk straks wat daarvan in de HTML terechtkomt!'
          : `req.query.name bevat de waarde uit de URL: ${nameShown}. Deze TypeScript-code draait op de server — de browser weet hier niets van.`,
    },
    {
      zone: 'server',
      badge: 'SERVER',
      browser: 'loading',
      serverLine: 2,
      title: 'res.render() geeft de data door aan EJS',
      description: `res.render("hello", { name: name }) zoekt de template views/hello.ejs en geeft het object { name: ${nameShown} } mee. Nog steeds 100% server-side.`,
    },
    {
      zone: 'server',
      badge: 'SERVER',
      browser: 'loading',
      ejsLine: 2,
      title: 'EJS vult de template in',
      description: `EJS loopt door views/hello.ejs en komt de placeholder <%= name %> tegen. Die moet vervangen worden door de waarde uit het data-object: ${nameShown}.`,
    },
    {
      zone: 'server',
      badge: 'SERVER',
      browser: 'loading',
      htmlBuilt: true,
      htmlLine: 2,
      title: 'De template wordt pure HTML',
      description: `<%= name %> is vervangen door ${nameShown}. De template is nu omgezet naar pure HTML-tekst. Let op: de <button> met onclick is voor de server gewoon tekst — er wordt hier niets uitgevoerd.`,
    },
    {
      zone: 'network',
      badge: 'NETWERK',
      browser: 'loading',
      htmlBuilt: true,
      packet: { dir: 'toClient', label: '200 OK + HTML' },
      title: 'De kant-en-klare HTML reist terug',
      description: 'De server stuurt de gegenereerde HTML als antwoord. Het werk van de server zit er nu volledig op: geen EJS, geen TypeScript — enkel pure HTML verlaat de server.',
    },
    {
      zone: 'client',
      badge: 'CLIENT',
      browser: 'page',
      htmlBuilt: true,
      title: 'De browser rendert de HTML',
      description: 'De browser ontvangt de HTML en tekent de pagina. Bekijk je de broncode (view-source), dan zie je enkel de ingevulde HTML — geen spoor van <%= name %> of req.query.',
    },
    {
      zone: 'client',
      badge: 'CLIENT',
      browser: 'page',
      htmlBuilt: true,
      awaitClick: true,
      title: 'Klik zelf op de knop in de browser!',
      description: 'De pagina staat nu volledig in de browser. Klik op "Klik mij" en let goed op het netwerk en de server...',
    }
  );

  return { steps, name, path, input };
}

function CodeCard({
  filename,
  tag,
  tagKind,
  lines,
  highlight,
  bubble,
}: {
  filename: string;
  tag: string;
  tagKind: 'server' | 'client';
  lines: React.ReactNode[];
  highlight?: number;
  bubble?: string;
}) {
  return (
    <div className={styles.fileCard}>
      <div className={styles.fileHeader}>
        <span className={styles.fileName}>{filename}</span>
        <span className={`${styles.fileTag} ${tagKind === 'server' ? styles.fileTagServer : styles.fileTagClient}`}>
          {tag}
        </span>
      </div>
      <pre className={styles.code}>
        {lines.map((line, i) => (
          <div key={i} className={`${styles.codeLine} ${highlight === i ? styles.codeLineActive : ''}`}>
            <span className={styles.lineNo}>{i + 1}</span>
            <span className={styles.lineText}>{line}</span>
            {highlight === i && bubble && <span className={styles.valueBubble}>{bubble}</span>}
          </div>
        ))}
      </pre>
    </div>
  );
}

function InteractiveClientServer() {
  const [urlInput, setUrlInput] = useState('/hello?name=Joske');
  const [sim, setSim] = useState<Simulation | null>(null);
  const [stepIndex, setStepIndex] = useState(-1);
  const [isPlaying, setIsPlaying] = useState(false);
  const [alertOpen, setAlertOpen] = useState(false);
  const [hasClicked, setHasClicked] = useState(false);

  const steps = sim?.steps ?? [];
  const current = stepIndex >= 0 ? steps[stepIndex] : undefined;
  const isLastStep = sim !== null && stepIndex >= steps.length - 1;
  const displayName = sim ? sim.name ?? 'undefined' : 'Joske';

  // The button was clicked: everything happens client-side now
  const clientSideMode = alertOpen || (hasClicked && current?.awaitClick === true);
  const activeZone: Zone | null = clientSideMode ? 'client' : current?.zone ?? null;

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;
    if (isPlaying && stepIndex < steps.length - 1) {
      timer = setTimeout(() => setStepIndex((prev) => prev + 1), 2800);
    } else if (isPlaying) {
      setIsPlaying(false);
    }
    return () => clearTimeout(timer);
  }, [isPlaying, stepIndex, steps.length]);

  const start = () => {
    setSim(buildSimulation(urlInput.trim() || '/'));
    setStepIndex(0);
    setIsPlaying(true);
    setAlertOpen(false);
    setHasClicked(false);
  };

  const reset = () => {
    setSim(null);
    setStepIndex(-1);
    setIsPlaying(false);
    setAlertOpen(false);
    setHasClicked(false);
  };

  const goPrev = () => {
    setIsPlaying(false);
    setAlertOpen(false);
    setHasClicked(false);
    setStepIndex((prev) => Math.max(0, prev - 1));
  };

  const goNext = () => {
    setIsPlaying(false);
    setStepIndex((prev) => Math.min(steps.length - 1, prev + 1));
  };

  const handlePlayPause = () => {
    if (!sim || isLastStep) {
      start();
    } else {
      setIsPlaying((prev) => !prev);
    }
  };

  const handleButtonClick = () => {
    setAlertOpen(true);
    setHasClicked(true);
    setIsPlaying(false);
  };

  const htmlCardLines: React.ReactNode[] = useMemo(
    () => [
      '<html>',
      '  <body>',
      <React.Fragment key="h1">
        {'    <h1>'}
        <span className={styles.substituted}>{displayName}</span>
        {'</h1>'}
      </React.Fragment>,
      "    <button onclick=\"alert('Hallo!')\">",
      '      Klik mij',
      '    </button>',
      '  </body>',
      '</html>',
    ],
    [displayName]
  );

  const browserState = current?.browser ?? 'start';

  return (
    <div className={styles.container}>
      <div className={styles.zones}>
        {/* ─── CLIENT ─── */}
        <div className={`${styles.zone} ${styles.zoneClient} ${activeZone === 'client' ? styles.zoneClientActive : ''}`}>
          <div className={`${styles.zoneHeader} ${styles.zoneHeaderClient}`}>
            🖥️ CLIENT — browser van de gebruiker
          </div>
          <div className={styles.browser}>
            <div className={styles.browserBar}>
              <div className={styles.dots}>
                <div className={`${styles.dot} ${styles.dotRed}`} />
                <div className={`${styles.dot} ${styles.dotYellow}`} />
                <div className={`${styles.dot} ${styles.dotGreen}`} />
              </div>
              <div className={styles.addressBar}>
                <span className={styles.protocol}>localhost:3000</span>
                <input
                  type="text"
                  className={styles.addressInput}
                  value={urlInput}
                  onChange={(e) => setUrlInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') start();
                  }}
                  disabled={isPlaying}
                />
              </div>
              <button className={styles.goBtn} onClick={start} title="Verstuur request">
                ⟳
              </button>
            </div>
            <div className={styles.browserContent}>
              {browserState === 'start' && (
                <div className={styles.browserHint}>
                  Typ een URL en druk op Enter
                  <br />
                  (of klik op ▶ Start)
                </div>
              )}
              {browserState === 'loading' && (
                <div className={styles.browserHint}>
                  <div className={styles.loadingIcon} />
                  Wachten op de server...
                </div>
              )}
              {browserState === 'notfound' && (
                <div className={styles.notFound}>Cannot GET {sim?.path}</div>
              )}
              {browserState === 'page' && (
                <div className={styles.page}>
                  <h1 className={styles.pageTitle}>{displayName}</h1>
                  <button
                    className={`${styles.pageButton} ${current?.awaitClick && !hasClicked ? styles.pageButtonPulse : ''}`}
                    onClick={handleButtonClick}
                    disabled={!current?.awaitClick}
                  >
                    Klik mij
                  </button>
                  {hasClicked && !alertOpen && (
                    <div className={styles.clientSideBadge}>
                      ✓ alert() gebeurde 100% in de browser
                    </div>
                  )}
                </div>
              )}
              {alertOpen && (
                <div className={styles.alertBackdrop}>
                  <div className={styles.alertBox}>
                    <div className={styles.alertHeader}>localhost:3000 meldt</div>
                    <div className={styles.alertBody}>Hallo!</div>
                    <div className={styles.alertFooter}>
                      <button className={styles.alertOk} onClick={() => setAlertOpen(false)}>
                        OK
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* ─── NETWERK ─── */}
        <div className={`${styles.networkLane} ${activeZone === 'network' ? styles.networkLaneActive : ''}`}>
          <div className={styles.networkLabel}>NETWERK</div>
          {current?.packet && !clientSideMode ? (
            <>
              <div className={styles.packetLabel}>{current.packet.label}</div>
              <div className={`${styles.flowTrack} ${current.packet.dir === 'toClient' ? styles.flowTrackLeft : ''}`}>
                <div className={styles.flowLine} />
                <div className={styles.flowHead} />
              </div>
            </>
          ) : clientSideMode ? (
            <div className={styles.noTraffic}>
              🚫
              <br />0 requests
            </div>
          ) : (
            <div className={styles.networkIdle}>—</div>
          )}
        </div>

        {/* ─── SERVER ─── */}
        <div
          className={`${styles.zone} ${styles.zoneServer} ${activeZone === 'server' ? styles.zoneServerActive : ''} ${clientSideMode ? styles.zoneAsleep : ''}`}
        >
          <div className={`${styles.zoneHeader} ${styles.zoneHeaderServer}`}>
            ⚙️ SERVER — Node.js + Express
            {clientSideMode && <span className={styles.asleepBadge}>💤 merkt hier niets van</span>}
          </div>
          <CodeCard
            filename="server.ts"
            tag="draait op de server"
            tagKind="server"
            lines={SERVER_LINES}
            highlight={clientSideMode ? undefined : current?.serverLine}
            bubble={current?.valueBubble}
          />
          <div className={styles.flipBox}>
            <div className={`${styles.flipInner} ${current?.htmlBuilt ? styles.flipped : ''}`}>
              <div className={styles.flipFront}>
                <CodeCard
                  filename="views/hello.ejs"
                  tag="draait op de server"
                  tagKind="server"
                  lines={EJS_LINES}
                  highlight={clientSideMode ? undefined : current?.ejsLine}
                />
              </div>
              <div className={styles.flipBack}>
                <CodeCard
                  filename="HTML output"
                  tag="gaat naar de client"
                  tagKind="client"
                  lines={htmlCardLines}
                  highlight={clientSideMode ? undefined : current?.htmlLine}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ─── Uitleg huidige stap ─── */}
      <div className={styles.stepBar}>
        {clientSideMode ? (
          <>
            <span className={`${styles.zoneBadge} ${styles.zoneBadgeClient}`}>CLIENT</span>
            <div className={styles.stepText}>
              <div className={styles.stepTitle}>alert() — 100% client-side</div>
              <div className={styles.stepDescription}>
                De onclick-handler wordt volledig in de browser uitgevoerd. Kijk naar het netwerk: er
                vertrok geen enkele request naar de server. De server weet niet eens dat je geklikt hebt.
              </div>
            </div>
          </>
        ) : current ? (
          <>
            <span
              className={`${styles.zoneBadge} ${
                current.zone === 'client'
                  ? styles.zoneBadgeClient
                  : current.zone === 'server'
                  ? styles.zoneBadgeServer
                  : styles.zoneBadgeNetwork
              }`}
            >
              {current.badge}
            </span>
            <div className={styles.stepText}>
              <div className={styles.stepTitle}>
                Stap {stepIndex + 1}/{steps.length} — {current.title}
              </div>
              <div className={styles.stepDescription}>{current.description}</div>
            </div>
          </>
        ) : (
          <div className={styles.stepText}>
            <div className={styles.stepDescription}>
              Volg een request van de browser, door de server, en weer terug. Druk op ▶ Start en let bij
              elke stap op <strong>waar</strong> de code wordt uitgevoerd.
            </div>
          </div>
        )}
      </div>

      {/* ─── Controls ─── */}
      <div className={styles.controls}>
        <button className={styles.playBtn} onClick={handlePlayPause}>
          {!sim || isLastStep ? '▶ Start' : isPlaying ? '⏸ Pauze' : '▶ Verder'}
        </button>
        <button className={styles.stepBtn} onClick={goPrev} disabled={!sim || stepIndex <= 0}>
          ⟵ Vorige
        </button>
        <button className={styles.stepBtn} onClick={goNext} disabled={!sim || isLastStep}>
          Volgende ⟶
        </button>
        <button className={styles.resetBtn} onClick={reset} disabled={!sim}>
          Reset
        </button>
        {sim && (
          <div className={styles.progressDots}>
            {steps.map((s, i) => (
              <div
                key={i}
                className={`${styles.progressDot} ${
                  s.zone === 'client'
                    ? styles.progressDotClient
                    : s.zone === 'server'
                    ? styles.progressDotServer
                    : styles.progressDotNetwork
                } ${i === stepIndex ? styles.progressDotActive : ''} ${i > stepIndex ? styles.progressDotFuture : ''}`}
                title={s.title}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default withMaximize(InteractiveClientServer);
