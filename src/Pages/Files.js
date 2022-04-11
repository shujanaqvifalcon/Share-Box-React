import React, { useEffect, useState } from "react";
import Footer from "../Components/Footer";
import { useLocation, useNavigate } from "react-router";
import { Link } from "react-router-dom";
import { Store, UpdateStore, boxIDValue, setboxIDValue } from "../StoreContext";
import axios from "axios";
import { CopyToClipboard } from "react-copy-to-clipboard";
import api from "../api";
import { useForm, ValidationError } from "@formspree/react";

const Files = (props) => {
  const nav = useNavigate();
  const store = Store();
  const updateStore = UpdateStore();
  let { user, files } = store;
  const [state, handleSubmit] = useForm("meqnlnaw");
  const [contactEmail, setcontactEmail] = useState("");
  const [contactMessage, setcontactMessage] = useState("");
  const [ibox, setIbox] = useState();
  let location = useLocation();
  let data = location.state;
  const [progressBar, setprogressBar] = useState('hidden');
  const [formModal, setformModal] = useState("opacity-0 invisible");
  const [modal, setmodal] = useState("opacity-0 invisible");
  const [documents, SetDocuments] = useState([]);
  const [pics, setPics] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);
  const [numberalbum, setNumberAlbum] = useState("");
  const [letteralbum, SetLetterAlbum] = useState("");
  const [album, setAlbum] = useState("");
  const [selectbtn, setSelectBtn] = useState(false);
  const [copy, setCopy] = useState({
    value: data?._id,
    copied: false,
  });
  const [updateAlbum, SetUpdateAlbum] = useState({
    files: [],
  });

  useEffect(() => {
    api("get", `files/${data}`)
      .then((res) => {
        setIbox(res?.data?.file);
        let today = new Date();
        if (new Date(res?.data?.file?.expiryDate) > new Date(today)) {
          res?.data?.file.files.map((e) => {
            let x = e.file;
            let val = x.split(".").pop();
            let ex = val;
            if (
              ex == "png" ||
              ex == "jpeg" ||
              ex == "jpg" ||
              ex == "tiff" ||
              ex == "PNG" ||
              ex == "svg" ||
              ex == "webp"
            ) {
              setPics((prev) => [...prev, e.file]);
            } else {
              SetDocuments((prev) => [...prev, e.file]);
            }
          });
          setAlbum(res?.data?.file?.letter + res?.data?.file?.number);
          setNumberAlbum(res?.data?.file?.number);
          SetLetterAlbum(res?.data?.file?.letter);
          setIbox(res?.data?.file);
        } else {
          alert(" Box is expired");
          nav("../Home");
        }
      })
      .catch((err) => {
        console.log("SUBMIT err", err.response.data.message);
        alert("Invalid box id or Box is expired");
      });
  }, []);

  const CheckAll = (e) => {
    let x = e.substring(22);
    x = x.split(".").shift();
    let y = e.split(".").pop();
    let image = `https://shareibox.com/${e}`;

    axios({
      url: image, //your url
      method: "GET",
      responseType: "blob", // important
    }).then((response) => {
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `${x}.${y}`); //or any other extension
      document.body.appendChild(link);
      link.click();
    });
    setSelectBtn(false);
    setSelectedItems([]);
  };
  const uploadHandler = (e) => {
    SetUpdateAlbum({
      ...updateAlbum,
      files: [...updateAlbum.files, ...e.target.files],
    });
    setprogressBar('hidden')

  };
  const selectAll = () => {
    if (selectbtn === true) {
      setSelectBtn(false);
      setSelectedItems([]);
    } else {
      setSelectBtn(true);
      setSelectedItems([]);
      ibox?.files.map((e) => {
        setSelectedItems((prev) => [...prev, e.file]);
      });
    }
  };

  const downlodFiles = () => {
    if (selectedItems.length > 0) {
      selectedItems.map((e) => {
        let x = e.substring(22);
        x = x.split(".").shift();
        let y = e.split(".").pop();
        let image = `https://shareibox.com/${e}`;

        axios({
          url: image, //your url
          method: "GET",
          responseType: "blob", // important
        }).then((response) => {
          const url = window.URL.createObjectURL(new Blob([response.data]));
          const link = document.createElement("a");
          link.href = url;
          link.setAttribute("download", `${x}.${y}`); //or any other extension
          document.body.appendChild(link);
          link.click();
          setSelectBtn(false);
          setSelectedItems([]);
        });
      });
    } else {
      alert("you need to select atleast one file ");
    }
  };

  const selectItem = (file) => {
    const selected = selectedItems.filter((a) => a === file);
    if (selected.length > 0) {
      setSelectedItems((prev) => prev.filter((a) => a !== file));
    } else {
      setSelectedItems((prev) => [...prev, file]);
    }
  };

  let deleteAll = () => {
    if (selectedItems.length > 0) {
      api("put", "files/deleteMany", { files: selectedItems, id: ibox?._id })
        .then((res) => {
          setSelectedItems([]);
          if (res?.data?.FilesDb?.files.length < 1) {
            setIbox(res?.data?.FilesDb);
            alert("your i-box is empty");
            nav("../Home");
          }
          res?.data?.FilesDb?.files.map((e) => {
            let x = e.file;
            let val = x.split(".").pop();
            let ex = val;
            if (
              ex == "png" ||
              ex == "jpeg" ||
              ex == "jpg" ||
              ex == "tiff" ||
              ex == "PNG" ||
              ex == "svg" ||
              ex == "webp"
            ) {
              setPics((prev) => [...prev, e.file]);
            } else {
              SetDocuments((prev) => [...prev, e.file]);
            }
          });
          setSelectBtn(false);
          setSelectedItems([]);
          window.location.reload(false);
        })
        .catch((err) => {
          console.log("SUBMIT err", err.response.data.message);
          alert("error");
        });
    } else {
      alert("you need to select atleast one file ");
    }
  };

  let uploadData = () => {
    if (updateAlbum?.files?.length < 1) {
      return alert("Please select atleast one file first");
    }
    setprogressBar('block')

    const formdata = new FormData();
    formdata.append("letteralbum", letteralbum);
    formdata.append("numberalbum", numberalbum);
    for (let i = 0; i < updateAlbum.files.length; i++) {
      formdata.append("files", updateAlbum.files[i]);
    }
    api("post", "files/updateBox", formdata)
      .then((res) => {
        setformModal("opacity-0 invisible");
        let today = new Date();
        if (new Date(res?.data?.file?.expiryDate) > new Date(today)) {
          res?.data?.file?.files.map((e) => {
            let x = e.file;
            let val = x.split(".").pop();
            let ex = val;
            if (
              ex == "png" ||
              ex == "jpeg" ||
              ex == "jpg" ||
              ex == "tiff" ||
              ex == "PNG" ||
              ex == "svg" ||
              ex == "webp"
            ) {
              setPics((prev) => [...prev, e.file]);
            } else {
              SetDocuments((prev) => [...prev, e.file]);
            }
          });
          setIbox(res?.data?.file);
        }
        window.location.reload(false);
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
              nav("../Home");
            }
          } else {
            nav("../Home");
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
      <div
        onClick={() => {
          setmodal("opacity-100 visible");
        }}
        className="w-fit border-2 border-[#7854F7] fixed cursor-pointer hidden sm:flex top-1/2 bg-white z-10 -right-[110px] px-5 py-4 text-lg font-[600] rounded transform -rotate-90"
      >
        Improve Us, Give Feedback
      </div>

      <div className="w-full relative  pt-[60px]">
        <div className="w-full mx-auto max-w-[1400px] pl-6 pr-6 sm:pr-20  relative  mt-[50px]">
          <div className="flex items-center first-top-flex justify-between">
            <div className="font-[600] opacity-90 text-2xl flex items-center gap-3">
             
                <button 
                onClick={handleBox}
                className="px-4 py-3 rounded-md text-white font-[500] text-base bg-[#7854F7]">Go to your iBox</button>
              
            </div>
            <div className="flex items-center justify-center first-inner-flex gap-7">
              <div>
                <CopyToClipboard
                  text={album}
                  onCopy={() => setCopy({ copied: true })}
                >
                  <button>
                    <img src="/images/copy-icon.svg" alt="copy-icon" />
                  </button>
                </CopyToClipboard>
              </div>

              <div className="flex items-center justify-center flex-col gap-3">
                <div className="font-[600] text-[18px] opacity-90">iBox ID</div>

                <div className="text-[22px] font-[400]  border-[1.6px] border-[#7854F7] outline-none w-[200px] flex items-center justify-center bg-white px-2 h-[60px] rounded-[14px]">
                  {letteralbum}{" "}
                  <span className="text-red-500">{numberalbum}</span>
                </div>

                <div className="font-[600] text-[18px] opacity-90">
                  Share Box ID
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between second-files-flex border-b-2 border-gray-300 mt-7 pb-3">
            <div className="flex items-center gap-7">
              <div className="flex items-center gap-3 select-all-parent select-1-parent">
                <input
                  type="checkbox"
                  className="select-1 cursor-pointer"
                  onClick={selectAll}
                  checked={selectbtn == false ? false : true}
                />
                <button onClick={selectAll}>
                  {selectbtn == false ? <>Select All</> : <>De-Select</>}
                </button>
              </div>

              <div className="flex items-center gap-5">
                <button onClick={downlodFiles}>
                  <img
                    src="/images/download-icon.svg"
                    alt="download"
                    className="w-[25px]"
                  />
                </button>
              </div>
              <i
                onClick={deleteAll}
                className="fas cursor-pointer fa-trash text-2xl"
              ></i>

              <div className="flex items-center gap-7">
                <div
                  onClick={() => setformModal("opacity-100 visible")}
                  className="opacity-80 cursor-pointer transition hover:opacity-90"
                >
                  <i className="far fa-plus-circle text-2xl"></i>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3 cursor-pointer border-b-2 border-[#3E89E2] pb-1 px-4">
              <img
                src="/images/gallery-icon.svg"
                className="w-[19px]"
                alt="gallery"
              />
              <div className="text-[#3E89E2] text-[15px] gallery-text">
                GALLERY
              </div>
            </div>
          </div>
          {ibox && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mt-5">
              {documents?.map((e) => {
                return (
                  <>
                    <div className="bg-gray-100 relative gap-3 rounded px-3 py-3 flex flex-col sm:flex-row items-center justify-between border cursor-pointer transition hover:bg-gray-200">
                      <div className="opacity-90">File Name :</div>
                      <div className="font-bold opacity-80">
                        {e.substring(22)}
                      </div>
                      {(() => {
                        if (e.split(".").pop() === "docx") {
                          return (
                            <img
                              src="/images/docx-icon.jpg"
                              className="absolute -top-[10px] left-1/2 w-[25px]"
                            />
                          );
                        }
                        if (e.split(".").pop() === "pdf") {
                          return (
                            <img
                              src="/images/pdf-icon.png"
                              className="absolute -top-[15px] left-1/2 w-[25px]"
                            />
                          );
                        }
                        if (e.split(".").pop() === "xls") {
                          return (
                            <img
                              src="/images/xls-icon.png"
                              className="absolute -top-[10px] left-1/2 w-[25px]"
                            />
                          );
                        }
                        if (e.split(".").pop() === "xlsx") {
                          return (
                            <img
                              src="/images/xls-icon.png"
                              className="absolute -top-[10px] left-1/2 w-[25px]"
                            />
                          );
                        } else {
                          return (
                            <img
                              src="/images/file.jpg"
                              className="absolute -top-[10px] left-1/2 w-[25px]"
                            />
                          );
                        }
                      })()}
                      <div className="flex items-center gap-4 select-1-parent">
                        <>
                          <i
                            onClick={deleteAll}
                            className="fas cursor-pointer fa-trash text-xl"
                          ></i>
                          <input
                            type="checkbox"
                            className="select-1 cursor-pointer"
                            value={e}
                            checked={
                              selectedItems.filter((a) => a === e).length > 0
                            }
                            onClick={() => {
                              selectItem(e);
                            }}
                          />

                          <button
                            onClick={() => {
                              CheckAll(e);
                            }}
                          >
                            <img
                              src="/images/download-icon.svg"
                              className="min-w-[20px]"
                              alt="download"
                            />
                          </button>
                        </>
                      </div>
                    </div>
                  </>
                );
              })}
            </div>
          )}

          {/* FILES */}
          {ibox && (
            <div className="flex flex-wrap items-end gap-10 mt-10">
              {pics?.map((e) => {
                return (
                  <div className="flex items-center gap-6 flex-col ">
                    <>
                      <div className="w-[300px] h-[300px]">
                        <img
                          src={`https://shareibox.com/${e}`}
                          className="w-full h-full object-cover object-top "
                        />
                      </div>
                    </>
                    {/* IMAGE NAME */}
                    <div className="font-bold opacity-80">
                      {e.substring(22)}
                    </div>
                    <>
                      <div className="flex items-center gap-8 select-1-parent">
                        <i
                          onClick={deleteAll}
                          className="fas cursor-pointer fa-trash text-2xl"
                        ></i>
                        <input
                          className="custom-control-input select-1 cursor-pointer"
                          type="checkbox"
                          value={e}
                          checked={
                            selectedItems.filter((a) => a === e).length > 0
                          }
                          onClick={() => {
                            selectItem(e);
                          }}
                        />

                        <button
                          onClick={() => {
                            CheckAll(e);
                          }}
                        >
                          <img src="/images/download-icon.svg" alt="download" />
                        </button>
                      </div>
                    </>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      <Footer />

      {/* upload */}

      <div
        className={`fixed left-0 top-0   mainFixedOverlay w-screen h-screen flex items-center justify-center ${formModal}`}
      >
        <div
          className="blackOverlay absolute left-0 top-0 w-full h-full"
          onClick={() => {
            setformModal("opacity-0 invisible");
          }}
        ></div>
        <div
          className={`rounded-lg bg-white whiteBox py-5  px-7  relative z-50 `}
        >
          <div className="flex items-center justify-end">
            <i
              class="fal fa-times cursor-pointer text-black opacity-70 text-2xl"
              onClick={() => {
                setformModal("opacity-0 invisible");
              }}
            ></i>
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

          <div className={`w-full flex items-center mx-auto transform translate-y-10 justify-center flex-col ${progressBar} }`}>
<img src="/images/loading.svg" alt="progress bar" className={ `w-[160px] `} />
  <div className="opacity-80 transform -translate-y-8">Uploading</div>
</div>


          <div className="flex items-center justify-center px-7 absolute bottom-5 left-0 w-full">
            <button
              className="px-12 w-full  text-center py-4 rounded-md cursor-pointer text-white transition hover:bg-[#643eee] bg-[#93bf9f]"
              onClick={uploadData}
            >
              Upload files
            </button>
          </div>
        </div>
      </div>

      {/* Form */}

      <div
        className={`fixed left-0 top-0   mainFixedOverlay w-screen h-screen flex items-center justify-center ${modal}`}
      >
        <div
          className="blackOverlay absolute left-0 top-0 w-full h-full"
          onClick={() => {
            setmodal("opacity-0 invisible");
          }}
        ></div>
        <div
          className={`rounded-lg bg-white whiteBox py-5  px-7  relative z-50 `}
        >
          <div className="flex items-center justify-end">
            <i
              class="fal fa-times cursor-pointer text-black opacity-70 text-2xl"
              onClick={() => {
                setmodal("opacity-0 invisible");
              }}
            ></i>
          </div>

          <div className="font-bold text-3xl opacity-80 mb-5">
            Help us Improve
          </div>

          <form onSubmit={handleSubmit}>
            <input
              id="email"
              type="email"
              name="email"
              value={contactEmail}
              onChange={(e) => setcontactEmail(e.target.value)}
              className="border border-gray-300 rounded px-3 py-3 outline-none w-full"
              placeholder="Enter your email address"
            />
            <ValidationError
              prefix="Email"
              field="email"
              errors={state.errors}
            />
            <textarea
              id="message"
              name="message"
              value={contactMessage}
              onChange={(e) => setcontactMessage(e.target.value)}
              placeholder="Enter your message..."
              className="border border-gray-300 rounded px-3 py-3 outline-none w-full resize-none h-[260px] mt-5"
            />
            <ValidationError
              prefix="Message"
              field="message"
              errors={state.errors}
            />
            <div className="flex items-center justify-center mt-5">
              <button
                onClick={() => {
                  setTimeout(() => {
                    alert("Submitted successfully");
                    setcontactMessage("");
                    setcontactEmail("");
                  }, 200);
                }}
                type="submit"
                className="px-12  text-center py-4 rounded-full cursor-pointer text-white transition hover:bg-[#643eee] bg-[#7854F7] "
                disabled={state.submitting}
              >
                Submit
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default Files;
