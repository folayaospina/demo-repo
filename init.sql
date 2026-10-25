-- Runs automatically the first time the container starts
CREATE TABLE IF NOT EXISTS tasks (
    id          SERIAL PRIMARY KEY,
    title       VARCHAR(120) NOT NULL,
    completed   BOOLEAN NOT NULL DEFAULT FALSE,
    created_at  TIMESTAMP NOT NULL DEFAULT NOW()
);

INSERT INTO tasks (title, completed) VALUES
    ('Set up the environment with Docker', TRUE),
    ('Connect DBeaver to the database', FALSE),
    ('Test the GET /tasks endpoint', FALSE);
