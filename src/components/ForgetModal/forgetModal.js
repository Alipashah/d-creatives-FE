import Modal from "react-modal";
import React, { useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import Swal from "sweetalert2";
import { forgetPassword } from "../../store/forgetSlice";
Modal.setAppElement("#root");

function ForgetModal(props) {
  const dispatch = useDispatch();
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");

  const [openModal, setOpenModal] = useState(false);
  const modalRef = useRef(null);
  let regex = /^[^@]*@[^@]*$/;
  // Function to close the drawer when clicking outside of it
  const handleClickOutside = (event) => {
    if (modalRef.current && !modalRef.current.contains(event.target)) {
      setOpenModal(false);
      setEmail("");
      setEmailError("");
    }
  };

  useEffect(() => {
    // Add event listener to handle clicks outside the drawer
    document.addEventListener("mousedown", handleClickOutside);

    // Clean up the event listener when the component unmounts
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  function handleAddEditor() {
    if (!email) {
      setEmailError("Email is missing");
      return;
    }

    if (!regex.test(email)) {
      setEmailError("Email is not valid");
      return;
    }
    if (emailError || !email || !regex.test(email)) {
      return;
    } else {
      setOpenModal(false);
      dispatch(forgetPassword({ data: { email: email } }))
        .unwrap()
        .then((res) => {
          if (res.status) {
            Swal.fire(
              "Successfull",
              "Forgot Password Link send to " + email,
              "success"
            );
            setEmail("");
          } else {
            Swal.fire({
              icon: "error",
              title: "Oops...",
              text: res.message,
            });
            setEmail("");
          }
        })
        .catch((err) => {
          Swal.fire({
            icon: "error",
            title: "Oops...",
            text: err,
          });
        });
    }
  }

  return (
    <>
      <div
        onClick={() => {
          setOpenModal(true);
        }}
      >
        Forgot Password
      </div>
      <Modal
        isOpen={openModal}
        onRequestClose={() => {
          setOpenModal(false);
        }}
        className="fixed flex items-center justify-center top-0 left-0 right-0 z-50 w-full overflow-x-hidden overflow-y-auto md:inset-0 h-[calc(100%-1rem)] max-h-full"
      >
        <div className="relative lg:w-1/3 sm:w-1/2 w-fit">
          <div
            ref={modalRef}
            className="relative bg-white rounded-lg shadow-lg border"
          >
            <div
              className="flex justify-end"
              onClick={() => {
                setOpenModal(false);
                setEmail("");
                setEmailError("");
              }}
            >
              <button
                type="button"
                className=" text-gray-400 bg-transparent  rounded-lg text-sm p-1.5 ml-auto inline-flex items-center dark:hover:bg-gray-800 dark:hover:text-white"
                data-modal-hide="authentication-modal"
              >
                <svg
                  aria-hidden="true"
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fill-rule="evenodd"
                    d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                    clip-rule="evenodd"
                  ></path>
                </svg>
                <span className="sr-only">Close modal</span>
              </button>
            </div>

            <div className="m-5 flex flex-col justify-center items-center">
              <div
                className="sidebar-heading mb-5"
                style={{ fontSize: "24px" }}
              >
                FORGOT PASSWORD
              </div>
              <div className="flex flex-col mb-3">
                <label className="mb-2 text-sm">Email*</label>
                <input
                  type="email"
                  value={email}
                  placeholder="Enter Email"
                  onChange={(e) => {
                    setEmailError("");
                    setEmail(e.target.value);
                  }}
                  className={`ps-2 p-1 login-input border ${
                    emailError ? "border-red-500" : "border-gray-300"
                  }`}
                />
                {emailError && (
                  <p className="login-text2 text-red-500">{emailError}</p>
                )}
              </div>
              <div className="mt-3 mb-5">
                <button
                  className="project-btn-02 ps-3 pe-3 me-2"
                  onClick={handleAddEditor}
                >
                  Send
                </button>
                <button
                  className="project-btn-02 ps-3 pe-3"
                  onClick={() => {
                    setOpenModal(false);
                    setEmail("");
                    setEmailError("");
                  }}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      </Modal>
    </>
  );
}

export default ForgetModal;
