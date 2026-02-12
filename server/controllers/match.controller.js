import pool from '../config/database.js';

// Obtener todos los partidos
export const getAllMatches = async (req, res) => {
  try {
    const { category, date, tournament_id } = req.query;
    let query = `
      SELECT m.*, 
             t1.name as team1_name, t1.short_name as team1_short, t1.color as team1_color,
             t2.name as team2_name, t2.short_name as team2_short, t2.color as team2_color,
             tournament.name as tournament_name
      FROM matches m
      LEFT JOIN teams t1 ON m.team1_id = t1.id
      LEFT JOIN teams t2 ON m.team2_id = t2.id
      LEFT JOIN tournaments tournament ON m.tournament_id = tournament.id
      WHERE 1=1
    `;
    const params = [];

    if (category) {
      query += ' AND m.category = ?';
      params.push(category);
    }

    if (date) {
      query += ' AND DATE(m.match_date) = ?';
      params.push(date);
    }

    if (tournament_id) {
      query += ' AND m.tournament_id = ?';
      params.push(tournament_id);
    }

    query += ' ORDER BY m.match_date DESC';

    const [matches] = await pool.query(query, params);
    res.json(matches);
  } catch (error) {
    console.error('Error en getAllMatches:', error);
    res.status(500).json({ error: 'Error al obtener partidos' });
  }
};

// Obtener un partido por ID
export const getMatchById = async (req, res) => {
  try {
    const { id } = req.params;
    const [matches] = await pool.query(
      `SELECT m.*, 
              t1.name as team1_name, t1.short_name as team1_short, t1.color as team1_color,
              t2.name as team2_name, t2.short_name as team2_short, t2.color as team2_color,
              tournament.name as tournament_name
       FROM matches m
       LEFT JOIN teams t1 ON m.team1_id = t1.id
       LEFT JOIN teams t2 ON m.team2_id = t2.id
       LEFT JOIN tournaments tournament ON m.tournament_id = tournament.id
       WHERE m.id = ?`,
      [id]
    );

    if (matches.length === 0) {
      return res.status(404).json({ error: 'Partido no encontrado' });
    }

    res.json(matches[0]);
  } catch (error) {
    console.error('Error en getMatchById:', error);
    res.status(500).json({ error: 'Error al obtener partido' });
  }
};

// Crear nuevo partido
export const createMatch = async (req, res) => {
  try {
    const { 
      team1_id, team2_id, score1, score2, 
      match_date, category, tournament_id, status = 'finished' 
    } = req.body;

    if (!team1_id || !team2_id || !match_date || !category) {
      return res.status(400).json({ error: 'Faltan campos requeridos' });
    }

    const [result] = await pool.query(
      `INSERT INTO matches 
       (team1_id, team2_id, score1, score2, match_date, category, tournament_id, status) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [team1_id, team2_id, score1 || 0, score2 || 0, match_date, category, tournament_id, status]
    );

    res.status(201).json({
      message: 'Partido creado exitosamente',
      matchId: result.insertId
    });
  } catch (error) {
    console.error('Error en createMatch:', error);
    res.status(500).json({ error: 'Error al crear partido' });
  }
};

// Actualizar partido
export const updateMatch = async (req, res) => {
  try {
    const { id } = req.params;
    const { 
      team1_id, team2_id, score1, score2, 
      match_date, category, tournament_id, status 
    } = req.body;

    const [result] = await pool.query(
      `UPDATE matches 
       SET team1_id = ?, team2_id = ?, score1 = ?, score2 = ?, 
           match_date = ?, category = ?, tournament_id = ?, status = ?
       WHERE id = ?`,
      [team1_id, team2_id, score1, score2, match_date, category, tournament_id, status, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Partido no encontrado' });
    }

    res.json({ message: 'Partido actualizado exitosamente' });
  } catch (error) {
    console.error('Error en updateMatch:', error);
    res.status(500).json({ error: 'Error al actualizar partido' });
  }
};

// Eliminar partido
export const deleteMatch = async (req, res) => {
  try {
    const { id } = req.params;
    const [result] = await pool.query('DELETE FROM matches WHERE id = ?', [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Partido no encontrado' });
    }

    res.json({ message: 'Partido eliminado exitosamente' });
  } catch (error) {
    console.error('Error en deleteMatch:', error);
    res.status(500).json({ error: 'Error al eliminar partido' });
  }
};
