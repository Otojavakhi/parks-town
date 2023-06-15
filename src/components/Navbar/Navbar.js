import "./Navbar.css";
import navLogo from "../../utils/png/nav-logo.png";
import { AiOutlineInstagram } from "react-icons/ai";
import { CiFacebook } from "react-icons/ci";
import { NavLink, Link } from "react-router-dom";
import { useRef } from "react";
import { FaBars, FaTimes } from "react-icons/fa";
import { useState } from "react";
import { RxHamburgerMenu } from "react-icons/rx";
import { TfiClose } from "react-icons/tfi";

export const Navbar = () => {
  const [clicked, setClicked] = useState(false);

  const navListClass = `nav-list${clicked ? " transition-active" : ""}`;
  return (
    <nav className="nav-container">
      <Link to="/">
        <img className="logo" src={navLogo} alt="parks-town" />
      </Link>
      <div className="nav-content">
        <div className="nav-links">
          <ul className={clicked ? "nav-list active" : "nav-list"}>
            <NavLink className="nav-link" to="project">
              პროექტის შესახებ
            </NavLink>
            <NavLink className="nav-link" to="contact">
              კონტაქტი
            </NavLink>
            <NavLink className="nav-link" to="blog">
              ბლოგი
            </NavLink>
            <div className="nav-icons">
              <a
                className="nav-icon-link"
                href="https://www.facebook.com/"
                target="_blank"
                rel="noreferrer"
              >
                <CiFacebook className="nav-icon" />
              </a>
              <a
                className="nav-icon-link"
                href="https://www.instagram.com/"
                target="_blank"
                rel="noreferrer"
              >
                <AiOutlineInstagram className="nav-icon nav-icon-instagram" />
              </a>
            </div>
          </ul>
        </div>
      </div>

      <div className="nav-mobile-icons" onClick={() => setClicked(!clicked)}>
        {clicked ? (
          <button className="nav-btn nav-close-btn">
            <TfiClose />
          </button>
        ) : (
          <button className="nav-btn">
            <RxHamburgerMenu />
          </button>
        )}
      </div>
    </nav>
  );
};
