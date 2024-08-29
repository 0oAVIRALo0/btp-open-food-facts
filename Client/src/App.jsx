import React from 'react'
import { Routes, Route} from "react-router-dom";

import {NavBar, Footer} from './Components';
import {LandinPage, Search, Predict, ContactUs} from './Pages';

import "./sass/base.scss";

function App() {
  return (
    <div>
      <NavBar/>
      <Routes>
        <Route path="/" element={<LandinPage />} />
        <Route path="/search" element={<Search />} />
        <Route path="/predict" element={<Predict />} />
        <Route path="/contact-us" element={<ContactUs />} />
      </Routes>
      <Footer/>
    </div>
  )
}

export default App