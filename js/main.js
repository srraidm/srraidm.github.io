import { AnimeAPI } from './api.js';
import { UI } from './ui.js';

let allAnimes = [];

/**
 * INICIO DE LA APP
 */
async function initApp() {
    renderFavorites(); 
    setupSearch();     
    setupFilters();    
    setupDynamicNews(); 
    setupMagicEffects(); // <--- NUEVO: Efectos visuales de Mushoku

    try {
        allAnimes = await AnimeAPI.getSeason();
        displayAnimes(allAnimes);
        
        const user = localStorage.getItem('srRaidUser');
        if (user && window.showToast) {
            const userData = JSON.parse(user);
            setTimeout(() => window.showToast(`HOLA, ${userData.name.split(' ')[0]}!`), 1000);
        }
    } catch (error) {
        console.error("Error SrRaid Init:", error);
        if (window.showToast) window.showToast("ERROR AL CARGAR TEMPORADA");
    }
}

/**
 * EFECTOS MÁGICOS (Rudeus Parallax + Partículas)
 */
function setupMagicEffects() {
    const hero = document.getElementById('inicio');
    const bannerImg = hero?.querySelector('img');

    if (hero && bannerImg) {
        // 1. Efecto Parallax para Rudeus
        hero.addEventListener('mousemove', (e) => {
            const { clientX, clientY } = e;
            const x = (window.innerWidth / 2 - clientX) / 50;
            const y = (window.innerHeight / 2 - clientY) / 50;
            
            bannerImg.style.transform = `scale(1.1) translate(${x}px, ${y}px)`;
            
            // 2. Crear Partícula de Maná (Opcional, consume poca CPU)
            if (Math.random() > 0.85) { // No crear demasiadas
                createManaParticle(clientX, clientY);
            }
        });
    }
}

function createManaParticle(x, y) {
    const particle = document.createElement('div');
    particle.className = 'absolute pointer-events-none rounded-full bg-brand blur-sm z-50';
    
    // Estilo aleatorio para la chispa de magia
    const size = Math.random() * 4 + 2 + 'px';
    particle.style.width = size;
    particle.style.height = size;
    particle.style.left = x + 'px';
    particle.style.top = y + (window.scrollY) + 'px';
    particle.style.opacity = '0.8';
    particle.style.transition = 'all 1s ease-out';
    
    document.body.appendChild(particle);
    
    // Animación de desvanecimiento
    setTimeout(() => {
        particle.style.transform = `translateY(-50px) scale(0)`;
        particle.style.opacity = '0';
    }, 50);

    setTimeout(() => particle.remove(), 1000);
}

/**
 * RENDERIZADO DE TARJETAS
 */
function displayAnimes(list) {
    const animeGrid = document.querySelector('#anime-grid');
    const favorites = JSON.parse(localStorage.getItem('srRaidFavs') || '[]');
    
    animeGrid.innerHTML = '';

    if (list && list.length > 0) {
        list.slice(0, 16).forEach(anime => {
            const isFav = favorites.some(f => f.mal_id === anime.mal_id);
            animeGrid.innerHTML += UI.createAnimeCard(anime, isFav);
        });
    } else {
        animeGrid.innerHTML = `
            <div class="col-span-full text-center py-20">
                <p class="text-slate-500 font-black uppercase tracking-[0.5em] text-xs">No se encontraron resultados</p>
            </div>`;
    }
}

/**
 * LÓGICA DEL BUSCADOR
 */
function setupSearch() {
    const searchInput = document.getElementById('main-search');
    
    searchInput?.addEventListener('keypress', async (e) => {
        if (e.key === 'Enter' && searchInput.value.trim() !== '') {
            const query = searchInput.value;
            window.toggleSearch(); 
            
            document.querySelector('#estrenos').scrollIntoView({ behavior: 'smooth' });
            if (window.showToast) window.showToast(`LANZANDO HECHIZO DE BÚSQUEDA...`);

            // Secret trigger: if user searches exactly "Mushoku Tensei", play a hidden animation
            const normalized = query.trim().toLowerCase();
            if (normalized === 'mushoku tensei' || normalized === 'mushoku-tensei') {
                try { playSecretPapersAnimation(searchInput); } catch (err) { /* silent */ }
            }

            const results = await AnimeAPI.search(query);
            displayAnimes(results);
            
            searchInput.value = ''; 
        }
    });
}

