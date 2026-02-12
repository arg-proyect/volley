import pool from '../config/database.js';

// Obtener todos los torneos
export const getAllTournaments = async (req, res) => {
  try {
    const [tournaments] = await pool.query('SELECT * FROM tournaments ORDER BY start_date DESC');
    res.json(tournaments);
  } catch (error) {
    console.error('Error en getAllTournaments:', error);
    res.status(500).json({ error: 'Error al obtener torneos' });
  }
};

// Obtener un torneo por ID
export const getTournamentById = async (req, res) => {
  try {
    const { id } = req.params;
    const [tournaments] = await pool.query('SELECT * FROM tournaments WHERE id = ?', [id]);

    if (tournaments.length === 0) {
      return res.status(404).json({ error: 'Torneo no encontrado' });
    }

    res.json(tournaments[0]);
  } catch (error) {
    console.error('Error en getTournamentById:', error);
    res.status(500).json({ error: 'Error al obtener torneo' });
  }
};

// Crear nuevo torneo
export const createTournament = async (req, res) => {
  try {
    const { name, description, start_date, end_date, image } = req.body;

    if (!name || !start_date) {
      return res.status(400).json({ error: 'Nombre y fecha de inicio son obligatorios' });
    }

    const [result] = await pool.query(
      'INSERT INTO tournaments (name, description, start_date, end_date, image) VALUES (?, ?, ?, ?, ?)',
      [name, description, start_date, end_date, image]
    );

    res.status(201).json({
      message: 'Torneo creado exitosamente',
      tournamentId: result.insertId
    });
  } catch (error) {
    console.error('Error en createTournament:', error);
    res.status(500).json({ error: 'Error al crear torneo' });
  }
};

// Actualizar torneo
export const updateTournament = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, start_date, end_date, image } = req.body;

    const [result] = await pool.query(
      'UPDATE tournaments SET name = ?, description = ?, start_date = ?, end_date = ?, image = ? WHERE id = ?',
      [name, description, start_date, end_date, image, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Torneo no encontrado' });
    }

    res.json({ message: 'Torneo actualizado exitosamente' });
  } catch (error) {
    console.error('Error en updateTournament:', error);
    res.status(500).json({ error: 'Error al actualizar torneo' });
  }
};

// Eliminar torneo
export const deleteTournament = async (req, res) => {
  try {
    const { id } = req.params;
    const [result] = await pool.query('DELETE FROM tournaments WHERE id = ?', [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Torneo no encontrado' });
    }

    res.json({ message: 'Torneo eliminado exitosamente' });
  } catch (error) {
    console.error('Error en deleteTournament:', error);
    res.status(500).json({ error: 'Error al eliminar torneo' });
  }
};
