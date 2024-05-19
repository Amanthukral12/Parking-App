import {
  createContext,
  useContext,
  useReducer,
  useEffect,
  useCallback,
  useMemo,
} from "react";
import { parkingReducer } from "../reducers/ParkingReducer.jsx";
import axios from "axios";

const ParkingContext = createContext();
const ParkingProvider = ({ children }) => {
  const [parkings, parkingDispatch] = useReducer(parkingReducer, [], () => {
    const localData = localStorage.getItem("parkings");
    return localData ? JSON.parse(localData) : [];
  });

  useEffect(() => {
    localStorage.setItem("parkings", JSON.stringify(parkings));
  }, [parkings]);

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

  const contextValue = useMemo(
    () => ({
      parkings,
      getAllParkings,
    }),
    [parkings, getAllParkings]
  );

  return (
    <ParkingContext.Provider value={contextValue}>
      {children}
    </ParkingContext.Provider>
  );
};

export default ParkingProvider;

export const UserParking = () => {
  return useContext(ParkingContext);
};
