const router = express.Router();
const userController = require('../controllers/userController');


router.get('/users/:userId/wishlist', userController.getWishlist);
router.post('/users/:userId/wishlist/:restaurantId', userController.addWish);

module.exports = router;