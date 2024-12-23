// src/components/Navbar.jsx
import { Link, useLocation } from 'react-router-dom';

function Navbar() {
  const location = useLocation();

  return (
    <nav className="bg-white shadow-lg p-4">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <div className="bg-blue-600 text-white p-2 rounded-full">
            <span className="font-bold text-lg">LMS</span>
          </div>
          <div className="text-gray-800 text-2xl font-bold">
            <h1>Lead Management System</h1>
          </div>
        </div>
        <ul className="flex space-x-8">
          <li className={location.pathname === '/' ? 'text-blue-600' : 'text-gray-600'}>
            <Link to="/" className="hover:text-blue-600 transition">Dashboard</Link>
          </li>
          <li className={location.pathname.includes('/leads') ? 'text-blue-600' : 'text-gray-600'}>
            <Link to="/leads" className="hover:text-blue-600 transition">Leads</Link>
          </li>
        </ul>
      </div>
    </nav>
  );
}

export default Navbar;