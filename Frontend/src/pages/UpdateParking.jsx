import { useEffect, useState } from "react";
import { UserParking } from "../context/ParkingProvider.jsx";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";

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
    <>
      <h1>UpdateParking</h1>
      <button onClick={handleLocationUpdate}>Update Current Location</button>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="latitude"
          placeholder="latitude"
          value={formData.latitude}
          readOnly
        />
        <input
          type="text"
          name="longitude"
          placeholder="longitude"
          value={formData.longitude}
          readOnly
        />
        <input
          type="text"
          name="title"
          placeholder="add parking title(Optional)"
          value={formData.title}
          onChange={handleChange}
        />
        <input
          type="text"
          name="note"
          placeholder="add parking note(Optional)"
          value={formData.note}
          onChange={handleChange}
        />
        <input
          type="text"
          name="pillarNumber"
          placeholder="add pillar number(Optional)"
          value={formData.pillarNumber}
          onChange={handleChange}
        />
        <input
          type="text"
          name="basementLevel"
          placeholder="add basement level(Optional)"
          value={formData.basementLevel}
          onChange={handleChange}
        />
        <input
          accept="image/*"
          type="file"
          capture="environment"
          onChange={handleFileChange}
          multiple
          name="parkingSlip"
        />
        <button type="submit">Update Parking</button>
      </form>
    </>
  );
};

export default UpdateParking;
