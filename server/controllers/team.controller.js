import pool from '../config/database.js';

// Obtener todos los equipos
export const getAllTeams = async (req, res) => {
  try {
    const [teams] = await pool.query('SELECT * FROM teams ORDER BY name');
    res.json(teams);
  } catch (error) {
    console.error('Error en getAllTeams:', error);
    res.status(500).json({ error: 'Error al obtener equipos' });
  }
};

// Obtener un equipo por ID
export const getTeamById = async (req, res) => {
  try {
    const { id } = req.params;
    const [teams] = await pool.query('SELECT * FROM teams WHERE id = ?', [id]);

    if (teams.length === 0) {
      return res.status(404).json({ error: 'Equipo no encontrado' });
    }

    res.json(teams[0]);
  } catch (error) {
    console.error('Error en getTeamById:', error);
    res.status(500).json({ error: 'Error al obtener equipo' });
  }
};

// Crear nuevo equipo
export const createTeam = async (req, res) => {
  try {
    const { name, short_name, color, logo } = req.body;

    if (!name || !short_name) {
      return res.status(400).json({ error: 'Nombre y nombre corto son obligatorios' });
    }

    const [result] = await pool.query(
      'INSERT INTO teams (name, short_name, color, logo) VALUES (?, ?, ?, ?)',
      [name, short_name, color || '#3B82F6', logo]
    );

    res.status(201).json({
      message: 'Equipo creado exitosamente',
      teamId: result.insertId
    });
  } catch (error) {
    console.error('Error en createTeam:', error);
    res.status(500).json({ error: 'Error al crear equipo' });
  }
};

// Actualizar equipo
export const updateTeam = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, short_name, color, logo } = req.body;

    const [result] = await pool.query(
      'UPDATE teams SET name = ?, short_name = ?, color = ?, logo = ? WHERE id = ?',
      [name, short_name, color, logo, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Equipo no encontrado' });
    }

    res.json({ message: 'Equipo actualizado exitosamente' });
  } catch (error) {
    console.error('Error en updateTeam:', error);
    res.status(500).json({ error: 'Error al actualizar equipo' });
  }
};

// Eliminar equipo
export const deleteTeam = async (req, res) => {
  try {
    const { id } = req.params;
    const [result] = await pool.query('DELETE FROM teams WHERE id = ?', [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Equipo no encontrado' });
    }

    res.json({ message: 'Equipo eliminado exitosamente' });
  } catch (error) {
    console.error('Error en deleteTeam:', error);
    res.status(500).json({ error: 'Error al eliminar equipo' });
  }
};

// Obtener estadísticas de un equipo
export const getTeamStats = async (req, res) => {
  try {
    const { id } = req.params;
    
    const [stats] = await pool.query(
      `SELECT 
        COUNT(*) as total_matches,
        SUM(CASE WHEN (team1_id = ? AND score1 > score2) OR (team2_id = ? AND score2 > score1) THEN 1 ELSE 0 END) as wins,
        SUM(CASE WHEN (team1_id = ? AND score1 < score2) OR (team2_id = ? AND score2 < score1) THEN 1 ELSE 0 END) as losses,
        SUM(CASE WHEN team1_id = ? THEN score1 ELSE score2 END) as points_for,
        SUM(CASE WHEN team1_id = ? THEN score2 ELSE score1 END) as points_against
      FROM matches 
      WHERE (team1_id = ? OR team2_id = ?) AND status = 'finished'`,
      [id, id, id, id, id, id, id, id]
    );

    res.json(stats[0]);
  } catch (error) {
    console.error('Error en getTeamStats:', error);
    res.status(500).json({ error: 'Error al obtener estadísticas del equipo' });
  }
};
