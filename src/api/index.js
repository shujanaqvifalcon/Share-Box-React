import axios from "axios";
import { toast } from "react-toastify";
import { removeToken } from "../variables/auth";

const api = async (method = "get", uri, body) => {
  // Default setting for production
   axios.defaults.baseURL = "http://localhost:8080/";
  // axios.defaults.baseURL = "https://shareibox.com/";
  // API Call
  const url = "api/" + uri;
  return new Promise((resolve, reject) => {
    axios[method](url, body)
      .then((res) => {
        resolve(res);
      })
      .catch((err) => {
        if (err?.response?.status === 401) {
          removeToken();
          toast.warning("Token is expired Please Login Again");
          window.location = "/login";
        } else {
          reject(err);
        }
      });
  });
};

// Export
export default api;
