const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const { authMiddleware, adminMiddleware } = require('../middleware/auth');

router.post('/', authMiddleware, orderController.createOrder);
router.get('/', authMiddleware, orderController.getUserOrders);
router.get('/user/:id', authMiddleware, orderController.getOrderById);

router.get('/admin/all', authMiddleware, adminMiddleware, orderController.getAllOrders);
router.put('/:id/status', authMiddleware, adminMiddleware, orderController.updateOrderStatus);
router.get('/admin/stats', authMiddleware, adminMiddleware, orderController.getSalesStats);
router.get('/admin/top-shoes', authMiddleware, adminMiddleware, orderController.getTopSellingShoes);

module.exports = router;
