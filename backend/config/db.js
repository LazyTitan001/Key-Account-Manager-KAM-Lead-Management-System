const mysql = require('mysql2/promise');
require('dotenv').config();

const db = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: 'lead_management',
  port: process.env.DB_PORT,
  timezone: '+05:30' 
});

module.exports = db;
