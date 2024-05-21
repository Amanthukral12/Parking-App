import { createContext, useContext, useReducer, useCallback } from "react";
import { parkingReducer } from "../reducers/ParkingReducer.jsx";
import axios from "axios";

const ParkingContext = createContext();
const ParkingProvider = ({ children }) => {
  const [parkings, parkingDispatch] = useReducer(parkingReducer, [], () => {
    const localData = localStorage.getItem("parkings");
    return localData ? JSON.parse(localData) : [];
  });

  const getAllParkings = useCallback(async () => {
    try {
      const res = await axios.get("/api/v1/parkings/");
      parkingDispatch({
        type: "GET_PARKINGS",
        payload: res.data,
      });
    } catch (error) {
      console.log(error);
      throw error;
    }
  }, []);

  const addParking = async (formData) => {
    const config = {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    };
    try {
      const res = await axios.post(
        "/api/v1/parkings/add-parking",
        formData,
        config
      );
      parkingDispatch({
        type: "ADD_PARKING",
        payload: res.data,
      });
    } catch (error) {
      console.log(error);
      throw error;
    }
  };

  return (
    <ParkingContext.Provider value={{ parkings, getAllParkings, addParking }}>
      {children}
    </ParkingContext.Provider>
  );
};

export default ParkingProvider;

export const UserParking = () => {
  return useContext(ParkingContext);
};
