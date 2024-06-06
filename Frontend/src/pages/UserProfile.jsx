import { useState, useEffect } from "react";
import { UserAuth } from "../context/AuthProvider.jsx";
import { toast } from "react-toastify";
import { FaCamera } from "react-icons/fa";
import Navbar from "../components/Navbar.jsx";
import "./styles.css";
const UserProfile = () => {
  const { user, updateProfile, updatePassword, updateProfileImage } =
    UserAuth();
  const [fullName, setFullName] = useState(user.fullName);
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPasswword] = useState("");

  useEffect(() => {
    setFullName(user.fullName);
  }, [user.fullName]);

  const onFileChange = async (e) => {
    try {
      e.preventDefault();
      const profilePhoto = e.target.files[0];
      await updateProfileImage({ profilePhoto });
      e.target.value = null;
      toast.success("Profile Photo updated");
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
        e.target.value = null;
        toast.error(errorMessage);
      } else {
        toast.error(error.message);
      }
    }
  };

  const onSubmit = async (e) => {
    try {
      e.preventDefault();
      await updateProfile({ fullName });
      if (oldPassword && newPassword) {
        await updatePassword({ oldPassword, newPassword });
      }
      toast.success("User Updated successfully");
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
        <div className="profilepic">
          <img
            src={
              user?.profilePhoto?.profilePhotoUrl ||
              "https://images.unsplash.com/photo-1510227272981-87123e259b17?ixlib=rb-0.3.5&q=80&fm=jpg&crop=faces&fit=crop&h=200&w=200&s=3759e09a5b9fbe53088b23c615b6312e"
            }
            alt="user profile photo"
            className="h-[300px] w-[300px] rounded-[50%] border-gray-600 border-2 profilepic__image"
          />
          <label id="profilePhoto" className="profilepic__content">
            <input
              id="profilePhoto"
              type="file"
              name="profilePhoto"
              onChange={onFileChange}
              hidden
            />
            <span className="profilepic__icon">
              <FaCamera className="text-2xl text-[#D9D9D9] absolute icon" />
            </span>
          </label>
        </div>

        <p className="text-[#D9D9D9]">{user.userName}</p>
        <p className="text-[#D9D9D9]">{user.fullName}</p>
        <p className="text-[#D9D9D9]">{user.email}</p>
      </section>
      <section className="flex flex-col items-center">
        <form onSubmit={onSubmit} className="flex flex-col w-4/5 md:w-1/2 mt-5">
          <label className="text-[#D9D9D9]">FullName</label>
          <input
            type="text"
            placeholder="Full Name"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            className="text-lg lg:text-xl pl-2 border-b-2 border-gray-600 mb-4  outline-none pb-1 bg-black text-[#D9D9D9]"
          />
          <label className="text-[#D9D9D9]">Old Password</label>
          <input
            type="password"
            placeholder="Enter old Password"
            onChange={(e) => setOldPassword(e.target.value)}
            className="text-lg lg:text-xl pl-2 border-b-2 border-gray-600 mb-4  outline-none pb-1 bg-black text-[#D9D9D9]"
          />
          <label className="text-[#D9D9D9]">New Password</label>
          <input
            type="password"
            placeholder="Enter new Password"
            onChange={(e) => setNewPasswword(e.target.value)}
            className="text-lg lg:text-xl pl-2 border-b-2 border-gray-600 mb-4  outline-none pb-1 bg-black text-[#D9D9D9]"
          />
          <button
            type="submit"
            className="bg-[#E38A1D] rounded-lg text-lg text-[#D9D9D9] py-1 mt-5 mb-5"
          >
            Update Profile
          </button>
        </form>
      </section>
    </div>
  );
};

export default UserProfile;
