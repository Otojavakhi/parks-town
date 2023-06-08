import "./Apartmentdetails.css";
import { useLoaderData, useParams } from "react-router-dom";
import { floorDetailLoader } from "../Floor/FloorDetails";
import { useState } from "react";

export const ApartmentDetails = () => {
  const { apart } = useParams();
  // Loads apartment's data from floors loader function
  const apartment = useLoaderData();

  // Changes apartment's images from visual to drawing.
  const [visual, setVisual] = useState(false);

  return (
    <div className="apartment-details">
      <div className="apartment-description">
        <div className="apartment-price">
          <h3>ფასი</h3>
          <p> {apartment.price} $</p>
        </div>
        <h4>ბინის ფართი: {apartment.square}</h4>
        <h4>საცხოვრებელი ფართი: {apartment.livingSquare}</h4>
        <h4>აივანი: {apartment.balcony}</h4>
        <h4>ხედი: {apartment.view}</h4>
      </div>
      <div className="apartment-imgs">
        <button onClick={() => setVisual(!visual)}>
          {visual ? "ვიზუალი" : "ნახაზი"}
        </button>
        {visual ? (
          <img src={apartment.drawImg} alt={`ბინა-${apartment.apartment}`} />
        ) : (
          <img src={apartment.visualImg} alt={`ბინა-${apartment.apartment}`} />
        )}
      </div>
    </div>
  );
};

export const apartmentDetailsLoader = async ({ params }) => {
  const { apart } = params;

  const floor = await floorDetailLoader({ params });

  const apartment = floor.apartments.find((ap) => ap.apartment === apart);

  if (!apartment) throw Error("Apartment doesn't exists!");

  return apartment;
};
