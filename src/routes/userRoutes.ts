import { Router } from 'express';
import * as userController from '../controllers/userController';

const router = Router();

router.get('/:userId/wishlist', userController.getWishlist);
router.post('/:userId/wishlist', userController.addWish);
router.get('/:userId/history', userController.getHistory)
router.get('/:userId/history/:visitId', userController.getVisit)
router.delete('/:userId/history/:visitId', userController.deleteVisit)
router.post('/:userId/history', userController.createVisit)
router.patch('/:userId/history/:visitId', userController.editAttendeeRecord)

export default router;