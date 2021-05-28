const con = require('./connection');

// status --- 0 - applied, 1 - accepted, 2 - rejected

class Application {
  static init() {
    const createApplicationTableQuery = `CREATE TABLE IF NOT EXISTS Application(
      id INT AUTO_INCREMENT NOT NULL,
      jid INT NOT NULL,
      uid INT NOT NULL,
      status INT NOT NULL,
      message VARCHAR(1200),
      PRIMARY KEY (id),
      FOREIGN KEY (uid) REFERENCES Account(uid),
      FOREIGN KEY (jid) REFERENCES Job(jid)
    )`;
    con.query(createApplicationTableQuery, (error) => {
      if (error) throw error;
    });
    return true;
  }

  static async create(applicationData) {
    const query = `INSERT INTO Application (jid, uid, status, message) 
      VALUES (
        '${applicationData.jid}', 
        '${applicationData.uid}',
        '${applicationData.status}',
        '${applicationData.message}'
      )
    `;

    const applicationId = await new Promise((resolve) => {
      con.query(query, (error, result) => {
        if (error) throw error;
        // id = result.insertId;
        resolve(result.insertId);
      });
    });
    return applicationId;
  }


  static async find(uid, jid) {
    const query = `SELECT * FROM Application
    WHERE jid='${jid}' AND uid='${uid}'`;
    const application = await new Promise((resolve) => {
      con.query(query, (error, result) => {
        if (error) throw error;
        resolve(result[0]);
      });
    });
    return application;
  }


  static async findById(id) {
    const query = `SELECT * FROM Application
    WHERE id='${id}'`;
    const applications = await new Promise((resolve) => {
      con.query(query, (error, result) => {
        if (error) throw error;
        resolve(result[0]);
      });
    });
    return applications;
  }

  static async findByJid(jid) {
    const query = `SELECT * FROM Application
    WHERE jid='${jid}'`;
    const applications = await new Promise((resolve) => {
      con.query(query, (error, result) => {
        if (error) throw error;
        resolve(result);
      });
    });
    return applications;
  }


  static async findByUid(uid) {
    const query = `SELECT * FROM Application
    WHERE uid='${uid}'`;
    const applications = await new Promise((resolve) => {
      con.query(query, (error, result) => {
        if (error) throw error;
        resolve(result);
      });
    });
    return applications;
  }


  static async updateStatus(id, status, message) {
    const query = `UPDATE Application
    SET status = '${status}', message='${message}'
    WHERE id='${id}'`;
    const success = await new Promise((resolve) => {
      con.query(query, (error) => {
        if (error) throw error;
        resolve(true);
      });
    });
    return success;
  }

  static async findInterviews(uid) {
    const query = `SELECT * FROM Application
    WHERE uid='${uid}' AND status='${1}'`;
    const interviews = await new Promise((resolve) => {
      con.query(query, (error, result) => {
        if (error) throw error;
        resolve(result);
      });
    });
    return interviews;
  }
}

module.exports = Application;
