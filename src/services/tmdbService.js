// Aqui centralizamos la logica de la comunicacion con la API (en un solo lugar)
// Evitamos repetir codigo y Manejar la KEY de la API de forma mas segura

const API_KEY = process.env.REACT_APP_TMDB_API_KEY;
const BASE_URL = 'https://api.themoviedb.org/3';

// Fetch y manejo de errores
const fetchFromApi = async (endpoint) => {
  const url = `${BASE_URL}${endpoint}&api_key=${API_KEY}`;
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Error ${response.status}: ${response.statusText}`);
  }
  return response.json();
};
// Componentes que utilizaremos para esta aplicacion
// Aqui se construye cada "Endpint"

// Descubrir películas con filtros (año, genero etc.)
export const discoverMovies = async ({ genreId, year, sortBy } = {}) => {
  let endpoint = `/discover/movie?include_adult=false&include_video=false`;
  if (genreId) endpoint += `&with_genres=${genreId}`;
  if (year) endpoint += `&primary_release_year=${year}`;
  if (sortBy) endpoint += `&sort_by=${sortBy}`;
  
  return fetchFromApi(endpoint);
};
// Buscar películas por texto (para el buscador después)
export const searchMovies = async (query) => {
  return fetchFromApi(`/search/movie?query=${encodeURIComponent(query)}`);
};
// Obtener lista de géneros
export const getGenres = async () => {
  return fetchFromApi(`/genre/movie/list?language=es`);
};