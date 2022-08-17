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
      SELECT
      restaurants.name, 
      COALESCE(
        json_agg(to_jsonb(reviews))
        FILTER (WHERE restaurants_users.id IS NOT NULL), '[]'
    ) as reviews 
    from restaurants
    LEFT JOIN restaurants_users on restaurants.id = restaurants_users.restaurant_id
    LEFT JOIN users on users.id = restaurants_users.user_id
    WHERE restaurants.id = $1
    GROUP BY restaurants.id
      `,
      [id]
    );

    if (!rows[0]) return null;
    return new Restaurant(rows[0]);
  }
  static async insert({ restaurant_id, user_id, reviews }) {
    const { rows } = await pool.query(
      `
    INSERT INTO restaurants_users
    (restaurant_id, user_id, reviews)
    VALUES ($1, $2, $3)
    RETURNING *`,
      [restaurant_id, user_id, reviews]
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
