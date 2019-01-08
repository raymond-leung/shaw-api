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
            tenure: data[4],
            location: data[5],
            title: data[6],
            department: data[7],
            manager: data[8],
            vp: data[9],
            over19: data[10] === 'OVER 19' ? true : false,
        });
    })
    .on("end", () => {
        fs.open('jayOutputFile.sql', 'w', (err, fd) => {
            if(err) { console.log('error opening output file: ', err) }

            employees.forEach((employee) => {
                fs.write(fd, `INSERT INTO jay_employees (employeeId, firstName, lastName, preferredName, tenure, title, department, location, email, manager, over19, vp, isAdmin) VALUES (${employee.id}, "${employee.firstName}", "${employee.lastName}", "${employee.preferredName}", ${employee.tenure}, "${employee.title}", "${employee.department}", "${employee.location}", "${employee.email}", "${employee.manager}", ${employee.over19}, "${employee.vp}", 0);\r\n`);
            })
        })
    });
