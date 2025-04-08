import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { Globe } from 'lucide-react';

export default function LanguageSwitch() {
  const { language, setLanguage } = useLanguage();

  return (
    <button
      onClick={() => setLanguage(language === 'en' ? 'fr' : 'en')}
      className="flex items-center space-x-1 text-gray-600 hover:text-green-600 transition-colors duration-200"
      title={language === 'en' ? 'Changer en français' : 'Switch to English'}
    >
      <Globe className="h-4 w-4" />
      <span className="text-sm font-medium uppercase">{language}</span>
    </button>
  );
}