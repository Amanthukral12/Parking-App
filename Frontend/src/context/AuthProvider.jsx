import { useContext, useReducer } from "react";
import { createContext } from "react";
import { authReducer } from "../reducers/AuthReducer.jsx";
import axios from "axios";
const AuthContext = createContext();
const AuthProvider = ({ children }) => {
  const [authState, authDispatch] = useReducer(authReducer, {
    token: localStorage.getItem("token"),
    isAuthenticated: false,
    user: null,
    loading: true,
    error: null,
  });

  const loadUser = async () => {
    try {
      const res = await axios.get("/api/v1/users/current-user");
      console.log(res);
      authDispatch({
        type: "USER_LOADED",
        payload: res.data,
      });
    } catch (error) {
      console.log(error);
    }
  };

  const register = async (formData) => {
    const config = {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    };
    try {
      const res = await axios.post("/api/v1/users/register", formData, config);
      authDispatch({
        type: "REGISTER",
        payload: res.data,
      });
    } catch (error) {
      console.log(error);
      throw error;
    }
  };

  return (
    <AuthContext.Provider
      value={{ authState, authDispatch, register, loadUser }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;

export const UserAuth = () => {
  return useContext(AuthContext);
};
