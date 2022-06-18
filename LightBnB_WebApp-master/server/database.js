/* eslint-disable camelcase */
const properties = require('./json/properties.json');
const users = require('./json/users.json');

// Connection to database
const { Pool } = require('pg');

const connectDb = {
  user: 'mariannebourcier',
  password: '123',
  host: 'localhost',
  database: 'lightbnb'
};

const pool = new Pool(connectDb);

pool.query(`SELECT * FROM properties LIMIT 1;`).then((res) => {
  console.log("Connection success!");
});

/// Users
   
/**
 * Get a single user from the database given their email.
 * @param {String} email The email of the user.
 * @return {Promise<{}>} A promise to the user.
 */
const getUserWithEmail = function(email) {

  const emailQuery = (`SELECT * FROM users WHERE email = $1 `);
  const queryParams = [email];

  return pool
    .query(emailQuery, queryParams)
    .then((result) => result.rows[0])
    .catch((err) => err.message);
};

exports.getUserWithEmail = getUserWithEmail;

/**
 * Get a single user from the database given their id.
 * @param {string} id The id of the user.
 * @return {Promise<{}>} A promise to the user.
 */
const getUserWithId = function(id) {

  const idQuery = (`SELECT * FROM users WHERE id = $1 `);
  const queryParams = [id];

  return pool
    .query(idQuery, queryParams)
    .then((result) => result.rows[0])
    .catch((err) => err.message);
};
exports.getUserWithId = getUserWithId;


/**
 * Add a new user to the database.
 * @param {{name: string, password: string, email: string}} user
 * @return {Promise<{}>} A promise to the user.
 */
const addUser = function(user) {

  const { name, email, password } = user;
  const userQuery = (`INSERT INTO users
  (name, email, password)
  VALUES ($1, $2, $3)
  RETURNING *;`);
  const queryParams = [name, email, password];

  return pool
    .query(userQuery, queryParams)
    .then((result) => result.rows[0])
    .catch((err) => err.message);
};

exports.addUser = addUser;

/// Reservations

/**
 * Get all reservations for a single user.
 * @param {string} guest_id The id of the user.
 * @return {Promise<[{}]>} A promise to the reservations.
 */
const getAllReservations = function(guest_id, limit = 10) {

  const resQuery = (`SELECT reservations.*, properties.*, AVG(property_reviews.rating) AS average_rating
  FROM reservations
  JOIN properties ON properties.id = reservations.property_id
  JOIN property_reviews ON properties.id = property_reviews.property_id
  WHERE reservations.guest_id = $1 AND reservations.end_date < now()::date
  GROUP BY properties.id, reservations.id
  ORDER BY reservations.start_date
  LIMIT $2;`);
  const queryParams = [guest_id, limit];

  return pool
    .query(resQuery, queryParams)
    .then((result) => result.rows)
    .catch((err) => err.message);
};

exports.getAllReservations = getAllReservations;

/// Properties

/**
 * Get all properties.
 * @param {{}} options An object containing query options.
 * @param {*} limit The number of results to return.
 * @return {Promise<[{}]>}  A promise to the properties.
 */
const getAllProperties = (options, limit = 10) => {

  let queryString = `
  SELECT properties.*, AVG(property_reviews.rating) AS average_rating
  FROM properties
  JOIN property_reviews ON property_reviews.property_id = properties.id
  `;

  let queryParams = [];


  //City option
  if (options.city) {
    queryParams.push(`%${options.city}%`);
    queryString += `WHERE city LIKE $${queryParams.length}`;
  }

  //Owner ID option
  if (options.owner_id) {
    const op = queryParams.length > 0 ? 'AND' : 'WHERE';
    queryParams.push(options.owner_id);
    queryString += `${op} owner_id = $${queryParams.length}`;
  }

  //Min/Max price option
  if (options.minimum_price_per_night && options.maximum_price_per_night) {
    const op = queryParams.length > 0 ? 'AND' : 'WHERE';
    queryParams.push(
      //Convert from cent to dollar amount
      options.minimum_price_per_night * 100,
      options.maximum_price_per_night * 100
    );
    queryString += `${op} cost_per_night >= $${queryParams.length - 1} AND cost_per_night <= $${queryParams.length} `;
  }

  //Min rating option
  if (options.minimum_rating) {
    const op = queryParams.length > 0 ? 'AND' : 'WHERE';
    queryParams.push(options.minimum_rating);
    queryString += `${op} rating >= $${queryParams.length}`;
  }


  //Before sending query
  queryParams.push(limit);
  queryString += `
  GROUP BY properties.id
  ORDER BY cost_per_night
  LIMIT $${queryParams.length};
  `;

  console.log(queryString, queryParams);

  //Sending query
  return pool
    .query(queryString, queryParams)
    .then((res) => res.rows)
    .catch((err) => err.message);
};

exports.getAllProperties = getAllProperties;


/**
 * Add a property to the database
 * @param {{}} property An object containing all of the property details.
 * @return {Promise<{}>} A promise to the property.
 */
const addProperty = function(property) {

  const propQuery = (`INSERT INTO properties
  (owner_id, title, description, thumbnail_photo_url, cover_photo_url, cost_per_night, street, city, province, post_code, country, parking_spaces, number_of_bathrooms, number_of_bedrooms)
  VALUES 
  ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, TRUE)
  RETURNING *;`);

  let queryParams = [];
  //Loop to return all properties
  for (let prop in property) propQuery.push(property[prop]);

  return pool
    .query(propQuery, queryParams)
    .then((result) => result.rows[0])
    .catch((err) => err.message);
};

exports.addProperty = addProperty;
