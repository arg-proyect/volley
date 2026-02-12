import express from 'express';
import {
  getAllMatches,
  getMatchById,
  createMatch,
  updateMatch,
  deleteMatch
} from '../controllers/match.controller.js';
import { auth, isAdmin } from '../middleware/auth.middleware.js';

const router = express.Router();

// Rutas públicas
router.get('/', getAllMatches);
router.get('/:id', getMatchById);

// Rutas protegidas (solo admin)
router.post('/', auth, isAdmin, createMatch);
router.put('/:id', auth, isAdmin, updateMatch);
router.delete('/:id', auth, isAdmin, deleteMatch);

export default router;
