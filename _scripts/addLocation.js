'use strict';

const fs = require('fs');
const csv = require('fast-csv');

const employees = [];
fs.createReadStream('./Shaw2018_departments.csv')
    .pipe(csv())
    .on("data", (data) => {
        employees.push({
            id: data[0],
            title: data[1],
            department: data[2]
        });
    })
    .on("end", () => {
        fs.open('departmentsOutputFile.sql', 'w', (err, fd) => {
            if(err) { console.log('error opening output file: ', err) }

            fs.write(fd, `ALTER TABLE employees ADD COLUMN title VARCHAR(64), ADD COLUMN department VARCHAR(64);\r\n\r\n`);

            employees.forEach((employee) => {
                fs.write(fd, `UPDATE employees SET title="${employee.title}", department="${employee.department}" WHERE employeeId=${employee.id} LIMIT 1;\r\n `);
            })
        })
    });

