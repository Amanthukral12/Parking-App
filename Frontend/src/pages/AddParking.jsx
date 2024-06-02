import { useReducer } from "react";
import { addParkingReducer } from "../reducers/AddParkingReducer.jsx";
import { UserParking } from "../context/ParkingProvider.jsx";
import { toast } from "react-toastify";
import Navbar from "../components/Navbar.jsx";
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
  const { addParking } = UserParking();

  const { latitude, longitude, title, note, basementLevel, pillarNumber } =
    state;

  const getCurrentLocation = (e) => {
    e.preventDefault();
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        dispatch({
          type: "SET_LOCATION",
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
      });
    }
  };

  const handleCapture = (e) => {
    if (e.target.files) {
      if (e.target.files.length !== 0) {
        const files = Array.from(e.target.files);
        dispatch({
          type: "SET_PARKING_SLIPS",
          parkingSlip: files,
        });
      }
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
      toast.success("Parking successfully added");
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
      <section className="flex flex-col items-center">
        <h1 className="text-[#D9D9D9] text-2xl my-4">Add New Parking</h1>
        <button
          className="bg-[#E38A1D] rounded-lg text-lg text-white py-1 px-4 my-4"
          onClick={getCurrentLocation}
        >
          Get Current Location
        </button>
        <form onSubmit={handleSubmit} className="flex flex-col w-4/5 mt-5">
          <input
            type="text"
            name="latitude"
            placeholder="Latitude"
            value={latitude}
            readOnly
            className="text-lg lg:text-xl pl-2 border-b-2 border-gray-600 mb-4 lg:mb-8 outline-none pb-1 bg-black text-[#D9D9D9]"
          />
          <input
            type="text"
            name="longitude"
            placeholder="Longitude"
            value={longitude}
            readOnly
            className="text-lg lg:text-xl pl-2 border-b-2 border-gray-600 mb-4 lg:mb-8 outline-none pb-1 bg-black text-[#D9D9D9]"
          />
          <input
            type="text"
            name="title"
            placeholder="Add Parking Title"
            value={title}
            onChange={handleChange}
            className="text-lg lg:text-xl pl-2 border-b-2 border-gray-600 mb-4 lg:mb-8 outline-none pb-1 bg-black text-[#D9D9D9]"
          />
          <input
            type="text"
            name="note"
            placeholder="Add Parking Pote(Optional)"
            value={note}
            onChange={handleChange}
            className="text-lg lg:text-xl pl-2 border-b-2 border-gray-600 mb-4 lg:mb-8 outline-none pb-1 bg-black text-[#D9D9D9]"
          />
          <input
            type="text"
            name="pillarNumber"
            placeholder="Add Pillar Number(Optional)"
            value={pillarNumber}
            onChange={handleChange}
            className="text-lg lg:text-xl pl-2 border-b-2 border-gray-600 mb-4 lg:mb-8 outline-none pb-1 bg-black text-[#D9D9D9]"
          />
          <input
            type="text"
            name="basementLevel"
            placeholder="Add Basement Level(Optional)"
            value={basementLevel}
            onChange={handleChange}
            className="text-lg lg:text-xl pl-2 border-b-2 border-gray-600 mb-4 lg:mb-8 outline-none pb-1 bg-black text-[#D9D9D9]"
          />
          <input
            accept="image/*"
            type="file"
            capture="environment"
            onChange={handleCapture}
            multiple
          />
          <button
            type="submit"
            className="bg-[#E38A1D] rounded-lg text-lg text-[#D9D9D9] py-1 mt-5 mb-5"
          >
            Add Parking
          </button>
        </form>
      </section>
    </div>
  );
};

export default AddParking;
