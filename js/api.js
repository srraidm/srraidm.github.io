export const AnimeAPI = {
    BASE_URL: 'https://api.jikan.moe/v4',

    // Obtener estrenos actuales
    async getSeason() {
        try {
            const response = await fetch(`${this.BASE_URL}/seasons/now`);
            if (!response.ok) throw new Error('Error al conectar con Jikan');
            const data = await response.json();
            return data.data;
        } catch (error) {
            console.error("❌ Error en getSeason:", error);
            return []; // Retorna array vacío para que el main.js sepa gestionarlo
        }
    },

    // Obtener el Top 5 para el ranking lateral
    async getTop() {
        try {
            const response = await fetch(`${this.BASE_URL}/top/anime?limit=5`);
            if (!response.ok) throw new Error('Error al conectar con Jikan');
            const data = await response.json();
            return data.data;
        } catch (error) {
            console.error("❌ Error en getTop:", error);
            return [];
        }
    },

    // BONUS: Buscar por nombre (Por si activas la lupa del buscador)
    async search(query) {
        try {
            const response = await fetch(`${this.BASE_URL}/anime?q=${query}&limit=10`);
            const data = await response.json();
            return data.data;
        } catch (error) {
            return [];
        }
    }
};