import express from 'express';
import {
  getAllCarouselImages,
  getActiveCarouselImages,
  getCarouselImageById,
  createCarouselImage,
  updateCarouselImage,
  deleteCarouselImage
} from '../controllers/carousel.controller.js';
import { verifyToken, isAdmin } from '../middleware/auth.middleware.js';

const router = express.Router();

// Rutas públicas
router.get('/active', getActiveCarouselImages);
router.get('/', getAllCarouselImages);
router.get('/:id', getCarouselImageById);

// Rutas protegidas (solo admin)
router.post('/', verifyToken, isAdmin, createCarouselImage);
router.put('/:id', verifyToken, isAdmin, updateCarouselImage);
router.delete('/:id', verifyToken, isAdmin, deleteCarouselImage);

export default router;
