import React from 'react';
import { Link } from 'react-router-dom';
import { Leaf, Shield, CheckCircle, Lock } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';

export default function Home() {
  const { currentUser } = useAuth();
  const { t } = useLanguage();

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white">
      {/* Hero Section */}
      <div className="relative">
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ 
            backgroundImage: 'url(https://images.unsplash.com/photo-1554774853-aae0a22c8aa4?auto=format&fit=crop&q=80&w=1920)',
            opacity: 0.15
          }}
        />
        <div className="relative min-h-[600px] flex items-center justify-center px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-4xl mx-auto">
            <div className="flex justify-center items-center mb-8">
              <Leaf className="h-16 w-16 text-green-600 animate-bounce" />
            </div>
            <h1 className="text-4xl tracking-tight font-extrabold text-gray-900 sm:text-5xl md:text-6xl">
              <span className="block animate-fade-in">{t('home.hero.title')}</span>
              <span className="block text-green-600 animate-fade-in-delay">
                {t('home.hero.subtitle')}
              </span>
            </h1>
            <p className="mt-3 max-w-md mx-auto text-base text-gray-600 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl animate-fade-in-delay-2">
              {t('home.hero.description')}
            </p>
            <div className="mt-5 max-w-md mx-auto sm:flex sm:justify-center md:mt-8 animate-fade-in-delay-3">
              {currentUser ? (
                <div className="rounded-md shadow">
                  <Link
                    to="/dashboard"
                    className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-green-600 hover:bg-green-700 md:py-4 md:text-lg md:px-10 transition-all duration-200 transform hover:scale-105"
                  >
                    {t('home.cta.dashboard')}
                  </Link>
                </div>
              ) : (
                <>
                  <div className="rounded-md shadow">
                    <Link
                      to="/register"
                      className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-green-600 hover:bg-green-700 md:py-4 md:text-lg md:px-10 transition-all duration-200 transform hover:scale-105"
                    >
                      {t('home.cta.getStarted')}
                    </Link>
                  </div>
                  <div className="mt-3 rounded-md shadow sm:mt-0 sm:ml-3">
                    <Link
                      to="/login"
                      className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-green-600 bg-white hover:bg-gray-50 md:py-4 md:text-lg md:px-10 transition-all duration-200"
                    >
                      {t('home.cta.signIn')}
                    </Link>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="bg-white py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
              {t('home.why.title')}
            </h2>
            <p className="mt-4 text-xl text-gray-600">
              {t('home.why.subtitle')}
            </p>
          </div>

          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            <div className="p-6 bg-green-50 rounded-lg transform transition-all duration-200 hover:scale-105">
              <Lock className="h-12 w-12 text-green-600" />
              <h3 className="mt-4 text-xl font-semibold text-gray-900">
                {t('home.feature.security')}
              </h3>
              <p className="mt-2 text-gray-600">
                {t('home.feature.security.desc')}
              </p>
            </div>
            <div className="p-6 bg-green-50 rounded-lg transform transition-all duration-200 hover:scale-105">
              <Shield className="h-12 w-12 text-green-600" />
              <h3 className="mt-4 text-xl font-semibold text-gray-900">
                {t('home.feature.compliance')}
              </h3>
              <p className="mt-2 text-gray-600">
                {t('home.feature.compliance.desc')}
              </p>
            </div>
            <div className="p-6 bg-green-50 rounded-lg transform transition-all duration-200 hover:scale-105">
              <CheckCircle className="h-12 w-12 text-green-600" />
              <h3 className="mt-4 text-xl font-semibold text-gray-900">
                {t('home.feature.verification')}
              </h3>
              <p className="mt-2 text-gray-600">
                {t('home.feature.verification.desc')}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <p className="text-gray-500 text-sm">
              {t('home.footer.developedBy')} Yassin BRAHIM
            </p>
            <div className="mt-2 flex justify-center space-x-6">
              <Link to="/about" className="text-gray-400 hover:text-gray-500">
                {t('nav.about')}
              </Link>
              <Link to="/contact" className="text-gray-400 hover:text-gray-500">
                {t('nav.contact')}
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}