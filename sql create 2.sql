use ktp;
CREATE TABLE IF NOT EXISTS ktp_all (
    id int AUTO_INCREMENT PRIMARY KEY,
    temperature1 int NOT NULL DEFAULT -300,
    temperature2 int NOT NULL DEFAULT -300,
    temperature3 int NOT NULL DEFAULT -300,
    temperature4 int NOT NULL DEFAULT -300,
    date_time TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO ktp_all (temperature1,temperature2,temperature3,temperature4)
VALUES (0,1,2,3),
       (10,11,12,13),
       (20,21,22,23),
       (30,31,32,33),
       (40,41,42,43),
       (50,51,52,53),
       (60,62,62.63),
       (70,71,72,73);