import express from 'express';
import {
  getAllTeams,
  getTeamById,
  createTeam,
  updateTeam,
  deleteTeam,
  getTeamStats
} from '../controllers/team.controller.js';
import { auth, isAdmin } from '../middleware/auth.middleware.js';

const router = express.Router();

// Rutas públicas
router.get('/', getAllTeams);
router.get('/:id', getTeamById);
router.get('/:id/stats', getTeamStats);

// Rutas protegidas (solo admin)
router.post('/', auth, isAdmin, createTeam);
router.put('/:id', auth, isAdmin, updateTeam);
router.delete('/:id', auth, isAdmin, deleteTeam);

export default router;
