import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getClient } from "../../../store/getClientSlice";
import { getEditor } from "../../../store/getEditorSlice";
import { editProject } from "../../../store/editProjectSlice";
import { STATUSES as CLIENTSTATUS } from "../../../store/getClientSlice";
import { STATUSES as EDITORSTATUS } from "../../../store/getEditorSlice";
import { deleteProject } from "../../../store/deleteProjectSlice";
import deleteIcon from "../../../assets/images/delete-icon.png";
import Swal from "sweetalert2";
import { useRef } from "react";
import Icon1 from "../../../assets/images/add-project-1.svg";
import Icon2 from "../../../assets/images/add-project-2.svg";
import Icon3 from "../../../assets/images/add-project-3.svg";
import Icon4 from "../../../assets/images/add-project-4.svg";
import Icon5 from "../../../assets/images/add-project-5.svg";
import Icon6 from "../../../assets/images/add-project-6.svg";
import Icon7 from "../../../assets/images/add-project-7.svg";
import { getCompany } from "../../../store/getCompanySlice";
import AddCompany from "../../AddCompany/addCompany";
import { socket } from "../../../App";

const EditForm = (props) => {
  const dispatch = useDispatch();
  const role = localStorage.getItem("role");
  const today = new Date(props.item?.createdDate).toISOString().split("T")[0];

  const urlPattern =
    /^(https?:\/\/|ftp:\/\/|www\.)[\w-]+\.\w{2,}(\/[\w- ./?%&=]*)?$/;
  const statusList = [
    "Backlog",
    "In Progress",
    "Review",
    "Completed",
    "Declined",
  ];
  const statusList2 = [
    "Brief",
    "B Rolls",
    "Talent Sourcing",
    "Filming",
    "In Queue",
    "Editing",
    "Initial Review",
    "Final Review",
    "Completed",
    "Declined",
  ];
  const priorityList = ["Low", "Medium", "High"];
  const stageAll = [
    "Brief",
    "B Rolls",
    "Talent Sourcing",
    "Filming",
    "Editing",
    "Initial Review",
    "Final Review",
    "Declined",
    "Completed",
  ];

  const localEditorJSON = localStorage.getItem("editorList");
  const localClientJSON = localStorage.getItem("clientList");
  const localCompanyJSON = localStorage.getItem("companyList");
  const localEditorList = localEditorJSON ? JSON.parse(localEditorJSON) : null;
  const localClientList = localClientJSON ? JSON.parse(localClientJSON) : null;
  const localCompanyList = localCompanyJSON
    ? JSON.parse(localCompanyJSON)
    : null;
  const [title, setTitle] = useState(props.item.projectName);
  const [brand, setBrand] = useState(
    props.item.projectClients?.map((client) => parseInt(client?.client?.id))
  );
  const [status, setStatus] = useState(props.item.currentStatus);
  const [startDate, setStartDate] = useState(props.item?.createdDate);
  const [editor, setEditor] = useState(
    props.item.projectEditors?.map((editor) => parseInt(editor?.id))
  );
  const [company, setCompany] = useState(props.item?.company?.id);
  const [dueDate, setDueDate] = useState(props.item.completionDate);
  const [briefLink, setBriefLink] = useState(props.item.briefLink);
  const [talentFootage, setTalentFootage] = useState(
    props.item.talentFootageLink
  );
  const [frameio, setFrameio] = useState(props.item.videoFolderName);
  const [finalFolder, setFinalFolder] = useState(props.item.finalFolder);
  const [priority, setPriority] = useState(props.item.priority);
  const [stage, setStage] = useState(props.item.currentStage);
  const [project, setProject] = useState(props.item.projectType);
  const [comment, setComment] = useState(
    props.item?.comments[props.item?.comments?.length - 1]?.commentText || ""
  );
  const [talentName, setTalentName] = useState(props.item?.talentName);
  const [isLoading, setIsLoading] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [showDropdown2, setShowDropdown2] = useState(false);
  const [editorList, setEditorList] = useState(localEditorList || []);
  const [clientList, setClientList] = useState(localClientList || []);
  const [companyList, setCompanyList] = useState(localCompanyList || []);
  const addModalRef = useRef(null);
  const token = localStorage.getItem("token");
  const [addNew, setAddNew] = useState(null);
  // const { data: clientList, status: clientStatus } = useSelector(
  //   (state) => state.getClient
  // );
  // const { data: editorList, status: editorStatus } = useSelector(
  //   (state) => state.getEditor
  // );

  useEffect(() => {
    socket.on("company-data", (res) => {
      localStorage.setItem("companyList", JSON.stringify(res?.company));
      setCompanyList(res?.company);
    });
  }, [socket]);

  // Create a function to generate the display string
  const getEditorDisplay = () => {
    const filteredEditors = editorList?.filter((item) =>
      editor?.includes(item?.id)
    );
    if (filteredEditors?.length === 0) {
      return "Select Editors";
    } else if (filteredEditors.length > 1) {
      return `${filteredEditors[0]?.name} +${filteredEditors?.length - 1}`;
    } else {
      return filteredEditors[0]?.name;
    }
  };

  const handleSelectPriority = (event) => {
    const selectedOption = event.target.value;
    setPriority(selectedOption);
  };
  useEffect(() => {
    if (props.item.projectType === project) {
      setStatus(props.item.currentStatus);
      setStage(props.item.currentStage);
    } else if (project === "Video Editing") {
      setStatus("Initial Review");
      setStage("Initial Review");
    } else {
      setStatus("Backlog");
      setStage("Backlog");
    }

    dispatch(getClient({ token: token }))
      .unwrap()
      .then((res) => {
        if (res?.status) {
          setClientList(res?.data);
        }
      });
    dispatch(getEditor({ token: token }))
      .unwrap()
      .then((res) => {
        if (res?.status) {
          setEditorList(res?.data);
        }
      });
    dispatch(getCompany({ token: token }))
      .unwrap()
      .then((res) => {
        if (res?.status) {
          if (res?.status) {
            setCompanyList(res?.data);
            localStorage.setItem("companyList", JSON.stringify(res.data));
            localStorage.setItem("companyMaxId", res.maxId);
          }
        }
      });
  }, [project]);

  function handleDelete() {
    props.setOpenModal(false);
    props.setAddProject(false);

    let id = [];
    id.push(props.item.id);

    const updatedItemsOrder = props.orderList.filter(
      (item) => !id?.includes(item)
    );
    localStorage.setItem("projectOrder", JSON.stringify(updatedItemsOrder));
    props.setOrderList(updatedItemsOrder);

    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        dispatch(
          deleteProject({
            token: token,
            data: { ids: id, projectOrder: updatedItemsOrder },
          })
        )
          .unwrap()
          .then((res) => {
            if (res?.status) {
              socket.emit("project-delete", { id: id });
              Swal.fire("Deleted!", "Project has been deleted.", "success");
            }
            props.setAddProject(true);
          })
          .catch((err) => {
            console.log(err);
          });
      }
    });
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    props.setAddProject(false);
    setIsLoading(true);
    // Perform validation here before submitting the form
    // You can check for empty fields or use regular expressions for more complex validation
    // If the form is valid, you can submit it to the server or perform further actions
    console.log("Form submitted");

    if (!startDate || !editor || !dueDate || !status) {
      alert("Please fill in all the fields");
      setIsLoading(false);
      return;
    } else {
      dispatch(
        editProject({
          token: token,
          id: props.item.id,
          data: {
            projectName: title,
            projectType: project,
            companyId: parseInt(company),
            talentName: talentName,
            briefLink: briefLink,
            videoFolderName: frameio,
            talentFootageLink: talentFootage,
            finalFolder: finalFolder,
            editorId: editor,
            priority: priority,
            createdDate: startDate,
            completionDate: dueDate,
            status: status,
            currentStage: stage,
            comment: comment,
          },
        })
      )
        .unwrap()
        .then((res) => {
          props.setOpenModal(false);
          socket.emit("project-update", { id: props.item.id });
          setIsLoading(false);
          // setTitle("");
          // setBrand("");
          // setStartDate("");
          // setBriefLink("");
          // setDueDate("");
          // setFinalFolder("");
          // setFrameio("");
          // setTalentFootage("");
          // setStatus("Initial Review");
          // setStage("Brief");
          // setProject("Video Editing");
          if (res.status) {
            Swal.fire({
              icon: "success",
              title: "Project edited successfully",
              timer: 1400,
              timerProgressBar: true,
              showConfirmButton: false,
            });
            props.setAddProject(true);
          } else {
            Swal.fire({
              icon: "error",
              title: "Oops...",
              text: "Something went wrong!",
            });
          }
        })
        .catch((err) => {
          props.setOpenModal(false);
          Swal.fire({
            icon: "error",
            title: "Oops...",
            text: "Something went wrong!",
          });
        });
    }
  };

  const handleSelectCompany = (event) => {
    const selectedOption = event.target.value;
    if (selectedOption !== "add-new") setCompany(selectedOption);
    else setAddNew(selectedOption);
  };
  const handleSelectClient = (event) => {
    const selectedClientId = parseInt(event.target.value);
    const isSelected = event.target.checked;

    if (isSelected) {
      // Add the selected client ID to the list of selected brands
      const updatedBrands = [...brand, selectedClientId];
      setBrand(updatedBrands); // Update the state with the new selected brands
    } else {
      // Remove the deselected client ID from the list of selected brands
      const updatedBrands = brand.filter((id) => id !== selectedClientId);
      setBrand(updatedBrands); // Update the state with the new selected brands
    }
  };
  const handleSelectEditor = (event) => {
    const selectedEditorId = parseInt(event.target.value);
    const isSelected = event.target.checked;

    if (isSelected) {
      // Add the selected client ID to the list of selected brands
      const updatedBrands = [...editor, selectedEditorId];
      setEditor(updatedBrands); // Update the state with the new selected brands
    } else {
      // Remove the deselected client ID from the list of selected brands
      const updatedBrands = editor.filter((id) => id !== selectedEditorId);
      setEditor(updatedBrands); // Update the state with the new selected brands
    }
  };
  const handleSelectStatus = (event) => {
    const selectedOption = event.target.value;
    setStatus(selectedOption);
    setStage(selectedOption);
  };
  const handleSelectStage = (event) => {
    const selectedOption = event.target.value;
    setStage(selectedOption);
  };
  const editModalRef = useRef(null);
  const handleClickOutside = (event) => {
    if (editModalRef.current && !editModalRef.current.contains(event.target)) {
      setShowDropdown2(false);
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

  return (
    <div className="ps-6 pe-6 mx-auto">
      <form>
        <div className="flex justify-center opacity-0">
          <div
            className={`flex justify-center items-center ${
              project === "Video Editing" ? "toggler" : "toggler3"
            } ps-2 pe-2`}
            onClick={() => {
              setProject("Video Editing");
            }}
          >
            Video Editing
          </div>
          <div
            className={`flex justify-center items-center ${
              project === "Other Projects" ? "toggler1" : "toggler2"
            } ps-2 pe-2`}
            onClick={() => {
              setProject("Other Projects");
            }}
          >
            Other Projects
          </div>
        </div>
        <div className="mb-4">
          <label
            htmlFor="title"
            className="block sm:text-sm text-xs font-medium text-gray-700"
          >
            A Name/Brief
          </label>
          <input
            type="text"
            id="title"
            className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block  w-full shadow-sm sm:text-sm text-xs border-gray-300 rounded-md"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>

        {/* <div className="mb-4 grid grid-cols-3">
          <label
            htmlFor="brand"
            className="flex items-center col-span-1 sm:text-sm text-xs font-medium text-gray-700"
          >
            <img src={Icon3} alt="icon" className="w-3 me-2" />
            Client
          </label>

          <div ref={editModalRef} className="relative">
            <div className="relative inline-block w-full text-left">
              <div>
                <button
                  type="button"
                  className="cursor-pointer border focus:border mt-1 focus:ring-indigo-500 focus:border-indigo-500  w-full shadow-sm sm:text-sm text-xs border-gray-300 rounded-md inline-flex justify-between items-center px-4 py-2 bg-white transition ease-in-out duration-150"
                  style={{ width: "200%" }}
                  id="dropdown-menu"
                  aria-haspopup="true"
                  aria-expanded="true"
                  onClick={() => setShowDropdown(!showDropdown)}
                >
                  Select Multiple Clients
                  <svg
                    className={`text-gray-500 h-6 w-6`}
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
                </button>
              </div>
              {showDropdown && (
                <div className="origin-top-right absolute overflow-y-auto h-40 right-0 mt-1 w-full rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5">
                  <div
                    className="py-1"
                    role="menu"
                    aria-orientation="vertical"
                    aria-labelledby="dropdown-menu"
                  >
                    {clientList
                      ?.filter((item) => item.isActive === true)
                      .map((item, index) => (
                        <label
                          key={index}
                          className="flex items-center px-4 py-2 sm:text-sm text-xs cursor-pointer"
                        >
                          <input
                            type="checkbox"
                            className="cursor-pointer form-checkbox h-4 w-4 text-black transition duration-150 ease-in-out"
                            value={item.id}
                            checked={brand.includes(item.id)}
                            onChange={handleSelectClient}
                          />
                          <span className="ml-2">{item.name}</span>
                        </label>
                      ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div> */}

        {/* <div className="mb-4 grid grid-cols-3">
          <label
            htmlFor="editor"
            className="flex items-center col-span-1 sm:text-sm text-xs font-medium text-gray-700"
          >
            <img src={Icon3} alt="icon" className="w-3 me-2" />
            Editor*
          </label>
          {role === "editor" ? (
            <select
              className="cursor-pointer mt-1 col-span-2 focus:ring-indigo-500 focus:border-indigo-500  w-full shadow-sm sm:text-sm text-xs border-gray-300 rounded-md"
              value={editor}
              required
            >
              <option value="" disabled selected>
                {props.item.editor?.name}
              </option>
            </select>
          ) : (
            <>
              <select
                className="cursor-pointer mt-1 col-span-2 focus:ring-indigo-500 focus:border-indigo-500  w-full shadow-sm sm:text-sm text-xs border-gray-300 rounded-md"
                value={editor}
                onChange={handleSelectEditor}
                required
              >
                <option value="" disabled selected>
                  Select Editor
                </option>
                {editorList
                  ?.filter((item) => item.isActive === true)
                  .map((item, index) => (
                    <option key={index} value={item?.id}>
                      {item?.name}
                    </option>
                  ))}
              </select>
            </>
          )}
        </div> */}

        <div className="mb-4 grid grid-cols-3">
          <label
            htmlFor="editor"
            className="flex items-center col-span-1 sm:text-sm text-xs font-medium text-gray-700"
          >
            <img src={Icon3} alt="icon" className="w-3 me-2" />
            Editor
          </label>

          <div ref={addModalRef} className="relative">
            <div className="relative inline-block w-full text-left">
              <div>
                <button
                  type="button"
                  className="cursor-pointer border focus:border mt-1 focus:ring-indigo-500 focus:border-indigo-500  w-full shadow-sm sm:text-sm text-xs border-gray-300 rounded-md inline-flex justify-between items-center px-4 py-2 bg-white transition ease-in-out duration-150"
                  style={{ width: "200%" }}
                  id="dropdown-menu"
                  aria-haspopup="true"
                  aria-expanded="true"
                  onClick={() => setShowDropdown2(!showDropdown2)}
                >
                  {getEditorDisplay()}
                  <svg
                    className={`text-gray-500 h-6 w-6`}
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
                </button>
              </div>
              {showDropdown2 && (
                <div className="origin-top-right absolute overflow-y-auto h-40 mt-1 w-fit rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5">
                  <div
                    className="py-1"
                    role="menu"
                    aria-orientation="vertical"
                    aria-labelledby="dropdown-menu"
                  >
                    {editorList
                      ?.filter(
                        (item) =>
                          item.isActive === true &&
                          ((item?.role === "admin" && item?.is_editor) ||
                            item?.role === "editor")
                      )
                      .map((item, index) => (
                        <label
                          key={index}
                          className="flex items-center px-4 py-2 sm:text-sm text-xs cursor-pointer"
                        >
                          <input
                            type="checkbox"
                            className="cursor-pointer form-checkbox h-4 w-4 text-black transition duration-150 ease-in-out"
                            value={item?.id}
                            checked={editor?.includes(item?.id)}
                            onChange={handleSelectEditor}
                          />
                          <span className="ml-2">{item?.name}</span>
                        </label>
                      ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        <div>
          <div className="mb-4 grid grid-cols-3">
            <label
              htmlFor="company"
              className="flex items-center col-span-1 sm:text-sm text-xs font-medium text-gray-700"
            >
              <img src={Icon3} alt="icon" className="w-3 me-2" />
              Company
            </label>

            <select
              className="cursor-pointer mt-1 col-span-2 focus:ring-indigo-500 focus:border-indigo-500  w-full shadow-sm sm:text-sm text-xs border-gray-300 rounded-md"
              value={company}
              onChange={handleSelectCompany}
              required
            >
              <option value="" disabled selected>
                Select Company
              </option>
              {companyList
                ?.slice() // Create a shallow copy to avoid mutating the original array
                .sort((a, b) => a.name.localeCompare(b.name))
                .map((item, index) => (
                  <option key={index} value={item?.id}>
                    {item?.name}
                  </option>
                ))}
              <option value="add-new">Add Company</option>
            </select>
          </div>
          {addNew === "add-new" && (
            <div className="mb-4 grid grid-cols-3">
              <label
                htmlFor="company"
                className="flex items-center col-span-1 sm:text-sm text-xs font-medium text-gray-700"
              >
                <img src={Icon3} alt="icon" className="w-3 me-2" />
                Add New Company
              </label>
              <div>
                <AddCompany
                  companyList={companyList}
                  setCompanyList={setCompanyList}
                  setAddNew={setAddNew}
                />
              </div>
            </div>
          )}
        </div>

        <div className="mb-4 grid grid-cols-3">
          <label
            htmlFor="editor"
            className="flex items-center col-span-1 sm:text-sm text-xs font-medium text-gray-700"
          >
            <img src={Icon6} alt="icon" className="w-3 me-2" />
            Status*
          </label>
          {project === "Video Editing" ? (
            <select
              className="cursor-pointer mt-1 col-span-2 focus:ring-indigo-500 focus:border-indigo-500  w-full shadow-sm sm:text-sm text-xs border-gray-300 rounded-md"
              value={status}
              onChange={handleSelectStatus}
            >
              <option selected disabled>
                Choose a option
              </option>

              {statusList2.map((item, index) => (
                <option key={index}>{item}</option>
              ))}
            </select>
          ) : (
            <select
              className="cursor-pointer mt-1 col-span-2 focus:ring-indigo-500 focus:border-indigo-500  w-full shadow-sm sm:text-sm text-xs border-gray-300 rounded-md"
              value={status}
              onChange={handleSelectStatus}
            >
              <option selected disabled>
                Choose a option
              </option>

              {statusList.map((item, index) => (
                <option key={index}>{item}</option>
              ))}
            </select>
          )}
        </div>
        {/* {project === "Video Editing" && (
          <div className="mb-4 grid grid-cols-3">
            <label
              htmlFor="editor"
              className="flex items-center col-span-1 sm:text-sm text-xs font-medium text-gray-700"
            >
              <img src={Icon6} alt="icon" className="w-3 me-2" />
              Stage*
            </label>

            <select
              className="cursor-pointer mt-1 col-span-2 focus:ring-indigo-500 focus:border-indigo-500  w-full shadow-sm sm:text-sm text-xs border-gray-300 rounded-md"
              onChange={handleSelectStage}
              value={stage}
            >
              <option selected disabled>
                Choose a option
              </option>

              {stageAll.map((item, index) => (
                <option key={index}>{item}</option>
              ))}
            </select>
          </div>
        )} */}
        <div className="mb-4 grid grid-cols-3">
          <label
            htmlFor="startDate"
            className="flex items-center col-span-1 sm:text-sm text-xs font-medium text-gray-700"
          >
            <img src={Icon5} alt="icon" className="w-3 me-2" />
            Start Date*
          </label>
          <input
            type="date"
            id="startDate"
            min={today}
            className="mt-1 col-span-2 focus:ring-indigo-500 focus:border-indigo-500  w-full shadow-sm sm:text-sm text-xs border-gray-300 rounded-md"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            required
          />
        </div>
        <div className="mb-4 grid grid-cols-3">
          <label
            htmlFor="dueDate"
            className="flex items-center col-span-1 sm:text-sm text-xs font-medium text-gray-700"
          >
            <img src={Icon1} alt="icon" className="w-3 me-2" />
            Due Date*
          </label>
          <input
            type="date"
            id="dueDate"
            min={today}
            className="mt-1 col-span-2 focus:ring-indigo-500 focus:border-indigo-500  w-full shadow-sm sm:text-sm text-xs border-gray-300 rounded-md"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            required
          />
        </div>

        <div className="mb-4 grid grid-cols-3">
          <label
            htmlFor="briefLink"
            className="flex items-center col-span-1 sm:text-sm text-xs font-medium text-gray-700"
          >
            <img src={Icon2} alt="icon" className="w-3 me-2" />
            Brief Link
          </label>
          <input
            type="text"
            id="briefLink"
            className="mt-1 col-span-2 focus:ring-indigo-500 focus:border-indigo-500  w-full shadow-sm sm:text-sm text-xs border-gray-300 rounded-md"
            value={briefLink}
            onChange={(e) => setBriefLink(e.target.value)}
            // pattern={urlPattern}
            // title="Enter an URL:"
          />
        </div>

        <div className="mb-4 grid grid-cols-3">
          <label
            htmlFor="priority"
            className="flex items-center col-span-1 sm:text-sm text-xs font-medium text-gray-700"
          >
            <img src={Icon6} alt="icon" className="w-3 me-2" />
            Priority
          </label>
          <select
            className="cursor-pointer mt-1 col-span-2 focus:ring-indigo-500 focus:border-indigo-500  w-full shadow-sm sm:text-sm text-xs border-gray-300 rounded-md"
            value={priority}
            onChange={handleSelectPriority}
          >
            {priorityList.map((item, index) => (
              <option key={index} value={item}>
                {item}
              </option>
            ))}
          </select>
        </div>

        <div className="mb-4 grid grid-cols-3">
          <label
            htmlFor="talentFootage"
            className="flex items-center col-span-1 sm:text-sm text-xs font-medium text-gray-700"
          >
            <img src={Icon2} alt="icon" className="w-3 me-2" />
            Talent Footage
          </label>
          <input
            type="text"
            id="talentFootage"
            className="mt-1 col-span-2 focus:ring-indigo-500 focus:border-indigo-500  w-full shadow-sm sm:text-sm text-xs border-gray-300 rounded-md"
            value={talentFootage}
            onChange={(e) => setTalentFootage(e.target.value)}
            // pattern={urlPattern}
            // title="Enter an URL:"
          />
        </div>

        <div className="mb-4 grid grid-cols-3">
          <label
            htmlFor="frameio"
            className="flex items-center col-span-1 sm:text-sm text-xs font-medium text-gray-700"
          >
            <img src={Icon2} alt="icon" className="w-3 me-2" />
            Frame.io
          </label>
          <input
            type="text"
            id="frameio"
            className="mt-1 col-span-2 focus:ring-indigo-500 focus:border-indigo-500  w-full shadow-sm sm:text-sm text-xs border-gray-300 rounded-md"
            value={frameio}
            onChange={(e) => setFrameio(e.target.value)}
            // pattern={urlPattern}
            // title="Enter an URL:"
          />
        </div>

        <div className="mb-4 grid grid-cols-3">
          <label
            htmlFor="finalFolder"
            className="flex items-center col-span-1 sm:text-sm text-xs font-medium text-gray-700"
          >
            <img src={Icon2} alt="icon" className="w-3 me-2" />
            Final Folder
          </label>
          <input
            type="text"
            id="finalFolder"
            className="mt-1 col-span-2 focus:ring-indigo-500 focus:border-indigo-500  w-full shadow-sm sm:text-sm text-xs border-gray-300 rounded-md"
            value={finalFolder}
            onChange={(e) => setFinalFolder(e.target.value)}
            // pattern={urlPattern}
            // title="Enter an URL:"
          />
        </div>
        <div className="mb-4 grid grid-cols-3">
          <label
            htmlFor="talentName"
            className="flex items-center col-span-1 sm:text-sm text-xs font-medium text-gray-700"
          >
            <img src={Icon4} alt="icon" className="w-3 me-2" />
            Talent
          </label>
          <input
            type="text"
            id="talentName"
            className="mt-1 col-span-2 focus:ring-indigo-500 focus:border-indigo-500  w-full shadow-sm sm:text-sm text-xs border-gray-300 rounded-md"
            value={talentName}
            onChange={(e) => {
              setTalentName(e.target.value);
            }}
          />
        </div>
        <div className="mb-4 grid grid-cols-3">
          <label
            htmlFor="comment"
            className="flex items-center col-span-1 sm:text-sm text-xs font-medium text-gray-700"
          >
            <img src={Icon4} alt="icon" className="w-3 me-2" />
            Comment
          </label>
          <textarea
            type="text"
            id="comment"
            className="mt-1 col-span-2 focus:ring-indigo-500 focus:border-indigo-500  w-full shadow-sm sm:text-sm text-xs border-gray-300 rounded-md"
            value={comment}
            onChange={(e) => {
              setComment(e.target.value);
            }}
          />
        </div>
        <div className="mt-5 flex justify-center">
          {isLoading ? (
            <button disabled type="button" className="login-btn px-4 py-2 me-2">
              <svg
                aria-hidden="true"
                role="status"
                className="inline w-4 h-4 mr-3 text-white animate-spin"
                viewBox="0 0 100 101"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                  fill="#E5E7EB"
                />
                <path
                  d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                  fill="currentColor"
                />
              </svg>
              Loading...
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              className="login-btn inline-flex items-center px-4 py-2 me-2"
            >
              Submit
            </button>
          )}

          <div
            onClick={handleDelete}
            className="inline-flex items-center px-4 py-2 cursor-pointer"
            style={{
              borderRadius: "10px",
              borderColor: "black",
              borderWidth: "1px",
            }}
          >
            Delete
            <img src={deleteIcon} alt="icon" className="ms-1 w-4" />
          </div>
        </div>
      </form>
    </div>
  );
};

export default EditForm;
