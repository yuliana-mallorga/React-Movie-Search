import "./App.css";
import { Movies } from "./components/Movie";
import { useMovies } from "./assets/hook/useMovies";
import { useCallback, useEffect, useRef, useState } from "react";
import debounce from "just-debounce-it";
function useSearch() {
  const [search, updateSearch] = useState("");
  const [error, setError] = useState(null);
  const isFirstInput = useRef(true);
  useEffect(() => {
    if (isFirstInput.current) {
      isFirstInput.current = search === "";
      return;
    }
    if (search === "") {
      setError("No se puede buscar una pelicula vacia");
      return;
    }

    if (search.match(/^\d+$/)) {
      setError("No se puede buscar una pelicula con un numero");
      return;
    }

    if (search.length < 3) {
      setError("La busqueda debe tener al menos tres caracteres");
      return;
    }

    setError(null);
  }, [search]);

  return { search, updateSearch, error };
}

function App() {
  const [sort, setSort] = useState(false);
  const { search, updateSearch, error } = useSearch();
  const { movies, getMovies, loading } = useMovies({ search, sort });

  const debounceGetMovies = useCallback(
    debounce( (search) => {
    getMovies({search})
  }, 500)
  , [getMovies])

  //debounce no me funciona >.<

  const handleSubmit = (event) => {
    event.preventDefault();
    getMovies({ search });
  };

  const handleChange = (event) => {
    const newQuery = event.target.value;
    updateSearch(newQuery);
    debounceGetMovies(newQuery)
  };

  const handleSort = () => {
    setSort(!sort);
  };

  return (
    <div className="page">
      <header>
        <h1>Prueba Tecnica</h1>
        <form className="form" onSubmit={handleSubmit}>
          <label htmlFor="movie-search">
            Ingresa el nombre de la pelicula que buscas.
          </label>
          <input
            style={{
              border: "1px solid transparent",
              borderColor: error ? "red" : "transparent",
            }}
            value={search}
            onChange={handleChange}
            name="query"
            maxLength={20}
            id="movie-search"
            type="search"
            placeholder="avengers, Star Wars..."
          />
          <div>
            <label htmlFor="check" style={{ paddingRight: "12px" }}>
              Ordenar peliculas
            </label>
            <input
              type="checkbox"
              name="check"
              onChange={handleSort}
              checked={sort}
            />
          </div> 
          <button type="submit">Search</button>
        </form>
        {error && <p style={{ color: "red" }}>{error}</p>}
      </header>
      <main>
        <h2>Resultados de la busqueda</h2>
        {loading ? <p>cargando...</p> : <Movies movies={movies} />}
      </main>
    </div>
  );
}

export default App;
