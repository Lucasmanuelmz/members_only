const {Pool} = require('pg');
require('dotenv').config()

const USER = process.env.USER_ROLE;
const PASSWORD = process.env.USER_PASSWORD;
const DATABASE = process.env.DB_NAME;
const DEFAULT_PORT = process.env.DB_PORT;

const database = new Pool({
  host: 'localhost',
  user: USER,
  password: PASSWORD,
  database: DATABASE,
  port: DEFAULT_PORT
});

module.exports = database;