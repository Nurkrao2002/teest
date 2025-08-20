const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const pool = require('../config/database');
const router = express.Router();

// Register
router.post('/register', async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      rev_rate,
      ball_speed,
      axis_tilt,
      axis_rotation,
      pap_horizontal,
      pap_vertical
    } = req.body;

    // Check if user already exists
    const existingUser = await pool.query(
      'SELECT id FROM users WHERE email = $1',
      [email]
    );

    if (existingUser.rows.length > 0) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Hash password
    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Create user
    const result = await pool.query(
      `INSERT INTO users (name, email, password, rev_rate, ball_speed, axis_tilt, axis_rotation, pap_horizontal, pap_vertical)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
       RETURNING id, name, email, rev_rate, ball_speed, axis_tilt, axis_rotation, pap_horizontal, pap_vertical`,
      [name, email, hashedPassword, rev_rate, ball_speed, axis_tilt, axis_rotation, pap_horizontal, pap_vertical]
    );

    const user = result.rows[0];

    // Generate JWT
    const token = jwt.sign(
      { userId: user.id },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.status(201).json({
      message: 'User created successfully',
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        rev_rate: user.rev_rate,
        ball_speed: user.ball_speed,
        axis_tilt: user.axis_tilt,
        axis_rotation: user.axis_rotation,
        pap_horizontal: user.pap_horizontal,
        pap_vertical: user.pap_vertical
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Server error during registration' });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user
    const result = await pool.query(
      'SELECT * FROM users WHERE email = $1',
      [email]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const user = result.rows[0];

    // Check password
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Generate JWT
    const token = jwt.sign(
      { userId: user.id },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        rev_rate: user.rev_rate,
        ball_speed: user.ball_speed,
        axis_tilt: user.axis_tilt,
        axis_rotation: user.axis_rotation,
        pap_horizontal: user.pap_horizontal,
        pap_vertical: user.pap_vertical
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error during login' });
  }
});

module.exports = router;