import { useEffect, useState } from "react";
import "../App.css";
import FilterDropdown from "../components/FilterDropdown";
import { API_KEY, BASE_URL } from "../services/api";
import { Pagination, Spin } from "antd";
import { useNavigate } from "react-router-dom";

function MovieList() {
  const [movieList, setMovieList] = useState([]);
  const [currentPage, setCurrentpage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const itemsPage = 20;

  useEffect(() => {
    const fetchMovieList = async () => {
      setLoading(true);
      try {
        await new Promise(resolve => setTimeout(resolve, 1000));
        const res = await fetch(`${BASE_URL}/discover/movie?api_key=${API_KEY}&page=${currentPage}`);
        const data = await res.json();
        setMovieList(data.results);
        setTotalPages(data.total_pages);
      } catch (error) {
        console.error('Error fetching movies:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchMovieList();
  }, [currentPage]);

  const handlePageChange = (page) => {
    setCurrentpage(page);
    window.scrollTo(0, 0)
  }
  const handleMovieDetail = async (movieId) => {
    try {
      console.log(movieId)
      navigate(`/detail/${movieId}`);
      // const res = await fetch(`${BASE_URL}/movie/${movieId}?api_key=${API_KEY}`);
      // const data = await res.json();
      // console.log(data);
    } catch (error) {
      console.error('Error fetching movies:', error);

    }
  }

  return (

    <div className="container">
      <FilterDropdown
        setMovieList={setMovieList}
        loading={loading}
        setLoading={setLoading}
      />
      <Spin spinning={loading} tip="Loading movies..." size="large">

        <div className="movie-list" >
          {movieList.map((item, index) => (
            <div
              className="movie-box"
              key={index}
              onClick={() => handleMovieDetail(item.id)}
            >
              <div className="movie-image">
                <img
                  src={`https://image.tmdb.org/t/p/w500${item.poster_path}`}
                  alt={item.title}
                />
              </div>
              <div className="movie-content">
                <h3>{item.title}</h3>
                <p>Release date: {item.release_date}</p>
              </div>
            </div>
          ))}
        </div>
        <div className="pagination">
          <Pagination
            current={currentPage}
            total={500 * itemsPage}
            pageSize={itemsPage}
            onChange={handlePageChange}
            showSizeChanger={false}
            disabled={loading}
          />
        </div>
      </Spin>


    </div>
  );
}

export default MovieList;
