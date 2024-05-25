export const parkingReducer = (state, action) => {
  switch (action.type) {
    case "GET_PARKINGS":
      localStorage.setItem("parkings", JSON.stringify(action.payload.data));
      return action.payload.data;
    case "ADD_PARKING": {
      const updatedParkings = [...state, action.payload.data];
      localStorage.setItem("parkings", JSON.stringify(updatedParkings));
      return updatedParkings;
    }
    case "DELETE_PARKING": {
      const updatedParkings = state.filter(
        (parking) => parking._id !== action.payload
      );
      localStorage.setItem("parkings", JSON.stringify(updatedParkings));
      return updatedParkings;
    }
    case "UPDATE_PARKING": {
      const updatedParkings = state.map((parking) =>
        parking._id === action.payload.data._id ? action.payload.data : parking
      );
      localStorage.setItem("parkings", JSON.stringify(updatedParkings));
      return updatedParkings;
    }
    case "GET_PARKING_DETAIL":
      return state.map((parking) =>
        parking._id === action.payload._id ? action.payload : parking
      );
    default:
      state;
  }
};
