import { SCHEMA_SQL } from '../data/schema.js';
import { QUESTIONS, TOPICS, ALT_SOLUTIONS } from '../data/questions.js';

const STORAGE_KEY = 'sqlPracticeHub.progress.v1';
const DRAFT_KEY = 'sqlPracticeHub.drafts.v1';
const SUBS_KEY = 'sqlPracticeHub.submissions.v1';
const THEME_KEY = 'sqlPracticeHub.theme.v1';

let db = null;
let editor = null;
let currentQuestion = QUESTIONS[0];
let lastUserResult = null;
let activeTab = 'result';
let activeQTab = 'question';

const solved = new Set(loadJSON(STORAGE_KEY, []));
const drafts = loadJSON(DRAFT_KEY, {});
const submissions = loadJSON(SUBS_KEY, {});

const $ = id => document.getElementById(id);

function loadJSON(key, fallback) {
  try { return JSON.parse(localStorage.getItem(key)) ?? fallback; }
  catch { return fallback; }
}
function saveJSON(key, value) {
  try { localStorage.setItem(key, JSON.stringify(value)); } catch {}
}

/* ------------------------------------------------------------ database */
async function initDb() {
  const SQL = await initSqlJs({ locateFile: f => `vendor/${f}` });
  db = new SQL.Database();
  db.run(SCHEMA_SQL);
}

function runSql(sql) {
  const results = db.exec(sql);
  if (!results.length) return { columns: [], rows: [], empty: true };
  const last = results[results.length - 1];
  return { columns: last.columns, rows: last.values, empty: false };
}

/* ------------------------------------------------------------- grading */
function normalizeCell(v) {
  if (v === null || v === undefined) return ' NULL';
  if (typeof v === 'number') return Math.round(v * 1e6) / 1e6;
  const asNum = Number(v);
  if (v !== '' && !Number.isNaN(asNum)) return Math.round(asNum * 1e6) / 1e6;
  return String(v).trim();
}

function rowKey(row) {
  return row.map(c => String(normalizeCell(c))).join('␟');
}

// Grading is purely result-based: any query producing the right result set is accepted,
// regardless of how it is written (join vs subquery vs window function, aliases, formatting).
function compareResults(user, expected, orderMatters) {
  if (user.empty && !expected.empty) {
    return { pass: false, reason: 'Your statement did not return a result set. Make sure it is a SELECT query.' };
  }
  if (user.columns.length !== expected.columns.length) {
    return {
      pass: false,
      reason: `Wrong number of columns — expected ${expected.columns.length} (${expected.columns.join(', ')}), got ${user.columns.length} (${user.columns.join(', ') || 'none'}).`
    };
  }
  if (user.rows.length !== expected.rows.length) {
    return {
      pass: false,
      reason: `Wrong number of rows — expected ${expected.rows.length}, your query returned ${user.rows.length}.` +
        (user.rows.length > expected.rows.length
          ? ' You are probably missing a filter, or a join is duplicating rows.'
          : ' You may be filtering too aggressively, or need a LEFT JOIN instead of an inner JOIN.')
    };
  }

  if (orderMatters) {
    for (let i = 0; i < expected.rows.length; i++) {
      if (rowKey(user.rows[i]) !== rowKey(expected.rows[i])) {
        const sameSet = multisetEqual(user.rows, expected.rows);
        return {
          pass: false,
          reason: sameSet
            ? `Right rows, wrong order. This question asks for a specific sort order — check your ORDER BY (row ${i + 1} is the first that differs).`
            : `Row ${i + 1} does not match the expected output. Expected [${expected.rows[i].map(fmtCell).join(', ')}] but got [${user.rows[i].map(fmtCell).join(', ')}].`
        };
      }
    }
    return { pass: true };
  }

  const counts = new Map();
  for (const r of expected.rows) {
    const k = rowKey(r);
    counts.set(k, (counts.get(k) || 0) + 1);
  }
  for (const r of user.rows) {
    const k = rowKey(r);
    const n = counts.get(k);
    if (!n) {
      return { pass: false, reason: `Unexpected row in your result: [${r.map(fmtCell).join(', ')}]. The row count matches, so check your filters and join conditions.` };
    }
    counts.set(k, n - 1);
  }
  return { pass: true };
}

