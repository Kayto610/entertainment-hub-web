import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';

const Navbar = ({ searchTerm, setSearchTerm, showSearch = true }) => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="border-b border-[#1e293b] bg-[#0b111e] px-8 py-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        {/* Brand Logo */}
        <Link to="/" className="text-xl font-bold tracking-wider text-white">
          ENTERTAINMENT<span className="text-[#5d5fef]">.HUB</span>
        </Link>

        {/* Search Input Bar (hanya tampil jika dibutuhkan) */}
        {showSearch && (
          <div className="relative flex-1 max-w-md hidden md:block">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search movies, series, music..."
              value={searchTerm}
              onChange={(e) => setSearchTerm && setSearchTerm(e.target.value)}
              className="w-full bg-[#131b2e] border border-[#1e293b] rounded-md py-2 pl-10 pr-4 text-sm text-white placeholder-slate-400 focus:outline-none focus:border-[#5d5fef]"
            />
          </div>
        )}

        {/* Logout Button */}
        {user ? (
          <button
            onClick={handleLogout}
            className="border border-[#1e293b] hover:border-slate-600 bg-[#131b2e] text-slate-200 text-sm font-medium px-5 py-2 rounded-md transition"
          >
            Logout
          </button>
        ) : (
          <Link
            to="/login"
            className="border border-[#1e293b] hover:border-slate-600 bg-[#131b2e] text-slate-200 text-sm font-medium px-5 py-2 rounded-md transition"
          >
            Sign In
          </Link>
        )}
      </div>
    </nav>
  );
};

export default Navbar;