/**
 * SECRET: Lanzar animación de papeles (tira papeles al buscar "Mushoku Tensei")
 */
function playSecretPapersAnimation(originInput) {
    if (document.getElementById('secret-papers-container')) return;

    // Inject minimal styles once
    if (!document.getElementById('secret-papers-styles')) {
        const style = document.createElement('style');
        style.id = 'secret-papers-styles';
        style.innerHTML = `
            .sr-paper{ position:fixed; background:rgba(255,255,245,0.98); border:1px solid #e6e6d8; box-shadow:0 6px 18px rgba(0,0,0,0.12); border-radius:3px; transform-origin:center; }
        `;
        document.head.appendChild(style);
    }

    const container = document.createElement('div');
    container.id = 'secret-papers-container';
    container.style.position = 'fixed';
    container.style.left = '0';
    container.style.top = '0';
    container.style.width = '100%';
    container.style.height = '100%';
    container.style.pointerEvents = 'none';
    container.style.overflow = 'visible';
    container.style.zIndex = 9999;
    document.body.appendChild(container);

    // origin point: try to launch from search input, fallback to center
    let originX = window.innerWidth / 2;
    let originY = window.innerHeight / 3;
    try {
        const rect = originInput.getBoundingClientRect();
        originX = rect.left + rect.width / 2;
        originY = rect.top + rect.height / 2 + window.scrollY;
    } catch (e) {}

    const papers = 12;
    for (let i = 0; i < papers; i++) {
        const p = document.createElement('div');
        p.className = 'sr-paper';
        const w = 36 + Math.round(Math.random() * 64);
        const h = Math.round(w * (0.66 + Math.random() * 0.2));
        p.style.width = w + 'px';
        p.style.height = h + 'px';
        p.style.left = originX - w / 2 + 'px';
        p.style.top = originY - h / 2 + 'px';
        p.style.opacity = '1';
        p.style.transition = `transform ${1.1 + Math.random() * 0.6}s cubic-bezier(.2,.8,.2,1), opacity ${1.2 + Math.random() * 0.6}s ease-out`;
        p.style.transform = `translate(0px,0px) rotate(${(-20 + Math.random() * 40)}deg)`;
        container.appendChild(p);

        // schedule the throw
        (function(el, idx){
            const delay = idx * 80 + Math.random() * 120;
            setTimeout(() => {
                const dir = (Math.random() > 0.5) ? 1 : -1;
                const dx = (150 + Math.random() * 600) * dir;
                const dy = -200 - Math.random() * 300;
                const rot = (-720 + Math.random() * 1440) * (Math.random() > 0.5 ? 1 : -1);
                el.style.transform = `translate(${dx}px, ${dy}px) rotate(${rot}deg)`;
                el.style.opacity = '0';
            }, delay);

            // cleanup each paper
            setTimeout(() => {
                try { el.remove(); } catch (e) {}
            }, 2200 + Math.random() * 600 + idx * 30);
        })(p, i);
    }

    // remove container after animation
    setTimeout(() => { try { container.remove(); } catch (e) {} }, 3200);
}

/**
 * LÓGICA DE FILTROS POR GÉNERO
 */
function setupFilters() {
    const buttons = document.querySelectorAll('.filter-btn');
    
    buttons.forEach(btn => {
        btn.addEventListener('click', () => {
            buttons.forEach(b => {
                b.classList.remove('bg-brand', 'text-white', 'active');
                b.classList.add('text-slate-400');
            });
            btn.classList.add('bg-brand', 'text-white', 'active');
            btn.classList.remove('text-slate-400');

            const selectedGenre = btn.dataset.genre;

            if (selectedGenre === 'all') {
                displayAnimes(allAnimes);
            } else {
                const filtered = allAnimes.filter(anime => 
                    anime.genres.some(g => g.name === selectedGenre)
                );
                displayAnimes(filtered);
            }
        });
    });
}

