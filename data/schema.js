// Seed database for SQL Practice Hub.
// Loaded into an in-browser SQLite (sql.js) instance on startup.
export const SCHEMA_SQL = `
DROP TABLE IF EXISTS departments;
CREATE TABLE departments (
  dept_id     INTEGER PRIMARY KEY,
  dept_name   TEXT NOT NULL,
  location    TEXT,
  budget      REAL
);
INSERT INTO departments VALUES
 (1,'Engineering','Bangalore',2500000),
 (2,'Sales','Mumbai',1200000),
 (3,'Marketing','Delhi',800000),
 (4,'Human Resources','Bangalore',400000),
 (5,'Finance','Mumbai',900000),
 (6,'Data Science','Bangalore',1800000),
 (7,'Support','Pune',600000),
 (8,'Legal','Delhi',350000),
 (9,'Research','Hyderabad',500000),
 (10,'Facilities','Pune',220000);

DROP TABLE IF EXISTS employees;
CREATE TABLE employees (
  emp_id      INTEGER PRIMARY KEY,
  first_name  TEXT NOT NULL,
  last_name   TEXT NOT NULL,
  email       TEXT,
  dept_id     INTEGER,
  manager_id  INTEGER,
  job_title   TEXT,
  salary      REAL,
  bonus_pct   REAL,
  hire_date   TEXT,
  city        TEXT,
  is_active   INTEGER
);
INSERT INTO employees VALUES
 (1,'Aarav','Sharma','aarav.sharma@corp.com',1,NULL,'VP Engineering',210000,0.20,'2015-03-12','Bangalore',1),
 (2,'Diya','Patel','diya.patel@corp.com',1,1,'Engineering Manager',165000,0.15,'2016-07-01','Bangalore',1),
 (3,'Rohan','Mehta','rohan.mehta@corp.com',1,2,'Senior Engineer',132000,0.10,'2017-01-23','Bangalore',1),
 (4,'Ananya','Iyer','ananya.iyer@corp.com',1,2,'Engineer',98000,0.08,'2019-05-16','Pune',1),
 (5,'Kabir','Nair','kabir.nair@corp.com',1,2,'Engineer',94000,0.08,'2020-02-10','Bangalore',1),
 (6,'Meera','Rao','meera.rao@corp.com',1,2,'Junior Engineer',68000,0.05,'2022-08-01','Bangalore',1),
 (7,'Vivaan','Gupta','vivaan.gupta@corp.com',2,NULL,'VP Sales',195000,0.25,'2014-11-05','Mumbai',1),
 (8,'Isha','Bose','isha.bose@corp.com',2,7,'Sales Manager',142000,0.18,'2017-09-19','Mumbai',1),
 (9,'Arjun','Reddy','arjun.reddy@corp.com',2,8,'Account Executive',88000,0.12,'2018-06-11','Mumbai',1),
 (10,'Sara','Khan','sara.khan@corp.com',2,8,'Account Executive',91000,0.12,'2019-03-04','Delhi',1),
 (11,'Neha','Joshi','neha.joshi@corp.com',2,8,'Sales Rep',62000,0.10,'2021-10-25','Mumbai',0),
 (12,'Aditya','Verma','aditya.verma@corp.com',3,NULL,'Marketing Director',158000,0.15,'2016-04-18','Delhi',1),
 (13,'Priya','Menon','priya.menon@corp.com',3,12,'Marketing Manager',112000,0.10,'2018-12-03','Delhi',1),
 (14,'Kunal','Desai','kunal.desai@corp.com',3,12,'Content Strategist',74000,0.06,'2021-01-11','Delhi',1),
 (15,'Riya','Chopra','riya.chopra@corp.com',4,NULL,'HR Head',124000,0.12,'2015-08-22','Bangalore',1),
 (16,'Manav','Sinha','manav.sinha@corp.com',4,15,'HR Specialist',66000,0.05,'2020-07-14','Bangalore',1),
 (17,'Tanvi','Kulkarni','tanvi.kulkarni@corp.com',5,NULL,'Finance Director',172000,0.18,'2014-02-02','Mumbai',1),
 (18,'Karan','Bhat','karan.bhat@corp.com',5,17,'Financial Analyst',89000,0.09,'2019-11-08','Mumbai',1),
 (19,'Sneha','Pillai','sneha.pillai@corp.com',5,17,'Accountant',71000,0.06,'2020-05-30','Mumbai',1),
 (20,'Dev','Malhotra','dev.malhotra@corp.com',6,1,'Head of Data Science',188000,0.20,'2017-03-27','Bangalore',1),
 (21,'Aisha','Sheikh','aisha.sheikh@corp.com',6,20,'Data Scientist',126000,0.12,'2019-09-09','Bangalore',1),
 (22,'Nikhil','Saxena','nikhil.saxena@corp.com',6,20,'Data Scientist',121000,0.12,'2020-10-19','Pune',1),
 (23,'Pooja','Agarwal','pooja.agarwal@corp.com',6,20,'Data Analyst',85000,0.08,'2022-02-14','Bangalore',1),
 (24,'Rahul','Dutta','rahul.dutta@corp.com',6,20,'Data Analyst',82000,0.08,'2022-06-06','Bangalore',1),
 (25,'Simran','Kaur','simran.kaur@corp.com',7,NULL,'Support Lead',95000,0.08,'2018-01-15','Pune',1),
 (26,'Yash','Thakur','yash.thakur@corp.com',7,25,'Support Engineer',58000,0.04,'2021-04-20','Pune',1),
 (27,'Ira','Banerjee','ira.banerjee@corp.com',7,25,'Support Engineer',56000,0.04,'2022-11-28','Pune',0),
 (28,'Zoya','Ahmed','zoya.ahmed@corp.com',NULL,NULL,'Contractor',70000,NULL,'2023-01-09','Delhi',1),
 (29,'Aryan','Kapoor','aryan.kapoor@corp.com',1,2,'Engineer',98000,0.08,'2021-05-16','Bangalore',1),
 (30,'Lakshmi','Krishnan','lakshmi.krishnan@corp.com',8,NULL,'Legal Counsel',148000,0.10,'2019-02-25','Delhi',1),
 (31,'Rehan','Fernandes','rehan.fernandes@corp.com',1,2,'Principal Engineer',178000,0.15,'2016-09-12','Bangalore',1),
 (32,'Aditi','Rane','aditi.rane@corp.com',6,20,'Senior Data Scientist',192000,0.15,'2018-04-02','Bangalore',1);

DROP TABLE IF EXISTS customers;
CREATE TABLE customers (
  customer_id  INTEGER PRIMARY KEY,
  customer_name TEXT NOT NULL,
  segment      TEXT,
  country      TEXT,
  city         TEXT,
  signup_date  TEXT
);
INSERT INTO customers VALUES
 (1,'Acme Retail','Enterprise','India','Mumbai','2021-01-15'),
 (2,'Bluewave Tech','Enterprise','India','Bangalore','2021-03-22'),
 (3,'Corner Store','SMB','India','Pune','2021-06-30'),
 (4,'Delta Logistics','Mid-Market','India','Delhi','2021-08-05'),
 (5,'Everest Foods','SMB','Nepal','Kathmandu','2022-01-11'),
 (6,'Falcon Media','Mid-Market','India','Mumbai','2022-02-19'),
 (7,'Global Mart','Enterprise','UAE','Dubai','2022-04-01'),
 (8,'Horizon Labs','Mid-Market','India','Hyderabad','2022-05-23'),
 (9,'Indus Motors','Enterprise','India','Chennai','2022-07-14'),
 (10,'Jetstream Air','Enterprise','Singapore','Singapore','2022-09-02'),
 (11,'Kite Apparel','SMB','India','Jaipur','2022-11-17'),
 (12,'Lumen Energy','Mid-Market','India','Ahmedabad','2023-01-08'),
 (13,'Maple Foods','SMB','Canada','Toronto','2023-02-26'),
 (14,'Nova Pharma','Enterprise','India','Mumbai','2023-04-12'),
 (15,'Orbit Games','SMB','India','Kolkata','2023-06-03'),
 (16,'Peak Ventures','Mid-Market','India','Gurgaon','2023-08-21'),
 (17,'Quartz Interiors','SMB','India','Noida','2023-10-09');

DROP TABLE IF EXISTS products;
CREATE TABLE products (
  product_id   INTEGER PRIMARY KEY,
  product_name TEXT NOT NULL,
  category     TEXT,
  unit_price   REAL,
  cost_price   REAL,
  supplier     TEXT
);
INSERT INTO products VALUES
 (1,'Analytics Pro License','Software',1200,300,'Inhouse'),
 (2,'Analytics Lite License','Software',400,90,'Inhouse'),
 (3,'Data Warehouse Addon','Software',2500,700,'Inhouse'),
 (4,'Onboarding Package','Services',1800,900,'Inhouse'),
 (5,'Premium Support','Services',3000,1100,'Inhouse'),
 (6,'Training Workshop','Services',950,400,'PartnerCo'),
 (7,'Edge Server','Hardware',5400,3900,'HardWorks'),
 (8,'Sensor Kit','Hardware',780,510,'HardWorks'),
 (9,'Tablet Terminal','Hardware',620,430,'GadgetHub'),
 (10,'API Gateway License','Software',1600,380,'Inhouse'),
 (11,'Custom Dashboard Build','Services',4200,2300,'Inhouse'),
 (12,'Backup Appliance','Hardware',2900,2000,'HardWorks'),
 (13,'Legacy Connector','Software',300,60,'Inhouse'),
 (14,'On-site Audit','Services',2200,1400,'PartnerCo');

DROP TABLE IF EXISTS orders;
CREATE TABLE orders (
  order_id     INTEGER PRIMARY KEY,
  customer_id  INTEGER,
  emp_id       INTEGER,
  order_date   TEXT,
  ship_date    TEXT,
  status       TEXT,
  region       TEXT
);
INSERT INTO orders VALUES
 (1001,1,9,'2023-01-05','2023-01-09','Delivered','West'),
 (1002,2,10,'2023-01-18','2023-01-22','Delivered','South'),
 (1003,3,9,'2023-02-02','2023-02-08','Delivered','West'),
 (1004,4,10,'2023-02-14',NULL,'Cancelled','North'),
 (1005,1,11,'2023-03-01','2023-03-04','Delivered','West'),
 (1006,5,9,'2023-03-19','2023-03-28','Delivered','North'),
 (1007,6,10,'2023-04-07','2023-04-11','Delivered','West'),
 (1008,7,9,'2023-04-23','2023-05-02','Delivered','International'),
 (1009,2,11,'2023-05-11','2023-05-15','Delivered','South'),
 (1010,8,10,'2023-05-29','2023-06-03','Delivered','South'),
 (1011,9,9,'2023-06-15',NULL,'Pending','South'),
 (1012,10,10,'2023-06-30','2023-07-08','Delivered','International'),
 (1013,1,9,'2023-07-12','2023-07-15','Delivered','West'),
 (1014,11,11,'2023-07-27','2023-08-01','Delivered','North'),
 (1015,12,10,'2023-08-09','2023-08-14','Delivered','West'),
 (1016,3,9,'2023-08-25',NULL,'Cancelled','West'),
 (1017,13,10,'2023-09-06','2023-09-18','Delivered','International'),
 (1018,14,9,'2023-09-21','2023-09-25','Delivered','West'),
 (1019,2,10,'2023-10-04','2023-10-07','Delivered','South'),
 (1020,15,11,'2023-10-19','2023-10-24','Delivered','East'),
 (1021,7,9,'2023-11-02','2023-11-12','Delivered','International'),
 (1022,4,10,'2023-11-16','2023-11-20','Delivered','North'),
 (1023,1,9,'2023-11-29','2023-12-02','Delivered','West'),
 (1024,9,10,'2023-12-08',NULL,'Pending','South'),
 (1025,6,9,'2023-12-19','2023-12-23','Delivered','West'),
 (1026,2,10,'2024-01-09','2024-01-13','Delivered','South'),
 (1027,8,9,'2024-01-24','2024-01-29','Delivered','South'),
 (1028,10,10,'2024-02-05','2024-02-14','Delivered','International'),
 (1029,14,9,'2024-02-18','2024-02-22','Delivered','West'),
 (1030,1,10,'2024-03-03','2024-03-06','Delivered','West'),
 (1031,12,9,'2024-03-17',NULL,'Pending','West'),
 (1032,5,10,'2024-03-28','2024-04-05','Delivered','North');

DROP TABLE IF EXISTS order_items;
CREATE TABLE order_items (
  item_id    INTEGER PRIMARY KEY,
  order_id   INTEGER,
  product_id INTEGER,
  quantity   INTEGER,
  unit_price REAL,
  discount   REAL
);
INSERT INTO order_items VALUES
 (1,1001,1,5,1200,0.00),(2,1001,4,1,1800,0.10),
 (3,1002,2,10,400,0.05),(4,1002,6,2,950,0.00),
 (5,1003,2,3,400,0.00),
 (6,1004,7,1,5400,0.00),
 (7,1005,1,2,1200,0.00),(8,1005,5,1,3000,0.05),
 (9,1006,8,6,780,0.00),
 (10,1007,3,1,2500,0.00),(11,1007,10,2,1600,0.10),
 (12,1008,7,3,5400,0.15),(13,1008,12,1,2900,0.00),
 (14,1009,1,8,1200,0.05),
 (15,1010,11,1,4200,0.00),
 (16,1011,9,12,620,0.05),
 (17,1012,3,2,2500,0.10),(18,1012,5,1,3000,0.00),
 (19,1013,2,15,400,0.10),
 (20,1014,9,4,620,0.00),(21,1014,8,2,780,0.00),
 (22,1015,10,3,1600,0.05),
 (23,1016,1,1,1200,0.00),
 (24,1017,6,4,950,0.00),(25,1017,4,1,1800,0.00),
 (26,1018,3,1,2500,0.05),(27,1018,1,4,1200,0.00),
 (28,1019,11,1,4200,0.10),
 (29,1020,2,6,400,0.00),
 (30,1021,7,2,5400,0.10),(31,1021,5,2,3000,0.05),
 (32,1022,12,2,2900,0.00),
 (33,1023,1,10,1200,0.15),(34,1023,10,1,1600,0.00),
 (35,1024,8,5,780,0.00),
 (36,1025,4,2,1800,0.05),
 (37,1026,1,6,1200,0.00),(38,1026,6,3,950,0.00),
 (39,1027,3,1,2500,0.00),
 (40,1028,7,1,5400,0.05),(41,1028,9,8,620,0.00),
 (42,1029,5,1,3000,0.00),(43,1029,11,1,4200,0.05),
 (44,1030,2,20,400,0.10),
 (45,1031,10,2,1600,0.00),
 (46,1032,8,3,780,0.00),(47,1032,9,3,620,0.00);

DROP TABLE IF EXISTS payments;
CREATE TABLE payments (
  payment_id  INTEGER PRIMARY KEY,
  order_id    INTEGER,
  amount      REAL,
  paid_date   TEXT,
  method      TEXT
);
INSERT INTO payments VALUES
 (1,1001,7620,'2023-01-12','Card'),
 (2,1002,5900,'2023-01-25','Bank Transfer'),
 (3,1003,1200,'2023-02-10','Card'),
 (4,1005,5250,'2023-03-07','Bank Transfer'),
 (5,1006,4680,'2023-03-30','Card'),
 (6,1007,5380,'2023-04-14','Bank Transfer'),
 (7,1008,16670,'2023-05-06','Bank Transfer'),
 (8,1009,9120,'2023-05-18','Card'),
 (9,1010,4200,'2023-06-05','Card'),
 (10,1012,7500,'2023-07-11','Bank Transfer'),
 (11,1013,5400,'2023-07-19','Card'),
 (12,1014,4040,'2023-08-04','Card'),
 (13,1015,4560,'2023-08-18','Bank Transfer'),
 (14,1017,5600,'2023-09-22','Card'),
 (15,1018,7175,'2023-09-28','Bank Transfer'),
 (16,1019,3780,'2023-10-10','Card'),
 (17,1020,2400,'2023-10-27','UPI'),
 (18,1021,15420,'2023-11-16','Bank Transfer'),
 (19,1022,5800,'2023-11-24','Card'),
 (20,1023,11800,'2023-12-06','Bank Transfer'),
 (21,1025,3420,'2023-12-27','UPI'),
 (22,1026,10050,'2024-01-16','Card'),
 (23,1027,2500,'2024-01-31','UPI'),
 (24,1028,10090,'2024-02-19','Bank Transfer'),
 (25,1029,6990,'2024-02-26','Card'),
 (26,1030,7200,'2024-03-09','Card'),
 (27,1032,4200,'2024-04-08','UPI');

DROP TABLE IF EXISTS users;
CREATE TABLE users (
  user_id     INTEGER PRIMARY KEY,
  username    TEXT,
  country     TEXT,
  plan        TEXT,
  signup_date TEXT,
  referrer_id INTEGER
);
INSERT INTO users VALUES
 (1,'anil_k','India','Free','2023-01-03',NULL),
 (2,'bhavna_s','India','Pro','2023-01-15',1),
 (3,'chirag_p','India','Free','2023-01-27',1),
 (4,'divya_m','USA','Pro','2023-02-08',2),
 (5,'esha_r','India','Enterprise','2023-02-19',NULL),
 (6,'farhan_a','UAE','Free','2023-03-02',3),
 (7,'gaurav_t','India','Pro','2023-03-14',5),
 (8,'hina_j','India','Free','2023-03-28',NULL),
 (9,'imran_q','India','Pro','2023-04-09',7),
 (10,'jaya_n','USA','Free','2023-04-21',4),
 (11,'kiran_v','India','Enterprise','2023-05-05',5),
 (12,'lata_d','India','Free','2023-05-18',8),
 (13,'mohit_b','India','Pro','2023-06-01',9),
 (14,'nisha_g','UK','Free','2023-06-16',NULL),
 (15,'omkar_l','India','Pro','2023-07-02',13);

DROP TABLE IF EXISTS events;
CREATE TABLE events (
  event_id   INTEGER PRIMARY KEY,
  user_id    INTEGER,
  event_type TEXT,
  event_date TEXT,
  duration_s INTEGER,
  device     TEXT
);
INSERT INTO events VALUES
 (1,1,'login','2023-05-01',120,'web'),(2,1,'query_run','2023-05-01',45,'web'),
 (3,2,'login','2023-05-01',300,'web'),(4,2,'dashboard_view','2023-05-01',600,'web'),
 (5,3,'login','2023-05-02',90,'mobile'),(6,2,'query_run','2023-05-02',75,'web'),
 (7,4,'login','2023-05-02',210,'web'),(8,5,'login','2023-05-03',400,'web'),
 (9,5,'dashboard_view','2023-05-03',900,'web'),(10,1,'login','2023-05-04',150,'mobile'),
 (11,6,'login','2023-05-04',60,'mobile'),(12,2,'login','2023-05-05',280,'web'),
 (13,7,'login','2023-05-05',330,'web'),(14,7,'query_run','2023-05-05',110,'web'),
 (15,8,'login','2023-05-06',95,'mobile'),(16,2,'export','2023-05-06',30,'web'),
 (17,9,'login','2023-05-07',260,'web'),(18,5,'query_run','2023-05-07',140,'web'),
 (19,1,'login','2023-05-08',130,'web'),(20,10,'login','2023-05-08',70,'mobile'),
 (21,11,'login','2023-05-09',520,'web'),(22,11,'dashboard_view','2023-05-09',700,'web'),
 (23,2,'login','2023-05-10',290,'web'),(24,12,'login','2023-05-10',80,'mobile'),
 (25,13,'login','2023-05-11',240,'web'),(26,13,'export','2023-05-11',40,'web'),
 (27,5,'login','2023-05-12',380,'web'),(28,14,'login','2023-05-12',65,'mobile'),
 (29,15,'login','2023-05-13',310,'web'),(30,9,'query_run','2023-05-13',125,'web'),
 (31,1,'query_run','2023-05-14',55,'web'),(32,2,'login','2023-05-15',270,'web'),
 (33,7,'login','2023-05-16',350,'web'),(34,11,'query_run','2023-05-17',160,'web'),
 (35,5,'login','2023-05-18',420,'web');

DROP TABLE IF EXISTS salaries_history;
CREATE TABLE salaries_history (
  record_id  INTEGER PRIMARY KEY,
  emp_id     INTEGER,
  effective_date TEXT,
  salary     REAL
);
INSERT INTO salaries_history VALUES
 (1,3,'2017-01-23',85000),(2,3,'2019-04-01',105000),(3,3,'2021-04-01',118000),(4,3,'2023-04-01',132000),
 (5,4,'2019-05-16',72000),(6,4,'2021-04-01',86000),(7,4,'2023-04-01',98000),
 (8,21,'2019-09-09',95000),(9,21,'2021-04-01',110000),(10,21,'2023-04-01',126000),
 (11,23,'2022-02-14',72000),(12,23,'2023-04-01',85000),
 (13,9,'2018-06-11',65000),(14,9,'2020-04-01',76000),(15,9,'2022-04-01',88000);
/* ============================================================
   Interview drill tables — shaped for advanced patterns:
   gaps and islands, sessionization, cohort retention,
   relational division and audit-style gap detection.
   ============================================================ */

DROP TABLE IF EXISTS seats;
CREATE TABLE seats (
  seat_id INTEGER PRIMARY KEY,
  hall    TEXT NOT NULL,
  seat_no INTEGER NOT NULL,
  is_free INTEGER NOT NULL
);
INSERT INTO seats VALUES
 (1,'A',1,1),(2,'A',2,1),(3,'A',3,1),(4,'A',4,0),(5,'A',5,1),(6,'A',6,1),
 (7,'A',7,0),(8,'A',8,1),(9,'A',9,1),(10,'A',10,1),(11,'A',11,1),(12,'A',12,0),
 (13,'B',1,0),(14,'B',2,1),(15,'B',3,1),(16,'B',4,1),(17,'B',5,1),(18,'B',6,1),
 (19,'B',7,0),(20,'B',8,1),(21,'B',9,0),(22,'B',10,1);

DROP TABLE IF EXISTS logins;
CREATE TABLE logins (
  login_id INTEGER PRIMARY KEY,
  user_id  INTEGER NOT NULL,
  login_ts TEXT NOT NULL,
  platform TEXT NOT NULL
);
INSERT INTO logins VALUES
 (1,1,'2023-06-01 09:00:00','web'),(2,1,'2023-06-01 09:20:00','web'),(3,1,'2023-06-01 11:05:00','web'),
 (4,1,'2023-06-02 10:00:00','web'),(5,1,'2023-06-03 10:30:00','web'),(6,1,'2023-06-04 08:15:00','web'),
 (7,2,'2023-06-01 12:00:00','mobile'),(8,2,'2023-06-03 12:00:00','mobile'),(9,2,'2023-06-05 12:00:00','mobile'),
 (10,3,'2023-06-02 08:00:00','web'),(11,3,'2023-06-02 08:25:00','web'),(12,3,'2023-06-02 09:30:00','web'),
 (13,3,'2023-06-03 08:00:00','mobile'),(14,3,'2023-06-04 08:00:00','web'),
 (15,3,'2023-06-05 08:00:00','web'),(16,3,'2023-06-06 08:00:00','web'),
 (17,4,'2023-06-01 07:30:00','mobile'),
 (18,5,'2023-06-05 20:00:00','web'),(19,5,'2023-06-06 20:00:00','web'),(20,5,'2023-06-07 20:00:00','web'),
 (21,7,'2023-06-01 06:00:00','web'),(22,7,'2023-06-02 06:00:00','web'),
 (23,7,'2023-06-10 06:00:00','mobile'),(24,7,'2023-06-11 06:00:00','mobile'),
 (25,7,'2023-06-12 06:00:00','mobile'),(26,7,'2023-06-13 06:00:00','mobile'),
 (27,9,'2023-06-03 15:00:00','mobile'),(28,9,'2023-06-04 15:00:00','mobile'),
 (29,11,'2023-06-08 11:00:00','web'),(30,11,'2023-06-09 11:00:00','web'),(31,11,'2023-06-10 11:00:00','web'),
 (32,11,'2023-06-11 11:00:00','web'),(33,11,'2023-06-12 11:00:00','web');

DROP TABLE IF EXISTS daily_metrics;
CREATE TABLE daily_metrics (
  metric_id    INTEGER PRIMARY KEY,
  city         TEXT NOT NULL,
  metric_date  TEXT NOT NULL,
  active_users INTEGER NOT NULL
);
INSERT INTO daily_metrics VALUES
 (1,'Mumbai','2023-06-01',100),(2,'Mumbai','2023-06-02',120),(3,'Mumbai','2023-06-03',135),
 (4,'Mumbai','2023-06-04',150),(5,'Mumbai','2023-06-05',140),(6,'Mumbai','2023-06-06',155),
 (7,'Mumbai','2023-06-07',160),(8,'Mumbai','2023-06-08',158),(9,'Mumbai','2023-06-09',170),
 (10,'Mumbai','2023-06-10',182),
 (11,'Delhi','2023-06-01',80),(12,'Delhi','2023-06-02',75),(13,'Delhi','2023-06-03',90),
 (14,'Delhi','2023-06-04',95),(15,'Delhi','2023-06-05',99),(16,'Delhi','2023-06-06',105),
 (17,'Delhi','2023-06-07',102),(18,'Delhi','2023-06-08',110),(19,'Delhi','2023-06-09',115),
 (20,'Delhi','2023-06-10',120),
 (21,'Pune','2023-06-01',60),(22,'Pune','2023-06-02',65),(23,'Pune','2023-06-03',64),
 (24,'Pune','2023-06-04',70),(25,'Pune','2023-06-05',69),(26,'Pune','2023-06-06',72),
 (27,'Pune','2023-06-07',71),(28,'Pune','2023-06-08',75),(29,'Pune','2023-06-09',74),
 (30,'Pune','2023-06-10',78),
 (31,'Chennai','2023-06-01',200),(32,'Chennai','2023-06-02',210),(33,'Chennai','2023-06-03',220),
 (34,'Chennai','2023-06-04',230),(35,'Chennai','2023-06-05',240),(36,'Chennai','2023-06-06',250),
 (37,'Chennai','2023-06-07',245),(38,'Chennai','2023-06-08',255),(39,'Chennai','2023-06-09',265),
 (40,'Chennai','2023-06-10',275);

DROP TABLE IF EXISTS subscription_log;
CREATE TABLE subscription_log (
  log_id      INTEGER PRIMARY KEY,
  account_id  INTEGER NOT NULL,
  status      TEXT NOT NULL,
  status_date TEXT NOT NULL
);
INSERT INTO subscription_log VALUES
 (1,1,'active','2023-01-01'),(2,1,'active','2023-02-01'),(3,1,'paused','2023-03-01'),
 (4,1,'paused','2023-04-01'),(5,1,'active','2023-05-01'),
 (6,2,'trial','2023-01-15'),(7,2,'active','2023-02-15'),(8,2,'active','2023-03-15'),
 (9,2,'cancelled','2023-04-15'),
 (10,3,'active','2023-02-10'),(11,3,'paused','2023-03-10'),(12,3,'active','2023-04-10'),
 (13,3,'active','2023-05-10'),(14,3,'active','2023-06-10');

DROP TABLE IF EXISTS messages;
CREATE TABLE messages (
  msg_id      INTEGER PRIMARY KEY,
  sender_id   INTEGER NOT NULL,
  receiver_id INTEGER NOT NULL,
  sent_date   TEXT NOT NULL
);
INSERT INTO messages VALUES
 (1,1,2,'2023-07-01'),(2,2,1,'2023-07-01'),(3,1,2,'2023-07-03'),
 (4,1,3,'2023-07-02'),(5,3,1,'2023-07-04'),
 (6,2,3,'2023-07-05'),(7,2,3,'2023-07-06'),
 (8,4,5,'2023-07-07'),(9,5,4,'2023-07-08'),(10,4,5,'2023-07-09'),(11,5,4,'2023-07-10'),
 (12,6,7,'2023-07-11');

DROP TABLE IF EXISTS exam_scores;
CREATE TABLE exam_scores (
  score_id     INTEGER PRIMARY KEY,
  student_id   INTEGER NOT NULL,
  student_name TEXT NOT NULL,
  subject      TEXT NOT NULL,
  marks        INTEGER NOT NULL
);
INSERT INTO exam_scores VALUES
 (1,1,'Ravi','Physics',78),(2,1,'Ravi','Chemistry',78),(3,1,'Ravi','Maths',91),
 (4,2,'Sneha','Physics',88),(5,2,'Sneha','Chemistry',92),(6,2,'Sneha','Maths',88),
 (7,3,'Arjun','Physics',65),(8,3,'Arjun','Chemistry',70),(9,3,'Arjun','Maths',80),
 (10,4,'Meera','Physics',90),(11,4,'Meera','Chemistry',90),(12,4,'Meera','Maths',90),
 (13,5,'Kabir','Physics',55),(14,5,'Kabir','Chemistry',60);

DROP TABLE IF EXISTS invoices;
CREATE TABLE invoices (
  invoice_id  INTEGER PRIMARY KEY,
  branch      TEXT NOT NULL,
  invoice_no  INTEGER NOT NULL,
  issued_date TEXT NOT NULL,
  amount      REAL NOT NULL
);
INSERT INTO invoices VALUES
 (1,'North',1001,'2023-04-01',12000),(2,'North',1002,'2023-04-03',8400),
 (3,'North',1004,'2023-04-08',15600),(4,'North',1005,'2023-04-11',7300),
 (5,'North',1009,'2023-04-19',22000),(6,'North',1010,'2023-04-22',9100),
 (7,'South',2001,'2023-04-02',5400),(8,'South',2002,'2023-04-06',6700),
 (9,'South',2003,'2023-04-09',8800),
 (10,'West',3001,'2023-04-04',14000),(11,'West',3003,'2023-04-12',11200),
 (12,'West',3004,'2023-04-15',9800),(13,'West',3008,'2023-04-25',17500);

`;

export const TABLE_GROUPS = [
  {
    name: 'HR / Company',
    tables: ['employees', 'departments', 'salaries_history'],
    blurb: 'Classic interview schema — self-joins on manager_id, salary ranking, NULL handling.'
  },
  {
    name: 'Sales / E-commerce',
    tables: ['customers', 'orders', 'order_items', 'products', 'payments'],
    blurb: 'Revenue analysis, joins across 5 tables, month-over-month growth, top-N per group.'
  },
  {
    name: 'Product Analytics',
    tables: ['users', 'events'],
    blurb: 'Retention, DAU, funnel-style questions, self-referencing referrals.'
  },
  {
    name: 'Interview Drills',
    tables: ['seats', 'logins', 'daily_metrics', 'subscription_log', 'messages', 'exam_scores', 'invoices'],
    blurb: 'Advanced-pattern practice — gaps and islands, streaks, sessionization, cohort retention, relational division and invoice-gap audits.'
  }
];
