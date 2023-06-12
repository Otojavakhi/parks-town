import "./Navbar.css";
import navLogo from "../../utils/png/nav-logo.png";
import { AiOutlineInstagram } from "react-icons/ai";
import { CiFacebook } from "react-icons/ci";
import { NavLink, Link } from "react-router-dom";
import { useRef } from "react";
import { FaBars, FaTimes } from "react-icons/fa";
import { useState } from "react";

export const Navbar = () => {
  const [clicked, setClicked] = useState(false);

  return (
    <nav className="nav-container">
      <Link to="/">
        <img className="logo" src={navLogo} alt="parks-town" />
      </Link>
      <div className="nav-content">
        <div className="nav-links">
          <ul className={clicked ? "nav-list active" : "nav-list"}>
            <NavLink to="project">პროექტის შესახებ</NavLink>
            <NavLink to="contact">კონტაქტი</NavLink>
            <NavLink to="blog">ბლოგი</NavLink>
          </ul>
        </div>
        <div className={clicked ? "nav-icons active" : "nav-icons"}>
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
      </div>

      <div className="nav-mobile-icons" onClick={() => setClicked(!clicked)}>
        {clicked ? (
          <button className="nav-btn nav-close-btn">
            <FaTimes />
          </button>
        ) : (
          <button className="nav-btn">
            <FaBars />
          </button>
        )}
      </div>
    </nav>
  );
};
