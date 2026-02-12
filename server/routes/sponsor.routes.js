import express from 'express';
import {
  getAllSponsors,
  getActiveSponsors,
  getSponsorById,
  createSponsor,
  updateSponsor,
  deleteSponsor
} from '../controllers/sponsor.controller.js';
import { verifyToken, isAdmin } from '../middleware/auth.middleware.js';

const router = express.Router();

// Rutas públicas
router.get('/active', getActiveSponsors);
router.get('/', getAllSponsors);
router.get('/:id', getSponsorById);

// Rutas protegidas (solo admin)
router.post('/', verifyToken, isAdmin, createSponsor);
router.put('/:id', verifyToken, isAdmin, updateSponsor);
router.delete('/:id', verifyToken, isAdmin, deleteSponsor);

export default router;