function multisetEqual(a, b) {
  if (a.length !== b.length) return false;
  const counts = new Map();
  for (const r of b) { const k = rowKey(r); counts.set(k, (counts.get(k) || 0) + 1); }
  for (const r of a) {
    const k = rowKey(r);
    const n = counts.get(k);
    if (!n) return false;
    counts.set(k, n - 1);
  }
  return true;
}

function fmtCell(v) {
  if (v === null || v === undefined) return 'NULL';
  return typeof v === 'number' && !Number.isInteger(v) ? String(Math.round(v * 10000) / 10000) : String(v);
}

/* --------------------------------------------------------------- render */
function renderQuestionList() {
  const search = $('searchInput').value.trim().toLowerCase();
  const diff = $('difficultyFilter').value;
  const topic = $('topicFilter').value;
  const status = $('statusFilter').value;

  const list = $('questionList');
  list.innerHTML = '';

  const filtered = QUESTIONS.filter(q => {
    if (diff && q.difficulty !== diff) return false;
    if (topic && q.topic !== topic) return false;
    if (status === 'solved' && !solved.has(q.id)) return false;
    if (status === 'unsolved' && solved.has(q.id)) return false;
    if (search && !(`${q.title} ${q.topic} ${q.prompt}`.toLowerCase().includes(search))) return false;
    return true;
  });

  if (!filtered.length) {
    list.innerHTML = '<li class="empty">No questions match these filters.</li>';
    return;
  }

  for (const q of filtered) {
    const li = document.createElement('li');
    li.className = 'qitem' + (q.id === currentQuestion.id ? ' active' : '');
    li.innerHTML = `
      <span class="check">${solved.has(q.id) ? '✓' : ''}</span>
      <span class="qitem-num">${q.id}</span>
      <span class="qitem-body">
        <span class="qitem-title">${escapeHtml(q.title)}</span>
        <span class="qitem-topic">${escapeHtml(q.topic)}</span>
      </span>
      <span class="pill ${q.difficulty}">${q.difficulty}</span>`;
    li.addEventListener('click', () => { selectQuestion(q.id); closeQuestions(); });
    list.appendChild(li);
  }
}

function renderQuestion() {
  const q = currentQuestion;
  $('qTitle').textContent = q.title;
  $('qIndex').textContent = `#${q.id}`;
  renderMetaChips();

  const idx = QUESTIONS.findIndex(x => x.id === q.id);
  $('navPos').textContent = `${idx + 1} / ${QUESTIONS.length}`;

  editor.setValue(drafts[q.id] ?? `-- ${q.title}\n`);
  editor.focus();

  lastUserResult = null;
  activeTab = 'result';
  activeQTab = 'question';
  syncQTabs();
  syncTabs();
  $('resultStatus').textContent = '';
  $('resultStatus').className = 'result-status';
  $('resultBody').innerHTML = '<div class="empty">Run your query to view output.</div>';
  renderQuestionList();
}

/* Header chips. The "concepts" chip is derived from the reference solution itself,
   so it is always accurate — nothing here is a claim about who asks the question. */
function renderMetaChips() {
  const q = currentQuestion;
  const chips = [
    `<span class="meta-chip ${q.difficulty}">${q.difficulty}</span>`,
    `<span class="meta-chip"><span class="k">Topic</span> ${escapeHtml(q.topic)}</span>`
  ];
  const concepts = detectConcepts(q.solution);
  if (concepts.length) {
    chips.push(`<span class="meta-chip"><span class="k">Uses</span> ${escapeHtml(concepts.join(' · '))}</span>`);
  }
  chips.push(`<span class="meta-chip"><span class="k">Row order</span> ${q.orderMatters ? 'enforced' : 'ignored'}</span>`);
  if (solved.has(q.id)) chips.push('<span class="meta-chip done">✓ Solved</span>');
  $('qMeta').innerHTML = chips.join('');
}

