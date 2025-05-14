import { Link } from "react-router-dom";
import { UserAuth } from "../context/AuthProvider.jsx";
import { useState } from "react";
import ProfilePopup from "./ProfilePopup.jsx";
const Navbar = () => {
  const { user } = UserAuth();
  const [showPopup, setShowPopup] = useState(false);
  return (
    <div className="bg-gradient-to-r from-orange-500 to-amber-500 w-full flex justify-between items-center px-4 py-4 rounded-md lg:h-[8rem]">
      <h1 className="text-2xl lg:text-4xl text-white font-semibold lg:font-bold">
        <Link to={"/"}>ParkSaver</Link>
      </h1>
      <img
        src={
          user?.profilePhoto?.profilePhotoUrl ||
          "https://images.unsplash.com/photo-1510227272981-87123e259b17?ixlib=rb-0.3.5&q=80&fm=jpg&crop=faces&fit=crop&h=200&w=200&s=3759e09a5b9fbe53088b23c615b6312e"
        }
        alt="user profile photo"
        className="h-[50px] w-[50px] lg:h-[100px] lg:w-[100px] rounded-[50%]"
        onClick={() => setShowPopup(!showPopup)}
      />
      <ProfilePopup shown={showPopup} close={() => setShowPopup(!showPopup)} />
    </div>
  );
};

export default Navbar;
