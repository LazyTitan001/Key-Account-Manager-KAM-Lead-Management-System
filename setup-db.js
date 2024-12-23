const mysql = require('mysql2/promise');
require('dotenv').config();

async function setupDatabase() {
    const connection = await mysql.createConnection({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        port: process.env.DB_PORT,
    });

    // Create database
    await connection.query('CREATE DATABASE IF NOT EXISTS lead_management');
    await connection.query('USE lead_management');

    // Create tables
    await connection.query(`
        CREATE TABLE IF NOT EXISTS leads (
            id INT PRIMARY KEY AUTO_INCREMENT,
            restaurant_name VARCHAR(255) NOT NULL,
            address TEXT,
            contact_number VARCHAR(20),
            status ENUM('New', 'Active', 'Inactive') DEFAULT 'New',
            assigned_kam VARCHAR(255),
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
        )
    `);

    await connection.query(`
        CREATE TABLE IF NOT EXISTS contacts (
            id INT PRIMARY KEY AUTO_INCREMENT,
            lead_id INT,
            name VARCHAR(255) NOT NULL,
            role VARCHAR(100),
            phone_number VARCHAR(20),
            email VARCHAR(255),
            FOREIGN KEY (lead_id) REFERENCES leads(id),
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    `);

    await connection.query(`
        CREATE TABLE IF NOT EXISTS interactions (
            id INT PRIMARY KEY AUTO_INCREMENT,
            lead_id INT,
            interaction_date DATE,
            interaction_type ENUM('Call', 'Visit', 'Order'),
            notes TEXT,
            follow_up_required BOOLEAN DEFAULT FALSE,
            FOREIGN KEY (lead_id) REFERENCES leads(id),
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    `);

    console.log('Database and tables created successfully');
    await connection.end();
}

setupDatabase().catch(console.error);