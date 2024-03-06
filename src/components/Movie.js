// Movie.js

import React, { useState, useEffect } from "react";


const APIURL = "https://api.themoviedb.org/3/discover/movie?api_key=04c35731a5ee918f014970082a0088b1";
const IMGPATH = "https://image.tmdb.org/t/p/w1280";
const SEARCHAPI = "https://api.themoviedb.org/3/search/movie?&api_key=04c35731a5ee918f014970082a0088b1&query=";

const Movie = () => {
    const [movies, setMovies] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [favorites, setFavorites] = useState([]);
    const [darkMode, setDarkMode] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        getMovies(APIURL);
        const storedFavorites = JSON.parse(localStorage.getItem('favorites')) || [];
        setFavorites(storedFavorites);
    }, []);

    const getMovies = async (url) => {
        try {
            const resp = await fetch(url);
            if (!resp.ok) {
                throw new Error('Failed to fetch data');
            }
            const respData = await resp.json();
            setMovies(respData.results);
            setError(null);
        } catch (error) {
            setError('An error occurred while fetching data');
        }
    };

    const searchMovies = async () => {
        if (searchTerm) {
            getMovies(SEARCHAPI + searchTerm);
            setSearchTerm('');
        }
    };

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
    };

    const toggleFavorite = (movieId) => {
        if (favorites.includes(movieId)) {
            setFavorites(favorites.filter(id => id !== movieId));
        } else {
            setFavorites([...favorites, movieId]);
        }
    };

    useEffect(() => {
        localStorage.setItem('favorites', JSON.stringify(favorites));
    }, [favorites]);

    const toggleDarkMode = () => {
        setDarkMode(!darkMode);
    };

    useEffect(() => {
        const body = document.querySelector('body');
        if (darkMode) {
            body.classList.add('dark-mode');
        } else {
            body.classList.remove('dark-mode');
        }
    }, [darkMode]);

    const getClassByRate = (vote) => {
        if (vote >= 7) {
            return "green";
        } else if (vote >= 4 && vote < 7) {
            return "orange";
        } else {
            return "black";
        }
    };

    return (
        <div>
            <header>
                <h1>Trending Movies</h1> <br/> 

                <form onSubmit={(e) => { e.preventDefault(); searchMovies(); }}>
                    <input
                        type="text"
                        value={searchTerm}
                        onChange={handleSearchChange}
                        placeholder="Search"
                        className="search"
                    />
                </form>
            </header>

            <div id="content">
                {error && <p className="error-message">{error}</p>}
                {movies.map((movie) => (
                    <div className={`movie ${favorites.includes(movie.id) ? 'favorited' : ''}`} key={movie.id} onClick={() => toggleFavorite(movie.id)}>
                        <img src={IMGPATH + movie.poster_path} alt={movie.title} />
                        <div className="movie-info">
                            <h3>{movie.title}</h3>
                            <span className={getClassByRate(movie.vote_average)}>
                                {movie.vote_average}
                            </span>
                        </div>
                        <div className="overview">
                            <h3>Overview:</h3>
                            {movie.overview}
                        </div>
                    </div>
                ))}
            </div>

            <div className="pagination">
                {/* Pagination buttons go here */}
            </div>

            <div className="dark-mode-toggle">
                <button onClick={toggleDarkMode}>{darkMode ? 'Light Mode' : 'Dark Mode'}</button>
            </div>
        </div>
    );
};

export default Movie;
