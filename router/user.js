// routes/userRoutes.js

const express = require('express');
const User = require('../models/user');
const router = express.Router();

const bcrypt = require('bcryptjs'); // Import bcrypt for hashing

// router.post('/users/login', async (req, res) => {
//   const { username, password ,selected} = req.body;

//   try {
//     // Hash the password before saving it
//     const hashedPassword = await bcrypt.hash(password, 10); // 10 is the salt rounds

//     // Create the user with the hashed password
//     const newUser = new User({ username, password: hashedPassword,person:selected });
//     await newUser.save();

//     res.status(201).json({ message: 'User created successfully', user: newUser });
//   } catch (err) {
//     res.status(400).json({ message: 'Error creating user', error: err.message });
//   }
// });
router.post('/users/register', async (req, res) => {
  const { username, password, selected } = req.body;
  console.log('Register body:', req.body);

  try {
    // Check if the username already exists
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ message: 'Username already exists' });
    }

    // Hash the password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Create a new user
    const newUser = new User({
      username,
      password: hashedPassword,
      person: selected, // Assuming you store "selected" into "person" field
    });

    // Save to the database
    await newUser.save();

    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: error.message });
  }
});

router.post('/users/login', async (req, res) => {
const { username, password ,selected} = req.body;
console.log(req.body);

  console.log(username, password ,selected)
  

  try {

    const user = await User.findOne({ username });
    // const person=  await User.findOne({ selected });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    if (user.person !== selected) {
        return res.status(403).json({ message: 'Unauthorized role' });
      }
 console.log(user.person);
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Optionally generate a token here
    res.status(200).json({ username});
   
   }
catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Route to get all users
router.get('/users', async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (err) {
    res.status(400).json({ message: 'Error fetching users', error: err.message });
  }
});

module.exports = router;
