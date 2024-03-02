BEGIN TRANSACTION;

-- Creating the 'user' table
CREATE TABLE "users" (
    id SERIAL PRIMARY KEY,
    email VARCHAR(120) UNIQUE NOT NULL,
    password VARCHAR(120) NOT NULL
);

-- Creating the 'pet' table
CREATE TABLE pets (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL,
    img_url VARCHAR(300),
    name VARCHAR(100),
    type VARCHAR(50),
    breed VARCHAR(100),
    birthday DATE,
    FOREIGN KEY (user_id) REFERENCES "users" (id)
);

-- Creating the 'vaccine' table
CREATE TABLE vaccines (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100),
    due_date DATE,
    user_id INTEGER NOT NULL,
    FOREIGN KEY (user_id) REFERENCES "users" (id)
);

-- Creating the 'alert' table
CREATE TABLE alerts (
    id SERIAL PRIMARY KEY,
    vaccine_name VARCHAR(100) NOT NULL,
    due_date DATE NOT NULL,
    alert_date DATE NOT NULL,
    vaccine_id INTEGER NOT NULL,
    pet_id INTEGER NOT NULL,
    user_id INTEGER NOT NULL,
    FOREIGN KEY (vaccine_id) REFERENCES vaccines (id),
    FOREIGN KEY (pet_id) REFERENCES pets (id),
    FOREIGN KEY (user_id) REFERENCES "users" (id)
);

COMMIT;
