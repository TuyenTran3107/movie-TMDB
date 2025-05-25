import { Dropdown, Input, Space, Spin } from 'antd';
import { DownOutlined } from '@ant-design/icons';
import Search from 'antd/es/input/Search';
import { use, useEffect, useState } from 'react';
import { API_KEY, BASE_URL } from '../services/api';

function FilterDropdown({ setMovieList, loading, setLoading }) {
  const [genres, setGenres] = useState([]);
  const [selectedGenre, setSelectedGenre] = useState('All Genres');

  useEffect(() => {
    const fetchGenres = async () => {
      try {
        const res = await fetch(`${BASE_URL}/genre/movie/list?api_key=${API_KEY}`);
        const data = await res.json();
        setGenres(data.genres)
      } catch (error) {
        console.error('Error fetching genres:', error);
      }
    }
    fetchGenres();
  }, []);

  useEffect(() => {
    const fetchMovieGenre = async () => {
      setLoading(true);
      try {
        await new Promise(resolve => setTimeout(resolve, 1000));
        const url = selectedGenre === 'All Genres' || selectedGenre === "" ? `${BASE_URL}/discover/movie?api_key=${API_KEY}`
          :
          `${BASE_URL}/search/movie?api_key=${API_KEY}&query=${selectedGenre}`;
        const res = await fetch(url);
        const data = await res.json();
        setMovieList(data.results)

      } catch (error) {
        console.error('Error fetching genres:', error);

      } finally {
        setLoading(false);
      }
    }
    fetchMovieGenre();
  }, [selectedGenre]);
  const items = [
    {
      label: 'All Genres',
      key: 0,
      onClick: () => setSelectedGenre('All Genres')
    },
    ...genres.map((item, index) => {
      return {
        label: item.name,
        key: index + 1,
        onClick: () => setSelectedGenre(item.name)
      }
    })
  ]

  const onSearch = async (value) => {
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      const url = !value.trim()
        ? `${BASE_URL}/discover/movie?api_key=${API_KEY}`
        : `${BASE_URL}/search/movie?api_key=${API_KEY}&query=${value}`;

      const res = await fetch(url);
      const data = await res.json();
      setMovieList(data.results);
    } catch (error) {
      console.error('Error searching movies:', error);
    } finally {
      setLoading(false);
    }
  }
  return (
    <div className="filter">
      <h2>Popular Movies</h2>
      <div className="filter-bars">
        <div className="filter-dropdown">
          <Dropdown menu={{ items }} trigger={['click']} disabled={loading}>
            <a onClick={e => e.preventDefault()}>
              <Space style={{ color: "gray" }}>
                {selectedGenre}
                <DownOutlined style={{ fontSize: "12px", marginLeft: "30px" }} />
              </Space>
            </a>
          </Dropdown>
        </div>
        <div className="search">
          <Search
            placeholder="Search movies..."
            onSearch={onSearch}
            onChange={e => onSearch(e.target.value)}
            enterButton
          />
        </div>
      </div>
    </div>
  );
}

export default FilterDropdown;
