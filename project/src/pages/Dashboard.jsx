import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { TrendingUp, Target, Lightning, Calendar, ArrowRight } from 'react-bootstrap-icons';
import { performanceService } from '../services/performanceService';
import { authService } from '../services/authService';

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const user = authService.getCurrentUser();

  useEffect(() => {
    const fetchStats = async () => {
      if (!user) return;
      
      try {
        const data = await performanceService.getPerformanceStats(user.id);
        setStats(data);
      } catch (error) {
        console.error('Error fetching stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [user]);

  if (loading) {
    return (
      <div className="d-flex align-items-center justify-content-center" style={{minHeight: '16rem'}}>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="container-fluid">
      {/* Welcome Section */}
      <div className="text-center mb-5">
        <h1 className="display-4 fw-bold text-white mb-3">
          Welcome back, {user?.name || 'Bowler'}! 🎳
        </h1>
        <p className="fs-5 text-gray-400">
          Ready to improve your game? Let's analyze your performance and find the perfect ball.
        </p>
      </div>

      {/* Quick Stats */}
      {stats && (
        <div className="row g-4 mb-5">
          <div className="col-md-3">
            <div className="card card-custom text-center h-100">
              <div className="card-body">
                <div className="bg-primary rounded-circle d-flex align-items-center justify-content-center mx-auto mb-3" style={{width: '48px', height: '48px'}}>
                  <TrendingUp className="text-white" size={24} />
                </div>
                <h3 className="display-6 fw-bold text-white">{stats.averageScore || 0}</h3>
                <p className="text-gray-400 mb-0">Average Score</p>
              </div>
            </div>
          </div>

          <div className="col-md-3">
            <div className="card card-custom text-center h-100">
              <div className="card-body">
                <div className="bg-success rounded-circle d-flex align-items-center justify-content-center mx-auto mb-3" style={{width: '48px', height: '48px'}}>
                  <Target className="text-white" size={24} />
                </div>
                <h3 className="display-6 fw-bold text-white">{stats.carryPercentage || 0}%</h3>
                <p className="text-gray-400 mb-0">Carry %</p>
              </div>
            </div>
          </div>

          <div className="col-md-3">
            <div className="card card-custom text-center h-100">
              <div className="card-body">
                <div className="bg-warning rounded-circle d-flex align-items-center justify-content-center mx-auto mb-3" style={{width: '48px', height: '48px'}}>
                  <Lightning className="text-white" size={24} />
                </div>
                <h3 className="display-6 fw-bold text-white">{stats.entryAngle || 0}°</h3>
                <p className="text-gray-400 mb-0">Avg Entry Angle</p>
              </div>
            </div>
          </div>

          <div className="col-md-3">
            <div className="card card-custom text-center h-100">
              <div className="card-body">
                <div className="bg-secondary rounded-circle d-flex align-items-center justify-content-center mx-auto mb-3" style={{width: '48px', height: '48px'}}>
                  <Calendar className="text-white" size={24} />
                </div>
                <h3 className="display-6 fw-bold text-white">{stats.gamesPlayed || 0}</h3>
                <p className="text-gray-400 mb-0">Games This Month</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Quick Actions */}
      <div className="row g-4 mb-5">
        <div className="col-lg-3 col-md-6">
          <Link to="/recommendations" className="card card-custom text-decoration-none hover-bg-gray-750 h-100">
            <div className="card-body d-flex justify-content-between align-items-center">
              <div>
                <h5 className="card-title text-white mb-2">Get Recommendations</h5>
                <p className="text-gray-400 small mb-0">Find the perfect ball for your next game</p>
              </div>
              <ArrowRight className="text-primary" size={20} />
            </div>
          </Link>
        </div>

        <div className="col-lg-3 col-md-6">
          <Link to="/arsenal" className="card card-custom text-decoration-none hover-bg-gray-750 h-100">
            <div className="card-body d-flex justify-content-between align-items-center">
              <div>
                <h5 className="card-title text-white mb-2">Manage Arsenal</h5>
                <p className="text-gray-400 small mb-0">Track your bowling balls and maintenance</p>
              </div>
              <ArrowRight className="text-primary" size={20} />
            </div>
          </Link>
        </div>

        <div className="col-lg-3 col-md-6">
          <Link to="/patterns" className="card card-custom text-decoration-none hover-bg-gray-750 h-100">
            <div className="card-body d-flex justify-content-between align-items-center">
              <div>
                <h5 className="card-title text-white mb-2">Oil Patterns</h5>
                <p className="text-gray-400 small mb-0">Browse PBA, WTBA, and custom patterns</p>
              </div>
              <ArrowRight className="text-primary" size={20} />
            </div>
          </Link>
        </div>

        <div className="col-lg-3 col-md-6">
          <Link to="/performance" className="card card-custom text-decoration-none hover-bg-gray-750 h-100">
            <div className="card-body d-flex justify-content-between align-items-center">
              <div>
                <h5 className="card-title text-white mb-2">Track Performance</h5>
                <p className="text-gray-400 small mb-0">Log scores and analyze your progress</p>
              </div>
              <ArrowRight className="text-primary" size={20} />
            </div>
          </Link>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="card card-custom">
        <div className="card-body">
          <h2 className="h4 fw-semibold text-white mb-4">Recent Activity</h2>
          {stats?.recentGames?.length > 0 ? (
            <div className="list-group list-group-flush">
              {stats.recentGames.map((game, index) => (
                <div key={index} className="list-group-item bg-transparent border-secondary d-flex justify-content-between align-items-center">
                  <div>
                    <p className="text-white fw-medium mb-1">Game on {new Date(game.date).toLocaleDateString()}</p>
                    <p className="text-gray-400 small mb-0">{game.pattern_name} pattern</p>
                  </div>
                  <div className="text-end">
                    <p className="text-white fw-bold mb-1">{game.score}</p>
                    <p className="text-gray-400 small mb-0">{game.carry_percentage}% carry</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-5">
              <p className="text-gray-400">No recent games recorded</p>
              <Link to="/performance" className="btn btn-link text-primary p-0 mt-2">
                Log your first game →
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;