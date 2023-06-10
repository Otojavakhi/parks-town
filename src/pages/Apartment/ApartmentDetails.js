import "./Apartmentdetails.css";
import { useLoaderData, useParams } from "react-router-dom";
import { floorDetailLoader } from "../Floor/FloorDetails";
import { useState } from "react";
import { useEffect } from "react";
import { getDownloadURL, ref } from "firebase/storage";
import { storage } from "../../FirebaseConfig";
import { Spinner } from "../../components/Spinner/Spinner";
import { MainUseContext } from "../../context/MainContext";

export const ApartmentDetails = () => {
  const { apart } = useParams();
  // Loads apartment's data from floors loader function
  const apartment = useLoaderData();
  const { isLoading, setIsLoading } = MainUseContext();

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
  }, [visual]);

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
        <h4>ბინის ფართი: {apartment.square}</h4>
        <h4>საცხოვრებელი ფართი: {apartment.livingSquare}</h4>
        <h4>აივანი: {apartment.balcony}</h4>
        <h4>ხედი: {apartment.view}</h4>
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
  const { apart } = params;

  const floor = await floorDetailLoader({ params });

  const apartment = floor.apartments.find((ap) => ap.apartment === apart);

  if (!apartment) throw Error("Apartment doesn't exists!");

  return apartment;
};
