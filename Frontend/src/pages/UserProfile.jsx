import { useState, useEffect } from "react";
import { UserAuth } from "../context/AuthProvider.jsx";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";
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
    <div>
      <p>
        <Link to={"/"}>Home</Link>
      </p>
      <section>
        <img src={user.profilePhoto.profilePhotoUrl} alt="user profile photo" />
        <input type="file" name="profilePhoto" onChange={onFileChange} />
        <p>{user.userName}</p>
        <p>{user.fullName}</p>
        <p>{user.email}</p>
      </section>
      <section>
        <form onSubmit={onSubmit}>
          <input
            type="text"
            placeholder="Full Name"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
          />
          <input
            type="password"
            placeholder="Enter old Password"
            onChange={(e) => setOldPassword(e.target.value)}
          />
          <input
            type="password"
            placeholder="Enter new Password"
            onChange={(e) => setNewPasswword(e.target.value)}
          />
          <button type="submit">Update Profile</button>
        </form>
      </section>
    </div>
  );
};

export default UserProfile;
