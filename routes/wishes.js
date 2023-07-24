const express = require('express');
const router = express.Router();

const wishController = require('../controllers/wishController');

router.get('/:userId/wishlist', wishController.getWishlist);
router.post('/:userId/wishlist/:restaurantId', wishController.createWish);
router.get('/wishlist/:wishId', wishController.getWish);
router.patch('/wishlist/:wishId', wishController.editWish);
router.delete('/wishlist/:wishId', wishController.deleteWish);

module.exports = router;