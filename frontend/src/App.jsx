import React from "react";
import Navbar from "../components/Navbar";
import MovieCard from "../components/MovieCard";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import IndexPage from "../pages/movie/index";
import LoginPage from "../pages/movie/login";
import MoviePage from "../pages/movie/[id]";

const App = () => {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<IndexPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/movie/:id" element={<MoviePage />} />
      </Routes>
    </Router>
  );
};

export default App;
