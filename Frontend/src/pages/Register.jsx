import { useState } from "react";
import { UserAuth } from "../context/AuthProvider.jsx";
import { toast } from "react-toastify";
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
    <>
      <h1>Register</h1>

      <form onSubmit={onSubmit}>
        <input
          type="text"
          placeholder="fullname"
          value={fullName}
          onChange={onChange}
          name="fullName"
        />
        <input
          type="email"
          placeholder="email"
          value={email}
          onChange={onChange}
          name="email"
        />
        <input
          type="text"
          placeholder="userName"
          value={userName}
          onChange={onChange}
          name="userName"
        />
        <input
          type="password"
          placeholder="password"
          value={password}
          onChange={onChange}
          name="password"
        />
        <input type="file" name="profilePhoto" onChange={onFileChange} />
        <button type="submit">Register</button>
      </form>
    </>
  );
};

export default Register;