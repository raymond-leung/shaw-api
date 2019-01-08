'use strict';

exports.rsvp = async (request, h) => {
    const pool = request.mysql.pool;
    const credentials = request.auth.credentials;

    const responseObj = { success: false, isWaitingList: false };

    if(request.payload.status === undefined) {
        return h.response({ success: false, err: 'Invalid parameters' }).code(400);
    }

    try {
        //Get Previous RSVP
        const [prevRsvpRows, prevRsvpFields] = await pool.query("SELECT status, isWaitingList FROM jay_employees WHERE employeeId=? LIMIT 1", [credentials.empId]);

        //Check to see if we're full already
        if(parseInt(request.payload.status) === 1) {
            //Update rsvp dateTime if it's their first RSVP
            if(prevRsvpRows[0].status !== 1) {
                const [rsvpDateRows, rsvpDateFields] = await pool.query('UPDATE jay_employees SET rsvpDateTime=NOW() WHERE employeeId=? LIMIT 1', [credentials.empId]);
            }

            const [attendingRows, attendingFields] = await pool.query("SELECT COUNT(*) AS cnt FROM jay_employees WHERE status=1");

            if(attendingRows[0] && attendingRows[0].cnt >= process.env.MAX_ATTENDING && (prevRsvpRows[0].status !== 1 || (prevRsvpRows[0].status === 1 && prevRsvpRows[0].isWaitingList === 1))) {
                const [waitingListRows, waitingListFields] = await pool.query('UPDATE jay_employees SET status=1, isWaitingList=1, alergies=? WHERE employeeId=? LIMIT 1', [request.payload.alergies, credentials.empId]);
                responseObj.success = true;
                responseObj.isWaitingList = true;
            } else {
                const [attendingRows, attendingFields] = await pool.query('UPDATE jay_employees SET status=1, isWaitingList=0, alergies=? WHERE employeeId=? LIMIT 1', [request.payload.alergies, credentials.empId]);
                responseObj.success = true;
                responseObj.isWaitingList = false;
            }
        } else {
            const [notAttendingRows, notAttendingFields] = await pool.query('UPDATE jay_employees SET status=0, rsvpDateTime=NOW() WHERE employeeId=? LIMIT 1', [credentials.empId]);
        }

        return responseObj;
    } catch(err) {
        request.logger.error(`Erorr setting rsvp: ${err}`);
        return h.response({ success: false, err }).code(400);
    }
};

exports.getRsvp = async (request, h) => {
    const pool = request.mysql.pool;
    const credentials = request.auth.credentials;

    try {
        const [empRow, empFields] = await pool.query('SELECT employeeId, firstName, lastName, preferredName, email, alergies, status, isWaitingList FROM jay_employees WHERE employeeId=? LIMIT 1', [credentials.empId]);

        return empRow[0];
    } catch(err) {
        return h.response({ success: false, err }).code(400);
    }
};

exports.cancelRsvp = async (request, h) => {
    const pool = request.mysql.pool;
    const credentials = request.auth.credentials;

    try {
        const [empRows, empFields] = await pool.query('UPDATE jay_employees SET status=0, rsvpDateTime=NOW() WHERE employeeId=? LIMIT 1', [credentials.empId]);

        return { success: true };
    } catch(err) {
        return h.response({ success: false, err }).code(400);
    }
};
