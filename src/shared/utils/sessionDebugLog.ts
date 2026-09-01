import { datadogLogs } from '@datadog/browser-logs';

import { parseJwtClaims } from './jwt';

// Temporary QA instrumentation branch. Every session-relevant event is appended to a per-boot
// buffer in localStorage (so it survives reloads and logouts), mirrored to Datadog when
// configured, and downloadable via the floating button. No raw tokens are ever logged.

const KEY_PREFIX = 'sessionDbg.';
const LINEAGE_KEY = 'sessionDbgLineage';
const MAX_ENTRIES = 1500;
const MAX_BOOTS = 30;

const isDisabled = typeof window === 'undefined' || import.meta.env?.MODE === 'test';

const bootId = Math.random().toString(16).slice(2, 8);
const bootKey = `${KEY_PREFIX}${Date.now()}.${bootId}`;
let lineage = bootId;
let entries: object[] = [];
let dropped = 0;
let flushTimer: ReturnType<typeof setTimeout> | null = null;

// Compact, safe identity of a JWT: claims plus the signature tail to compare tokens across tabs.
export const tokenInfo = (token: string | null | undefined) => {
  if (!token) return null;
  const claims = parseJwtClaims(token) ?? {};
  const exp = typeof claims.exp === 'number' ? claims.exp * 1000 : null;

  return {
    sub: claims.sub,
    family: claims.family ?? claims.jti,
    expInSec: exp === null ? null : Math.round((exp - Date.now()) / 1000),
    sig: token.slice(-8),
  };
};

const safeJson = (value: unknown) => {
  try {
    const text = JSON.stringify(value);

    return text && text.length > 3000 ? `${text.slice(0, 3000)}…` : text;
  } catch {
    return '<unserializable>';
  }
};

const flush = () => {
  flushTimer = null;
  try {
    localStorage.setItem(bootKey, JSON.stringify(entries));
  } catch {
    // Quota or a broken backend; the Datadog mirror still has the events.
  }
};

// Survives resetAuthorization's sessionStorage.clear(), so a duplicate keeps its parentage.
const persistLineage = () => {
  try {
    if (sessionStorage.getItem(LINEAGE_KEY) !== lineage)
      sessionStorage.setItem(LINEAGE_KEY, lineage);
  } catch {
    /* unavailable */
  }
};

export const dbg = (ev: string, data?: object) => {
  if (isDisabled) return;

  const entry = { t: new Date().toISOString(), ms: Date.now(), tab: lineage, ev, ...data };
  if (entries.length >= MAX_ENTRIES) {
    entries.shift();
    dropped += 1;
  }
  entries.push(dropped ? { ...entry, dropped } : entry);
  persistLineage();
  if (!flushTimer) flushTimer = setTimeout(flush, 200);

  try {
    datadogLogs.logger.info(`sessionDbg ${ev}`, entry);
  } catch {
    /* not initialized */
  }
  // eslint-disable-next-line no-console
  console.info('[sessionDbg]', ev, data ?? '');
};

const collectAll = () => {
  const merged: { ms?: number }[] = [];
  for (const key of Object.keys(localStorage)) {
    if (!key.startsWith(KEY_PREFIX)) continue;
    try {
      merged.push(...JSON.parse(localStorage.getItem(key) ?? '[]'));
    } catch {
      /* skip corrupt chunk */
    }
  }

  return merged.sort((a, b) => (a.ms ?? 0) - (b.ms ?? 0));
};

const download = () => {
  flush();
  const payload = {
    exportedAt: new Date().toISOString(),
    url: window.location.href,
    userAgent: navigator.userAgent,
    events: collectAll(),
  };
  const blob = new Blob([JSON.stringify(payload, null, 1)], { type: 'application/json' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = `session-debug-${Date.now()}.json`;
  link.click();
  URL.revokeObjectURL(link.href);
};

const clearAll = () => {
  Object.keys(localStorage)
    .filter((key) => key.startsWith(KEY_PREFIX) && key !== bootKey)
    .forEach((key) => localStorage.removeItem(key));
  entries = [];
  flush();
  window.alert('Session debug log cleared.');
};

const injectButton = () => {
  if (document.getElementById('session-dbg-btn')) return;

  const button = document.createElement('button');
  button.id = 'session-dbg-btn';
  button.textContent = '⬇ session log';
  button.title = 'Download session debug log · Shift-click to clear';
  button.style.cssText = [
    'position:fixed',
    'left:10px',
    'bottom:10px',
    'z-index:2147483647',
    'opacity:.55',
    'font:11px/1 ui-monospace,Menlo,monospace',
    'padding:5px 8px',
    'border-radius:6px',
    'background:#12161c',
    'color:#e6eae8',
    'border:none',
    'cursor:pointer',
  ].join(';');
  button.onclick = (event) => (event.shiftKey ? clearAll() : download());
  document.body.appendChild(button);
};

// Keeps only the newest boot buffers so the debug key set cannot grow without bound.
const pruneOldBoots = () => {
  Object.keys(localStorage)
    .filter((key) => key.startsWith(KEY_PREFIX))
    .sort()
    .slice(0, -MAX_BOOTS)
    .forEach((key) => localStorage.removeItem(key));
};

export const initSessionDebug = () => {
  if (isDisabled) return;

  try {
    const parent = sessionStorage.getItem(LINEAGE_KEY);
    if (parent) lineage = `${parent}>${bootId}`.slice(-64);
  } catch {
    /* unavailable */
  }
  persistLineage();
  pruneOldBoots();
  window.addEventListener('pagehide', flush);
  injectButton();
  (window as unknown as Record<string, unknown>).__sessionDebugDump = collectAll;
};

// Called from index.tsx before the legacy migration, so the pre-migration state is on record.
export const logBootSnapshot = (stores: {
  access: string | null;
  refresh: string | null;
  workspace: { ownerId?: string; workspaceName?: string } | null;
}) => {
  if (isDisabled) return;

  let nav;
  try {
    nav = (performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming)?.type;
  } catch {
    /* unavailable */
  }

  dbg('boot', {
    url: window.location.pathname + window.location.search,
    nav,
    visibility: document.visibilityState,
    historyState: safeJson(window.history.state),
    access: tokenInfo(stores.access),
    refresh: tokenInfo(stores.refresh),
    workspace: stores.workspace
      ? { ownerId: stores.workspace.ownerId, name: stores.workspace.workspaceName }
      : null,
    activeSessionId: localStorage.getItem('activeSessionId')?.slice(-8) ?? null,
    lastActivityAt: localStorage.getItem('lastActivityAt'),
    localKeys: Object.keys(localStorage).filter((key) => !key.startsWith(KEY_PREFIX)),
    sessionKeys: Object.keys(sessionStorage),
  });
};
