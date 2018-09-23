'use strict';

const ConfigsHandler = require('./../handlers/configs');

const apiPath = 'api';
const version = 'v1';

module.exports = [
    {
        method: 'PUT',
        path: `/${apiPath}/${version}/configs`,
        config: {
            cors: true,
            auth: {
                strategy: 'jwt',
                scope: ['+admin']
            }
        },
        handler: ConfigsHandler.update
    },
    {
        method: 'GET',
        path: `/${apiPath}/${version}/configs`,
        config: { auth: false, cors: true },
        handler: ConfigsHandler.get
    }
];
