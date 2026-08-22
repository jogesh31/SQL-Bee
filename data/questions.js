// Question bank. Each question is graded by running the reference `solution`
// and comparing the user's result set against it.
// orderMatters: true  -> row order must match exactly (question asks for sorted output)
// orderMatters: false -> rows compared as an unordered multiset

export const QUESTIONS = [
  // ---------------------------------------------------------------- BASICS
  {
    id: 1, title: 'Select all employees', difficulty: 'Easy', topic: 'SELECT Basics',
    prompt: 'Return every column for every row in the `employees` table.',
    tables: ['employees'], orderMatters: false,
    hint: 'The simplest possible query — no filtering needed.',
    solution: 'SELECT * FROM employees;',
    explain: '`SELECT *` returns all columns. Fine for exploration, but in production always list the columns you actually need.'
  },
  {
    id: 2, title: 'Employee names and salaries', difficulty: 'Easy', topic: 'SELECT Basics',
    prompt: 'Return only `first_name`, `last_name` and `salary` for all employees.',
    tables: ['employees'], orderMatters: false,
    hint: 'List the three columns after SELECT, separated by commas.',
    solution: 'SELECT first_name, last_name, salary FROM employees;',
    explain: 'Projecting only needed columns reduces data scanned — the habit interviewers look for.'
  },
  {
    id: 3, title: 'High earners', difficulty: 'Easy', topic: 'Filtering',
    prompt: 'Return `first_name`, `last_name` and `salary` for employees earning more than 100000.',
    tables: ['employees'], orderMatters: false,
    hint: 'Use a WHERE clause with the > operator.',
    solution: 'SELECT first_name, last_name, salary FROM employees WHERE salary > 100000;',
    explain: 'WHERE filters rows before grouping or output. Note `>` is strict — 100000 exactly would be excluded.'
  },
  {
    id: 4, title: 'Employees in Bangalore or Pune', difficulty: 'Easy', topic: 'Filtering',
    prompt: 'Return `emp_id`, `first_name` and `city` for employees based in Bangalore or Pune.',
    tables: ['employees'], orderMatters: false,
    hint: 'IN is cleaner than chaining OR conditions.',
    solution: "SELECT emp_id, first_name, city FROM employees WHERE city IN ('Bangalore','Pune');",
    explain: '`IN (...)` is shorthand for multiple OR comparisons and reads far better with 3+ values.'
  },
  {
    id: 5, title: 'Salary band', difficulty: 'Easy', topic: 'Filtering',
    prompt: 'Return `first_name`, `last_name`, `salary` for employees whose salary is between 80000 and 120000 (inclusive).',
    tables: ['employees'], orderMatters: false,
    hint: 'BETWEEN is inclusive on both ends.',
    solution: 'SELECT first_name, last_name, salary FROM employees WHERE salary BETWEEN 80000 AND 120000;',
    explain: 'BETWEEN a AND b is equivalent to `>= a AND <= b`. A very common gotcha is assuming it is exclusive.'
  },
  {
    id: 6, title: 'Find the engineers', difficulty: 'Easy', topic: 'Filtering',
    prompt: "Return `emp_id`, `first_name`, `job_title` for employees whose job title contains the word 'Engineer'.",
    tables: ['employees'], orderMatters: false,
    hint: "LIKE with % wildcards on both sides.",
    solution: "SELECT emp_id, first_name, job_title FROM employees WHERE job_title LIKE '%Engineer%';",
    explain: "`%` matches any sequence of characters. This catches 'Engineer', 'Senior Engineer', 'Engineering Manager'."
  },
  {
    id: 7, title: 'Employees without a department', difficulty: 'Easy', topic: 'NULL Handling',
    prompt: 'Return `emp_id` and `first_name` for employees who have no department assigned (`dept_id` is NULL).',
    tables: ['employees'], orderMatters: false,
    hint: 'You cannot use `= NULL`. NULL comparisons need a special operator.',
    solution: 'SELECT emp_id, first_name FROM employees WHERE dept_id IS NULL;',
    explain: 'NULL means "unknown", so `dept_id = NULL` is never true — it evaluates to NULL, not TRUE. Always use IS NULL / IS NOT NULL.'
  },
  {
    id: 8, title: 'Top 5 highest paid', difficulty: 'Easy', topic: 'Sorting & Limiting',
    prompt: 'Return `first_name`, `last_name`, `salary` of the 5 highest paid employees, ordered by salary from highest to lowest.',
    tables: ['employees'], orderMatters: true,
    hint: 'ORDER BY ... DESC then LIMIT.',
    solution: 'SELECT first_name, last_name, salary FROM employees ORDER BY salary DESC LIMIT 5;',
    explain: 'ORDER BY runs after WHERE/GROUP BY; LIMIT truncates last. Ties at the boundary are cut arbitrarily — use RANK() when ties must be kept.'
  },
  {
    id: 9, title: 'Distinct cities', difficulty: 'Easy', topic: 'SELECT Basics',
    prompt: 'Return the list of unique cities where employees are located. Alias the column as `city`.',
    tables: ['employees'], orderMatters: false,
    hint: 'DISTINCT removes duplicate rows.',
    solution: 'SELECT DISTINCT city FROM employees;',
    explain: 'DISTINCT deduplicates across ALL selected columns, not just the first one — a frequent misconception.'
  },
  {
    id: 10, title: 'Total compensation', difficulty: 'Easy', topic: 'Calculated Columns',
    prompt: 'Return `first_name`, `salary`, and a calculated column `total_comp` equal to salary plus bonus (salary * bonus_pct). For employees with a NULL bonus_pct, total_comp should equal their salary.',
    tables: ['employees'], orderMatters: false,
    hint: 'COALESCE turns NULL into a default value before arithmetic.',
    solution: 'SELECT first_name, salary, salary + salary * COALESCE(bonus_pct, 0) AS total_comp FROM employees;',
    explain: 'Any arithmetic involving NULL yields NULL. COALESCE(x, 0) substitutes a fallback so the row is not silently lost.'
  },

  // ------------------------------------------------------------ AGGREGATION
  {
    id: 11, title: 'Count the employees', difficulty: 'Easy', topic: 'Aggregation',
    prompt: 'Return a single row with the total number of employees, aliased as `total_employees`.',
    tables: ['employees'], orderMatters: false,
    hint: 'COUNT(*) counts rows.',
    solution: 'SELECT COUNT(*) AS total_employees FROM employees;',
    explain: 'COUNT(*) counts rows including NULLs; COUNT(column) skips rows where that column is NULL. Interviewers love this distinction.'
  },
  {
    id: 12, title: 'Salary statistics', difficulty: 'Easy', topic: 'Aggregation',
    prompt: 'Return the minimum, maximum, average and total salary across all employees, aliased `min_salary`, `max_salary`, `avg_salary`, `total_salary`.',
    tables: ['employees'], orderMatters: false,
    hint: 'MIN, MAX, AVG, SUM in a single SELECT.',
    solution: 'SELECT MIN(salary) AS min_salary, MAX(salary) AS max_salary, AVG(salary) AS avg_salary, SUM(salary) AS total_salary FROM employees;',
    explain: 'Multiple aggregates over the same scan cost no more than one — the engine computes them in a single pass.'
  },
  {
    id: 13, title: 'Headcount per department', difficulty: 'Easy', topic: 'GROUP BY',
    prompt: 'Return `dept_id` and the number of employees in each department, aliased `headcount`. Exclude employees with no department.',
    tables: ['employees'], orderMatters: false,
    hint: 'GROUP BY the column you want one row per.',
    solution: 'SELECT dept_id, COUNT(*) AS headcount FROM employees WHERE dept_id IS NOT NULL GROUP BY dept_id;',
    explain: 'Every non-aggregated column in SELECT must appear in GROUP BY (strict SQL engines enforce this; SQLite is lenient but do it anyway).'
  },
  {
    id: 14, title: 'Average salary by job title', difficulty: 'Medium', topic: 'GROUP BY',
    prompt: 'Return `job_title` and the average salary as `avg_salary`, sorted by avg_salary descending.',
    tables: ['employees'], orderMatters: true,
    hint: 'GROUP BY job_title, then ORDER BY the aggregate.',
    solution: 'SELECT job_title, AVG(salary) AS avg_salary FROM employees GROUP BY job_title ORDER BY avg_salary DESC;',
    explain: 'You can ORDER BY an alias defined in SELECT because ORDER BY is logically evaluated after SELECT.'
  },
  {
    id: 15, title: 'Departments with more than 3 people', difficulty: 'Medium', topic: 'HAVING',
    prompt: 'Return `dept_id` and `headcount` for departments having more than 3 employees.',
    tables: ['employees'], orderMatters: false,
    hint: 'WHERE filters rows; HAVING filters groups.',
    solution: 'SELECT dept_id, COUNT(*) AS headcount FROM employees GROUP BY dept_id HAVING COUNT(*) > 3;',
    explain: 'HAVING runs after GROUP BY, so it can reference aggregates. WHERE runs before and cannot.'
  },
  {
    id: 16, title: 'Cities with high average salary', difficulty: 'Medium', topic: 'HAVING',
    prompt: 'Return `city` and `avg_salary` for cities where the average salary of active employees (`is_active = 1`) exceeds 90000.',
    tables: ['employees'], orderMatters: false,
    hint: 'You need both WHERE (row filter) and HAVING (group filter) in the same query.',
    solution: 'SELECT city, AVG(salary) AS avg_salary FROM employees WHERE is_active = 1 GROUP BY city HAVING AVG(salary) > 90000;',
    explain: 'Order of evaluation: FROM → WHERE → GROUP BY → HAVING → SELECT → ORDER BY → LIMIT. Memorise this; it explains most SQL surprises.'
  },
  {
    id: 17, title: 'Count distinct customers per country', difficulty: 'Easy', topic: 'GROUP BY',
    prompt: 'Return `country` and the number of customers in each, aliased `customer_count`, sorted by customer_count descending then country ascending.',
    tables: ['customers'], orderMatters: true,
    hint: 'ORDER BY accepts multiple keys with different directions.',
    solution: 'SELECT country, COUNT(*) AS customer_count FROM customers GROUP BY country ORDER BY customer_count DESC, country ASC;',
    explain: 'A deterministic tiebreaker in ORDER BY makes results reproducible — important when a test harness compares output.'
  },
  {
    id: 18, title: 'Orders per status', difficulty: 'Easy', topic: 'GROUP BY',
    prompt: 'Return `status` and the number of orders with that status, aliased `order_count`.',
    tables: ['orders'], orderMatters: false,
    hint: 'Group by the status column.',
    solution: 'SELECT status, COUNT(*) AS order_count FROM orders GROUP BY status;',
    explain: 'This is the canonical "distribution" query — the first thing an analyst runs on a new table.'
  },

  // ------------------------------------------------------------------ JOINS
  {
    id: 19, title: 'Employees with department names', difficulty: 'Easy', topic: 'JOINs',
    prompt: 'Return `first_name`, `last_name` and `dept_name` for every employee that belongs to a department.',
    tables: ['employees', 'departments'], orderMatters: false,
    hint: 'INNER JOIN on dept_id drops employees with no department automatically.',
    solution: 'SELECT e.first_name, e.last_name, d.dept_name FROM employees e JOIN departments d ON e.dept_id = d.dept_id;',
    explain: 'INNER JOIN keeps only rows matching on both sides, so the NULL-department employee is excluded without an explicit filter.'
  },
  {
    id: 20, title: 'All employees, department optional', difficulty: 'Medium', topic: 'JOINs',
    prompt: 'Return `first_name` and `dept_name` for ALL employees, including those without a department (dept_name should be NULL for them).',
    tables: ['employees', 'departments'], orderMatters: false,
    hint: 'LEFT JOIN preserves every row from the left table.',
    solution: 'SELECT e.first_name, d.dept_name FROM employees e LEFT JOIN departments d ON e.dept_id = d.dept_id;',
    explain: 'LEFT JOIN keeps all left rows and fills unmatched right columns with NULL. Switching JOIN → LEFT JOIN is the fix for "rows are disappearing".'
  },
  {
    id: 21, title: 'Departments with no employees', difficulty: 'Medium', topic: 'JOINs',
    prompt: 'Return `dept_id` and `dept_name` for departments that currently have zero employees.',
    tables: ['departments', 'employees'], orderMatters: false,
    hint: 'LEFT JOIN then filter where the right-side key IS NULL (an "anti-join").',
    solution: 'SELECT d.dept_id, d.dept_name FROM departments d LEFT JOIN employees e ON d.dept_id = e.dept_id WHERE e.emp_id IS NULL;',
    explain: 'The LEFT JOIN + IS NULL pattern is the standard anti-join. NOT EXISTS is an equally valid and often faster alternative.'
  },
  {
    id: 22, title: 'Employee and their manager', difficulty: 'Medium', topic: 'Self Join',
    prompt: "Return each employee's `first_name` as `employee` and their manager's `first_name` as `manager`. Include employees with no manager (manager should be NULL).",
    tables: ['employees'], orderMatters: false,
    hint: 'Join the employees table to itself with two different aliases.',
    solution: 'SELECT e.first_name AS employee, m.first_name AS manager FROM employees e LEFT JOIN employees m ON e.manager_id = m.emp_id;',
    explain: 'A self-join treats one table as two logical tables. Aliases are mandatory — without them the engine cannot tell the copies apart.'
  },
  {
    id: 23, title: 'Managers who earn less than their report', difficulty: 'Hard', topic: 'Self Join',
    prompt: 'Return `employee` (first_name), `employee_salary`, `manager` (first_name) and `manager_salary` for every case where an employee earns MORE than their direct manager.',
    tables: ['employees'], orderMatters: false,
    hint: 'Self join, then compare the two salary columns in WHERE.',
    solution: 'SELECT e.first_name AS employee, e.salary AS employee_salary, m.first_name AS manager, m.salary AS manager_salary FROM employees e JOIN employees m ON e.manager_id = m.emp_id WHERE e.salary > m.salary;',
    explain: 'A classic FAANG screen. The trick is realising the comparison happens between two aliases of the same table.'
  },
  {
    id: 24, title: 'Orders with customer names', difficulty: 'Easy', topic: 'JOINs',
    prompt: 'Return `order_id`, `order_date` and `customer_name` for all orders.',
    tables: ['orders', 'customers'], orderMatters: false,
    hint: 'Join orders to customers on customer_id.',
    solution: 'SELECT o.order_id, o.order_date, c.customer_name FROM orders o JOIN customers c ON o.customer_id = c.customer_id;',
    explain: 'Fact table (orders) joined to dimension table (customers) — the bread and butter of analytics SQL.'
  },
  {
    id: 25, title: 'Three-table join: order line detail', difficulty: 'Medium', topic: 'JOINs',
    prompt: 'Return `order_id`, `customer_name`, `product_name` and `quantity` for every order line item.',
    tables: ['orders', 'customers', 'order_items', 'products'], orderMatters: false,
    hint: 'Chain the joins: orders → customers, orders → order_items → products.',
    solution: 'SELECT o.order_id, c.customer_name, p.product_name, oi.quantity FROM orders o JOIN customers c ON o.customer_id = c.customer_id JOIN order_items oi ON o.order_id = oi.order_id JOIN products p ON oi.product_id = p.product_id;',
    explain: 'Multi-table joins expand row counts — one order with 2 items becomes 2 rows. Always know the grain of your result.'
  },
  {
    id: 26, title: 'Customers who never ordered', difficulty: 'Medium', topic: 'JOINs',
    prompt: 'Return `customer_id` and `customer_name` for customers who have never placed an order.',
    tables: ['customers', 'orders'], orderMatters: false,
    hint: 'Anti-join, or NOT IN / NOT EXISTS on the orders table.',
    solution: 'SELECT c.customer_id, c.customer_name FROM customers c LEFT JOIN orders o ON c.customer_id = o.customer_id WHERE o.order_id IS NULL;',
    explain: 'Careful with NOT IN: if the subquery returns any NULL, NOT IN returns no rows at all. NOT EXISTS and LEFT JOIN are NULL-safe.'
  },
  {
    id: 27, title: 'Revenue per order', difficulty: 'Medium', topic: 'JOINs + Aggregation',
    prompt: 'Return `order_id` and total revenue as `order_revenue`, where revenue per line = quantity * unit_price * (1 - discount). Sort by order_revenue descending.',
    tables: ['order_items'], orderMatters: true,
    hint: 'Aggregate the line-level expression with SUM and GROUP BY order_id.',
    solution: 'SELECT order_id, SUM(quantity * unit_price * (1 - discount)) AS order_revenue FROM order_items GROUP BY order_id ORDER BY order_revenue DESC;',
    explain: 'Compute at the line grain, then aggregate up. Applying the discount after SUM would give a different (wrong) answer.'
  },
  {
    id: 28, title: 'Revenue per customer', difficulty: 'Medium', topic: 'JOINs + Aggregation',
    prompt: 'Return `customer_name` and their total revenue as `total_revenue` (quantity * unit_price * (1 - discount)), counting only orders that are not Cancelled. Sort by total_revenue descending.',
    tables: ['customers', 'orders', 'order_items'], orderMatters: true,
    hint: "Join three tables, filter status <> 'Cancelled', then group by customer.",
    solution: "SELECT c.customer_name, SUM(oi.quantity * oi.unit_price * (1 - oi.discount)) AS total_revenue FROM customers c JOIN orders o ON c.customer_id = o.customer_id JOIN order_items oi ON o.order_id = oi.order_id WHERE o.status <> 'Cancelled' GROUP BY c.customer_name ORDER BY total_revenue DESC;",
    explain: 'Filter on the fact table before aggregating. Note `<>` also excludes nothing when status is NULL — check your data.'
  },
  {
    id: 29, title: 'Top selling product category', difficulty: 'Medium', topic: 'JOINs + Aggregation',
    prompt: 'Return `category` and total units sold as `units_sold`, sorted by units_sold descending.',
    tables: ['products', 'order_items'], orderMatters: true,
    hint: 'Join order_items to products, then SUM(quantity) grouped by category.',
    solution: 'SELECT p.category, SUM(oi.quantity) AS units_sold FROM order_items oi JOIN products p ON oi.product_id = p.product_id GROUP BY p.category ORDER BY units_sold DESC;',
    explain: 'Group by an attribute from the dimension table while aggregating a measure from the fact table — the core of every BI query.'
  },
  {
    id: 30, title: 'Sales rep performance', difficulty: 'Medium', topic: 'JOINs + Aggregation',
    prompt: 'Return the sales rep `first_name` as `rep`, the number of orders they handled as `order_count`, and total revenue as `revenue`. Only include Delivered orders. Sort by revenue descending.',
    tables: ['employees', 'orders', 'order_items'], orderMatters: true,
    hint: 'orders.emp_id links to employees. Use COUNT(DISTINCT o.order_id) so line items do not inflate the count.',
    solution: "SELECT e.first_name AS rep, COUNT(DISTINCT o.order_id) AS order_count, SUM(oi.quantity * oi.unit_price * (1 - oi.discount)) AS revenue FROM employees e JOIN orders o ON e.emp_id = o.emp_id JOIN order_items oi ON o.order_id = oi.order_id WHERE o.status = 'Delivered' GROUP BY e.first_name ORDER BY revenue DESC;",
    explain: 'COUNT(DISTINCT ...) after a fan-out join is the single most common correctness bug in analyst SQL. Watch for it.'
  },

  // -------------------------------------------------------------- SUBQUERIES
  {
    id: 31, title: 'Above average earners', difficulty: 'Medium', topic: 'Subqueries',
    prompt: 'Return `first_name`, `last_name`, `salary` for employees earning more than the company-wide average salary. Sort by salary descending.',
    tables: ['employees'], orderMatters: true,
    hint: 'Put the AVG in a scalar subquery inside WHERE.',
    solution: 'SELECT first_name, last_name, salary FROM employees WHERE salary > (SELECT AVG(salary) FROM employees) ORDER BY salary DESC;',
    explain: 'A scalar subquery returns one value and can sit anywhere an expression can. You cannot write `WHERE salary > AVG(salary)` — aggregates are not allowed in WHERE.'
  },
  {
    id: 32, title: 'Second highest salary', difficulty: 'Medium', topic: 'Subqueries',
    prompt: 'Return the second highest distinct salary in the company as a single column named `second_highest_salary`.',
    tables: ['employees'], orderMatters: false,
    hint: 'Find the max salary that is less than the overall max — or use DISTINCT with OFFSET.',
    solution: 'SELECT MAX(salary) AS second_highest_salary FROM employees WHERE salary < (SELECT MAX(salary) FROM employees);',
    explain: 'The MAX-of-less-than-MAX trick handles duplicates correctly and returns NULL (not an error) if there is no second value.'
  },
  {
    id: 33, title: 'Nth highest with OFFSET', difficulty: 'Medium', topic: 'Subqueries',
    prompt: 'Return the 3rd highest distinct salary as `third_highest_salary` using ORDER BY with LIMIT/OFFSET.',
    tables: ['employees'], orderMatters: false,
    hint: 'SELECT DISTINCT salary ... ORDER BY salary DESC LIMIT 1 OFFSET 2.',
    solution: 'SELECT DISTINCT salary AS third_highest_salary FROM employees ORDER BY salary DESC LIMIT 1 OFFSET 2;',
    explain: 'OFFSET n skips n rows. Generalises to any N, which is why interviewers ask for "Nth highest" rather than "second highest".'
  },
  {
    id: 34, title: 'Employees earning above their department average', difficulty: 'Hard', topic: 'Correlated Subquery',
    prompt: 'Return `first_name`, `dept_id`, `salary` for employees who earn more than the average salary of their OWN department.',
    tables: ['employees'], orderMatters: false,
    hint: 'A correlated subquery references the outer row: WHERE salary > (SELECT AVG(salary) FROM employees e2 WHERE e2.dept_id = e1.dept_id).',
    solution: 'SELECT e1.first_name, e1.dept_id, e1.salary FROM employees e1 WHERE e1.salary > (SELECT AVG(e2.salary) FROM employees e2 WHERE e2.dept_id = e1.dept_id);',
    explain: 'A correlated subquery is re-evaluated per outer row. Readable, but a window function (AVG() OVER (PARTITION BY dept_id)) is usually faster.'
  },
  {
    id: 35, title: 'Customers with above-average order counts', difficulty: 'Hard', topic: 'Subqueries',
    prompt: 'Return `customer_name` and `order_count` for customers whose number of orders is greater than the average number of orders per ordering customer.',
    tables: ['customers', 'orders'], orderMatters: false,
    hint: 'Build a per-customer count in a derived table, then compare against the average of those counts.',
    solution: 'SELECT c.customer_name, t.order_count FROM (SELECT customer_id, COUNT(*) AS order_count FROM orders GROUP BY customer_id) t JOIN customers c ON c.customer_id = t.customer_id WHERE t.order_count > (SELECT AVG(cnt) FROM (SELECT COUNT(*) AS cnt FROM orders GROUP BY customer_id));',
    explain: 'You cannot aggregate an aggregate directly — you must nest. A derived table (subquery in FROM) gives the inner result a name to work with.'
  },
  {
    id: 36, title: 'Products never ordered', difficulty: 'Medium', topic: 'Subqueries',
    prompt: 'Return `product_id` and `product_name` for products that have never appeared in any order line.',
    tables: ['products', 'order_items'], orderMatters: false,
    hint: 'NOT EXISTS is the NULL-safe way to express "no matching row".',
    solution: 'SELECT p.product_id, p.product_name FROM products p WHERE NOT EXISTS (SELECT 1 FROM order_items oi WHERE oi.product_id = p.product_id);',
    explain: 'NOT EXISTS short-circuits on the first match and is immune to the NULL trap that breaks NOT IN.'
  },

  // ------------------------------------------------------------------- CASE
  {
    id: 37, title: 'Salary buckets', difficulty: 'Medium', topic: 'CASE WHEN',
    prompt: "Return `first_name`, `salary` and a `salary_band` column: 'High' if salary >= 150000, 'Medium' if salary >= 90000, otherwise 'Low'.",
    tables: ['employees'], orderMatters: false,
    hint: 'CASE evaluates conditions top to bottom and stops at the first match.',
    solution: "SELECT first_name, salary, CASE WHEN salary >= 150000 THEN 'High' WHEN salary >= 90000 THEN 'Medium' ELSE 'Low' END AS salary_band FROM employees;",
    explain: 'Order matters — put the most restrictive condition first, otherwise a broader earlier branch swallows everything.'
  },
  {
    id: 38, title: 'Conditional aggregation (pivot)', difficulty: 'Hard', topic: 'CASE WHEN',
    prompt: 'Return one row per `region` with `delivered_orders`, `pending_orders` and `cancelled_orders` as separate columns (counts of orders in each status).',
    tables: ['orders'], orderMatters: false,
    hint: 'SUM(CASE WHEN status = ... THEN 1 ELSE 0 END) for each status.',
    solution: "SELECT region, SUM(CASE WHEN status = 'Delivered' THEN 1 ELSE 0 END) AS delivered_orders, SUM(CASE WHEN status = 'Pending' THEN 1 ELSE 0 END) AS pending_orders, SUM(CASE WHEN status = 'Cancelled' THEN 1 ELSE 0 END) AS cancelled_orders FROM orders GROUP BY region;",
    explain: 'Conditional aggregation is how you pivot rows into columns in plain SQL. Expect this in almost every analyst interview.'
  },
  {
    id: 39, title: 'Active vs inactive headcount', difficulty: 'Medium', topic: 'CASE WHEN',
    prompt: 'Return `dept_id`, `active_count` and `inactive_count` per department (based on the `is_active` flag).',
    tables: ['employees'], orderMatters: false,
    hint: 'Same conditional aggregation pattern, on the is_active flag.',
    solution: 'SELECT dept_id, SUM(CASE WHEN is_active = 1 THEN 1 ELSE 0 END) AS active_count, SUM(CASE WHEN is_active = 0 THEN 1 ELSE 0 END) AS inactive_count FROM employees GROUP BY dept_id;',
    explain: 'COUNT(CASE WHEN cond THEN 1 END) works too — COUNT ignores the NULLs produced by the missing ELSE.'
  },

  // ----------------------------------------------------------------- DATES
  {
    id: 40, title: 'Employees hired after 2020', difficulty: 'Easy', topic: 'Date Functions',
    prompt: "Return `first_name`, `hire_date` for employees hired on or after 2020-01-01. Sort by hire_date ascending.",
    tables: ['employees'], orderMatters: true,
    hint: 'ISO date strings (YYYY-MM-DD) compare correctly as text.',
    solution: "SELECT first_name, hire_date FROM employees WHERE hire_date >= '2020-01-01' ORDER BY hire_date ASC;",
    explain: 'ISO-8601 formatting means lexicographic ordering equals chronological ordering — a big reason it is the standard.'
  },
  {
    id: 41, title: 'Hires per year', difficulty: 'Medium', topic: 'Date Functions',
    prompt: 'Return `hire_year` and the number of employees hired that year as `hires`, sorted by hire_year ascending.',
    tables: ['employees'], orderMatters: true,
    hint: "Extract the year with STRFTIME('%Y', hire_date) in SQLite.",
    solution: "SELECT STRFTIME('%Y', hire_date) AS hire_year, COUNT(*) AS hires FROM employees GROUP BY hire_year ORDER BY hire_year ASC;",
    explain: 'Every engine spells this differently: STRFTIME (SQLite), EXTRACT/DATE_TRUNC (Postgres), YEAR() (MySQL), DATEPART (SQL Server).'
  },
  {
    id: 42, title: 'Monthly revenue trend', difficulty: 'Hard', topic: 'Date Functions',
    prompt: "Return `order_month` (format 'YYYY-MM') and total revenue as `revenue` for non-cancelled orders, sorted by order_month ascending.",
    tables: ['orders', 'order_items'], orderMatters: true,
    hint: "STRFTIME('%Y-%m', o.order_date) gives the month bucket.",
    solution: "SELECT STRFTIME('%Y-%m', o.order_date) AS order_month, SUM(oi.quantity * oi.unit_price * (1 - oi.discount)) AS revenue FROM orders o JOIN order_items oi ON o.order_id = oi.order_id WHERE o.status <> 'Cancelled' GROUP BY order_month ORDER BY order_month ASC;",
    explain: 'Truncating a date to a month bucket then aggregating is the standard time-series pattern behind every revenue chart.'
  },
  {
    id: 43, title: 'Shipping delay', difficulty: 'Medium', topic: 'Date Functions',
    prompt: 'Return `order_id`, `order_date`, `ship_date` and the number of days between them as `days_to_ship`, only for orders that have shipped. Sort by days_to_ship descending.',
    tables: ['orders'], orderMatters: true,
    hint: 'JULIANDAY(a) - JULIANDAY(b) gives a day difference in SQLite. Cast to INTEGER for whole days.',
    solution: 'SELECT order_id, order_date, ship_date, CAST(JULIANDAY(ship_date) - JULIANDAY(order_date) AS INTEGER) AS days_to_ship FROM orders WHERE ship_date IS NOT NULL ORDER BY days_to_ship DESC;',
    explain: 'Date differencing is engine-specific: DATEDIFF in MySQL/SQL Server, plain subtraction in Postgres, JULIANDAY in SQLite.'
  },
  {
    id: 44, title: 'Tenure in years', difficulty: 'Medium', topic: 'Date Functions',
    prompt: "Return `first_name` and completed years of service as `tenure_years`, measured from hire_date to 2024-01-01. Sort by tenure_years descending.",
    tables: ['employees'], orderMatters: true,
    hint: "CAST((JULIANDAY('2024-01-01') - JULIANDAY(hire_date)) / 365.25 AS INTEGER).",
    solution: "SELECT first_name, CAST((JULIANDAY('2024-01-01') - JULIANDAY(hire_date)) / 365.25 AS INTEGER) AS tenure_years FROM employees ORDER BY tenure_years DESC;",
    explain: 'Using 365.25 accounts for leap years. Never hardcode "today" in a query you will re-run — use a date function in production.'
  },

  // ------------------------------------------------------- WINDOW FUNCTIONS
  {
    id: 45, title: 'Rank employees by salary', difficulty: 'Medium', topic: 'Window Functions',
    prompt: 'Return `first_name`, `salary` and `salary_rank` where rank 1 is the highest paid employee overall. Sort by salary_rank ascending.',
    tables: ['employees'], orderMatters: true,
    hint: 'RANK() OVER (ORDER BY salary DESC).',
    solution: 'SELECT first_name, salary, RANK() OVER (ORDER BY salary DESC) AS salary_rank FROM employees ORDER BY salary_rank ASC;',
    explain: 'RANK leaves gaps after ties (1,2,2,4); DENSE_RANK does not (1,2,2,3); ROW_NUMBER always increments. Know all three.'
  },
  {
    id: 46, title: 'Rank within department', difficulty: 'Hard', topic: 'Window Functions',
    prompt: 'Return `dept_id`, `first_name`, `salary` and `dept_rank` — the salary rank within each department (1 = highest paid in that department). Sort by dept_id then dept_rank.',
    tables: ['employees'], orderMatters: true,
    hint: 'PARTITION BY dept_id restarts the ranking for each department.',
    solution: 'SELECT dept_id, first_name, salary, RANK() OVER (PARTITION BY dept_id ORDER BY salary DESC) AS dept_rank FROM employees ORDER BY dept_id, dept_rank;',
    explain: 'PARTITION BY is "GROUP BY that keeps every row". This is the #1 most-asked window function question.'
  },
  {
    id: 47, title: 'Top 2 earners per department', difficulty: 'Hard', topic: 'Window Functions',
    prompt: 'Return `dept_id`, `first_name`, `salary` for the top 2 highest-paid employees in each department. Sort by dept_id then salary descending.',
    tables: ['employees'], orderMatters: true,
    hint: 'You cannot filter a window function in WHERE — wrap it in a subquery or CTE first.',
    solution: 'SELECT dept_id, first_name, salary FROM (SELECT dept_id, first_name, salary, ROW_NUMBER() OVER (PARTITION BY dept_id ORDER BY salary DESC) AS rn FROM employees) t WHERE rn <= 2 ORDER BY dept_id, salary DESC;',
    explain: 'Window functions are computed after WHERE, so filtering on them requires a second pass — via a CTE or derived table.'
  },
  {
    id: 48, title: 'Running total of revenue', difficulty: 'Hard', topic: 'Window Functions',
    prompt: 'Return `order_month`, monthly `revenue`, and a `running_total` of revenue accumulated over months (non-cancelled orders only). Sort by order_month ascending.',
    tables: ['orders', 'order_items'], orderMatters: true,
    hint: 'Aggregate to monthly first in a CTE, then SUM(revenue) OVER (ORDER BY order_month).',
    solution: "WITH monthly AS (SELECT STRFTIME('%Y-%m', o.order_date) AS order_month, SUM(oi.quantity * oi.unit_price * (1 - oi.discount)) AS revenue FROM orders o JOIN order_items oi ON o.order_id = oi.order_id WHERE o.status <> 'Cancelled' GROUP BY order_month) SELECT order_month, revenue, SUM(revenue) OVER (ORDER BY order_month) AS running_total FROM monthly ORDER BY order_month;",
    explain: 'An OVER clause with ORDER BY and no frame defaults to RANGE BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW — exactly a running total.'
  },
  {
    id: 49, title: 'Month-over-month growth', difficulty: 'Hard', topic: 'Window Functions',
    prompt: "Return `order_month`, `revenue`, `prev_month_revenue` (previous month's revenue, NULL for the first month) for non-cancelled orders. Sort by order_month ascending.",
    tables: ['orders', 'order_items'], orderMatters: true,
    hint: 'LAG(revenue) OVER (ORDER BY order_month) fetches the previous row.',
    solution: "WITH monthly AS (SELECT STRFTIME('%Y-%m', o.order_date) AS order_month, SUM(oi.quantity * oi.unit_price * (1 - oi.discount)) AS revenue FROM orders o JOIN order_items oi ON o.order_id = oi.order_id WHERE o.status <> 'Cancelled' GROUP BY order_month) SELECT order_month, revenue, LAG(revenue) OVER (ORDER BY order_month) AS prev_month_revenue FROM monthly ORDER BY order_month;",
    explain: 'LAG/LEAD look backward/forward without a self-join. Growth % is then (revenue - prev) / prev — mind division by zero and NULL.'
  },
  {
    id: 50, title: 'Salary vs department average', difficulty: 'Hard', topic: 'Window Functions',
    prompt: 'Return `first_name`, `dept_id`, `salary`, `dept_avg_salary` (average salary of their department, over every employee row).',
    tables: ['employees'], orderMatters: false,
    hint: 'AVG(salary) OVER (PARTITION BY dept_id) keeps all rows while adding the group average.',
    solution: 'SELECT first_name, dept_id, salary, AVG(salary) OVER (PARTITION BY dept_id) AS dept_avg_salary FROM employees;',
    explain: 'This replaces the correlated subquery in question 34 and is dramatically faster — one pass instead of one scan per row.'
  },
  {
    id: 51, title: 'First order per customer', difficulty: 'Hard', topic: 'Window Functions',
    prompt: "Return `customer_id`, `order_id`, `order_date` for each customer's FIRST order (earliest order_date). Sort by customer_id.",
    tables: ['orders'], orderMatters: true,
    hint: 'ROW_NUMBER() partitioned by customer, ordered by date ascending, then keep rn = 1.',
    solution: 'SELECT customer_id, order_id, order_date FROM (SELECT customer_id, order_id, order_date, ROW_NUMBER() OVER (PARTITION BY customer_id ORDER BY order_date ASC) AS rn FROM orders) t WHERE rn = 1 ORDER BY customer_id;',
    explain: 'The "first/latest row per group" pattern. ROW_NUMBER (not RANK) guarantees exactly one row per group even with ties.'
  },
  {
    id: 52, title: 'Percentage of department payroll', difficulty: 'Hard', topic: 'Window Functions',
    prompt: 'Return `first_name`, `dept_id`, `salary` and `pct_of_dept_payroll` — the employee salary as a fraction of their department total (e.g. 0.25 for 25%).',
    tables: ['employees'], orderMatters: false,
    hint: 'salary * 1.0 / SUM(salary) OVER (PARTITION BY dept_id).',
    solution: 'SELECT first_name, dept_id, salary, salary * 1.0 / SUM(salary) OVER (PARTITION BY dept_id) AS pct_of_dept_payroll FROM employees;',
    explain: 'Multiplying by 1.0 forces float division — integer division silently truncating to 0 is a classic silent bug.'
  },

  // ---------------------------------------------------------- CTEs & ADVANCED
  {
    id: 53, title: 'CTE: high value orders', difficulty: 'Medium', topic: 'CTEs',
    prompt: 'Using a CTE, return `order_id` and `order_revenue` for orders whose revenue exceeds 8000. Sort by order_revenue descending.',
    tables: ['order_items'], orderMatters: true,
    hint: 'WITH order_totals AS (...) SELECT ... FROM order_totals WHERE ...',
    solution: 'WITH order_totals AS (SELECT order_id, SUM(quantity * unit_price * (1 - discount)) AS order_revenue FROM order_items GROUP BY order_id) SELECT order_id, order_revenue FROM order_totals WHERE order_revenue > 8000 ORDER BY order_revenue DESC;',
    explain: 'CTEs name intermediate results, making long queries readable and letting you filter on aggregates without nesting subqueries.'
  },
  {
    id: 54, title: 'Multi-step CTE: best month per region', difficulty: 'Hard', topic: 'CTEs',
    prompt: 'Return `region`, `order_month` and `revenue` for the single highest-revenue month of each region (non-cancelled orders). Sort by region.',
    tables: ['orders', 'order_items'], orderMatters: true,
    hint: 'CTE 1: revenue by region+month. CTE 2: rank months within region. Then keep rank 1.',
    solution: "WITH region_month AS (SELECT o.region, STRFTIME('%Y-%m', o.order_date) AS order_month, SUM(oi.quantity * oi.unit_price * (1 - oi.discount)) AS revenue FROM orders o JOIN order_items oi ON o.order_id = oi.order_id WHERE o.status <> 'Cancelled' GROUP BY o.region, order_month), ranked AS (SELECT region, order_month, revenue, ROW_NUMBER() OVER (PARTITION BY region ORDER BY revenue DESC) AS rn FROM region_month) SELECT region, order_month, revenue FROM ranked WHERE rn = 1 ORDER BY region;",
    explain: 'Chaining CTEs turns a gnarly nested query into readable steps. This is how real production analytics SQL is written.'
  },
  {
    id: 55, title: 'Duplicate detection', difficulty: 'Medium', topic: 'Data Quality',
    prompt: 'Return `salary` and `cnt` for every salary value shared by more than one employee. Sort by cnt descending then salary descending.',
    tables: ['employees'], orderMatters: true,
    hint: 'GROUP BY the candidate duplicate column and HAVING COUNT(*) > 1.',
    solution: 'SELECT salary, COUNT(*) AS cnt FROM employees GROUP BY salary HAVING COUNT(*) > 1 ORDER BY cnt DESC, salary DESC;',
    explain: 'The universal duplicate-finding recipe. Group by whatever combination of columns defines "the same record".'
  },
  {
    id: 56, title: 'User retention: users active in May', difficulty: 'Medium', topic: 'Product Analytics',
    prompt: 'Return `user_id` and the number of distinct days each user was active as `active_days`, for users active on at least 3 distinct days. Sort by active_days descending then user_id.',
    tables: ['events'], orderMatters: true,
    hint: 'COUNT(DISTINCT event_date) with a HAVING filter.',
    solution: 'SELECT user_id, COUNT(DISTINCT event_date) AS active_days FROM events GROUP BY user_id HAVING COUNT(DISTINCT event_date) >= 3 ORDER BY active_days DESC, user_id;',
    explain: 'Distinct-day counting is the basis of stickiness metrics like DAU/MAU. Multiple events on one day must count once.'
  },
  {
    id: 57, title: 'Daily active users', difficulty: 'Medium', topic: 'Product Analytics',
    prompt: 'Return `event_date` and the number of distinct users active that day as `dau`, sorted by event_date ascending.',
    tables: ['events'], orderMatters: true,
    hint: 'COUNT(DISTINCT user_id) grouped by date.',
    solution: 'SELECT event_date, COUNT(DISTINCT user_id) AS dau FROM events GROUP BY event_date ORDER BY event_date ASC;',
    explain: 'DAU is the single most reported product metric. The DISTINCT is what separates DAU from raw event volume.'
  },
  {
    id: 58, title: 'Referral chain', difficulty: 'Hard', topic: 'Self Join',
    prompt: 'Return `username` as `user`, and the username of the person who referred them as `referred_by`, for users who WERE referred by someone.',
    tables: ['users'], orderMatters: false,
    hint: 'Self join users on referrer_id = user_id (inner join drops the non-referred users).',
    solution: 'SELECT u.username AS user, r.username AS referred_by FROM users u JOIN users r ON u.referrer_id = r.user_id;',
    explain: 'Same self-join shape as employee/manager. Recognising the pattern across domains is what interviews test.'
  },
  {
    id: 59, title: 'Users by plan with revenue proxy', difficulty: 'Medium', topic: 'GROUP BY',
    prompt: 'Return `plan`, the number of users as `user_count`, and the number of distinct countries they come from as `country_count`. Sort by user_count descending.',
    tables: ['users'], orderMatters: true,
    hint: 'Two aggregates over the same group — one plain COUNT, one COUNT(DISTINCT ...).',
    solution: 'SELECT plan, COUNT(*) AS user_count, COUNT(DISTINCT country) AS country_count FROM users GROUP BY plan ORDER BY user_count DESC;',
    explain: 'Mixing COUNT(*) and COUNT(DISTINCT col) in one GROUP BY is extremely common in cohort and segmentation reporting.'
  },
  {
    id: 60, title: 'Salary progression per employee', difficulty: 'Hard', topic: 'Window Functions',
    prompt: 'Return `emp_id`, `effective_date`, `salary` and `previous_salary` (the salary from the prior record for that employee, NULL for their first). Sort by emp_id then effective_date.',
    tables: ['salaries_history'], orderMatters: true,
    hint: 'LAG(salary) OVER (PARTITION BY emp_id ORDER BY effective_date).',
    solution: 'SELECT emp_id, effective_date, salary, LAG(salary) OVER (PARTITION BY emp_id ORDER BY effective_date) AS previous_salary FROM salaries_history ORDER BY emp_id, effective_date;',
    explain: 'PARTITION BY + LAG on a slowly-changing-dimension table is how you compute raises, churn, or any period-over-period delta.'
  }
  ,
  /* ================================================================
     ADVANCED SET (61-85) — one distinct pattern per question.
     Written for senior analyst / consulting screens: gaps and islands,
     streaks, window frames, cohorts, relational division, recursion.
     ================================================================ */
  {
    id: 61, title: 'Blocks of three or more free seats', difficulty: 'Hard', topic: 'Gaps & Islands',
    prompt: 'A booking screen must offer seats that sit together. Return `hall` and `seat_no` for every free seat that belongs to a run of **at least 3 consecutive free seats** in the same hall. A seat that is free but isolated, or part of a run of only two, must not appear. Sort by hall then seat_no.',
    tables: ['seats'], orderMatters: true,
    hint: 'Subtract ROW_NUMBER() from seat_no over the free seats only. Rows in one unbroken run share the same difference, so that difference becomes a group key you can COUNT over.',
    solution: `WITH runs AS (
  SELECT hall, seat_no,
         seat_no - ROW_NUMBER() OVER (PARTITION BY hall ORDER BY seat_no) AS grp
  FROM seats
  WHERE is_free = 1
)
SELECT hall, seat_no
FROM runs
WHERE (hall, grp) IN (
  SELECT hall, grp FROM runs GROUP BY hall, grp HAVING COUNT(*) >= 3
)
ORDER BY hall, seat_no;`,
    explain: 'The canonical gaps-and-islands trick. In an unbroken run, seat_no and ROW_NUMBER both increase by exactly 1, so their difference is constant; the moment a taken seat breaks the run, the difference jumps. Filtering to free seats BEFORE numbering is what makes the run detection work.'
  },
  {
    id: 62, title: 'Longest daily login streak per user', difficulty: 'Hard', topic: 'Streaks',
    prompt: 'Return `user_id` and `longest_streak` — the highest number of **consecutive calendar days** on which the user logged in. A user who logs in twice on one day still counts that as a single day. Sort by user_id.',
    tables: ['logins'], orderMatters: true,
    hint: 'Reduce to distinct login dates first, then shift each date back by its row number. Dates in one streak all land on the same anchor date.',
    solution: `WITH days AS (
  SELECT DISTINCT user_id, DATE(login_ts) AS d FROM logins
),
anchored AS (
  SELECT user_id, d,
         DATE(d, '-' || ROW_NUMBER() OVER (PARTITION BY user_id ORDER BY d) || ' day') AS anchor
  FROM days
),
runs AS (
  SELECT user_id, anchor, COUNT(*) AS streak
  FROM anchored GROUP BY user_id, anchor
)
SELECT user_id, MAX(streak) AS longest_streak
FROM runs GROUP BY user_id ORDER BY user_id;`,
    explain: 'The date version of gaps and islands. You cannot subtract a row number from a date directly, so you shift the date backwards by N days instead — consecutive dates collapse onto one anchor. The DISTINCT step is essential: without it, two logins on the same day would break the arithmetic.'
  },
  {
    id: 63, title: 'Cities rising three days straight', difficulty: 'Hard', topic: 'Consecutive Trends',
    prompt: 'Return the `city` of every city whose `active_users` rose compared with the previous day on **at least 3 consecutive days**. List each city once, sorted alphabetically.',
    tables: ['daily_metrics'], orderMatters: true,
    hint: 'Flag each day as a rise or not with LAG, then find runs of consecutive rise-days using the two-row-number difference.',
    solution: `WITH flagged AS (
  SELECT city, metric_date,
         CASE WHEN active_users > LAG(active_users) OVER (PARTITION BY city ORDER BY metric_date)
              THEN 1 ELSE 0 END AS rose
  FROM daily_metrics
),
grouped AS (
  SELECT city, metric_date, rose,
         ROW_NUMBER() OVER (PARTITION BY city ORDER BY metric_date)
       - ROW_NUMBER() OVER (PARTITION BY city, rose ORDER BY metric_date) AS grp
  FROM flagged
)
SELECT DISTINCT city
FROM grouped
WHERE rose = 1
GROUP BY city, grp
HAVING COUNT(*) >= 3
ORDER BY city;`,
    explain: 'Two window functions do the work: LAG turns a raw series into a rise/fall flag, then the difference of two ROW_NUMBERs groups consecutive identical flags. This "increasing for N periods" shape appears constantly in growth and quality-monitoring interviews.'
  },
  {
    id: 64, title: 'Collapse a status log into date ranges', difficulty: 'Hard', topic: 'Range Compaction',
    prompt: 'The log stores one row per status check. Collapse consecutive rows that share the same status into a single period. Return `account_id`, `status`, `from_date` and `to_date`. A status that appears again after a different status in between must produce a **separate** period. Sort by account_id then from_date.',
    tables: ['subscription_log'], orderMatters: true,
    hint: 'Difference of two row numbers again — one ordered within the account, one ordered within account and status. Then MIN and MAX the dates per group.',
    solution: `WITH grouped AS (
  SELECT account_id, status, status_date,
         ROW_NUMBER() OVER (PARTITION BY account_id ORDER BY status_date)
       - ROW_NUMBER() OVER (PARTITION BY account_id, status ORDER BY status_date) AS grp
  FROM subscription_log
)
SELECT account_id, status,
       MIN(status_date) AS from_date,
       MAX(status_date) AS to_date
FROM grouped
GROUP BY account_id, status, grp
ORDER BY account_id, from_date;`,
    explain: 'Range compaction, the inverse of a calendar explode. Grouping by status alone would wrongly merge two separate active spells into one row; adding the row-number difference keeps them apart. This is how slowly-changing-dimension history gets rebuilt into validity intervals.'
  },
  {
    id: 65, title: 'Third highest distinct salary, safely', difficulty: 'Hard', topic: 'Ranking',
    prompt: 'Return a single column `third_highest` holding the 3rd highest **distinct** salary. Two people on the same salary share a position, so the answer must be based on distinct values. If fewer than three distinct salaries existed, the query must still return one row containing NULL rather than no rows at all.',
    tables: ['employees'], orderMatters: false,
    hint: 'Put the LIMIT/OFFSET lookup inside a scalar subquery in the SELECT list — a scalar subquery that matches nothing evaluates to NULL, which is exactly the required behaviour.',
    solution: `SELECT (
  SELECT DISTINCT salary
  FROM employees
  ORDER BY salary DESC
  LIMIT 1 OFFSET 2
) AS third_highest;`,
    explain: 'The detail that separates candidates: a bare SELECT ... LIMIT 1 OFFSET 2 returns zero rows when the table is too small, but the interviewer usually wants one row containing NULL. Wrapping it as a scalar subquery guarantees exactly one row. DENSE_RANK() = 3 is the other accepted answer.'
  },
  {
    id: 66, title: 'Median salary per department', difficulty: 'Hard', topic: 'Median',
    prompt: 'Return `dept_id` and `median_salary` for every department that has employees. With an even number of employees the median is the average of the two middle salaries. Round to 2 decimals. Ignore employees with no department. Sort by dept_id.',
    tables: ['employees'], orderMatters: true,
    hint: 'Number the rows ascending and also take the department count. The middle positions are (count+1)/2 and (count+2)/2 using integer division — for odd counts both point at the same row.',
    solution: `WITH ranked AS (
  SELECT dept_id, salary,
         ROW_NUMBER() OVER (PARTITION BY dept_id ORDER BY salary) AS pos,
         COUNT(*)     OVER (PARTITION BY dept_id)                 AS n
  FROM employees
  WHERE dept_id IS NOT NULL
)
SELECT dept_id, ROUND(AVG(salary), 2) AS median_salary
FROM ranked
WHERE pos IN ((n + 1) / 2, (n + 2) / 2)
GROUP BY dept_id
ORDER BY dept_id;`,
    explain: 'SQLite has no PERCENTILE_CONT, so you build the median by hand — and the same technique is expected even in engines that do have it. The (n+1)/2 and (n+2)/2 pair is the elegant bit: integer division makes both expressions collapse to the same row when n is odd, and to the two middle rows when n is even.'
  },
  {
    id: 67, title: 'Top revenue quartile of customers', difficulty: 'Hard', topic: 'NTILE Buckets',
    prompt: 'Rank customers by lifetime revenue from non-cancelled orders, where a line item is worth `quantity * unit_price * (1 - discount)`. Split them into four equal buckets by revenue and return only the top bucket: `customer_name` and `revenue` rounded to 2 decimals, highest first.',
    tables: ['customers', 'orders', 'order_items'], orderMatters: true,
    hint: 'NTILE(4) OVER (ORDER BY revenue DESC) labels the buckets; bucket 1 is the top quartile. You must compute the revenue in an inner query before you can bucket it.',
    solution: `WITH revenue AS (
  SELECT c.customer_id, c.customer_name,
         SUM(oi.quantity * oi.unit_price * (1 - oi.discount)) AS revenue
  FROM customers c
  JOIN orders o      ON o.customer_id = c.customer_id
  JOIN order_items oi ON oi.order_id = o.order_id
  WHERE o.status <> 'Cancelled'
  GROUP BY c.customer_id, c.customer_name
),
bucketed AS (
  SELECT customer_name, revenue, NTILE(4) OVER (ORDER BY revenue DESC) AS quartile
  FROM revenue
)
SELECT customer_name, ROUND(revenue, 2) AS revenue
FROM bucketed
WHERE quartile = 1
ORDER BY revenue DESC;`,
    explain: 'NTILE spreads rows as evenly as it can across N buckets, putting any remainder in the earlier buckets. Note you cannot reference a window function in WHERE — it is evaluated after WHERE — so the NTILE must live in a CTE or subquery first. That ordering rule is a favourite interview trap.'
  },
  {
    id: 68, title: 'Paid more than every other department average', difficulty: 'Hard', topic: 'Subqueries',
    prompt: 'Return `emp_id`, `first_name` and `salary` for employees whose salary is higher than the average salary of **every** department other than their own. Ignore employees with no department. Sort by salary descending.',
    tables: ['employees'], orderMatters: true,
    hint: 'Beating every other average is the same as beating the largest of them. Compute each department average, then compare against the MAX of the averages excluding the employee own department.',
    solution: `WITH dept_avg AS (
  SELECT dept_id, AVG(salary) AS avg_salary
  FROM employees
  WHERE dept_id IS NOT NULL
  GROUP BY dept_id
)
SELECT e.emp_id, e.first_name, e.salary
FROM employees e
WHERE e.dept_id IS NOT NULL
  AND e.salary > (
    SELECT MAX(avg_salary) FROM dept_avg d WHERE d.dept_id <> e.dept_id
  )
ORDER BY e.salary DESC;`,
    explain: 'A correlated subquery whose correlation is an inequality — the inner query changes for each employee because it must exclude that employee own department. Rewriting "greater than all of them" as "greater than the maximum" is the optimisation interviewers look for; the ALL keyword expresses the same idea where supported.'
  },
  {
    id: 69, title: 'Seven-day rolling total', difficulty: 'Hard', topic: 'Rolling Windows',
    prompt: 'Return `city`, `metric_date`, `active_users` and `rolling_7d` — the sum of active_users over the current day and the six days before it, restarting for each city. Early days simply sum whatever history exists. Sort by city then metric_date.',
    tables: ['daily_metrics'], orderMatters: true,
    hint: 'An explicit frame is required: ROWS BETWEEN 6 PRECEDING AND CURRENT ROW. Without it the default frame runs from the start of the partition, giving a cumulative total instead.',
    solution: `SELECT city, metric_date, active_users,
       SUM(active_users) OVER (
         PARTITION BY city
         ORDER BY metric_date
         ROWS BETWEEN 6 PRECEDING AND CURRENT ROW
       ) AS rolling_7d
FROM daily_metrics
ORDER BY city, metric_date;`,
    explain: 'The whole question is the frame clause. Leaving it out gives RANGE BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW — a running total, not a rolling window. Also note ROWS counts rows while RANGE counts value ties, which matters the moment your dates are not perfectly dense.'
  },
  {
    id: 70, title: 'Days that spiked above the recent baseline', difficulty: 'Hard', topic: 'Baseline Anomaly',
    prompt: 'Flag anomalies: return `city`, `metric_date` and `active_users` for days where active_users exceeded the average of the **three days immediately before** by more than 10 percent. Days without three prior days of history are excluded. Sort by city then metric_date.',
    tables: ['daily_metrics'], orderMatters: true,
    hint: 'The baseline must exclude the current row, so the frame ends at 1 PRECEDING rather than CURRENT ROW. Filter the window result in an outer query.',
    solution: `WITH baseline AS (
  SELECT city, metric_date, active_users,
         AVG(active_users) OVER (
           PARTITION BY city
           ORDER BY metric_date
           ROWS BETWEEN 3 PRECEDING AND 1 PRECEDING
         ) AS prev_3_avg
  FROM daily_metrics
)
SELECT city, metric_date, active_users
FROM baseline
WHERE prev_3_avg IS NOT NULL
  AND active_users > prev_3_avg * 1.10
ORDER BY city, metric_date;`,
    explain: 'A frame that ends at 1 PRECEDING excludes the current row, which is what makes this a genuine baseline rather than a self-fulfilling average. The NULL check handles the opening rows where the window has nothing to average — a detail that silently corrupts results when forgotten.'
  },
  {
    id: 71, title: 'Full rep-by-region grid, including the gaps', difficulty: 'Hard', topic: 'CROSS JOIN',
    prompt: 'Build a complete grid of every sales rep against every region that appears in the orders table, so that combinations with no activity still show up as zero. Return `emp_id`, `region` and `orders_placed`. Sort by emp_id then region.',
    tables: ['orders'], orderMatters: true,
    hint: 'CROSS JOIN the distinct reps with the distinct regions to manufacture every combination, then LEFT JOIN the real orders onto that grid. Count the order key, never COUNT(*), or the empty cells become 1.',
    solution: `WITH reps AS (
  SELECT DISTINCT emp_id FROM orders WHERE emp_id IS NOT NULL
),
regions AS (
  SELECT DISTINCT region FROM orders
)
SELECT r.emp_id, g.region, COUNT(o.order_id) AS orders_placed
FROM reps r
CROSS JOIN regions g
LEFT JOIN orders o
       ON o.emp_id = r.emp_id
      AND o.region = g.region
GROUP BY r.emp_id, g.region
ORDER BY r.emp_id, g.region;`,
    explain: 'The classic reporting-grid pattern. A plain GROUP BY only ever returns combinations that exist, so the zeros vanish — and a dashboard with missing cells is a bug. CROSS JOIN manufactures the full grid first. The COUNT(o.order_id) versus COUNT(*) distinction is the trap: COUNT(*) counts the LEFT JOIN placeholder row and reports 1 for empty cells.'
  },
  {
    id: 72, title: 'Three-day retention by joining cohort', difficulty: 'Hard', topic: 'Cohort Analysis',
    prompt: 'Group users by the date of their **first ever login** — that is their cohort. For each cohort return `cohort_date`, `cohort_size`, and `returned_within_3d`: how many of those users logged in again between 1 and 3 days after joining. Sort by cohort_date.',
    tables: ['logins'], orderMatters: true,
    hint: 'Find each user first login date, join every login back to it, and use a MAX(CASE ...) per user so one qualifying return is enough to mark that user retained.',
    solution: `WITH first_login AS (
  SELECT user_id, MIN(DATE(login_ts)) AS cohort_date
  FROM logins GROUP BY user_id
),
per_user AS (
  SELECT f.cohort_date, f.user_id,
         MAX(CASE
               WHEN JULIANDAY(DATE(l.login_ts)) - JULIANDAY(f.cohort_date) BETWEEN 1 AND 3
               THEN 1 ELSE 0
             END) AS returned
  FROM first_login f
  JOIN logins l ON l.user_id = f.user_id
  GROUP BY f.cohort_date, f.user_id
)
SELECT cohort_date,
       COUNT(*)       AS cohort_size,
       SUM(returned)  AS returned_within_3d
FROM per_user
GROUP BY cohort_date
ORDER BY cohort_date;`,
    explain: 'Retention is always a two-stage aggregation: collapse to one row per user first, then count users per cohort. Aggregating in a single pass double-counts anyone who returned on several days. MAX(CASE ...) is the standard way to express "did this ever happen" as a 0/1 flag.'
  },
  {
    id: 73, title: 'Users who went quiet', difficulty: 'Hard', topic: 'Anti-Join',
    prompt: 'Return the `user_id` of every user who logged in during 2023-06-01 to 2023-06-07 but did **not** log in at all during 2023-06-08 to 2023-06-14. Sort by user_id.',
    tables: ['logins'], orderMatters: true,
    hint: 'Two windows over the same table. Take the distinct users of the first window and exclude any that appear in the second, using NOT EXISTS or NOT IN.',
    solution: `SELECT DISTINCT l.user_id
FROM logins l
WHERE DATE(l.login_ts) BETWEEN '2023-06-01' AND '2023-06-07'
  AND NOT EXISTS (
    SELECT 1 FROM logins l2
    WHERE l2.user_id = l.user_id
      AND DATE(l2.login_ts) BETWEEN '2023-06-08' AND '2023-06-14'
  )
ORDER BY l.user_id;`,
    explain: 'Churn is an anti-join. NOT EXISTS is the safe formulation here: NOT IN silently returns nothing at all if the inner query ever produces a NULL, which is one of the most common ways a churn report quietly breaks in production.'
  },
  {
    id: 74, title: 'Products bought together', difficulty: 'Hard', topic: 'Basket Analysis',
    prompt: 'Find pairs of products that appear in the same order. Return `product_a`, `product_b` and `times_together`. Each unordered pair must appear once only — not twice in mirrored form. Sort by times_together descending, then product_a, then product_b.',
    tables: ['order_items', 'products'], orderMatters: true,
    hint: 'Self-join order_items on order_id, and require the left product_id to be strictly less than the right one. That single inequality removes both the self-pairs and the mirror duplicates.',
    solution: `SELECT p1.product_name AS product_a,
       p2.product_name AS product_b,
       COUNT(*)        AS times_together
FROM order_items i1
JOIN order_items i2
  ON i1.order_id = i2.order_id
 AND i1.product_id < i2.product_id
JOIN products p1 ON p1.product_id = i1.product_id
JOIN products p2 ON p2.product_id = i2.product_id
GROUP BY p1.product_name, p2.product_name
ORDER BY times_together DESC, product_a, product_b;`,
    explain: 'Market-basket analysis in one join. Using < rather than <> is the key: <> would give you both (A,B) and (B,A) and double every count, while = would pair each product with itself. This same inequality trick powers "customers who bought X also bought Y" recommendations.'
  },
  {
    id: 75, title: 'Conversations that went both ways', difficulty: 'Hard', topic: 'Graph Pairs',
    prompt: 'Return pairs of people who have each sent the other at least one message. Give `person_low`, `person_high` (the smaller and larger id) and `total_messages` exchanged in both directions. One row per pair. Sort by person_low then person_high.',
    tables: ['messages'], orderMatters: true,
    hint: 'Normalise every message onto an unordered pair key with MIN(sender,receiver) and MAX(sender,receiver), then keep only groups where both people appear as a sender.',
    solution: `SELECT MIN(sender_id, receiver_id) AS person_low,
       MAX(sender_id, receiver_id) AS person_high,
       COUNT(*)                    AS total_messages
FROM messages
GROUP BY MIN(sender_id, receiver_id), MAX(sender_id, receiver_id)
HAVING COUNT(DISTINCT sender_id) = 2
ORDER BY person_low, person_high;`,
    explain: 'Turning a directed edge into an undirected one is the whole trick: the two-argument MIN and MAX build a canonical pair key so A-to-B and B-to-A collapse into a single group. COUNT(DISTINCT sender_id) = 2 then proves the conversation was mutual rather than one person talking into the void.'
  },
  {
    id: 76, title: 'Identical marks in two subjects', difficulty: 'Hard', topic: 'Self Join',
    prompt: 'Return `student_id`, `student_name` and `marks` for every student who scored exactly the same mark in two **different** subjects. If a student has three subjects all on the same mark, report that mark once. Sort by student_id then marks.',
    tables: ['exam_scores'], orderMatters: true,
    hint: 'Join the table to itself on the same student and the same marks, but require the left subject to sort before the right one so each pair is considered once.',
    solution: `SELECT DISTINCT a.student_id, a.student_name, a.marks
FROM exam_scores a
JOIN exam_scores b
  ON a.student_id = b.student_id
 AND a.marks      = b.marks
 AND a.subject    < b.subject
ORDER BY a.student_id, a.marks;`,
    explain: 'Self-join on the matching dimension while forcing the differing one apart. Dropping the subject inequality would match every row against itself and return the entire table. DISTINCT then handles the student who tied across three subjects, where the join legitimately produces several pairs at the same mark.'
  },
  {
    id: 77, title: 'Students sitting every subject', difficulty: 'Hard', topic: 'Relational Division',
    prompt: 'Return `student_id` and `student_name` for students who have a score recorded in **every** subject that exists in the table. Sort by student_id.',
    tables: ['exam_scores'], orderMatters: true,
    hint: 'Count the distinct subjects each student has and compare against the total number of distinct subjects overall.',
    solution: `SELECT student_id, student_name
FROM exam_scores
GROUP BY student_id, student_name
HAVING COUNT(DISTINCT subject) = (SELECT COUNT(DISTINCT subject) FROM exam_scores)
ORDER BY student_id;`,
    explain: 'Relational division — "find rows related to all of the others". Counting distinct matches against the total is the readable formulation; the textbook alternative is a double NOT EXISTS meaning "no subject exists that this student has not sat". DISTINCT matters because a duplicate row would otherwise inflate the count past the threshold.'
  },
  {
    id: 78, title: 'Web-only, mobile-only or both', difficulty: 'Hard', topic: 'Conditional Aggregation',
    prompt: 'Classify each user by the platforms they have logged in from. Return `user_id` and `usage` where usage is `both` when they used web and mobile, `web only` when every login was web, and `mobile only` otherwise. Sort by user_id.',
    tables: ['logins'], orderMatters: true,
    hint: 'Aggregate per user: COUNT(DISTINCT platform) tells you whether they used both, and MIN(platform) identifies which single platform it was when they did not.',
    solution: `SELECT user_id,
       CASE
         WHEN COUNT(DISTINCT platform) = 2 THEN 'both'
         WHEN MIN(platform) = 'web'        THEN 'web only'
         ELSE 'mobile only'
       END AS usage
FROM logins
GROUP BY user_id
ORDER BY user_id;`,
    explain: 'Set membership expressed as conditional aggregation. Because the CASE sits outside the aggregates it is evaluated once per group, not per row — the ordering that trips people up. MIN over a single distinct value is a neat way to read that value back out without a second join.'
  },
  {
    id: 79, title: 'Favourite category per customer', difficulty: 'Hard', topic: 'Arg-Max',
    prompt: 'For each customer return the product `category` they have ordered most often, with `customer_id` and `line_items`. When two categories tie, pick the one that comes first alphabetically. Sort by customer_id.',
    tables: ['orders', 'order_items', 'products'], orderMatters: true,
    hint: 'Count line items per customer and category, then ROW_NUMBER() partitioned by customer ordered by the count descending with the category name as the tie-breaker. Keep row 1.',
    solution: `WITH counted AS (
  SELECT o.customer_id, p.category, COUNT(*) AS line_items
  FROM orders o
  JOIN order_items oi ON oi.order_id = o.order_id
  JOIN products p     ON p.product_id = oi.product_id
  GROUP BY o.customer_id, p.category
),
ranked AS (
  SELECT customer_id, category, line_items,
         ROW_NUMBER() OVER (
           PARTITION BY customer_id
           ORDER BY line_items DESC, category
         ) AS rn
  FROM counted
)
SELECT customer_id, category, line_items
FROM ranked
WHERE rn = 1
ORDER BY customer_id;`,
    explain: 'The arg-max pattern: you want the row that carries the maximum, not the maximum itself, so MAX() alone cannot answer it. ROW_NUMBER with an explicit tie-breaker guarantees exactly one row per customer — RANK would return several when counts tie, which is a genuinely different answer. Several customers here really are tied, so the tie-break rule is doing real work.'
  },
  {
    id: 80, title: 'Second most recent login', difficulty: 'Hard', topic: 'Nth Value',
    prompt: 'Return `user_id` and `second_latest_login` for every user in the logins table. A user with only one login must still appear, with NULL in that column. Sort by user_id.',
    tables: ['logins'], orderMatters: true,
    hint: 'Number each user logins newest first, then aggregate per user picking out the row numbered 2 — an aggregate over an empty match yields NULL, which is what single-login users need.',
    solution: `WITH ranked AS (
  SELECT user_id, login_ts,
         ROW_NUMBER() OVER (PARTITION BY user_id ORDER BY login_ts DESC) AS rn
  FROM logins
)
SELECT user_id,
       MAX(CASE WHEN rn = 2 THEN login_ts END) AS second_latest_login
FROM ranked
GROUP BY user_id
ORDER BY user_id;`,
    explain: 'Filtering WHERE rn = 2 would silently drop users who have only ever logged in once — the exact edge case interviewers plant. Aggregating a conditional CASE keeps every user and produces NULL where no second row exists. NTH_VALUE with the right frame is the other correct route.'
  },
  {
    id: 81, title: 'Gap between first and second order', difficulty: 'Hard', topic: 'Time Between Events',
    prompt: 'For customers who placed at least two non-cancelled orders, return `customer_name`, `first_order`, `second_order` and `days_between`. Sort by days_between ascending then customer_name.',
    tables: ['orders', 'customers'], orderMatters: true,
    hint: 'Number each customer orders by date, then join the numbered set to itself matching row 1 against row 2 for the same customer.',
    solution: `WITH ranked AS (
  SELECT customer_id, order_date,
         ROW_NUMBER() OVER (PARTITION BY customer_id ORDER BY order_date) AS rn
  FROM orders
  WHERE status <> 'Cancelled'
)
SELECT c.customer_name,
       f.order_date AS first_order,
       s.order_date AS second_order,
       CAST(JULIANDAY(s.order_date) - JULIANDAY(f.order_date) AS INTEGER) AS days_between
FROM ranked f
JOIN ranked s ON s.customer_id = f.customer_id AND s.rn = 2
JOIN customers c ON c.customer_id = f.customer_id
WHERE f.rn = 1
ORDER BY days_between, c.customer_name;`,
    explain: 'Repeat-purchase latency, a standard retention metric. Numbering then self-joining specific positions is more flexible than LEAD because you can reach any pair of events, and the inner join naturally drops one-time buyers without needing an extra HAVING.'
  },
  {
    id: 82, title: 'Split activity into sessions', difficulty: 'Hard', topic: 'Sessionization',
    prompt: 'A new session starts whenever more than 30 minutes pass since a user previous login, and their very first login always starts one. Return `user_id` and `sessions`, the number of sessions per user. Sort by user_id.',
    tables: ['logins'], orderMatters: true,
    hint: 'LAG gives the previous timestamp. JULIANDAY differences are in days, so multiply by 1440 to get minutes. Flag each row 1 or 0 and sum the flags.',
    solution: `WITH flagged AS (
  SELECT user_id, login_ts,
         CASE
           WHEN LAG(login_ts) OVER (PARTITION BY user_id ORDER BY login_ts) IS NULL
             THEN 1
           WHEN (JULIANDAY(login_ts)
               - JULIANDAY(LAG(login_ts) OVER (PARTITION BY user_id ORDER BY login_ts))) * 1440 > 30
             THEN 1
           ELSE 0
         END AS starts_session
  FROM logins
)
SELECT user_id, SUM(starts_session) AS sessions
FROM flagged
GROUP BY user_id
ORDER BY user_id;`,
    explain: 'Sessionization is the industrial use of LAG. Summing the start flags counts sessions directly; a running SUM of the same flag would instead label every row with its session number, which is how you would then measure session length. Handling the NULL from the first row explicitly is essential — without it the first login is never counted.'
  },
  {
    id: 83, title: 'Missing invoice numbers', difficulty: 'Hard', topic: 'Gap Detection',
    prompt: 'Auditors need the holes in the invoice sequence. For each branch return `branch`, `missing_from` and `missing_to` describing every range of absent invoice numbers between the numbers that do exist. A single missing number gives a range where from and to are equal. Sort by branch then missing_from.',
    tables: ['invoices'], orderMatters: true,
    hint: 'LEAD gives the next invoice number within the branch. Wherever the next number is more than one away, the gap runs from current + 1 to next - 1.',
    solution: `WITH seq AS (
  SELECT branch, invoice_no,
         LEAD(invoice_no) OVER (PARTITION BY branch ORDER BY invoice_no) AS next_no
  FROM invoices
)
SELECT branch,
       invoice_no + 1 AS missing_from,
       next_no    - 1 AS missing_to
FROM seq
WHERE next_no - invoice_no > 1
ORDER BY branch, missing_from;`,
    explain: 'The gaps half of gaps-and-islands, and a genuine audit task at any consulting firm — missing invoice numbers suggest deleted or unrecorded documents. LEAD compares each row with its successor without a self-join; the final row NULL from LEAD is discarded automatically because the comparison is not true.'
  },
  {
    id: 84, title: 'Depth of the reporting chain', difficulty: 'Hard', topic: 'Recursive CTE',
    prompt: 'Walk the management tree from the top down. Return `emp_id`, `first_name` and `level`, where anyone with no manager is level 1, their direct reports are level 2, and so on. Sort by level then emp_id.',
    tables: ['employees'], orderMatters: true,
    hint: 'WITH RECURSIVE: the anchor selects employees whose manager_id IS NULL at level 1, and the recursive part joins employees to the rows already produced, adding one to the level.',
    solution: `WITH RECURSIVE chain AS (
  SELECT emp_id, first_name, manager_id, 1 AS level
  FROM employees
  WHERE manager_id IS NULL
  UNION ALL
  SELECT e.emp_id, e.first_name, e.manager_id, c.level + 1
  FROM employees e
  JOIN chain c ON e.manager_id = c.emp_id
)
SELECT emp_id, first_name, level
FROM chain
ORDER BY level, emp_id;`,
    explain: 'A hierarchy of unknown depth cannot be flattened with a fixed number of self-joins, which is exactly why recursive CTEs exist. UNION ALL rather than UNION matters both for speed and because deduplicating could hide legitimate repeats. In a real system you would also carry a visited-path guard, since a cycle in manager_id would otherwise loop forever.'
  },
  {
    id: 85, title: 'New versus returning orders each month', difficulty: 'Hard', topic: 'Cross-Grain Aggregation',
    prompt: 'Split every month of non-cancelled orders into acquisition and repeat business. Return `month` as YYYY-MM, `new_customers` (orders that were that customer very first) and `repeat_orders` (all the rest). Sort by month.',
    tables: ['orders'], orderMatters: true,
    hint: 'Number each customer orders by date first. Row 1 is that customer first ever order; every later row is repeat business. Then aggregate the flags by month.',
    solution: `WITH ranked AS (
  SELECT customer_id, order_date,
         ROW_NUMBER() OVER (PARTITION BY customer_id ORDER BY order_date) AS rn
  FROM orders
  WHERE status <> 'Cancelled'
)
SELECT STRFTIME('%Y-%m', order_date) AS month,
       SUM(CASE WHEN rn = 1 THEN 1 ELSE 0 END) AS new_customers,
       SUM(CASE WHEN rn > 1 THEN 1 ELSE 0 END) AS repeat_orders
FROM ranked
GROUP BY STRFTIME('%Y-%m', order_date)
ORDER BY month;`,
    explain: 'Classifying a row by its position within a different grouping than the one you finally report on. The window is per customer, the aggregation is per month — mixing those two grains in one query is the skill being tested, and it is the basis of every acquisition-versus-retention revenue split.'
  }

];

