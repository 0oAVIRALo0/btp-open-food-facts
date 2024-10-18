import React from 'react'
import { Routes, Route} from "react-router-dom";

import {NavBar} from './Components';
import {LandinPage, Search, SearchResult, Predict, ContactUs} from './Pages';

import "./sass/base.scss";

function App() {
  return (
    <div>
      <Routes>
        <Route path="/" element={<LandinPage />} />
        <Route path="/search" element={<Search />} />
        <Route path="/search-result" element={<SearchResult />} />
        <Route path="/predict" element={<Predict />} />
        <Route path="/contact-us" element={<ContactUs />} />
      </Routes>
      <NavBar />
    </div>
  )
}

export default App