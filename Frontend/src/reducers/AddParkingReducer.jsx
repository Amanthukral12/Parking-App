export const addParkingReducer = (state, action) => {
  switch (action.type) {
    case "SET_FIELD":
      return { ...state, [action.field]: action.value };
    case "SET_LOCATION":
      return {
        ...state,
        latitude: action.latitude,
        longitude: action.longitude,
      };
    case "SET_PARKING_SLIPS":
      return { ...state, parkingSlip: action.parkingSlip };
    default:
      return state;
  }
};
