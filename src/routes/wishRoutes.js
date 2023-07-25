const express = require('express');
const router = express.Router();

const wishController = require('../controllers/wishController');

router.get('/:wishId', wishController.getWish);
router.patch('/:wishId', wishController.editWish);
router.delete('/:wishId', wishController.deleteWish);

module.exports = router;