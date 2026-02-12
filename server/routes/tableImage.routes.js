import express from 'express';
import {
  getAllTableImages,
  getActiveTableImages,
  getTableImageById,
  createTableImage,
  updateTableImage,
  deleteTableImage
} from '../controllers/tableImage.controller.js';
import { verifyToken, isAdmin } from '../middleware/auth.middleware.js';

const router = express.Router();

// Rutas públicas
router.get('/active', getActiveTableImages);
router.get('/', getAllTableImages);
router.get('/:id', getTableImageById);

// Rutas protegidas (solo admin)
router.post('/', verifyToken, isAdmin, createTableImage);
router.put('/:id', verifyToken, isAdmin, updateTableImage);
router.delete('/:id', verifyToken, isAdmin, deleteTableImage);

export default router;
