import express from 'express';
import {
  getStandingsByCategory,
  getAllStandings
} from '../controllers/standings.controller.js';

const router = express.Router();

// Rutas públicas
router.get('/', getAllStandings);
router.get('/:category', getStandingsByCategory);

export default router;
