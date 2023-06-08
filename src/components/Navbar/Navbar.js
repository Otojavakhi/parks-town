import "./Navbar.css";
import navLogo from "../../utils/png/nav-logo.png";
import { TfiAlignJustify } from "react-icons/tfi";
import { AiOutlineInstagram } from "react-icons/ai";
import { CiFacebook } from "react-icons/ci";
import { NavLink, Link } from "react-router-dom";

export const Navbar = () => {
  return (
    <nav className="nav-container">
      <div className="nav-content">
        <Link to="/">
          <img className="logo" src={navLogo} alt="parks-town" />
        </Link>

        <div className="nav-links">
          <ul className="nav-list">
            <NavLink to="project">პროექტის შესახებ</NavLink>
            <NavLink to="contact">კონტაქტი</NavLink>
            <NavLink to="blog">ბლოგი</NavLink>
          </ul>
        </div>
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
        {/* <TfiAlignJustify /> */}
      </div>
    </nav>
  );
};
