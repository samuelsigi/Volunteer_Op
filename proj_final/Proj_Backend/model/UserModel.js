const mongoose = require('mongoose');

// Define the User schema
const userSchema = new mongoose.Schema({
  name:{
    type: String,
    
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: true,
  },
  token: {
    type: String,
    required: false,
  }

}, { timestamps: true });

// Create a User model from the schema
const User = mongoose.model('User', userSchema);

// Add a user
const addUser = async (userData) => {
  try {
    const user = new User(userData); // Create a new instance of the User model
    await user.save(); // Save the user to MongoDB
    return user;
  } catch (error) {
    throw new Error('Error adding user: ' + error.message);
  }
};

// Find user by email
const findUserByEmail = async (email) => {
  try {
    const user = await User.findOne({ email }); // Find user by email
    return user;
  } catch (error) {
    throw new Error('Error finding user by email: ' + error.message);
  }
};


// Find user by token
const findUserByToken = async (token) => {
  try {
    const user = await User.findOne({ token }); // Find user by token
    return user;
  } catch (error) {
    throw new Error('Error finding user by token: ' + error.message);
  }
};

module.exports = {
  User,
  addUser,
  findUserByEmail,
  findUserByToken
};
