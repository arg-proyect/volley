import pool from '../config/database.js';

// Obtener todas las imágenes de tabla
export const getAllTableImages = async (req, res) => {
  try {
    const [images] = await pool.query(
      'SELECT * FROM table_images ORDER BY created_at DESC'
    );
    res.json(images);
  } catch (error) {
    console.error('Error al obtener imágenes de tabla:', error);
    res.status(500).json({ error: 'Error al obtener imágenes de tabla' });
  }
};

// Obtener imágenes activas de tabla (para mostrar en el home)
export const getActiveTableImages = async (req, res) => {
  try {
    const [images] = await pool.query(
      'SELECT * FROM table_images WHERE is_active = true ORDER BY created_at DESC'
    );
    res.json(images);
  } catch (error) {
    console.error('Error al obtener imágenes activas:', error);
    res.status(500).json({ error: 'Error al obtener imágenes activas' });
  }
};

// Obtener una imagen de tabla por ID
export const getTableImageById = async (req, res) => {
  try {
    const { id } = req.params;
    const [images] = await pool.query(
      'SELECT * FROM table_images WHERE id = ?',
      [id]
    );

    if (images.length === 0) {
      return res.status(404).json({ error: 'Imagen no encontrada' });
    }

    res.json(images[0]);
  } catch (error) {
    console.error('Error al obtener imagen:', error);
    res.status(500).json({ error: 'Error al obtener imagen' });
  }
};

// Crear nueva imagen de tabla
export const createTableImage = async (req, res) => {
  try {
    const { title, image_url, link, position, is_active } = req.body;

    if (!title || !image_url) {
      return res.status(400).json({ error: 'Título e imagen son requeridos' });
    }

    const [result] = await pool.query(
      'INSERT INTO table_images (title, image_url, link, position, is_active) VALUES (?, ?, ?, ?, ?)',
      [title, image_url, link || null, position || 'right', is_active !== undefined ? is_active : true]
    );

    const [newImage] = await pool.query(
      'SELECT * FROM table_images WHERE id = ?',
      [result.insertId]
    );

    res.status(201).json(newImage[0]);
  } catch (error) {
    console.error('Error al crear imagen:', error);
    res.status(500).json({ error: 'Error al crear imagen' });
  }
};

// Actualizar imagen de tabla
export const updateTableImage = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, image_url, link, position, is_active } = req.body;

    const [existing] = await pool.query(
      'SELECT * FROM table_images WHERE id = ?',
      [id]
    );

    if (existing.length === 0) {
      return res.status(404).json({ error: 'Imagen no encontrada' });
    }

    await pool.query(
      'UPDATE table_images SET title = ?, image_url = ?, link = ?, position = ?, is_active = ? WHERE id = ?',
      [
        title || existing[0].title,
        image_url || existing[0].image_url,
        link !== undefined ? link : existing[0].link,
        position || existing[0].position,
        is_active !== undefined ? is_active : existing[0].is_active,
        id
      ]
    );

    const [updated] = await pool.query(
      'SELECT * FROM table_images WHERE id = ?',
      [id]
    );

    res.json(updated[0]);
  } catch (error) {
    console.error('Error al actualizar imagen:', error);
    res.status(500).json({ error: 'Error al actualizar imagen' });
  }
};

// Eliminar imagen de tabla
export const deleteTableImage = async (req, res) => {
  try {
    const { id } = req.params;

    const [existing] = await pool.query(
      'SELECT * FROM table_images WHERE id = ?',
      [id]
    );

    if (existing.length === 0) {
      return res.status(404).json({ error: 'Imagen no encontrada' });
    }

    await pool.query('DELETE FROM table_images WHERE id = ?', [id]);
    res.json({ message: 'Imagen eliminada exitosamente' });
  } catch (error) {
    console.error('Error al eliminar imagen:', error);
    res.status(500).json({ error: 'Error al eliminar imagen' });
  }
};
