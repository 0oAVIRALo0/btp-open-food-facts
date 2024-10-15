import { useState , useEffect} from "react";
import { Link } from "react-router-dom";

function Navbar() {
  const [selected, setSelected] = useState(1);

  const handleLinkClick = (id) => {
    setSelected(id);
    localStorage.setItem("activeNavBar", id); 
  };

  useEffect(()=>{
    const saved = localStorage.getItem("activeNavBar");
    if (saved) setSelected(parseInt(saved));
  },[])
  
  const links = [
    { id: 1, to: "/", label: "Home" },
    { id: 2, to: "/search", label: "Search" },
    { id: 3, to: "/predict", label: "Predict" },
    { id: 4, to: "/contact-us", label: "Contact Us" },
  ];

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
