DROP TABLE IF EXISTS childrens_employees;
CREATE TABLE childrens_employees (
    employeeId  INT(6)          NOT NULL    UNIQUE,
    firstName   VARCHAR(32)     NOT NULL,
    lastName    VARCHAR(32)     NOT NULL,
    email       VARCHAR(128)    NOT NULL,
    isAdmin     INT(1)          NOT NULL    DEFAULT 0
);

DROP TABLE IF EXISTS childrens_rsvp;
CREATE TABLE childrens_rsvp (
    employeeId      INT(6)      NOT NULL    UNIQUE,
    status          INT(1)      NOT NULL,
    timeslot        INT(1)      NOT NULL,
    spouseName      VARCHAR(64),
    rsvpDateTime    DATETIME,
    updateDateTime  DATETIME
);

DROP TABLE IF EXISTS childrens_children;
CREATE TABLE childrens_children (
    id              INT                     NOT NULL        AUTO_INCREMENT      UNIQUE,
    employeeId      INT(6)                  NOT NULL,
    name            VARCHAR(64)             NOT NULL,
    age             INT(2)                  NOT NULL,
    gender          ENUM('male', 'female')  NOT NULL
);




DROP TABLE IF EXISTS employees;
CREATE TABLE employees (
    employeeId  INT(6)          NOT NULL    UNIQUE,
    firstName   VARCHAR(32)     NOT NULL,
    lastName    VARCHAR(32)     NOT NULL,
    email       VARCHAR(128)    NOT NULL,
    isAdmin     INT(1)          NOT NULL    DEFAULT 0
);

DROP TABLE IF EXISTS rsvp;
CREATE TABLE rsvp (
    employeeId      INT(6)      NOT NULL    UNIQUE,
    status          INT(1)      NOT NULL,
    guestName       VARCHAR(64),
    guestEmployeeId INT(6),
    dietary         TEXT,
    assistance      MEDIUMTEXT,
    rsvpDateTime    DATETIME,
    updateDateTime  DATETIME
);
