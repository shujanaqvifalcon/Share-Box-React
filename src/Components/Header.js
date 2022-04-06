import React from "react";
import { Link } from "react-router-dom";
import api from "../api/index";
import { Store } from "../StoreContext";

const Header = () => {
  const { user } = Store();
  const isUser = Object.keys(user || {}).length > 0;
  // console.log("header", user);
  const handleLogout = async () => {
    console.log(user);
    api("post", "users/logout", {
      user: user,
    })
      .then((res) => {
        localStorage.removeItem("user");
        window.location = "/Home";
      })
      .catch((err) => {
        alert("err", err?.data.message);
      });
  };

  return (
    <>
      <div className="w-full bg-transparent z-50 absolute top-0 left-0">
        <div className="max-w-[1400px] mx-auto flex items-center justify-between px-6 h-[90px] bg-transparent">
          <Link to="/">
            <img
              src="/images/logo.svg"
              alt="logo"
              className="w-[100px] sm:w-auto"
            />
          </Link>
          <nav className="flex items-center gap-4 sm:gap-7">
            <div className="Button-Class">
              {isUser ? (
                <button onClick={handleLogout}>Logout</button>
              ) : (
                <>
                  <Link to="/login">Login</Link>
                </>
              )}
            </div>
            {!isUser && (
              <>
                <div className="startedButton">
                  <Link to="/register">Get Started</Link>
                </div>
              </>
            )}
          </nav>
        </div>
      </div>
    </>
  );
};

export default Header;
