import { useEffect, useState } from "react";
import { UserAuth } from "../context/AuthProvider.jsx";
import { UserParking } from "../context/ParkingProvider.jsx";
import { toast } from "react-toastify";
import Navbar from "../components/Navbar.jsx";
import ParkingCard from "../components/ParkingCard";
import FloatingActionButton from "../components/FloatingActionButton";
import MapSection from "../components/MapSection";
import EmptyState from "../components/EmptyState";
import PageTransition from "../components/PageTransition";

const Home = () => {
  const { isAuthenticated } = UserAuth();
  const { parkings, getAllParkings, deleteParking } = UserParking();
  const [markers, setMarkers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (isAuthenticated) {
      const fetchData = async () => {
        setIsLoading(true);
        await getAllParkings();
        setIsLoading(false);
      };
      fetchData();
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
      toast.success("Parking successfully deleted", {
        position: "bottom-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "dark",
      });
    } catch (error) {
      if (error.response && error.response.data) {
        const parser = new DOMParser();
        const htmlDoc = parser.parseFromString(
          error.response.data,
          "text/html"
        );
        let errorMessage =
          htmlDoc.body.textContent?.trim() || "An error occurred";
        const index = errorMessage.indexOf("at");
        if (index !== -1) {
          errorMessage = errorMessage.substring(0, index);
          errorMessage = errorMessage.replace("Error: ", "");
        }
        toast.error(errorMessage, {
          theme: "dark",
        });
      } else {
        toast.error(error.message, {
          theme: "dark",
        });
      }
    }
  };

  return (
    <PageTransition className="min-h-screen bg-gradient-to-br from-gray-950 to-gray-900 text-white">
      <div className="w-full sticky top-0 z-10">
        <Navbar />
      </div>

      {isAuthenticated && <FloatingActionButton to="/add-parking" />}

      {isAuthenticated ? (
        <div className="pb-20">
          {isLoading ? (
            <div className="flex justify-center items-center h-[30vh]">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
            </div>
          ) : (
            <>
              <MapSection markers={markers} />

              <div className="container mx-auto px-4">
                {parkings.length === 0 ? (
                  <EmptyState />
                ) : (
                  <>
                    <h2 className="text-2xl font-bold mb-6 text-white">
                      Your Parking Spots
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {parkings.map((parking) => (
                        <ParkingCard
                          key={parking._id}
                          id={parking._id}
                          title={parking.title}
                          latitude={Number(parking.latitude)}
                          longitude={Number(parking.longitude)}
                          createdAt={parking.createdAt}
                          onDelete={deleteParkingHandler}
                        />
                      ))}
                    </div>
                  </>
                )}
              </div>
            </>
          )}
        </div>
      ) : (
        <div className="container mx-auto px-4 py-20 text-center">
          <h1 className="text-4xl font-bold mb-4">Welcome to Parking Finder</h1>
          <p className="text-gray-400 text-lg mb-8 max-w-2xl mx-auto">
            Please sign in to view and manage your parking locations. Save your
            favorite parking spots and access them anytime.
          </p>
          <button
            className="px-8 py-3 bg-gradient-to-r from-orange-500 to-amber-500 rounded-full text-white font-semibold shadow-lg hover:shadow-orange-500/30 transition-all duration-300 hover:scale-105"
            onClick={() => (window.location.href = "/login")}
          >
            Sign In to Continue
          </button>
        </div>
      )}
    </PageTransition>
  );
};

export default Home;
