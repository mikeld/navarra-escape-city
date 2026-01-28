
import React, { useState } from 'react';
import { SafeImage } from '../../UIComponents';
import { Character } from '../../../types';
import { useTranslation } from 'react-i18next';

interface CharactersViewProps {
  onBack: () => void;
  characters: Character[];
}

type FilterType = 'ALL' | 'HISTORICAL' | 'FICTIONAL';
type CategoryFilter = 'ALL' | 'Realeza' | 'Militar' | 'Religión' | 'Cultura' | 'Sociedad' | 'Política' | 'Juego';

export const CharactersView: React.FC<CharactersViewProps> = ({ onBack, characters }) => {
  const { t } = useTranslation();
  const [charFilterType, setCharFilterType] = useState<FilterType>('ALL');
  const [charCategory, setCharCategory] = useState<CategoryFilter>('ALL');

  const filteredCharacters = characters.filter(char => {
    if (charFilterType === 'HISTORICAL' && char.isFictional) return false;
    if (charFilterType === 'FICTIONAL' && !char.isFictional) return false;
    if (charCategory !== 'ALL' && char.category !== charCategory) return false;
    return true;
  });

  return (
    <div className="min-h-screen bg-navarra-dark text-navarra-parchment font-sans animate-fade-in">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <button onClick={onBack} className="mb-8 text-navarra-gold hover:text-white flex items-center gap-2 uppercase tracking-widest text-xs font-bold transition-colors">
          {t('common.backToHome')}
        </button>

        <div className="text-center mb-12">
          <span className="text-navarra-gold text-xs uppercase tracking-[0.3em] font-bold">{t('charactersView.tag')}</span>
          <h2 className="text-4xl md:text-6xl font-serif text-white mt-4">{t('charactersView.title')}</h2>
          <p className="text-gray-400 mt-4 max-w-xl mx-auto">{t('charactersView.subtitle')}</p>
        </div>

        {/* FILTER CONTROLS */}
        <div className="mb-12 space-y-6">
          <div className="flex justify-center gap-4">
            {[
              { id: 'ALL', label: t('charactersView.filters.all') },
              { id: 'HISTORICAL', label: t('charactersView.filters.historical') },
              { id: 'FICTIONAL', label: t('charactersView.filters.fictional') }
            ].map((filter) => (
              <button
                key={filter.id}
                onClick={() => { setCharFilterType(filter.id as FilterType); setCharCategory('ALL'); }}
                className={`px-6 py-3 rounded-full border transition-all uppercase tracking-wider text-sm font-bold
                                  ${charFilterType === filter.id
                    ? 'bg-navarra-gold text-black border-navarra-gold shadow-[0_0_15px_rgba(212,175,55,0.4)]'
                    : 'bg-black/40 text-gray-400 border-gray-700 hover:border-navarra-gold/50'}`}
              >
                {filter.label}
              </button>
            ))}
          </div>

          <div className="flex flex-wrap justify-center gap-2">
            {[
              { id: 'ALL', label: t('charactersView.categories.all') },
              { id: 'Juego', label: t('charactersView.categories.game') },
              { id: 'Realeza', label: t('charactersView.categories.royalty') },
              { id: 'Militar', label: t('charactersView.categories.military') },
              { id: 'Religión', label: t('charactersView.categories.religion') },
              { id: 'Cultura', label: t('charactersView.categories.culture') },
              { id: 'Sociedad', label: t('charactersView.categories.society') },
              { id: 'Política', label: t('charactersView.categories.politics') }
            ].map((cat) => (
              <button
                key={cat.id}
                onClick={() => setCharCategory(cat.id as CategoryFilter)}
                className={`px-3 py-1 rounded text-xs uppercase tracking-wide transition-colors
                                  ${charCategory === cat.id
                    ? 'bg-navarra-crimson text-white font-bold'
                    : 'bg-navarra-panel text-gray-500 hover:text-gray-300'}`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* CHARACTERS GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {filteredCharacters.map((char) => (
            <div key={char.id} className="bg-navarra-panel border border-navarra-gold/30 rounded-lg overflow-hidden group hover:border-navarra-gold/50 transition-all duration-300 relative">
              <div className={`absolute top-3 right-3 z-10 px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider shadow-sm
                              ${char.isFictional ? 'bg-purple-900/80 text-purple-200 border border-purple-500' : 'bg-amber-900/80 text-amber-200 border border-amber-500'}`}>
                {char.isFictional ? t('charactersView.filters.fictional') : t('charactersView.filters.historical')}
              </div>

              <div className="aspect-[3/4] overflow-hidden bg-black relative">
                <SafeImage
                  src={char.image}
                  alt={char.name}
                  className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-navarra-panel to-transparent opacity-80"></div>
              </div>
              <div className="p-6 relative -mt-12">
                <div className="flex justify-between items-end mb-2">
                  <span className="text-navarra-gold text-xs uppercase tracking-widest font-bold">
                    {t(`characters.${char.id}.role`, char.role) as string}
                  </span>
                </div>
                <h3 className="text-2xl font-serif text-white mb-3 leading-none">{char.name}</h3>
                {char.category && (
                  <span className="inline-block bg-gray-800 text-gray-400 text-[10px] px-2 py-0.5 rounded mb-3 uppercase tracking-wide">
                    {char.category}
                  </span>
                )}
                <p className="text-sm text-gray-400 leading-relaxed border-t border-gray-700 pt-4">
                  {t(`characters.${char.id}.bio`, char.bio) as string}
                </p>
              </div>
            </div>
          ))}
        </div>

        {filteredCharacters.length === 0 && (
          <div className="text-center py-20 text-gray-500 italic">
            {t('charactersView.noResults')}
          </div>
        )}
      </div>
    </div>
  );
};
