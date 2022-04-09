import { useEffect } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import Files from "../Pages/Files";
import Home from "../Pages/Home";
import Ibox from "../Pages/Ibox";
import Login from "../Pages/Login";
import Register from "../Pages/Register";
import { Store, UpdateStore } from "../StoreContext";

const Routing = () => {
  const updateStore = UpdateStore();
  const store = Store();
  let { user } = store;
  useEffect(() => {
    let user = localStorage.getItem("user");
    try {
      updateStore({ user: JSON.parse(user) });
    } catch (err) {
      updateStore({ user: {} });
    }
  }, []);
  return (
    <Routes>
      <Route path="/Home" exact element={<Home />} />
      {!Object.keys(user || {}).length > 0 && (
        <>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </>
      )}
      <Route path="/files" element={<Files />} />
      <Route path="/my-ibox" element={<Ibox />} />
      <Route path="*" element={<Navigate to="/Home" replace />} />
    </Routes>
  );
};

export default Routing;
