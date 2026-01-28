
import React from 'react';
import { useTranslation } from 'react-i18next';
import { AudioToggle, GpsToggle } from './UIComponents';

export const LanguageSwitcher: React.FC = () => {
  const { i18n } = useTranslation();

  const changeLanguage = (lng: string) => {
    console.log('Changing language to:', lng);
    i18n.changeLanguage(lng);
    localStorage.setItem('i18nextLng', lng);
  };

  const currentLang = i18n.language || 'es';
  console.log('Current language:', currentLang);

  return (
    <div className="flex gap-4 items-center">
      {/* Language Buttons */}
      <div className="flex gap-2">
        {[
          { code: 'es', label: 'ES' },
          { code: 'eu', label: 'EU' },
          { code: 'en', label: 'EN' }
        ].map((lang) => {
          const isActive = currentLang.startsWith(lang.code);
          return (
            <button
              key={lang.code}
              onClick={() => changeLanguage(lang.code)}
              className={`
                px-4 py-2 text-sm font-bold rounded-lg transition-all duration-300
                ${isActive
                  ? 'bg-navarra-gold text-navarra-dark border-4 border-white shadow-lg scale-110'
                  : 'bg-black/60 text-navarra-gold border-2 border-navarra-gold/40 hover:border-navarra-gold hover:bg-black/80 hover:scale-105'}
              `}
            >
              {lang.label}
            </button>
          );
        })}
      </div>

      {/* Audio & GPS Control */}
      <div className="border-l border-navarra-gold/30 pl-4 flex items-center">
        <AudioToggle />
        <GpsToggle />
      </div>
    </div>
  );
};