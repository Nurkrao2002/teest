import { Droplet, BarChartFill } from 'react-bootstrap-icons';

const PatternCard = ({ pattern, onSelect }) => {
  const getDifficultyColor = (difficulty) => {
    switch (difficulty?.toLowerCase()) {
      case 'easy': return 'text-success';
      case 'medium': return 'text-warning';
      case 'hard': return 'text-danger';
      default: return 'text-muted';
    }
  };

  const getCategoryBadge = (category) => {
    const colors = {
      'PBA': 'bg-primary',
      'WTBA': 'bg-secondary',
      'Kegel': 'bg-success',
      'Custom': 'bg-warning'
    };
    
    return colors[category] || 'bg-secondary';
  };

  return (
    <div className="card card-custom h-100" style={{cursor: 'pointer'}} onClick={() => onSelect?.(pattern)}>
      <div className="card-body">
        <div className="d-flex justify-content-between align-items-start mb-3">
          <div>
            <h5 className="card-title text-white mb-2">{pattern.name}</h5>
            <div className="d-flex align-items-center gap-2">
              <span className={`badge ${getCategoryBadge(pattern.category)} text-white`}>
                {pattern.category}
              </span>
              {pattern.difficulty && (
                <span className={`badge ${getDifficultyColor(pattern.difficulty)} bg-opacity-25`}>
                  {pattern.difficulty}
                </span>
              )}
            </div>
          </div>
          <Droplet className="text-info" size={24} />
        </div>

        <div className="mb-3">
          <div className="d-flex justify-content-between align-items-center mb-2">
            <span className="text-gray-400 small">Length:</span>
            <span className="text-white small">{pattern.length}"</span>
          </div>

          <div className="d-flex justify-content-between align-items-center mb-2">
            <span className="text-gray-400 small">Volume:</span>
            <span className="text-white small">{pattern.volume} mL</span>
          </div>

          {pattern.ratio && (
            <div className="d-flex justify-content-between align-items-center mb-2">
              <span className="text-gray-400 small">Ratio:</span>
              <span className="text-white small">{pattern.ratio}:1</span>
            </div>
          )}

          {pattern.forward_oil && (
            <div className="d-flex justify-content-between align-items-center">
              <span className="text-gray-400 small">Forward Oil:</span>
              <span className="text-white small">{pattern.forward_oil}"</span>
            </div>
          )}
        </div>

        {pattern.description && (
          <div className="border-top border-secondary pt-3 mb-3">
            <p className="text-gray-300 small mb-0">{pattern.description}</p>
          </div>
        )}

        <div className="d-flex justify-content-between align-items-center">
          <div className="d-flex align-items-center text-gray-400">
            <BarChartFill className="me-1" size={16} />
            <span className="small">Pattern Analysis</span>
          </div>
          <button className="btn btn-link btn-sm text-primary p-0">
            View Details
          </button>
        </div>
      </div>
    </div>
  );
};

export default PatternCard;