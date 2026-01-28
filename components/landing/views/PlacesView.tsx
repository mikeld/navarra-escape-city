
import React, { useState } from 'react';
import { SafeImage } from '../../UIComponents';
import { PlaceWithKeys } from '../../../data/places';
import { useTranslation } from 'react-i18next';
import { PlaceDetailModal } from '../PlaceDetailModal';

interface PlacesViewProps {
  onBack: () => void;
  places: PlaceWithKeys[];
}

export const PlacesView: React.FC<PlacesViewProps> = ({ onBack, places }) => {
  const { t, i18n } = useTranslation();
  const [selectedPlace, setSelectedPlace] = useState<PlaceWithKeys | null>(null);

  return (
    <div className="min-h-screen bg-black text-navarra-parchment font-sans animate-fade-in">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <button onClick={onBack} className="mb-8 text-navarra-gold hover:text-white flex items-center gap-2 uppercase tracking-widest text-xs font-bold transition-colors">
          {t('common.backToHome')}
        </button>

        <div className="text-center mb-16">
          <span className="text-navarra-crimson text-xs uppercase tracking-[0.3em] font-bold">{t('placesView.tag')}</span>
          <h2 className="text-4xl md:text-6xl font-serif text-white mt-4">{t('placesView.title')}</h2>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {places.map((place) => (
            <button
              key={`${place.id}-${i18n.language}`}
              onClick={() => setSelectedPlace(place)}
              className="group relative rounded-xl overflow-hidden border border-navarra-gold/30 hover:border-navarra-gold transition-all duration-500 hover:shadow-[0_0_30px_rgba(212,175,55,0.2)] hover:-translate-y-2 cursor-pointer w-full h-96"
            >
              {/* Image Background */}
              <div className="absolute inset-0">
                <SafeImage
                  src={place.image}
                  alt={t(place.nameKey)}
                  className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-1000"
                />
              </div>

              {/* Gradient Overlay - Stronger for readability */}
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-transparent/30 opacity-90 group-hover:opacity-100 transition-all duration-500"></div>

              {/* Content Container - Centered */}
              <div className="absolute inset-0 flex flex-col justify-end items-center p-6 text-center z-10">
                {/* Category Label */}
                <div className="mb-3 transform translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 delay-100">
                  <span className="px-3 py-1 bg-navarra-gold/20 border border-navarra-gold/50 rounded-full text-navarra-gold text-[10px] uppercase tracking-widest font-bold backdrop-blur-sm">
                    {place.category}
                  </span>
                </div>

                <h3 className="text-2xl md:text-3xl font-serif text-white mb-3 group-hover:text-navarra-gold transition-colors duration-300 drop-shadow-lg leading-tight px-2">
                  {t(place.nameKey)}
                </h3>

                <div className="h-px w-12 bg-navarra-gold/50 mb-4 group-hover:w-24 transition-all duration-500"></div>

                <p className="text-gray-200 font-light leading-relaxed mb-6 text-sm max-w-sm drop-shadow-md line-clamp-3">
                  {t(place.descKey)}
                </p>

                {/* "Ver más" indicator */}
                <div className="flex items-center gap-2 text-navarra-gold text-xs font-bold uppercase tracking-widest opacity-60 group-hover:opacity-100 transition-all duration-300 transform group-hover:translate-y-0 translate-y-2">
                  <span>{t('placeDetail.viewMore', { defaultValue: 'Ver más' })}</span>
                  <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Place Detail Modal */}
      <PlaceDetailModal
        place={selectedPlace}
        onClose={() => setSelectedPlace(null)}
      />
    </div>
  );
};
