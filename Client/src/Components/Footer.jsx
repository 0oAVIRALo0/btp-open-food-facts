import React from "react";

import { Container } from "@mui/material";
import {FaFacebook, FaWikipediaW, FaLinkedin, FaGithub, FaInstagram, FaTwitter, FaGooglePlus} from "react-icons/fa";

function Footer() {
  return (
    <footer>
      <Container maxWidth="lg">
        <img
          width="80"
          alt=""
          src="https://cosylab.iiitd.edu.in/recipedb/static/iiitd.png"
        />
        <p>Copyright © 2024 All rights reserved.</p>
        <p>
          This work is licensed under a&nbsp;
          <a href="https://creativecommons.org/licenses/by-nc-sa/3.0/">
            <strong>
              Creative Commons Attribution-NonCommercial-ShareAlike 3.0 Unported
              License.
            </strong>
          </a>
        </p>
        All material on this website is a product of research and is provided
        for your information only and may not be construed as medical advice or
        instruction.
        <br />
        No action or inaction should be taken based solely on the contents of
        this information; instead, readers should consult appropriate health
        professionals on any matter relating to their health and well-being.
        <br />
        <br />
        <div className="__institute_details">
          <a href="https://iiitd.ac.in/" target={"_blank"}>
            <strong>
              {" "}
              Indraprastha Institute of Information Technology Delhi
              (IIIT-Delhi){" "}
            </strong>
          </a>
          &nbsp; | &nbsp;
          <a href="https://cosylab.iiitd.edu.in/" target={"_blank"}>
            <strong> Prof. Ganesh Bagler</strong>
          </a>
        </div>
        <div className="__social_media">
          <a href="https://scholar.google.com/citations?hl=en&user=qyth_0QAAAAJ" target="_blank" >
            {" "}
            <FaGooglePlus />
          </a>
          <a href="https://in.linkedin.com/in/ganeshbagler" target="_blank" >
            {" "}
            <FaLinkedin />
          </a>
          <a href="https://en.wikipedia.org/wiki/Ganesh_Bagler" target="_blank" >
            {" "}
            <FaWikipediaW />
          </a>
          <a href="https://github.com/cosylabiiit" target="_blank" >
            {" "}
            <FaGithub />
          </a>
           <a href="https://twitter.com/gansbags" target="_blank" >
            {" "}
            <FaTwitter />
          </a>
           <a href="https://www.facebook.com/ganesh.bagler" target="_blank" >
            {" "}
            <FaFacebook />
          </a>
           <a href="https://www.instagram.com/gansbags/?hl=bg" target="_blank" >
            {" "}
            <FaInstagram />
          </a>
        </div>
        
      </Container>
    </footer>
  );
}

export default Footer;
