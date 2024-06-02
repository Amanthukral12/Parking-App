import { Link } from "react-router-dom";
import { UserAuth } from "../context/AuthProvider.jsx";
const Navbar = () => {
  const { user } = UserAuth();
  return (
    <div className="bg-[#E38A1D] w-4/5 flex justify-between items-center px-4 py-4 rounded-md mt-4 lg:h-[8rem]">
      <h1 className="text-2xl lg:text-4xl text-[#D9D9D9] font-semibold lg:font-bold">
        <Link to={"/"}>ParkSaver</Link>
      </h1>
      <img
        src={user.profilePhoto.profilePhotoUrl}
        alt="user profile photo"
        className="h-[50px] w-[50px] lg:h-[100px] lg:w-[100px] rounded-[50%]"
      />
    </div>
  );
};

export default Navbar;
