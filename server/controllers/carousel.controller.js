import pool from '../config/database.js';

// Obtener todas las imágenes del carrusel
export const getAllCarouselImages = async (req, res) => {
  try {
    const [images] = await pool.query(
      'SELECT * FROM carousel_images ORDER BY order_index ASC, created_at DESC'
    );
    res.json(images);
  } catch (error) {
    console.error('Error al obtener imágenes del carrusel:', error);
    res.status(500).json({ error: 'Error al obtener imágenes del carrusel' });
  }
};

// Obtener imágenes activas del carrusel (para mostrar en el home)
export const getActiveCarouselImages = async (req, res) => {
  try {
    const [images] = await pool.query(
      'SELECT * FROM carousel_images WHERE is_active = true ORDER BY order_index ASC, created_at DESC'
    );
    res.json(images);
  } catch (error) {
    console.error('Error al obtener imágenes activas:', error);
    res.status(500).json({ error: 'Error al obtener imágenes activas' });
  }
};

// Obtener una imagen del carrusel por ID
export const getCarouselImageById = async (req, res) => {
  try {
    const { id } = req.params;
    const [images] = await pool.query(
      'SELECT * FROM carousel_images WHERE id = ?',
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

// Crear nueva imagen en el carrusel
export const createCarouselImage = async (req, res) => {
  try {
    const { title, image_url, link, order_index, is_active } = req.body;

    if (!title || !image_url) {
      return res.status(400).json({ error: 'Título e imagen son requeridos' });
    }

    const [result] = await pool.query(
      'INSERT INTO carousel_images (title, image_url, link, order_index, is_active) VALUES (?, ?, ?, ?, ?)',
      [title, image_url, link || null, order_index || 0, is_active !== undefined ? is_active : true]
    );

    const [newImage] = await pool.query(
      'SELECT * FROM carousel_images WHERE id = ?',
      [result.insertId]
    );

    res.status(201).json(newImage[0]);
  } catch (error) {
    console.error('Error al crear imagen:', error);
    res.status(500).json({ error: 'Error al crear imagen' });
  }
};

// Actualizar imagen del carrusel
export const updateCarouselImage = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, image_url, link, order_index, is_active } = req.body;

    const [existing] = await pool.query(
      'SELECT * FROM carousel_images WHERE id = ?',
      [id]
    );

    if (existing.length === 0) {
      return res.status(404).json({ error: 'Imagen no encontrada' });
    }

    await pool.query(
      'UPDATE carousel_images SET title = ?, image_url = ?, link = ?, order_index = ?, is_active = ? WHERE id = ?',
      [
        title || existing[0].title,
        image_url || existing[0].image_url,
        link !== undefined ? link : existing[0].link,
        order_index !== undefined ? order_index : existing[0].order_index,
        is_active !== undefined ? is_active : existing[0].is_active,
        id
      ]
    );

    const [updated] = await pool.query(
      'SELECT * FROM carousel_images WHERE id = ?',
      [id]
    );

    res.json(updated[0]);
  } catch (error) {
    console.error('Error al actualizar imagen:', error);
    res.status(500).json({ error: 'Error al actualizar imagen' });
  }
};

// Eliminar imagen del carrusel
export const deleteCarouselImage = async (req, res) => {
  try {
    const { id } = req.params;

    const [existing] = await pool.query(
      'SELECT * FROM carousel_images WHERE id = ?',
      [id]
    );

    if (existing.length === 0) {
      return res.status(404).json({ error: 'Imagen no encontrada' });
    }

    await pool.query('DELETE FROM carousel_images WHERE id = ?', [id]);
    res.json({ message: 'Imagen eliminada exitosamente' });
  } catch (error) {
    console.error('Error al eliminar imagen:', error);
    res.status(500).json({ error: 'Error al eliminar imagen' });
  }
};
