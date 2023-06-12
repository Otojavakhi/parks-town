import "./Apartmentdetails.css";
import { useLoaderData } from "react-router-dom";
import { floorDetailLoader } from "../Floor/FloorDetails";
import { useState } from "react";
import { useEffect } from "react";
import { getDownloadURL, ref } from "firebase/storage";
import { storage } from "../../FirebaseConfig";
import { Spinner } from "../../components/Spinner/Spinner";

export const ApartmentDetails = () => {
  // Loads apartment's data from floors loader function
  const apartment = useLoaderData();

  // Changes apartment's images from visual to drawing.
  const [visual, setVisual] = useState(false);
  const [imageUrl, setImageUrl] = useState("");
  const [initialLoading, setInitialLoading] = useState(true);

  // sets Images according state value
  useEffect(() => {
    const getApartmentImages = async () => {
      try {
        const storageRef = ref(
          storage,
          visual ? apartment.drawImg : apartment.visualImg
        );
        const url = await getDownloadURL(storageRef);

        setImageUrl(url);
        setInitialLoading(false);
      } catch (error) {
        console.log(error.message);
      }
    };
    getApartmentImages();
  }, [visual, apartment.drawImg, apartment.visualImg]);

  if (initialLoading)
    return (
      <div className="isloading">
        <Spinner />
      </div>
    );
  return (
    <div className="apartment-details">
      <div className="apartment-description">
        <div className="apartment-price">
          <h3>ფასი</h3>
          <p> {apartment.price} $</p>
        </div>
        <div className="apartment-details-info">
          <span className="info-display">
            <h4>ბინა</h4>
            <span>{apartment.apartment.slice(-1)}</span>
          </span>
          <span className="info-display">
            <h4>სართული</h4>
            <span>{apartment.floor.slice(-1)}</span>
          </span>
          <span className="info-display">
            <h4>ბინის ფართი</h4>
            <span>{apartment.square}</span>
          </span>
          <span className="info-display">
            <h4>საცხოვრებელი ფართი</h4>
            <span>{apartment.livingSquare}</span>
          </span>
          <span className="info-display">
            <h4>აივანი</h4>
            <span>{apartment.balcony}</span>
          </span>
          <span className="info-display">
            <h4>ხედი</h4>
            <span>{apartment.view}</span>
          </span>
        </div>
      </div>
      <div className="apartment-imgs">
        <button onClick={() => setVisual(!visual)}>
          {visual ? "ვიზუალი" : "ნახაზი"}
        </button>

        <img src={imageUrl} alt={`ბინა-${apartment.apartment}`} />
      </div>
    </div>
  );
};

export const apartmentDetailsLoader = async ({ params }) => {
  try {
    const { apart } = params;

    const floor = await floorDetailLoader({ params });

    const apartment = floor.apartments.find((ap) => ap.apartment === apart);

    if (!apartment) throw Error("Apartment doesn't exists!");

    return apartment;
  } catch (error) {
    throw Error("Apartment doesn't exists!");
  }
};
