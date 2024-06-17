import { Link, useNavigate } from "react-router-dom";
import { UserAuth } from "../context/AuthProvider.jsx";
import { toast } from "react-toastify";
import { UserParking } from "../context/ParkingProvider.jsx";
import { useEffect, useState } from "react";
import Navbar from "../components/Navbar.jsx";
import { FaPlus } from "react-icons/fa";
import { FaTrash } from "react-icons/fa6";
import { MdEdit } from "react-icons/md";
import MapComponent from "../components/MapComponent.jsx";
const Home = () => {
  const { isAuthenticated } = UserAuth();
  const { parkings, getAllParkings, deleteParking } = UserParking();
  const [markers, setMarkers] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      getAllParkings();
    }
  }, [getAllParkings, isAuthenticated]);

  useEffect(() => {
    function transferToMarkers() {
      return parkings.map(({ _id, title, latitude, longitude }) => ({
        id: _id,
        name: title,
        position: { lat: Number(latitude), lng: Number(longitude) },
      }));
    }
    setMarkers(transferToMarkers());
  }, [parkings]);

  const deleteParkingHandler = async (id) => {
    try {
      await deleteParking(id);
      toast.success("Parking successfully deleted");
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
    <div className="bg-black min-h-[100vh]">
      <div className="w-full flex justify-center sticky top-0 z-10 mb-4">
        <Navbar />
      </div>
      {isAuthenticated ? (
        <button className="h-[72px] w-[72px] rounded-[50%] bg-[#E38A1D] flex justify-center items-center z-20 fixed bottom-8 left-1/2 -translate-x-1/2">
          <Link to={"/add-parking"}>
            <FaPlus className="h-[44px] w-[44px]" />
          </Link>
        </button>
      ) : null}

      {isAuthenticated ? (
        <>
          <MapComponent markers={markers} />
          <div className="flex flex-col w-4/5 mx-auto items-center md:flex-row md:flex-wrap md:justify-center">
            {parkings.map((parking) => (
              <Link
                to={`/${parking._id}`}
                className="text-[#D9D9D9] bg-[#1E1E1E] w-4/5 md:w-[40%] md:h-[14rem] lg:w-[30%] md:mx-2 h-[8rem] relative rounded-md mt-6"
                key={parking._id}
              >
                <div className="flex flex-col justify-between">
                  <p className="absolute top-4 left-1/2 -translate-x-1/2 text-xl">
                    {parking.title}
                  </p>
                  <div className="absolute bottom-4 right-4">
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        navigate(`/update/${parking._id}`);
                      }}
                    >
                      <MdEdit className="text-2xl mr-2" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        deleteParkingHandler(parking._id);
                      }}
                    >
                      <FaTrash className="text-2xl" />
                    </button>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </>
      ) : null}
    </div>
  );
};

export default Home;
