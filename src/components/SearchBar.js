import React, { useState } from 'react';

const SearchBar = ({ onSearch, loading }) => {
  const [query, setQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const handleSubmit = (e) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch(query.trim());
      setIsSearching(true);
    }
  };
  const handleClear = () => {
    setQuery('');
    setIsSearching(false);
    onSearch(''); // "limpiar búsqueda" si string esta vacio
  };

  return (
    // * Barra de BUSQUEDA
    <div className='search-container'> 
      <form onSubmit={handleSubmit} className='search-form'>
        <input
          className='search-input'
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Buscar películas... (ej: Inception, Toy Story, Batman)"
          onFocus={(e) => e.target.style.borderColor = '#881a86'}
          onBlur={(e) => e.target.style.borderColor = '#9b9b9b'}
          disabled={loading}
        />
        <button /* //* Botton BUSCAR */
          className='search-button'
          type="submit"
          disabled={!query.trim() || loading}
          style={{ /* Estilos aqui para poder agregar condicionales */
            backgroundColor: query.trim() ? '#881a86' : '#109292',
            cursor: query.trim() ? 'pointer' : 'not-allowed',
          }}
        >
          {loading ? 'Buscando...' : '🔍 Buscar'}
        </button>
        {isSearching && (
          <button /* //* Botton LIMPIAR */ 
            className='clear-button'
            type="button"
            onClick={handleClear}
          >
            ✕ Limpiar
          </button>
        )}
      </form>
      {/* //* LABEL para mostrar lo que el usuario busco */}
      {isSearching && query && (
        <p className='search-info'>
          Mostrando resultados para: <strong>"{query}"</strong>
        </p>
      )}
    </div>
  );
};

export default SearchBar;