const express = require('express');
const pool = require('../config/database');
const { authenticateToken } = require('../middleware/auth');
const router = express.Router();

// Get user arsenal
router.get('/:userId/arsenal', authenticateToken, async (req, res) => {
  try {
    const { userId } = req.params;
    
    // Ensure user can only access their own arsenal
    if (parseInt(userId) !== req.user.id) {
      return res.status(403).json({ message: 'Access denied' });
    }
    
    const result = await pool.query(`
      SELECT a.*, b.name as ball_name, b.brand, b.hook_potential, b.length, b.backend
      FROM arsenal a
      JOIN balls b ON a.ball_id = b.id
      WHERE a.user_id = $1
      ORDER BY a.created_at DESC
    `, [userId]);
    
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching arsenal:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Add ball to arsenal
router.post('/:userId/arsenal', authenticateToken, async (req, res) => {
  try {
    const { userId } = req.params;
    const { ball_id, layout, current_surface, purchase_date } = req.body;
    
    // Ensure user can only modify their own arsenal
    if (parseInt(userId) !== req.user.id) {
      return res.status(403).json({ message: 'Access denied' });
    }
    
    const result = await pool.query(
      `INSERT INTO arsenal (user_id, ball_id, layout, current_surface, purchase_date)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [userId, ball_id, layout, current_surface, purchase_date]
    );
    
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error adding to arsenal:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Log performance
router.post('/:userId/performance', authenticateToken, async (req, res) => {
  try {
    const { userId } = req.params;
    const {
      pattern_id,
      ball_used_id,
      score,
      carry_percentage,
      entry_angle,
      game_date,
      notes
    } = req.body;
    
    // Ensure user can only log their own performance
    if (parseInt(userId) !== req.user.id) {
      return res.status(403).json({ message: 'Access denied' });
    }
    
    const result = await pool.query(
      `INSERT INTO performance_logs (user_id, pattern_id, ball_used_id, score, carry_percentage, entry_angle, game_date, notes)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
       RETURNING *`,
      [userId, pattern_id, ball_used_id, score, carry_percentage, entry_angle, game_date, notes]
    );
    
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error logging performance:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get performance stats
router.get('/:userId/performance', authenticateToken, async (req, res) => {
  try {
    const { userId } = req.params;
    const { timeframe = '30d' } = req.query;
    
    // Ensure user can only access their own performance
    if (parseInt(userId) !== req.user.id) {
      return res.status(403).json({ message: 'Access denied' });
    }
    
    // Calculate date range
    let dateFilter = '';
    switch (timeframe) {
      case '7d':
        dateFilter = "AND game_date >= NOW() - INTERVAL '7 days'";
        break;
      case '30d':
        dateFilter = "AND game_date >= NOW() - INTERVAL '30 days'";
        break;
      case '90d':
        dateFilter = "AND game_date >= NOW() - INTERVAL '90 days'";
        break;
      case '1y':
        dateFilter = "AND game_date >= NOW() - INTERVAL '1 year'";
        break;
    }
    
    // Get performance stats
    const statsResult = await pool.query(`
      SELECT 
        ROUND(AVG(score), 1) as average_score,
        ROUND(AVG(carry_percentage), 1) as carry_percentage,
        ROUND(AVG(entry_angle), 1) as entry_angle,
        COUNT(*) as games_played
      FROM performance_logs 
      WHERE user_id = $1 ${dateFilter}
    `, [userId]);
    
    // Get recent games
    const recentGamesResult = await pool.query(`
      SELECT 
        pl.*,
        op.name as pattern_name,
        b.name as ball_name
      FROM performance_logs pl
      LEFT JOIN oil_patterns op ON pl.pattern_id = op.id
      LEFT JOIN balls b ON pl.ball_used_id = b.id
      WHERE pl.user_id = $1
      ORDER BY pl.game_date DESC
      LIMIT 10
    `, [userId]);
    
    const stats = statsResult.rows[0];
    const recentGames = recentGamesResult.rows;
    
    res.json({
      ...stats,
      recentGames
    });
  } catch (error) {
    console.error('Error fetching performance stats:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get performance trends
router.get('/:userId/performance/trends', authenticateToken, async (req, res) => {
  try {
    const { userId } = req.params;
    
    // Ensure user can only access their own performance
    if (parseInt(userId) !== req.user.id) {
      return res.status(403).json({ message: 'Access denied' });
    }
    
    const result = await pool.query(`
      SELECT 
        DATE_TRUNC('week', game_date) as week,
        ROUND(AVG(score), 1) as avg_score,
        ROUND(AVG(carry_percentage), 1) as avg_carry,
        COUNT(*) as games
      FROM performance_logs 
      WHERE user_id = $1 
        AND game_date >= NOW() - INTERVAL '6 months'
      GROUP BY DATE_TRUNC('week', game_date)
      ORDER BY week
    `, [userId]);
    
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching performance trends:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;