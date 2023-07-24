const express = require('express');
const router = express.Router();

const wishController = require('../controllers/wishController');

router.get('/:userId/wishlist', wishController.getWishlist);
router.post('/:userId/wishlist/:restaurantId', wishController.createWish);

module.exports = router;