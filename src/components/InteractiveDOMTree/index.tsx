import React, { useEffect, useMemo, useRef, useState } from 'react';
import { withMaximize } from '../shared/Maximizable';
import styles from './styles.module.css';

// ─── Eenvoudige HTML syntax highlighter ──────────────────────────────
// We kleuren de HTML in de editor in door een gekleurde <pre>-laag áchter
// een transparante <textarea> te leggen. Onderstaande functie zet HTML-tekst
// om naar gekleurde <span>'s (kleuren via de CSS-variabelen van de container).
const COL = {
  punct: 'var(--dom-muted)',
  tag: 'var(--dom-element)',
  attr: 'var(--dom-attribute)',
  str: 'var(--dom-text-node)',
  comment: 'var(--dom-comment)',
};

function esc(s: string): string {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function span(color: string, text: string): string {
  return `<span style="color:${color}">${text}</span>`;
}

function highlightAttrs(s: string): string {
  let out = '';
  let last = 0;
  const re = /([a-zA-Z_:][\w:.-]*)|("[^"]*"|'[^']*')|(=)|(\s+)/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(s))) {
    out += esc(s.slice(last, m.index));
    if (m[1]) out += span(COL.attr, esc(m[1]));
    else if (m[2]) out += span(COL.str, esc(m[2]));
    else if (m[3]) out += span(COL.punct, '=');
    else out += m[4]; // witruimte
    last = re.lastIndex;
  }
  out += esc(s.slice(last));
  return out;
}

function highlightTag(tok: string): string {
  const m = /^(<\/?)([a-zA-Z][\w-]*)([\s\S]*?)(\/?>)$/.exec(tok);
  if (!m) return esc(tok);
  return (
    span(COL.punct, esc(m[1])) +
    span(COL.tag, esc(m[2])) +
    highlightAttrs(m[3]) +
    span(COL.punct, esc(m[4]))
  );
}

function highlightHtml(code: string): string {
  let out = '';
  let last = 0;
  const re = /<!--[\s\S]*?-->|<![a-zA-Z][^>]*>|<\/?[a-zA-Z][^>]*?\/?>/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(code))) {
    out += esc(code.slice(last, m.index));
    const tok = m[0];
    if (tok.startsWith('<!--')) out += span(COL.comment, esc(tok));
    else if (/^<!/.test(tok)) out += span(COL.punct, esc(tok)); // <!DOCTYPE ...>
    else out += highlightTag(tok);
    last = re.lastIndex;
  }
  out += esc(code.slice(last));
  return out;
}

// Het voorbeeld uit client-side-javascript.md
const EXAMPLE_HTML = `<!DOCTYPE html>
<html>
  <head>
    <title>Mijn Webpagina</title>
  </head>
  <body>
    <h1>Welkom!</h1>
    <p id="intro">Dit is mijn eerste webpagina.</p>
    <button onclick="veranderTekst()">Klik hier</button>
  </body>
</html>`;

type NodeKind = 'element' | 'text' | 'comment' | 'attribute';

interface TreeNode {
  id: string;
  kind: NodeKind;
  // element
  tag?: string;
  domType?: string; // bv. "HTMLButtonElement", "HTMLHeadingElement"
  attrs?: { name: string; value: string }[];
  // text / comment / attribute value
  text?: string;
  // attribute
  attrName?: string;
  children: TreeNode[];
}

interface BuildOptions {
  showWhitespace: boolean;
  attrsAsNodes: boolean;
}

// Bouw onze eigen, eenvoudige boom uit een echte DOM-node, zodat we hem
// volledig in de hand hebben (kleuren, in-/uitklappen, detailpaneel).
function buildTree(domNode: Node, opts: BuildOptions, path: string): TreeNode | null {
  // Element
  if (domNode.nodeType === Node.ELEMENT_NODE) {
    const el = domNode as Element;
    const attrs = Array.from(el.attributes).map((a) => ({ name: a.name, value: a.value }));

    const children: TreeNode[] = [];

    // Attributen kunnen we ook als aparte nodes tonen (in de echte DOM zijn
    // attributen immers ook nodes).
    if (opts.attrsAsNodes) {
      attrs.forEach((a, i) => {
        children.push({
          id: `${path}-attr-${i}`,
          kind: 'attribute',
          attrName: a.name,
          text: a.value,
          children: [],
        });
      });
    }

    Array.from(el.childNodes).forEach((child, i) => {
      const built = buildTree(child, opts, `${path}-${i}`);
      if (built) children.push(built);
    });

    return {
      id: path,
      kind: 'element',
      tag: el.tagName.toLowerCase(),
      domType: el.constructor?.name,
      attrs,
      children,
    };
  }

  // Tekst
  if (domNode.nodeType === Node.TEXT_NODE) {
    const raw = domNode.textContent ?? '';
    const isWhitespace = raw.trim().length === 0;
    if (isWhitespace && !opts.showWhitespace) return null;
    return {
      id: path,
      kind: 'text',
      text: isWhitespace ? '⎵ witruimte' : raw.trim(),
      children: [],
    };
  }

  // Commentaar
  if (domNode.nodeType === Node.COMMENT_NODE) {
    return {
      id: path,
      kind: 'comment',
      text: domNode.textContent ?? '',
      children: [],
    };
  }

  return null;
}