export const TOPICS = [...new Set(QUESTIONS.map(q => q.topic))];
export const DIFFICULTIES = ['Easy', 'Medium', 'Hard'];

// Genuinely different ways to solve the same question. Grading is result-based, so these
// are all accepted automatically — they are listed so learners can see the alternatives,
// and the built-in self-test asserts that every one of them grades as Correct.
export const ALT_SOLUTIONS = {
  4: [
    { label: 'OR instead of IN', sql: "SELECT emp_id, first_name, city FROM employees WHERE city = 'Bangalore' OR city = 'Pune';" }
  ],
  5: [
    { label: 'Explicit >= and <=', sql: 'SELECT first_name, last_name, salary FROM employees WHERE salary >= 80000 AND salary <= 120000;' }
  ],
  6: [
    { label: 'INSTR instead of LIKE', sql: "SELECT emp_id, first_name, job_title FROM employees WHERE INSTR(job_title, 'Engineer') > 0;" }
  ],
  10: [
    { label: 'IFNULL instead of COALESCE', sql: 'SELECT first_name, salary, salary + salary * IFNULL(bonus_pct, 0) AS total_comp FROM employees;' },
    { label: 'CASE instead of COALESCE', sql: 'SELECT first_name, salary, CASE WHEN bonus_pct IS NULL THEN salary ELSE salary + salary * bonus_pct END AS total_comp FROM employees;' }
  ],
  13: [
    { label: 'COUNT(column) with join-free filter', sql: 'SELECT dept_id, COUNT(emp_id) AS headcount FROM employees GROUP BY dept_id HAVING dept_id IS NOT NULL;' }
  ],
  19: [
    { label: 'Old-style comma join', sql: 'SELECT e.first_name, e.last_name, d.dept_name FROM employees e, departments d WHERE e.dept_id = d.dept_id;' },
    { label: 'Correlated scalar subquery', sql: 'SELECT e.first_name, e.last_name, (SELECT d.dept_name FROM departments d WHERE d.dept_id = e.dept_id) AS dept_name FROM employees e WHERE e.dept_id IS NOT NULL;' }
  ],
  21: [
    { label: 'NOT EXISTS', sql: 'SELECT d.dept_id, d.dept_name FROM departments d WHERE NOT EXISTS (SELECT 1 FROM employees e WHERE e.dept_id = d.dept_id);' },
    { label: 'NOT IN (NULL-safe here)', sql: 'SELECT dept_id, dept_name FROM departments WHERE dept_id NOT IN (SELECT dept_id FROM employees WHERE dept_id IS NOT NULL);' }
  ],
  26: [
    { label: 'NOT EXISTS', sql: 'SELECT c.customer_id, c.customer_name FROM customers c WHERE NOT EXISTS (SELECT 1 FROM orders o WHERE o.customer_id = c.customer_id);' },
    { label: 'NOT IN', sql: 'SELECT customer_id, customer_name FROM customers WHERE customer_id NOT IN (SELECT customer_id FROM orders WHERE customer_id IS NOT NULL);' }
  ],
  31: [
    { label: 'CROSS JOIN to the average', sql: 'SELECT e.first_name, e.last_name, e.salary FROM employees e CROSS JOIN (SELECT AVG(salary) AS a FROM employees) x WHERE e.salary > x.a ORDER BY e.salary DESC;' },
    { label: 'CTE', sql: 'WITH avg_sal AS (SELECT AVG(salary) AS a FROM employees) SELECT first_name, last_name, salary FROM employees, avg_sal WHERE salary > a ORDER BY salary DESC;' }
  ],
  32: [
    { label: 'LIMIT/OFFSET', sql: 'SELECT DISTINCT salary AS second_highest_salary FROM employees ORDER BY salary DESC LIMIT 1 OFFSET 1;' },
    { label: 'DENSE_RANK window function', sql: 'SELECT salary AS second_highest_salary FROM (SELECT salary, DENSE_RANK() OVER (ORDER BY salary DESC) AS dr FROM employees) t WHERE dr = 2 LIMIT 1;' }
  ],
  33: [
    { label: 'DENSE_RANK window function', sql: 'SELECT salary AS third_highest_salary FROM (SELECT salary, DENSE_RANK() OVER (ORDER BY salary DESC) AS dr FROM employees) t WHERE dr = 3 LIMIT 1;' }
  ],
  34: [
    { label: 'Window function (faster)', sql: 'SELECT first_name, dept_id, salary FROM (SELECT first_name, dept_id, salary, AVG(salary) OVER (PARTITION BY dept_id) AS dept_avg FROM employees) t WHERE salary > dept_avg;' },
    { label: 'Join to a grouped derived table', sql: 'SELECT e.first_name, e.dept_id, e.salary FROM employees e JOIN (SELECT dept_id, AVG(salary) AS a FROM employees GROUP BY dept_id) g ON e.dept_id = g.dept_id WHERE e.salary > g.a;' }
  ],
  36: [
    { label: 'LEFT JOIN anti-join', sql: 'SELECT p.product_id, p.product_name FROM products p LEFT JOIN order_items oi ON p.product_id = oi.product_id WHERE oi.item_id IS NULL;' },
    { label: 'NOT IN', sql: 'SELECT product_id, product_name FROM products WHERE product_id NOT IN (SELECT product_id FROM order_items);' }
  ],
  38: [
    { label: 'COUNT with CASE (no ELSE)', sql: "SELECT region, COUNT(CASE WHEN status = 'Delivered' THEN 1 END) AS delivered_orders, COUNT(CASE WHEN status = 'Pending' THEN 1 END) AS pending_orders, COUNT(CASE WHEN status = 'Cancelled' THEN 1 END) AS cancelled_orders FROM orders GROUP BY region;" },
    { label: 'SUM with boolean expression', sql: "SELECT region, SUM(status = 'Delivered') AS delivered_orders, SUM(status = 'Pending') AS pending_orders, SUM(status = 'Cancelled') AS cancelled_orders FROM orders GROUP BY region;" }
  ],
  39: [
    { label: 'COUNT with CASE', sql: 'SELECT dept_id, COUNT(CASE WHEN is_active = 1 THEN 1 END) AS active_count, COUNT(CASE WHEN is_active = 0 THEN 1 END) AS inactive_count FROM employees GROUP BY dept_id;' }
  ],
  41: [
    { label: 'SUBSTR instead of STRFTIME', sql: 'SELECT SUBSTR(hire_date, 1, 4) AS hire_year, COUNT(*) AS hires FROM employees GROUP BY hire_year ORDER BY hire_year ASC;' }
  ],
  42: [
    { label: 'SUBSTR month key', sql: "SELECT SUBSTR(o.order_date, 1, 7) AS order_month, SUM(oi.quantity * oi.unit_price * (1 - oi.discount)) AS revenue FROM orders o JOIN order_items oi ON o.order_id = oi.order_id WHERE o.status <> 'Cancelled' GROUP BY order_month ORDER BY order_month ASC;" }
  ],
  45: [
    { label: 'Correlated subquery (no window function)', sql: 'SELECT e.first_name, e.salary, (SELECT COUNT(*) FROM employees e2 WHERE e2.salary > e.salary) + 1 AS salary_rank FROM employees e ORDER BY salary_rank ASC;' }
  ],
  47: [
    { label: 'CTE instead of derived table', sql: 'WITH ranked AS (SELECT dept_id, first_name, salary, ROW_NUMBER() OVER (PARTITION BY dept_id ORDER BY salary DESC) AS rn FROM employees) SELECT dept_id, first_name, salary FROM ranked WHERE rn < 3 ORDER BY dept_id, salary DESC;' }
  ],
  50: [
    { label: 'Join to grouped derived table', sql: 'SELECT e.first_name, e.dept_id, e.salary, g.dept_avg_salary FROM employees e LEFT JOIN (SELECT dept_id, AVG(salary) AS dept_avg_salary FROM employees GROUP BY dept_id) g ON e.dept_id IS g.dept_id;' }
  ],
  51: [
    { label: 'Correlated MIN subquery', sql: 'SELECT o.customer_id, o.order_id, o.order_date FROM orders o WHERE o.order_date = (SELECT MIN(o2.order_date) FROM orders o2 WHERE o2.customer_id = o.customer_id) ORDER BY o.customer_id;' },
    { label: 'Join to grouped MIN', sql: 'SELECT o.customer_id, o.order_id, o.order_date FROM orders o JOIN (SELECT customer_id, MIN(order_date) AS first_date FROM orders GROUP BY customer_id) f ON o.customer_id = f.customer_id AND o.order_date = f.first_date ORDER BY o.customer_id;' }
  ],
  53: [
    { label: 'Subquery instead of CTE', sql: 'SELECT order_id, order_revenue FROM (SELECT order_id, SUM(quantity * unit_price * (1 - discount)) AS order_revenue FROM order_items GROUP BY order_id) t WHERE order_revenue > 8000 ORDER BY order_revenue DESC;' },
    { label: 'HAVING without a subquery', sql: 'SELECT order_id, SUM(quantity * unit_price * (1 - discount)) AS order_revenue FROM order_items GROUP BY order_id HAVING SUM(quantity * unit_price * (1 - discount)) > 8000 ORDER BY order_revenue DESC;' }
  ],
  55: [
    { label: 'Self-join duplicate detection', sql: 'SELECT e1.salary, COUNT(*) AS cnt FROM employees e1 WHERE EXISTS (SELECT 1 FROM employees e2 WHERE e2.salary = e1.salary AND e2.emp_id <> e1.emp_id) GROUP BY e1.salary ORDER BY cnt DESC, salary DESC;' }
  ],
  56: [
    { label: 'Filter on a grouped subquery', sql: 'SELECT user_id, active_days FROM (SELECT user_id, COUNT(DISTINCT event_date) AS active_days FROM events GROUP BY user_id) t WHERE active_days >= 3 ORDER BY active_days DESC, user_id;' }
  ],
  58: [
    { label: 'Correlated scalar subquery', sql: 'SELECT u.username AS user, (SELECT r.username FROM users r WHERE r.user_id = u.referrer_id) AS referred_by FROM users u WHERE u.referrer_id IS NOT NULL;' }
  ],
  60: [
    { label: 'Correlated subquery (no LAG)', sql: 'SELECT s.emp_id, s.effective_date, s.salary, (SELECT s2.salary FROM salaries_history s2 WHERE s2.emp_id = s.emp_id AND s2.effective_date < s.effective_date ORDER BY s2.effective_date DESC LIMIT 1) AS previous_salary FROM salaries_history s ORDER BY s.emp_id, s.effective_date;' }
  ]
  ,
  /* ---- advanced set ---- */
  61: [
    { label: 'Window COUNT over the run, no second scan',
      sql: `WITH runs AS (
  SELECT hall, seat_no,
         seat_no - ROW_NUMBER() OVER (PARTITION BY hall ORDER BY seat_no) AS grp
  FROM seats WHERE is_free = 1
)
SELECT hall, seat_no FROM (
  SELECT hall, seat_no, COUNT(*) OVER (PARTITION BY hall, grp) AS run_len FROM runs
) WHERE run_len >= 3 ORDER BY hall, seat_no;` },
    { label: 'Three-way self join on adjacency',
      sql: `SELECT DISTINCT s.hall, s.seat_no
FROM seats s
JOIN seats a ON a.hall = s.hall AND a.is_free = 1
JOIN seats b ON b.hall = s.hall AND b.is_free = 1
WHERE s.is_free = 1
  AND b.seat_no = a.seat_no + 1
  AND s.seat_no BETWEEN a.seat_no - 1 AND a.seat_no + 2
  AND EXISTS (SELECT 1 FROM seats c WHERE c.hall = s.hall AND c.is_free = 1 AND c.seat_no = a.seat_no + 2)
  AND s.seat_no BETWEEN a.seat_no AND a.seat_no + 2
ORDER BY s.hall, s.seat_no;` }
  ],
  65: [
    { label: 'DENSE_RANK instead of OFFSET',
      sql: `SELECT MAX(CASE WHEN dr = 3 THEN salary END) AS third_highest
FROM (SELECT salary, DENSE_RANK() OVER (ORDER BY salary DESC) AS dr FROM employees);` }
  ],
  66: [
    { label: 'Symmetric row numbers (needs a tie-break to stay mirrored)',
      sql: `WITH r AS (
  SELECT dept_id, salary,
         ROW_NUMBER() OVER (PARTITION BY dept_id ORDER BY salary ASC,  emp_id ASC)  AS lo,
         ROW_NUMBER() OVER (PARTITION BY dept_id ORDER BY salary DESC, emp_id DESC) AS hi
  FROM employees WHERE dept_id IS NOT NULL
)
SELECT dept_id, ROUND(AVG(salary), 2) AS median_salary
FROM r WHERE ABS(lo - hi) <= 1
GROUP BY dept_id ORDER BY dept_id;` }
  ],
  68: [
    { label: 'NOT EXISTS: no other department beats them',
      sql: `WITH dept_avg AS (
  SELECT dept_id, AVG(salary) AS avg_salary FROM employees WHERE dept_id IS NOT NULL GROUP BY dept_id
)
SELECT e.emp_id, e.first_name, e.salary
FROM employees e
WHERE e.dept_id IS NOT NULL
  AND NOT EXISTS (
    SELECT 1 FROM dept_avg d WHERE d.dept_id <> e.dept_id AND d.avg_salary >= e.salary
  )
ORDER BY e.salary DESC;` }
  ],
  73: [
    { label: 'LEFT JOIN with a NULL check',
      sql: `SELECT DISTINCT a.user_id
FROM (SELECT DISTINCT user_id FROM logins WHERE DATE(login_ts) BETWEEN '2023-06-01' AND '2023-06-07') a
LEFT JOIN (SELECT DISTINCT user_id FROM logins WHERE DATE(login_ts) BETWEEN '2023-06-08' AND '2023-06-14') b
  ON b.user_id = a.user_id
WHERE b.user_id IS NULL
ORDER BY a.user_id;` },
    { label: 'EXCEPT set operator',
      sql: `SELECT user_id FROM logins WHERE DATE(login_ts) BETWEEN '2023-06-01' AND '2023-06-07'
EXCEPT
SELECT user_id FROM logins WHERE DATE(login_ts) BETWEEN '2023-06-08' AND '2023-06-14'
ORDER BY user_id;` }
  ],
  77: [
    { label: 'Double NOT EXISTS (textbook division)',
      sql: `SELECT DISTINCT e.student_id, e.student_name
FROM exam_scores e
WHERE NOT EXISTS (
  SELECT 1 FROM (SELECT DISTINCT subject FROM exam_scores) s
  WHERE NOT EXISTS (
    SELECT 1 FROM exam_scores x WHERE x.student_id = e.student_id AND x.subject = s.subject
  )
)
ORDER BY e.student_id;` }
  ],
  80: [
    { label: 'NTH_VALUE with a full-partition frame',
      sql: `SELECT DISTINCT user_id,
       NTH_VALUE(login_ts, 2) OVER (
         PARTITION BY user_id ORDER BY login_ts DESC
         ROWS BETWEEN UNBOUNDED PRECEDING AND UNBOUNDED FOLLOWING
       ) AS second_latest_login
FROM logins ORDER BY user_id;` },
    { label: 'Correlated scalar subquery',
      sql: `SELECT DISTINCT l.user_id,
       (SELECT l2.login_ts FROM logins l2 WHERE l2.user_id = l.user_id
        ORDER BY l2.login_ts DESC LIMIT 1 OFFSET 1) AS second_latest_login
FROM logins l ORDER BY l.user_id;` }
  ],
  81: [
    { label: 'LEAD instead of a self join',
      sql: `WITH stepped AS (
  SELECT customer_id, order_date,
         ROW_NUMBER() OVER (PARTITION BY customer_id ORDER BY order_date) AS rn,
         LEAD(order_date) OVER (PARTITION BY customer_id ORDER BY order_date) AS next_date
  FROM orders WHERE status <> 'Cancelled'
)
SELECT c.customer_name, s.order_date AS first_order, s.next_date AS second_order,
       CAST(JULIANDAY(s.next_date) - JULIANDAY(s.order_date) AS INTEGER) AS days_between
FROM stepped s JOIN customers c ON c.customer_id = s.customer_id
WHERE s.rn = 1 AND s.next_date IS NOT NULL
ORDER BY days_between, c.customer_name;` }
  ],
  83: [
    { label: 'Self join to the next existing number',
      sql: `SELECT i.branch, i.invoice_no + 1 AS missing_from, n.next_no - 1 AS missing_to
FROM invoices i
JOIN (
  SELECT a.branch, a.invoice_no, MIN(b.invoice_no) AS next_no
  FROM invoices a JOIN invoices b ON b.branch = a.branch AND b.invoice_no > a.invoice_no
  GROUP BY a.branch, a.invoice_no
) n ON n.branch = i.branch AND n.invoice_no = i.invoice_no
WHERE n.next_no - i.invoice_no > 1
ORDER BY i.branch, missing_from;` }
  ],
  85: [
    { label: 'MIN over the partition instead of ROW_NUMBER',
      sql: `WITH flagged AS (
  SELECT order_date,
         CASE WHEN order_date = MIN(order_date) OVER (PARTITION BY customer_id) THEN 1 ELSE 0 END AS is_first
  FROM orders WHERE status <> 'Cancelled'
)
SELECT STRFTIME('%Y-%m', order_date) AS month,
       SUM(is_first)     AS new_customers,
       SUM(1 - is_first) AS repeat_orders
FROM flagged GROUP BY STRFTIME('%Y-%m', order_date) ORDER BY month;` }
  ]

};
