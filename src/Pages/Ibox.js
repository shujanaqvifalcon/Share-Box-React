import React, { useEffect, useState } from "react";
import Footer from "../Components/Footer";
import { useNavigate } from "react-router";
import api from "../api/index";
import { Store } from "../StoreContext";
const Ibox = (props) => {
  const [data, SetData] = useState();
  const nav = useNavigate();
  let { user } = Store();
  const handleDelete = (e) => {
    api("post", `files/deleteBox/`, {
      id: e,
    })
      .then((res) => {
        let val = res.data.FilesDb;
        let today = new Date();
        val = val.filter((i) => {
          return new Date(i.expiryDate) > new Date(today);
        });
        SetData(val);
        if (val.length < 1) {
          alert("I-box is empty");
          window.location.href = "./Home";
        } else {
          return alert("Successfully Deleted");
        }
      })
      .catch((err) => {
        console.log("SUBMIT err", err.response.data.message);
        alert(err.response.data.message);
      });
  };

  useEffect(() => {
    api("post", `files/ibox`, {
      userId: user?._id,
    })
      .then((res) => {
        let val = res?.data?.FilesDb;
        let today = new Date();
        val = val.filter((i) => {
          return new Date(i.expiryDate) > new Date(today);
        });
        SetData(val);
      })
      .catch((err) => {
        console.log("SUBMIT err", err.response.data.message);
        alert(err.response.data.message);
      });
  }, [user]);

  let viewBox = (e) => {
    nav("../files", { state: e });
  };

  return (
    <>
      <div className="w-full relative ibox-parent pt-[60px] min-h-screen">
        <div className="w-full mx-auto max-w-[1400px] px-6  relative  mt-20">
          <div className="font-bold text-2xl mb-2 opacity-90">Your iBox:</div>
          <div className="flex items-center  flex-wrap gap-5">
            {data?.map((i) => {
              return (
                <>
                  <div className="bg-gray-200 border flex items-center gap-4 px-2 py-2 rounded">
                    <div className="text-[20px] font-[400]">
                      {i.letter}
                      {i.number}
                    </div>
                    <div className="flex items-center gap-5">
                      <i
                        onClick={() => {
                          viewBox(`${i.letter}${i.number}`);
                        }}
                        class="fas fa-eye opacity-90 cursor-pointer text-2xl"
                      ></i>
                      <i
                        onClick={() => {
                          handleDelete(i._id);
                        }}
                        class="fas fa-trash opacity-90 cursor-pointer text-2xl"
                      ></i>
                    </div>
                  </div>
                </>
              );
            })}
          </div>
        </div>
      </div>
      <hr></hr>

      <Footer />
    </>
  );
};

export default Ibox;
