const con = require('./connection');

// User role:
//   # 1 - Admin
//   # 2 - Recruiter
//   # 3 - Candidate

class User {
  static init() {
    const createUserTableQuery = `CREATE TABLE IF NOT EXISTS User(
      uid INT NOT NULL UNIQUE,
      name VARCHAR(255) NOT NULL,
      mobile BIGINT NOT NULL,
      role INT NOT NULL,
      address VARCHAR(600) NOT NULL,
      FOREIGN KEY (uid) REFERENCES Account(uid)
    )`;
    con.query(createUserTableQuery, (error) => {
      if (error) throw error;
    });
    return true;
  }

  static async create(userData) {
    const query = `INSERT INTO User (uid, name, mobile, role, address) 
      VALUES (
        '${userData.uid}',
        '${userData.name}', 
        '${userData.mobile}',
        '${userData.role}',
        '${userData.address}'
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
    const query = `SELECT * FROM User
    WHERE uid = '${uid}'`;
    const user = await new Promise((resolve) => {
      con.query(query, (error, result) => {
        if (error) throw error;
        // id = result.insertId;
        resolve(result[0]);
      });
    });
    return user;
  }
}

module.exports = User;
