/* Dialect input translation.
 *
 * MySQL and SQL Server have no browser build, so when you pick one of those we
 * rewrite a bounded, well-defined set of idioms and execute on an engine that
 * does run. Every rewrite is reported back and shown in the UI — the point is to
 * teach the difference, not to silently "fix" your query.
 *
 * Deliberately conservative: rules only fire on unambiguous patterns. Anything
 * risky (T-SQL's `+` for string concatenation, which is indistinguishable from
 * numeric addition without type information) is flagged as a warning instead of
 * being rewritten.
 */

/* Rewrites must never alter the inside of a string literal or comment, but they
 * DO need to match across one: `DATEDIFF(a, '2020-01-01')` spans a literal, and
 * so does `GROUP_CONCAT(x SEPARATOR ', ')`. Splitting the SQL into code/non-code
 * segments makes those patterns unmatchable, so instead each literal is replaced
 * by a single placeholder token, all rules run over the masked text, and the
 * literals are restored at the end.
 *
 * String literals and comments get distinct markers so a rule can ask "is there a
 * string next to this +?" without a comment producing a false positive. */
const STR = '';
const CMT = '';
const MASK_RE = /[](\d+)[]/g;

function mask(sql) {
  const lits = [];
  const masked = sql.replace(/('(?:''|[^'])*')|(--[^\n]*)|(\/\*[\s\S]*?\*\/)/g, m => {
    const tag = m[0] === "'" ? STR : CMT;
    lits.push(m);
    return `${tag}${lits.length - 1}${tag}`;
  });
  return { masked, lits };
}

function unmask(text, lits) {
  return text.replace(MASK_RE, (_, i) => lits[+i]);
}

// Matches one function argument, tolerating a single level of nested parens so
// DATEDIFF(day, hire_date, GETDATE()) splits correctly.
const ARG = '((?:[^,()]|\\([^()]*\\))+?)';
const rx = (body, flags = 'gi') => new RegExp(body, flags);

/* Each rule operates on MASKED text: literals are already placeholders, so a
   plain global replace is safe. */
