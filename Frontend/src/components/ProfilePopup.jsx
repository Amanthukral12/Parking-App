import { UserAuth } from "../context/AuthProvider.jsx";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
const ProfilePopup = ({ shown, close }) => {
  const { user, logout } = UserAuth();
  const navigate = useNavigate();
  const logoutHandler = async (e) => {
    e.preventDefault();
    try {
      await logout();
      toast.success("User logged out successfully");
      navigate("/login");
    } catch (error) {
      if (error.response && error.response.data) {
        const parser = new DOMParser();
        const htmlDoc = parser.parseFromString(
          error.response.data,
          "text/html"
        );
        let errorMessage = htmlDoc.body.textContent.trim();
        const index = errorMessage.indexOf("at");
        if (index !== -1) {
          errorMessage = errorMessage.substring(0, index);
          errorMessage = errorMessage.replace("Error: ", "");
        }
        toast.error(errorMessage);
      } else {
        toast.error(error.message);
      }
    }
  };
  return shown ? (
    <div
      className="fixed top-0 bottom-0 left-0 right-0 bg-[#00000066] z-[2]"
      onClick={() => {
        close();
      }}
    >
      <div
        className="bg-[#D9D9D9] absolute top-4 right-4 w-[15rem] h-[15rem] p-2 rounded-lg flex flex-col items-center backdrop:blur-sm"
        onClick={(e) => {
          e.stopPropagation();
        }}
      >
        <img
          src={user.profilePhoto.profilePhotoUrl}
          alt="user profile photo"
          className="h-[100px] w-[100px] rounded-[50%] border-gray-600 border-2"
        />
        <p>{user.userName}</p>
        <p>{user.email}</p>
        <Link to={"/update-account"} className="mt-2 font-semibold">
          Update Profile
        </Link>
        <button
          onClick={(e) => logoutHandler(e)}
          className="bg-[#E38A1D] rounded-lg text-lg text-[#D9D9D9] py-1 px-14 mt-2 mb-4 font-semibold"
        >
          Logout
        </button>
      </div>
    </div>
  ) : null;
};

export default ProfilePopup;
