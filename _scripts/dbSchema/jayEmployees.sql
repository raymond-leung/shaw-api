DROP TABLE IF EXISTS jay_employees;
CREATE TABLE jay_employees (
    employeeId      INT(6)          NOT NULL    UNIQUE,
    firstName       VARCHAR(32)     NOT NULL,
    lastName        VARCHAR(32)     NOT NULL,
    preferredName   VARCHAR(32)     NOT NULL,
    tenure          FLOAT,
    title           VARCHAR(64),
    department      VARCHAR(64),
    location        VARCHAR(64),
    email           VARCHAR(128)    NOT NULL,
    manager         VARCHAR(64),
    over19          INT(1),
    vp              VARCHAR(64),
    alergies        VARCHAR(128),
    status          INT(1),
    isWaitingList   INT(1),
    rsvpDateTime    DATETIME,
    isAdmin         INT(1)
);
