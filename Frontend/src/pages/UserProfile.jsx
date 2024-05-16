import { useState, useEffect } from "react";
import { UserAuth } from "../context/AuthProvider.jsx";
import { toast } from "react-toastify";

const UserProfile = () => {
  const { user, updateProfile } = UserAuth();
  const [fullName, setFullName] = useState(user.fullName);

  useEffect(() => {
    setFullName(user.fullName);
  }, [user.fullName]);

  const onSubmit = async (e) => {
    try {
      e.preventDefault();
      await updateProfile({ fullName });
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
      <section>
        <img src={user.profilePhoto.profilePhotoUrl} alt="user profile photo" />
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
          <button type="submit">Update Profile</button>
        </form>
      </section>
    </div>
  );
};

export default UserProfile;
