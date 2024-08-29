import React, { useState } from "react";
import { Link } from "react-router-dom";

import { Container } from "@mui/material";
import { FaBars, FaTimes } from "react-icons/fa";

function navbar() {
  const [isOpen, setIsOpen] = useState(false);

  const handleClick = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      <div className="navigation">
        <Container maxWidth="lg">
          <div className="__wrapper">
            <div className="__logo">
              <Link to='/'><img className='logo' src='/img/logo.png' alt='Logo'/></Link>
              {/* <p className="logoText">Food Processing</p> */}
            </div>
            <div className="nav">
              <ul className="__nav0">
                <div className="menu-icon" onClick={handleClick}>
                  {isOpen ? <FaTimes /> : <FaBars />}
                </div>
                <Link to="/" className="link">
                  <li>Home</li>
                </Link>

                <Link to="/search" className="link">
                  <li>Search</li>
                </Link>

                <Link to="/predict" className="link">
                  <li>Predict</li>
                </Link>

                <Link to="/contactUs" className="link">
                  <li>Contact Us</li>
                </Link>

                <li>
                  <a
                    href="https://cosylab.iiitd.edu.in/"
                    target="_blank"
                    className="link"
                  >
                    CoSyLab
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </Container>
      </div>

      {isOpen && (
        <div className="mob-nav-wrapper">
          <div className="mobileNav">
            <div className="navMob">
              <ul className="__nav0">
                <Link to="/" className="link">
                  <li>Home</li>
                </Link>

                <Link to="/search" className="link">
                  <li>Search</li>
                </Link>

                <Link to="/predict" className="link">
                  <li>Predict</li>
                </Link>

                <Link to="/contactUs" className="link">
                  <li>Contact Us</li>
                </Link>

                <li>
                  <a
                    href="https://cosylab.iiitd.edu.in/"
                    target="_blank"
                    className="link"
                  >
                    CoSyLab
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default navbar;
