import { useReducer, useState } from "react";
import { Link } from "react-router-dom";
import { addParkingReducer } from "../reducers/AddParkingReducer.jsx";
import { UserParking } from "../context/ParkingProvider.jsx";
import { toast } from "react-toastify";

const AddParking = () => {
  const [images, setImages] = useState([]);
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
        setImages((prevImages) => prevImages.concat(files));
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
    console.log(state);
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
    <>
      <h1>Add New Parking</h1>
      <p>
        <Link to={"/"}>Home</Link>
      </p>
      <button onClick={getCurrentLocation}>Get Current Location</button>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="latitude"
          placeholder="latitude"
          value={latitude}
          readOnly
        />
        <input
          type="text"
          name="longitude"
          placeholder="longitude"
          value={longitude}
          readOnly
        />
        <input
          type="text"
          name="title"
          placeholder="add parking title(Optional)"
          value={title}
          onChange={handleChange}
        />
        <input
          type="text"
          name="note"
          placeholder="add parking note(Optional)"
          value={note}
          onChange={handleChange}
        />
        <input
          type="text"
          name="pillarNumber"
          placeholder="add pillar number(Optional)"
          value={pillarNumber}
          onChange={handleChange}
        />
        <input
          type="text"
          name="basementLevel"
          placeholder="add basement level(Optional)"
          value={basementLevel}
          onChange={handleChange}
        />
        <input
          accept="image/*"
          type="file"
          capture="environment"
          onChange={handleCapture}
          multiple
        />
        <button type="submit">Add Parking</button>
      </form>
    </>
  );
};

export default AddParking;
