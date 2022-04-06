import React, { useState } from "react";
import Footer from "../Components/Footer";
import api from "../api/index";
import { useNavigate } from "react-router-dom";
import { Store, UpdateStore } from "../StoreContext";
const Home = () => {
  const nav = useNavigate();
  const store = Store();
  const updateStore = UpdateStore();

  let { user, files } = store;
  const [showModal, setshowModal] = useState("opacity-0 invisible");
  const [showDropDown, setshowDropDown] = useState("opacity-0 invisible");
  const [modalHeight, setmodalHeight] = useState("h-auto");
  const [fileExpiryTime, setfileExpiryTime] = useState("5 Min");
  const [search, SetSearch] = useState("");
  const [data, SetData] = useState({
    files: [],
  });
  const uploadHandler = (e) => {
    SetData({
      ...data,
      files: [...data.files, ...e.target.files],
    });
  };

  const handleSearch = (e) => {
    SetSearch(e.target.value);
  };
  const findIbox = () => {
    if (search == "") {
      return alert("please add ibox id");
    }
    nav("../files", { state: search });
  };
  const uploadFiles = () => {
    if (data.files.length < 1) {
      return alert("Please select atleast one file first");
    }
    const formdata = new FormData();
    for (let i = 0; i < data.files.length; i++) {
      formdata.append("files", data.files[i]);
    }
    if (fileExpiryTime == "24 Hr" || fileExpiryTime == "Never") {
      if (!user) {
        window.location = "/login";
      } else {
        if (fileExpiryTime == "24 Hr") {
          let expiryDate = new Date().getTime() + 86400000;
          expiryDate = new Date(expiryDate);
          formdata.append("expiryDate", expiryDate);
        } else {
          let expiryDate = new Date().getTime() + 31536000000;
          expiryDate = new Date(expiryDate);
          formdata.append("expiryDate", expiryDate);
        }
      }
    }
    if (Object.keys(user || {}).length > 0) {
      formdata.append("user", user?._id);
    }
    if (fileExpiryTime == "5 Min") {
      let expiryDate = new Date().getTime() + 300000;
      expiryDate = new Date(expiryDate);
      formdata.append("expiryDate", expiryDate);
    }
    if (fileExpiryTime == "20 Min") {
      let expiryDate = new Date().getTime() + 1200000;
      expiryDate = new Date(expiryDate);
      formdata.append("expiryDate", expiryDate);
    }
    if (fileExpiryTime == "1 Hr") {
      let expiryDate = new Date().getTime() + 3600000;
      expiryDate = new Date(expiryDate);
      formdata.append("expiryDate", expiryDate);
    }
    if (fileExpiryTime == "5 Hr") {
      let expiryDate = new Date().getTime() + 18000000;
      expiryDate = new Date(expiryDate);
      formdata.append("expiryDate", expiryDate);
    }
    if (fileExpiryTime == "10 Hr") {
      let expiryDate = new Date().getTime() + 36000000;
      expiryDate = new Date(expiryDate);
      formdata.append("expiryDate", expiryDate);
    }
    api("post", "files", formdata)
      .then((res) => {
        updateStore({ files: files.concat(res.data.FilesDb) });
        let id = res?.data?.FilesDb?.letter + res?.data?.FilesDb?.number;
        nav("../files", { state: id });
      })
      .catch((err) => {
        console.log("SUBMIT err", err.response.data.message);
        alert(err.response.data.message);
      });
  };

  const handleBox = () => {
    if (!user) {
      alert("You need to login first ");
      nav("../login");
    } else {
      api("post", "files/ibox", {
        userId: user?._id,
      })
        .then((res) => {
          if (res.data.FilesDb.length > 0) {
            let val = res.data.FilesDb;
            let today = new Date();
            let newval = val.filter((i) => {
              return new Date(i.expiryDate) > new Date(today);
            });
            if (newval.length > 0) {
              nav("../my-ibox");
            } else {
              alert("your i-box is empty");
            }
          } else {
            alert("your i-box is empty");
          }
        })
        .catch((err) => {
          console.log("SUBMIT err", err.response.data);
          alert(err.response.data.message);
        });
    }
  };

  return (
    <>
      <div className="parent w-full relative pb-20 pt-[60px]">
        <img
          src="/images/w.svg"
          className="absolute w-[800px] -top-20 right-0"
        />

        <div className="w-full mx-auto max-w-[1200px] px-6 z-20 relative  mt-[90px]">
          <div className="text-5xl text-center font-[900]">
            Share Your Files in <span className="text-[#BF2B2B]">1 Click</span>
          </div>

          <div className="grid grid-cols-2 home-page-grid mt-[140px] h-[300px]">
            <div className="w-full home-page-first-section flex relative justify-start items-center flex-col border-r-2 border-gray-900">
              <div className="font-[600] text-xl text-center first-sec-title mb-24">
                Click Upload to Share your files
              </div>

              <button
                onClick={() => setshowModal("opacity-100 visible")}
                className="px-12 mx-auto text-center py-4 rounded-full cursor-pointer text-white transition hover:bg-[#643eee] bg-[#7854F7]"
              >
                Upload Files
              </button>

              <div
                className="absolute bottom-0 flex items-center cursor-pointer right-5 go-to-your-files"
                onClick={handleBox}
              >
                or Go to your Box <i class="far fa-angle-right"></i>
              </div>
            </div>

            <div className="w-full flex justify-start home-page-second-section items-center flex-col">
              <div className="font-[600] text-xl text-center mb-24 second-sec-title">
                Check your Friends Ibox
              </div>

              <div className="flex justify-end items-end second-sec-flex flex-col mx-auto">
                <input
                  type="text"
                  placeholder="Enter an ibox ID"
                  name="search"
                  value={search}
                  onChange={handleSearch}
                  className="border-[1.6px] border-[#7854F7] outline-none w-full sm:w-[300px] bg-white px-2 py-5 rounded-[14px] mb-7"
                />
                <button
                  className="px-12  text-center py-4 rounded-full cursor-pointer text-white transition hover:bg-[#643eee] bg-[#7854F7]"
                  onClick={findIbox}
                >
                  Go
                </button>
              </div>
            </div>
          </div>

          <div className="text-center mx-auto text-4xl mt-40 mb-10 text-sharing-files">
            Sharing Files <br />
            made simple
          </div>
        </div>
      </div>

      <Footer />

      <div
        className={`fixed left-0 top-0   mainFixedOverlay w-screen h-screen flex items-center justify-center ${showModal}`}
      >
        <div
          className="blackOverlay absolute left-0 top-0 w-full h-full"
          onClick={() => {
            setshowModal("opacity-0 invisible");
            setmodalHeight("h-auto");
          }}
        ></div>
        <div
          className={`rounded-lg bg-white whiteBox py-5 pb-10 px-7  relative z-50 ${modalHeight}`}
        >
          <div className="flex items-center justify-end">
            <i
              class="fal fa-times cursor-pointer text-black opacity-70 text-2xl"
              onClick={() => {
                setshowModal("opacity-0 invisible");

                setmodalHeight("h-auto");
              }}
            ></i>
          </div>

          <div className="mt-5">
            {/* DropDown */}

            <div className="mb-7">
              <div className="text-lg opacity-90">Files Auto deletes in</div>
              <div
                onClick={() => {
                  if (modalHeight === "h-auto") {
                    setmodalHeight("h-[520px]");
                    setshowDropDown("opacity-100 visible");
                  } else {
                    setmodalHeight("h-auto");
                    setshowDropDown("opacity-0 invisible");
                  }
                }}
                className="w-full border cursor-pointer rounded mt-1 border-gray-400 relative flex items-center justify-between px-2 py-3"
              >
                {fileExpiryTime}{" "}
                <i class="far fa-angle-down text-xl transition"></i>
                <div
                  className={`absolute transition rounded top-full transform z-10 translate-y-[0.3px] bg-white left-0 w-full border border-gray-400 ${showDropDown}`}
                >
                  <div
                    onClick={() => setfileExpiryTime("5 Min")}
                    className="w-full cursor-pointer px-2 py-3"
                  >
                    5 Min
                  </div>

                  <div
                    onClick={() => setfileExpiryTime("20 Min")}
                    className="w-full cursor-pointer px-2 py-3"
                  >
                    20 Min
                  </div>

                  <div
                    onClick={() => setfileExpiryTime("1 Hr")}
                    className="w-full cursor-pointer px-2 py-3"
                  >
                    1 Hr
                  </div>

                  <div
                    onClick={() => setfileExpiryTime("5 Hr")}
                    className="w-full cursor-pointer px-2 py-3"
                  >
                    5 Hr
                  </div>

                  <div
                    onClick={() => setfileExpiryTime("10 Hr")}
                    className="w-full cursor-pointer px-2 py-3"
                  >
                    10 Hr
                  </div>

                  <div
                    onClick={() => setfileExpiryTime("24 Hr")}
                    className="w-full cursor-pointer px-2 py-3"
                  >
                    24 Hr
                  </div>

                  <div
                    onClick={() => setfileExpiryTime("Never")}
                    className="w-full cursor-pointer px-2 py-3"
                  >
                    Never
                  </div>
                </div>
              </div>
            </div>

            <div className="w-full overflow-hidden relative max-h-[252px] h-full">
              <div className="bg-white w-[118px] h-[32px] absolute top-0 left-0"></div>
              <input
                type="file"
                onChange={uploadHandler}
                name="file_upload"
                className="transform -translate-x-[120px]"
                multiple
                id="file-upload"
              />
            </div>

            {/* This is the files upload input tag and label */}

            <div className="flex items-center justify-center w-full  absolute bottom-24 left-0">
              <label
                htmlFor="file-upload"
                className="px-12 mx-auto text-center  py-4 rounded-full cursor-pointer text-white transition hover:bg-[#643eee] bg-[#7854F7]"
              >
                Select Files
              </label>
            </div>
            <div className="flex items-center justify-center px-7 absolute bottom-5 left-0 w-full">
              <button
                className="px-12 w-full  text-center py-4 rounded-md cursor-pointer text-white transition hover:bg-[#643eee] bg-[#93bf9f]"
                onClick={uploadFiles}
              >
                Upload files
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;
