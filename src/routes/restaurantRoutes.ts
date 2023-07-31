import { Router } from 'express';
import * as restaurantController from '../controllers/restaurantController';

const router = Router();

// router.post('', restaurantController.addRestaurant);
router.get('/:restaurantId', restaurantController.getRestaurant);

export default router;