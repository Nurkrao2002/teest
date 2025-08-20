import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';
import { authService } from '../services/authService';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    rev_rate: 350,
    ball_speed: 16,
    axis_tilt: 15,
    axis_rotation: 45,
    pap_horizontal: 5,
    pap_vertical: 0.5
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    try {
      const { confirmPassword, ...userData } = formData;
      await authService.register(userData);
      navigate('/');
    } catch (error) {
      setError(error.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const value = e.target.type === 'number' ? parseFloat(e.target.value) : e.target.value;
    setFormData({
      ...formData,
      [e.target.name]: value
    });
  };

  return (
    <div className="min-vh-100 d-flex align-items-center justify-content-center bg-gray-900 py-5">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-lg-8">
            <div className="text-center mb-4">
              <div className="d-inline-flex align-items-center justify-content-center bg-primary rounded-circle mb-3" style={{width: '64px', height: '64px'}}>
                <span className="text-white fw-bold fs-4">RR</span>
              </div>
              <h2 className="h3 fw-bold text-white">Create your account</h2>
              <p className="text-gray-400 mt-2">Join RollRite and improve your bowling game</p>
            </div>

            <form onSubmit={handleSubmit}>
              {error && (
                <div className="alert alert-danger bg-danger bg-opacity-25 border-danger text-danger mb-4">
                  {error}
                </div>
              )}

              {/* Basic Information */}
              <div className="card card-custom mb-4">
                <div className="card-body">
                  <h3 className="h5 fw-semibold text-white mb-4">Basic Information</h3>
                  <div className="row g-3">
                    <div className="col-md-6">
                      <label htmlFor="name" className="form-label text-gray-400 fw-medium">
                        Full Name
                      </label>
                      <input
                        id="name"
                        name="name"
                        type="text"
                        required
                        value={formData.name}
                        onChange={handleChange}
                        className="form-control form-control-custom"
                        placeholder="Enter your full name"
                      />
                    </div>

                    <div className="col-md-6">
                      <label htmlFor="email" className="form-label text-gray-400 fw-medium">
                        Email address
                      </label>
                      <input
                        id="email"
                        name="email"
                        type="email"
                        required
                        value={formData.email}
                        onChange={handleChange}
                        className="form-control form-control-custom"
                        placeholder="Enter your email"
                      />
                    </div>

                    <div className="col-md-6">
                      <label htmlFor="password" className="form-label text-gray-400 fw-medium">
                        Password
                      </label>
                      <div className="position-relative">
                        <input
                          id="password"
                          name="password"
                          type={showPassword ? 'text' : 'password'}
                          required
                          value={formData.password}
                          onChange={handleChange}
                          className="form-control form-control-custom pe-5"
                          placeholder="Create a password"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="btn position-absolute top-50 end-0 translate-middle-y me-2 p-1 text-gray-400"
                          style={{border: 'none', background: 'none'}}
                        >
                          {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                        </button>
                      </div>
                    </div>

                    <div className="col-md-6">
                      <label htmlFor="confirmPassword" className="form-label text-gray-400 fw-medium">
                        Confirm Password
                      </label>
                      <div className="position-relative">
                        <input
                          id="confirmPassword"
                          name="confirmPassword"
                          type={showConfirmPassword ? 'text' : 'password'}
                          required
                          value={formData.confirmPassword}
                          onChange={handleChange}
                          className="form-control form-control-custom pe-5"
                          placeholder="Confirm your password"
                        />
                        <button
                          type="button"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          className="btn position-absolute top-50 end-0 translate-middle-y me-2 p-1 text-gray-400"
                          style={{border: 'none', background: 'none'}}
                        >
                          {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Bowling Specifications */}
              <div className="card card-custom mb-4">
                <div className="card-body">
                  <h3 className="h5 fw-semibold text-white mb-3">Bowling Specifications</h3>
                  <p className="text-gray-400 small mb-4">
                    These help us provide better ball recommendations. You can update these later.
                  </p>
                  <div className="row g-3">
                    <div className="col-md-4">
                      <label htmlFor="rev_rate" className="form-label text-gray-400 fw-medium">
                        Rev Rate (RPM)
                      </label>
                      <input
                        id="rev_rate"
                        name="rev_rate"
                        type="number"
                        value={formData.rev_rate}
                        onChange={handleChange}
                        className="form-control form-control-custom"
                      />
                    </div>

                    <div className="col-md-4">
                      <label htmlFor="ball_speed" className="form-label text-gray-400 fw-medium">
                        Ball Speed (MPH)
                      </label>
                      <input
                        id="ball_speed"
                        name="ball_speed"
                        type="number"
                        value={formData.ball_speed}
                        onChange={handleChange}
                        className="form-control form-control-custom"
                      />
                    </div>

                    <div className="col-md-4">
                      <label htmlFor="axis_tilt" className="form-label text-gray-400 fw-medium">
                        Axis Tilt (°)
                      </label>
                      <input
                        id="axis_tilt"
                        name="axis_tilt"
                        type="number"
                        value={formData.axis_tilt}
                        onChange={handleChange}
                        className="form-control form-control-custom"
                      />
                    </div>

                    <div className="col-md-4">
                      <label htmlFor="axis_rotation" className="form-label text-gray-400 fw-medium">
                        Axis Rotation (°)
                      </label>
                      <input
                        id="axis_rotation"
                        name="axis_rotation"
                        type="number"
                        value={formData.axis_rotation}
                        onChange={handleChange}
                        className="form-control form-control-custom"
                      />
                    </div>

                    <div className="col-md-4">
                      <label htmlFor="pap_horizontal" className="form-label text-gray-400 fw-medium">
                        PAP Horizontal (")
                      </label>
                      <input
                        id="pap_horizontal"
                        name="pap_horizontal"
                        type="number"
                        step="0.1"
                        value={formData.pap_horizontal}
                        onChange={handleChange}
                        className="form-control form-control-custom"
                      />
                    </div>

                    <div className="col-md-4">
                      <label htmlFor="pap_vertical" className="form-label text-gray-400 fw-medium">
                        PAP Vertical (")
                      </label>
                      <input
                        id="pap_vertical"
                        name="pap_vertical"
                        type="number"
                        step="0.1"
                        value={formData.pap_vertical}
                        onChange={handleChange}
                        className="form-control form-control-custom"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="mb-4">
                <button
                  type="submit"
                  disabled={loading}
                  className="btn btn-primary-custom w-100 d-flex align-items-center justify-content-center"
                >
                  {loading ? (
                    <div className="spinner-border spinner-border-sm text-white" role="status">
                      <span className="visually-hidden">Loading...</span>
                    </div>
                  ) : (
                    'Create Account'
                  )}
                </button>
              </div>

              <div className="text-center">
                <p className="text-gray-400 mb-0">
                  Already have an account?{' '}
                  <Link to="/login" className="text-primary text-decoration-none fw-medium">
                    Sign in
                  </Link>
                </p>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;