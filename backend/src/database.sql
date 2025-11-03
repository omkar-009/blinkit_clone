-- user table
CREATE TABLE IF NOT EXISTS users (
    user_id INT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    contact_number VARCHAR(15),
    password_hash VARCHAR(255) NOT NULL,
    password VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create the tokens table
SET SESSION sql_mode = '';
CREATE TABLE tokens (
    token_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    username VARCHAR(50) NOT NULL,
    access_token VARCHAR(500),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
);
SET SESSION sql_mode = 'STRICT_TRANS_TABLES';

-- home page product table
CREATE TABLE IF NOT EXISTS home_page_products (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    category ENUM('dairy', 'tobacco', 'snacks', 'mouth_freshners', 'cold_drink', 'candies') NOT NULL,
    quantity VARCHAR(50),
    price DECIMAL(10, 2) NOT NULL,
    images VARCHAR(255),
    details MEDIUMTEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);