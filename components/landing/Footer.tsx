
import React from 'react';
import { logGameEvent } from '../../services/gameService';

interface FooterProps {
  onNavigateAbout: () => void;
  onNavigateBibliography: () => void;
  onNavigateMemories: () => void;
  onDataUpdated: () => void;
  hasMemories?: boolean;
}

export const Footer: React.FC<FooterProps> = ({ onNavigateAbout, onNavigateBibliography, onNavigateMemories, onDataUpdated, hasMemories = false }) => {
  return (
    <footer className="bg-black py-12 border-t border-navarra-gold/20 relative overflow-hidden">
      {/* Background pattern subtle */}
      <div className="absolute inset-0 opacity-5 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] pointer-events-none"></div>

      <div className="max-w-6xl mx-auto px-6 relative z-10">
        <div className="grid md:grid-cols-2 gap-12 items-center mb-12">
          {/* Left: Branding */}
          <div className="text-left space-y-6">
            <div>
              <h3 className="text-3xl font-serif text-white">
                <span className="text-navarra-gold">Mikel</span> Díaz
              </h3>
              <p className="text-navarra-gold text-xs uppercase tracking-[0.2em] font-bold mt-1">Ingeniería de Software & IA</p>
            </div>
            <p className="text-gray-400 text-sm max-w-sm leading-relaxed">
              Creando experiencias digitales inmersivas y soluciones tecnológicas avanzadas. Especialista en desarrollo móvil, web e Inteligencia Artificial.
            </p>
            <div className="flex flex-wrap gap-6">
              <a
                href="https://mikeldiaz.vercel.app/"
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => logGameEvent('select_content', { content_type: 'portfolio', item_id: 'mikel_diaz' })}
                className="text-white hover:text-navarra-gold text-xs uppercase tracking-widest font-bold transition-colors flex items-center gap-2 group"
              >
                Ver Portfolio
                <span className="group-hover:translate-x-1 transition-transform">↗</span>
              </a>
              <button
                onClick={onNavigateAbout}
                className="text-gray-500 hover:text-white text-xs uppercase tracking-widest font-bold transition-colors"
              >
                Sobre este Proyecto
              </button>
              {hasMemories && (
                <button
                  onClick={onNavigateMemories}
                  className="text-gray-500 hover:text-white text-xs uppercase tracking-widest font-bold transition-colors"
                >
                  Recuerdos
                </button>
              )}
              <button
                onClick={onNavigateBibliography}
                className="text-gray-500 hover:text-white text-xs uppercase tracking-widest font-bold transition-colors"
              >
                Bibliografía
              </button>
            </div>

            {/* Social Media Links */}
            <div className="flex items-center gap-4 pt-4 border-t border-gray-800/50">
              <a
                href="https://www.instagram.com/estellaescapecity/"
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => logGameEvent('select_content', { content_type: 'social', item_id: 'instagram' })}
                className="p-2 bg-gray-900 rounded-full text-gray-400 hover:text-white hover:bg-[#E1306C] transition-all duration-300 transform hover:scale-110"
                aria-label="Instagram"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16">
                  <path d="M8 0C5.829 0 5.556.01 4.703.048 3.85.088 3.269.222 2.76.42a3.917 3.917 0 0 0-1.417.923A3.927 3.927 0 0 0 .42 2.76C.222 3.268.087 3.85.048 4.7.01 5.555 0 5.827 0 8.001c0 2.172.01 2.444.048 3.297.04.852.174 1.433.372 1.942.205.526.478.972.923 1.417.444.445.89.719 1.416.923.51.198 1.09.333 1.942.372C5.555 15.99 5.827 16 8 16s2.444-.01 3.298-.048c.851-.04 1.434-.174 1.943-.372a3.916 3.916 0 0 0 1.416-.923c.445-.445.718-.891.923-1.417.197-.509.332-1.09.372-1.942C15.99 10.445 16 10.173 16 8s-.01-2.445-.048-3.299c-.04-.851-.175-1.433-.372-1.941a3.926 3.926 0 0 0-.923-1.417A3.911 3.911 0 0 0 13.24.42c-.51-.198-1.092-.333-1.943-.372C10.443.01 10.172 0 7.998 0h.003zm-.717 1.442h.718c2.136 0 2.389.007 3.232.046.78.035 1.204.166 1.486.275.373.145.64.319.92.599.28.28.453.546.598.92.11.281.24.705.275 1.485.039.843.047 1.096.047 3.231s-.008 2.389-.047 3.232c-.035.78-.166 1.203-.275 1.485a2.47 2.47 0 0 1-.599.919c-.28.28-.546.453-.92.598-.28.11-.704.24-1.485.276-.843.038-1.096.047-3.232.047s-2.39-.009-3.233-.047c-.78-.036-1.203-.166-1.486-.276a2.478 2.478 0 0 1-.919-.598 2.48 2.48 0 0 1-.599-.919c-.11-.281-.24-.705-.275-1.485-.038-.843-.047-1.096-.047-3.232 0-2.136.009-2.388.047-3.231.036-.78.166-1.204.275-1.486.145-.373.319-.64.599-.92.28-.28.546-.453.919-.598.282-.11.705-.24 1.485-.276.738-.034 1.024-.044 2.515-.045v.002zm4.988 1.328a.96.96 0 1 0 0 1.92.96.96 0 0 0 0-1.92zm-4.27 1.122a4.109 4.109 0 1 0 0 8.217 4.109 4.109 0 0 0 0-8.217zm0 1.441a2.667 2.667 0 1 1 0 5.334 2.667 2.667 0 0 1 0-5.334z" />
                </svg>
              </a>
              <a
                href="https://www.facebook.com/profile.php?id=61584746406366"
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => logGameEvent('select_content', { content_type: 'social', item_id: 'facebook' })}
                className="p-2 bg-gray-900 rounded-full text-gray-400 hover:text-white hover:bg-[#1877F2] transition-all duration-300 transform hover:scale-110"
                aria-label="Facebook"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16"><path d="M16 8.049c0-4.446-3.582-8.05-8-8.05C3.58 0-.002 3.603-.002 8.05c0 4.017 2.926 7.347 6.75 7.951v-5.625h-2.03V8.05H6.75V6.275c0-2.017 1.195-3.131 3.022-3.131.876 0 1.791.157 1.791.157v1.98h-1.009c-.993 0-1.303.621-1.303 1.258v1.51h2.218l-.354 2.326H9.25V16c3.824-.604 6.75-3.934 6.75-7.951z" /></svg>
              </a>
              <a
                href="https://x.com/NavarraEscape"
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => logGameEvent('select_content', { content_type: 'social', item_id: 'twitter' })}
                className="p-2 bg-gray-900 rounded-full text-gray-400 hover:text-white hover:bg-black hover:border hover:border-white/20 transition-all duration-300 transform hover:scale-110"
                aria-label="X (Twitter)"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16"><path d="M12.6.75h2.454l-5.36 6.142L16 15.25h-4.937l-3.867-5.07-4.425 5.07H.316l5.733-6.57L0 .75h5.063l3.495 4.633L12.601.75Zm-.86 13.028h1.36L4.323 2.145H2.865l8.875 11.633Z" /></svg>
              </a>
              <a
                href="https://www.youtube.com/channel/UCwdmqbE8f0Snh9QPe13y-dw"
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => logGameEvent('select_content', { content_type: 'social', item_id: 'youtube' })}
                className="p-2 bg-gray-900 rounded-full text-gray-400 hover:text-white hover:bg-[#FF0000] transition-all duration-300 transform hover:scale-110"
                aria-label="YouTube"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16"><path d="M8.051 1.999h.089c.822.003 4.987.033 6.11.335a2.01 2.01 0 0 1 1.415 1.42c.101.38.172.883.22 1.402l.01.104.022.26.008.104c.065.914.073 1.77.074 1.957v.075c-.001.194-.01 1.108-.082 2.06l-.008.105-.009.104c-.05.572-.124 1.14-.235 1.558a2.007 2.007 0 0 1-1.415 1.42c-1.16.312-5.569.334-6.18.335h-.142c-.309 0-1.587-.006-2.927-.052l-.17-.006-.087-.004-.171-.007-.171-.007c-1.11-.049-2.167-.128-2.654-.26a2.007 2.007 0 0 1-1.415-1.419c-.111-.417-.185-.986-.235-1.558L.09 9.82l-.008-.104A31.4 31.4 0 0 1 0 7.68v-.123c.002-.215.01-.958.064-1.778l.007-.103.003-.052.008-.104.022-.26.01-.104c.048-.519.119-1.023.22-1.402a2.007 2.007 0 0 1 1.415-1.42c.487-.13 1.544-.21 2.654-.26l.17-.007.172-.006.086-.003.171-.007A99.788 99.788 0 0 1 7.858 2h.193zM6.4 5.209v4.818l4.157-2.408L6.4 5.209z" /></svg>
              </a>
            </div>
          </div>

          {/* Right: CTA Card */}
          <div className="bg-gradient-to-r from-blue-900/20 to-purple-900/20 border border-white/10 p-8 rounded-lg hover:border-navarra-gold/50 transition-all group relative overflow-hidden">
            <div className="absolute top-0 right-0 w-20 h-20 bg-navarra-gold/10 rounded-full blur-2xl group-hover:bg-navarra-gold/20 transition-colors"></div>

            <h4 className="text-white font-bold mb-3 flex items-center gap-2 text-lg">
              ¿Quieres un proyecto como este? 🚀
            </h4>
            <p className="text-gray-400 text-sm mb-6 leading-relaxed">
              Desarrollo aplicaciones móviles, webs interactivas y automatizaciones con IA a medida para tu negocio o institución.
            </p>
            <a
              href="https://mikel-d-az-software-ia-navarra-2562567412.us-west1.run.app/"
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => logGameEvent('select_content', { content_type: 'contact', item_id: 'contact_cta' })}
              className="inline-block bg-navarra-gold text-navarra-dark font-bold text-xs px-8 py-4 rounded uppercase tracking-widest hover:bg-white transition-colors shadow-[0_0_20px_rgba(212,175,55,0.2)] group-hover:shadow-[0_0_30px_rgba(212,175,55,0.4)]"
            >
              Contactar con Mikel
            </a>
          </div>
        </div>

        {/* Bottom: Copy */}
        <div className="border-t border-gray-900 pt-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 text-[10px] uppercase tracking-widest text-gray-600">
          <p>© 2025 <a href="https://estellaescapecity.com" className="hover:text-navarra-gold transition-colors">Navarra Escape City</a>. Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>
  );
};
