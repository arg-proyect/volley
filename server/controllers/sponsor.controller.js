import pool from '../config/database.js';

// Obtener todos los sponsors
export const getAllSponsors = async (req, res) => {
  try {
    const [sponsors] = await pool.query(
      'SELECT * FROM sponsors ORDER BY order_index ASC, created_at DESC'
    );
    res.json(sponsors);
  } catch (error) {
    console.error('Error al obtener sponsors:', error);
    res.status(500).json({ error: 'Error al obtener sponsors' });
  }
};

// Obtener sponsors activos (para mostrar en el home)
export const getActiveSponsors = async (req, res) => {
  try {
    const [sponsors] = await pool.query(
      'SELECT * FROM sponsors WHERE is_active = true ORDER BY order_index ASC, created_at DESC'
    );
    res.json(sponsors);
  } catch (error) {
    console.error('Error al obtener sponsors activos:', error);
    res.status(500).json({ error: 'Error al obtener sponsors activos' });
  }
};

// Obtener un sponsor por ID
export const getSponsorById = async (req, res) => {
  try {
    const { id } = req.params;
    const [sponsors] = await pool.query(
      'SELECT * FROM sponsors WHERE id = ?',
      [id]
    );

    if (sponsors.length === 0) {
      return res.status(404).json({ error: 'Sponsor no encontrado' });
    }

    res.json(sponsors[0]);
  } catch (error) {
    console.error('Error al obtener sponsor:', error);
    res.status(500).json({ error: 'Error al obtener sponsor' });
  }
};

// Crear nuevo sponsor
export const createSponsor = async (req, res) => {
  try {
    const { name, logo_url, website, order_index, is_active } = req.body;

    if (!name || !logo_url) {
      return res.status(400).json({ error: 'Nombre y logo son requeridos' });
    }

    const [result] = await pool.query(
      'INSERT INTO sponsors (name, logo_url, website, order_index, is_active) VALUES (?, ?, ?, ?, ?)',
      [name, logo_url, website || null, order_index || 0, is_active !== undefined ? is_active : true]
    );

    const [newSponsor] = await pool.query(
      'SELECT * FROM sponsors WHERE id = ?',
      [result.insertId]
    );

    res.status(201).json(newSponsor[0]);
  } catch (error) {
    console.error('Error al crear sponsor:', error);
    res.status(500).json({ error: 'Error al crear sponsor' });
  }
};

// Actualizar sponsor
export const updateSponsor = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, logo_url, website, order_index, is_active } = req.body;

    const [existing] = await pool.query(
      'SELECT * FROM sponsors WHERE id = ?',
      [id]
    );

    if (existing.length === 0) {
      return res.status(404).json({ error: 'Sponsor no encontrado' });
    }

    await pool.query(
      'UPDATE sponsors SET name = ?, logo_url = ?, website = ?, order_index = ?, is_active = ? WHERE id = ?',
      [
        name || existing[0].name,
        logo_url || existing[0].logo_url,
        website !== undefined ? website : existing[0].website,
        order_index !== undefined ? order_index : existing[0].order_index,
        is_active !== undefined ? is_active : existing[0].is_active,
        id
      ]
    );

    const [updated] = await pool.query(
      'SELECT * FROM sponsors WHERE id = ?',
      [id]
    );

    res.json(updated[0]);
  } catch (error) {
    console.error('Error al actualizar sponsor:', error);
    res.status(500).json({ error: 'Error al actualizar sponsor' });
  }
};

// Eliminar sponsor
export const deleteSponsor = async (req, res) => {
  try {
    const { id } = req.params;

    const [existing] = await pool.query(
      'SELECT * FROM sponsors WHERE id = ?',
      [id]
    );

    if (existing.length === 0) {
      return res.status(404).json({ error: 'Sponsor no encontrado' });
    }

    await pool.query('DELETE FROM sponsors WHERE id = ?', [id]);
    res.json({ message: 'Sponsor eliminado exitosamente' });
  } catch (error) {
    console.error('Error al eliminar sponsor:', error);
    res.status(500).json({ error: 'Error al eliminar sponsor' });
  }
};
