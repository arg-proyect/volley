-- Crear base de datos
CREATE DATABASE IF NOT EXISTS laliga_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE laliga_db;

-- Tabla de usuarios
CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(100) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  role ENUM('admin', 'user') DEFAULT 'user',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Tabla de equipos
CREATE TABLE IF NOT EXISTS teams (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  short_name VARCHAR(10) NOT NULL,
  color VARCHAR(7) DEFAULT '#3B82F6',
  logo VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Tabla de torneos
CREATE TABLE IF NOT EXISTS tournaments (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  description TEXT,
  start_date DATE NOT NULL,
  end_date DATE,
  image VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Tabla de partidos
CREATE TABLE IF NOT EXISTS matches (
  id INT AUTO_INCREMENT PRIMARY KEY,
  team1_id INT NOT NULL,
  team2_id INT NOT NULL,
  score1 INT DEFAULT 0,
  score2 INT DEFAULT 0,
  match_date DATETIME NOT NULL,
  category VARCHAR(50) NOT NULL,
  tournament_id INT,
  status ENUM('scheduled', 'in_progress', 'finished', 'cancelled') DEFAULT 'scheduled',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (team1_id) REFERENCES teams(id) ON DELETE CASCADE,
  FOREIGN KEY (team2_id) REFERENCES teams(id) ON DELETE CASCADE,
  FOREIGN KEY (tournament_id) REFERENCES tournaments(id) ON DELETE SET NULL
);

-- El usuario admin se crea automáticamente al iniciar el servidor
-- Si necesitas crearlo manualmente, ejecuta: node scripts/setup.js

-- Insertar equipos de ejemplo
INSERT INTO teams (name, short_name, color) VALUES
('Noveno Piso', 'NOV', '#8B5CF6'),
('Vinilo', 'VIN', '#EC4899'),
('Boliche', 'BOL', '#3B82F6'),
('New Team', 'NEW', '#6366F1'),
('Defensores', 'DEF', '#10B981'),
('Treinta', 'TRE', '#F59E0B'),
('Misioneros', 'MIS', '#EF4444'),
('Justicia', 'JUS', '#F97316'),
('17 de Agosto', '17', '#06B6D4'),
('PSM', 'PSM', '#8B5CF6'),
('Apiario', 'API', '#14B8A6'),
('Blanquicelestes', 'BLA', '#6B7280'),
('Miñones', 'MIN', '#F59E0B'),
('Paisanos', 'PAI', '#EC4899'),
('Deportivo Morón', 'DMO', '#EF4444'),
('Unidos de La Plata', 'UNL', '#10B981'),
('27 de Febrero', '27', '#3B82F6'),
('Tercera Edad', 'TER', '#6366F1'),
('Panamericano', 'PAN', '#F97316');

-- Insertar torneos
INSERT INTO tournaments (name, description, start_date, end_date, image) VALUES
('Torneo de Verano', 'Torneo oficial de la temporada de verano', '2026-01-15', '2026-03-30', '🏐'),
('Open Cañuelas', 'Torneo abierto en Cañuelas', '2026-02-01', '2026-02-28', '🏐');

-- Insertar partidos de ejemplo
INSERT INTO matches (team1_id, team2_id, score1, score2, match_date, category, tournament_id, status) VALUES
(1, 2, 1, 3, '2026-02-08 18:00:00', 'Superiores', 1, 'finished'),
(3, 4, 3, 2, '2026-02-08 19:00:00', 'Superiores', 1, 'finished'),
(5, 6, 3, 1, '2026-02-08 20:00:00', 'Superiores', 1, 'finished'),
(7, 8, 3, 1, '2026-02-08 18:30:00', 'Superiores', 1, 'finished'),
(9, 10, 3, 0, '2026-02-08 19:30:00', 'Superiores', 1, 'finished'),
(11, 12, 3, 0, '2026-02-08 20:30:00', 'Superiores', 1, 'finished'),
(13, 14, 0, 3, '2026-02-08 21:00:00', 'Superiores', 1, 'finished'),
(15, 16, 0, 3, '2026-02-08 21:30:00', 'Superiores', 1, 'finished'),
(1, 3, 0, 0, '2026-02-15 18:00:00', 'Superiores', 1, 'scheduled'),
(5, 7, 0, 0, '2026-02-15 19:00:00', 'Superiores', 1, 'scheduled'),
(9, 11, 0, 0, '2026-02-15 20:00:00', 'Superiores', 1, 'scheduled'),
(13, 15, 0, 0, '2026-02-15 21:00:00', 'Superiores', 1, 'scheduled');

-- Índices para mejorar el rendimiento
CREATE INDEX idx_matches_date ON matches(match_date);
CREATE INDEX idx_matches_category ON matches(category);
CREATE INDEX idx_matches_tournament ON matches(tournament_id);
CREATE INDEX idx_matches_status ON matches(status);
CREATE INDEX idx_teams_short_name ON teams(short_name);
