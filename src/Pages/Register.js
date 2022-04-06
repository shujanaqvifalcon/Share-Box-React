import React from "react";
import { useState } from "react";
// import { GoogleLogin } from "react-google-login";
import { Link } from "react-router-dom";
import api from "../api/index";

const Register = () => {
  const [user, setUser] = useState({
    email: "",
    password: "",
    confirmpassword: "",
  });
  const responseGoogle = (response) => {
    console.log(response);
  };
  const handleSubmit = () => {
    if (!user.email || !user.password || !user.confirmpassword) {
      alert("Please fill all the fields");
    } else if (user.password.length < 8 || user.confirmpassword.length < 8) {
      alert("Password's min length should be greater than 8");
    } else if (user.password !== user.confirmpassword) {
      alert("Password and Confirm Password are not same");
    } else {
      api("post", "users", user)
        .then((res) => {
          setUser({
            email: "",
            password: "",
            confirmPassword: "",
          });
          alert("Account created successfully");
          window.location = "/login";
        })
        .catch((err) => {
          console.log("SUBMIT err", err.response.data);
          alert(err.response.data.message);
        });
    }
  };

  return (
    <>
      <div className="pt-[150px] pb-[80px] min-h-screen h-auto parent flex items-center px-6 justify-center">
        <div className="bg-white shadow rounded-md px-6 py-7 min-w-full md:min-w-[500px] md:max-w-[500px]">
          <div className="font-bold text-3xl text-center">Register</div>

          {/* <div className="flex items-center justify-center mt-10 border-b-2 pb-5">
            <GoogleLogin
              clientId="658977310896-knrl3gka66fldh83dao2rhgbblmd4un9.apps.googleusercontent.com"
              buttonText="Login with Google"
              onSuccess={responseGoogle}
              onFailure={responseGoogle}
              cookiePolicy={"single_host_origin"}
            />
          </div> */}

          <input
            type="email"
            placeholder="Enter your email address"
            name="email"
            value={user.email}
            onChange={(e) => setUser({ ...user, email: e.target.value })}
            className="px-3 mt-5 py-4 rounded-md border border-gray-400 w-full outline-none"
          />
          <input
            type="password"
            placeholder="Enter your password"
            name="password"
            value={user.password}
            onChange={(e) => setUser({ ...user, password: e.target.value })}
            className="px-3 mb-2 mt-5 py-4 rounded-md border border-gray-400 w-full outline-none"
          />
          <input
            type="password"
            placeholder="confirm password"
            name="confirmpassword"
            value={user.confirmpassword}
            onChange={(e) =>
              setUser({ ...user, confirmpassword: e.target.value })
            }
            className="px-3 mt-5 py-4 rounded-md border border-gray-400 w-full outline-none"
          />
          <Link
            to="/login"
            className="hover:text-[#643eee]  transition text-[#7854F7]"
          >
            Login
          </Link>

          <div className="flex items-center justify-center">
            <button
              className="font-bold text-white transition mt-10 hover:bg-[#643eee] bg-[#7854F7] px-12  text-center py-4 rounded-lg cursor-pointer mx-auto "
              onClick={handleSubmit}
            >
              Register
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Register;
