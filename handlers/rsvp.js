'use strict';

exports.rsvp = async (request, h) => {
    const pool = request.mysql.pool;
    const credentials = request.auth.credentials;

    if(request.payload.status === undefined || !request.payload.lastName || !request.payload.email) {
        return h.response({ success: false, err: 'Invalid parameters' }).code(400);
    }

    try {
        //Check to see if employeeId is already attending on their own
        const [alreadyAttendingRow, alreadyAttendingFields] = await pool.query("SELECT COUNT(*) AS cnt FROM rsvp WHERE status=1 AND employeeId=? LIMIT 1", [request.payload.guestEmployeeId]);

        if(alreadyAttendingRow[0] && alreadyAttendingRow[0].cnt) {
            return h.response({ success: false, err: { message: "Guest already RSVP'd on their own"}, code: 1 }).code(409);
        }

        //Check to see if employeeId is attending as someone else's guest
        const [someonesGuestRow, someonesGuestFields] = await pool.query("SELECT COUNT(*) AS cnt FROM rsvp WHERE status=1 AND employeeId <> ? AND guestEmployeeId=? LIMIT 1", [credentials.empId, request.payload.guestEmployeeId]);

        if(someonesGuestRow && someonesGuestRow[0].cnt) {
            return h.response({ success: false, err: { message: "Guest already attending with another employee" }, code: 2 }).code(409);
        }

        const [rsvpRows, rsvpFields] = await pool.query('INSERT INTO rsvp (employeeId, status, guestName, guestEmployeeId, dietary, assistance, rsvpDateTime) VALUES (?, ?, ?, ?, ?, ?, NOW()) ON DUPLICATE KEY UPDATE status=?, guestName=?, guestEmployeeId=?, dietary=?, assistance=?, updateDateTime=NOW()', [credentials.empId, request.payload.status, request.payload.guestName, request.payload.guestEmployeeId, request.payload.dietary, request.payload.assistance, request.payload.status, request.payload.guestName, request.payload.guestEmployeeId, request.payload.dietary, request.payload.assistance]);

        const [updateRows, updateFields] = await pool.query('UPDATE employees SET firstName=?, lastName=?, email=? WHERE employeeId=?  LIMIT 1', [request.payload.firstName, request.payload.lastName, request.payload.email, credentials.empId]);

        return { success: true };
    } catch(err) {
        request.logger.error(`Erorr setting rsvp: ${err}`);
        return h.response({ success: false, err }).code(400);
    }
};

exports.getRsvp = async (request, h) => {
    const pool = request.mysql.pool;
    const credentials = request.auth.credentials;

    try {
        const [isGuestRow, isGuestFields] = await pool.query('SELECT e.employeeId, e.firstName, e.lastName, e.email, r.status, r.guestName, r.guestEmployeeId, r.dietary, r.assistance FROM employees e LEFT JOIN rsvp r ON e.employeeId=r.employeeId WHERE r.status=1 AND r.guestEmployeeId=? LIMIT 1', [credentials.empId]);
        if(isGuestRow[0]) {
            return h.response({ success: false, err: { message: `Attending as guest of ${isGuestRow[0].firstName} ${isGuestRow[0].lastName} (${isGuestRow[0].employeeId})`} }).code(409);
        }

        const [empRow, empFields] = await pool.query('SELECT e.employeeId, e.firstName, e.lastName, e.email, r.status, r.guestName, r.guestEmployeeId, r.dietary, r.assistance FROM employees e LEFT JOIN rsvp r ON e.employeeId=r.employeeId WHERE e.employeeId=? LIMIT 1', [credentials.empId]);
        return empRow[0];
    } catch(err) {
        return h.response({ success: false, err }).code(400);
    }
};

exports.cancelRsvp = async (request, h) => {
    const pool = request.mysql.pool;
    const credentials = request.auth.credentials;

    try {
        const [empRows, empFields] = await pool.query('UPDATE rsvp SET status=0, updateDateTime=NOW() WHERE employeeId=? LIMIT 1', [credentials.empId]);

        return { success: true };
    } catch(err) {
        return h.response({ success: false, err }).code(400);
    }
};
