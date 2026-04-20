import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  return (
    <nav className="bg-indigo-600 p-4 shadow-md">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <Link to="/" className="text-white text-2xl font-bold">Job Portal</Link>
        <div className="flex items-center space-x-4">
          <Link to="/jobs" className="text-white hover:text-indigo-200">Jobs</Link>
          
          {isAuthenticated ? (
            <>
              <Link to="/dashboard" className="text-white hover:text-indigo-200">Dashboard</Link>
              
              {/* Show Post Job for companies */}
              {user?.role === 'company' && (
                <Link to="/jobs/create" className="text-white hover:text-indigo-200">Post Job</Link>
              )}
              
              {/* Show user info */}
              <span className="text-white text-sm">
                Hi, {user?.name}
                <span className="ml-2 text-xs bg-indigo-800 px-2 py-1 rounded">
                  {user?.role === 'company' ? 'HR' : user?.role}
                </span>
              </span>
              
              <button 
                onClick={handleLogout} 
                className="text-white hover:text-indigo-200 bg-indigo-700 px-3 py-1 rounded"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="text-white hover:text-indigo-200">Login</Link>
              <Link 
                to="/register" 
                className="text-white bg-indigo-700 px-3 py-1 rounded hover:bg-indigo-800"
              >
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;