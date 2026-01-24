-- Таблица для хранения молитв пользователей
CREATE TABLE IF NOT EXISTS prayers (
    id SERIAL PRIMARY KEY,
    user_id VARCHAR(255) NOT NULL,
    prayer_text TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    created_date DATE DEFAULT CURRENT_DATE,
    is_visible BOOLEAN DEFAULT TRUE
);

-- Индекс для быстрого поиска по дате
CREATE INDEX IF NOT EXISTS idx_prayers_created_date ON prayers(created_date DESC);

-- Индекс для проверки лимита молитв пользователя за день
CREATE INDEX IF NOT EXISTS idx_prayers_user_date ON prayers(user_id, created_date);

-- Индекс для видимых молитв
CREATE INDEX IF NOT EXISTS idx_prayers_visible ON prayers(is_visible, created_date DESC) WHERE is_visible = TRUE;