const KIND_META: Record<NodeKind, { label: string; cls: string }> = {
  element: { label: 'Element', cls: styles.kindElement },
  text: { label: 'Tekst', cls: styles.kindText },
  comment: { label: 'Commentaar', cls: styles.kindComment },
  attribute: { label: 'Attribuut', cls: styles.kindAttribute },
};

function NodeRow({
  node,
  depth,
  collapsed,
  hovered,
  selected,
  onToggle,
  onHover,
  onSelect,
}: {
  node: TreeNode;
  depth: number;
  collapsed: Set<string>;
  hovered: string | null;
  selected: string | null;
  onToggle: (id: string) => void;
  onHover: (id: string | null) => void;
  onSelect: (id: string) => void;
}) {
  const hasChildren = node.children.length > 0;
  const isCollapsed = collapsed.has(node.id);
  const meta = KIND_META[node.kind];

  const isHovered = hovered === node.id;
  const isSelected = selected === node.id;

  let label: React.ReactNode;
  if (node.kind === 'element') {
    label = (
      <>
        <span className={styles.bracket}>&lt;</span>
        <span className={styles.tagName}>{node.tag}</span>
        {!isCollapsed &&
          node.attrs?.map((a) => (
            <span key={a.name} className={styles.attrChip}>
              <span className={styles.attrChipName}>{a.name}</span>
              {a.value !== '' && (
                <>
                  <span className={styles.attrChipEq}>=</span>
                  <span className={styles.attrChipValue}>"{a.value}"</span>
                </>
              )}
            </span>
          ))}
        <span className={styles.bracket}>&gt;</span>
        {node.domType && <span className={styles.typeBadge}>{node.domType}</span>}
      </>
    );
  } else if (node.kind === 'attribute') {
    label = (
      <>
        <span className={styles.attrChipName}>{node.attrName}</span>
        <span className={styles.attrChipEq}>=</span>
        <span className={styles.attrChipValue}>"{node.text}"</span>
      </>
    );
  } else if (node.kind === 'comment') {
    label = <span className={styles.commentText}>&lt;!-- {node.text} --&gt;</span>;
  } else {
    label = <span className={styles.textText}>"{node.text}"</span>;
  }

  return (
    <>
      <div
        className={`${styles.row} ${isHovered ? styles.rowHovered : ''} ${isSelected ? styles.rowSelected : ''}`}
        style={{ paddingLeft: `${depth * 1.4 + 0.4}rem` }}
        onMouseEnter={() => onHover(node.id)}
        onMouseLeave={() => onHover(null)}
        onClick={() => onSelect(node.id)}
      >
        {hasChildren ? (
          <button
            type="button"
            className={styles.caret}
            onClick={(e) => {
              e.stopPropagation();
              onToggle(node.id);
            }}
            aria-label={isCollapsed ? 'Uitklappen' : 'Inklappen'}
          >
            {isCollapsed ? '▶' : '▼'}
          </button>
        ) : (
          <span className={styles.caretSpacer}>•</span>
        )}
        <span className={`${styles.kindDot} ${meta.cls}`} />
        <span className={styles.rowLabel}>{label}</span>
        {hasChildren && isCollapsed && (
          <span className={styles.childCount}>{node.children.length}</span>
        )}
      </div>
      {hasChildren &&
        !isCollapsed &&
        node.children.map((child) => (
          <NodeRow
            key={child.id}
            node={child}
            depth={depth + 1}
            collapsed={collapsed}
            hovered={hovered}
            selected={selected}
            onToggle={onToggle}
            onHover={onHover}
            onSelect={onSelect}
          />
        ))}
    </>
  );
}

function findNode(node: TreeNode, id: string): TreeNode | null {
  if (node.id === id) return node;
  for (const child of node.children) {
    const found = findNode(child, id);
    if (found) return found;
  }
  return null;
}

function DetailsPanel({ node }: { node: TreeNode | null }) {
  if (!node) {
    return (
      <div className={styles.detailsEmpty}>
        Beweeg over of klik op een node in de boom om de details te zien.
      </div>
    );
  }
  const meta = KIND_META[node.kind];
  return (
    <div className={styles.details}>
      <div className={styles.detailsHeader}>
        <span className={`${styles.kindDot} ${meta.cls}`} />
        <span className={styles.detailsKind}>{meta.label}</span>
      </div>
      <dl className={styles.detailsList}>
        <dt>nodeName</dt>
        <dd>
          {node.kind === 'element'
            ? node.tag?.toUpperCase()
            : node.kind === 'text'
            ? '#text'
            : node.kind === 'comment'
            ? '#comment'
            : node.attrName}
        </dd>
        {node.kind === 'element' && (
          <>
            <dt>interface</dt>
            <dd className={styles.detailsType}>{node.domType}</dd>
            <dt>kinderen</dt>
            <dd>{node.children.length}</dd>
            <dt>attributen</dt>
            <dd>
              {node.attrs && node.attrs.length > 0
                ? node.attrs.map((a) => `${a.name}="${a.value}"`).join('  ')
                : '— geen —'}
            </dd>
          </>
        )}
        {(node.kind === 'text' || node.kind === 'comment') && (
          <>
            <dt>textContent</dt>
            <dd>"{node.text}"</dd>
          </>
        )}
        {node.kind === 'attribute' && (
          <>
            <dt>waarde</dt>
            <dd>"{node.text}"</dd>
          </>
        )}
      </dl>
    </div>
  );
}

