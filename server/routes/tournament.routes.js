import express from 'express';
import {
  getAllTournaments,
  getTournamentById,
  createTournament,
  updateTournament,
  deleteTournament
} from '../controllers/tournament.controller.js';
import { auth, isAdmin } from '../middleware/auth.middleware.js';

const router = express.Router();

// Rutas públicas
router.get('/', getAllTournaments);
router.get('/:id', getTournamentById);

// Rutas protegidas (solo admin)
router.post('/', auth, isAdmin, createTournament);
router.put('/:id', auth, isAdmin, updateTournament);
router.delete('/:id', auth, isAdmin, deleteTournament);

export default router;
