// Import the mysql2/promise module
const mysql = require('mysql2/promise');
// Load environment variables from .env file
require('dotenv').config();

// Create a connection pool with the database configuration
const pool = mysql.createPool({
  host: process.env.DB_HOST, // Database host
  user: process.env.DB_USER, // Database user
  password: process.env.DB_PASSWORD, // Database password
  database: process.env.DB_NAME, // Database name
  port: process.env.DB_PORT, // Database port
  timezone: '+05:30', // Database timezone
  ssl: {
    rejectUnauthorized: false // Allow self-signed certificates
  }
});

// Export the connection pool
module.exports = pool;