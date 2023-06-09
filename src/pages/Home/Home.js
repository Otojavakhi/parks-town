import "./Home.css";
import { Link } from "react-router-dom";
import chooseBuilding from "../../utils/png/choose-building.png";

export const Home = () => {
  return (
    <div className="main-choose-building">
      <div className="intro">
        <span className="main-title">
          <h2>პარკს თაუნი - უბანი პარკის კონცეფციით</h2>
        </span>
        <span className="main-paragraph">
          <h4>
            პარკს თაუნი ახალი მასშტაბური პროექტია, რომელიც მდებარეობს ქალაქის
            ცენტრთან ძალიან ახლოს, მზარდად განვითარებად და განახლებად ქუჩაზე,
            კიკვიძის პარკის მოპირდაპირე მხარეს, ცოტნე დანიანის N305-313 -ში.
          </h4>
        </span>
        <div className="home-buttons">
          <Link className="choose-building-link" to="choose-building">
            აარჩიე აპარტამენტი
          </Link>
          <Link className="contact-us">დაგვიკავშირდით</Link>
        </div>
      </div>
      <Link to="choose-building">
        <img
          className="choose-building-img"
          src={chooseBuilding}
          alt="choose"
        />
      </Link>
    </div>
  );
};
