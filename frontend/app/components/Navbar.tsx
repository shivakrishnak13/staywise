'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { ROUTES, TOKEN_KEY, USER_KEY } from '@/app/lib/constants';
import { UserDocument } from '../types/auth';

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const [isAuth, setIsAuth] = useState(false);
  const [user, setUser] = useState<UserDocument | null>(null);
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const [role, setRole] = useState<string>('user');

  const loadUserData = () => {
    const authStatus = localStorage.getItem('isAuth');
    const userData = localStorage.getItem(USER_KEY);
    const userRole = userData ? JSON.parse(userData).role : 'user';
    
    if (authStatus === 'true' && userData) {
      setIsAuth(true);
      setUser(JSON.parse(userData));
    } else {
      setIsAuth(false);
      setUser(null);
    }
    
    if (userRole) {
      setRole(userRole);
    }
  };

  useEffect(() => {
    loadUserData();

    const handleAuthChange = () => {
      loadUserData();
    };

    window.addEventListener('authChange', handleAuthChange);

    return () => {
      window.removeEventListener('authChange', handleAuthChange);
    };
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getInitials = (name: string) => {
    if (!name) return 'U';
    const words = name.trim().split(' ');
    if (words.length >= 2) {
      return (words[0][0] + words[1][0]).toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  const handleLogout = () => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    localStorage.removeItem('isAuth');
    setIsAuth(false);
    setUser(null);
    setShowMenu(false);
    window.dispatchEvent(new Event('authChange'));
    router.push(ROUTES.LOGIN);
  };

  const isActive = (path: string) => {
    if (path === ROUTES.HOME) {
      return pathname === path;
    }
    return pathname.startsWith(path);
  };

  return (
    <nav className="bg-cardBg shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <a href={ROUTES.HOME} className="text-2xl font-bold text-primary">
              StayWise
            </a>
          </div>

          <div className="hidden md:flex space-x-8">
            <a 
              href={ROUTES.HOME} 
              className={`text-sm font-medium transition-colors ${
                isActive(ROUTES.HOME) ? 'text-primary' : 'text-textSecondary hover:text-primary'
              }`}
            >
              Home
            </a>
            <a 
              href={ROUTES.PROPERTIES} 
              className={`text-sm font-medium transition-colors ${
                isActive(ROUTES.PROPERTIES) ? 'text-primary' : 'text-textSecondary hover:text-primary'
              }`}
            >
              Properties
            </a>
            {isAuth && (
              <a 
                href={ROUTES.BOOKINGS} 
                className={`text-sm font-medium transition-colors ${
                  isActive(ROUTES.BOOKINGS) ? 'text-primary' : 'text-textSecondary hover:text-primary'
                }`}
              >
                My Bookings
              </a>
            )}
            {isAuth && role === 'admin' && (
              <a 
                href={ROUTES.ADMIN} 
                className={`text-sm font-medium transition-colors ${
                  isActive(ROUTES.ADMIN) ? 'text-primary' : 'text-textSecondary hover:text-primary'
                }`}
              >
                Admin
              </a>
            )}
          </div>

          <div className="flex items-center space-x-4">
            {!isAuth ? (
              <>
                <a href={ROUTES.LOGIN} className="text-sm font-medium text-textSecondary hover:text-primary transition-colors">
                  Login
                </a>
                <a href={ROUTES.SIGNUP} className="px-4 py-2 bg-primary text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors">
                  Sign Up
                </a>
              </>
            ) : (
              <div className="relative" ref={menuRef}>
                <button
                  onClick={() => setShowMenu(!showMenu)}
                  className="flex items-center justify-center w-10 h-10 rounded-full bg-primary text-white font-semibold text-sm hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                >
                  {user && getInitials(user.name)}
                </button>

                {showMenu && (
                  <div className="absolute right-0 mt-2 w-64 bg-cardBg rounded-lg shadow-lg border border-gray-200 py-2">
                    <div className="px-4 py-3 border-b border-gray-200">
                      <p className="text-sm font-semibold text-textPrimary truncate">
                        {user?.name}
                      </p>
                      <p className="text-xs text-textSecondary truncate mt-1">
                        {user?.email}
                      </p>
                    </div>
                    
                    <div className="py-2">
                      <a
                        href={ROUTES.PROPERTIES}
                        className="block px-4 py-2 text-sm text-textPrimary hover:bg-background transition-colors"
                        onClick={() => setShowMenu(false)}
                      >
                        Properties
                      </a>
                      <a
                        href={ROUTES.BOOKINGS}
                        className="block px-4 py-2 text-sm text-textPrimary hover:bg-background transition-colors"
                        onClick={() => setShowMenu(false)}
                      >
                        My Bookings
                      </a>
                      {role === 'admin' && (
                        <a
                          href={ROUTES.ADMIN}
                          className="block px-4 py-2 text-sm text-textPrimary hover:bg-background transition-colors"
                          onClick={() => setShowMenu(false)}
                        >
                          Admin Dashboard
                        </a>
                      )}
                    </div>

                    <div className="border-t border-gray-200 pt-2">
                      <button
                        onClick={handleLogout}
                        className="w-full text-left px-4 py-2 text-sm text-error hover:bg-red-50 transition-colors font-medium"
                      >
                        Logout
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
