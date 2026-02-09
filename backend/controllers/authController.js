const Customer = require('../models/Customer');
const jwt = require('jsonwebtoken');

exports.register = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    
    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Name, email and password required' });
    }

    let customer = await Customer.findOne({ email });
    if (customer) {
      return res.status(400).json({ error: 'Email already registered' });
    }

    customer = new Customer({ name, email, password, role: 'user' });
    await customer.save();

    const token = jwt.sign(
      { id: customer._id, email: customer.email, role: customer.role },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.status(201).json({ 
      message: 'User registered successfully',
      token,
      user: {
        id: customer._id,
        name: customer.name,
        email: customer.email,
        role: customer.role
      }
    });
  } catch(err) {
    res.status(500).json({ error: err.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password required' });
    }

    const customer = await Customer.findOne({ email });
    if (!customer) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const isPasswordMatch = await customer.comparePassword(password);
    if (!isPasswordMatch) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { id: customer._id, email: customer.email, role: customer.role },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({ 
      message: 'Login successful',
      token,
      user: {
        id: customer._id,
        name: customer.name,
        email: customer.email,
        role: customer.role
      }
    });
  } catch(err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getProfile = async (req, res) => {
  try {
    const customer = await Customer.findById(req.user.id).select('-password');
    res.json(customer);
  } catch(err) {
    res.status(500).json({ error: err.message });
  }
};
