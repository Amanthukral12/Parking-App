import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { UserParking } from "../context/ParkingProvider.jsx";
import { toast } from "react-toastify";
import Navbar from "../components/Navbar.jsx";
import PageTransition from "../components/PageTransition";
import {
  MapPin,
  Upload,
  Save,
  Building,
  Pill as Pillar,
  Clipboard,
  StickyNote,
} from "lucide-react";

const UpdateParking = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { updateParking, getParkingDetail } = UserParking();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    latitude: "",
    longitude: "",
    title: "",
    note: "",
    basementLevel: "",
    pillarNumber: "",
    parkingSlip: [],
  });

  useEffect(() => {
    const fetchParkingDetail = async () => {
      try {
        const parking = await getParkingDetail(id);
        setFormData({
          ...parking,
          parkingSlip: [],
        });
      } catch (error) {
        navigate("/");
      }
    };
    fetchParkingDetail();
  }, [id, getParkingDetail, navigate]);

  const handleLocationUpdate = (e) => {
    e.preventDefault();
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setFormData((prev) => ({
            ...prev,
            latitude: position.coords.latitude.toString(),
            longitude: position.coords.longitude.toString(),
          }));
          toast.success("Location successfully updated", {
            position: "bottom-right",
            theme: "dark",
          });
        },
        (error) => {
          toast.error(
            "Unable to get current location. Please try again or enter manually.",
            {
              theme: "dark",
            }
          );
        }
      );
    } else {
      toast.error("Geolocation is not supported by your browser", {
        theme: "dark",
      });
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    if (e.target.files?.length) {
      const files = Array.from(e.target.files);
      setFormData((prev) => ({
        ...prev,
        parkingSlip: files,
      }));
      toast.success(
        `${files.length} image${files.length > 1 ? "s" : ""} selected`,
        {
          theme: "dark",
        }
      );
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    const data = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      if (key === "parkingSlip") {
        formData.parkingSlip.forEach((file) => {
          data.append("parkingSlip", file);
        });
      } else {
        data.append(key, value);
      }
    });

    try {
      await updateParking(id, data);
      toast.success("Parking spot successfully updated", {
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
                Update Parking
              </h1>

              <button
                className="w-full mb-8 px-6 py-4 bg-gradient-to-r from-orange-500 to-amber-500 rounded-xl text-white font-medium shadow-lg hover:shadow-orange-500/30 transition-all duration-300 hover:scale-[1.02] flex items-center justify-center"
                onClick={handleLocationUpdate}
                disabled={isLoading}
              >
                <MapPin className="w-5 h-5 mr-2" />
                Update Current Location
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
                      value={formData.latitude}
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
                      value={formData.longitude}
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
                    value={formData.title}
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
                    value={formData.note}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-lg bg-gray-800 border border-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500"
                    placeholder="Add any additional notes (optional)"
                  />
                </div>

                <div className="grid gap-6 md:grid-cols-2">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-400 flex items-center">
                      <Pillar className="w-4 h-4 mr-2" />
                      Pillar Number
                    </label>
                    <input
                      type="text"
                      name="pillarNumber"
                      value={formData.pillarNumber}
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
                      value={formData.basementLevel}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-lg bg-gray-800 border border-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500"
                      placeholder="Enter basement level (optional)"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-400 flex items-center">
                    <Upload className="w-4 h-4 mr-2" />
                    Update Parking Slips
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    capture="environment"
                    onChange={handleFileChange}
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
                      Update Parking Spot
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

export default UpdateParking;
