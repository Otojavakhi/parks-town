import { useRef, useEffect, useState } from "react";
import {
  collection,
  getDocs,
  updateDoc,
  query,
  where,
} from "firebase/firestore";
import { getFirestore, doc } from "firebase/firestore";

import { MainUseContext } from "../../../context/MainContext";
import { Buildings } from "../../Buildings/Buildings";

export default function AdminPanel() {
  const priceRef = useRef(null);
  const buildingRef = useRef("");
  const db = getFirestore();

  const [buildings, setBuildings] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const colRef = collection(db, "buildings");
      const snapshot = await getDocs(colRef);

      let buildingsData = [];

      if (!snapshot.empty) {
        buildingsData = snapshot.docs.map((doc) => ({
          ...doc.data(),
          id: doc.id,
        }));
      }
      setBuildings(buildingsData);
    };
    fetchData();
  }, []);

  console.log("buildings", buildings);
  const handleSubmit = async (e) => {
    e.preventDefault();
    const price = priceRef.current?.value;
    const buildingId = buildingRef.current;
    console.log("building", buildingId);

    if (!buildingId) {
      // Building ID is not selected, handle the error or show a message
      return;
    }

    const buildingQuery = query(
      collection(db, "buildings"),
      where("building", "==", buildingId)
    );
    const buildingSnapshot = await getDocs(buildingQuery);

    if (!buildingSnapshot.empty) {
      buildingSnapshot.forEach((buildingDoc) => {
        const buildingDocRef = doc(db, "buildings", buildingDoc.id);

        const floors = buildingDoc.data().floors || []; // Handle missing or empty floors array
        const updatedFloors = floors.map((floor) => {
          const apartments = floor.apartments || []; // Handle missing or empty apartments array
          const updatedApartments = apartments.map((apartment) => {
            const currentPrice = apartment.price;
            const updatedPrice = currentPrice + Number(price);
            return { ...apartment, price: updatedPrice };
          });
          return { ...floor, apartments: updatedApartments };
        });

        // Update each building document with the new apartment prices
        updateDoc(buildingDocRef, { floors: updatedFloors });
      });

      // Clear the form and notify the user of the successful update
      priceRef.current.value = "";
      buildingRef.current = "";
      alert("Apartments updated successfully!");
    } else {
      console.log("Building not found");
    }
  };

  const selectChange = (e) => {
    e.preventDefault();
    buildingRef.current = e.target.value;
    console.log(e.target.value);
  };

  return (
    <div>
      <form action="" onSubmit={handleSubmit}>
        <input placeholder="Enter price" ref={priceRef} />
        <select name="building" id="" onChange={selectChange}>
          <option value="">Select a building</option>
          {buildings.map((building, i) => (
            <option key={building.building} value={building.building}>
              {building.building}
            </option>
          ))}
        </select>
        <button type="submit">Update prices</button>
      </form>
      {/* <Buildings /> */}
    </div>
  );
}
