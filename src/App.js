import React, { useState, useEffect } from 'react';
import MovieList from './components/MovieList';
import Filters from './components/Filters';
import SearchBar from './components/SearchBar';
import { discoverMovies, searchMovies } from './services/tmdbService';
import './App.css'; /* CSS del proyecto */

function App() {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    genreId: '',
    year: '',
    sortBy: 'popularity.desc'
  });
  const [searchQuery, setSearchQuery] = useState('');

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
  };

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        setLoading(true);
        setError(null);
        
        let data;
        
        if (searchQuery) {
          const searchResult = await searchMovies(searchQuery);
          let filteredMovies = searchResult.results || [];
          
          if (filters.genreId) {
            filteredMovies = filteredMovies.filter(movie => 
              movie.genre_ids && movie.genre_ids.includes(parseInt(filters.genreId))
            );
          }
          
          if (filters.year) {
            filteredMovies = filteredMovies.filter(movie => {
              const movieYear = movie.release_date?.split('-')[0];
              return movieYear === filters.year;
            });
          }
          
          let sortedMovies = [...filteredMovies];
          if (filters.sortBy === 'popularity.desc') {
            sortedMovies.sort((a, b) => b.popularity - a.popularity);
          } else if (filters.sortBy === 'popularity.asc') {
            sortedMovies.sort((a, b) => a.popularity - b.popularity);
          }
          
          data = { results: sortedMovies };
        } else {
          const activeFilters = {};
          if (filters.genreId) activeFilters.genreId = filters.genreId;
          if (filters.year) activeFilters.year = filters.year;
          if (filters.sortBy) activeFilters.sortBy = filters.sortBy;
          
          data = await discoverMovies(activeFilters);
        }
        
        setMovies(data.results || []);
      } catch (err) {
        setError('No se pudieron cargar las películas');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchMovies();
  }, [filters, searchQuery]);

  const clearAll = () => {
    setSearchQuery('');
    setFilters({
      genreId: '',
      year: '',
      sortBy: 'popularity.desc'
    });
  };

  return (
    <div className="app-container">
      <h1 className="app-title">🎬 El Cinex API 🎬</h1>
      <h3 className='app-subTitle'>Buscador de películas</h3>
      
      <SearchBar onSearch={handleSearch} loading={loading} />
      
      <Filters 
        onFilterChange={handleFilterChange}
        currentFilters={filters}
      />
      
      {(searchQuery || filters.genreId || filters.year) && (
        <div className="clear-all-container">
          <button className="clear-all-button" onClick={clearAll}>
            🧹 Limpiar búsqueda y filtros
          </button>
        </div>
      )}
      
      {loading && (
        <div className="loading-state">
          <div className="loading-spinner"></div>
          <p>Cargando películas...</p>
        </div>
      )}
      
      {error && (
        <div className="error-state">
          <div className="error-icon">❌</div>
          <p>{error}</p>
        </div>
      )}
      
      {!loading && !error && (
        <>
          <div className="results-header">
            <h2 className="results-title">
              {searchQuery 
                ? `🔍 Resultados para: "${searchQuery}"` 
                : (filters.genreId || filters.year ? '🎯 Resultados con filtros' : '🔥 Tendencias actuales')}
              {(searchQuery && (filters.genreId || filters.year)) && ' (con filtros aplicados)'}
            </h2>
          </div>
          
          {(searchQuery && (filters.genreId || filters.year)) && (
            <div className="active-filters-badge">
              <strong>Filtros activos:</strong>
              {filters.genreId && <span> 🎭 Género filtrado</span>}
              {filters.year && <span> 📅 Año: {filters.year}</span>}
              {filters.sortBy === 'popularity.asc' && <span> ⬆️ Orden ascendente</span>}
              {filters.sortBy === 'popularity.desc' && <span> ⬇️ Orden descendente</span>}
            </div>
          )}
          
          {movies.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">🎬</div>
              <p>No se encontraron películas. Intenta con otra búsqueda o cambia los filtros.</p>
            </div>
          ) : (
            <>
              <div className="results-count">
                Mostrando {movies.length} películas
              </div>
              <MovieList movies={movies} />
            </>
          )}
        </>
      )}
    </div>
  );
}

export default App;