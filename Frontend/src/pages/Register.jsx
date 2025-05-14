import { useState } from "react";
import { UserAuth } from "../context/AuthProvider.jsx";
import { toast } from "react-toastify";
import image from "../assets/Front car-pana.webp";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff, Lock, LogIn, Mail, Upload, User } from "lucide-react";
import PageTransition from "../components/PageTransition.jsx";
const Register = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
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
    setIsLoading(true);
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
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <PageTransition>
      <div className="min-h-screen bg-gradient-to-br from-gray-950 to-gray-900 flex items-center justify-center p-4">
        <div className="w-full max-w-6xl bg-gray-900 rounded-2xl shadow-xl overflow-hidden flex flex-col lg:flex-row">
          <div className="w-full lg:w-1/2 p-4">
            <div className="max-w-md mx-auto">
              <h1 className="text-3xl font-bold text-white mb-2">Park Saver</h1>
              <p className="text-gray-400 mb-2">Good to see you</p>
              <form onSubmit={onSubmit} className="space-y-3 ">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-400 flex items-center">
                    <User className="w-4 h-4 mr-2" />
                    Fullname
                  </label>
                  <div className="relative">
                    <input
                      type="fullName"
                      name="fullName"
                      value={fullName}
                      onChange={onChange}
                      placeholder="Enter your fullname"
                      className="w-full px-4 py-2 rounded-lg bg-gray-800 border border-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-400 flex items-center">
                    <Mail className="w-4 h-4 mr-2" />
                    Email
                  </label>
                  <div className="relative">
                    <input
                      type="email"
                      name="email"
                      value={email}
                      onChange={onChange}
                      placeholder="Enter your email"
                      className="w-full px-4 py-2 rounded-lg bg-gray-800 border border-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-400 flex items-center">
                    <User className="w-4 h-4 mr-2" />
                    Username
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      name="userName"
                      value={userName}
                      onChange={onChange}
                      placeholder="Enter your username"
                      className="w-full px-4 py-2 rounded-lg bg-gray-800 border border-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-400 flex items-center">
                    <Lock className="w-4 h-4 mr-2" />
                    Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      name="password"
                      value={password}
                      onChange={onChange}
                      placeholder="Enter your password"
                      className="w-full px-4 py-2 rounded-lg bg-gray-800 border border-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 pr-12"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                    >
                      {showPassword ? (
                        <EyeOff className="w-5 h-5" />
                      ) : (
                        <Eye className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-400 flex items-center">
                    <Upload className="w-4 h-4 mr-2" />
                    Profile Photo
                  </label>
                  <input
                    type="file"
                    name="profilePhoto"
                    onChange={onFileChange}
                    className="w-full px-4 py-2 rounded-lg bg-gray-800 border border-gray-700 text-white file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-orange-500 file:text-white hover:file:bg-orange-600"
                  />
                </div>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full px-6 py-2 bg-gradient-to-r from-orange-500 to-amber-500 rounded-xl text-white font-medium shadow-lg hover:shadow-orange-500/30 transition-all duration-300 hover:scale-[1.02] flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>
                  ) : (
                    <>
                      <LogIn className="w-5 h-5 mr-2" />
                      Sign up
                    </>
                  )}
                </button>
              </form>
              <p className="mt-4 text-center text-gray-400">
                Already have an account?{" "}
                <Link
                  to="/login"
                  className="text-orange-500 hover:text-orange-400 font-medium transition-colors"
                >
                  Sign in here
                </Link>
              </p>
            </div>
          </div>
          <div className="hidden lg:block w-1/2 bg-gradient-to-br from-orange-500 to-amber-500 p-12">
            <div className="h-full flex flex-col items-center justify-center">
              <div className="rounded-2xl  p-8 text-center">
                <img
                  src={image}
                  className="h-[150px] w-[200px] lg:h-[250px] lg:w-[300px]"
                  alt="parksaver image"
                />
                <h2 className="text-4xl font-bold text-white mb-4">
                  ParkSaver
                </h2>
                <p className="text-white/90 text-lg">
                  Your personal parking companion
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </PageTransition>
  );
};

export default Register;
