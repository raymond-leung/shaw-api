'use strict';

const RsvpHandler = require('./../handlers/rsvp');

const apiPath = 'api';
const version = 'v1';

module.exports = [
    {
        method: 'PUT',
        path: `/${apiPath}/${version}/rsvp`,
        config: { auth: 'jwt', cors: true },
        handler: RsvpHandler.rsvp
    },
    {
        method: 'GET',
        path: `/${apiPath}/${version}/rsvp`,
        config: { auth: 'jwt', cors: true },
        handler: RsvpHandler.getRsvp
    },
    {
        method: 'DELETE',
        path: `/${apiPath}/${version}/rsvp`,
        config: { auth: 'jwt', cors: true },
        handler: RsvpHandler.cancelRsvp
    }
];
