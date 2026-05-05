import React, { useState, useEffect } from 'react';
import { getGenres } from '../services/tmdbService';

const Filters = ({ onFilterChange, currentFilters }) => {
  const [genres, setGenres] = useState([]);
  const [loadingGenres, setLoadingGenres] = useState(true);

  // Crea una lista de géneros (cuando el componente se monta)
  useEffect(() => {
    const loadGenres = async () => {
      try {
        const data = await getGenres();
        setGenres(data.genres || []);
      } catch (error) {
        console.error('Error cargando géneros:', error);
      } finally {
        setLoadingGenres(false);
      }
    };
    loadGenres();
  }, []);

  // Generar peliculas desde los 1900 hasta el el año actual
  const currentYear = new Date().getFullYear();
  const years = [];
  for (let year = currentYear; year >= 1900; year--) {
    years.push(year);
  }

  const handleGenreChange = (e) => {
    onFilterChange({ ...currentFilters, genreId: e.target.value });
  };

  const handleYearChange = (e) => {
    onFilterChange({ ...currentFilters, year: e.target.value });
  };

  const handleSortChange = (order) => {
    const sortBy = order === 'asc' ? 'popularity.asc' : 'popularity.desc';
    onFilterChange({ ...currentFilters, sortBy });
  };

  return (
    <div className='filters-container'>
      {/* //* Filtro GENERO */}
      <div>
        <label className='filter-label'>🎭 Género:</label>
        <select 
          className='filter-select'
          value={currentFilters.genreId || ''} 
          onChange={handleGenreChange}
          disabled={loadingGenres}
        >
          <option value="">Todos</option>
          {genres.map(genre => (
            <option key={genre.id} value={genre.id}>
              {genre.name}
            </option>
          ))}
        </select>
        {loadingGenres && <span style={{ marginLeft: '8px', fontSize: '12px' }}>Cargando...</span>}
      </div>

      {/* //* Filtro AÑO */}
      <div>
        <label className='filter-label'>📅 Año:</label>
        <select 
          className='filter-select'
          value={currentFilters.year || ''} 
          onChange={handleYearChange}
          style={{ padding: '5px', borderRadius: '4px' }}
        >
          <option value="">Todos</option>
          {years.map(year => (
            <option key={year} value={year}>
              {year}
            </option>
          ))}
        </select>
      </div>

      {/* //* Filtro por ORDEN */}
      <div>
        <label className='filter-label'>🔄 Orden:</label>
        <button className='order-button'
          onClick={() => handleSortChange('desc')}
          style={{ /* Estilos aqui para poder realizar condicionales */
            backgroundColor: currentFilters.sortBy === 'popularity.desc' ? '#881a86' : '#1a1a41',
            color: currentFilters.sortBy === 'popularity.desc' ? 'white' : 'white',
          }}
        >
          Descendente ⬇️
        </button>
        <button className='order-button'
          onClick={() => handleSortChange('asc')}
          style={{ /* Estilos aqui para poder realizar condicionales */
            backgroundColor: currentFilters.sortBy === 'popularity.asc' ? '#881a86' : '#1a1a41',
            color: currentFilters.sortBy === 'popularity.asc' ? 'white' : 'white',
          }}
        >
          Ascendente ⬆️
        </button>
      </div>

      {/* //* Botón LIMPIAR LITROS  */}
      <button className='clear-filters-button'
        onClick={() => onFilterChange({ genreId: '', year: '', sortBy: 'popularity.desc' })}
      >
        Limpiar filtros 🧹
      </button>
    </div>
  );
};

export default Filters;