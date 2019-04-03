'use strict';

const fs = require('fs');
const csv = require('fast-csv');

const employees = [];
fs.createReadStream('./jay.csv')
    .pipe(csv())
    .on("data", (data) => {
        employees.push({
            id: data[0],
            lastName: data[1],
            firstName: data[2],
            preferredName: data[2],
            email: data[3],
            location: data[4],
            title: data[5],
            department: data[6],
            manager: data[7],
            vp: data[8],
        });
    })
    .on("end", () => {
        fs.open('jayOutputFile.sql', 'w', (err, fd) => {
            if(err) { console.log('error opening output file: ', err) }

            employees.forEach((employee) => {
                fs.write(fd, `INSERT INTO jay_employees (employeeId, firstName, lastName, preferredName, title, department, location, email, manager, vp, isAdmin) VALUES (${employee.id}, "${employee.firstName}", "${employee.lastName}", "${employee.preferredName}", "${employee.title}", "${employee.department}", "${employee.location}", "${employee.email}", "${employee.manager}", "${employee.vp}", 0);\r\n`);
            })
        })
    });
