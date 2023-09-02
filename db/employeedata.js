const mysql = require('mysql2/promise');

const dbConnection = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: 'Mittens786',
    database: 'employees_db',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
});

const fetchEmployees = async () => {
    const [rows, fields] = await dbConnection.execute('SELECT * FROM employee');
    return rows;
};

const fetchDepartments = async () => {
    const [rows, fields] = await dbConnection.execute('SELECT * FROM department');
    return rows;
};

const fetchRoles = async () => {
    const [rows, fields] = await dbConnection.execute('SELECT * FROM role');
    return rows;
};

const fetchEmployeesUnderManager = async (managerId) => {
    const [rows, fields] = await dbConnection.execute('SELECT id, first_name, last_name, role_id FROM employee WHERE manager_id = ?', [managerId]);
    return rows;
};

const fetchEmployeesInDepartment = async (departmentId) => {
    const [rows, fields] = await dbConnection.execute('SELECT * FROM EMPLOYEE e JOIN ROLE r ON e.role_id = r.id WHERE r.department_id = ?', [departmentId]);
    return rows;
};

const addEmployee = async (firstName, lastName, roleId, managerId) => {
    const response = await dbConnection.execute(
        'INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)', [firstName, lastName, roleId, managerId]
    );
    return response;
};

const addDepartment = async (name) => {
    const response = await dbConnection.execute(
        'INSERT INTO department (name) VALUES (?)', [name]
    );
    return response;
};

const addRole = async (title, salary, departmentId) => {
    const response = await dbConnection.execute(
        'INSERT INTO role (title, salary, department_id) VALUES (?, ?, ?)', [title, salary, departmentId]
    );
    return response;
};

const updateEmployeeRole = async (roleId, employeeId) => {
    const response = await dbConnection.execute(
        'UPDATE employee SET role_id = ? WHERE id = ?', [roleId, employeeId]
    );
    return response;
};

const updateRoleDepartment = async (departmentId, roleId) => {
    const response = await dbConnection.execute('UPDATE role SET department_id = ? WHERE id = ?', [departmentId, roleId]);
    return response;
};

const updateEmployeeManager = async (employeeId, managerId) => {
    const response = await dbConnection.execute('UPDATE employee SET manager_id = ? WHERE id = ?', [managerId, employeeId]);
    return response;
};

const removeEmployee = async (employeeId) => {
    await dbConnection.execute('UPDATE employee SET manager_id = null WHERE manager_id = ?', [employeeId]);
    const response = await dbConnection.execute('DELETE FROM employee WHERE id = ?', [employeeId]);
    return response;
};

const removeDepartment = async (departmentId) => {
    await dbConnection.execute('UPDATE role SET department_id = null WHERE department_id = ?', [departmentId]);
    const response = await dbConnection.execute('DELETE FROM department WHERE id = ?', [departmentId]);
    return response;
};

const removeRole = async (roleId) => {
    await dbConnection.execute('UPDATE employee SET role_id = null WHERE role_id = ?', [roleId]);
    const response = await dbConnection.execute('DELETE FROM role WHERE id = ?', [roleId]);
    return response;
};

module.exports = {
    fetchEmployees,
    fetchDepartments,
    fetchRoles,
    fetchEmployeesUnderManager,
    fetchEmployeesInDepartment,
    addDepartment,
    addRole,
    addEmployee,
    updateEmployeeRole,
    updateRoleDepartment,
    updateEmployeeManager,
    removeEmployee,
    removeDepartment,
    removeRole,
};
