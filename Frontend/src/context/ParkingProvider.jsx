import {
  createContext,
  useContext,
  useReducer,
  useCallback,
  useMemo,
} from "react";
import { parkingReducer } from "../reducers/ParkingReducer.jsx";
import api from "../utils/api.js";

const ParkingContext = createContext();
const ParkingProvider = ({ children }) => {
  const [parkings, parkingDispatch] = useReducer(parkingReducer, [], () => {
    const localData = localStorage.getItem("parkings");
    return localData ? JSON.parse(localData) : [];
  });

  const getAllParkings = useCallback(async () => {
    try {
      const res = await api.get("/api/v1/parkings/");
      parkingDispatch({
        type: "GET_PARKINGS",
        payload: res.data,
      });
    } catch (error) {
      console.log(error);
      throw error;
    }
  }, []);

  const addParking = useCallback(async (formData) => {
    const config = {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    };
    try {
      const res = await api.post(
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
  }, []);

  const deleteParking = useCallback(async (id) => {
    try {
      await api.delete(`/api/v1/parkings/${id}`);
      parkingDispatch({
        type: "DELETE_PARKING",
        payload: id,
      });
    } catch (error) {
      console.log(error);
      throw error;
    }
  }, []);

  const updateParking = useCallback(async (id, updatedData) => {
    const config = {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    };
    try {
      const res = await api.put(`/api/v1/parkings/${id}`, updatedData, config);
      parkingDispatch({
        type: "UPDATE_PARKING",
        payload: res.data,
      });
    } catch (error) {
      console.log(error);
      throw error;
    }
  }, []);

  const getParkingDetail = useCallback(async (id) => {
    try {
      const res = await api.get(`/api/v1/parkings/${id}`);
      parkingDispatch({
        type: "GET_PARKING_DETAIL",
        payload: res.data,
      });
      return res.data;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }, []);

  const contextValue = useMemo(
    () => ({
      parkings,
      getAllParkings,
      getParkingDetail,
      updateParking,
      addParking,
      deleteParking,
    }),
    [
      parkings,
      getAllParkings,
      getParkingDetail,
      updateParking,
      addParking,
      deleteParking,
    ]
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
