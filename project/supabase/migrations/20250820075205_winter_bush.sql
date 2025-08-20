-- RollRite Database Schema
-- Run these queries in your PostgreSQL database (pgAdmin)

-- Create database (run this first if database doesn't exist)
-- CREATE DATABASE rollrite;

-- Connect to the rollrite database before running the rest

-- Users table
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    rev_rate INTEGER DEFAULT 350,
    ball_speed INTEGER DEFAULT 16,
    axis_tilt INTEGER DEFAULT 15,
    axis_rotation INTEGER DEFAULT 45,
    pap_horizontal DECIMAL(3,1) DEFAULT 5.0,
    pap_vertical DECIMAL(3,1) DEFAULT 0.5,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Bowling balls table
CREATE TABLE IF NOT EXISTS balls (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    brand VARCHAR(100) NOT NULL,
    hook_potential INTEGER CHECK (hook_potential >= 1 AND hook_potential <= 5),
    length INTEGER CHECK (length >= 1 AND length <= 5),
    backend INTEGER CHECK (backend >= 1 AND backend <= 5),
    surface VARCHAR(50) DEFAULT '1500 Polished',
    core_type VARCHAR(100),
    coverstock VARCHAR(100),
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Oil patterns table
CREATE TABLE IF NOT EXISTS oil_patterns (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    category VARCHAR(50) NOT NULL, -- PBA, WTBA, Kegel, Custom
    length INTEGER NOT NULL, -- in feet
    volume DECIMAL(4,1), -- in mL
    ratio DECIMAL(4,1), -- oil ratio
    forward_oil INTEGER, -- forward oil distance
    description TEXT,
    difficulty VARCHAR(20), -- Easy, Medium, Hard
    created_by INTEGER REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- User arsenal table
CREATE TABLE IF NOT EXISTS arsenal (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    ball_id INTEGER NOT NULL REFERENCES balls(id),
    layout VARCHAR(100),
    current_surface VARCHAR(50),
    purchase_date DATE,
    games_played INTEGER DEFAULT 0,
    last_used DATE,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Surface history table
CREATE TABLE IF NOT EXISTS surface_history (
    id SERIAL PRIMARY KEY,
    arsenal_id INTEGER NOT NULL REFERENCES arsenal(id) ON DELETE CASCADE,
    surface VARCHAR(50) NOT NULL,
    date_changed DATE NOT NULL DEFAULT CURRENT_DATE,
    reason TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Performance logs table
CREATE TABLE IF NOT EXISTS performance_logs (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    pattern_id INTEGER REFERENCES oil_patterns(id),
    ball_used_id INTEGER REFERENCES balls(id),
    score INTEGER NOT NULL CHECK (score >= 0 AND score <= 300),
    carry_percentage DECIMAL(5,2) CHECK (carry_percentage >= 0 AND carry_percentage <= 100),
    entry_angle DECIMAL(4,1),
    game_date DATE NOT NULL DEFAULT CURRENT_DATE,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Ball usage tracking table
CREATE TABLE IF NOT EXISTS ball_usage (
    id SERIAL PRIMARY KEY,
    arsenal_id INTEGER NOT NULL REFERENCES arsenal(id) ON DELETE CASCADE,
    pattern_id INTEGER REFERENCES oil_patterns(id),
    games_played INTEGER DEFAULT 1,
    average_score DECIMAL(5,2),
    usage_date DATE NOT NULL DEFAULT CURRENT_DATE,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for better performance
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_arsenal_user_id ON arsenal(user_id);
CREATE INDEX IF NOT EXISTS idx_performance_logs_user_id ON performance_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_performance_logs_date ON performance_logs(game_date);
CREATE INDEX IF NOT EXISTS idx_surface_history_arsenal_id ON surface_history(arsenal_id);
CREATE INDEX IF NOT EXISTS idx_ball_usage_arsenal_id ON ball_usage(arsenal_id);

-- Insert sample bowling balls
INSERT INTO balls (name, brand, hook_potential, length, backend, surface, core_type, coverstock, description) VALUES
('Phaze II', 'Storm', 4, 3, 4, '3000 Abralon', 'Asymmetric', 'R2S Pearl', 'Versatile ball for medium to heavy oil conditions'),
('Hyroad', 'Storm', 3, 4, 3, '1500 Polished', 'Symmetric', 'R2S Solid', 'Benchmark ball for various conditions'),
('IQ Tour Emerald', 'Storm', 2, 5, 2, '4000 Abralon', 'Symmetric', 'R2S Pearl', 'Control ball for lighter oil patterns'),
('Axiom', 'Storm', 5, 2, 5, '2000 Abralon', 'Asymmetric', 'R2S Solid', 'Heavy oil monster with strong backend'),
('Code Red', 'Storm', 4, 3, 4, '2000 Abralon', 'Asymmetric', 'R3S Solid', 'Aggressive ball for heavy oil'),

('Zen', 'Hammer', 3, 4, 3, '3000 Abralon', 'Symmetric', 'Semtex Pearl', 'Smooth and predictable reaction'),
('Black Widow 2.0', 'Hammer', 4, 3, 4, '2000 Abralon', 'Asymmetric', 'Gas Mask Core', 'Strong hooking ball for heavy oil'),
('Purple Pearl Urethane', 'Hammer', 2, 5, 1, '1000 Abralon', 'Symmetric', 'Urethane', 'Control ball for sport patterns'),

('Halo Pearl', 'Roto Grip', 4, 3, 4, '1500 Polished', 'Asymmetric', 'NRG Pearl', 'Strong pearl ball for medium-heavy oil'),
('Idol Pearl', 'Roto Grip', 4, 3, 4, '1500 Polished', 'Asymmetric', 'eTrax Pearl', 'Versatile pearl with strong backend'),
('Hustle Ink', 'Roto Grip', 2, 4, 2, '1500 Polished', 'Symmetric', 'VTC-P18 Pearl', 'Entry-level reactive ball'),

('Jackal Ghost', 'Motiv', 4, 3, 4, '2000 Abralon', 'Asymmetric', 'Coercion MFS', 'Aggressive ball for heavy oil patterns'),
('Venom Shock', 'Motiv', 3, 4, 3, '1500 Polished', 'Symmetric', 'Gear Core', 'Benchmark ball with versatile reaction'),
('Tank Rampage', 'Motiv', 5, 2, 5, '2000 Abralon', 'Asymmetric', 'Dual Drive Core', 'Maximum hook potential'),

('Quantum Bias', 'Brunswick', 4, 3, 4, '2000 Abralon', 'Asymmetric', 'Quantum Mushroom', 'Strong asymmetric for heavy oil'),
('Rhino', 'Brunswick', 2, 5, 2, '1500 Polished', 'Symmetric', 'Light Bulb Core', 'Spare ball and light oil option');

-- Insert sample oil patterns
INSERT INTO oil_patterns (name, category, length, volume, ratio, forward_oil, description, difficulty) VALUES
-- PBA Patterns
('Scorpion', 'PBA', 42, 24.5, 3.1, 35, 'Long and challenging pattern with high volume', 'Hard'),
('Shark', 'PBA', 42, 22.0, 2.8, 35, 'Flat pattern that rewards accuracy', 'Hard'),
('Bear', 'PBA', 40, 23.5, 3.0, 32, 'Medium-long pattern with moderate volume', 'Medium'),
('Chameleon', 'PBA', 36, 25.0, 2.5, 28, 'Medium pattern with higher volume', 'Medium'),
('Viper', 'PBA', 37, 18.5, 2.9, 30, 'Medium pattern with lower volume', 'Medium'),
('Wolf', 'PBA', 32, 19.0, 4.2, 26, 'Shorter pattern with higher ratio', 'Easy'),

-- WTBA Patterns
('Beijing', 'WTBA', 37, 20.0, 3.2, 30, 'Medium length sport pattern', 'Medium'),
('London', 'WTBA', 41, 25.5, 2.6, 34, 'Long pattern with high volume', 'Hard'),
('Stockholm', 'WTBA', 39, 22.8, 2.9, 32, 'Balanced medium-long pattern', 'Medium'),
('Tokyo', 'WTBA', 35, 18.2, 3.5, 28, 'Shorter sport pattern', 'Easy'),

-- Kegel Patterns
('Main Street', 'Kegel', 41, 23.0, 2.8, 34, 'House shot simulation', 'Easy'),
('Broadway', 'Kegel', 39, 21.5, 3.1, 32, 'Modified house pattern', 'Easy'),
('Route 66', 'Kegel', 32, 17.8, 4.5, 25, 'Short and hooky pattern', 'Easy'),
('Abbey Road', 'Kegel', 35, 19.2, 3.8, 28, 'Medium sport pattern', 'Medium');

-- Create triggers for updating timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_arsenal_updated_at BEFORE UPDATE ON arsenal
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Sample data verification queries (optional - run to check data)
-- SELECT COUNT(*) as total_balls FROM balls;
-- SELECT COUNT(*) as total_patterns FROM oil_patterns;
-- SELECT category, COUNT(*) as pattern_count FROM oil_patterns GROUP BY category;