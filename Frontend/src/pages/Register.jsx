import { useState } from "react";
import { UserAuth } from "../context/AuthProvider.jsx";
import { toast } from "react-toastify";
import image from "../assets/Front car-pana.webp";
import { Link } from "react-router-dom";

const Register = () => {
  const { register } = UserAuth();
  const [user, setUser] = useState({
    fullName: "",
    email: "",
    userName: "",
    password: "",
    profilePhoto: null,
  });
  const { fullName, email, userName, password, profilePhoto } = user;
  const onChange = (e) => setUser({ ...user, [e.target.name]: e.target.value });
  const onFileChange = (e) => {
    setUser({ ...user, profilePhoto: e.target.files[0] });
  };
  const onSubmit = async (e) => {
    e.preventDefault();
    const userWithPhoto = new FormData();
    userWithPhoto.append("fullName", fullName);
    userWithPhoto.append("email", email);
    userWithPhoto.append("userName", userName);
    userWithPhoto.append("password", password);
    userWithPhoto.append("profilePhoto", profilePhoto);

    try {
      await register(userWithPhoto);
      toast.success("User successfully created");
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
    <div className=" lg:bg-black lg:opacity-[.87] h-[100vh] lg:flex lg:justify-center lg:items-center">
      <div className="w-full h-full z-10 lg:w-4/5 lg:h-4/5 flex flex-col-reverse lg:flex-row">
        <section className="bg-white h-[70%] w-full lg:w-1/2 lg:h-full flex flex-col items-center lg:rounded-l-3xl">
          <h1 className="hidden lg:block lg:text-4xl lg:font-semibold lg:mt-16">
            ParkSaver
          </h1>
          <p className="text-2xl lg:text-4xl font-bold mt-10 mb-10">
            Good to see you!
          </p>
          <form onSubmit={onSubmit} className="flex flex-col w-4/5">
            <input
              type="text"
              placeholder="fullname"
              value={fullName}
              onChange={onChange}
              name="fullName"
              className="text-lg lg:text-xl pl-2 border-b-2 border-gray-600 mb-4 lg:mb-8 outline-none pb-1"
            />
            <input
              type="email"
              placeholder="email"
              value={email}
              onChange={onChange}
              name="email"
              className="text-lg lg:text-xl pl-2 border-b-2 border-gray-600 mb-4 lg:mb-8 outline-none pb-1"
            />
            <input
              type="text"
              placeholder="userName"
              value={userName}
              onChange={onChange}
              name="userName"
              className="text-lg lg:text-xl pl-2 border-b-2 border-gray-600 mb-4 lg:mb-8 outline-none pb-1"
            />
            <input
              type="password"
              placeholder="password"
              value={password}
              onChange={onChange}
              name="password"
              className="text-lg lg:text-xl pl-2 border-b-2 border-gray-600 mb-4 lg:mb-8 outline-none pb-1"
            />
            <input
              type="file"
              name="profilePhoto"
              id="profilePhoto"
              onChange={onFileChange}
            />
            <button
              type="submit"
              className="bg-[#E38A1D] rounded-lg text-lg text-white py-1 mt-5 mb-5"
            >
              Register
            </button>
          </form>
          <p>
            Already have an account? <Link to={"/login"}>Sign in here</Link>.
          </p>
        </section>
        <section className="bg-[#E38A1D] w-full h-[30%] lg:h-full flex flex-col justify-center items-center lg:w-1/2 lg:rounded-r-3xl">
          <img
            src={image}
            className="h-[150px] w-[200px] lg:h-[250px] lg:w-[300px]"
            alt="parksaver image"
          />
          <h1 className="text-5xl font-bold">ParkSaver</h1>
        </section>
      </div>
    </div>
  );
};

export default Register;