// Reads the SQL constructs actually present in the reference solution.
const CONCEPT_PATTERNS = [
  [/\bLEFT\s+JOIN\b/i, 'LEFT JOIN'],
  [/\bINNER\s+JOIN\b|\bJOIN\b/i, 'JOIN'],
  [/\bGROUP\s+BY\b/i, 'GROUP BY'],
  [/\bHAVING\b/i, 'HAVING'],
  [/\bOVER\s*\(/i, 'window function'],
  [/\bWITH\b/i, 'CTE'],
  [/\bCASE\b/i, 'CASE'],
  [/\bUNION\b/i, 'UNION'],
  [/\bEXISTS\b/i, 'EXISTS'],
  [/\bCOALESCE\b|\bIFNULL\b|\bIS\s+NULL\b/i, 'NULL handling'],
  [/\bSTRFTIME\b|\bSUBSTR\b/i, 'date/text functions'],
  [/\bDISTINCT\b/i, 'DISTINCT'],
  [/\bLIMIT\b/i, 'LIMIT']
];
function detectConcepts(sql) {
  const found = [];
  for (const [re, label] of CONCEPT_PATTERNS) {
    if (re.test(sql) && !found.includes(label)) found.push(label);
  }
  // "LEFT JOIN" also matches the generic JOIN pattern — keep only the specific one.
  if (found.includes('LEFT JOIN')) {
    const i = found.indexOf('JOIN');
    if (i > -1) found.splice(i, 1);
  }
  return found.slice(0, 3);
}

/* Question tab: prompt, table definitions, example input, expected output. */
function renderQuestionTab() {
  const q = currentQuestion;
  const parts = [`<p class="q-prompt">${markupInline(q.prompt)}</p>`];

  if (solved.has(q.id)) {
    parts.push('<p class="q-note" style="color:var(--green);font-weight:600">✓ You have solved this question.</p>');
  }

  parts.push(
    `<p class="q-note"><strong>Note:</strong> row order ` +
    (q.orderMatters
      ? 'must match the expected output — include an <code class="inline-code">ORDER BY</code>.'
      : 'does not matter for this question.') + '</p>'
  );

  for (const t of q.tables) {
    parts.push(`<div class="q-section-title"><span class="tname">${escapeHtml(t)}</span> table:</div>`);
    const info = runSql(`PRAGMA table_info(${t});`);
    const defRows = info.rows.map(r =>
      `<tr><td class="mono">${escapeHtml(r[1])}</td><td class="mono">${escapeHtml(sqlTypeLabel(r[2]))}${r[5] ? ' <span style="color:var(--text-dim)">(primary key)</span>' : ''}</td></tr>`).join('');
    parts.push(
      `<div class="dl-table-wrap"><table class="dl-table">
        <thead><tr><th>Column Name</th><th>Type</th></tr></thead>
        <tbody>${defRows}</tbody></table></div>`);

    const total = runSql(`SELECT COUNT(*) FROM ${t};`).rows[0][0];
    const sample = runSql(`SELECT * FROM ${t} LIMIT 5;`);
    parts.push(`<div class="q-section-title"><span class="tname">${escapeHtml(t)}</span> example input:</div>`);
    parts.push(dataTableHtml(sample));
    parts.push(`<p class="table-caption">Showing ${sample.rows.length} of ${total} rows.</p>`);
  }

  try {
    const expected = runSql(q.solution);
    parts.push('<div class="q-section-title">Example output:</div>');
    parts.push(dataTableHtml({ columns: expected.columns, rows: expected.rows.slice(0, 8) }));
    parts.push(`<p class="table-caption">Your query must return ${expected.rows.length} row${expected.rows.length === 1 ? '' : 's'} and ${expected.columns.length} column${expected.columns.length === 1 ? '' : 's'}${expected.rows.length > 8 ? ' — first 8 shown' : ''}.</p>`);
  } catch {}

  parts.push(
    `<div class="q-help">
       <button class="btn btn-link" id="btnHint">Show hint</button>
       <span style="color:var(--text-dim)">Stuck? The Solution tab has a full walkthrough.</span>
     </div>
     <div class="reveal" id="hintBox" hidden><div class="hint-box">${escapeHtml(q.hint)}</div></div>`);

  $('qtabBody').innerHTML = parts.join('');

  $('btnHint').addEventListener('click', () => {
    const box = $('hintBox');
    box.hidden = !box.hidden;
    $('btnHint').textContent = box.hidden ? 'Show hint' : 'Hide hint';
  });
}

function renderSolutionTab() {
  const q = currentQuestion;
  $('qtabBody').innerHTML =
    `<div class="q-section-title" style="margin-top:0">Reference solution</div>
     <div class="reveal"><pre>${escapeHtml(formatSql(q.solution))}</pre>
     <div class="explain">${escapeHtml(q.explain)}</div></div>
     <div class="q-help"><button class="btn" id="btnLoadSolution">Load into editor</button></div>`;
  $('btnLoadSolution').addEventListener('click', () => {
    editor.setValue(q.solution);
    editor.focus();
    toast('Solution loaded into the editor.');
  });
}

function renderApproachesTab() {
  const q = currentQuestion;
  const alts = ALT_SOLUTIONS[q.id] || [];
  const lede = `<p class="alts-lede">Grading compares your <strong>result set</strong>, never your query text — so any approach
    that returns the right answer is accepted: join vs subquery vs window function, different aliases,
    extra <code class="inline-code">ORDER BY</code>, different formatting.</p>`;

  if (!alts.length) {
    $('qtabBody').innerHTML = lede +
      `<p class="q-note">No alternative approach is listed for this question — the reference solution on the
       Solution tab is the idiomatic one. Any equivalent query still passes.</p>`;
    return;
  }

  $('qtabBody').innerHTML = lede +
    `<div class="q-section-title" style="margin-top:0">${alts.length} other accepted approach${alts.length === 1 ? '' : 'es'}</div>` +
    alts.map((a, i) => `
      <div class="alt">
        <div class="alt-label">${escapeHtml(a.label)} <span class="badge">accepted</span></div>
        <pre>${escapeHtml(formatSql(a.sql))}</pre>
        <div style="margin-top:10px"><button class="btn btn-sm" data-alt="${i}">Load into editor</button></div>
      </div>`).join('');

  $('qtabBody').querySelectorAll('[data-alt]').forEach(btn => {
    btn.addEventListener('click', () => {
      editor.setValue(alts[btn.dataset.alt].sql);
      editor.focus();
      toast('Approach loaded into the editor.');
    });
  });
}

function renderSubmissionsTab() {
  const list = submissions[currentQuestion.id] || [];
  if (!list.length) {
    $('qtabBody').innerHTML =
      '<p class="q-note">No submissions yet for this question. Write a query and press <strong>Submit</strong>.</p>';
    return;
  }
  $('qtabBody').innerHTML =
    `<div class="q-section-title" style="margin-top:0">${list.length} submission${list.length === 1 ? '' : 's'}</div>` +
    list.map((s, i) => `
      <div class="sub-row">
        <span class="sub-verdict ${s.pass ? 'ok' : 'err'}">${s.pass ? 'Accepted ✓' : 'Wrong ✗'}</span>
        <span class="sub-time">${escapeHtml(new Date(s.ts).toLocaleString())}</span>
        <span class="sub-sql">${escapeHtml(s.sql.replace(/\s+/g, ' ').slice(0, 90))}</span>
        <button class="btn btn-sm sub-load" data-sub="${i}">Load</button>
      </div>`).join('');

  $('qtabBody').querySelectorAll('[data-sub]').forEach(btn => {
    btn.addEventListener('click', () => {
      editor.setValue(list[btn.dataset.sub].sql);
      editor.focus();
      toast('Submission loaded into the editor.');
    });
  });
}

function syncQTabs() {
  document.querySelectorAll('.qtab').forEach(t => t.classList.toggle('active', t.dataset.qtab === activeQTab));
  $('qtabBody').scrollTop = 0;
  if (activeQTab === 'question') renderQuestionTab();
  else if (activeQTab === 'solution') renderSolutionTab();
  else if (activeQTab === 'approaches') renderApproachesTab();
  else renderSubmissionsTab();
}

function dataTableHtml(result) {
  if (!result.rows.length) return '<div class="dl-table-wrap"><div class="empty">No rows.</div></div>';
  const head = result.columns.map(c => `<th class="mono">${escapeHtml(c)}</th>`).join('');
  const body = result.rows.map(r =>
    `<tr>${r.map(c => c === null
      ? '<td class="null-cell">NULL</td>'
      : `<td class="mono">${escapeHtml(formatValue(c))}</td>`).join('')}</tr>`).join('');
  return `<div class="dl-table-wrap"><table class="dl-table"><thead><tr>${head}</tr></thead><tbody>${body}</tbody></table></div>`;
}

function sqlTypeLabel(t) {
  const map = { INTEGER: 'integer', REAL: 'decimal', TEXT: 'varchar', BLOB: 'blob' };
  return map[String(t).toUpperCase()] || String(t).toLowerCase();
}

function renderProgress() {
  const pct = (solved.size / QUESTIONS.length) * 100;
  $('progressFill').style.width = `${pct}%`;
  $('progressLabel').textContent = `${solved.size} / ${QUESTIONS.length} solved`;
}

function renderTable(result, container, note) {
  if (result.empty) {
    container.innerHTML = '<div class="empty">Query ran successfully but returned no result set.</div>';
    return;
  }
  if (!result.rows.length) {
    container.innerHTML = '<div class="empty">0 rows returned.</div>';
    return;
  }
  const MAX = 200;
  const shown = result.rows.slice(0, MAX);
  const head = result.columns.map(c => `<th>${escapeHtml(c)}</th>`).join('');
  const body = shown.map(r =>
    `<tr>${r.map(c => c === null
      ? '<td class="null-cell">NULL</td>'
      : `<td>${escapeHtml(formatValue(c))}</td>`).join('')}</tr>`).join('');
  container.innerHTML =
    `<table class="grid"><thead><tr>${head}</tr></thead><tbody>${body}</tbody></table>` +
    `<div class="row-note">${result.rows.length} row${result.rows.length === 1 ? '' : 's'}${result.rows.length > MAX ? ` (showing first ${MAX})` : ''}${note ? ' · ' + note : ''}</div>`;
}

function formatValue(v) {
  if (typeof v === 'number' && !Number.isInteger(v)) return String(Math.round(v * 10000) / 10000);
  return String(v);
}

/* ---------------------------------------------------------------- acts */
// Run: execute only. Never says correct/incorrect.
function doRun(silent) {
  const sql = editor.getValue().trim();
  if (!sql) { toast('Write a query first.', 'err'); return null; }
  try {
    const result = runSql(sql);
    lastUserResult = result;
    activeTab = 'result';
    syncTabs();
    renderTable(result, $('resultBody'));
    if (!silent) {
      const n = result.empty ? 0 : result.rows.length;
      $('resultStatus').textContent = `Ran successfully — ${n} row${n === 1 ? '' : 's'} (not checked)`;
      $('resultStatus').className = 'result-status neutral';
    }
    return result;
  } catch (err) {
    lastUserResult = null;
    activeTab = 'result';
    syncTabs();
    $('resultBody').innerHTML = `<div class="err-box"><strong>SQL error.</strong> ${escapeHtml(err.message)}</div>`;
    $('resultStatus').textContent = 'SQL error';
    $('resultStatus').className = 'result-status err';
    return null;
  }
}

function doSubmit() {
  const sql = editor.getValue().trim();
  const result = doRun(true);
  if (!result) {
    $('resultStatus').textContent = 'SQL error';
    $('resultStatus').className = 'result-status err';
    return;
  }
  let expected;
  try {
    expected = runSql(currentQuestion.solution);
  } catch (err) {
    toast('Reference solution failed to run: ' + err.message, 'err');
    return;
  }

  const verdict = compareResults(result, expected, currentQuestion.orderMatters);
  recordSubmission(currentQuestion.id, sql, verdict.pass);

  if (verdict.pass) {
    const firstTime = !solved.has(currentQuestion.id);
    if (firstTime) {
      solved.add(currentQuestion.id);
      saveJSON(STORAGE_KEY, [...solved]);
      renderProgress();
    }
    $('resultStatus').textContent = 'Correct ✓';
    $('resultStatus').className = 'result-status ok';
    $('resultBody').insertAdjacentHTML('afterbegin',
      `<div class="ok-box"><strong>Accepted — your answer is correct.</strong> The result matches the expected output` +
      `${currentQuestion.orderMatters ? ', including the required sort order' : ' (row order was not required)'}.</div>`);
    toast(firstTime ? 'Correct! Question solved.' : 'Correct — already solved.', 'ok');
    renderQuestionList();
    renderMetaChips();
  } else {
    $('resultStatus').textContent = 'Incorrect ✗';
    $('resultStatus').className = 'result-status err';
    $('resultBody').insertAdjacentHTML('afterbegin',
      `<div class="err-box"><strong>Incorrect.</strong> ${escapeHtml(verdict.reason)}\n\nSwitch to “Expected output” above to compare.</div>`);
    toast('Incorrect — see the reason above.', 'err');
  }
  if (activeQTab === 'submissions' || activeQTab === 'question') syncQTabs();
}

function recordSubmission(qid, sql, pass) {
  const list = submissions[qid] || (submissions[qid] = []);
  list.unshift({ sql, pass, ts: Date.now() });
  if (list.length > 20) list.length = 20;
  saveJSON(SUBS_KEY, submissions);
}

function selectQuestion(id) {
  const q = QUESTIONS.find(x => x.id === id);
  if (!q) return;
  drafts[currentQuestion.id] = editor.getValue();
  saveJSON(DRAFT_KEY, drafts);
  currentQuestion = q;
  renderQuestion();
}

function step(delta) {
  const idx = QUESTIONS.findIndex(q => q.id === currentQuestion.id);
  const next = QUESTIONS[idx + delta];
  if (next) selectQuestion(next.id);
}

function syncTabs() {
  document.querySelectorAll('.tab').forEach(t => t.classList.toggle('active', t.dataset.tab === activeTab));
  if (activeTab === 'expected') {
    try {
      const expected = runSql(currentQuestion.solution);
      renderTable(expected, $('resultBody'),
        currentQuestion.orderMatters ? 'row order must match' : 'row order does not matter');
    } catch (err) {
      $('resultBody').innerHTML = `<div class="err-box">${escapeHtml(err.message)}</div>`;
    }
  } else if (lastUserResult) {
    renderTable(lastUserResult, $('resultBody'));
  } else {
    $('resultBody').innerHTML = '<div class="empty">Run your query to view output.</div>';
  }
}

function openQuestions() { $('questionDrawer').hidden = false; renderQuestionList(); }
function closeQuestions() { $('questionDrawer').hidden = true; }
function toggleQuestions() { $('questionDrawer').hidden ? openQuestions() : closeQuestions(); }

/* -------------------------------------------------------------- helpers */
function escapeHtml(s) {
  return String(s).replace(/[&<>"']/g, c =>
    ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
}
function markupInline(text) {
  return escapeHtml(text).replace(/`([^`]+)`/g, '<code class="inline-code">$1</code>');
}
function formatSql(sql) {
  return sql
    .replace(/ (FROM|WHERE|GROUP BY|ORDER BY|HAVING|LIMIT|JOIN|LEFT JOIN|INNER JOIN|UNION ALL|UNION)\b/g, '\n$1')
    .replace(/\), /g, '),\n');
}
let toastTimer;
function toast(msg, kind) {
  const el = $('toast');
  el.textContent = msg;
  el.className = 'toast ' + (kind || '');
  el.hidden = false;
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => { el.hidden = true; }, 2600);
}

/* --------------------------------------------------------------- theme */
// "frost" (light, default) and "lodge" (dark). One class on <body> swaps every
// colour, because the stylesheet reads only from custom properties.
function applyTheme(name) {
  const dark = name === 'lodge';
  document.body.classList.toggle('theme-dark', dark);
  const btn = $('btnTheme');
  btn.textContent = dark ? '☀' : '☾';
  btn.title = dark ? 'Switch to the Frost (light) theme' : 'Switch to the Lodge (dark) theme';
  try { localStorage.setItem(THEME_KEY, name); } catch {}
  if (editor) editor.refresh();
}
function toggleTheme() {
  applyTheme(document.body.classList.contains('theme-dark') ? 'frost' : 'lodge');
}

/* -------------------------------------------------------------- resize */
function initSplitter() {
  const split = $('split');
  const splitter = $('splitter');
  let dragging = false;

  splitter.addEventListener('mousedown', e => { dragging = true; e.preventDefault(); document.body.style.cursor = 'col-resize'; });
  window.addEventListener('mouseup', () => { dragging = false; document.body.style.cursor = ''; });
  window.addEventListener('mousemove', e => {
    if (!dragging) return;
    const pct = Math.min(72, Math.max(28, (e.clientX / window.innerWidth) * 100));
    split.style.gridTemplateColumns = `minmax(0, ${pct}fr) 6px minmax(0, ${100 - pct}fr)`;
    if (editor) editor.refresh();
  });
}

/* ----------------------------------------------------------------- boot */
async function main() {
  await initDb();

  editor = CodeMirror($('editorHost'), {
    value: '',
    mode: 'text/x-sqlite',
    lineNumbers: true,
    lineWrapping: true,
    matchBrackets: true,
    extraKeys: {
      'Ctrl-Enter': () => doRun(),
      'Cmd-Enter': () => doRun(),
      'Shift-Ctrl-Enter': () => doSubmit(),
      'Shift-Cmd-Enter': () => doSubmit(),
      'Ctrl-Space': 'autocomplete',
      Tab: cm => cm.replaceSelection('  ')
    },
    hintOptions: { tables: buildHintTables() }
  });
  editor.on('change', () => {
    drafts[currentQuestion.id] = editor.getValue();
    saveJSON(DRAFT_KEY, drafts);
  });

  TOPICS.forEach(t => {
    const opt = document.createElement('option');
    opt.value = t; opt.textContent = t;
    $('topicFilter').appendChild(opt);
  });

  initSplitter();
  let savedTheme = 'frost';
  try { savedTheme = localStorage.getItem(THEME_KEY) || 'frost'; } catch {}
  applyTheme(savedTheme);
  $('btnTheme').addEventListener('click', toggleTheme);

  $('btnRun').addEventListener('click', () => doRun());
  $('btnSubmit').addEventListener('click', doSubmit);
  $('btnClear').addEventListener('click', () => { editor.setValue(''); editor.focus(); });
  $('btnFormat').addEventListener('click', () => {
    editor.setValue(`-- ${currentQuestion.title}\n`);
    editor.focus();
  });
  $('btnPrev').addEventListener('click', () => step(-1));
  $('btnNext').addEventListener('click', () => step(1));
  $('btnQuestions').addEventListener('click', toggleQuestions);
  $('btnCloseQuestions').addEventListener('click', closeQuestions);

  $('btnReset').addEventListener('click', () => {
    if (!confirm('Clear all solved progress, drafts and submission history?')) return;
    solved.clear();
    saveJSON(STORAGE_KEY, []);
    for (const k of Object.keys(drafts)) delete drafts[k];
    for (const k of Object.keys(submissions)) delete submissions[k];
    saveJSON(DRAFT_KEY, drafts);
    saveJSON(SUBS_KEY, submissions);
    renderProgress();
    renderQuestion();
    toast('Progress reset.');
  });

  document.querySelectorAll('.qtab').forEach(tab => {
    tab.addEventListener('click', () => { activeQTab = tab.dataset.qtab; syncQTabs(); });
  });
  document.querySelectorAll('.tab').forEach(tab => {
    tab.addEventListener('click', () => { activeTab = tab.dataset.tab; syncTabs(); });
  });

  ['searchInput', 'difficultyFilter', 'topicFilter', 'statusFilter'].forEach(id => {
    $(id).addEventListener('input', renderQuestionList);
  });

  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') closeQuestions();
  });

  renderProgress();
  renderQuestion();

  $('boot').classList.add('hide');
  setTimeout(() => { $('boot').hidden = true; }, 400);
}

function buildHintTables() {
  const tables = {};
  const names = runSql("SELECT name FROM sqlite_master WHERE type='table';").rows.map(r => r[0]);
  for (const n of names) {
    tables[n] = runSql(`PRAGMA table_info(${n});`).rows.map(r => r[1]);
  }
  return tables;
}

// Self-test: asserts every reference solution AND every listed alternative approach
// grades as Correct, and that a deliberately wrong query grades as Incorrect.
// Run from the browser console:  sqlHubSelfTest()
window.sqlHubSelfTest = function () {
  const failures = [];
  let checks = 0;
  for (const q of QUESTIONS) {
    let expected;
    try {
      expected = runSql(q.solution);
    } catch (e) {
      failures.push(`Q${q.id} reference solution errored: ${e.message}`);
      continue;
    }
    if (expected.empty || !expected.rows.length) failures.push(`Q${q.id} reference solution returns 0 rows`);

    checks++;
    const self = compareResults(expected, expected, q.orderMatters);
    if (!self.pass) failures.push(`Q${q.id} reference solution does not grade itself as correct: ${self.reason}`);

    for (const alt of (ALT_SOLUTIONS[q.id] || [])) {
      checks++;
      try {
        const got = runSql(alt.sql);
        const verdict = compareResults(got, expected, q.orderMatters);
        if (!verdict.pass) failures.push(`Q${q.id} alt "${alt.label}" rejected: ${verdict.reason}`);
      } catch (e) {
        failures.push(`Q${q.id} alt "${alt.label}" errored: ${e.message}`);
      }
    }

    checks++;
    try {
      const wrong = runSql('SELECT 1 AS x;');
      if (compareResults(wrong, expected, q.orderMatters).pass && expected.rows.length !== 1) {
        failures.push(`Q${q.id} accepted an obviously wrong query`);
      }
    } catch {}
  }
  return { checks, failures, ok: failures.length === 0 };
};

main().catch(err => {
  $('boot').innerHTML = `<div class="boot-inner"><div class="boot-text">Failed to start: ${escapeHtml(err.message)}</div></div>`;
});
