import { useState, useEffect } from "react";
import { UserAuth } from "../context/AuthProvider.jsx";
import { toast } from "react-toastify";
import { useLocation, useNavigate } from "react-router-dom";
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
    <>
      <h1>Login</h1>

      <form onSubmit={onSubmit}>
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

        <button type="submit">Login</button>
      </form>
    </>
  );
};

export default Login;
