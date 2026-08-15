/* Dialect metadata and the syntax differences that actually come up in interviews.
 *
 * Honesty rules for this file:
 *  - `runs: true` means queries genuinely execute on that engine in your browser.
 *  - `runs: false` means we cannot execute that engine client-side (no browser build
 *    exists for MySQL or SQL Server), so the query is translated to an engine that
 *    does run. The UI always says which engine actually executed.
 */

export const DIALECTS = {
  sqlite: {
    id: 'sqlite',
    label: 'SQLite',
    short: 'SQLite',
    runs: true,
    engine: 'sqlite',
    note: 'Runs for real — SQLite compiled to WebAssembly, executing in this tab.'
  },
  postgres: {
    id: 'postgres',
    label: 'PostgreSQL',
    short: 'Postgres',
    runs: true,
    engine: 'postgres',
    note: 'Runs for real — PostgreSQL compiled to WebAssembly, executing in this tab.'
  },
  mysql: {
    id: 'mysql',
    label: 'MySQL',
    short: 'MySQL',
    runs: false,
    engine: 'sqlite',
    note: 'MySQL has no browser build, so common MySQL idioms are rewritten and the query runs on SQLite. Any rewrite is shown to you.'
  },
  tsql: {
    id: 'tsql',
    label: 'SQL Server (T-SQL)',
    short: 'T-SQL',
    runs: false,
    engine: 'sqlite',
    note: 'SQL Server has no browser build, so common T-SQL idioms are rewritten and the query runs on SQLite. Any rewrite is shown to you.'
  }
};

export const DIALECT_ORDER = ['sqlite', 'postgres', 'mysql', 'tsql'];

/* Syntax differences worth knowing for a data-analyst interview.
 * `detect` marks the rows relevant to a given question's solution. */
