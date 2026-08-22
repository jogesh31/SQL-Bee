# SQL Bee

A browser-based SQL practice site — 85 interview-style questions with a real SQL engine,
instant execution and automatic answer checking. Runs entirely offline on your machine.

25 of them are an **advanced set** aimed at senior analyst and consulting screens
(PwC, EY, Deloitte, Accenture, Genpact, Capgemini, EXL) and product-company rounds:
gaps and islands, streaks, window frames, cohort retention, relational division and recursion.

Made by [Jogesh Kumar Sharma](https://www.linkedin.com/in/jogeshkumarsharma).

## Originality

Everything here is written from scratch and self-contained:

- **Questions, prompts, hints and explanations** are original text written against our own
  dataset. Nothing is copied from another practice site.
- **The dataset** (`data/schema.js`) is our own invention — an employees/departments HR set,
  a customers/orders/products commerce set, and a users/events product-analytics set, with
  hand-written seed rows.
- **No company attribution.** Questions are *not* labelled "asked at Google/Netflix/etc."
  We have no way to verify such claims, and the tags would be fabrications. Each question is
  instead tagged with its topic and the SQL constructs its solution actually uses — both
  derived from the question itself, so they are always accurate.
- **Visual identity** is our own: translucent panels floating over a soft gradient canvas,
  a numbered index chip with metadata chips under the title, and the tab set
  Brief / Walkthrough / Other ways / Dialects / History.

Split-pane editors, Run and Check buttons, difficulty labels and result-set grading are
functional conventions common to every coding-practice site; they are not anyone's property.

## Running it

Double-click **`Start SQL Bee.bat`**, or:

```bash
powershell -ExecutionPolicy Bypass -File serve.ps1 -Port 5600
```

Then open http://localhost:5600.

No Node.js, no database server, no internet needed — SQLite is compiled to WebAssembly and runs
inside the browser tab.

## How it works

### Themes

Two themes, toggled with the ☾ / ☀ button in the top bar and remembered between visits:

| | Canvas | Accent | Run query | Check answer |
|---|---|---|---|---|
| **Frost** (default) | pale snow-blue with a warm dawn tint | royal blue | white, blue outline | solid blue |
| **Lodge** | deep fog-blue | amber | amber fill | white pill |

The two action buttons never share a colour in either theme, so "execute" and "grade" stay
visually distinct. All body, label and button text is checked against WCAG AA (4.5:1) contrast
on both canvases.

### SQL dialects

Pick the dialect you are practising from the dropdown above the editor. **The badge next
to it always says which engine actually executed your query** — no pretending.

| Dialect | Status | Why |
|---|---|---|
| **SQLite** | executes for real | Compiled to WebAssembly, running in the tab |
| **MySQL** | you write it, SQLite runs it | No browser build of MySQL exists — its [WebAssembly support](https://blogs.oracle.com/mysql/webassembly-integration-for-nextgen-data-apps-in-mysql) is for UDFs running *inside* the server |
| **SQL Server (T-SQL)** | you write it, SQLite runs it | Closed-source; Microsoft ships no browser build |
| **PostgreSQL** | reference only | Included in the comparison table because most analyst interviews use it |

When you write MySQL or T-SQL, a bounded set of idioms is rewritten before execution —
`SELECT TOP 5` → `LIMIT 5`, `ISNULL` → `COALESCE`, `LEN` → `LENGTH`, `[col]` and `` `col` ``
→ `"col"`, `YEAR(d)` → `STRFTIME`, `DATEDIFF` → `JULIANDAY` arithmetic, MySQL's
`LIMIT offset, count` → `LIMIT count OFFSET offset`, and more. **Every rewrite is listed
above your results** with the reason, so the difference is taught rather than hidden.

Ambiguous constructs are refused rather than guessed: T-SQL's `+` for string concatenation
is indistinguishable from numeric addition without type information, so it produces a
warning instead of a silent rewrite.

The **Dialects** tab shows the syntax differences that apply to the current question first,
then a full reference covering row limiting, paging, NULL handling, concatenation, date
functions, conditional aggregation, identifier quoting, string aggregation, integer
division and case-sensitivity — each with the gotcha that trips people up.

Rewriting can never change what counts as correct: grading always runs the reference
solution through the raw SQLite engine, and the self-test asserts that all 60 solutions
produce identical results after being translated from every dialect.

### Layout

The question fills the left pane; the editor and output fill the right pane.

Left pane tabs:

- **Brief** — the prompt, each table's column definitions, example input rows, and the
  example output your query must reproduce.
- **Walkthrough** — the reference solution with an explanation, loadable into the editor.
- **Other ways** — other genuinely different queries that are also accepted.
- **Dialects** — how this question's SQL differs across SQLite, PostgreSQL, MySQL and T-SQL.
- **History** — your local attempt history for this question, each reloadable.

Drag the divider between the panes to resize them.

Two separate buttons sit at the bottom right of the output panel:

- **Run query** (`Ctrl+Enter`) — executes only. Shows the result grid and the row count,
  and explicitly says "not checked". It never marks anything right or wrong and never
  affects your progress.
- **Check answer** (`Ctrl+Shift+Enter`) — grades it. Shows **Correct ✓** or **Incorrect ✗**
  with the reason (wrong column count, wrong row count, right rows in the wrong order, or the
  specific unexpected row).

Grading is **result-based, not text-based**: your result set is compared against the reference
solution's result set, so *any* approach that produces the right answer is accepted — join vs
subquery vs window function, different aliases, extra ORDER BY, different formatting. Row order
is only enforced on questions that explicitly ask for sorted output.

Where a question has genuinely different solutions, the **Other ways** tab lists them.

### Self-test

`sqlHubSelfTest()` in the browser console re-runs the whole grading harness: every reference
solution and every listed alternative approach must grade Correct, and obviously wrong queries
must be rejected. It currently runs **496 checks, all passing**. Run it after editing questions.

Progress, per-question drafts and submission history are saved to `localStorage`.

There is no separate schema browser: every question's **Brief** tab already lists the column
definitions and sample rows for exactly the tables that question uses, which is more useful
than a global schema panel and keeps the reference next to the prompt.

## Content

85 questions across four datasets:

| Dataset | Tables | Focus |
|---|---|---|
| HR / Company | `employees`, `departments`, `salaries_history` | self-joins, salary ranking, NULLs |
| Sales / E-commerce | `customers`, `orders`, `order_items`, `products`, `payments` | revenue, multi-table joins, time series |
| Product Analytics | `users`, `events` | DAU, retention, referral chains |
| Interview Drills | `seats`, `logins`, `daily_metrics`, `subscription_log`, `messages`, `exam_scores`, `invoices` | gaps and islands, streaks, sessionization, cohorts, division, invoice-gap audits |

### The advanced set (questions 61-85)

Every one is rated Hard and carries its **own distinct topic label** — no pattern is
covered twice, so working through all 25 means meeting 25 different techniques:

| # | Question | Pattern |
|---|---|---|
| 61 | Blocks of three or more free seats | Gaps & Islands |
| 62 | Longest daily login streak | Streaks (date arithmetic) |
| 63 | Cities rising three days straight | Consecutive Trends |
| 64 | Collapse a status log into ranges | Range Compaction |
| 65 | Third highest distinct salary, safely | Ranking + NULL edge case |
| 66 | Median salary per department | Median without PERCENTILE_CONT |
| 67 | Top revenue quartile | NTILE buckets |
| 68 | Paid more than every other dept average | Correlated subquery |
| 69 | Seven-day rolling total | Rolling window frame |
| 70 | Days that spiked above baseline | Frame excluding current row |
| 71 | Full rep-by-region grid | CROSS JOIN + LEFT JOIN |
| 72 | Three-day retention by cohort | Cohort analysis |
| 73 | Users who went quiet | Anti-join |
| 74 | Products bought together | Basket analysis |
| 75 | Conversations that went both ways | Graph pairs |
| 76 | Identical marks in two subjects | Self join |
| 77 | Students sitting every subject | Relational division |
| 78 | Web-only, mobile-only or both | Conditional aggregation |
| 79 | Favourite category per customer | Arg-max with tie-break |
| 80 | Second most recent login | Nth value + NULL edge case |
| 81 | Gap between first and second order | Time between events |
| 82 | Split activity into sessions | Sessionization |
| 83 | Missing invoice numbers | Gap detection |
| 84 | Depth of the reporting chain | Recursive CTE |
| 85 | New versus returning orders | Cross-grain aggregation |

The questions are original text written against our own dataset. Where a pattern is a
well-known interview classic, only the *technique* is shared — the scenario, wording,
schema and data are ours.

Topics: SELECT basics, filtering, NULL handling, sorting/limiting, aggregation, GROUP BY, HAVING,
all join types, self joins, anti-joins, subqueries, correlated subqueries, CASE WHEN and conditional
aggregation (pivots), date functions, window functions (RANK / ROW_NUMBER / LAG / running totals /
partitioned averages), CTEs, and data-quality checks.

## Adding questions

Append an object to `QUESTIONS` in `data/questions.js`:

```js
{
  id: 61, title: '...', difficulty: 'Medium', topic: 'JOINs',
  prompt: 'What the user must return. Use `backticks` for column names.',
  tables: ['orders'], orderMatters: false,
  hint: '...',
  solution: 'SELECT ...;',   // the reference query — grading compares against its output
  explain: 'Why this works / the interview takeaway.'
}
```

Set `orderMatters: true` only when the prompt asks for a specific sort order.
To add or change data, edit `data/schema.js` — it is plain SQL executed at startup.

While authoring, `sqlHubRun('SELECT ...')` in the browser console runs any query against
the live database and returns `{columns, rows}`, which is the quickest way to check what a
new solution actually produces. Then run `sqlHubSelfTest()` before committing.
