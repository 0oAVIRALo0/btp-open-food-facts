import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

const links = [
  { id: 1, to: "/", label: "Home" },
  { id: 2, to: "/search", label: "Search" },
  { id: 3, to: "/predict", label: "Predict" },
  { id: 4, to: "/contact-us", label: "Contact Us" },
];

function Navbar() {
  const [selected, setSelected] = useState(1);
  const navigate = useNavigate(); 

  const handleLinkClick = (id) => {
    setSelected(id);
    localStorage.setItem("activeNavBar", id); 
  };

  useEffect(() => {
    const saved = localStorage.getItem("activeNavBar");
    if (saved) {
      const savedId = parseInt(saved);
      setSelected(savedId);

      let targetLink = '';
      if (savedId !== 2) {
        targetLink = links.find(link => link.id === savedId);
      } else {

        // const currentPath = window.location.pathname;
        // if (currentPath.startsWith('/search-result')) {
        //   targetLink = { to: currentPath }; 
        // } else if(currentPath.startsWith('/view-more-details')){
        //   targetLink = { to: currentPath }; 
        // }else {
        //   targetLink = { to: '/search' }; 
        // }
      }

      if (targetLink) {
        navigate(targetLink.to); 
      }
    }
  }, [navigate]);


  return (
    <div className="navbar_wrapper">
      <nav>
        <ul className="__nav0">
          {links.map((link) => (
            <li key={link.id}>
              <Link
                to={link.to}
                className={selected === link.id ? "active" : ""}
                onClick={() => handleLinkClick(link.id)}
              >
                {link.label}
              </Link>
            </li>
          ))}
          <li className="cosyLab">
            <a
              href="https://cosylab.iiitd.edu.in/"
              target="_blank"
              rel="noopener noreferrer"
            >
              CoSyLab
            </a>
          </li>
        </ul>
      </nav>
    </div>
  );
}

export default Navbar;