const RULES = [
  {
    id: 'top-to-limit',
    from: ['tsql'],
    targets: ['sqlite', 'postgres'],
    label: 'SELECT TOP (n) → LIMIT n',
    why: 'T-SQL limits rows right after SELECT; SQLite and Postgres use LIMIT at the end.',
    apply: sql => {
      let n = null;
      const out = sql.replace(/\bSELECT\s+(DISTINCT\s+)?TOP\s*\(?\s*(\d+)\s*\)?\s+/i,
        (_, distinct, num) => { n = num; return `SELECT ${distinct || ''}`; });
      if (n === null) return sql;
      if (/\bLIMIT\b/i.test(out)) return out;
      return out.replace(/;?\s*$/, ` LIMIT ${n};`);
    }
  },
  // Date maths runs BEFORE the now()/getdate() rule, so DATEDIFF still sees the
  // original GETDATE() call rather than a rewritten SQLite expression.
  {
    id: 'datediff-tsql',
    from: ['tsql'],
    targets: ['sqlite'],
    label: 'DATEDIFF(day, a, b) → JULIANDAY(b) - JULIANDAY(a)',
    why: 'SQLite has no DATEDIFF; day differences come from JULIANDAY.',
    apply: sql => sql.replace(
      rx(`\\bDATEDIFF\\s*\\(\\s*(?:day|dd|d)\\s*,\\s*${ARG},\\s*${ARG}\\)`),
      '(JULIANDAY($2) - JULIANDAY($1))')
  },
  {
    id: 'datediff-mysql',
    from: ['mysql'],
    targets: ['sqlite'],
    label: 'DATEDIFF(a, b) → JULIANDAY(a) - JULIANDAY(b)',
    why: 'MySQL takes the later date first and needs no unit argument.',
    apply: sql => sql.replace(
      rx(`\\bDATEDIFF\\s*\\(\\s*${ARG},\\s*${ARG}\\)`),
      '(JULIANDAY($1) - JULIANDAY($2))')
  },
  {
    id: 'isnull-to-coalesce',
    from: ['tsql'],
    targets: ['sqlite', 'postgres'],
    label: 'ISNULL(a, b) → COALESCE(a, b)',
    why: 'ISNULL is T-SQL only. COALESCE is standard and works everywhere.',
    apply: sql => sql.replace(/\bISNULL\s*\(/gi, 'COALESCE(')
  },
  {
    id: 'ifnull-to-coalesce',
    from: ['mysql'],
    targets: ['postgres'],
    label: 'IFNULL(a, b) → COALESCE(a, b)',
    why: 'Postgres has no IFNULL.',
    apply: sql => sql.replace(/\bIFNULL\s*\(/gi, 'COALESCE(')
  },
  {
    id: 'len-to-length',
    from: ['tsql'],
    targets: ['sqlite', 'postgres'],
    label: 'LEN(s) → LENGTH(s)',
    why: 'T-SQL calls it LEN; every other engine calls it LENGTH.',
    apply: sql => sql.replace(/\bLEN\s*\(/gi, 'LENGTH(')
  },
  {
    id: 'brackets-to-quotes',
    from: ['tsql'],
    targets: ['sqlite', 'postgres'],
    label: '[identifier] → "identifier"',
    why: 'Square brackets are T-SQL quoting; the SQL standard uses double quotes.',
    apply: sql => sql.replace(/\[([A-Za-z_][\w ]*)\]/g, '"$1"')
  },
  {
    id: 'backticks-to-quotes',
    from: ['mysql'],
    targets: ['sqlite', 'postgres'],
    label: '`identifier` → "identifier"',
    why: 'Backticks are MySQL quoting; the SQL standard uses double quotes.',
    apply: sql => sql.replace(/`([^`]+)`/g, '"$1"')
  },
  {
    id: 'mysql-limit-pair',
    from: ['mysql'],
    targets: ['sqlite', 'postgres'],
    label: 'LIMIT offset, count → LIMIT count OFFSET offset',
    why: "MySQL's two-argument LIMIT puts the offset first — the reverse of the standard form.",
    apply: sql => sql.replace(/\bLIMIT\s+(\d+)\s*,\s*(\d+)/gi, 'LIMIT $2 OFFSET $1')
  },
  {
    id: 'year-month-to-strftime',
    from: ['mysql', 'tsql'],
    targets: ['sqlite'],
    label: 'YEAR(d) / MONTH(d) → STRFTIME',
    why: 'SQLite has no YEAR()/MONTH(); it extracts date parts with STRFTIME.',
    apply: sql => sql
      .replace(rx(`\\bYEAR\\s*\\(${ARG}\\)`), "CAST(STRFTIME('%Y', $1) AS INTEGER)")
      .replace(rx(`\\bMONTH\\s*\\(${ARG}\\)`), "CAST(STRFTIME('%m', $1) AS INTEGER)")
      .replace(rx(`\\bDAY\\s*\\(${ARG}\\)`), "CAST(STRFTIME('%d', $1) AS INTEGER)")
  },
  {
    id: 'now-functions',
    from: ['mysql', 'tsql'],
    targets: ['sqlite'],
    label: 'GETDATE() / NOW() / CURDATE() → SQLite date functions',
    why: "SQLite spells \"now\" as DATE('now') / DATETIME('now').",
    apply: sql => sql
      .replace(/\b(GETDATE|SYSDATETIME|NOW)\s*\(\s*\)/gi, "DATETIME('now')")
      .replace(/\bCURDATE\s*\(\s*\)/gi, "DATE('now')")
      .replace(/\bCURRENT_DATE\b(?!\s*\()/gi, "DATE('now')")
  },
  {
    id: 'string-agg',
    from: ['tsql'],
    targets: ['sqlite'],
    label: 'STRING_AGG(x, sep) → GROUP_CONCAT(x, sep)',
    why: 'SQLite spells string aggregation GROUP_CONCAT.',
    apply: sql => sql.replace(/\bSTRING_AGG\s*\(/gi, 'GROUP_CONCAT(')
  },
  {
    id: 'group-concat-separator',
    from: ['mysql'],
    targets: ['sqlite', 'postgres'],
    label: 'GROUP_CONCAT(x SEPARATOR s) → comma-argument form',
    why: 'The SEPARATOR keyword is MySQL-only syntax.',
    apply: sql => sql.replace(/\s+SEPARATOR\s+([]\d+[])/gi, ', $1')
  },
  {
    id: 'mysql-bool-sum',
    from: ['mysql'],
    targets: ['postgres'],
    label: 'SUM(cond) → SUM(CASE WHEN cond THEN 1 ELSE 0 END)',
    why: 'Postgres will not add booleans; MySQL treats true as 1.',
    apply: sql => sql.replace(
      /\bSUM\s*\(\s*([\w."]+\s*(?:=|<>|!=|>|<)\s*[^)]+)\)/gi,
      'SUM(CASE WHEN $1 THEN 1 ELSE 0 END)')
  }
];

/* Patterns we refuse to rewrite because doing so could change meaning. */
const WARNINGS = [
  {
    id: 'tsql-plus-concat',
    from: ['tsql'],
    // a string literal placeholder adjacent to +
    test: masked => /\d+\s*\+|\+\s*\d+/.test(masked),
    message: 'T-SQL joins strings with +, but here + is numeric addition. Rewrite it as || or CONCAT() — we will not guess which you meant.'
  },
  {
    id: 'ilike-on-sqlite',
    from: ['postgres'],
    test: masked => /\bILIKE\b/i.test(masked),
    message: 'ILIKE is valid PostgreSQL, but this query is running on SQLite, where LIKE is already case-insensitive for ASCII.'
  },
  {
    id: 'tsql-plus-days',
    from: ['tsql'],
    test: masked => /\bDATEADD\s*\(/i.test(masked),
    message: 'DATEADD has no SQLite equivalent we translate. Use DATE(col, \'+7 day\') to express the same thing here.'
  }
];

/**
 * Translate `sql` written in `fromDialect` so it can execute on `targetEngine`.
 * Returns { sql, applied: [{label, why}], warnings: [string] }.
 */
export function translate(sql, fromDialect, targetEngine) {
  const applied = [];
  const warnings = [];
  const { masked, lits } = mask(sql);
  let work = masked;

  for (const w of WARNINGS) {
    if (w.from.includes(fromDialect) && w.test(work)) warnings.push(w.message);
  }

  for (const rule of RULES) {
    if (!rule.from.includes(fromDialect)) continue;
    if (!rule.targets.includes(targetEngine)) continue;
    const next = rule.apply(work);
    if (next !== work) {
      work = next;
      applied.push({ label: rule.label, why: rule.why });
    }
  }

  return { sql: unmask(work, lits), applied, warnings };
}

export const TRANSLATION_RULES = RULES;
