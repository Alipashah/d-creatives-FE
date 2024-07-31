import Modal from "react-modal";
import React, { useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import Swal from "sweetalert2";
import { addEditor } from "../../../store/addEditorSlice";
import AddCompany from "../../AddCompany/addCompany";
import { Listbox, Transition } from "@headlessui/react";
import deleteIcon from "../../../assets/images/delete-icon.png";
import { deleteCompany } from "../../../store/deleteCompanySlice";
import { socket } from "../../../App";

Modal.setAppElement("#root");

function AddUser(props) {
  const dispatch = useDispatch();
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");
  // const localCompanyJSON = localStorage.getItem("companyList");
  // const localCompanyList = localCompanyJSON
  //   ? JSON.parse(localCompanyJSON)
  //   : null;
  // const [companyList, setCompanyList] = useState(localCompanyList || []);
  const [company, setCompany] = useState("Select Company");
  const [companyName, setCompanyName] = useState("Select Company");
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [companyError, setCompanyError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [nameError, setNameError] = useState("");
  const [openModal, setOpenModal] = useState(false);
  const [addNew, setAddNew] = useState(null);
  const modalRef = useRef(null);
  let regex = /^[^@]*@[^@]*$/;
  // Function to close the drawer when clicking outside of it
  const handleClickOutside = (event) => {
    if (modalRef.current && !modalRef.current.contains(event.target)) {
      setOpenModal(false);
      setEmail("");
      setEmailError("");
      setName("");
      setNameError("");
      setCompanyError("");
      setCompany("Select Company");
      setAddNew(null);
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
    if ((!company || company === "Select Company") && props.client) {
      setCompanyError("Company is missing");
    }
    if (!email) {
      setEmailError("Email is missing");
    }
    if (!name) {
      setNameError("Name is missing");
    }
    if (!regex.test(email)) {
      setEmailError("Email is not valid");
    }
    if (
      emailError ||
      nameError ||
      !email ||
      !name ||
      !regex.test(email) ||
      ((!company || company === "Select Company") && props.client) ||
      (companyError && props.client)
    ) {
      return;
    } else {
      props.setIsLoading(false);
      dispatch(
        addEditor({
          token: token,
          client: props.client,
          data: { email: email, name: name, companyId: company },
        })
      )
        .unwrap()
        .then((res) => {
          if (res.status) {
            Swal.fire(
              "Successfull",
              "User added and Signup Link send to " + email,
              "success"
            );
            props.setIsLoading(true);
          } else {
            Swal.fire({
              icon: "error",
              title: "Oops...",
              text: res.message,
            });

            props.setIsLoading(true);
          }
          setEmail("");
          setName("");
          setOpenModal(false);
        })
        .catch((err) => {
          Swal.fire({
            icon: "error",
            title: "Oops...",
            text: "Something went wrong!",
          });
          props.setIsLoading(true);
        });
    }
  }

  const handleSelectCompany = (event) => {
    const selectedOption = event.id || event;

    if (selectedOption !== "add-new") {
      setCompanyError("");
      setCompany(selectedOption);
      setCompanyName(event?.name);
    } else setAddNew(selectedOption);
  };

  // const handleSelectCompany = (event) => {
  //   const selectedOption = event.name;

  //   setCompany(selectedOption);
  //   props.setClient(event.id);
  // };
  function handleDelete(item) {
    //console.log(item);
    props.setIsLoading(false);
    const updatedItems = props.companyList.filter(
      (item1) => item1.id !== item.id
    );
    localStorage.setItem("companyList", JSON.stringify(updatedItems));
    props.setCompanyList(updatedItems);
    const updatedClients = props.editedData?.map((item1) => {
      if (parseInt(item1.company?.id) === parseInt(item.id)) {
        return { ...item1, company: null }; // Set company to an empty array
      }

      return item1; // Keep the item unchanged if the condition is not met
    });
    localStorage.setItem("clientList", JSON.stringify(updatedClients));
    props.setEditedData(updatedItems);

    dispatch(deleteCompany({ token: token, id: item.id }))
      .unwrap()
      .then((res) => {
        if (res.status) {
          //socket.emit("company-change", { email: item.email });
          props.setIsLoading(true);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }

  return (
    <>
      <div>
        <button
          className="project-btn-02 ps-3 pe-3 sm:ms-4 sm:mt-0 mt-3"
          onClick={() => {
            setOpenModal(true);
          }}
        >
          Add User
        </button>
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
                setName("");
                setNameError("");
                setCompanyError("");
                setCompany("Select Company");
                setAddNew(null);
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
              <div className="sidebar-heading mb-3">ADD USER</div>
              <div className="flex flex-col mb-3">
                <label className="text-sm">Name*</label>
                <input
                  type="text"
                  value={name}
                  placeholder="Enter Name"
                  onChange={(e) => {
                    setNameError("");
                    setName(e.target.value);
                  }}
                  className={`p-1 login-input border ${
                    nameError ? "border-red-500" : "border-gray-300"
                  }`}
                />
                {nameError && (
                  <p className="login-text2 text-red-500">{nameError}</p>
                )}
              </div>
              {props.client && (
                <div className="flex flex-col mb-3">
                  <label className="text-sm">Company Name*</label>
                  <Listbox value={""}>
                    <Listbox.Button
                      className={`p-1 login-input flex items-center justify-between border ${
                        companyError ? "border-red-500" : "border-gray-300"
                      }`}
                    >
                      {companyName}
                      <svg
                        className={`text-gray-500 h-4 w-4`}
                        viewBox="0 0 18 18"
                        fill="currentColor"
                        aria-hidden="true"
                      >
                        <path
                          fillRule="evenodd"
                          d="M6.293 6.293a1 1 0 011.414 0L10 8.586l2.293-2.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </Listbox.Button>

                    <Listbox.Options
                      className={`absolute z-40 bg-black overflow-y-auto text-white rounded-lg shadow cursor-pointer`}
                      style={{
                        maxHeight: "14.4rem",
                        width: "15rem",
                        marginTop: "50px",
                        fontSize: "14px",
                      }}
                    >
                      <Listbox.Option
                        className="hover:bg-blue-900 ps-2 pe-2"
                        value={"add-new"}
                        onClick={() => handleSelectCompany("add-new")}
                      >
                        Add Company
                      </Listbox.Option>
                      {props.companyList
                        ?.slice() // Create a shallow copy to avoid mutating the original array
                        .sort((a, b) => a.name.localeCompare(b.name))
                        .map((item, index) => (
                          <Listbox.Option
                            className="hover:bg-blue-900 ps-2 pe-2"
                            key={index}
                            value={item}
                          >
                            <div className="flex">
                              <div
                                style={{ width: "90%" }}
                                onClick={() => handleSelectCompany(item)}
                              >
                                {item?.name}
                              </div>
                              <div
                                style={{ width: "10%" }}
                                className="cursor-pointer flex justify-center items-center hover:bg-white hover:rounded-md"
                                onClick={() => handleDelete(item)}
                              >
                                <img
                                  src={deleteIcon}
                                  alt=""
                                  className="w-3 h-3"
                                />
                              </div>
                            </div>
                          </Listbox.Option>
                        ))}
                    </Listbox.Options>
                  </Listbox>
                  {addNew === "add-new" && (
                    <div>
                      <AddCompany
                        companyList={props.companyList}
                        setCompanyList={props.setCompanyList}
                        addUser={true}
                        setAddNew={setAddNew}
                      />
                    </div>
                  )}
                  {/* <input
                    type="text"
                    value={company}
                    placeholder="Enter Company Name"
                    onChange={(e) => {
                      setCompany(e.target.value);
                    }}
                    className={`p-1 login-input border border-gray-300`}
                  />
                  {companyError && (
                    <p className="login-text2 text-red-500">{companyError}</p>
                  )} */}
                  {/* <select
                    className="cursor-pointer p-1 login-input border border-gray-300"
                    value={company}
                    onChange={handleSelectCompany}
                    required
                  >
                    <option value="" disabled selected>
                      Select Company
                    </option>
                    {companyList?.map((item, index) => (
                      <option key={index} value={item?.id}>
                        {item?.name}
                      </option>
                    ))}
                    <option value="add-new">Add Company</option>
                  </select>
                  {addNew === "add-new" && (
                    <div>
                      <AddCompany
                        companyList={companyList}
                        setCompanyList={setCompanyList}
                        addUser={true}
                        setAddNew={setAddNew}
                      />
                    </div>
                  )} */}
                  {companyError && (
                    <p className="login-text2 text-red-500">{companyError}</p>
                  )}
                </div>
              )}
              <div className="flex flex-col mb-3">
                <label className="text-sm">Email*</label>
                <input
                  type="email"
                  value={email}
                  placeholder="Enter Email"
                  onChange={(e) => {
                    setEmailError("");
                    setEmail(e.target.value);
                  }}
                  className={`p-1 login-input border ${
                    emailError ? "border-red-500" : "border-gray-300"
                  }`}
                />
                {emailError && (
                  <p className="login-text2 text-red-500">{emailError}</p>
                )}
              </div>
              <div className="mt-3 mb-10">
                <button
                  className="project-btn-02 ps-3 pe-3 me-2"
                  onClick={handleAddEditor}
                >
                  Save
                </button>
                <button
                  className="project-btn-02 ps-3 pe-3"
                  onClick={() => {
                    setOpenModal(false);
                    setEmail("");
                    setEmailError("");
                    setName("");
                    setNameError("");
                    setCompanyError("");
                    setCompany("Select Company");
                    setAddNew(null);
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

export default AddUser;