export const DIFFERENCES = [
  {
    topic: 'Limit rows',
    detect: /\bLIMIT\b/i,
    sqlite: 'SELECT ... LIMIT 10',
    postgres: 'SELECT ... LIMIT 10\n-- or: FETCH FIRST 10 ROWS ONLY',
    mysql: 'SELECT ... LIMIT 10',
    tsql: 'SELECT TOP (10) ...',
    gotcha: 'T-SQL puts the row count right after SELECT, not at the end of the query.'
  },
  {
    topic: 'Paging / offset',
    detect: /\bOFFSET\b/i,
    sqlite: 'LIMIT 10 OFFSET 20',
    postgres: 'LIMIT 10 OFFSET 20',
    mysql: 'LIMIT 20, 10\n-- or: LIMIT 10 OFFSET 20',
    tsql: 'ORDER BY col\nOFFSET 20 ROWS FETCH NEXT 10 ROWS ONLY',
    gotcha: 'MySQL\'s two-argument form is LIMIT offset, count — the reverse of what most people expect. T-SQL requires ORDER BY before OFFSET.'
  },
  {
    topic: 'NULL fallback',
    detect: /\b(COALESCE|IFNULL|ISNULL)\b/i,
    sqlite: 'COALESCE(a, 0) — IFNULL(a, 0) also works',
    postgres: 'COALESCE(a, 0)',
    mysql: 'COALESCE(a, 0) — IFNULL(a, 0) also works',
    tsql: 'COALESCE(a, 0) — ISNULL(a, 0) also works',
    gotcha: 'COALESCE is the only one all four accept. ISNULL is T-SQL only and takes exactly two arguments.'
  },
  {
    topic: 'String concatenation',
    detect: /\|\||\bCONCAT\b/i,
    sqlite: "first || ' ' || last",
    postgres: "first || ' ' || last",
    mysql: "CONCAT(first, ' ', last)",
    tsql: "first + ' ' + last  -- or CONCAT(first, ' ', last)",
    gotcha: 'In MySQL || means OR by default, so it will not concatenate. CONCAT() is the portable choice.'
  },
  {
    topic: 'Current date',
    detect: /\b(CURRENT_DATE|CURRENT_TIMESTAMP|NOW|GETDATE|CURDATE|DATE\s*\(\s*'now')/i,
    sqlite: "DATE('now')",
    postgres: 'CURRENT_DATE — NOW() for timestamp',
    mysql: 'CURDATE() — NOW() for timestamp',
    tsql: 'CAST(GETDATE() AS date) — SYSDATETIME() for timestamp',
    gotcha: 'CURRENT_DATE works in Postgres, MySQL and SQL Server 2022+, but not in SQLite.'
  },
  {
    topic: 'Extract year / month',
    detect: /\b(STRFTIME|EXTRACT|DATE_PART|YEAR\s*\(|MONTH\s*\()/i,
    sqlite: "CAST(STRFTIME('%Y', d) AS INTEGER)",
    postgres: 'EXTRACT(YEAR FROM d)\n-- or: DATE_PART(\'year\', d)',
    mysql: 'YEAR(d) — MONTH(d)',
    tsql: 'YEAR(d) — MONTH(d)\n-- or: DATEPART(year, d)',
    gotcha: 'EXTRACT is the SQL-standard form; MySQL and T-SQL both accept the shorter YEAR()/MONTH().'
  },
  {
    topic: 'Date difference (days)',
    detect: /\b(JULIANDAY|DATEDIFF|AGE)\b/i,
    sqlite: 'JULIANDAY(d1) - JULIANDAY(d2)',
    postgres: 'd1 - d2   -- date minus date yields an integer',
    mysql: 'DATEDIFF(d1, d2)',
    tsql: 'DATEDIFF(day, d2, d1)',
    gotcha: 'Argument order is reversed between MySQL and T-SQL, and T-SQL needs the unit first. Easy to get backwards under pressure.'
  },
  {
    topic: 'Conditional aggregation',
    detect: /\b(CASE|FILTER)\b/i,
    sqlite: "SUM(CASE WHEN status = 'X' THEN 1 ELSE 0 END)",
    postgres: "COUNT(*) FILTER (WHERE status = 'X')\n-- SUM(CASE ...) also works",
    mysql: "SUM(status = 'X')   -- booleans are 1/0\n-- SUM(CASE ...) also works",
    tsql: "SUM(CASE WHEN status = 'X' THEN 1 ELSE 0 END)",
    gotcha: 'SUM(CASE WHEN ...) is the one form every engine accepts — reach for it when unsure.'
  },
  {
    topic: 'Quoting identifiers',
    detect: /["`\[]/,
    sqlite: '"column name"',
    postgres: '"column name"   -- double quotes are case-sensitive',
    mysql: '`column name`',
    tsql: '[column name]',
    gotcha: 'Postgres folds unquoted names to lower case, so "Salary" and salary are different columns once you quote them.'
  },
  {
    topic: 'String length / substring',
    detect: /\b(LENGTH|LEN|SUBSTR|SUBSTRING)\b/i,
    sqlite: 'LENGTH(s), SUBSTR(s, 1, 3)',
    postgres: 'LENGTH(s), SUBSTRING(s FROM 1 FOR 3)',
    mysql: 'LENGTH(s), SUBSTRING(s, 1, 3)',
    tsql: 'LEN(s), SUBSTRING(s, 1, 3)',
    gotcha: 'T-SQL uses LEN, not LENGTH — and LEN ignores trailing spaces.'
  },
  {
    topic: 'String aggregation',
    detect: /\b(GROUP_CONCAT|STRING_AGG)\b/i,
    sqlite: "GROUP_CONCAT(name, ', ')",
    postgres: "STRING_AGG(name, ', ')",
    mysql: "GROUP_CONCAT(name SEPARATOR ', ')",
    tsql: "STRING_AGG(name, ', ')",
    gotcha: 'MySQL uses the SEPARATOR keyword rather than a second argument.'
  },
  {
    topic: 'Integer division',
    detect: /\//,
    sqlite: '1 / 2 = 0 — cast first: 1.0 * a / b',
    postgres: '1 / 2 = 0 — cast first: a::numeric / b',
    mysql: '1 / 2 = 0.5 — division returns a decimal',
    tsql: '1 / 2 = 0 — cast first: 1.0 * a / b',
    gotcha: 'MySQL is the odd one out. Everywhere else, int / int truncates — a classic source of wrong percentages.'
  },
  {
    topic: 'Case-insensitive match',
    detect: /\b(ILIKE|LIKE)\b/i,
    sqlite: "LIKE — case-insensitive for ASCII by default",
    postgres: "ILIKE — LIKE is case-SENSITIVE",
    mysql: 'LIKE — case-insensitive under the default collation',
    tsql: 'LIKE — depends on the column collation (usually insensitive)',
    gotcha: 'Postgres is the strict one: plain LIKE will not match different casing. Use ILIKE or LOWER().'
  }
];

/* Which difference rows are relevant to a particular SQL statement. */
export function relevantDifferences(sql) {
  if (!sql) return [];
  const stripped = sql.replace(/--[^\n]*/g, '');
  return DIFFERENCES.filter(d => d.detect.test(stripped));
}
