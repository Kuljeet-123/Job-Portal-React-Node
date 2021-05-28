const bcrypt = require('bcrypt');

class Auth {
  static async getHash(plainPassword) {
    const saltRound = 10;
    const hash = await bcrypt.hash(plainPassword, saltRound);
    return hash;
  }

  static async isPasswordValid(plainPassword, hash) {
    const isValid = await bcrypt.compare(plainPassword, hash);
    return isValid;
  }
}

module.exports = Auth;
