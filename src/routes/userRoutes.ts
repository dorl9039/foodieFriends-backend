import { Router } from 'express';
import * as userController from '../controllers/userController';

const router = Router();

router.get('/:userId/wishlist', userController.getWishlist);
router.post('/:userId/wishlist', userController.addWish);
router.get('/:userId/history', userController.getHistory)

export default router;