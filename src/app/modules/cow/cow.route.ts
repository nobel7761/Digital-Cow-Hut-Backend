import express from 'express';
import validateRequest from '../../middlewares/validateRequest';
import { CowController } from './cow.controller';
import { cowValidation } from './cow.validation';

const router = express.Router();

router.post(
  '/',
  validateRequest(cowValidation.createCowZodSchema),
  CowController.createCow
);

router.get('/:id', CowController.getCowById);
router.get('/', CowController.getAllCows);
router.delete('/:id', CowController.deleteCowById);

router.patch(
  '/:id',
  validateRequest(cowValidation.updateCowZodSchema),
  CowController.updateCowById
);

export const CowRoutes = router;
