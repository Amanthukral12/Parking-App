import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import AuthProvider from "./context/AuthProvider.jsx";
import {
  Route,
  RouterProvider,
  createBrowserRouter,
  createRoutesFromElements,
} from "react-router-dom";
import Register from "./pages/Register.jsx";
import Home from "./pages/Home.jsx";
import Login from "./pages/Login.jsx";
import UserProfile from "./pages/UserProfile.jsx";
import ParkingProvider from "./context/ParkingProvider.jsx";
import AddParking from "./pages/AddParking.jsx";
import UpdateParking from "./pages/UpdateParking.jsx";
import ParkingDetails from "./pages/ParkingDetails.jsx";
import PrivateRoute from "./components/PrivateRoute.jsx";

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<App />}>
      <Route path="/register" element={<Register />} />
      <Route path="/login" element={<Login />} />
      <Route path="" element={<PrivateRoute />}>
        <Route index={true} path="/" element={<Home />} />
        <Route path="/update-account" element={<UserProfile />} />
        <Route path="/add-parking" element={<AddParking />} />
        <Route path="/:id" element={<ParkingDetails />} />
        <Route path="/update/:id" element={<UpdateParking />} />
      </Route>
    </Route>
  )
);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <AuthProvider>
      <ParkingProvider>
        <RouterProvider router={router} />
      </ParkingProvider>
    </AuthProvider>
  </React.StrictMode>
);
