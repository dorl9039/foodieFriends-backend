import { Router } from 'express';
import * as userController from '../controllers/userController';

const router = Router();

router.get('/:userId/wishlist', userController.getWishlist);
router.post('/:userId/wishlist', userController.addWish);
router.get('/:userId/history', userController.getHistory);

router.get('/:userId/history/:visitId', userController.getVisit);
router.delete('/:userId/history/:visitId', userController.deleteVisit);
router.post('/:userId/history', userController.createVisit);
router.patch('/:userId/history/:visitId', userController.editAttendeeComment);
router.patch('/:userId/history/:visitId/attendees', userController.editVisitAttendees);

router.patch('/:userId/username', userController.editUsername);
router.get('/:userId/username', userController.getUsername);

router.post('/:userId/friends', userController.addFriend);
router.delete('/:userId/friends/:friendId', userController.deleteFriend)

export default router;