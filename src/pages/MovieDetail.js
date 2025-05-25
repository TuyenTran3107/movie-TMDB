import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { API_KEY, BASE_URL } from "../services/api";
import { Spin } from "antd";
import "../App.css";
function MovieDetail() {
  const { id } = useParams();
  const [movie, setMovie] = useState(null);
  const [credits, setCredits] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMovieData = async () => {
      setLoading(true);
      try {
        await new Promise(resolve => setTimeout(resolve, 1000))
        const [movieRes, creditsRes] = await Promise.all([
          fetch(`${BASE_URL}/movie/${id}?api_key=${API_KEY}`),
          fetch(`${BASE_URL}/movie/${id}/credits?api_key=${API_KEY}`)
        ]);

        const [movieData, creditsData] = await Promise.all([
          movieRes.json(),
          creditsRes.json()
        ]);

        setMovie(movieData);
        setCredits(creditsData);
      } catch (error) {
        console.error('Error fetching movie details:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchMovieData();
  }, [id]);

  return (
    <Spin spinning={loading} size="large"
      tip="Loading movie details...">
      <div className="movie-detail">
        <div className="movie-banner">
          <div className="backdrop-image">
            <img
              src={`https://image.tmdb.org/t/p/original${movie?.backdrop_path}`}
              alt={movie?.title}
            />
          </div>

          <div className="movie-banner-content">
            <div className="movie-title-overlay">
              <h1>{movie?.title} ({movie?.release_date?.split('-')[0]})</h1>
              <div className="movie-meta">
                <span>{movie?.release_date}</span>
                <span>{movie?.runtime} min</span>
                {movie?.genres.map(item => (
                  <ul key={item.id}>
                    <li>{item.name}</li>
                  </ul>
                ))}
              </div>
              <div className="rating">
                User Score:
                <div className="score">{Math.round(movie?.vote_average * 10)}%</div></div>

            </div>
            <div className="overview-section">
              <h2>Overview</h2>
              <p>{movie?.overview}</p>
            </div>

            <div className="crew-section">
              <div className="crew-grid">
                {credits?.crew?.slice(0, 6).map(crewMember => (
                  <div key={`${crewMember.id}-${crewMember.job}`} className="crew-item">
                    <h4>{crewMember.name}</h4>
                    <p>{crewMember.job}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="credits-section">
          <h2>Top Billed Cast</h2>
          <div className="cast-list">
            {credits?.cast?.slice(0, 6).map(actor => (
              <div key={actor.id} className="cast-card">
                <div className="cast-image">
                  <img
                    src={`https://image.tmdb.org/t/p/w200${actor.profile_path}`}
                    alt={actor.name}

                  />
                </div>
                <div className="cast-info">
                  <h3>{actor.name}</h3>
                  <p>{actor.character}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Spin>
  );
}

export default MovieDetail;
