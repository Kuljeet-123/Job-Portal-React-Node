const con = require('./connection');

// Recruiter status: -- 0 - no action yet, 1 - accepted, 2 - rejected,  3 - suspended
class Recruiter {
  static init() {
    const createRecruiterTableQuery = `CREATE TABLE IF NOT EXISTS Recruiter(
      uid INT NOT NULL UNIQUE,
      position VARCHAR(255) NOT NULL,
      status INT NOT NULL,
      company VARCHAR(255) NOT NULL,
      FOREIGN KEY (uid) REFERENCES Account(uid)
    )`;
    con.query(createRecruiterTableQuery, (error) => {
      if (error) throw error;
    });
    return true;
  }

  static async create(recruiterData) {
    const query = `INSERT INTO Recruiter (uid, position, status, company) 
      VALUES (
        '${recruiterData.uid}', 
        '${recruiterData.position}',
        '${recruiterData.status}',
        '${recruiterData.company}'
      )
    `;

    const success = await new Promise((resolve) => {
      con.query(query, (error) => {
        if (error) throw error;
        // id = result.insertId;
        resolve(true);
      });
    });
    return success;
  }

  static async findById(uid) {
    const query = `SELECT * FROM Recruiter
    WHERE uid = '${uid}'`;
    const recruiter = await new Promise((resolve) => {
      con.query(query, (error, result) => {
        if (error) throw error;
        // id = result.insertId;
        resolve(result[0]);
      });
    });
    return recruiter;
  }

  static async findAll() {
    const query = 'SELECT * FROM Recruiter';
    const recruiters = await new Promise((resolve) => {
      con.query(query, (error, result) => {
        if (error) throw error;
        // id = result.insertId;
        resolve(result);
      });
    });
    return recruiters;
  }

  static async findNew() {
    const query = `SELECT * FROM Recruiter WHERE status='${0}'`;
    const recruiters = await new Promise((resolve) => {
      con.query(query, (error, result) => {
        if (error) throw error;
        // id = result.insertId;
        resolve(result);
      });
    });
    return recruiters;
  }

  static async updateStatusWithId(uid, newStatus) {
    const query = `UPDATE Recruiter
    SET status='${newStatus}' 
    WHERE uid = '${uid}'`;
    const isSuccess = await new Promise((resolve) => {
      con.query(query, (error) => {
        if (error) throw error;
        // id = result.insertId;
        resolve(true);
      });
    });
    return isSuccess;
  }
}

module.exports = Recruiter;
