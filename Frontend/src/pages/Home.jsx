import { Link, useNavigate } from "react-router-dom";
import { UserAuth } from "../context/AuthProvider.jsx";
import { toast } from "react-toastify";
import { UserParking } from "../context/ParkingProvider.jsx";
import { useEffect } from "react";
const Home = () => {
  const { logout, isAuthenticated, user } = UserAuth();
  const { parkings, getAllParkings } = UserParking();

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

  useEffect(() => {
    if (isAuthenticated) {
      getAllParkings();
    }
  }, [getAllParkings, isAuthenticated]);
  return (
    <div>
      <div>Home</div>
      {isAuthenticated ? (
        <p>
          <Link to={"/update-account"}>{user.fullName}</Link>
        </p>
      ) : null}
      {isAuthenticated ? (
        <button>
          <Link to={"/add-parking"}>Add New Parking</Link>
        </button>
      ) : null}
      {isAuthenticated ? (
        <div onClick={logoutHandler}>Logout</div>
      ) : (
        <p>
          <Link to={"/login"}>Login</Link>
        </p>
      )}
      {isAuthenticated ? (
        <div>
          {parkings.map((parking) => (
            <div key={parking._id}>
              <p>{parking.title}</p>
            </div>
          ))}
        </div>
      ) : null}
    </div>
  );
};

export default Home;
