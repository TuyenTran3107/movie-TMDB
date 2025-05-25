import './App.css';
import { Route, Routes } from "react-router-dom";
import MovieList from './pages/MovieList';
import MovieDetail from './pages/MovieDetail';

function App() {
  return (
    <>
      <Routes>
        <Route path='/' element={<MovieList />} />
        <Route path='/detail/:id' element={<MovieDetail />} />
      </Routes>
    </>
  );
}

export default App;
