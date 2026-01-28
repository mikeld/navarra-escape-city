
import React from 'react';
import { useTranslation, Trans } from 'react-i18next';

interface AboutViewProps {
  onBack: () => void;
}

export const AboutView: React.FC<AboutViewProps> = ({ onBack }) => {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-navarra-dark text-navarra-parchment font-sans animate-fade-in flex flex-col">
      <div className="max-w-4xl mx-auto px-6 py-12 flex-grow w-full">
        <button onClick={onBack} className="mb-8 text-navarra-gold hover:text-white flex items-center gap-2 uppercase tracking-widest text-xs font-bold transition-colors">
          {t('common.backToHome')}
        </button>

        <div className="text-center mb-12">
          <h2 className="text-4xl font-serif text-white mb-2">{t('aboutView.title')}</h2>
          <div className="h-1 w-24 bg-navarra-gold mx-auto"></div>
        </div>

        <div className="grid gap-8">
          {/* DISCLAIMER */}
          <div className="bg-navarra-panel/80 p-8 rounded border border-navarra-stone">
            <h3 className="text-navarra-crimson font-bold text-xl mb-4 font-serif">{t('aboutView.warningTitle')}</h3>
            <p className="text-gray-300 leading-relaxed mb-4">
              <Trans i18nKey="aboutView.warningText" components={{ strong: <strong /> }} />
            </p>
            <p className="text-gray-400 text-sm italic">
              {t('aboutView.warningSub')}
            </p>
          </div>

          {/* AUTOR */}
          <div className="bg-gradient-to-br from-navarra-panel to-black p-8 rounded border border-navarra-gold/30 shadow-2xl">
            <div className="flex flex-col md:flex-row gap-8 items-center">
              <div className="flex-1 text-center md:text-left">
                <p className="text-navarra-gold uppercase tracking-widest text-xs font-bold mb-2">{t('aboutView.devBy')}</p>
                <h3 className="text-3xl font-serif text-white mb-4">Mikel Díaz</h3>
                <p className="text-xl text-gray-200 mb-6">{t('aboutView.role')}</p>
                
                <div className="space-y-2 text-gray-400 text-sm text-left mx-auto max-w-md md:mx-0 mb-8">
                  <p className="flex items-center gap-2">{t('aboutView.services.apps')}</p>
                  <p className="flex items-center gap-2">{t('aboutView.services.web')}</p>
                  <p className="flex items-center gap-2">{t('aboutView.services.ai')}</p>
                  <p className="flex items-center gap-2">{t('aboutView.services.automation')}</p>
                </div>
              </div>
            </div>

            {/* LINKS */}
            <div className="grid md:grid-cols-2 gap-6 mt-8 border-t border-gray-800 pt-8">
              <a 
                href="https://mikel-d-az-software-ia-navarra-2562567412.us-west1.run.app/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="group block bg-blue-900/20 border border-blue-800 hover:border-blue-400 p-6 rounded transition-all hover:-translate-y-1"
              >
                <h4 className="text-blue-300 font-bold text-lg mb-2 group-hover:text-blue-100">{t('aboutView.ctaProject')}</h4>
                <p className="text-gray-400 text-sm">{t('aboutView.ctaProjectDesc')}</p>
              </a>

              <a 
                href="https://www.mikeldiaz.es/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="group block bg-purple-900/20 border border-purple-800 hover:border-purple-400 p-6 rounded transition-all hover:-translate-y-1"
              >
                <h4 className="text-purple-300 font-bold text-lg mb-2 group-hover:text-purple-100">{t('aboutView.ctaPortfolio')}</h4>
                <p className="text-gray-400 text-sm">{t('aboutView.ctaPortfolioDesc')}</p>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
