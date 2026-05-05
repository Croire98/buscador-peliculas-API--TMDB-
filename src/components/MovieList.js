import React from 'react';

// Muestra peliculas de lo contrario muestra mensaje
const MovieList = ({ movies }) => {
  // cuando no se encuentren peliculas mostramos el siguente mensaje
  if (!movies || movies.length === 0) {
    return <p>No se encontraron películas</p>;
  }

  return (
    <div className='movies-grid'>
      {movies.map((movie) => (
        <div key={movie.id} className='movie-card'>
          {/* Imagen del póster */}
          <img className='movie-poster'
            src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`} 
            alt={movie.title}
            onError={(e) => {
              e.target.src = 'https://via.placeholder.com/500x750?text=No+Image';
            }}
          />
          
          <div className='movie-info'>
            <h3 className='movie-title'>
              {movie.title}
            </h3>
            
            <p className='movie-year'>
              📅 {movie.release_date?.split('-')[0] || 'Desconocido'}
            </p>
            
            <span className='movie-rating'>
              ⭐ {movie.vote_average?.toFixed(1) || 'N/A'}/10
            </span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default MovieList;