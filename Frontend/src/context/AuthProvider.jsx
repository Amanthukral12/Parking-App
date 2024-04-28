import { useContext, useReducer } from "react";
import { createContext } from "react";
import { authReducer } from "../reducers/AuthReducer.jsx";

const AuthContext = createContext();
const AuthProvider = ({ children }) => {
  const [authState, authDispatch] = useReducer(authReducer, {
    token: localStorage.getItem("token"),
    isAuthenticated: false,
    user: null,
    loading: true,
    error: null,
  });

  return (
    <AuthContext.Provider value={{ authState, authDispatch }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;

export const UserAuth = () => {
  return useContext(AuthContext);
};
