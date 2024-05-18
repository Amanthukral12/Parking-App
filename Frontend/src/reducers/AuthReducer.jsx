export const authReducer = (state, action) => {
  switch (action.type) {
    case "USER_LOADED":
      return {
        ...state,
        isAuthenticated: true,
        loading: false,
        user: action.payload,
      };
    case "REGISTER":
      return {
        ...state,
        isAuthenticated: true,
        user: action.payload,
        loading: false,
      };
    case "LOGIN":
      localStorage.setItem("token", action.payload.data.accessToken);
      localStorage.setItem(
        "userInfo",
        JSON.stringify(action.payload.data.user)
      );
      return {
        ...state,
        user: action.payload.data,
        isAuthenticated: true,
        loading: false,
      };
    case "LOGOUT":
      localStorage.clear();
      return {
        ...state,
        isAuthenticated: false,
        user: null,
        loading: false,
      };
    case "UPDATE_PROFILE":
      localStorage.setItem("userInfo", JSON.stringify(action.payload.data));
      return {
        ...state,
        user: action.payload.data,
      };
    case "UPDATE_PASSWORD":
      return {
        ...state,
      };
    case "UPDATE_PROFILE_IMAGE":
      localStorage.setItem("userInfo", JSON.stringify(action.payload.data));
      return {
        ...state,
        user: action.payload.data,
      };
    default:
      state;
  }
};
