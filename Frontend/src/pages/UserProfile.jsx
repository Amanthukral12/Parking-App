import { useState, useEffect } from "react";
import { UserAuth } from "../context/AuthProvider.jsx";
import { toast } from "react-toastify";
import Navbar from "../components/Navbar.jsx";
import "./styles.css";
import { Camera, Lock, Save, UserCircle } from "lucide-react";
import PageTransition from "../components/PageTransition.jsx";
const UserProfile = () => {
  const { user, updateProfile, updatePassword, updateProfileImage } =
    UserAuth();
  const [fullName, setFullName] = useState(user.fullName);
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPasswword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

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
      setIsLoading(true);
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
              <div className="flex flex-col items-center mb-8">
                <div className="relative group">
                  <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-orange-500/20 shadow-xl">
                    <img
                      src={
                        user?.profilePhoto?.profilePhotoUrl ||
                        "https://images.pexels.com/photos/2379005/pexels-photo-2379005.jpeg"
                      }
                      alt="Profile"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <label
                    className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                    htmlFor="profilePhoto"
                  >
                    <Camera className="w-6 h-6 text-white" />
                    <input
                      id="profilePhoto"
                      type="file"
                      name="profilePhoto"
                      onChange={onFileChange}
                      className="hidden"
                      accept="image/*"
                    />
                  </label>
                </div>

                <div className="mt-4 text-center">
                  <h2 className="text-xl font-bold text-white">
                    {user.fullName}
                  </h2>
                  <p className="text-gray-400">@{user.userName}</p>
                  <p className="text-gray-400 mt-1">{user.email}</p>
                </div>
              </div>

              <form onSubmit={onSubmit} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-400 flex items-center">
                    <UserCircle className="w-4 h-4 mr-2" />
                    Full Name
                  </label>
                  <input
                    type="text"
                    placeholder="Enter your full name"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full px-4 py-3 rounded-lg bg-gray-800 border border-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-400 flex items-center">
                    <Lock className="w-4 h-4 mr-2" />
                    Current Password
                  </label>
                  <input
                    type="password"
                    placeholder="Enter your current password"
                    value={oldPassword}
                    onChange={(e) => setOldPassword(e.target.value)}
                    className="w-full px-4 py-3 rounded-lg bg-gray-800 border border-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-400 flex items-center">
                    <Lock className="w-4 h-4 mr-2" />
                    New Password
                  </label>
                  <input
                    type="password"
                    placeholder="Enter your new password"
                    value={newPassword}
                    onChange={(e) => setNewPasswword(e.target.value)}
                    className="w-full px-4 py-3 rounded-lg bg-gray-800 border border-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500"
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
                      Update Profile
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

export default UserProfile;
