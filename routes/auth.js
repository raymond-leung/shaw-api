'use strict';

const AuthHandler = require('./../handlers/auth');

const apiPath = 'api';
const version = 'v1';

module.exports = [
    {
        method: 'POST',
        path: `/${apiPath}/${version}/login`,
        config: { auth: false, cors: true },
        handler: AuthHandler.login,
    },
    {
        method: 'POST',
        path: `/${apiPath}/${version}/logout`,
        config: { auth: 'jwt', cors: true },
        handler: AuthHandler.logout
    }
];
