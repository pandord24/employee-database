const inquirer = require('inquirer');
const { Pool } = require('pg');

const pool = new Pool({
    host: 'localhost',
    user: 'postgres',
    password: '1234',
    database: 'employee_db',
    port: 5432
},
    console.log("Connected to the database")
);

pool.connect();
function quit() {
    console.log("Goodbye!");
    process.exit()
}
function menu() {
    inquirer.prompt([{
        type: "list",
        name: "choice",
        message: "What would you like to do?",
        choices: ["view all department", "view all roles", "view all employees", "add a department", "add a role", "add an employee", "update employee role", "update employee managers","quit"]
    }]).then(({ choice }) => {
        if (choice === "view all department") viewDepartment()
        else if (choice === "view all roles") viewRole()
        else if (choice === "view all employees") viewEmployees()
        else if (choice === "add a department") addDepartment()
        else if (choice === "add a role") addRole()
        else if (choice === "add an employee") addEmployee()
        else if (choice === "update employee role") updateEmployee()
        else if (choice === "update employee managers")updateManager()
        else quit()
    })
}
function viewEmployees() {
    const sql = `SELECT employee.id, employee.first_name AS "first name", employee.last_name AS "last name", role.title, department.name AS department, role.salary, manager.first_name || ' ' || manager.last_name AS manager FROM employee LEFT JOIN role ON employee.role_id = role.id LEFT JOIN department ON role.department_id = department.id LEFT JOIN employee manager ON manager.id = employee.manager_id`;
    pool.query(sql, (err, { rows }) => {
        if (err) {
            console.log(err);
        }
        console.table(rows)
        menu()
    })
}
function viewDepartment() {
    pool.query("select * from department", (err, { rows }) => {
        if (err) console.log(err)
        console.table(rows)
        menu()
    })
}
function viewRole() {
    pool.query("select role.id, role.title, role.salary, department.name as department from role join department on role.department_id=department.id", (err, { rows }) => {
        if (err) console.log(err)
        console.table(rows)
        menu()
    })
}
function addDepartment() {
    inquirer.prompt([{
        type: "input", name: "dept", message: "What is the name of the new department?"
    }]).then(({ dept }) => {
        pool.query("insert into department(name) values ($1::text)", [dept], err => {
            if (err) console.log(err)
            console.log("The new department is successfully inserted.")
            menu()
        })
    })

}
function addRole() {
    pool.query("select id as value, name as name from department", (err, { rows }) => {
        inquirer.prompt([
            {
                type: "input", name: "title", message: "What is the title of the new role?"
            },
            {
                type: "input", name: "salary", message: "What is the salary of the new role?"
            },
            {
                type: "list", name: "dept", message: "Which department does this role belong to?", choices: rows
            },
        ]).then(({ title, salary, dept }) => {
            pool.query("insert into role (title, salary, department_id) values ($1::text, $2::numeric, $3::numeric)", [title, salary, dept], err => {
                if (err) console.log(err)
                console.log("The new role is successfully inserted.")
                menu()
            })
        })
    })
}
function addEmployee() {
    pool.query("select id as value, title as name from role", (err, { rows: roles }) => {
        pool.query("select id as value, first_name || ' '|| last_name as name from employee", (err, { rows: manager }) => {
            manager = [{ value: null, name: "no manager" }, ...manager]
            inquirer.prompt([
                {
                    type: "input", name: "fname", message: "What is the employee's first name?"
                },
                {
                    type: "input", name: "lname", message: "What is the employee's last name?"
                },
                {
                    type: "list", name: "role", message: "What is the employee's new role?", choices: roles
                },
                {
                    type: "list", name: "manager", message: "Who is the employee's manager?", choices: manager
                },
            ]).then(({ fname, lname, role, manager }) => {
                pool.query("insert into employee(first_name, last_name, role_id, manager_id) values ($1::text,$2::text,$3::numeric,$4::numeric)", [fname, lname, role, manager], err => {
                    if (err) console.log(err)
                    console.log("The new employee is successfully inserted.")
                    menu()
                })
            })
        })
    })
}
function updateEmployee() {
    pool.query("select id as value, title as name from role", (err, { rows: roles }) => {
        pool.query("select id as value, first_name || ' '|| last_name as name from employee", (err, { rows: employees }) => {
            inquirer.prompt([
                {
                    type: "list", name: "employee", message: "which employee is changing role?", choices: employees
                },
                {
                    type: "list", name: "role", message: "What is the employee's new role?", choices: roles
                },

            ]).then(({ role, employee }) => {
                pool.query("update employee set role_id=$1::numeric where id=$2::numeric", [role, employee], err => {
                    if (err) console.log(err)
                    console.log("The employee is successfully updated.")
                    menu()
                })
            })
        })
    })
}

function updateManager() {
    pool.query("select id as value, first_name || ' '|| last_name as name from employee",(err,{rows})=>{
        inquirer.prompt([
            {
                type: "list", name: "employee", message: "which employee is changing manager?", choices: rows
            },
            {
                type: "list", name: "manager", message: "What is the employee's new manager?", choices: rows
            },
        ]).then(({employee,manager}) =>{
            pool.query("Update employee set manager_id=$1::numeric where id=$2::numeric",[manager,employee],err =>{
                if (err) console.log(err)
                console.log("The employee is successfully updated.")
                menu()
            })
        })
    })
}
// function viewEmployeeByDepartment() {
//     pool.query('SELECT * FROM department', (err, results) => {
//         if(err) {
//             console.log(err);
//         }
//         const departmentChoices = results. rows.map(department => {
//             name: department.name,
//             value: department.id

//         }))
//         console.log(departmentChoices)

//         inquirer.prompt([{
//             list: 'list',
//             name: 'departmentID',
//             message: 'Which department would you like to see employee for?',
//             choices: departmentChoices
//         }]).then((answers) => {
//             sqlQuery = `SELECT * FROM department WHERE id = $1`
//             pool.query(sqlQuery, [departmentID], (err, results) => )
//                 console.log("\n");
//                 console.table(results.rows)
//                 loadMainMenu();
//         });
//     })
// }

// function loadMainMenu(){
//     inquirer.createPromptModule([{
//         type: 'list',
//         name: 'choice',
//         message: 'What would you like to do?',
//         choices: [
//         {
//             name: "View All Employees",
//             value: "VIEW_EMPLOYEES"
//         }
//         {
//             name: "View All Employees By Department",
//             value: "VIEW_EMPLOYEES_BY_DEPARTMENT"
//         }
//         {
//             name: "Quit",
//             value: "QUIT"
//         }
//         ]
//     }]).then((ansers) => {
//         let { choice } = answers.choice;
//         if(choice === "VIEW_EMPLOYEES"){
//             sqlQuery = "SELECT * FROM employee";
//             pool.query(squlQuery, (err, results) => {
//                 console.log("\n");
//                 console.table(results.rows)
//             }).then(() => {
//                 loadMainMenu();
//             })
//         } else {
//             quit();
//         }

//     });
// }

function init() {
    console.log("Welcome to the Employee Management System");
    menu();
}

init();