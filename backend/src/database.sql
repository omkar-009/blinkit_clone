-- user table
CREATE TABLE IF NOT EXISTS users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    contact_number VARCHAR(15),
    password_hash VARCHAR(255) NOT NULL,
    raw_password VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

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