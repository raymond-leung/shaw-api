'use strict';

const ManageHandler = require('./../handlers/manage');

const apiPath = 'api';
const version = 'v1';

module.exports = [
    {
        method: 'GET',
        path: `/${apiPath}/${version}/manage/list/{status}`,
        config: {
            cors: true,
            auth: {
                strategy: 'jwt',
                scope: ['+admin']
            }
        },
        handler: ManageHandler.list
    },
    {
        method: 'GET',
        path: `/${apiPath}/${version}/manage/employee/{searchTerm}`,
        config: {
            cors: true,
            auth: {
                strategy: 'jwt',
                scope: ['+admin']
            }
        },
        handler: ManageHandler.getEmployee
    },
    {
        method: 'GET',
        path: `/${apiPath}/${version}/manage/counts`,
        config: {
            cors: true,
            auth: {
                strategy: 'jwt',
                scope: ['+admin']
            }
        },
        handler: ManageHandler.getCounts
    },
    {
        method: 'PUT',
        path: `/${apiPath}/${version}/manage/employee/{employeeId}`,
        config: { 
            cors: true,
            auth: {
                strategy: 'jwt',
                scope: ['+admin']
            }
        },
        handler: ManageHandler.updateEmployee
    },
    {
        method: 'POST',
        path: `/${apiPath}/${version}/manage/employee`,
        config: {
            cors: true,
            auth: {
                strategy: 'jwt',
                scope: ['+admin']
            }
        },
        handler: ManageHandler.addEmployee
    },
    {
        method: 'GET',
        path: `/${apiPath}/${version}/manage/titles`,
        config: {
            cors: true,
            auth: {
                strategy: 'jwt',
                scope: ['+admin']
            }
        },
        handler: ManageHandler.getTitles
    },
    {
        method: 'GET',
        path: `/${apiPath}/${version}/manage/departments`,
        config: {
            cors: true,
            auth: {
                strategy: 'jwt',
                scope: ['+admin']
            }
        },
        handler: ManageHandler.getDepartments
    },
    {
        method: 'GET',
        path: `/${apiPath}/${version}/manage/locations`,
        config: {
            cors: true,
            auth: { 
                strategy: 'jwt',
                scope: ['+admin']
            }
        },
        handler: ManageHandler.getLocations
    },
    {
        method: 'GET',
        path: `/${apiPath}/${version}/manage/managers`,
        config: {
            cors: true,
            auth: {
                strategy: 'jwt',
                scope: ['+admin']
            }
        },
        handler: ManageHandler.getManagers
    },
    {
        method: 'GET',
        path: `/${apiPath}/${version}/manage/vps`,
        config: {
            cors: true,
            auth: {
                strategy: 'jwt',
                scope: ['+admin']
            }
        },
        handler: ManageHandler.getVps
    }
];
