import { useState, useEffect, useRef } from "react";
import StarRating from './StarRating';

const average = (arr) =>
    arr.reduce((acc, cur, i, arr) => acc + cur / arr.length, 0);

const KEY = '97f182fc';

export default function App() {
    const [movies, setMovies] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [query, setQuery] = useState("");
    const [selectedId, setSelectedId] = useState('');

    const [watched, setWatched] = useState(function () {
        const storeValue = localStorage.getItem('watched');
        return JSON.parse(storeValue);
    });

    function handleSelectedMovie(id) {
        setSelectedId(selectedId => selectedId === id ? null : id);
    }

    function handleCloseMovie() {
        setSelectedId(null)
    }

    function handleWatchedMovies(movie) {
        setWatched(watched => [...watched, movie]);

        // localStorage.setItem('watched', JSON.stringify([...watched, movie]))
    }

    function handleDeleteMovie(id) {
        setWatched(watched => watched.filter(movie => movie.imdbID !== id))
    }

    useEffect(function () {
        localStorage.setItem('watched', JSON.stringify(watched))
    }, [watched])

    useEffect(
        function () {
            const controller = new AbortController();

            async function fetchMovies() {
                try {
                    setIsLoading(true);
                    setErrorMessage('')
                    const res = await fetch(`http://www.omdbapi.com/?apikey=${KEY}&s=${query}`, { signal: controller.signal });

                    if (!res.ok) throw new Error("Something went wrong while fetching movies");

                    const data = await res.json();

                    if (data.Response === 'False') throw new Error(data.Error);

                    setMovies(data.Search)
                    setIsLoading(false);

                    console.log(data.Search)
                } catch (err) {
                    console.log(err.message);
                    setErrorMessage(err.message)
                } finally {
                    setIsLoading(false)
                }

            }

            if (query.length < 3) {
                setMovies([])
                setErrorMessage('')
                return;
            }
            fetchMovies();

            return function () {
                controller.abort();
            }
        }, [query])

    return (
        <>
            <NavBar>
                <Search query={query} setQuery={setQuery} />
                <NumResults movies={movies} />
            </NavBar>

            <Main>
                <Box>
                    {/* {isLoading ? <Loader /> : <MovieList movies={movies} />} */}

                    {!isLoading && !errorMessage && <MovieList movies={movies} onSelectMovie={handleSelectedMovie} />}
                    {isLoading && <Loader />}
                    {errorMessage && <ErrorMessage message={errorMessage} />}
                </Box>

                <Box>
                    {selectedId ? <MovieDetails selectedId={selectedId} onCloseMovie={handleCloseMovie} onAddWatched={handleWatchedMovies} watched={watched} />
                        :
                        <>
                            <WatchedSummary watched={watched} />
                            <WatchedMoviesList watched={watched} onDeleteMovie={handleDeleteMovie} />
                        </>
                    }
                </Box>
            </Main>
        </>
    );
}

function ErrorMessage({ message }) {
    return (
        <p className="error">
            <span>🔻</span> {message}
        </p>
    )
}

function Loader() {
    return (
        <p className="loader">LOADING...</p>
    )
}
function NavBar({ children }) {
    return (
        <nav className="nav-bar">
            <Logo />
            {children}
        </nav>
    );
}

function Logo() {
    return (
        <div className="logo">
            <span role="img">🍿</span>
            <h1>usePopcorn</h1>
        </div>
    );
}

function Search({ query, setQuery }) {

    const inputEl = useRef(null);

    useEffect(function () {

        function callback(e) {

            if (document.activeElement === inputEl.current) return;

            if (e.code === 'Enter') {
                inputEl.current.focus();
                setQuery('');
            }
        }

        document.addEventListener('keydown', callback);
        return () => document.removeEventListener('keydown', callback);
    }, [setQuery])

    return (
        <input
            className="search"
            type="text"
            placeholder="Search movies..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            ref={inputEl}
        />
    );
}

function NumResults({ movies }) {
    return (
        <p className="num-results">
            Found <strong>{movies.length}</strong> results
        </p>
    );
}

function Main({ children }) {
    return <main className="main">{children}</main>;
}

function Box({ children }) {
    const [isOpen, setIsOpen] = useState(true);

    return (
        <div className="box">
            <button className="btn-toggle" onClick={() => setIsOpen((open) => !open)}>
                {isOpen ? "–" : "+"}
            </button>

            {isOpen && children}
        </div>
    );
}

/*
function WatchedBox() {
  const [watched, setWatched] = useState(tempWatchedData);
  const [isOpen2, setIsOpen2] = useState(true);

  return (
    <div className="box">
      <button
        className="btn-toggle"
        onClick={() => setIsOpen2((open) => !open)}
      >
        {isOpen2 ? "–" : "+"}
      </button>

      {isOpen2 && (
        <>
          <WatchedSummary watched={watched} />
          <WatchedMoviesList watched={watched} />
        </>
      )}
    </div>
  );
}
*/

function MovieList({ movies, onSelectMovie }) {
    return (
        <ul className="list list-movies">
            {movies?.map((movie) => (
                <Movie movie={movie} key={movie.imdbID} onSelectMovie={onSelectMovie} />
            ))}
        </ul>
    );
}

