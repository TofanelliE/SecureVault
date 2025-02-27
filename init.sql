-- Create the credentials table
CREATE TABLE IF NOT EXISTS credentials (
    id UUID PRIMARY KEY,
    url VARCHAR(1000) NOT NULL,
    username VARCHAR(50) NOT NULL,
    password VARCHAR(50) NOT NULL,
    category VARCHAR(50) NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);
