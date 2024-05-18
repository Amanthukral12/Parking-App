import { createContext, useContext, useReducer } from "react";
import { parkingReducer } from "../reducers/ParkingReducer.jsx";

const ParkingContext = createContext();
const ParkingProvider = ({ children }) => {
  const [parkingState, parkingDispatch] = useReducer(parkingReducer, {
    parkings: [],
  });
  return (
    <ParkingContext.Provider value={{}}>{children}</ParkingContext.Provider>
  );
};

export default ParkingProvider;

export const UserParking = () => {
  return useContext(ParkingContext);
};
