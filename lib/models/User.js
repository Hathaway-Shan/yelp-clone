const pool = require('../utils/pool');

module.exports = class User {
  id;
  username;
  email;
  #passwordHash;

  constructor(row) {
    this.id = row.id;
    this.username = row.username;
    this.email = row.email;
    this.#passwordHash = row.password_hash;
  }
  static async getByEmail(email) {
    const { rows } = await pool.query(
      `
      SELECT *
      FROM users
      WHERE email = $1
      `,
      [email]
    );
    if (!rows[0]) return null;
    return new User(rows[0]);
  }
  get passwordHash() {
    return this.#passwordHash;
  }
};
