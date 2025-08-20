import { useState, useEffect } from 'react';
import { Plus, PencilSquare, Trash, Calendar } from 'react-bootstrap-icons';
import { ballService } from '../services/ballService';
import { authService } from '../services/authService';

const Arsenal = () => {
  const [arsenal, setArsenal] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const user = authService.getCurrentUser();

  useEffect(() => {
    const fetchArsenal = async () => {
      if (!user) return;
      
      try {
        const data = await ballService.getUserArsenal(user.id);
        setArsenal(data);
      } catch (error) {
        console.error('Error fetching arsenal:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchArsenal();
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
      <div className="d-flex justify-content-between align-items-center mb-5">
        <div>
          <h1 className="display-5 fw-bold text-white mb-3">My Arsenal</h1>
          <p className="text-gray-400">
            Manage your bowling balls, track surface changes, and monitor usage
          </p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="btn btn-primary-custom d-flex align-items-center"
        >
          <Plus className="me-2" size={20} />
          <span>Add Ball</span>
        </button>
      </div>

      {arsenal.length === 0 ? (
        <div className="card card-custom text-center">
          <div className="card-body py-5">
            <div className="bg-gray-700 rounded-circle d-flex align-items-center justify-content-center mx-auto mb-4" style={{width: '64px', height: '64px'}}>
              <Plus className="text-gray-400" size={32} />
            </div>
            <h3 className="h4 fw-semibold text-white mb-3">No balls in your arsenal</h3>
            <p className="text-gray-400 mb-4">Add your first bowling ball to start tracking performance</p>
            <button
              onClick={() => setShowAddModal(true)}
              className="btn btn-primary-custom"
            >
              Add Your First Ball
            </button>
          </div>
        </div>
      ) : (
        <div className="row g-4">
          {arsenal.map((ball) => (
            <div key={ball.id} className="col-lg-4 col-md-6">
              <div className="card card-custom h-100">
                <div className="card-body">
                  <div className="d-flex justify-content-between align-items-start mb-3">
                    <div>
                      <h5 className="card-title text-white mb-1">{ball.ball_name}</h5>
                      <p className="text-gray-400 mb-0">{ball.brand}</p>
                    </div>
                    <div className="dropdown">
                      <button className="btn btn-link text-gray-400 p-1" type="button" data-bs-toggle="dropdown">
                        <PencilSquare size={16} />
                      </button>
                      <ul className="dropdown-menu dropdown-menu-end bg-gray-800 border-secondary">
                        <li><button className="dropdown-item text-gray-300">Edit</button></li>
                        <li><button className="dropdown-item text-danger">Delete</button></li>
                      </ul>
                    </div>
                  </div>

                  <div className="mb-3">
                    <div className="d-flex justify-content-between align-items-center mb-2">
                      <span className="text-gray-400 small">Current Surface:</span>
                      <span className="text-white small">{ball.current_surface}</span>
                    </div>

                    <div className="d-flex justify-content-between align-items-center mb-2">
                      <span className="text-gray-400 small">Layout:</span>
                      <span className="text-white small">{ball.layout || 'Not specified'}</span>
                    </div>

                    <div className="d-flex justify-content-between align-items-center mb-2">
                      <span className="text-gray-400 small">Games Played:</span>
                      <span className="text-white small">{ball.games_played || 0}</span>
                    </div>

                    <div className="d-flex justify-content-between align-items-center">
                      <span className="text-gray-400 small">Last Used:</span>
                      <span className="text-white small">
                        {ball.last_used ? new Date(ball.last_used).toLocaleDateString() : 'Never'}
                      </span>
                    </div>
                  </div>

                  <div className="border-top border-secondary pt-3 mb-3">
                    <div className="row g-2">
                      <div className="col-6">
                        <button className="btn btn-secondary-custom btn-sm w-100">
                          Log Usage
                        </button>
                      </div>
                      <div className="col-6">
                        <button className="btn btn-secondary-custom btn-sm w-100">
                          Update Surface
                        </button>
                      </div>
                    </div>
                  </div>

                  {ball.surface_history && ball.surface_history.length > 0 && (
                    <div className="border-top border-secondary pt-3">
                      <h6 className="text-white mb-2">Surface History</h6>
                      <div className="list-group list-group-flush">
                        {ball.surface_history.slice(0, 3).map((entry, index) => (
                          <div key={index} className="list-group-item bg-transparent border-0 px-0 py-1 d-flex justify-content-between">
                            <span className="text-gray-400 small">{entry.surface}</span>
                            <span className="text-gray-500 small">
                              {new Date(entry.date).toLocaleDateString()}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Arsenal;