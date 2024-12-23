// src/components/Navbar.jsx
import { Link, useLocation } from 'react-router-dom';

function Navbar() {
  const location = useLocation();

  return (
    <nav className="bg-dark-200 border-b border-dark-100">
      <div className="container mx-auto px-4 py-3">
        <div className="flex justify-between items-center max-w-5xl mx-auto">
          <div className="flex items-center space-x-3">
            <div className="bg-blue-600 text-white p-2 rounded">
              <span className="font-bold">LMS</span>
            </div>
            <span className="text-xl font-semibold text-gray-100">
              Lead Management
            </span>
          </div>
          <ul className="flex space-x-8">
            <li>
              <Link 
                to="/" 
                className={`${
                  location.pathname === '/' 
                    ? 'text-blue-400' 
                    : 'text-gray-400 hover:text-gray-300'
                } transition-colors`}
              >
                Dashboard
              </Link>
            </li>
            <li>
              <Link 
                to="/leads" 
                className={`${
                  location.pathname.includes('/leads') 
                    ? 'text-blue-400' 
                    : 'text-gray-400 hover:text-gray-300'
                } transition-colors`}
              >
                Leads
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;