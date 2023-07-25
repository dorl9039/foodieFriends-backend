const express = require('express');
const router = express.Router();

const wishController = require('../controllers/wishController');

router.get('/wishes/:wishId', wishController.getWish);
router.patch('/wishes/:wishId', wishController.editWish);
router.delete('/wishes/:wishId', wishController.deleteWish);

module.exports = router;