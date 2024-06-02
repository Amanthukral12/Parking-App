import { useEffect, useState } from "react";
import { UserParking } from "../context/ParkingProvider.jsx";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import Navbar from "../components/Navbar.jsx";

const UpdateParking = () => {
  const { id: parkingId } = useParams();
  const { getParkingDetail, updateParking } = UserParking();
  const [formData, setFormData] = useState({
    longitude: "",
    latitude: "",
    title: "",
    note: "",
    basementLevel: "",
    pillarNumber: "",
    parkingSlip: [],
  });

  useEffect(() => {
    const fetchParkingDetail = async () => {
      try {
        const parking = await getParkingDetail(parkingId);
        if (parking) {
          setFormData({
            latitude: parking.latitude,
            longitude: parking.longitude,
            title: parking.title,
            note: parking.note,
            basementLevel: parking.basementLevel,
            pillarNumber: parking.pillarNumber,
            parkingSlip: parking.parkingSlip,
          });
        }
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
    fetchParkingDetail();
  }, [getParkingDetail, parkingId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      parkingSlip: e.target.files,
    }));
  };

  const handleLocationUpdate = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setFormData((prevState) => ({
            ...prevState,
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          }));
        },
        (error) => {
          console.log(error);
          toast.error("Failed to fetch current location");
        }
      );
    } else {
      toast.error("Geolocation is not supported by this browser");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = new FormData();
    Object.keys(formData).forEach((key) => {
      if (key === "parkingSlip") {
        if (formData[key].length > 0) {
          for (let i = 0; i < formData[key].length; i++) {
            data.append("parkingSlip", formData[key][i]);
          }
        }
      } else {
        data.append(key, formData[key]);
      }
    });

    try {
      await updateParking(parkingId, data);
      toast.success("Parking successfully updated");
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
        <h1 className="text-[#D9D9D9] text-2xl my-4">Update Parking</h1>
        <button
          className="bg-[#E38A1D] rounded-lg text-lg text-white py-1 px-4 my-4"
          onClick={handleLocationUpdate}
        >
          Update Current Location
        </button>
        <form
          onSubmit={handleSubmit}
          className="flex flex-col w-4/5 md:w-1/2 mt-5"
        >
          <label className="text-[#D9D9D9]">Latitude</label>
          <input
            type="text"
            name="latitude"
            placeholder="latitude"
            value={formData.latitude}
            readOnly
            className="text-lg lg:text-xl pl-2 border-b-2 border-gray-600 mb-4  outline-none pb-1 bg-black text-[#D9D9D9]"
          />
          <label className="text-[#D9D9D9]">Longitude</label>
          <input
            type="text"
            name="longitude"
            placeholder="longitude"
            value={formData.longitude}
            readOnly
            className="text-lg lg:text-xl pl-2 border-b-2 border-gray-600 mb-4  outline-none pb-1 bg-black text-[#D9D9D9]"
          />
          <label className="text-[#D9D9D9]">Parking Title</label>
          <input
            type="text"
            name="title"
            placeholder="Add Parking Title(Optional)"
            value={formData.title}
            onChange={handleChange}
            className="text-lg lg:text-xl pl-2 border-b-2 border-gray-600 mb-4 outline-none pb-1 bg-black text-[#D9D9D9]"
          />
          <label className="text-[#D9D9D9]">Parking Note</label>
          <input
            type="text"
            name="note"
            placeholder="Add Parking Note(Optional)"
            value={formData.note}
            onChange={handleChange}
            className="text-lg lg:text-xl pl-2 border-b-2 border-gray-600 mb-4  outline-none pb-1 bg-black text-[#D9D9D9]"
          />
          <label className="text-[#D9D9D9]">Pilar Number</label>
          <input
            type="text"
            name="pillarNumber"
            placeholder="Add Pillar Number(Optional)"
            value={formData.pillarNumber}
            onChange={handleChange}
            className="text-lg lg:text-xl pl-2 border-b-2 border-gray-600 mb-4  outline-none pb-1 bg-black text-[#D9D9D9]"
          />
          <label className="text-[#D9D9D9]">Basement Level</label>
          <input
            type="text"
            name="basementLevel"
            placeholder="Add Basement Level(Optional)"
            value={formData.basementLevel}
            onChange={handleChange}
            className="text-lg lg:text-xl pl-2 border-b-2 border-gray-600 mb-4  outline-none pb-1 bg-black text-[#D9D9D9]"
          />
          <input
            accept="image/*"
            type="file"
            capture="environment"
            onChange={handleFileChange}
            multiple
            name="parkingSlip"
          />
          <button
            type="submit"
            className="bg-[#E38A1D] rounded-lg text-lg text-[#D9D9D9] py-1 mt-5 mb-5"
          >
            Update Parking
          </button>
        </form>
      </section>
    </div>
  );
};

export default UpdateParking;
