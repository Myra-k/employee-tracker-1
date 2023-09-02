const inquirer = require('inquirer');
const database = require('./db/employeedata.js');

async function initiateEmployeeManagement() {
    let continueExecution = true;

    while (continueExecution) {
        const { action } = await inquirer.prompt({
            type: 'list',
            name: 'action',
            message: 'Select an operation from the options below:',
            choices: [
                'List employees',
                'List departments',
                'List roles',
                'List employees under specific manager',
                'List employees within a chosen department',
                'Add a new employee',
                'Add a new department',
                'Add a new role',
                'Change the department of a specific role',
                'Update employee role',
                'Update manager',
                'Remove an employee',
                'Remove a department',
                'Remove a role',
                'Exit'
            ],
        });

        switch (action) {
            case 'List departments':
                await listDepartments();
                break;
            case 'List roles':
                await listRoles();
                break;
            case 'List employees':
                await listEmployees();
                break;
            case 'Add a new department':
                await addNewDepartment();
                break;
            case 'Add a new role':
                await addNewRole();
                break;
            case 'Change the department of a specific role':
                await changeRoleDepartment();
                break;
            case 'Add a new employee':
                await addNewEmployee();
                break;
            case 'Update employee role':
                await updateEmployeeRole();
                break;
            case 'Update manager':
                await updateManager();
                break;
            case 'Remove department':
                await removeDepartment();
                break;
            case 'Remove role':
                await removeRole();
                break;
            case 'List employees under specific manager':
                await listEmployeesUnderManager();
                break;
            case 'List employees within a chosen department':
                await listEmployeesInDepartment();
                break;
            case 'Remove an employee':
                await removeEmployee();
                break;
            default:
                continueExecution = false;
                break;
        }
    }

    process.exit();
}

async function listDepartments() {
    const departments = await database.listDepartments();
    console.table(departments);
}

async function listRoles() {
    const roles = await database.listRoles();
    console.table(roles);
}

async function listEmployees() {
    const employees = await database.listEmployees();
    console.table(employees);
}

async function addNewDepartment() {
    const { name } = await inquirer.prompt({ type: 'input', name: 'name', message: 'Enter the name of the department:' });
    await database.addDepartment(name);
}

async function addNewRole() {
    const roleData = await inquirer.prompt([
        { type: 'input', name: 'title', message: 'Enter the name of the role:' },
        { type: 'input', name: 'salary', message: 'Enter the annual salary for the new role:' },
    ]);

    const departmentId = await promptDepartmentSelection();
    await database.addRole(roleData.title, roleData.salary, departmentId);
}

async function changeRoleDepartment() {
    const roleId = await promptRoleSelection();
    const newDepartmentId = await promptDepartmentSelection();
    await database.changeRoleDepartment(newDepartmentId, roleId);
}

async function addNewEmployee() {
    const employeeData = await inquirer.prompt([
        { type: 'input', name: 'firstName', message: 'Enter the employee\'s first name:' },
        { type: 'input', name: 'lastName', message: 'Enter the employee\'s last name:' },
    ]);

    const roleId = await promptRoleSelection();
    const managerId = await promptEmployeeSelection('Select a manager: ');

    await database.addEmployee(employeeData.firstName, employeeData.lastName, roleId, managerId);
}

async function updateEmployeeRole() {
    const employeeToUpdateId = await promptEmployeeSelection('Select an employee: ');
    const newRoleId = await promptRoleSelection();
    await database.updateEmployeeRole(newRoleId, employeeToUpdateId);
}

async function updateManager() {
    const employeeToUpdateId = await promptEmployeeSelection("Select an employee: ");
    const newManagerId = await promptEmployeeSelection('Assign a new manager: ');
    await database.updateManager(employeeToUpdateId, newManagerId);
}

async function removeDepartment() {
    const departmentIdToRemove = await promptDepartmentSelection();
    await database.removeDepartment(departmentIdToRemove);
}

async function removeRole() {
    const roleIdToRemove = await promptRoleSelection();
    await database.removeRole(roleIdToRemove);
}

async function listEmployeesUnderManager() {
    const managerIdToFilterBy = await promptEmployeeSelection('Select a manager:');
    const employeesByManager = await database.listEmployeesUnderManager(managerIdToFilterBy);
    console.table(employeesByManager);
}

async function listEmployeesInDepartment() {
    const departmentIdToFilterBy = await promptDepartmentSelection();
    const employeesByDepartment = await database.listEmployeesInDepartment(departmentIdToFilterBy);
    console.table(employeesByDepartment);
}

async function removeEmployee() {
    const employeeIdToRemove = await promptEmployeeSelection('Select an employee: ');
    await database.removeEmployee(employeeIdToRemove);
}

async function promptEmployeeSelection(message) {
    const allEmployees = await database.listEmployees();
    const employeeChoices =
        [
            { name: 'None', value: null },
            ...allEmployees.map((employee) => ({
                name: `${employee.firstName} ${employee.lastName}`,
                value: employee.id,
            })),
        ];

    const { employeeId } = await inquirer.prompt({
        type: 'list',
        name: 'employeeId',
        message: message,
        choices: employeeChoices,
    });

    return employeeId;
}

async function promptDepartmentSelection() {
    const allDepartments = await database.listDepartments();
    const departmentChoices = allDepartments.map((department) => ({
        name: department.name,
        value: department.id,
    }));

    const { departmentId } = await inquirer.prompt({
        type: 'list',
        name: 'departmentId',
        message: 'Select a department:',
        choices: departmentChoices,
    });

    return departmentId;
}

async function promptRoleSelection() {
    const allRoles = await database.listRoles();
    const roleChoices = allRoles.map((role) => ({
        name: role.title,
        value: role.id,
    }));

    const { roleId } = await inquirer.prompt({
        type: 'list',
        name: 'roleId',
        message: 'Select a role:',
        choices: roleChoices,
    });

    return roleId;
}

initiateEmployeeManagement();

