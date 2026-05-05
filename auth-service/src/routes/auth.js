const express = require('express'); 
const bcrypt = require('bcrypt'); 
const jwt = require('jsonwebtoken'); 
const User = require('../models/User'); 

const router = express.Router(); 

// Inscription 
router.post('/register', async (req, res) => { 
  try {
    const { username, password } = req.body; 
    const hashed = await bcrypt.hash(password, 10); 
    const user = await User.create({ username, password: hashed }); 
    res.status(201).json({ id: user._id, username: user.username }); 
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}); 

// Connexion 
router.post('/login', async (req, res) => { 
  try {
    const { username, password } = req.body; 
    const user = await User.findOne({ username }); 
    if (!user || !(await bcrypt.compare(password, user.password))) { 
      return res.status(401).json({ message: 'Identifiants invalides' }); 
    } 
    const token = jwt.sign( 
      { userId: user._id, username: user.username }, 
      process.env.JWT_SECRET || 'votre_secret_jwt_ici', 
      { expiresIn: '1h' } 
    ); 
    res.json({ token }); 
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}); 

module.exports = router;
