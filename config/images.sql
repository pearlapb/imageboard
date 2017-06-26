DROP TABLE IF EXISTS comments;
DROP TABLE IF EXISTS images;

CREATE TABLE images(
    id SERIAL PRIMARY KEY,
    image VARCHAR(300) NOT NULL,
    username VARCHAR(255) NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    likes INTEGER,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE comments(
    id SERIAL PRIMARY KEY,
    image_id INTEGER REFERENCES images(id),
    username VARCHAR NOT NULL,
    comment VARCHAR NOT NULL,
    commented_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
