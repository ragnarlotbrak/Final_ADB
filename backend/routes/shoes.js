const express = require('express');
const router = express.Router();
const shoeController = require('../controllers/shoeController');
const { authMiddleware, adminMiddleware } = require('../middleware/auth');

router.get('/', shoeController.getAllShoes);
router.get('/:id', shoeController.getShoeById);

router.post('/', authMiddleware, adminMiddleware, shoeController.createShoe);
router.put('/:id', authMiddleware, adminMiddleware, shoeController.updateShoe);
router.delete('/:id', authMiddleware, adminMiddleware, shoeController.deleteShoe);
router.patch('/:id/stock', authMiddleware, adminMiddleware, shoeController.updateStock);

module.exports = router;
