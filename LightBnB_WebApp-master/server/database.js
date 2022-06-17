/* eslint-disable camelcase */
const properties = require('./json/properties.json');
const users = require('./json/users.json');

// Connection
const { Pool } = require('pg');

const connectDb = {
  user: 'mariannebourcier',
  password: '123',
  host: 'localhost',
  database: 'lightbnb'
};

const pool = new Pool(connectDb);

pool.query(`SELECT title FROM properties LIMIT 10;`).then(response => {
  console.log(response);
});

/// Users

/**
 * Get a single user from the database given their email.
 * @param {String} email The email of the user.
 * @return {Promise<{}>} A promise to the user.
 */
const getUserWithEmail = function(email) {

  const emailQuery = (`SELECT * FROM users WHERE email = $1 `);
  //null if user doesnt exist?
  return pool
    .query(
      emailQuery,
      [email])
    .then((result) => {
      return result.rows;
    })
    .catch((err) => {
      return err.message;
    });
};

exports.getUserWithEmail = getUserWithEmail;

/**
 * Get a single user from the database given their id.
 * @param {string} id The id of the user.
 * @return {Promise<{}>} A promise to the user.
 */
const getUserWithId = function(id) {

  const idQuery = (`SELECT * FROM users WHERE id = $1 `);

  return pool
    .query(
      idQuery,
      [id])
    .then((result) => {
      console.log(result.rows);
      return result.rows;
    })
    .catch((err) => {
      return err.message;
    });
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

  return pool
    .query(
      userQuery,
      [name, email, password]
    )
    .then((result) => {
      return result.rows[0];
    })
    .catch((err) => {
      return err.message;
    });
};
exports.addUser = addUser;

/// Reservations

/**
 * Get all reservations for a single user.
 * @param {string} guest_id The id of the user.
 * @return {Promise<[{}]>} A promise to the reservations.
 */
const getAllReservations = function(guest_id, limit = 10) {
  // return getAllProperties(null, 2);
  const resQuery = (`SELECT reservations.*, properties.*, , avg(property_reviews.rating) AS average_rating
  FROM reservations
  JOIN properties ON reservations.property_id = properties.id
  JOIN property_reviews ON properties.id = property_reviews.property_id
  WHERE reservations.guest_id = $1
  GROUP BY properties.id, reservations.id
  ORDER BY start_date
  LIMIT $2;`);

  return pool
    //query
    .query(
      resQuery,
      [guest_id, limit])
    .then((result) => {
      return result.rows;
    }
    )
    .catch((err) => {
      return err.message;
    }
    );
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

  const queryParams = [];
  let and = ' AND ';
  let having = ' HAVING ';
  // 2
  let queryString = `
  SELECT properties.*, avg(property_reviews.rating) as average_rating
  FROM properties
  JOIN property_reviews ON properties.id = property_id
  `;

  // 3
  if (options.city) {
    queryParams.push(`%${options.city}%`);
    queryString += `WHERE city LIKE $${queryParams.length} `;
  }

  //owner id
  if (options.owner_id) {
    queryParams.push(parseInt(options.owner_id));
    queryString += `properties.owner_id = $${queryParams.length}`;
  }

  //min price/night max
  if (options.minimum_price_per_night && options.maximum_price_per_night) {
    queryParams.push(
      //dollar amt
      options.minimum_price_per_night * 100,
      options.maximum_price_per_night * 100
    );
    const minMaxCost = `properties.cost_per_night >= $${queryParams.length - 1}
    AND properties.cost_per_night <= $${queryParams.length}`;
    if (having.length > 7) having += and + `${minMaxCost}`;
    else having += `${minMaxCost}`;
  }

  //min rating
  if (options.minimum_rating) {
    queryParams.push(parseInt(options.minimum_rating));
    const rating = `AVG(property_reviews.rating) >= $${queryParams.length}`;
    if (having.length > 7) having += and + `${rating}`;
    else having += `${rating}`;
  }

  if (having.length > 7) {
    queryString += having;
  }
  // 4
  queryParams.push(limit);
  queryString += `
  ORDER BY properties.cost_per_night
  LIMIT $${queryParams.length};
  `;

  // // 5
  // console.log(queryString, queryParams);

  // 6
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
  // const propertyId = Object.keys(properties).length + 1;
  // property.id = propertyId;
  // properties[propertyId] = property;
  // return Promise.resolve(property);
  const propQuery = (`INSERT INTO properties
  (owner_id, title, description, thumbnail_photo_url, cover_photo_url, cost_per_night, street, city, province, post_code, country, parking_spaces, number_of_bathrooms, number_of_bedrooms)
  VALUES 
  ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, TRUE)
  RETURNING *;`);

  let propObj = [];
  //loop thru all properties
  for (let prop in property) {
    propObj = property[prop];
  }

  return pool
    .query(
      propQuery,
      propObj
    )
    .then((result) => {
      return result.rows[0];
    })
    .catch((err) => {
      return err.message;
    });
};
exports.addProperty = addProperty;
