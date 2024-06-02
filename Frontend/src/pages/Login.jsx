import { useState, useEffect } from "react";
import { UserAuth } from "../context/AuthProvider.jsx";
import { toast } from "react-toastify";
import { useLocation, useNavigate, Link } from "react-router-dom";
import image from "../assets/Front car-pana.webp";
const Login = () => {
  const { login, isAuthenticated } = UserAuth();

  const navigate = useNavigate();

  const { search } = useLocation();
  const sp = new URLSearchParams(search);
  const redirect = sp.get("redirect") || "/";

  useEffect(() => {
    if (isAuthenticated) {
      navigate(redirect);
    }
  }, [isAuthenticated, redirect, navigate]);

  const [user, setUser] = useState({
    email: "",
    userName: "",
    password: "",
  });

  const { email, userName, password } = user;
  const onChange = (e) => setUser({ ...user, [e.target.name]: e.target.value });
  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await login({ userName, email, password });
      toast.success(res.data.message);
      navigate("/");
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
    <div className=" lg:bg-black  h-[100vh] lg:flex lg:justify-center lg:items-center">
      <div className="w-full h-full z-10 lg:w-4/5 lg:h-4/5 flex flex-col-reverse lg:flex-row">
        <section className="bg-white h-[70%] w-full lg:w-1/2 lg:h-full flex flex-col items-center lg:rounded-l-3xl">
          <h1 className="hidden lg:block lg:text-4xl lg:font-semibold lg:mt-16 ">
            ParkSaver
          </h1>
          <p className="text-2xl lg:text-4xl font-bold mt-10 mb-10">
            Good to see you again!
          </p>

          <form onSubmit={onSubmit} className="flex flex-col w-4/5">
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={onChange}
              name="email"
              className="text-lg lg:text-xl pl-2 border-b-2 border-gray-600 mb-4 lg:mb-8 outline-none pb-1"
            />
            <input
              type="text"
              placeholder="UserName"
              value={userName}
              onChange={onChange}
              name="userName"
              className="text-lg lg:text-xl pl-2 border-b-2 border-gray-600 mb-4 lg:mb-8 outline-none pb-1"
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={onChange}
              name="password"
              className="text-lg lg:text-xl pl-2 border-b-2 border-gray-600 mb-4 lg:mb-8 outline-none pb-1"
            />

            <button
              type="submit"
              className="bg-[#E38A1D] rounded-lg text-lg text-white py-1 mt-5 mb-5"
            >
              Login
            </button>
          </form>
          <p>
            Don’t have an account? <Link to={"/register"}>Sign up here</Link>.
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

export default Login;
