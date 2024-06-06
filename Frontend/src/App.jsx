import { Outlet } from "react-router-dom";
import "./App.css";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
function App() {
  return (
    <>
      <Outlet />
      <ToastContainer
        theme="dark"
        autoClose={2500}
        newestOnTop
        closeOnClick
        transition:Bounce
      />
    </>
  );
}

export default App;
