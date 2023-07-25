const express = require('express');
const router = express.Router();

const userController = require('../controllers/userController');


router.get('/:userId/wishlist', userController.getWishlist);
router.post('/:userId/wishlist/:restaurantId', userController.addWish);

module.exports = router;