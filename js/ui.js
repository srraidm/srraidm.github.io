export const UI = {
    /**
     * Crea el HTML para una tarjeta de anime con integración de Modal y Favoritos
     */
    createAnimeCard(anime, isFavorite = false) {
        const scoreColor = (anime.score >= 8) ? 'bg-green-500' : 'bg-brand';
        const episodes = anime.episodes || '??';
        const studio = anime.studios[0]?.name || 'Indie Studio';
        
        // Clase para el corazón si es favorito
        const favClass = isFavorite ? 'text-red-500 scale-110' : 'text-white/40';

        // Codificamos el objeto anime en Base64
        const animeData = btoa(unescape(encodeURIComponent(JSON.stringify(anime))));

        // Comprobamos si hay sesión (para un efecto visual en el botón fav)
        const isLoggedIn = localStorage.getItem('srRaidUser');

        return `
            <div class="group relative bg-slate-900 rounded-[2.5rem] overflow-hidden border border-slate-800 hover:border-brand/50 transition-all duration-500 hover:-translate-y-2 shadow-2xl">
                
                <button onclick="toggleFavorite('${animeData}', event)" 
                        class="absolute top-5 right-5 z-20 ${isLoggedIn ? 'bg-black/40' : 'bg-black/20 opacity-50'} backdrop-blur-md p-3 rounded-2xl border border-white/10 hover:scale-110 transition active:scale-95 group/fav">
                    <svg class="w-5 h-5 ${favClass} group-hover/fav:text-red-400 transition-colors" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M3.172 5.172a4 4 0 015.657 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"/>
                    </svg>
                </button>

                <div class="relative h-[420px] overflow-hidden">
                    <img 
                        src="${anime.images.jpg.large_image_url}" 
                        alt="${anime.title}" 
                        class="w-full h-full object-cover transform group-hover:scale-110 transition duration-700"
                        loading="lazy"
                    >
                    <div class="absolute inset-0 bg-gradient-to-t from-dark via-dark/20 to-transparent opacity-90"></div>
                    
                    <div class="absolute top-5 left-5 flex flex-col gap-2">
                        <span class="px-3 py-1 rounded-full bg-black/60 backdrop-blur-md text-[10px] font-black uppercase tracking-widest text-white border border-white/10">
                            ${anime.type}
                        </span>
                        <span class="px-3 py-1 rounded-full ${scoreColor} text-[10px] font-black text-white shadow-lg shadow-brand/20">
                            ⭐ ${anime.score || 'N/A'}
                        </span>
                    </div>
                </div>

                <div class="absolute bottom-0 w-full p-8 translate-y-6 group-hover:translate-y-0 transition-transform duration-500">
                    <p class="text-brand font-bold text-[10px] mb-2 uppercase tracking-[0.2em]">${studio}</p>
                    <h3 class="text-white font-black text-xl leading-tight mb-4 line-clamp-2">
                        ${anime.title}
                    </h3>
                    
                    <div class="flex items-center gap-4 text-slate-400 text-xs font-bold opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100">
                        <span class="flex items-center gap-1.5">
                            <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path></svg>
                            ${episodes} EPS
                        </span>
                        <span class="flex items-center gap-1.5">
                            <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                            ${anime.status === 'Currently Airing' ? 'En Emisión' : 'Finalizado'}
                        </span>
                    </div>

                    <button 
                        onclick="openAnimeModal('${animeData}')"
                        class="w-full mt-6 bg-white text-dark py-4 rounded-2xl font-black text-xs uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-all duration-500 hover:bg-brand hover:text-white transform translate-y-4 group-hover:translate-y-0 shadow-xl"
                    >
                        Ver Ficha Técnica
                    </button>
                </div>
            </div>
        `;
    },

    /**
     * Contenido para el Modal (Optimizado para legibilidad)
     */
    renderModal(anime) {
        const genres = anime.genres.map(g => `<span class="bg-slate-800 border border-slate-700 px-3 py-1 rounded-lg text-xs font-bold text-slate-300">${g.name}</span>`).join(' ');
        
        return `
            <div class="md:w-5/12 h-[350px] md:h-auto relative">
                <img src="${anime.images.jpg.large_image_url}" class="w-full h-full object-cover">
                <div class="absolute inset-0 bg-gradient-to-t from-slate-950 md:hidden"></div>
            </div>
            <div class="md:w-7/12 p-8 md:p-14 overflow-y-auto">
                <div class="flex items-center gap-3 mb-4">
                    <span class="text-brand font-black uppercase tracking-[0.2em] text-[10px] border-b-2 border-brand pb-1">${anime.type}</span>
                    <span class="text-slate-500 font-bold text-[10px] uppercase tracking-[0.2em]">${anime.year || 'Estreno'}</span>
                </div>
                <h2 class="text-3xl md:text-5xl font-black text-white leading-none mb-6 tracking-tighter uppercase">${anime.title}</h2>
                
                <div class="flex flex-wrap gap-2 mb-8">
                    ${genres}
                </div>

                <div class="grid grid-cols-2 gap-4 mb-8">
                    <div class="bg-dark/50 p-4 rounded-2xl border border-white/5 shadow-inner">
                        <p class="text-[10px] font-bold text-slate-500 uppercase mb-1 tracking-widest">Puntuación</p>
                        <p class="text-xl font-black text-yellow-400">⭐ ${anime.score || 'N/A'}</p>
                    </div>
                    <div class="bg-dark/50 p-4 rounded-2xl border border-white/5 shadow-inner">
                        <p class="text-[10px] font-bold text-slate-500 uppercase mb-1 tracking-widest">Episodios</p>
                        <p class="text-xl font-black text-white">🎬 ${anime.episodes || '?'}</p>
                    </div>
                </div>

                <div class="mb-10">
                    <p class="text-slate-500 text-[10px] font-black uppercase tracking-widest mb-3">Sinopsis Oficial</p>
                    <p class="text-slate-400 leading-relaxed text-sm md:text-base font-medium max-h-[200px] overflow-y-auto pr-2 custom-scrollbar">
                        ${anime.synopsis || 'La base de datos de SrRaid no cuenta con una sinopsis en este momento.'}
                    </p>
                </div>

                <div class="flex flex-col sm:flex-row gap-4">
                    <a href="${anime.url}" target="_blank" class="flex-1 bg-brand text-center text-white py-4 rounded-2xl font-black hover:bg-brand/80 transition-all shadow-lg shadow-brand/25 uppercase text-[10px] tracking-widest">
                        Página Oficial MAL
                    </a>
                    <button onclick="closeModal()" class="flex-1 border border-slate-700 text-white py-4 rounded-2xl font-black hover:bg-slate-800 transition-all uppercase text-[10px] tracking-widest">
                        Volver
                    </button>
                </div>
            </div>
        `;
    }
};