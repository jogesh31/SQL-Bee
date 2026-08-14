# SQL Bee

A browser-based SQL practice site — 60 interview-style questions with a real SQL engine,
instant execution and automatic answer checking. Runs entirely offline on your machine.

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
  Brief / Walkthrough / Other ways / History.

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

### Layout

The question fills the left pane; the editor and output fill the right pane.

Left pane tabs:

- **Brief** — the prompt, each table's column definitions, example input rows, and the
  example output your query must reproduce.
- **Walkthrough** — the reference solution with an explanation, loadable into the editor.
- **Other ways** — other genuinely different queries that are also accepted.
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
must be rejected. It currently runs **157 checks, all passing**. Run it after editing questions.

Progress, per-question drafts and submission history are saved to `localStorage`.

There is no separate schema browser: every question's **Brief** tab already lists the column
definitions and sample rows for exactly the tables that question uses, which is more useful
than a global schema panel and keeps the reference next to the prompt.

## Content

60 questions across three datasets:

| Dataset | Tables | Focus |
|---|---|---|
| HR / Company | `employees`, `departments`, `salaries_history` | self-joins, salary ranking, NULLs |
| Sales / E-commerce | `customers`, `orders`, `order_items`, `products`, `payments` | revenue, multi-table joins, time series |
| Product Analytics | `users`, `events` | DAU, retention, referral chains |

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
