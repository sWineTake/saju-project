import React from 'react';
import hanokSilhouette from '../assets/hanok-silhouette.png';

const Layout = ({ children }) => {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center p-4 relative overflow-hidden">
             {/* Hanok Silhouette at the bottom */}
             <div className="absolute bottom-0 left-0 w-full h-48 md:h-64 pointer-events-none z-0 opacity-60 mix-blend-overlay" 
                  style={{ 
                      backgroundImage: `url(${hanokSilhouette})`,
                      backgroundSize: 'contain',
                      backgroundPosition: 'bottom center',
                      backgroundRepeat: 'repeat-x'
                  }}>
             </div>

            <div className="w-full max-w-md bg-midnight-800/40 backdrop-blur-md border border-gold-500/30 shadow-2xl rounded-xl overflow-hidden relative z-10 ring-1 ring-white/10">
                {/* Top decorative gradient line */}
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-midnight-900 via-gold-500 to-midnight-900 opacity-80"></div>

                <header className="p-6 text-center border-b border-white/5">
                    <h1 className="text-3xl font-serif font-bold text-gold-400 drop-shadow-md tracking-wide">사주 (Saju)</h1>
                    <p className="text-starlight-200 text-sm mt-2 tracking-[0.2em] font-light opacity-80">당신의 운명을 읽어드립니다</p>
                </header>

                <main className="p-6 relative">
                    {children}
                </main>

                <footer className="p-4 text-center text-xs text-starlight-200/40 border-t border-white/5 font-light">
                    © 2026 Saju Project
                </footer>
            </div>
        </div>
    );
};

export default Layout;
