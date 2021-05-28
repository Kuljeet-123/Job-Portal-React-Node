const con = require('./connection');

class Account {
  static init() {
    const createAccountTableQuery = `CREATE TABLE IF NOT EXISTS Account(
      uid INT AUTO_INCREMENT NOT NULL,
      email VARCHAR(255) NOT NULL UNIQUE,
      password VARCHAR(255) NOT NULL,
      token VARCHAR(16) NOT NULL UNIQUE,
      PRIMARY KEY(uid)
    )`;
    con.query(createAccountTableQuery, (error) => {
      if (error) throw error;
    });
    return true;
  }

  static async create(accountData) {
    const query = `INSERT INTO Account (email, password, token) 
      VALUES (
        '${accountData.email}', 
        '${accountData.password}',
        '${accountData.token}'
        )
    `;
    const uid = await new Promise((resolve) => {
      con.query(query, (error, result) => {
        if (error) throw error;
        // id = result.insertId;
        resolve(result.insertId);
      });
    });
    return uid;
  }

  static async findOneWithToken(token) {
    const query = `SELECT * from Account
        WHERE token = '${token}'
      `;
    const user = await new Promise((resolve) => {
      con.query(query, (error, result) => {
        if (error) throw error;
        // id = result.insertId;
        resolve(result[0]);
      });
    });
    return user;
  }

  static async findOne(email) {
    const query = `SELECT * FROM Account
    WHERE email = '${email}'`;
    const user = await new Promise((resolve) => {
      con.query(query, (error, result) => {
        if (error) throw error;
        // id = result.insertId;
        resolve(result[0]);
      });
    });
    return user;
  }

  static async setToken(uid, token) {
    const query = `UPDATE Account
    SET token='${token}'
    WHERE uid='${uid}'
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
}

module.exports = Account;
