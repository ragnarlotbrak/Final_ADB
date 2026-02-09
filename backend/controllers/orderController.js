const Order = require('../models/Order');
const Payment = require('../models/Payment');
const Shoe = require('../models/Shoe');

exports.createOrder = async (req, res) => {
  try {
    const { items, shipping_address, payment_method } = req.body;
    const customer_id = req.user.id;

    if (!items || items.length === 0) {
      return res.status(400).json({ error: 'Order must contain at least one item' });
    }

    let total_amount = 0;
    const processedItems = [];

    for (const item of items) {
      const shoe = await Shoe.findById(item.shoe_id);
      if (!shoe) {
        return res.status(404).json({ error: `Shoe ${item.shoe_id} not found` });
      }

      if (shoe.stock < item.quantity) {
        return res.status(400).json({ error: `Insufficient stock for ${shoe.name}` });
      }

      const itemTotal = shoe.price * item.quantity;
      total_amount += itemTotal;

      processedItems.push({
        shoe_id: shoe._id,
        shoe_name: shoe.name,
        price: shoe.price,
        quantity: item.quantity,
        size: shoe.size,
        color: shoe.color
      });

      await Shoe.findByIdAndUpdate(
        shoe._id,
        { $inc: { stock: -item.quantity } }
      );
    }

    const order = new Order({
      customer_id,
      items: processedItems,
      total_amount,
      shipping_address: shipping_address || 'Default address'
    });

    await order.save();
    await order.populate('customer_id', 'name email');

    res.status(201).json({ message: 'Order created', order });
  } catch(err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getUserOrders = async (req, res) => {
  try {
    const orders = await Order.find({ customer_id: req.user.id })
      .populate('customer_id', 'name email')
      .sort({ createdAt: -1 });

    res.json(orders);
  } catch(err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('customer_id', 'name email phone address');

    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    if (req.user.id !== order.customer_id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Access denied' });
    }

    res.json(order);
  } catch(err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;

    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status, updatedAt: new Date() },
      { new: true }
    ).populate('customer_id', 'name email');

    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    res.json({ message: 'Order status updated', order });
  } catch(err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate('customer_id', 'name email')
      .sort({ createdAt: -1 });

    res.json(orders);
  } catch(err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getSalesStats = async (req, res) => {
  try {
    const stats = await Order.aggregate([
      {
        $match: { status: { $in: ['confirmed', 'shipped', 'delivered'] } }
      },
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
          total_revenue: { $sum: '$total_amount' }
        }
      },
      {
        $sort: { _id: 1 }
      }
    ]);

    const totalOrders = await Order.aggregate([
      {
        $group: {
          _id: null,
          count: { $sum: 1 },
          total_amount: { $sum: '$total_amount' }
        }
      }
    ]);

    res.json({
      orders_by_status: stats,
      total_stats: totalOrders[0] || { count: 0, total_amount: 0 }
    });
  } catch(err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getTopSellingShoes = async (req, res) => {
  try {
    const topShoes = await Order.aggregate([
      { $unwind: '$items' },
      {
        $group: {
          _id: '$items.shoe_name',
          quantity_sold: { $sum: '$items.quantity' },
          revenue: { $sum: { $multiply: ['$items.price', '$items.quantity'] } }
        }
      },
      { $sort: { quantity_sold: -1 } },
      { $limit: 10 }
    ]);

    res.json(topShoes);
  } catch(err) {
    res.status(500).json({ error: err.message });
  }
};
