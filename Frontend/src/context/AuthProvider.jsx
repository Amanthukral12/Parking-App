import { useContext, useReducer } from "react";
import { createContext } from "react";
import { authReducer } from "../reducers/AuthReducer.jsx";
import api from "../utils/api.js";
import axios from "axios";
const AuthContext = createContext();
const AuthProvider = ({ children }) => {
  const [authState, authDispatch] = useReducer(authReducer, {
    token: localStorage.getItem("token"),
    isAuthenticated: localStorage.getItem("userInfo") ? true : false,
    user: localStorage.getItem("userInfo")
      ? JSON.parse(localStorage.getItem("userInfo"))
      : null,
    loading: true,
    error: null,
  });

  const loadUser = async () => {
    try {
      const res = await api.get("/api/v1/users/current-user");
      authDispatch({
        type: "USER_LOADED",
        payload: res.data,
      });
      return res;
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
      const res = await axios.post(
        "https://parking-app-y150.onrender.com/api/v1/users/register",
        formData,
        config
      );
      authDispatch({
        type: "REGISTER",
        payload: res.data,
      });
    } catch (error) {
      console.log(error);
      throw error;
    }
  };

  const login = async (formData) => {
    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };
    try {
      const res = await api.post("/api/v1/users/login", formData, config);
      authDispatch({
        type: "LOGIN",
        payload: res.data,
      });
      return res;
    } catch (error) {
      console.log(error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      const res = await api.post("/api/v1/users/logout");
      authDispatch({
        type: "LOGOUT",
      });
      return res;
    } catch (error) {
      console.log(error);
      throw error;
    }
  };

  const updateProfile = async (formData) => {
    try {
      const res = await api.patch("/api/v1/users/update-account", formData);
      authDispatch({ type: "UPDATE_PROFILE", payload: res.data });
      return res;
    } catch (error) {
      console.log(error);
      throw error;
    }
  };

  const updatePassword = async (formData) => {
    try {
      const res = await api.post("/api/v1/users/change-password", formData);
      authDispatch({ type: "UPDATE_PASSWORD", payload: res.data });
      return res;
    } catch (error) {
      console.log(error);
      throw error;
    }
  };

  const updateProfileImage = async (formData) => {
    const config = {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    };
    try {
      const res = await api.patch(
        "/api/v1/users/profilePhoto",
        formData,
        config
      );
      authDispatch({ type: "UPDATE_PROFILE_IMAGE", payload: res.data });
      return res;
    } catch (error) {
      console.log(error);
      throw error;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        register,
        loadUser,
        login,
        logout,
        updateProfile,
        updatePassword,
        updateProfileImage,
        token: authState.token,
        isAuthenticated: authState.isAuthenticated,
        loading: authState.loading,
        user: authState.user,
        error: authState.error,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;

export const UserAuth = () => {
  return useContext(AuthContext);
};
