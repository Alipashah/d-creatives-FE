import React, { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { changeStatus } from "../../../store/changeStatusSlice";
import { changeEditor } from "../../../store/changeEditorSlice";
import { useDrag, useDrop } from "react-dnd";
import { dragDrop } from "../../../store/dragDropSlice";
import downArrow from "../../../assets/images/down-arrow-logo.svg";

import Icon01 from "../../../assets/images/table-icon-01.svg";
import Icon02 from "../../../assets/images/table-icon-02.svg";
import Icon03 from "../../../assets/images/table-icon-03.svg";
import Icon04 from "../../../assets/images/table-icon-04.svg";
import Icon05 from "../../../assets/images/table-icon-05.svg";
import Icon06 from "../../../assets/images/table-icon-6.svg";
import Icon07 from "../../../assets/images/table-icon-07.svg";
import Icon08 from "../../../assets/images/table-icon-08.svg";
import Icon09 from "../../../assets/images/table-icon-09.svg";
import Icon10 from "../../../assets/images/table-icon-10.svg";
import Icon11 from "../../../assets/images/table-icon-11.svg";

import addProject1 from "../../../assets/images/Add-Project.svg";
import Comment from "../Comment/comment";
import TableRow from "./TableRow";
import { getEditor } from "../../../store/getEditorSlice";
import Swal from "sweetalert2";
import { addProject } from "../../../store/addProjectSlice";
import ProjectEdit from "../EditProject/editProject";
import { deleteProject } from "../../../store/deleteProjectSlice";
import { socket } from "../../../App";

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

function ProjectTable(props) {
  const dispatch = useDispatch();
  const role = localStorage.getItem("role");
  const id = localStorage.getItem("id");
  //const dragRef = useRef(null);
  const token = localStorage.getItem("token");
  const itemsPerPage = 5; // Number of items to display per page
  const [currentPage, setCurrentPage] = useState(1);
  const [currentPageData, setCurrentPageData] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [isTableVisible, setIsTableVisible] = useState(true);
  const [loading, setLoading] = useState(false);

  const toggleTableVisibility = () => {
    setIsTableVisible(!isTableVisible);
  };
  //console.log(currentPageData);
  const [selectedColor, setSelectedColor] = useState("#6E8FFF");

  const handleSelectEditor = (event, id) => {
    //props.setChangeStatusCheck(false);

    // const selectedEditorId = parseInt(event.target.value);
    // const isSelected = event.target.checked;

    // if (isSelected) {
    //   // Add the selected client ID to the list of selected brands
    //   const updatedBrands = [...editor, selectedEditorId];
    //   setEditor(updatedBrands); // Update the state with the new selected brands
    // } else {
    //   // Remove the deselected client ID from the list of selected brands
    //   const updatedBrands = editor.filter((id) => id !== selectedEditorId);
    //   setEditor(updatedBrands); // Update the state with the new selected brands
    // }

    const selectedOption = event;
    const editor = props?.editorList?.data.filter(
      (item) => item.id === selectedOption.id
    );

    const updatedData = currentPageData.map((item) => {
      if (item.id === id) {
        return { ...item, editorId: selectedOption.id, editor: editor[0] };
      }
      return item;
    });
    setCurrentPageData(updatedData);

    dispatch(
      changeEditor({
        token: token,
        data: { projectId: id, editorId: selectedOption.id },
      })
    )
      .unwrap()
      .then(() => {
        //props.setChangeStatusCheck(true);
      })
      .catch((err) => {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Something went wrong!",
        });
      });
  };

  const generateTable = () => {
    let _currentPageData;

    if ((props?.filter || props?.type) && props?.client) {
      if (props.page === "project-management") {
        _currentPageData = props.data?.filter(
          (item) =>
            item.currentStage === props.filter &&
            item.projectType === props.project &&
            item.company?.id === parseInt(props?.client)
        );
      } else {
        _currentPageData = props.data?.filter(
          (item) =>
            (item.currentStage === props.filter ||
              item.projectType === props.type) &&
            item.company?.id === parseInt(props?.client) &&
            item.completed === false
        );
      }

      // Create a lookup object for projects using their IDs
      const projectLookup = _currentPageData?.reduce((lookup, project) => {
        lookup[project.id] = project;
        return lookup;
      }, {});

      // Map the projects based on the order of idList
      const mappedProjects = props?.orderList
        ?.map((id) => projectLookup[id])
        ?.filter(Boolean);
      setCurrentPageData(mappedProjects || _currentPageData);
    } else if (props?.filter || props?.type) {
      if (props.page === "project-management") {
        _currentPageData = props.data?.filter(
          (item) =>
            item.currentStage === props.filter &&
            item.projectType === props.project
        );
      } else {
        _currentPageData = props.data?.filter(
          (item) =>
            (item.currentStage === props.filter ||
              item.projectType === props.type) &&
            item.completed === false
        );
      }

      const projectLookup = _currentPageData?.reduce((lookup, project) => {
        lookup[project.id] = project;
        return lookup;
      }, {});

      // Map the projects based on the order of idList
      const mappedProjects = props.orderList
        ?.map((id) => projectLookup[id])
        .filter(Boolean);
      setCurrentPageData(mappedProjects || _currentPageData);
    }

    if (props?.data !== []) props.setIsLoading(false);
  };
  function goToPage(page) {
    setCurrentPage(page);
  }
  const renderPaginationButtons = () => {
    const buttons = [];

    for (let i = 1; i <= totalPages; i++) {
      buttons.push(
        <button
          key={i}
          className={`inline-flex items-center px-4 py-2 border-gray-300 text-sm leading-5 font-medium rounded-md text-gray-700 bg-white hover:text-gray-500 focus:outline-none focus:border-blue-300 focus:shadow-outline-blue active:text-gray-800 active:bg-gray-50 transition ease-in-out duration-150 ${
            i === currentPage ? "bg-gray-800" : ""
          }`}
          onClick={() => goToPage(i)}
        >
          {i}
        </button>
      );
    }

    return buttons;
  };
  const comment = () => {
    return (
      <>
        <button
          data-modal-target="authentication-modal"
          data-modal-toggle="authentication-modal"
          className="block text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
          type="button"
        >
          comment
        </button>

        <div
          id="authentication-modal"
          tabindex="-1"
          aria-hidden="true"
          className="fixed top-0 left-0 right-0 z-50 hidden w-full p-4 overflow-x-hidden overflow-y-auto md:inset-0 h-[calc(100%-1rem)] max-h-full"
        >
          <div className="relative w-full max-w-md max-h-full">
            <div className="relative bg-white rounded-lg shadow dark:bg-gray-700">
              <button
                type="button"
                className="absolute top-3 right-2.5 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center dark:hover:bg-gray-800 dark:hover:text-white"
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
              <div className="px-4 py-6 lg:px-8 m-5">
                <form className="flex flex-col space-y-6" action="#">
                  <div>
                    <label
                      for="comment"
                      className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                    >
                      Edit Comment
                    </label>
                    <input type="text" id="comment" />
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  };

  const handleSelectStatus = (event, id, type) => {
    // props.setChangeStatusCheck(false);

    const updatedData = props?.fullData?.map((item) => {
      if (item.id === id) {
        return { ...item, currentStatus: event, currentStage: event };
      }
      return item;
    });
    props?.setProjectListData(updatedData);
    localStorage.setItem("projectList", JSON.stringify(updatedData));
    const selectedOption = event;
    props.setUpdateProject(true);
    if (type === "Video Editing") {
      dispatch(
        changeStatus({
          token: token,
          data: { id: [id], name: selectedOption, projectType: type },
        })
      )
        .unwrap()
        .then(() => {
          socket.emit("project-update", { id: id });
          props.setUpdateProject(false);
          // props.setChangeStatusCheck(true);
        })
        .catch((err) => {
          Swal.fire({
            icon: "error",
            title: "Oops...",
            text: "Something went wrong!",
          });
        });
    } else {
      dispatch(
        changeStatus({
          token: token,
          data: { id: [id], name: selectedOption },
        })
      )
        .unwrap()
        .then((res) => {
          if (res?.status) {
            socket.emit("project-update", { id: id });
            props.setUpdateProject(false);
          }
          //props.setChangeStatusCheck(true);
        })
        .catch((err) => {
          Swal.fire({
            icon: "error",
            title: "Oops...",
            text: "Something went wrong!",
          });
        });
    }
  };

  const handleDropItem = (
    itemId,
    tableName,
    targetTableId,
    targetTableName
  ) => {
    if (
      tableName !== targetTableName &&
      props?.page !== "dashboard" &&
      targetTableName
    ) {
      let data = props.fullData;
      let type;
      const updatedItems = data.map((item) => {
        if (item.id === itemId) {
          type = item.projectType;
          return {
            ...item,
            currentStage: targetTableName,
            currentStatus: targetTableName,
          };
        }
        return item;
      });
      localStorage.setItem("projectList", JSON.stringify(updatedItems));
      props.setProjectListData(updatedItems);
      console.log(type);

      if (type === "Other Projects") {
        props.setUpdateProject(true);
        dispatch(
          changeStatus({
            token: token,
            data: { id: [itemId], name: targetTableName },
          })
        )
          .unwrap()
          .then((res) => {
            if (res?.status) {
              socket.emit("project-update", { id: itemId });
            }
          });
        props.setUpdateProject(false);
      } else {
        props.setUpdateProject(true);
        dispatch(
          dragDrop({
            token: token,
            data: {
              id: [itemId],
              name: targetTableName,
              projectType: "Video Editing",
            },
          })
        )
          .unwrap()
          .then((res) => {
            if (res?.status) {
              socket.emit("project-update", { id: itemId });
            }
          });
        props.setUpdateProject(false);
      }
    }
  };

  const handleMultipleDropItems = (
    draggedItemIds,
    targetTableId,
    targetTableName
  ) => {
    if (
      draggedItemIds.length > 0 &&
      targetTableName &&
      props?.page !== "dashboard"
    ) {
      let data = props.fullData;

      const updatedItems = data.map((item) => {
        if (draggedItemIds.includes(item.id)) {
          return {
            ...item,
            currentStage: targetTableName,
            currentStatus: targetTableName,
          };
        }
        return item;
      });

      localStorage.setItem("projectList", JSON.stringify(updatedItems));
      props.setProjectListData(updatedItems);
      props.setSelectedIds([]);

      const draggedItem = data.find((item) => item.id === draggedItemIds[0]);

      if (draggedItem) {
        props.setUpdateProject(true);
        if (draggedItem.projectType === "Other Projects") {
          dispatch(
            changeStatus({
              token: token,
              data: { id: draggedItemIds, name: targetTableName },
            })
          )
            .unwrap()
            .then((res) => {
              if (res?.status) {
                //socket.emit("project-update", { id: itemId });
                socket.emit("project-list", { message: "update-project-data" });
              }
            });
          props.setUpdateProject(false);
        } else {
          dispatch(
            dragDrop({
              token: token,
              data: {
                id: draggedItemIds,
                name: targetTableName,
                projectType: "Video Editing",
              },
            })
          )
            .unwrap()
            .then((res) => {
              if (res?.status) {
                //socket.emit("project-update", { id: itemId });
                socket.emit("project-list", { message: "update-project-data" });
              }
            });
          props.setUpdateProject(false);
        }
      }
    }
  };

  const [, drop] = useDrop({
    accept: "row",
    drop: (droppedItem) => {
      if (props.selectedIds?.length > 0 && props.selectedIds) {
        //console.log(selectedIds);
        // Handle dropping a group of items
        handleMultipleDropItems(
          droppedItem.ids,
          props.tableID,
          props.tableName
        );
      } else {
        // Handle dropping a single item
        handleDropItem(
          droppedItem?.id,
          droppedItem?.tableName,
          props.tableID,
          props.tableName
        );
      }
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
      canDrop: monitor.canDrop(),
    }),
  });

  function handleAddProject(text, order) {
    setLoading(true);
    let tempData = [];
    props.setAddProject(false);
    let maxId = parseInt(localStorage.getItem("maxId") || 0);
    let EditorObject;
    if (props?.projectFilter === "My Projects") {
      EditorObject = props?.editorList?.data?.filter(
        (item) => item.id === parseInt(id)
      );
    }
    let companyObject;
    if (props?.client) {
      companyObject = props?.companyList?.data?.filter(
        (item) => item.id === props?.client
      );
    }
    let todayDate = new Date();
    let completeDate = new Date();
    completeDate.setDate(todayDate.getDate() + 21);
    const index = props.orderList.indexOf(order);
    let orderNo = index >= 0 ? index : props.orderList.length;
    if (text === "above") {
      orderNo = Math.max(orderNo, 0);
    } else if (text === "below") {
      orderNo = orderNo + 1;
    }
    const updatedOrderList = [...props.fullOrderList];
    updatedOrderList.splice(orderNo, 0, maxId + 1);
    props.setOrderList(updatedOrderList);

    let status;
    let stage;
    if (props.type === "Video Editing" || props.project === "Video Editing") {
      status = "Initial Review";
      stage = "Initial Review";
    } else {
      status = "Backlog";
      stage = "Backlog";
    }

    const newProject = {
      id: maxId + 1,
      projectName: "",
      projectType: props.type || props.project,
      talentName: "",
      briefLink: "",
      clientEditingStatuses: [],
      clientOtherStatuses: [],

      company: props?.client ? companyObject[0] : {},
      comments: [],
      completed: false,
      completionDate: completeDate.toISOString().split("T")[0],
      createdAt: todayDate.toISOString().split("T")[0],
      createdDate: todayDate.toISOString().split("T")[0],
      currentStage: props?.page === "dashboard" ? stage : props.filter,
      currentStatus: props?.page === "dashboard" ? status : props.filter,
      delivered: false,
      editingStatuses: [],
      editor: props?.projectFilter === "My Projects" ? [parseInt(id)] : [],
      projectEditors:
        props?.projectFilter === "My Projects" ? EditorObject : [],
      finalFolder: "",
      hide: false,
      order: null,
      otherStatuses: [],
      priority: "Low",
      projectClients: [],
      statuses: [],
      talentFootageLink: "",
      updatedAt: "",
      userActiveProject: true,
      videoFolderName: "",
      isDisable: true,
    };

    let updatedProjectList = [...props.fullData];
    updatedProjectList.splice(orderNo, 0, newProject);

    props.setProjectListData(updatedProjectList);
    tempData = updatedProjectList;
    localStorage.setItem("projectList", JSON.stringify(updatedProjectList));
    localStorage.setItem("projectOrder", JSON.stringify(updatedOrderList));
    let updatedId = maxId + 1;
    localStorage.setItem("maxId", updatedId);
    //console.log(updatedProjectList.length, updatedId);
    //props.setAddProject(true);
    dispatch(
      addProject({
        token: token,
        data: {
          projectName: "",
          projectType: props.type || props.project,
          companyId: props?.client ? props?.client : null,
          talentName: "",
          briefLink: "",
          videoFolderName: "",
          talentFootageLink: "",
          finalFolder: "",
          editorId:
            props?.projectFilter === "My Projects" ? [parseInt(id)] : [],
          priority: "Low",
          createdDate: todayDate.toISOString().split("T")[0],
          completionDate: completeDate.toISOString().split("T")[0],
          status: props?.page === "dashboard" ? stage : props.filter,
          currentStage: props?.page === "dashboard" ? stage : props.filter,
          location: orderNo,
        },
      })
    )
      .unwrap()
      .then((res) => {
        if (res.status) {
          // Swal.fire({
          //   icon: "success",
          //   title: "Project added successfully",
          //   timer: 1400,
          //   timerProgressBar: true,
          //   showConfirmButton: false,
          // });

          socket.emit("project-list", { message: "update-project-data" });
          // let projectListJSON1 = localStorage.getItem("projectList");
          // let localData1 = projectListJSON1
          //   ? JSON.parse(projectListJSON1)
          //   : null;
          // if (localData1?.length <= res?.data?.length || localData1 === null) {
          //   localStorage.setItem("projectList", JSON.stringify(res?.data));
          //   localStorage.setItem(
          //     "projectOrder",
          //     JSON.stringify(res?.projectOrder)
          //   );
          //   localStorage.setItem("maxId", res?.maxId);

          //   props.setProjectListData(res?.data);
          //   props.setOrderList(res?.projectOrder);
          // }

          localStorage.setItem(
            "projectOrder",
            JSON.stringify(res?.projectOrder)
          );
          localStorage.setItem("maxId", res?.maxId);
          props.setOrderList(res?.projectOrder);

          const itemIndex = tempData?.findIndex(
            (item) => item.id === res?.data?.id
          );

          if (itemIndex !== -1) {
            // Create a copy of the items array
            const updatedItems = [...tempData];

            // Update the object in the copy
            updatedItems[itemIndex] = { ...res?.data };

            // Update the state with the new array
            props.setProjectListData(updatedItems);
            localStorage.setItem("projectList", JSON.stringify(updatedItems));
            setLoading(false);
          }
        } else {
          Swal.fire({
            icon: "error",
            title: "Oops...",
            text: "Something went wrong!",
          });
          setLoading(false);
          //props.setAddProject(true);
        }
      })
      .catch((err) => {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Something went wrong!",
        });
        setLoading(false);
        //props.setAddProject(true);
      });
  }

  useEffect(() => {
    generateTable();
  }, [props.data]);

  useEffect(() => {}, [currentPageData]);

  function handleDelete() {
    const updatedItems = props.fullData?.filter(
      (item) => !props.selectedIds?.includes(item.id)
    );
    const updatedItemsOrder = props.fullOrderList?.filter(
      (item) => !props.selectedIds?.includes(item)
    );

    localStorage.setItem("projectList", JSON.stringify(updatedItems));
    localStorage.setItem("projectOrder", JSON.stringify(updatedItemsOrder));
    props.setOrderList(updatedItemsOrder);
    props.setProjectListData(updatedItems);

    //props.setAddProject(false);
    dispatch(
      deleteProject({
        token: token,
        data: { ids: props.selectedIds, projectOrder: updatedItemsOrder },
      })
    )
      .unwrap()
      .then((res) => {
        if (res?.status) {
          socket.emit("project-delete", { id: props.selectedIds });

          props.setSelectedIds([]);
          //props.setAddProject(true);
        }
      })
      .catch((err) => {
        console.log(err);
        props.setSelectedIds([]);
        //props.setAddProject(true);
      });
  }
  // function handleDelete() {
  //   if (props.selectedIds?.length === props.data?.length) {
  //     Swal.fire({
  //       title: "Are you sure?",
  //       text: "You won't be able to revert this!",
  //       icon: "warning",
  //       showCancelButton: true,
  //       confirmButtonColor: "#3085d6",
  //       cancelButtonColor: "#d33",
  //       confirmButtonText: "Yes, delete it!",
  //     }).then((result) => {
  //       if (result.isConfirmed) {
  //         //handleDeleteFunction();
  //       }
  //     });
  //   } else {
  //     //handleDeleteFunction();
  //   }
  // }
  function handleCopy() {
    // Create a lookup object for selected projects using their IDs
    const selectedProjectLookup = props.fullData
      .filter((project) => props.selectedIds.includes(project.id))
      .reduce((lookup, project) => {
        lookup[project.id] = project;
        return lookup;
      }, {});

    // Map the selected projects based on the order of idList
    const mappedSelectedProjects = props.orderList
      .map((id) => selectedProjectLookup[id])
      .filter(Boolean);
    // const selectedProjects = props.fullData.filter((project) =>
    //   props.selectedIds.includes(project.id)
    // );

    const copyData = mappedSelectedProjects
      .map((project) => {
        let dueDays = calculateRemainingDays(project);
        // Customize this according to your data structure
        return `${project.projectName} ${
          project.currentStatus
        } - (${dueDays.toString()} Days Left)`;
      })
      .join("\n");
    Swal.fire({
      icon: "success",
      title: "Data copied.",
      timer: 1000,
      timerProgressBar: true,
      showConfirmButton: false,
    });
    navigator.clipboard
      .writeText(copyData)
      .then(() => {
        console.log(`Row Copied`);
        props.setSelectedIds([]);
      })
      .catch((err) => {
        console.error("Unable to copy text: ", err);
      });
  }
  const calculateRemainingDays = (item) => {
    const completionTime = new Date(item?.completionDate);
    const createdTime = new Date();
    const remainingDays = Math.ceil(
      (completionTime - createdTime) / (1000 * 3600 * 24)
    );

    return remainingDays;
  };

  const handleKeyDown = (event) => {
    if (
      (event.key === "Delete" || (event.ctrlKey && event.key === "Delete")) &&
      props.selectedIds.length > 0
    ) {
      // Perform your desired action here
      if (props.selectedIds?.length > 1) {
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
            handleDelete();
          }
        });
      } else {
        handleDelete();
      }
    }
    if (event.ctrlKey && event.key === "c" && props.selectedIds?.length > 0) {
      handleCopy();
    }
  };

  const selectAll = () => {
    props.setSelectedIds((prevIds) => {
      // Get the data for the specified project
      let projectTypeData = [];
      if (props.type) {
        projectTypeData = currentPageData.filter(
          (project) => project.projectType === props.type
        );
      } else if (props.filter) {
        projectTypeData = currentPageData.filter(
          (project) =>
            project.currentStatus === props.filter &&
            project.projectType === props.project
        );
      }

      const newIds = projectTypeData.map((item) => item.id);

      // Check if the project type is already in selectedIds
      const isProjectTypeSelected = prevIds.some((id) => newIds.includes(id));

      if (isProjectTypeSelected) {
        let remainingIds = prevIds.filter((id) => newIds.includes(id));
        let remainingIds1 = prevIds.filter((id) => !newIds.includes(id));
        if (remainingIds.length === newIds.length) {
          return prevIds.filter((id) => !newIds.includes(id));
        } else {
          return [...remainingIds1, ...newIds];
        }
      } else {
        // If the project type is not selected, add its IDs
        return [...prevIds, ...newIds];
      }
    });
  };

  const isAllSelected = () => {
    let projectTypeData = [];
    if (props.type) {
      projectTypeData = currentPageData.filter(
        (project) => project.projectType === props.type
      );
    } else if (props.filter) {
      projectTypeData = currentPageData.filter(
        (project) =>
          project.currentStatus === props.filter &&
          project.projectType === props.project
      );
    }

    // Check if all items for the project type are selected
    if (projectTypeData?.length > 0)
      return projectTypeData.every((item) =>
        props.selectedIds.includes(item.id)
      );
  };

  useEffect(() => {
    // Add event listener to handle clicks outside the drawer
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [props.selectedIds]);

  return (
    <>
      {props.isLoading &&
      (props?.filter === "Brief" ||
        props?.filter === "Backlog" ||
        props?.type === "Video Editing") ? (
        <div className="flex justify-center items-center m-5">
          <svg
            aria-hidden="true"
            role="status"
            className="inline w-5 h-5 mr-3 text-gray-200 animate-spin dark:text-gray-600"
            viewBox="0 0 100 101"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
              fill="currentColor"
            />
            <path
              d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
              fill="#1C64F2"
            />
          </svg>
        </div>
      ) : !props.isLoading ? (
        <>
          <table
            className="m-auto border-collapse border-spacing-0 bg-white relative"
            ref={drop}
            title={props?.tableName}
            tableId={props?.tableID}
            style={{
              boxShadow: "0px 2px 4px 0px rgba(0, 0, 0, 0.1)",
              borderRadius: "10px",
            }}
          >
            {props?.filter === "Brief" ||
            props?.filter === "Backlog" ||
            props?.type === "Video Editing" ? (
              <thead className="editor-project-table-text-3 opacity-0 whitespace-nowrap">
                <tr className="">
                  <th
                    style={{
                      position: "-webkit-sticky",
                      position: "sticky",
                      transform: "translateZ(0)",

                      left: 0,
                      background: "white",
                      zIndex: 20,
                    }}
                    className="opacity-0"
                  >
                    <ProjectEdit />
                  </th>
                  <th
                    style={{
                      position: "-webkit-sticky",
                      position: "sticky",
                      transform: "translateZ(0)",

                      left: 26,
                      background: "white",
                      zIndex: 20,
                    }}
                  >
                    <div className="opacity-0">
                      <input type="checkbox" name="selectItem" />
                    </div>
                  </th>
                  <th
                    className="px-4 py-1"
                    style={{
                      position: "-webkit-sticky",
                      position: "sticky",
                      transform: "translateZ(0)",

                      left: 44,
                      background: "white",
                      zIndex: 20,
                    }}
                  >
                    <div
                      className="flex justify-start"
                      style={{ width: "150px" }}
                    >
                      <img src={Icon01} alt="icon" className="w-4 pe-1" />
                      <div className="editor-project-table-text-3">Title</div>
                    </div>
                  </th>
                  <th className="px-4 py-1">
                    <div
                      className="flex justify-start"
                      style={{ width: "120px" }}
                    >
                      <img src={Icon02} alt="icon" className="w-4 pe-1" />
                      <div className="editor-project-table-text-3">
                        Start Date
                      </div>
                    </div>
                  </th>
                  <th className="px-4 py-1">
                    <div className="flex justify-start w-32">
                      <img src={Icon03} alt="icon" className="w-4 pe-1" />
                      <div className="editor-project-table-text-3">Editor</div>
                    </div>
                  </th>

                  <th className="px-4 py-1">
                    <div
                      className="flex justify-start"
                      style={{ width: "120px" }}
                    >
                      <img src={Icon04} alt="icon" className="w-4 pe-1" />
                      <div className="editor-project-table-text-3">Status</div>
                    </div>
                  </th>

                  <th className="px-4 py-1">
                    <div
                      className="flex justify-start"
                      style={{ width: "120px" }}
                    >
                      <img src={Icon05} alt="icon" className="w-4 pe-1" />
                      {props.page === "dashboard" ? (
                        <div className="editor-project-table-text-3">
                          Due Date
                        </div>
                      ) : (
                        <div className="editor-project-table-text-3">
                          Deadline
                        </div>
                      )}
                    </div>
                  </th>
                  {props.page !== "dashboard" && (
                    <th className="px-4 py-1">
                      <div
                        className="flex justify-start"
                        style={{ width: "120px" }}
                      >
                        <img src={Icon05} alt="icon" className="w-4 pe-1" />

                        <div className="editor-project-table-text-3">
                          Due Date
                        </div>
                      </div>
                    </th>
                  )}
                  <th className="px-4 py-1">
                    <div
                      className="flex justify-start"
                      style={{ width: "150px" }}
                    >
                      <img src={Icon11} alt="icon" className="w-4 pe-1" />
                      <div className="editor-project-table-text-3">Talent</div>
                    </div>
                  </th>
                  <th className="px-4 py-1">
                    <div
                      className="flex justify-start"
                      style={{ width: "150px" }}
                    >
                      <img src={Icon06} alt="icon" className="w-4 pe-1" />
                      <div className="editor-project-table-text-3">
                        Internal Comments
                      </div>
                    </div>
                  </th>

                  <th className="px-4 py-1">
                    <div
                      className="flex justify-start"
                      style={{ width: "120px" }}
                    >
                      <img src={Icon07} alt="icon" className="w-4 pe-1" />
                      <div className="editor-project-table-text-3">
                        Brief Link
                      </div>
                    </div>
                  </th>
                  <th className="px-4 py-1">
                    <div
                      className="flex justify-start"
                      style={{ width: "120px" }}
                    >
                      <img src={Icon08} alt="icon" className="w-4 pe-1" />
                      <div className="editor-project-table-text-3">
                        Talent Footage
                      </div>
                    </div>
                  </th>
                  <th className="px-4 py-1">
                    <div
                      className="flex justify-start"
                      style={{ width: "120px" }}
                    >
                      <img src={Icon09} alt="icon" className="w-4 pe-1" />
                      <div className="editor-project-table-text-3">
                        Frame.io
                      </div>
                    </div>
                  </th>

                  <th className="px-4 py-1">
                    <div
                      className="flex justify-start"
                      style={{ width: "120px" }}
                    >
                      <img src={Icon10} alt="icon" className="w-4 pe-1" />
                      <div className="editor-project-table-text-3">
                        Final Folder
                      </div>
                    </div>
                  </th>
                </tr>
              </thead>
            ) : (
              <thead className="editor-project-table-text opacity-0 whitespace-nowrap">
                <tr className="">
                  <th
                    style={{
                      position: "-webkit-sticky",
                      position: "sticky",
                      transform: "translateZ(0)",

                      left: 0,
                      background: "white",
                      zIndex: 20,
                    }}
                    className="opacity-0"
                  >
                    <ProjectEdit />
                  </th>
                  <th
                    style={{
                      position: "-webkit-sticky",
                      position: "sticky",
                      transform: "translateZ(0)",

                      left: 26,
                      background: "white",
                      zIndex: 20,
                    }}
                  >
                    <div className="opacity-0">
                      <input type="checkbox" name="selectItem" />
                    </div>
                  </th>
                  <th
                    className="px-4 py-1"
                    style={{
                      position: "-webkit-sticky",
                      position: "sticky",
                      transform: "translateZ(0)",

                      left: 44,
                      background: "white",
                      zIndex: 20,
                    }}
                  >
                    <div
                      className="flex justify-start"
                      style={{ width: "150px" }}
                    >
                      <img src={Icon01} alt="icon" className="w-4 pe-1" />
                      <div className="editor-project-table-text-3">Title</div>
                    </div>
                  </th>
                  <th className="px-4 py-1">
                    <div
                      className="flex justify-start"
                      style={{ width: "120px" }}
                    >
                      <img src={Icon02} alt="icon" className="w-4 pe-1" />
                      <div className="editor-project-table-text-3">
                        Start Date
                      </div>
                    </div>
                  </th>
                  <th className="px-4 py-1">
                    <div className="flex justify-start w-32">
                      <img src={Icon03} alt="icon" className="w-4 pe-1" />
                      <div className="editor-project-table-text-3">Editor</div>
                    </div>
                  </th>

                  <th className="px-4 py-1">
                    <div
                      className="flex justify-start"
                      style={{ width: "120px" }}
                    >
                      <img src={Icon04} alt="icon" className="w-4 pe-1" />
                      <div className="editor-project-table-text-3">Status</div>
                    </div>
                  </th>

                  <th className="px-4 py-1">
                    <div
                      className="flex justify-start"
                      style={{ width: "120px" }}
                    >
                      <img src={Icon05} alt="icon" className="w-4 pe-1" />
                      {props.page === "dashboard" ? (
                        <div className="editor-project-table-text-3">
                          Due Date
                        </div>
                      ) : (
                        <div className="editor-project-table-text-3">
                          Deadline
                        </div>
                      )}
                    </div>
                  </th>
                  {props.page !== "dashboard" && (
                    <th className="px-4 py-1">
                      <div
                        className="flex justify-start"
                        style={{ width: "120px" }}
                      >
                        <img src={Icon05} alt="icon" className="w-4 pe-1" />

                        <div className="editor-project-table-text-3">
                          Due Date
                        </div>
                      </div>
                    </th>
                  )}
                  <th className="px-4 py-1">
                    <div
                      className="flex justify-start"
                      style={{ width: "150px" }}
                    >
                      <img src={Icon11} alt="icon" className="w-4 pe-1" />
                      <div className="editor-project-table-text-3">Talent</div>
                    </div>
                  </th>
                  <th className="px-4 py-1">
                    <div
                      className="flex justify-start"
                      style={{ width: "150px" }}
                    >
                      <img src={Icon06} alt="icon" className="w-4 pe-1" />
                      <div className="editor-project-table-text-3">
                        Internal Comments
                      </div>
                    </div>
                  </th>

                  <th className="px-4 py-1">
                    <div
                      className="flex justify-start"
                      style={{ width: "120px" }}
                    >
                      <img src={Icon07} alt="icon" className="w-4 pe-1" />
                      <div className="editor-project-table-text-3">
                        Brief Link
                      </div>
                    </div>
                  </th>
                  <th className="px-4 py-1">
                    <div
                      className="flex justify-start"
                      style={{ width: "120px" }}
                    >
                      <img src={Icon08} alt="icon" className="w-4 pe-1" />
                      <div className="editor-project-table-text-3">
                        Talent Footage
                      </div>
                    </div>
                  </th>
                  <th className="px-4 py-1">
                    <div
                      className="flex justify-start"
                      style={{ width: "120px" }}
                    >
                      <img src={Icon09} alt="icon" className="w-4 pe-1" />
                      <div className="editor-project-table-text-3">
                        Frame.io
                      </div>
                    </div>
                  </th>

                  <th className="px-4 py-1">
                    <div
                      className="flex justify-start"
                      style={{ width: "120px" }}
                    >
                      <img src={Icon10} alt="icon" className="w-4 pe-1" />
                      <div className="editor-project-table-text-3">
                        Final Folder
                      </div>
                    </div>
                  </th>
                </tr>
              </thead>
            )}
            {(props.filter || props.type) && (
              <tr>
                <td
                  style={{
                    position: "-webkit-sticky",
                    position: "sticky",
                    transform: "translateZ(0)",

                    left: 0,
                    background: "white",
                    zIndex: 20,
                  }}
                  className="opacity-0"
                >
                  <ProjectEdit />
                </td>
                <td
                  style={{
                    position: "-webkit-sticky",
                    position: "sticky",
                    transform: "translateZ(0)",

                    left: 26,
                    background: "white",
                    zIndex: 20,
                  }}
                >
                  <div className="cursor-pointer">
                    <input
                      type="checkbox"
                      name="selectItem"
                      className="cursor-pointer"
                      checked={isAllSelected()}
                      onChange={() => selectAll()}
                    />
                  </div>
                </td>
                <td
                  className="px-4 py-1 whitespace-nowrap"
                  style={{
                    position: "-webkit-sticky",
                    position: "sticky",
                    transform: "translateZ(0)",

                    left: 44,
                    background: "white",
                    zIndex: 20,
                  }}
                >
                  <div
                    className={`editor-project-table-scrolldown flex pb-1 pt-1 cursor-pointer`}
                    onClick={toggleTableVisibility}
                    style={{ width: "150px" }}
                  >
                    {props.filter || props.type}

                    {isTableVisible ? (
                      <img src={downArrow} alt="icon" className="ms-1" />
                    ) : (
                      <img
                        src={downArrow}
                        alt="icon"
                        className="ms-1 rotate-180"
                      />
                    )}
                  </div>
                </td>
              </tr>
            )}
            <tbody
              className={`editor-project-table-text transition-opacity transition-transform ${
                isTableVisible ? "scroll-enter-active" : "scroll-exit-active"
              }`}
            >
              {currentPageData?.length > 0 && isTableVisible && (
                <>
                  {currentPageData
                    // ?.filter(
                    //   (item) =>
                    //     (item.currentStage === props.filter &&
                    //       item.projectType === props.project) ||
                    //     item.projectType === props.type
                    // )
                    ?.map((item, index) => (
                      <TableRow
                        index={index}
                        filter={props.filter}
                        project={props.project}
                        type={props.type}
                        key={item.id}
                        id={item.id}
                        handleSelectStatus={handleSelectStatus}
                        handleSelectEditor={handleSelectEditor}
                        item={item}
                        page={props?.page}
                        clientListData={props?.clientList?.data}
                        editorList={props?.editorList?.data}
                        companyList={props?.companyList?.data}
                        setAddProject={props.setAddProject}
                        setUpdateProject={props.setUpdateProject}
                        selectedIds={props.selectedIds}
                        setSelectedIds={props.setSelectedIds}
                        handleSelectItem={props.handleSelectItem}
                        handleAddProject={handleAddProject}
                        projectListData={props.fullData}
                        setProjectListData={props.setProjectListData}
                        setOrderList={props.setOrderList}
                        orderList={props.orderList}
                        fullOrderList={props.fullOrderList}
                        setSort={props?.setSort}
                        handleDelete={handleDelete}
                        handleCopy={handleCopy}
                        renderProject={props.renderProject}
                        setRenderProject={props.setRenderProject}
                      />
                    ))}
                </>
              )}
            </tbody>
          </table>

          <div
            className="tooltip w-fit p-2 mb-2 cursor-pointer"
            onClick={() => {
              if (!loading) handleAddProject();
            }}
            style={{
              boxShadow: "0px 4px 4px 0px rgba(0, 0, 0, 0.1)",
              borderRadius: "0px 0px 10px 0px",
              backgroundColor: "white",

              position: "-webkit-sticky",
              position: "sticky",
              transform: "translateZ(0)",

              zIndex: 11,
            }}
          >
            <img src={addProject1} alt="icon" />
            <span className="tooltiptext2">Add Project</span>
          </div>

          <div>
            {currentPageData?.length <= 0 &&
              isTableVisible &&
              !props.isLoading &&
              props.data && (
                <div className={`flex justify-center sidebar-heading-2 pt-4`}>
                  No Data Found
                </div>
              )}
          </div>
        </>
      ) : (
        ""
      )}
    </>
  );
}

export default ProjectTable;
