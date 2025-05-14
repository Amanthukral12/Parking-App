import { useReducer, useState } from "react";
import { addParkingReducer } from "../reducers/AddParkingReducer.jsx";
import { UserParking } from "../context/ParkingProvider.jsx";
import { toast } from "react-toastify";
import Navbar from "../components/Navbar.jsx";
import { useNavigate } from "react-router-dom";
import PageTransition from "../components/PageTransition.jsx";
import {
  Building,
  Clipboard,
  MapPin,
  Save,
  StickyNote,
  Upload,
} from "lucide-react";

const AddParking = () => {
  const initialState = {
    longitude: "",
    latitude: "",
    title: "",
    note: "",
    basementLevel: "",
    pillarNumber: "",
    parkingSlip: [],
  };

  const [state, dispatch] = useReducer(addParkingReducer, initialState);
  const [isLoading, setIsLoading] = useState(false);
  const { addParking } = UserParking();
  const navigate = useNavigate();

  const { latitude, longitude, title, note, basementLevel, pillarNumber } =
    state;

  const getCurrentLocation = async (e) => {
    e.preventDefault();
    if (navigator.geolocation) {
      try {
        const position = await new Promise((resolve, reject) => {
          navigator.geolocation.getCurrentPosition(resolve, reject);
        });

        dispatch({
          type: "SET_LOCATION",
          latitude: position.coords.latitude.toString(),
          longitude: position.coords.longitude.toString(),
        });

        toast.success("Location successfully retrieved", {
          position: "bottom-right",
          theme: "dark",
        });
      } catch (error) {
        toast.error(
          "Unable to get current location. Please try again or enter manually.",
          {
            theme: "dark",
          }
        );
      }
    } else {
      toast.error("Geolocation is not supported by your browser", {
        theme: "dark",
      });
    }
  };

  const handleCapture = (e) => {
    if (e.target.files?.length) {
      const files = Array.from(e.target.files);
      dispatch({
        type: "SET_PARKING_SLIPS",
        parkingSlip: files,
      });
      toast.success(
        `${files.length} image${files.length > 1 ? "s" : ""} selected`,
        {
          theme: "dark",
        }
      );
    }
  };

  const handleChange = (e) => {
    dispatch({
      type: "SET_FIELD",
      field: e.target.name,
      value: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    const formData = new FormData();
    formData.append("latitude", latitude);
    formData.append("longitude", longitude);
    formData.append("title", title);
    formData.append("note", note);
    formData.append("basementLevel", basementLevel);
    formData.append("pillarNumber", pillarNumber);
    state.parkingSlip.forEach((slip) => formData.append("parkingSlip", slip));

    try {
      await addParking(formData);
      toast.success("Parking spot successfully added", {
        theme: "dark",
      });
      navigate("/");
    } catch (error) {
      if (error.response?.data) {
        const parser = new DOMParser();
        const htmlDoc = parser.parseFromString(
          error.response.data,
          "text/html"
        );
        let errorMessage =
          htmlDoc.body.textContent?.trim() || "An error occurred";
        const index = errorMessage.indexOf("at");
        if (index !== -1) {
          errorMessage = errorMessage
            .substring(0, index)
            .replace("Error: ", "");
        }
        toast.error(errorMessage, {
          theme: "dark",
        });
      } else {
        toast.error(error.message, {
          theme: "dark",
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <PageTransition className="min-h-screen bg-gradient-to-br from-gray-950 to-gray-900">
      <div className="w-full sticky top-0 z-10">
        <Navbar />
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <div className="bg-gray-900 rounded-2xl shadow-xl overflow-hidden">
            <div className="p-6">
              <h1 className="text-3xl font-bold text-white mb-8 flex items-center">
                <MapPin className="w-8 h-8 mr-3 text-orange-500" />
                Add New Parking
              </h1>

              <button
                className="w-full mb-8 px-6 py-4 bg-gradient-to-r from-orange-500 to-amber-500 rounded-xl text-white font-medium shadow-lg hover:shadow-orange-500/30 transition-all duration-300 hover:scale-[1.02] flex items-center justify-center"
                onClick={getCurrentLocation}
                disabled={isLoading}
              >
                <MapPin className="w-5 h-5 mr-2" />
                Get Current Location
              </button>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid gap-6 md:grid-cols-2">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-400">
                      Latitude
                    </label>
                    <input
                      type="text"
                      name="latitude"
                      value={latitude}
                      readOnly
                      className="w-full px-4 py-3 rounded-lg bg-gray-800 border border-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500"
                      placeholder="Waiting for location..."
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-400">
                      Longitude
                    </label>
                    <input
                      type="text"
                      name="longitude"
                      value={longitude}
                      readOnly
                      className="w-full px-4 py-3 rounded-lg bg-gray-800 border border-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500"
                      placeholder="Waiting for location..."
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-400 flex items-center">
                    <Clipboard className="w-4 h-4 mr-2" />
                    Parking Title
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={title}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 rounded-lg bg-gray-800 border border-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500"
                    placeholder="Enter a title for this parking spot"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-400 flex items-center">
                    <StickyNote className="w-4 h-4 mr-2" />
                    Parking Note
                  </label>
                  <input
                    type="text"
                    name="note"
                    value={note}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-lg bg-gray-800 border border-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500"
                    placeholder="Add any additional notes (optional)"
                  />
                </div>

                <div className="grid gap-6 md:grid-cols-2">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-400 flex items-center">
                      <Building className="w-4 h-4 mr-2" />
                      Pillar Number
                    </label>
                    <input
                      type="text"
                      name="pillarNumber"
                      value={pillarNumber}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-lg bg-gray-800 border border-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500"
                      placeholder="Enter pillar number (optional)"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-400 flex items-center">
                      <Building className="w-4 h-4 mr-2" />
                      Basement Level
                    </label>
                    <input
                      type="text"
                      name="basementLevel"
                      value={basementLevel}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-lg bg-gray-800 border border-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500"
                      placeholder="Enter basement level (optional)"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-400 flex items-center">
                    <Upload className="w-4 h-4 mr-2" />
                    Parking Slips
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    capture="environment"
                    onChange={handleCapture}
                    multiple
                    className="w-full px-4 py-3 rounded-lg bg-gray-800 border border-gray-700 text-white file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-orange-500 file:text-white hover:file:bg-orange-600"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full px-6 py-4 bg-gradient-to-r from-orange-500 to-amber-500 rounded-xl text-white font-medium shadow-lg hover:shadow-orange-500/30 transition-all duration-300 hover:scale-[1.02] flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>
                  ) : (
                    <>
                      <Save className="w-5 h-5 mr-2" />
                      Add Parking Spot
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </PageTransition>
  );
};

export default AddParking;
