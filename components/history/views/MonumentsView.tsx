
import React from 'react';
import { useTranslation } from 'react-i18next';
import { PlaceWithKeys } from '../../../data/places';
import { SafeImage } from '../../UIComponents';

interface ViewProps {
    onBack: () => void;
    places: PlaceWithKeys[];
}

export const MonumentsView: React.FC<ViewProps> = ({ onBack, places }) => {
    const { t } = useTranslation();

    const categories = [
        { key: 'Civil', labelKey: 'historySection.monumentCategories.civil' },
        { key: 'Religioso', labelKey: 'historySection.monumentCategories.religioso' },
        { key: 'Militar', labelKey: 'historySection.monumentCategories.militar' },
        { key: 'Ingeniería', labelKey: 'historySection.monumentCategories.ingenieria' },
        { key: 'Otros', labelKey: 'historySection.monumentCategories.otros' }
    ];

    const displayPlaces = places.length > 0 ? places : [];

    return (
        <div className="animate-fade-in max-w-6xl mx-auto">
            <button onClick={onBack} className="mb-6 flex items-center gap-2 text-navarra-gold hover:text-white transition-colors uppercase tracking-widest text-xs font-bold">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                {t('common.back')}
            </button>

            <h2 className="text-4xl font-serif text-white mb-2 text-center">{t('historySection.tabs.monuments')}</h2>
            <p className="text-center text-gray-400 mb-12 max-w-2xl mx-auto">Descubre el patrimonio arquitectónico de la "Toledo del Norte".</p>

            <div className="space-y-16">
                {categories.map(cat => {
                    const categoryPlaces = displayPlaces.filter(p => p.category === cat.key);
                    if (categoryPlaces.length === 0) return null;

                    return (
                        <div key={cat.key}>
                            <h3 className="text-2xl text-navarra-gold font-serif border-b border-navarra-gold/20 pb-2 mb-6 flex items-baseline gap-4">
                                {t(cat.labelKey)}
                                <span className="text-sm font-sans text-gray-500 font-normal">({categoryPlaces.length})</span>
                            </h3>
                            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {categoryPlaces.map(place => (
                                    <div key={place.id} className="bg-navarra-panel border border-navarra-gold/30 rounded-lg overflow-hidden group hover:border-navarra-gold/80 transition-all hover:shadow-xl hover:shadow-navarra-gold/10">
                                        <div className="h-48 overflow-hidden relative">
                                            <SafeImage src={place.image} alt={t(place.nameKey)} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-60"></div>
                                        </div>
                                        <div className="p-5">
                                            <h4 className="text-white font-serif font-bold text-lg mb-2 group-hover:text-navarra-gold transition-colors">{t(place.nameKey)}</h4>
                                            <p className="text-gray-400 text-sm leading-relaxed line-clamp-3">{t(place.descKey)}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};
