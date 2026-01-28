
import React from 'react';
import { useTranslation } from 'react-i18next';

interface BibliographyViewProps {
  onBack: () => void;
}

export const BibliographyView: React.FC<BibliographyViewProps> = ({ onBack }) => {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-navarra-dark text-navarra-parchment font-sans animate-fade-in">
      <div className="max-w-4xl mx-auto px-6 py-12">
        <button onClick={onBack} className="mb-8 text-navarra-gold hover:text-white flex items-center gap-2 uppercase tracking-widest text-xs font-bold transition-colors">
          {t('common.backToHome')}
        </button>

        <div className="text-center mb-12">
          <h2 className="text-4xl font-serif text-white mb-2">{t('biblioView.title')}</h2>
          <div className="h-1 w-24 bg-navarra-gold mx-auto"></div>
          <p className="text-gray-400 mt-4 italic">{t('biblioView.subtitle')}</p>
        </div>

        <div className="space-y-12">
            {/* Books */}
            <section className="bg-navarra-panel/50 p-8 rounded border border-navarra-stone">
                <h3 className="text-2xl font-serif text-navarra-gold mb-6 border-b border-navarra-gold/20 pb-2">{t('biblioView.booksTitle')}</h3>
                <ul className="space-y-4 text-gray-300">
                    <li className="flex gap-3 items-start">
                        <span className="text-navarra-crimson mt-1">❧</span>
                        <span><strong>EL EUSKERA EN TIERRA ESTELLA</strong> <span className="text-gray-500 text-sm">(J.M. Satrustegi)</span></span>
                    </li>
                    <li className="flex gap-3 items-start">
                         <span className="text-navarra-crimson mt-1">❧</span>
                        <span><strong>ESTELLA. INDUSTRIA, TRADICIÓN E HISTORIA</strong> <span className="text-gray-500 text-sm">(Joaquín ANSORENA CASAUS)</span></span>
                    </li>
                     <li className="flex gap-3 items-start">
                        <span className="text-navarra-crimson mt-1">❧</span>
                        <span><strong>ESTELLA, MIL AÑOS TE CONTEMPLAN</strong> <span className="text-gray-500 text-sm">(Jesús TANCO LERGA)</span></span>
                    </li>
                    <li className="flex gap-3 items-start">
                        <span className="text-navarra-crimson mt-1">❧</span>
                        <span><strong>Los Fuegos de la Merindad de Navarra en 1427</strong> <span className="text-gray-500 text-sm">(JESÚS ARRAIZA FRAUCA)</span></span>
                    </li>
                     <li className="flex gap-3 items-start">
                        <span className="text-navarra-crimson mt-1">❧</span>
                        <span><strong>Rutas por las juderías de España</strong> <span className="text-gray-500 text-sm">(Red de juderías de España)</span></span>
                    </li>
                    <li className="flex gap-3 items-start">
                        <span className="text-navarra-crimson mt-1">❧</span>
                        <span><strong>Estrellas y lises del barroco Estellés</strong> <span className="text-gray-500 text-sm">(Museo Gustavo de Maeztu)</span></span>
                    </li>
                    <li className="flex gap-3 items-start">
                        <span className="text-navarra-crimson mt-1">❧</span>
                        <span><strong>Organización del territorio estellés y la creación de Navarra</strong> <span className="text-gray-500 text-sm">(Javier Ilundain Chamarro)</span></span>
                    </li>
                    <li className="flex gap-3 items-start">
                        <span className="text-navarra-crimson mt-1">❧</span>
                        <span><strong>Minorías sociales en el fuero de Navarra</strong> <span className="text-gray-500 text-sm">(Xabier Irujo)</span></span>
                    </li>
                    <li className="flex gap-3 items-start">
                        <span className="text-navarra-crimson mt-1">❧</span>
                        <span><strong>MEMORIA 1ª FASE.- INFORMACIÓN Y ANÁLISIS PEAUP ESTELLA</strong> <span className="text-gray-500 text-sm">(Ayuntamiento de Navarra/Lizarra)</span></span>
                    </li>
                </ul>
            </section>

            {/* Webs */}
            <section className="bg-navarra-panel/50 p-8 rounded border border-navarra-stone">
                <h3 className="text-2xl font-serif text-navarra-gold mb-6 border-b border-navarra-gold/20 pb-2">{t('biblioView.websTitle')}</h3>
                <ul className="grid gap-6 md:grid-cols-2">
                    <li>
                        <a href="https://www.navarra-lizarra.com/turismo/" target="_blank" rel="noopener noreferrer" className="group block h-full p-4 bg-black/40 rounded hover:bg-black/60 transition-colors border border-transparent hover:border-navarra-gold/30">
                            <h4 className="text-white font-bold group-hover:text-navarra-gold transition-colors flex items-center gap-2">
                                {t('biblioView.webs.tourism')} ↗
                            </h4>
                            <p className="text-gray-400 text-sm mt-2">{t('biblioView.webs.tourismDesc')}</p>
                        </a>
                    </li>
                    <li>
                         <a href="http://www.estella.info" target="_blank" rel="noopener noreferrer" className="group block h-full p-4 bg-black/40 rounded hover:bg-black/60 transition-colors border border-transparent hover:border-navarra-gold/30">
                            <h4 className="text-white font-bold group-hover:text-navarra-gold transition-colors flex items-center gap-2">
                                {t('biblioView.webs.info')} ↗
                            </h4>
                            <p className="text-gray-400 text-sm mt-2">{t('biblioView.webs.infoDesc')}</p>
                         </a>
                    </li>
                    <li>
                        <a href="https://www.visitnavarra.es/es/navarra-lizarra" target="_blank" rel="noopener noreferrer" className="group block h-full p-4 bg-black/40 rounded hover:bg-black/60 transition-colors border border-transparent hover:border-navarra-gold/30">
                            <h4 className="text-white font-bold group-hover:text-navarra-gold transition-colors flex items-center gap-2">
                                {t('biblioView.webs.navarra')} ↗
                            </h4>
                            <p className="text-gray-400 text-sm mt-2">{t('biblioView.webs.navarraDesc')}</p>
                        </a>
                    </li>
                </ul>
            </section>

             {/* AI */}
            <section className="text-center">
                <h3 className="text-xl font-serif text-gray-500 mb-4 uppercase tracking-widest text-xs">{t('biblioView.aiTitle')}</h3>
                 <div className="flex gap-4 justify-center flex-wrap">
                    {['NotebookLM', 'ChatGPT', 'Claude'].map(tool => (
                        <span key={tool} className="bg-navarra-panel border border-navarra-gold/20 px-4 py-2 rounded-full text-navarra-gold text-sm font-bold shadow-sm">
                            🤖 {tool}
                        </span>
                    ))}
                 </div>
            </section>
        </div>
      </div>
    </div>
  );
};
