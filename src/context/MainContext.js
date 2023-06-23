import { useState } from "react";
import { useEffect } from "react";
import { useContext } from "react";
import { createContext } from "react";
import { colRef } from "../FirebaseConfig";
import { getDocs } from "firebase/firestore";
import { storage } from "../FirebaseConfig";
import { ref, getDownloadURL } from "firebase/storage";
import { onAuthStateChanged, getAuth } from "firebase/auth";

const MainContext = createContext();

export const MainContextProvider = ({ children }) => {
  const auth = getAuth();
  // get data from firebase
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // user Auth
  const [user, setUser] = useState({});

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      // console.log(currentUser)

      setUser(currentUser);
    });
    return () => {
      unsubscribe();
    };
  }, []);

  const [buildingData, setBuildingData] = useState(null);

  // get image from storage
  const [imgUrl, setImgUrl] = useState("");

  // fetch selected floor
  const [floor, setFloor] = useState({});

  // fetch img from storage
  const getImgUrl = async (urlLink) => {
    try {
      const storageRef = ref(storage, urlLink);
      const url = await getDownloadURL(storageRef);
      setImgUrl(url);
    } catch (error) {
      console.log(error);
    }
  };

  // fetching building-1 data
  // useEffect(() => {
  //   const fetchData = async () => {
  //     try {
  //       const res = await getDocs(colRef);
  //       const filteredData = res.docs.map((doc) => ({
  //         ...doc.data(),
  //         id: doc.id,
  //       }));
  //       setData(filteredData);
  //     } catch (error) {
  //       console.log(error.message);
  //     }
  //     setIsLoading(false);
  //   };
  //   fetchData();
  // }, []);

  return (
    <MainContext.Provider
      value={{
        data,
        setData,
        isLoading,
        setIsLoading,
        imgUrl,
        setImgUrl,
        getImgUrl,
        floor,
        setFloor,
        buildingData,
        setBuildingData,
        user,
        setUser,
      }}
    >
      {children}
    </MainContext.Provider>
  );
};

export const MainUseContext = () => useContext(MainContext);
