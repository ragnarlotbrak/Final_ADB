require('dotenv').config();
const mongoose = require('mongoose');
const Customer = require('./models/Customer');

const email = process.argv[2];
if (!email) {
  console.error('Usage: node promoteAdmin.js <email>');
  process.exit(1);
}

(async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    const updated = await Customer.findOneAndUpdate(
      { email },
      { $set: { role: 'admin' } },
      { new: true }
    ).select('-password');

    if (!updated) {
      console.error('User not found with email:', email);
      process.exit(2);
    }

    console.log('User promoted to admin:');
    console.log({ id: updated._id.toString(), name: updated.name, email: updated.email, role: updated.role });
    process.exit(0);
  } catch (err) {
    console.error('Error:', err.message || err);
    process.exit(3);
  }
})();
