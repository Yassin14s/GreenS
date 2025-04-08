import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Leaf, LogOut, Shield } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
import LanguageSwitch from './LanguageSwitch';

export default function Navigation() {
  const location = useLocation();
  const { currentUser, logout } = useAuth();
  const { t } = useLanguage();

  const isActive = (path: string) => location.pathname === path;
  const isAdminRoute = location.pathname.startsWith('/admin');

  if (isAdminRoute) {
    return null;
  }

  return (
    <nav className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center group">
              <Leaf className="h-8 w-8 text-green-600 transform group-hover:scale-110 transition-transform duration-200" />
              <span className="ml-2 text-xl font-bold text-gray-900 group-hover:text-green-600 transition-colors duration-200">
                GreenSign
              </span>
            </Link>
          </div>

          <div className="flex items-center space-x-4">
            <LanguageSwitch />
            {!currentUser ? (
              <>
                <Link
                  to="/about"
                  className={`${
                    isActive('/about')
                      ? 'text-green-600'
                      : 'text-gray-700 hover:text-green-600'
                  } px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200`}
                >
                  {t('nav.about')}
                </Link>
                <Link
                  to="/contact"
                  className={`${
                    isActive('/contact')
                      ? 'text-green-600'
                      : 'text-gray-700 hover:text-green-600'
                  } px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200`}
                >
                  {t('nav.contact')}
                </Link>
                <Link
                  to="/admin-login"
                  className="flex items-center text-gray-700 hover:text-green-600 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200"
                >
                  <Shield className="h-4 w-4 mr-2" />
                  {t('nav.admin')}
                </Link>
                <Link
                  to="/login"
                  className="text-green-600 hover:text-green-700 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200"
                >
                  {t('nav.login')}
                </Link>
                <Link
                  to="/register"
                  className="bg-green-600 text-white hover:bg-green-700 px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200 transform hover:scale-105"
                >
                  {t('nav.register')}
                </Link>
              </>
            ) : (
              <>
                <Link
                  to="/dashboard"
                  className={`${
                    isActive('/dashboard')
                      ? 'text-green-600'
                      : 'text-gray-700 hover:text-green-600'
                  } px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200`}
                >
                  {t('nav.dashboard')}
                </Link>
                <Link
                  to="/admin-login"
                  className="flex items-center text-gray-700 hover:text-green-600 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200"
                >
                  <Shield className="h-4 w-4 mr-2" />
                  {t('nav.admin')}
                </Link>
                <button
                  onClick={() => logout()}
                  className="flex items-center text-gray-700 hover:text-red-600 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200"
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  {t('nav.logout')}
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}