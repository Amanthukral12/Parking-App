import { useNavigate } from "react-router-dom";
import { UserAuth } from "../context/AuthProvider.jsx";
import { toast } from "react-toastify";
const Home = () => {
  const { logout } = UserAuth();
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
  return (
    <div>
      <div>Home</div>
      <div onClick={logoutHandler}>Logout</div>
    </div>
  );
};

export default Home;
