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

    default:
      state;
  }
};
