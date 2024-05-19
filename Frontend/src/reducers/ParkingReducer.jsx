export const parkingReducer = (state, action) => {
  switch (action.type) {
    case "GET_PARKINGS":
      return action.payload.data;

    default:
      state;
  }
};
