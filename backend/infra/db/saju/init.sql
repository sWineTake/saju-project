-- Init script for Saju DB
CREATE TABLE IF NOT EXISTS fortunes (
    id SERIAL PRIMARY KEY,
    user_id BIGINT,
    birth_date TIMESTAMP,
    birth_time VARCHAR(10),
    result_text TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
