const express = require('express');
const pool = require('../config/database');
const { authenticateToken } = require('../middleware/auth');
const router = express.Router();

// Get all balls
router.get('/', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT * FROM balls 
      ORDER BY brand, name
    `);
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching balls:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get ball recommendations
router.post('/recommendations', authenticateToken, async (req, res) => {
  try {
    const { bowlerSpecs, oilPattern } = req.body;
    
    // Get all balls
    const ballsResult = await pool.query('SELECT * FROM balls');
    const balls = ballsResult.rows;
    
    // Calculate match scores for each ball
    const recommendations = balls.map(ball => {
      const matchScore = calculateMatchScore(ball, bowlerSpecs, oilPattern);
      return {
        ...ball,
        matchScore,
        recommendationReason: generateRecommendationReason(ball, oilPattern, matchScore)
      };
    });
    
    // Sort by match score and return top 10
    recommendations.sort((a, b) => b.matchScore - a.matchScore);
    
    res.json(recommendations.slice(0, 10));
  } catch (error) {
    console.error('Error getting recommendations:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Calculate match score based on the algorithm
function calculateMatchScore(ball, bowlerSpecs, oilPattern) {
  // Hook Fit Score (0-40 points)
  const hookFit = calculateHookFit(ball, bowlerSpecs, oilPattern);
  
  // Pattern Length Modifier (0-30 points)
  const patternLengthMod = calculatePatternLengthMod(ball, oilPattern);
  
  // Surface Score (0-20 points)
  const surfaceScore = calculateSurfaceScore(ball, oilPattern);
  
  // Layout Score (0-10 points) - simplified for now
  const layoutScore = 8;
  
  return Math.min(100, hookFit + patternLengthMod + surfaceScore + layoutScore);
}

function calculateHookFit(ball, bowlerSpecs, oilPattern) {
  const idealHook = calculateIdealHook(bowlerSpecs, oilPattern);
  const ballHook = ball.hook_potential * 2; // Scale to 0-10
  const difference = Math.abs(idealHook - ballHook);
  return Math.max(0, 40 - (difference * 4));
}

function calculateIdealHook(bowlerSpecs, oilPattern) {
  // Simplified calculation - in reality this would be more complex
  const baseHook = 5;
  const revRateModifier = (bowlerSpecs.rev_rate - 300) / 100;
  const speedModifier = (17 - bowlerSpecs.ball_speed) / 2;
  const patternModifier = (oilPattern.length - 39) / 10;
  
  return Math.max(1, Math.min(10, baseHook + revRateModifier + speedModifier - patternModifier));
}

function calculatePatternLengthMod(ball, oilPattern) {
  if (oilPattern.length <= 35) {
    // Short pattern - favor length and control
    return ball.length * 6;
  } else if (oilPattern.length >= 42) {
    // Long pattern - favor hook potential
    return ball.hook_potential * 6;
  } else {
    // Medium pattern - balanced approach
    return (ball.length + ball.hook_potential) * 3;
  }
}

function calculateSurfaceScore(ball, oilPattern) {
  // Simplified surface scoring
  const surfaceValue = parseInt(ball.surface) || 1500;
  
  if (oilPattern.volume > 25) {
    // Heavy oil - favor aggressive surfaces
    return surfaceValue < 2000 ? 20 : 10;
  } else {
    // Light oil - favor polished surfaces
    return surfaceValue > 3000 ? 20 : 10;
  }
}

function generateRecommendationReason(ball, oilPattern, matchScore) {
  if (matchScore >= 85) {
    return `Excellent match! This ball's ${ball.hook_potential}/5 hook potential is perfect for the ${oilPattern.name} pattern.`;
  } else if (matchScore >= 70) {
    return `Good match. The ${ball.surface} surface should work well on this ${oilPattern.length}" pattern.`;
  } else if (matchScore >= 55) {
    return `Decent option. Consider adjusting surface to optimize performance on this pattern.`;
  } else {
    return `May require significant surface adjustments or different layout for optimal performance.`;
  }
}

module.exports = router;