import axios from "axios";
export const getToken = () => {
  return localStorage.getItem("Authorization");
};

export const getUser = () => {
  return localStorage.getItem("user");
};

export const setToken = (token) => {
  localStorage.setItem("Authorization", token);
};

export const removeToken = () => {
  localStorage.removeItem("Authorization");
};

export const SetAuthToken = (token) => {
  if (token) {
    axios.defaults.headers.common["Authorization"] = "Bearer " + token;
  } else {
    delete axios.defaults.headers.common["x-auth-token"];
  }
};
