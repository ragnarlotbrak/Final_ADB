const Shoe = require('../models/Shoe');

exports.getAllShoes = async (req, res) => {
  try {
    const { category_id, min_price, max_price } = req.query;
    let filter = {};

    if (category_id) filter.category_id = category_id;
    if (min_price || max_price) {
      filter.price = {};
      if (min_price) filter.price.$gte = parseFloat(min_price);
      if (max_price) filter.price.$lte = parseFloat(max_price);
    }

    const shoes = await Shoe.find(filter)
      .populate('category_id', 'name')
      .sort({ createdAt: -1 });
    
    res.json(shoes);
  } catch(err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getShoeById = async (req, res) => {
  try {
    const shoe = await Shoe.findById(req.params.id)
      .populate('category_id', 'name');
    
    if (!shoe) {
      return res.status(404).json({ error: 'Shoe not found' });
    }
    
    res.json(shoe);
  } catch(err) {
    res.status(500).json({ error: err.message });
  }
};

exports.createShoe = async (req, res) => {
  try {
    const { name, description, price, size, color, stock, category_id, image_url } = req.body;

    if (!name || !price || !size || !category_id) {
      return res.status(400).json({ error: 'Required fields: name, price, size, category_id' });
    }

    const shoe = new Shoe({
      name,
      description,
      price,
      size,
      color,
      stock: stock || 0,
      category_id,
      image_url
    });

    await shoe.save();
    await shoe.populate('category_id', 'name');

    res.status(201).json({ message: 'Shoe created', shoe });
  } catch(err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateShoe = async (req, res) => {
  try {
    const shoe = await Shoe.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).populate('category_id', 'name');

    if (!shoe) {
      return res.status(404).json({ error: 'Shoe not found' });
    }

    res.json({ message: 'Shoe updated', shoe });
  } catch(err) {
    res.status(500).json({ error: err.message });
  }
};

exports.deleteShoe = async (req, res) => {
  try {
    const shoe = await Shoe.findByIdAndDelete(req.params.id);

    if (!shoe) {
      return res.status(404).json({ error: 'Shoe not found' });
    }

    res.json({ message: 'Shoe deleted', shoe });
  } catch(err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateStock = async (req, res) => {
  try {
    const { quantity } = req.body;

    const shoe = await Shoe.findByIdAndUpdate(
      req.params.id,
      { $inc: { stock: quantity } },
      { new: true }
    ).populate('category_id', 'name');

    if (!shoe) {
      return res.status(404).json({ error: 'Shoe not found' });
    }

    res.json({ message: 'Stock updated', shoe });
  } catch(err) {
    res.status(500).json({ error: err.message });
  }
};
