const express = require('express');
const pool = require('../config/database');
const { authenticateToken } = require('../middleware/auth');
const router = express.Router();

// Get all patterns
router.get('/', async (req, res) => {
  try {
    const { category } = req.query;
    
    let query = 'SELECT * FROM oil_patterns ORDER BY category, name';
    let params = [];
    
    if (category && category !== 'all') {
      query = 'SELECT * FROM oil_patterns WHERE category = $1 ORDER BY name';
      params = [category];
    }
    
    const result = await pool.query(query, params);
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching patterns:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get pattern by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query(
      'SELECT * FROM oil_patterns WHERE id = $1',
      [id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Pattern not found' });
    }
    
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error fetching pattern:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create custom pattern
router.post('/', authenticateToken, async (req, res) => {
  try {
    const {
      name,
      length,
      volume,
      ratio,
      forward_oil,
      description,
      difficulty
    } = req.body;
    
    const result = await pool.query(
      `INSERT INTO oil_patterns (name, category, length, volume, ratio, forward_oil, description, difficulty, created_by)
       VALUES ($1, 'Custom', $2, $3, $4, $5, $6, $7, $8)
       RETURNING *`,
      [name, length, volume, ratio, forward_oil, description, difficulty, req.user.id]
    );
    
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error creating pattern:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;