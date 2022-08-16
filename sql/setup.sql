-- Use this file to define your SQL tables
-- The SQL in this file will be executed when you run `npm run setup-db`
DROP TABLE IF EXISTS restaurants_users;
DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS restaurants;


CREATE TABLE users (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  username TEXT NOT NULL,
  email VARCHAR NOT NULL UNIQUE, 
  password_hash VARCHAR
);

CREATE TABLE restaurants (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  name TEXT NOT NULL
);

CREATE TABLE restaurants_users (
  id BIGINT GENERATED ALWAYS AS IDENTITY,
  reviews VARCHAR(255),
  user_id BIGINT,
  restaurant_id BIGINT, 
  FOREIGN KEY (user_id) REFERENCES users(id),
  FOREIGN KEY (restaurant_id) REFERENCES restaurants(id)
);

insert into users (
  username, email
)
values
('example1', 'example1@example.com'),
('example2', 'example2@example.com');

insert into restaurants (
  name
)
values
('Mama Magliones'),
('Lings Palace'),
('Schmegelmans Deli');

insert into restaurants_users (
  user_id, restaurant_id, reviews
)
values
(1, 1, 'Its not just a frozen lasagne, its a Mama Maglione!'),
(2, 3, 'Good soup, terrible service.'),
(1, 2, 'Its fine. Its just fine.');
