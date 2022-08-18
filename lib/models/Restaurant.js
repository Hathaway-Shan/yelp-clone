const pool = require('../utils/pool');

module.exports = class Restaurant {
  id;
  name;

  constructor(row) {
    this.id = row.id;
    this.name = row.name;
    if (row.reviews) this.reviews = row.reviews.length > 0 ? row.reviews : [];
  }
  static async getAll() {
    const { rows } = await pool.query('SELECT * FROM restaurants');
    return rows.map((row) => new Restaurant(row));
  }
  static async getById(id) {
    const { rows } = await pool.query(
      `
      SELECT restaurants.*,
      COALESCE(
        json_agg(json_build_object('stars', restaurants_users.stars, 'reviews', restaurants_users.reviews))
        FILTER (WHERE restaurants_users IS NOT NULL), '[]'
      ) AS reviews
      FROM restaurants
      JOIN restaurants_users ON restaurants.id = restaurants_users.restaurant_id
      JOIN users ON restaurants_users.user_id = users.id
      WHERE restaurants.id = $1
      GROUP BY restaurants.id
      `,
      [id]
    );

    if (!rows[0]) return null;
    return new Restaurant(rows[0]);
  }
  static async insert({ restaurant_id, user_id, stars, reviews }) {
    const { rows } = await pool.query(
      `
    INSERT INTO restaurants_users
    (restaurant_id, user_id, stars, reviews)
    VALUES ($1, $2, $3, $4)
    RETURNING *`,
      [restaurant_id, user_id, stars, reviews]
    );
    return rows[0];
  }
  static async deleteReview(id) {
    const { rows } = await pool.query(
      `
    DELETE FROM restaurants_users
    WHERE id = $1
    RETURNING *`,
      [id]
    );
    return rows[0];
  }
};
