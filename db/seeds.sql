\c employee_db

INSERT INTO department (name)
VALUES ('Engineering')
, ('Finance')
, ('Legal')
, ('Sales');

INSERT INTO role (title, salary, department_id)
VALUES ('Software Engineer', 100000, 1)
, ('Accountant', 80000, 2)
, ('Lawyer', 120000, 3)
, ('Sales Lead', 80000, 4)
, ('Salesperson', 60000, 4)
, ('Lead Engineer', 120000, 1)
, ('Account Manager', 100000, 4)
, ('Legal Team Lead', 250000, 3);

INSERT INTO employee 
    (first_name, last_name, role_id, manager_id)
VALUES ('John', 'Doe', 1, Null)
, ('Mike', 'Chan', 2, 1)
, ('Ashley', 'Rodriguez', 3, 1)
, ('Kevin', 'Tupik', 4, 3)
, ('Malia', 'Brown', 5, 3)
, ('Sarah', 'Lourd', 6, 1)
, ('Tom', 'Allen', 7, 4);