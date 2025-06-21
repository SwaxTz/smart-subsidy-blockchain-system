CREATE DATABASE IF NOT EXISTS subsidy_db;
USE subsidy_db;

CREATE TABLE IF NOT EXISTS users (
    nida VARCHAR(20) PRIMARY KEY,
    firstname VARCHAR(50) NOT NULL,
    lastname VARCHAR(50) NOT NULL,
    password VARCHAR(255) NOT NULL,
    wallet_address VARCHAR(100) UNIQUE NOT NULL,
    totaltokens DECIMAL(18, 8) DEFAULT 0,
    role ENUM('farmer', 'admin', 'supplier') DEFAULT 'farmer'
);