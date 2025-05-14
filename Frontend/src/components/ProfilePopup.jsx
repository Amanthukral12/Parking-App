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
        className="bg-gradient-to-br from-gray-950 to-gray-900 text-white absolute top-4 right-4 w-[15rem] h-[15rem] p-2 rounded-lg flex flex-col items-center "
        onClick={(e) => {
          e.stopPropagation();
        }}
      >
        <img
          src={
            user?.profilePhoto?.profilePhotoUrl ||
            "https://images.unsplash.com/photo-1510227272981-87123e259b17?ixlib=rb-0.3.5&q=80&fm=jpg&crop=faces&fit=crop&h=200&w=200&s=3759e09a5b9fbe53088b23c615b6312e"
          }
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
          className="w-full mt-1 px-6 py-1 bg-gradient-to-r from-orange-500 to-amber-500 rounded-xl text-white font-medium shadow-lg hover:shadow-orange-500/30 transition-all duration-300 hover:scale-[1.02] flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Logout
        </button>
      </div>
    </div>
  ) : null;
};

export default ProfilePopup;
