import { useState } from "react";
import { UserAuth } from "../context/AuthProvider.jsx";
import { toast } from "react-toastify";
import image from "../assets/Front car-pana.webp";
import { Link, useNavigate } from "react-router-dom";
import { CiMail } from "react-icons/ci";
import { CiUser } from "react-icons/ci";
import { CiLock } from "react-icons/ci";
import { IoEyeOutline } from "react-icons/io5";
import { IoEyeOffOutline } from "react-icons/io5";
const Register = () => {
  const [showPassword, setShowPassword] = useState(false);
  const { register } = UserAuth();
  const navigate = useNavigate();
  const [user, setUser] = useState({
    fullName: "",
    email: "",
    userName: "",
    password: "",
    profilePhoto:
      "https://images.unsplash.com/photo-1510227272981-87123e259b17?ixlib=rb-0.3.5&q=80&fm=jpg&crop=faces&fit=crop&h=200&w=200&s=3759e09a5b9fbe53088b23c615b6312e",
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

  return (
    <div className=" lg:bg-black h-[100vh] lg:flex lg:justify-center lg:items-center">
      <div className="w-full h-full z-10 lg:w-4/5 lg:h-4/5 flex flex-col-reverse lg:flex-row">
        <section className="bg-white h-[70%] w-full lg:w-1/2 lg:h-full flex flex-col items-center lg:rounded-l-3xl">
          <h1 className="hidden lg:block lg:text-6xl lg:font-bold lg:mt-8">
            ParkSaver
          </h1>
          <p className="text-2xl font-semibold my-5">Good to see you!</p>
          <form onSubmit={onSubmit} className="flex flex-col w-4/5 space-y-4 ">
            <div className="relative">
              <CiUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                placeholder="Fullname"
                value={fullName}
                onChange={onChange}
                name="fullName"
                required
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#E38A1D] focus:border-transparent outline-none transition text-base md:text-sm"
              />
            </div>
            <div className="relative">
              <CiMail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={onChange}
                name="email"
                required
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#E38A1D] focus:border-transparent outline-none transition text-base md:text-sm"
              />
            </div>
            <div className="relative">
              <CiUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                placeholder="UserName"
                value={userName}
                onChange={onChange}
                name="userName"
                required
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#E38A1D] focus:border-transparent outline-none transition text-base md:text-sm"
              />
            </div>
            <div className="relative">
              <CiLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                value={password}
                onChange={onChange}
                name="password"
                required
                className="w-full pl-10 pr-12 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition text-base md:text-sm"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? (
                  <IoEyeOffOutline className="h-5 w-5" />
                ) : (
                  <IoEyeOutline className="h-5 w-5" />
                )}
              </button>
            </div>
            <input
              type="file"
              name="profilePhoto"
              id="profilePhoto"
              onChange={onFileChange}
            />
            <button
              type="submit"
              className="bg-[#E38A1D] rounded-lg text-lg text-white my-4 font-medium py-1 transition duration-200 shadow-lg hover:shadow-xl"
            >
              Register
            </button>
          </form>
          <div className="mt-2">
            <p className="text-center text-gray-600 text-sm md:text-base">
              Already have an account?{" "}
              <Link
                to={"/login"}
                className="text-[#E38A1D] hover:text-orange-600 font-medium"
              >
                Sign in here
              </Link>
            </p>
          </div>
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
