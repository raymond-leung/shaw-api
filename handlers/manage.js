'use strict';

exports.list = async (request, h) => {
    const pool = request.mysql.pool;
    const status = request.params.status;

    try {
        if(status === null || status === 'null') {
            const [notRespondedRows, notRespondedFields] = await pool.query('SELECT employeeId, firstName, lastName, preferredName, tenure, title, department, location, email, manager, over19, vp, status, isWaitingList, rsvpDateTime, alergies FROM jay_employees WHERE status IS NULL ORDER BY firstName ASC, lastName ASC');

            return notRespondedRows;
        } else {
            const [rsvpRows, rsvpFields] = await pool.query('SELECT employeeId, firstName, lastName, preferredName, tenure, title, department, location, email, manager, over19, vp, status, isWaitingList, rsvpDateTime, alergies FROM jay_employees WHERE status=? ORDER BY firstName ASC, lastName ASC', [status]);
console.log('rsvpRows: ', rsvpRows);
            return rsvpRows;
        }
    } catch(err) {
        return h.response({ success: false, err }).code(400);
    }
};

exports.getEmployee = async (request, h) => {
    const pool = request.mysql.pool;
    const searchTerm = request.params.searchTerm;

    try {
        let searchRows = [];
        let searchFields = [];
        if(Number.isInteger(parseInt(searchTerm))) {
            [searchRows, searchFields] = await pool.query('SELECT employeeId, firstName, lastName, preferredName, tenure, title, department, location, email, manager, over19, vp, status, isWaitingList, rsvpDateTime, alergies FROM jay_employees WHERE employeeId=? ORDER BY firstName ASC, lastName ASC', [searchTerm]);
        } else {
            [searchRows, searchFields] = await pool.query('SELECT employeeId, firstName, lastName, preferredName, tenure, title, department, location, email, manager, over19, vp, status, isWaitingList, rsvpDateTime, alergies FROM jay_employees WHERE lastName=? ORDER BY firstName ASC, lastName ASC', [searchTerm]);
        }

        return searchRows;
    } catch(err) {
         return h.response({ success: false, err }).code(400);
    };
}

exports.updateEmployee = async(request, h) => {
    const pool = request.mysql.pool;
    const employeeId = request.params.employeeId;

    request.payload.guestEmployeeId = request.guestEmployeeId || null;

    try {
        const [rsvpRows, rsvpFields] = await pool.query('INSERT INTO rsvp (employeeId, status, guestName, guestEmployeeId, dietary, assistance, rsvpDateTime) VALUES (?, ?, ?, ?, ?, ?, NOW()) ON DUPLICATE KEY UPDATE status=?, guestName=?, guestEmployeeId=?, dietary=?, assistance=?, updateDateTime=NOW()', [employeeId, request.payload.status, request.payload.guestName, request.payload.guestEmployeeId, request.payload.dietary, request.payload.assistance, request.payload.status, request.payload.guestName, request.payload.guestEmployeeId, request.payload.dietary, request.payload.assistance]);

        const [updateRows, updateFields] = await pool.query('UPDATE employees SET firstName=?, lastName=?, email=? WHERE employeeId=?  LIMIT 1', [request.payload.firstName, request.payload.lastName, request.payload.email, employeeId]);

        return { success: true };
    } catch(err) {
        return h.response({ success: false, err }).code(400)
    }
};

exports.addEmployee = async (request, h) => {
    const pool = request.mysql.pool;

    try {
        const [addRows, addFields] = await pool.query("INSERT INTO jay_employees (employeeId, firstName, lastName, preferredName, tenure, title, department, location, email, manager, over19, vp) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)", [request.payload.employeeId, request.payload.firstName, request.payload.lastName, request.payload.preferredName, request.payload.tenure, request.payload.title, request.payload.department, request.payload.location, request.payload.email, request.payload.manager, request.payload.over19, request.payload.vp]);

        return addRows;
    } catch(err) {
        return h.response({ success:false, err }).code(400);
    }

    return {};
};

exports.getCounts = async (request, h) => {
    const pool = request.mysql.pool;

    try {
        const promiseArray = [];
        promiseArray.push(
            pool.query("SELECT COUNT(*) AS cnt FROM jay_employees WHERE status IS NULL")
        );
        promiseArray.push(
            pool.query("SELECT COUNT(*) AS cnt FROM jay_employees WHERE status = 0")
        );
        promiseArray.push(
            pool.query("SELECT COUNT(*) AS cnt FROM jay_employees WHERE status = 1 AND isWaitingList = 0")
        );
        promiseArray.push(
            pool.query("SELECT COUNT(*) AS cnt FROM jay_employees WHERE status = 2")
        );
        promiseArray.push(
            pool.query("SELECT COUNT(*) AS cnt FROM jay_employees WHERE status = 1 AND isWaitingList = 1")
        );
        
        return Promise.all(promiseArray)
            .then((response) => {
                const notRespondedRows = response[0][0][0];
                const cancelledRows = response[1][0][0];
                const attendingRows = response[2][0][0];
                const notAttendingRows = response[3][0][0];
                const waitingList = response[4][0][0];

                const returnObj = {
                    notResponded: notRespondedRows.cnt,
                    cancelled: cancelledRows.cnt,
                    attending: attendingRows.cnt,
                    notAttending: notAttendingRows.cnt,
                    waitingList: waitingList.cnt
                };

                return returnObj;
            })
            .catch((err) => {
                return h.response({ success:false, err }).code(400);
            })
    } catch(err) {
    }    
};