/**
 * SISTEMA DE FAVORITOS
 */
window.toggleFavorite = (encodedData, event) => {
    event.stopPropagation();
    
    if (!localStorage.getItem('srRaidUser')) {
        if (window.showToast) window.showToast("⚠️ MANÁ INSUFICIENTE (INICIA SESIÓN)");
        return;
    }

    const anime = JSON.parse(decodeURIComponent(escape(atob(encodedData))));
    let favorites = JSON.parse(localStorage.getItem('srRaidFavs') || '[]');

    const index = favorites.findIndex(f => f.mal_id === anime.mal_id);

    if (index > -1) {
        favorites.splice(index, 1);
        if (window.showToast) window.showToast("ELIMINADO DEL GREMIO");
    } else {
        favorites.push(anime);
        if (window.showToast) window.showToast("AÑADIDO AL GREMIO ❤");
    }

    localStorage.setItem('srRaidFavs', JSON.stringify(favorites));
    
    const activeBtn = document.querySelector('.filter-btn.active') || {dataset: {genre: 'all'}};
    const genre = activeBtn.dataset.genre;
    const currentData = genre === 'all' ? allAnimes : allAnimes.filter(a => a.genres.some(g => g.name === genre));
    
    displayAnimes(currentData);
    renderFavorites(); 
};

function renderFavorites() {
    const favGrid = document.getElementById('favorites-grid');
    const favSection = document.getElementById('favoritos');
    const favCount = document.getElementById('fav-count');
    const favorites = JSON.parse(localStorage.getItem('srRaidFavs') || '[]');

    if (favCount) favCount.innerText = favorites.length;

    if (favorites.length > 0) {
        favSection?.classList.remove('hidden');
        favGrid.innerHTML = favorites.map(anime => {
            const animeData = btoa(unescape(encodeURIComponent(JSON.stringify(anime))));
            return `
                <div class="bg-slate-900/60 backdrop-blur-md p-4 rounded-[2rem] border border-white/5 flex items-center gap-4 hover:border-brand/30 transition-all duration-300 group shadow-2xl">
                    <div class="relative overflow-hidden w-14 h-14 rounded-2xl">
                        <img src="${anime.images.jpg.small_image_url}" class="w-full h-full object-cover group-hover:scale-110 transition duration-500">
                    </div>
                    <div class="flex-1 min-w-0">
                        <p class="text-white font-black text-[10px] truncate uppercase tracking-tighter">${anime.title}</p>
                        <button onclick="openAnimeModal('${animeData}')" class="text-brand text-[8px] font-black uppercase tracking-[0.2em] hover:text-white transition mt-1 flex items-center gap-1">
                            LEER GRIMORIO <span class="text-[12px]">→</span>
                        </button>
                    </div>
                </div>`;
        }).join('');
    } else {
        favSection?.classList.add('hidden');
    }
}

/**
 * SISTEMA DE NOTICIAS DINÁMICAS (Con tus imágenes)
 */
function setupDynamicNews() {
    const newsContainer = document.querySelector('#comunidad .col-span-1.lg\\:col-span-2');
    if (newsContainer) {
        // La noticia de Sylphiette ya está en el HTML, aquí podrías añadir lógica para rotar más si quisieras.
    }
}

/**
 * MODAL (Globales)
 */
window.openAnimeModal = (encodedData) => {
    const anime = JSON.parse(decodeURIComponent(escape(atob(encodedData))));
    const content = document.getElementById('modal-content');
    
    content.innerHTML = UI.renderModal(anime);
    
    const modal = document.getElementById('anime-modal');
    modal.classList.remove('hidden');
    modal.classList.add('flex');
    document.body.style.overflow = 'hidden';
};

window.closeModal = () => {
    const modal = document.getElementById('anime-modal');
    modal.classList.add('hidden');
    modal.classList.remove('flex');
    document.body.style.overflow = 'auto';
};

window.addEventListener('click', (e) => {
    if (e.target.id === 'anime-modal') closeModal();
});

document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeModal();
});

// Lanzar App
document.addEventListener('DOMContentLoaded', initApp);