function InteractiveDOMTree() {
  const [html, setHtml] = useState(EXAMPLE_HTML);
  const [showWhitespace, setShowWhitespace] = useState(false);
  const [attrsAsNodes, setAttrsAsNodes] = useState(false);
  const [collapsed, setCollapsed] = useState<Set<string>>(new Set());
  const [hovered, setHovered] = useState<string | null>(null);
  const [selected, setSelected] = useState<string | null>(null);
  // DOMParser bestaat enkel in de browser, niet tijdens server-side rendering.
  const [mounted, setMounted] = useState(false);
  const highlightRef = useRef<HTMLPreElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  const tree = useMemo(() => {
    if (!mounted || typeof window === 'undefined' || typeof window.DOMParser === 'undefined') {
      return null;
    }
    try {
      const doc = new window.DOMParser().parseFromString(html, 'text/html');
      return buildTree(doc.documentElement, { showWhitespace, attrsAsNodes }, 'n0');
    } catch {
      return null;
    }
  }, [html, showWhitespace, attrsAsNodes, mounted]);

  const toggle = (id: string) =>
    setCollapsed((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });

  const active = tree && (hovered ?? selected) ? findNode(tree, (hovered ?? selected)!) : null;

  return (
    <div className={styles.container}>
      <div className={styles.intro}>
        Een browser leest HTML niet als platte tekst, maar bouwt er een{' '}
        <strong>DOM-boom</strong> mee op in het werkgeheugen. Pas de HTML hieronder gerust aan en
        kijk hoe de boom mee verandert.
      </div>

      <div className={styles.layout}>
        {/* ─── HTML invoer ─── */}
        <div className={styles.panel}>
          <div className={styles.panelHeader}>
            <span className={styles.panelTitle}>HTML</span>
            <button
              type="button"
              className={styles.resetBtn}
              onClick={() => setHtml(EXAMPLE_HTML)}
              disabled={html === EXAMPLE_HTML}
            >
              Voorbeeld herstellen
            </button>
          </div>
          <div className={styles.editorWrap}>
            <pre
              ref={highlightRef}
              className={styles.highlightLayer}
              aria-hidden="true"
              dangerouslySetInnerHTML={{ __html: highlightHtml(html) + '\n' }}
            />
            <textarea
              className={styles.editor}
              value={html}
              spellCheck={false}
              onChange={(e) => setHtml(e.target.value)}
              onScroll={(e) => {
                if (highlightRef.current) {
                  highlightRef.current.scrollTop = e.currentTarget.scrollTop;
                  highlightRef.current.scrollLeft = e.currentTarget.scrollLeft;
                }
              }}
            />
          </div>
        </div>

        {/* ─── DOM-boom ─── */}
        <div className={styles.panel}>
          <div className={styles.panelHeader}>
            <span className={styles.panelTitle}>DOM-boom</span>
            <div className={styles.toggles}>
              <label className={styles.toggle}>
                <input
                  type="checkbox"
                  checked={showWhitespace}
                  onChange={(e) => setShowWhitespace(e.target.checked)}
                />
                witruimte
              </label>
              <label className={styles.toggle}>
                <input
                  type="checkbox"
                  checked={attrsAsNodes}
                  onChange={(e) => setAttrsAsNodes(e.target.checked)}
                />
                attributen als nodes
              </label>
            </div>
          </div>
          <div className={styles.tree}>
            {tree ? (
              <NodeRow
                node={tree}
                depth={0}
                collapsed={collapsed}
                hovered={hovered}
                selected={selected}
                onToggle={toggle}
                onHover={setHovered}
                onSelect={setSelected}
              />
            ) : (
              <div className={styles.detailsEmpty}>DOM-boom wordt opgebouwd…</div>
            )}
          </div>
          <DetailsPanel node={active} />
        </div>
      </div>

      {/* ─── Legende ─── */}
      <div className={styles.legend}>
        {(Object.keys(KIND_META) as NodeKind[]).map((k) => (
          <span key={k} className={styles.legendItem}>
            <span className={`${styles.kindDot} ${KIND_META[k].cls}`} />
            {KIND_META[k].label}
          </span>
        ))}
      </div>
    </div>
  );
}

export default withMaximize(InteractiveDOMTree);
