import React from "react";
import { useState } from "react";
import api from "../api/index";
// import { GoogleLogin } from "react-google-login";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { setToken } from "../variables/auth";
import { UpdateStore } from "../StoreContext";
const Login = () => {
  const nav = useNavigate();
  const [user, setUser] = useState({
    email: "",
    password: "",
  });
  const updateStore = UpdateStore();
  const handleSubmit = () => {
    api("post", "/auth/login", user)
      .then((res) => {
        alert("Successfully logged In");
        const token = res.data.token;
        const user = res.data.user;
        nav("../Home", { state: res.data.user });
        if (token && res.status === 200) {
          localStorage.setItem("user", JSON.stringify(user));
          setToken(token);
          updateStore({
            token: token,
            authorization: true,
            user: user,
          });
        }
      })
      .catch((err) => {
        console.log("SUBMIT err", err.response.data.message);
        alert(err.response.data.message);
      });
  };

  const responseGoogle = (response) => {
    console.log(response);
  };

  return (
    <>
      <div className="pt-[100px] pb-[40px] min-h-screen h-auto parent flex items-center px-6 justify-center">
        <div className="bg-white shadow rounded-md px-6 py-7 min-w-full md:min-w-[500px]">
          <div className="font-bold text-3xl text-center">Login</div>

          <div className="flex items-center justify-center mt-10 border-b-2 pb-5">
            {/* <GoogleLogin
              clientId="658977310896-knrl3gka66fldh83dao2rhgbblmd4un9.apps.googleusercontent.com"
              buttonText="Login with Google"
              onSuccess={responseGoogle}
              onFailure={responseGoogle}
              cookiePolicy={"single_host_origin"}
            /> */}
          </div>

          <input
            type="email"
            name="email"
            value={user.email}
            onChange={(e) => setUser({ ...user, email: e.target.value })}
            placeholder="Enter your email address"
            className="px-3 mt-5 py-4 rounded-md border border-gray-400 w-full outline-none"
          />
          <input
            type="password"
            name="password"
            value={user.password}
            onChange={(e) => setUser({ ...user, password: e.target.value })}
            placeholder="Enter your password"
            className="px-3 mb-2 mt-5 py-4 rounded-md border border-gray-400 w-full outline-none"
          />
          <Link
            to="/register"
            className="hover:text-[#643eee]  transition text-[#7854F7]"
          >
            Register
          </Link>

          <div className="flex items-center justify-center">
            <button
              className="font-bold text-white transition mt-10 hover:bg-[#643eee] bg-[#7854F7] px-12  text-center py-4 rounded-lg cursor-pointer mx-auto "
              onClick={handleSubmit}
            >
              Login
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;