function Movie({ movie, onSelectMovie }) {
    return (
        <li onClick={() => onSelectMovie(movie.imdbID)}>
            <img src={movie.Poster} alt={`${movie.Title} poster`} />
            <h3>{movie.Title}</h3>
            <div>
                <p>
                    <span></span>
                    <span>{movie.Year}</span>
                </p>
            </div>
        </li>
    );
}

function MovieDetails({ selectedId, onCloseMovie, onAddWatched, watched }) {

    const [movie, setMovie] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const [userRating, setUserRating] = useState('');

    const countRef = useRef(0);

    useEffect(function () {
        if (userRating) countRef.current = countRef.current + 1;
    }, [userRating])

    const isWatched = watched.map((movie) => movie.imdbID).includes(selectedId);
    const watchedUserRating = watched.find((movie) => movie.imdbID === selectedId)?.userRating;

    const { Title: title,
        Year: year,
        Poster: poster,
        Runtime: runtime,
        imdbRating,
        Plot: plot,
        Released: released,
        Actors: actors,
        Director: director,
        Genre: genre } = movie;

    function handleAddMovieToWatchlist() {
        const newWatchMovie = {
            imdbID: selectedId,
            title,
            year,
            imdbRating: Number(imdbRating),
            poster,
            userRating,
            runtime: Number(runtime.split(' ').at(0)),
            countRatingDecisions: countRef.current
        }
        onAddWatched(newWatchMovie);
        onCloseMovie();
    }

    useEffect(function () {
        function callback(e) {
            if (e.code === 'Escape') {
                onCloseMovie();
            }
        }

        document.addEventListener('keydown', callback);

        return function () {
            document.removeEventListener('keydown', callback);
        }
    }, [onCloseMovie])

    useEffect(function () {
        async function getMovieDetail() {
            setIsLoading(true);
            const res = await fetch(`http://www.omdbapi.com/?apikey=${KEY}&i=${selectedId}`)
            const data = await res.json();
            setMovie(data);
            setIsLoading(false);
        }
        getMovieDetail();
    }, [selectedId])

    useEffect(function () {
        if (!title) return;
        document.title = `Movie | ${title}`;

        return function () {
            document.title = 'usePopcorn';
        }
    }, [title])

    return (
        <div className="details">
            {isLoading ? <Loader /> :
                <>
                    <header>
                        <button className="btn-back" onClick={onCloseMovie}>&larr;</button>
                        <img src={poster} alt={`poster of ${title} movie`} />

                        <div className="details-overview">
                            <h2>{title}</h2>
                            <p>{released} &bull; {runtime}</p>
                            <p>{genre}</p>
                            <p><span>⭐</span>{imdbRating} IMDB Rating</p>
                        </div>
                    </header>
                    <section>
                        <div className="rating">
                            {
                                !isWatched ?
                                    <>
                                        <StarRating maxRating={10} size={24} onSetRating={setUserRating} />
                                        {userRating > 0 && <button className="btn-add" onClick={handleAddMovieToWatchlist}>+ Add to watch list</button>}
                                    </> :
                                    <p>You already rated this movie as {watchedUserRating} ⭐</p>
                            }
                        </div>
                        <p><em>{plot}</em></p>
                        <p>Starring {actors}</p>
                        <p>Directed by {director}</p>
                    </section>
                </>
            }
        </div>
    )
}

function WatchedSummary({ watched }) {
    const avgImdbRating = average(watched.map((movie) => movie.imdbRating));
    const avgUserRating = average(watched.map((movie) => movie.userRating));
    const avgRuntime = average(watched.map((movie) => movie.runtime));

    return (
        <div className="summary">
            <h2>Movies you watched</h2>
            <div>
                <p>
                    <span>#️⃣</span>
                    <span>{watched.length} movies</span>
                </p>
                <p>
                    <span>⭐️</span>
                    <span>{avgImdbRating.toFixed(2)}</span>
                </p>
                <p>
                    <span>🌟</span>
                    <span>{avgUserRating.toFixed(2)}</span>
                </p>
                <p>
                    <span>⏳</span>
                    <span>{avgRuntime} min</span>
                </p>
            </div>
        </div>
    );
}

function WatchedMoviesList({ watched, onDeleteMovie }) {

    return (
        <ul className="list">
            {watched.map((movie) => (
                <WatchedMovie movie={movie} key={movie.imdbID} onDeleteMovie={onDeleteMovie} />
            ))}
        </ul>
    );
}

function WatchedMovie({ movie, onDeleteMovie }) {
    return (
        <li>
            <img src={movie.poster} alt={`${movie.title} poster`} />
            <h3>{movie.title}</h3>
            <div>
                <p>
                    <span>⭐️</span>
                    <span>{movie.imdbRating}</span>
                </p>
                <p>
                    <span>🌟</span>
                    <span>{movie.userRating}</span>
                </p>
                <p>
                    <span>⏳</span>
                    <span>{movie.runtime} min</span>
                </p>
                <p>
                    <button className="btn-delete" onClick={() => onDeleteMovie(movie.imdbID)}>X</button>
                </p>
            </div>
        </li>
    );
}
