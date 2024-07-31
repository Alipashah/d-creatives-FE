import React, { useEffect, useRef, useState } from "react";
import Comment from "../Comment/comment";
import { useDrag, useDrop } from "react-dnd";
import imgIcon from "../../../assets/images/Asignee1.png";
import { Listbox, Transition } from "@headlessui/react";
import ProjectEdit from "../EditProject/editProject";
import EditCell from "./EditCell";
import { editProject } from "../../../store/editProjectSlice";
import { useDispatch } from "react-redux";
import Swal from "sweetalert2";
import { useLocation } from "react-router-dom";
import EditClient from "../EditClient/editClient";
import { deleteProject } from "../../../store/deleteProjectSlice";
import { addProject } from "../../../store/addProjectSlice";
import { reOrder } from "../../../store/reOrderSlice";
import option1 from "../../../assets/images/option-1.png";
import option2 from "../../../assets/images/option-2.png";
import option3 from "../../../assets/images/option-3.png";
import option4 from "../../../assets/images/option-4.png";
import option5 from "../../../assets/images/option-5.png";
import option6 from "../../../assets/images/option-6.png";
import redFlag from "../../../assets/images/red-flag.png";
import greyFlag from "../../../assets/images/grey-flag.png";
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
const colorList1 = [
  "rgba(255, 201, 152, 0.7)",
  "rgba(173, 214, 255, 1)",
  "rgba(213, 205, 255, 1)",
  "rgba(210, 255, 234, 1)",
  "rgba(255, 204, 204, 1)",
];
const colorList2 = [
  "rgba(240, 240, 240, 1)",
  "rgba(255, 208, 208, 1)",
  "rgba(255, 200, 136, 1)",
  "rgba(255, 210, 52, 1)",
  "rgba(255, 225, 117, 1)",
  "rgba(255, 242, 194, 1)",
  "rgba(245, 255, 186, 1)",
  "rgba(220, 255, 219, 1)",
  "rgba(76, 175, 80, 1)",
  "rgba(255, 80, 80, 1)",
];
const colorList3 = [
  "rgba(142, 142, 142, 0.5)",
  "rgba(142, 142, 142, 0.5)",
  "rgba(142, 142, 142, 0.5)",
  "rgba(76, 175, 80, 1)",
  "rgba(255, 0, 0, 1)",
];
const colorList4 = [
  "rgba(119, 119, 119, 1)",
  "rgba(255, 114, 114, 1)",
  "rgba(255, 107, 44, 1)",
  "rgba(183, 143, 0, 1)",
  "rgba(173, 134, 0, 1)",
  "rgba(204, 159, 0, 1)",
  "rgba(134, 157, 0, 1)",
  "rgba(4, 154, 0, 1)",
  "rgba(255, 255, 255, 1)",
  "rgba(255, 255, 255, 1)",
];

const TableRow = ({
  item,
  handleSelectStatus,
  handleSelectEditor,
  page,
  type,
  project,
  clientListData,
  editorList,
  index,
  setAddProject,
  setUpdateProject,
  key,
  id,
  selectedIds,
  setSelectedIds,
  handleSelectItem,
  filter,
  handleAddProject,
  projectListData,
  setProjectListData,
  orderList,
  setOrderList,
  setSort,
  handleCopy,
  handleDelete,
  renderProject,
  setRenderProject,
  fullOrderList,
  //dragRef,
}) => {
  const dispatch = useDispatch();
  const role = localStorage.getItem("role");
  const token = localStorage.getItem("token");
  let selectedColor = "";
  let selectedColorText = "";
  const [loading, setLoading] = useState(false);
  const [title, setTitle] = useState(item?.projectName);
  const [clientList, setClientList] = useState([]);
  const [brand, setBrand] = useState(
    item?.projectClients?.map((client) => parseInt(client?.client?.id))
  );
  const [status, setStatus] = useState(item?.currentStatus);
  const [startDate, setStartDate] = useState(item?.createdDate);
  // const [editor, setEditor] = useState(
  //   item?.projectEditors?.map((editor) => parseInt(editor?.id))
  // );
  const initialEditors =
    item?.projectEditors?.map((editor) => parseInt(editor?.id)) || [];
  const [editor, setEditor] = useState(initialEditors);
  const [talentName, setTalentName] = useState(item?.talentName);
  const [company, setCompany] = useState(item?.company?.id);
  const [dueDate, setDueDate] = useState(item?.completionDate);
  const [briefLink, setBriefLink] = useState(item?.briefLink);
  const [talentFootage, setTalentFootage] = useState(item?.talentFootageLink);
  const [frameio, setFrameio] = useState(item?.videoFolderName);
  const [finalFolder, setFinalFolder] = useState(item?.finalFolder);
  const [priority, setPriority] = useState(item?.priority);
  const [stage, setStage] = useState(item?.currentStage);
  const dragRef = useRef(null);
  const dropRef = useRef(null);
  const multiDropRef = useRef(null);
  const commentRef = useRef(null);

  const localCompanyJSON = localStorage.getItem("companyList");
  const localCompanyList = localCompanyJSON
    ? JSON.parse(localCompanyJSON)
    : null;

  useEffect(() => {
    if (renderProject) {
      setTitle(item?.projectName);
      setBrand(
        item?.projectClients?.map((client) => parseInt(client?.client?.id))
      );
      setStatus(item?.currentStatus);
      setStartDate(item?.createdDate);
      const initialEditors =
        item?.projectEditors?.map((editor) => parseInt(editor?.id)) || [];
      setEditor(initialEditors);
      setTalentName(item?.talentName);
      setCompany(item?.company?.id);
      setDueDate(item?.completionDate);
      setBriefLink(item?.briefLink);
      setTalentFootage(item?.talentFootageLink);
      setFrameio(item?.videoFolderName);
      setFinalFolder(item?.finalFolder);
      setPriority(item?.priority);
      setStage(item?.currentStage);
    }
  }, [item, project]);

  const [companyList, setCompanyList] = useState(localCompanyList || []);

  const location = useLocation();

  useEffect(() => {
    const cellId = location.state && location.state.cellId;

    if (cellId) {
      // Scroll to the element with the specified cellId
      const element = document.getElementById(cellId);

      if (element) {
        element.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    }
  }, [location.state]);

  function handleSubmit(e, text, arr) {
    if (
      e?.key === "Enter" ||
      e?.target?.value === "click-btn" ||
      text === "editor" ||
      text === "blur"
    ) {
      e?.target?.blur();
      let companyObject;

      if (company) {
        const localCompanyJSON1 = localStorage.getItem("companyList");
        const localCompanyList1 = localCompanyJSON1
          ? JSON.parse(localCompanyJSON1)
          : null;
        companyObject = localCompanyList1.filter(
          (item1) => item1.id === parseInt(company)
        );
      }

      const updatedItems = projectListData.map((item1) => {
        if (item1.id === item.id) {
          return {
            ...item1,
            projectName: title,
            projectType: item?.projectType,
            company: company ? (companyObject ? companyObject[0] : {}) : {},
            talentName: talentName,
            briefLink: briefLink,
            finalFolder: finalFolder,
            videoFolderName: frameio,
            talentFootageLink: talentFootage,
            editorId: editor,
            priority: priority,
            createdDate: startDate,
            completionDate: dueDate,
            status: status,
            currentStage: stage,
            projectClients: clientList || item?.projectClients,
            client: clientList[0] || item?.client,
          };
        }
        return item1;
      });
      if (text !== "editor") {
        localStorage.setItem("projectList", JSON.stringify(updatedItems));
        setProjectListData(updatedItems);
      }
      // Perform validation here before submitting the form
      // You can check for empty fields or use regular expressions for more complex validation
      // If the form is valid, you can submit it to the server or perform further actions
      console.log("Form submitted");

      dispatch(
        editProject({
          token: token,
          id: item?.id,
          data: {
            projectName: title,
            projectType: item?.projectType,
            companyId: parseInt(company),
            finalFolder: finalFolder,
            talentName: talentName,
            briefLink: briefLink,
            videoFolderName: frameio,
            talentFootageLink: talentFootage,
            editorId: text === "editor" ? arr : editor,
            priority: priority,
            createdDate: startDate,
            completionDate: dueDate,
            status: status,
            currentStage: stage,
          },
        })
      )
        .unwrap()
        .then((res) => {
          if (res.status) {
            socket.emit("project-update", { id: item.id });
            // Swal.fire({
            //   icon: "success",
            //   title: "Project edited successfully",
            //   timer: 1400,
            //   timerProgressBar: true,
            //   showConfirmButton: false,
            // });
          }
        })
        .catch((err) => {
          Swal.fire({
            icon: "error",
            title: "Oops...",
            text: "Something went wrong!",
          });
        });
    }
  }

  if (item?.projectType === "Other Projects") {
    statusList.map((data, index) => {
      if (data === item?.currentStatus) {
        selectedColor = colorList1[index];
        selectedColorText = colorList3[index];
      } else return;
    });
  } else {
    statusList2.map((data, index) => {
      if (data === item?.currentStatus) {
        selectedColor = colorList2[index];
        selectedColorText = colorList4[index];
      } else return;
    });
  }

  const [{ isDragging }, drag] = useDrag({
    type: "row",
    item:
      selectedIds?.length > 0 && selectedIds
        ? { ids: selectedIds }
        : {
            id: item?.id,
            tableName: item?.currentStage,
            order: item?.order,
            type: item?.projectType,
            page: page,
          },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const handleMultiDropItems = (draggedItemIds, targetItemId) => {
    // console.log(orderList);
    // console.log(draggedItemIds, targetItemId, "ok");
    const updatedIdList = [...orderList];
    const targetIndex = orderList.indexOf(targetItemId);
    if (targetIndex !== -1) {
      // Remove the dragged items from their original positions
      draggedItemIds.forEach((draggedId) => {
        const draggedIndex = updatedIdList.indexOf(draggedId);
        if (draggedIndex !== -1) {
          updatedIdList.splice(draggedIndex, 1);
        }
      });

      // Insert the dragged items after the target item
      updatedIdList.splice(targetIndex, 0, ...draggedItemIds);

      //console.log(updatedIdList);
      setSort(null);
      setSelectedIds([]);
      setOrderList(updatedIdList);
      localStorage.setItem("projectOrder", JSON.stringify(updatedIdList));
      dispatch(
        reOrder({
          token: token,
          data: { projectOrder: updatedIdList },
        })
      )
        .unwrap()
        .then((res) => {
          if (res.status) {
            socket.emit("order-list", { message: "update-project-data" });
          }
        });
    }
  };

  const handleDropItem = (draggedItemId, targetItemId) => {
    //console.log(draggedItemId, targetItemId);
    //console.log(orderList);
    // Exchange IDs between the dragged item and the target item
    const index1 = orderList.indexOf(draggedItemId);
    const index2 = orderList.indexOf(targetItemId);
    //console.log(index1, index2);
    if (index1 !== -1 && index2 !== -1) {
      // Create a new array with swapped positions using spread operator and array destructuring
      const updatedIdList = [...orderList];
      [updatedIdList[index1], updatedIdList[index2]] = [
        updatedIdList[index2],
        updatedIdList[index1],
      ];
      setSort(null);
      // Update the state with the new array
      //console.log(updatedIdList);
      setOrderList(updatedIdList);
      localStorage.setItem("projectOrder", JSON.stringify(updatedIdList));
      setUpdateProject(true);
      dispatch(
        reOrder({
          token: token,
          data: { projectOrder: updatedIdList },
        })
      )
        .unwrap()
        .then((res) => {
          if (res.status) {
            socket.emit("order-list", { message: "update-project-data" });
          }
        });
      setUpdateProject(false);
    } else {
      console.log("One or both items not found in idList");
    }
  };

  // const [, drop] = useDrop({
  //   accept: "row",
  //   drop: (droppedItem) => handleDropItem(droppedItem?.id, item?.id),
  //   collect: (monitor) => ({
  //     isOver: monitor.isOver(),
  //     canDrop: monitor.canDrop(),
  //   }),
  // });

  const [, drop] = useDrop({
    accept: "row",
    drop: (droppedItem) => {
      if (selectedIds?.length > 0 && selectedIds) {
        // Handle dropping a group of items
        handleMultiDropItems(droppedItem?.ids, item?.id);
      } else {
        // Handle dropping a single item
        if (droppedItem?.type === item?.projectType) {
          handleDropItem(droppedItem?.id, item?.id);
        }
      }
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
      canDrop: monitor.canDrop(),
    }),
  });

  // const [, multiDrop] = useDrop({
  //   accept: "row",
  //   drop: (droppedItem) => {
  //     // Handle multi-item drag-and-drop here
  //     const draggedItemIds = selectedIds; // array of dragged item IDs
  //     const targetItemIds = item?.id; // array of target item IDs
  //     handleMultiDropItems(draggedItemIds, targetItemIds);
  //   },
  //   collect: (monitor) => ({
  //     isOver: monitor.isOver(),
  //     canDrop: monitor.canDrop(),
  //   }),
  // });

  const calculateRemainingDays = (item) => {
    const completionTime = new Date(item?.completionDate);
    const createdTime = new Date();
    const remainingDays = Math.ceil(
      (completionTime - createdTime) / (1000 * 3600 * 24)
    );

    return remainingDays;
  };

  function handleSingleDelete() {
    //setAddProject(false);

    let id = [];
    id.push(contextMenu.rowData.id);

    const updatedItems = projectListData.filter(
      (item) => !id?.includes(item?.id)
    );
    const updatedItemsOrder = orderList.filter((item) => !id?.includes(item));
    localStorage.setItem("projectList", JSON.stringify(updatedItems));
    localStorage.setItem("projectOrder", JSON.stringify(updatedItemsOrder));
    setOrderList(updatedItemsOrder);
    setProjectListData(updatedItems);

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
          //setAddProject(true);
        }
      })
      .catch((err) => {
        console.log(err);
        //setAddProject(true);
      });

    // Swal.fire({
    //   title: "Are you sure?",
    //   text: "You won't be able to revert this!",
    //   icon: "warning",
    //   showCancelButton: true,
    //   confirmButtonColor: "#3085d6",
    //   cancelButtonColor: "#d33",
    //   confirmButtonText: "Yes, delete it!",
    // }).then((result) => {
    //   if (result.isConfirmed) {
    //     dispatch(deleteProject({ token: token, data: { ids: id } }))
    //       .unwrap()
    //       .then((res) => {
    //         if (res?.status) {
    //           //Swal.fire("Deleted!", "Project has been deleted.", "success");
    //         }
    //         setAddProject(true);
    //       })
    //       .catch((err) => {
    //         console.log(err);
    //       });
    //   }
    // });
  }

  function handleAdd() {
    setLoading(true);
    let tempData = [];
    setAddProject(false);
    let orderNo = parseInt(localStorage.getItem("maxId") || 0);
    // Assuming rowData and orderList are defined
    let rowData = contextMenu.rowData; // Your existing rowData object

    // Calculate the new id based on the maximum value in orderList
    const newId = orderNo + 1;

    // Update the id property of rowData with the new id
    const updatedRowData = {
      ...rowData, // Copy existing properties
      id: newId, // Update the id property
      isDisable: true,
    };
    const index = orderList.indexOf(contextMenu.rowData.id);
    let order = index >= 0 ? index : orderList.length;

    order = order + 1;

    const updatedOrderList = [...fullOrderList];
    updatedOrderList.splice(order, 0, newId);
    setOrderList(updatedOrderList);

    const updatedProjectList = [...projectListData];
    updatedProjectList.splice(orderNo, 0, updatedRowData);

    setProjectListData(updatedProjectList);
    tempData = updatedProjectList;
    localStorage.setItem("projectList", JSON.stringify(updatedProjectList));
    localStorage.setItem("projectOrder", JSON.stringify(updatedOrderList));
    localStorage.setItem("maxId", newId);

    dispatch(
      addProject({
        token: token,
        data: {
          projectName: contextMenu.rowData.projectName,
          projectType: contextMenu.rowData.projectType,
          companyId: contextMenu.rowData.company?.id,
          talentName: contextMenu.rowData.talentName,
          briefLink: contextMenu.rowData.briefLink,
          videoFolderName: contextMenu.rowData.videoFolderName,
          talentFootageLink: contextMenu.rowData.talentFootageLink,
          finalFolder: contextMenu.rowData.finalFolder,
          editorId: contextMenu.rowData.projectEditors?.map((editor) =>
            parseInt(editor?.id)
          ),
          priority: contextMenu.rowData.priority,
          createdDate: contextMenu.rowData.createdDate,
          completionDate: contextMenu.rowData.completionDate,
          status: contextMenu.rowData.currentStatus,
          currentStage: contextMenu.rowData.currentStage,
          comment: contextMenu.rowData.comments[0]?.commentText,
          location: order,
        },
      })
    )
      .unwrap()
      .then((res) => {
        if (res.status) {
          socket.emit("project-list", { message: "update-project-data" });
          localStorage.setItem(
            "projectOrder",
            JSON.stringify(res?.projectOrder)
          );
          localStorage.setItem("maxId", res?.maxId);
          setOrderList(res?.projectOrder);

          const itemIndex = tempData?.findIndex(
            (item) => item.id === res?.data?.id
          );

          if (itemIndex !== -1) {
            // Create a copy of the items array
            const updatedItems = [...tempData];

            // Update the object in the copy
            updatedItems[itemIndex] = { ...res?.data };

            // Update the state with the new array
            setProjectListData(updatedItems);
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
          //setAddProject(true);
        }
      })
      .catch((err) => {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Something went wrong!",
        });
        setLoading(false);
        //setAddProject(true);
      });
  }

  const [contextMenu, setContextMenu] = useState(null);
  const contextRef = useRef(null);

  const handleContextMenu = (event, rowData) => {
    event.preventDefault();
    setContextMenu({
      left: event.clientX - 70,
      rowData: rowData,
    });
  };

  const handleContextOption = (option) => {
    // Handle the selected context menu option here
    let dueDays = calculateRemainingDays(contextMenu.rowData);
    if (option === "copy") {
      const textToCopy =
        contextMenu.rowData?.projectName +
        " " +
        contextMenu.rowData?.currentStatus +
        " - " +
        dueDays.toString() +
        " Days Left";
      navigator.clipboard
        .writeText(textToCopy)
        .then(() => {
          console.log(`Row Copied`);
        })
        .catch((err) => {
          console.error("Unable to copy text: ", err);
        });
    }
    if (option === "comment") {
      commentRef.current.focus();
    }
    if (option === "above") {
      if (!loading) handleAddProject("above", item?.id);
    }
    if (option === "below") {
      if (!loading) handleAddProject("below", item?.id);
    }
    if (option === "duplicate") {
      if (!loading) handleAdd();
    }
    if (option === "delete") {
      handleSingleDelete();
    }
    if (option === "deleteAll") {
      if (selectedIds?.length > 1) {
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
    if (option === "copyAll") {
      handleCopy();
    }
    setContextMenu(null); // Close the context menu
  };

  // Function to close the drawer when clicking outside of it
  const handleClickOutside = (event) => {
    if (contextRef.current && !contextRef.current.contains(event.target)) {
      setContextMenu(null);
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

  const handleSelectEditorCheckbox = (event) => {
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

  drag(dragRef);
  drop(dropRef);
  //multiDrop(multiDropRef);

  return (
    <>
      {project ? (
        <tr
          className=" border-b"
          ref={(node) => {
            dragRef.current = node;
            dropRef.current = node;
          }}
          key={key}
          id={id}
          onContextMenu={(e) => handleContextMenu(e, item)}
          style={{
            position: item?.isDisable ? "relative" : "static",
            pointerEvents: item?.isDisable ? "none" : "auto",
            opacity: item?.isDisable ? 0.5 : isDragging ? 0.5 : 1,
            backgroundColor:
              index === 0 ? "rgba(245, 245, 247, 1)" : "rgba(253, 253, 253, 1)",
          }}
        >
          <td
            style={{
              position: "-webkit-sticky",
              position: "sticky",
              transform: "translateZ(0)",

              left: 0,
              backgroundColor:
                index === 0
                  ? "rgba(245, 245, 247, 1)"
                  : "rgba(253, 253, 253, 1)",
              zIndex: 20,
            }}
          >
            <ProjectEdit
              setAddProject={setAddProject}
              item={item}
              orderList={orderList}
              setOrderList={setOrderList}
              editorList={editorList}
              clientList={clientListData}
              renderProject={renderProject}
              setRenderProject={setRenderProject}
            />
          </td>
          <td
            style={{
              position: "-webkit-sticky",
              position: "sticky",
              transform: "translateZ(0)",

              left: 26,
              backgroundColor:
                index === 0
                  ? "rgba(245, 245, 247, 1)"
                  : "rgba(253, 253, 253, 1)",
              zIndex: 20,
            }}
          >
            <div className="cursor-pointer">
              <input
                type="checkbox"
                name="selectItem"
                className="cursor-pointer"
                checked={selectedIds.includes(item?.id)}
                onChange={() => handleSelectItem(item?.id)}
              />
            </div>
          </td>
          <td
            className="px-4 py-1 "
            style={{
              position: "-webkit-sticky",
              position: "sticky",
              transform: "translateZ(0)",

              left: 44,
              backgroundColor:
                index === 0
                  ? "rgba(245, 245, 247, 1)"
                  : "rgba(253, 253, 253, 1)",
              zIndex: 20,
            }}
          >
            <div style={{ width: "120px" }}>
              <div className="tooltip editor-project-table-text-2 mb-1 mt-2">
                <EditCell
                  handleSubmit={handleSubmit}
                  type={"text"}
                  font={"editor-project-table-text-2"}
                  placeholder={"Enter Project Name"}
                  value={title}
                  setValue={setTitle}
                />
              </div>

              <div>
                <EditClient
                  handleSubmit={handleSubmit}
                  projectClients={item?.projectClients}
                  client={item?.client}
                  brand={brand}
                  companyName={item?.company?.name}
                  company={item?.company?.id}
                  setCompany={setCompany}
                  setBrand={setBrand}
                  setClientList={setClientList}
                  editorList={editorList}
                  clientList={clientListData}
                />
              </div>
            </div>
          </td>
          <td className="px-4 py-1 ">
            <div className="date-safari" style={{ width: "120px" }}>
              <EditCell
                handleSubmit={handleSubmit}
                type={"date"}
                font={"editor-project-table-text"}
                value={startDate}
                setValue={setStartDate}
              />
            </div>
          </td>
          {/* <td className="px-4 py-1 ">{item?.editor?.name}</td> */}
          <td className="px-4 py-1">
            {/* {role === "admin" ? ( */}
            <Listbox
              value={editor}
              onChange={(selectedItems) => {
                setEditor(selectedItems);
                const anotherList = editorList.filter((item) =>
                  selectedItems.includes(item.id)
                );
                //console.log(anotherList);
                setProjectListData((prevProjectList) => {
                  const updatedProjectList = prevProjectList.map((project) => {
                    if (project.id === item.id) {
                      return {
                        ...project,
                        projectEditors: anotherList,
                        editorId: selectedItems,
                      };
                    }
                    return project;
                  });

                  // Update local storage
                  localStorage.setItem(
                    "projectList",
                    JSON.stringify(updatedProjectList)
                  );

                  return updatedProjectList;
                });

                handleSubmit(selectedItems, "editor", selectedItems);
              }}
              multiple
            >
              <Listbox.Button>
                <div className="w-32 flex">
                  <img
                    src={item?.projectEditors[0]?.image || imgIcon}
                    alt="icon"
                    className="w-4 h-4 me-1 rounded-full"
                  />
                  {/* {item?.projectEditors[0]?.editor.name} */}
                  {editor?.length === 0 ||
                  editor === undefined ||
                  editor === null
                    ? "Select Editors"
                    : item?.projectEditors?.length > 1
                    ? `${item?.projectEditors[0]?.name} +${
                        item?.projectEditors?.length - 1
                      }`
                    : item?.projectEditors[0]?.name}
                </div>
              </Listbox.Button>
              <Transition
                enter="transition duration-100 ease-out"
                enterFrom="transform scale-95 opacity-0"
                enterTo="transform scale-100 opacity-100"
                leave="transition duration-75 ease-out"
                leaveFrom="transform scale-100 opacity-100"
                leaveTo="transform scale-95 opacity-0"
                className="absolute z-50 bg-white rounded-lg shadow overflow-y-auto h-40"
              >
                <Listbox.Options>
                  {editorList
                    ?.filter(
                      (item) =>
                        item?.isActive === true &&
                        ((item?.role === "admin" && item?.is_editor) ||
                          item?.role === "editor")
                    )
                    .map((item, index) => (
                      <Listbox.Option key={index} value={item?.id}>
                        {({ active, selected }) => (
                          <li
                            className={`editor-project-table-option flex ${
                              selected ? "bg-indigo-600 text-white" : ""
                            }`}
                          >
                            {/* <input
                               type="checkbox"
                               className="cursor-pointer form-checkbox me-2 h-4 w-4 text-black transition duration-150 ease-in-out"
                               value={item?.id}
                               checked={editor.includes(item?.id)}
                               onChange={handleSelectEditorCheckbox}
                             /> */}
                            <img
                              src={item?.image || imgIcon}
                              alt="icon"
                              className="w-4 h-4 me-1 rounded-full"
                            />
                            {item?.name}
                          </li>
                        )}
                      </Listbox.Option>
                    ))}
                </Listbox.Options>
              </Transition>
            </Listbox>
            {/* ) : (
              <div className="w-32 flex">
                <img
                  src={item?.projectEditors[0]?.image || imgIcon}
                  alt="icon"
                  className="w-4 h-4 me-1 rounded-full"
                />
                
                {editor?.length === 0 || editor === undefined
                  ? "Select Editors"
                  : item?.projectEditors?.length > 1
                  ? `${item?.projectEditors[0]?.name} +${
                      item?.projectEditors?.length - 1
                    }`
                  : item?.projectEditors[0]?.name}
              </div>
            )} */}
          </td>
          <td className="px-4 py-1">
            <Listbox
              value={item?.currentStatus}
              onChange={(e) => {
                handleSelectStatus(e, item?.id, item?.projectType);
              }}
            >
              <Listbox.Button
                style={{
                  borderRadius: "30px",
                  backgroundColor: selectedColor,
                  border: "none",
                  width: "100px",
                  color: selectedColorText,
                }}
                className="p-2"
              >
                {item?.currentStatus}
              </Listbox.Button>
              <Transition
                enter="transition duration-100 ease-out"
                enterFrom="transform scale-95 opacity-0"
                enterTo="transform scale-100 opacity-100"
                leave="transition duration-75 ease-out"
                leaveFrom="transform scale-100 opacity-100"
                leaveTo="transform scale-95 opacity-0"
                className="absolute z-50 bg-white rounded-lg shadow "
              >
                {item?.projectType === "Other Projects" ? (
                  <Listbox.Options>
                    {statusList.map((item, index) => (
                      <Listbox.Option
                        key={index}
                        value={item}
                        //className="flex justify-center  "
                      >
                        {({ active, selected }) => (
                          <li
                            className="editor-project-table-option"
                            style={{
                              background: colorList1[index],
                              color: colorList3[index],

                              //width: "fit-content",
                            }}
                          >
                            {item}
                          </li>
                        )}
                      </Listbox.Option>
                    ))}
                  </Listbox.Options>
                ) : (
                  <Listbox.Options>
                    {statusList2.map((item, index) => (
                      <Listbox.Option
                        key={index}
                        value={item}
                        //className="flex justify-center  "
                      >
                        {({ active, selected }) => (
                          <li
                            className="editor-project-table-option"
                            style={{
                              background: colorList2[index],
                              color: colorList4[index],
                              // width: "fit-content",
                            }}
                          >
                            {item}
                          </li>
                        )}
                      </Listbox.Option>
                    ))}
                  </Listbox.Options>
                )}
              </Transition>
            </Listbox>
          </td>
          <td className="px-4 py-1 ">
            <div className="date-safari" style={{ width: "120px" }}>
              <EditCell
                handleSubmit={handleSubmit}
                type={"date"}
                min={startDate}
                font={"editor-project-table-text"}
                value={dueDate}
                setValue={setDueDate}
              />
            </div>
          </td>
          <td className="px-4 py-1 ">
            <div
              className="flex items-center"
              style={{
                color:
                  parseInt(calculateRemainingDays(item)) > 3 ? "grey" : "red",
              }}
            >
              <img
                src={
                  parseInt(calculateRemainingDays(item)) > 3
                    ? greyFlag
                    : redFlag
                }
                alt="icon"
                className="w-3 h-3 me-1 "
              />
              {calculateRemainingDays(item)} Days
            </div>
          </td>
          <td className={`px-4 py-1`}>
            <EditCell
              handleSubmit={handleSubmit}
              font={"editor-project-table-text"}
              value={talentName}
              setValue={setTalentName}
              type={"text"}
              placeholder={"Enter Talent"}
            />
          </td>
          <td className="px-4 py-1 ">
            <Comment
              font={"editor-project-table-text"}
              comment={item?.comments}
              projectId={item?.id}
              setAddProject={setAddProject}
              commentRef={commentRef}
              renderProject={renderProject}
              setRenderProject={setRenderProject}
            />
          </td>

          <td className={`px-4 py-1`}>
            <EditCell
              handleSubmit={handleSubmit}
              font={"editor-project-table-text"}
              value={item?.projectName}
              setValue={setBriefLink}
              link={briefLink}
              type={"link"}
            />
          </td>
          <td className={`px-4 py-1 `}>
            <EditCell
              handleSubmit={handleSubmit}
              font={"editor-project-table-text"}
              value={item?.projectName}
              setValue={setTalentFootage}
              link={talentFootage}
              type={"link"}
            />
          </td>
          <td className={`px-4 py-1`}>
            <EditCell
              handleSubmit={handleSubmit}
              font={"editor-project-table-text"}
              value={item?.projectName}
              setValue={setFrameio}
              link={frameio}
              type={"link"}
            />
          </td>

          <td className="px-4 py-1 ">
            <EditCell
              handleSubmit={handleSubmit}
              font={"editor-project-table-text"}
              value={item?.projectName}
              setValue={setFinalFolder}
              link={finalFolder}
              type={"link"}
            />
          </td>
        </tr>
      ) : (
        <tr
          ref={(node) => {
            dragRef.current = node;
            dropRef.current = node;
          }}
          key={key}
          id={id}
          onContextMenu={(e) => handleContextMenu(e, item)}
          className=" border-b bg-white"
          style={{
            position: item?.isDisable ? "relative" : "static",
            pointerEvents: item?.isDisable ? "none" : "auto",
            opacity: item?.isDisable ? 0.5 : isDragging ? 0.5 : 1,
          }}
        >
          <td
            style={{
              position: "-webkit-sticky",
              position: "sticky",
              transform: "translateZ(0)",

              left: 0,
              background: "white",
              zIndex: 20,
            }}
          >
            <ProjectEdit
              setAddProject={setAddProject}
              item={item}
              orderList={orderList}
              setOrderList={setOrderList}
              clientList={clientListData}
              renderProject={renderProject}
              setRenderProject={setRenderProject}
            />
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
                checked={selectedIds.includes(item?.id)}
                onChange={() => handleSelectItem(item?.id)}
              />
            </div>
          </td>
          <td
            className="px-4 py-1 "
            style={{
              position: "-webkit-sticky",
              position: "sticky",
              transform: "translateZ(0)",

              left: 44,
              background: "white",
              zIndex: 20,
            }}
          >
            <div style={{ width: "120px" }}>
              <div className="tooltip mb-1 mt-2">
                <EditCell
                  handleSubmit={handleSubmit}
                  type={"text"}
                  font={"editor-project-table-text-2"}
                  placeholder={"Enter Project Name"}
                  value={title}
                  setValue={setTitle}
                />
              </div>

              <div>
                <EditClient
                  handleSubmit={handleSubmit}
                  projectClients={item?.projectClients}
                  client={item?.client}
                  brand={brand}
                  companyName={item?.company?.name}
                  company={company}
                  setCompany={setCompany}
                  setBrand={setBrand}
                  setClientList={setClientList}
                  clientList={clientListData}
                />
              </div>
            </div>
          </td>
          <td className="px-4 py-1 ">
            <div className="date-safari" style={{ width: "120px" }}>
              <EditCell
                handleSubmit={handleSubmit}
                type={"date"}
                font={"editor-project-table-text"}
                value={startDate}
                setValue={setStartDate}
              />
            </div>
          </td>
          {/* <td className="px-4 py-1 ">{item?.editor?.name}</td> */}
          <td className="px-4 py-1 ">
            {/* {role === "admin" ? ( */}
            <Listbox
              value={editor}
              onChange={(selectedItems) => {
                setEditor(selectedItems);
                const anotherList = editorList.filter((item1) =>
                  selectedItems.includes(item1.id)
                );

                setProjectListData((prevProjectList) => {
                  const updatedProjectList = prevProjectList.map((project) => {
                    if (project.id === item.id) {
                      return {
                        ...project,
                        projectEditors: anotherList,
                        editorId: selectedItems,
                      };
                    }
                    return project;
                  });

                  // Update local storage
                  localStorage.setItem(
                    "projectList",
                    JSON.stringify(updatedProjectList)
                  );

                  return updatedProjectList;
                });

                handleSubmit(selectedItems, "editor", selectedItems);
              }}
              as="div"
              multiple
            >
              <Listbox.Button>
                <div className="w-32 flex">
                  <img
                    src={item?.projectEditors[0]?.image || imgIcon}
                    alt="icon"
                    className="w-4 h-4 me-1 rounded-full"
                  />
                  {/* {item?.projectEditors[0]?.editor.name} */}
                  {editor?.length === 0 || editor === undefined
                    ? "Select Editors"
                    : item?.projectEditors?.length > 1
                    ? `${item?.projectEditors[0]?.name} +${
                        item?.projectEditors?.length - 1
                      }`
                    : item?.projectEditors[0]?.name}
                </div>
              </Listbox.Button>
              <Transition
                enter="transition duration-100 ease-out"
                enterFrom="transform scale-95 opacity-0"
                enterTo="transform scale-100 opacity-100"
                leave="transition duration-75 ease-out"
                leaveFrom="transform scale-100 opacity-100"
                leaveTo="transform scale-95 opacity-0"
                className="absolute z-50 bg-white rounded-lg shadow overflow-y-auto h-40"
              >
                <Listbox.Options>
                  {editorList
                    ?.filter(
                      (item) =>
                        item?.isActive === true &&
                        ((item?.role === "admin" && item?.is_editor) ||
                          item?.role === "editor")
                    )
                    .map((item, index) => (
                      <Listbox.Option key={index} value={item?.id}>
                        {({ active, selected }) => (
                          <li
                            className={`editor-project-table-option flex ${
                              selected ? "bg-indigo-600 text-white" : ""
                            }`}
                          >
                            {/* <input
                                type="checkbox"
                                className="cursor-pointer form-checkbox me-2 h-4 w-4 text-black transition duration-150 ease-in-out"
                                value={item?.id}
                                checked={editor.includes(item?.id)}
                                onChange={handleSelectEditorCheckbox}
                              /> */}
                            <img
                              src={item?.image || imgIcon}
                              alt="icon"
                              className="w-4 h-4 me-1 rounded-full"
                            />
                            {item?.name}
                          </li>
                        )}
                      </Listbox.Option>
                    ))}
                </Listbox.Options>
              </Transition>
            </Listbox>
            {/* ) : (
              <div className="w-32 flex">
                <img
                  src={item?.projectEditors[0]?.image || imgIcon}
                  alt="icon"
                  className="w-4 h-4 me-1 rounded-full"
                />
               
                {editor?.length === 0 || editor === undefined
                  ? "Select Editors"
                  : item?.projectEditors?.length > 1
                  ? `${item?.projectEditors[0]?.name} +${
                      item?.projectEditors?.length - 1
                    }`
                  : item?.projectEditors[0]?.name}
              </div>
            )} */}
          </td>

          <td className="px-4 py-1">
            <Listbox
              value={item?.currentStatus}
              onChange={(e) => {
                handleSelectStatus(e, item?.id, item?.projectType);
              }}
            >
              <Listbox.Button
                style={{
                  borderRadius: "30px",
                  backgroundColor: selectedColor,
                  border: "none",
                  width: "100px",
                  color: selectedColorText,
                }}
                className="p-2"
              >
                {item?.currentStatus}
              </Listbox.Button>
              <Transition
                enter="transition duration-100 ease-out"
                enterFrom="transform scale-95 opacity-0"
                enterTo="transform scale-100 opacity-100"
                leave="transition duration-75 ease-out"
                leaveFrom="transform scale-100 opacity-100"
                leaveTo="transform scale-95 opacity-0"
                className="absolute z-50 bg-white rounded-lg shadow"
              >
                {item?.projectType === "Other Projects" ? (
                  <Listbox.Options>
                    {statusList.map((item, index) => (
                      <Listbox.Option
                        key={index}
                        value={item}
                        //className="flex justify-center  "
                      >
                        {({ active, selected }) => (
                          <li
                            className="editor-project-table-option"
                            style={{
                              background: colorList1[index],
                              color: colorList3[index],
                              // width: "fit-content",
                            }}
                          >
                            {item}
                          </li>
                        )}
                      </Listbox.Option>
                    ))}
                  </Listbox.Options>
                ) : (
                  <Listbox.Options>
                    {statusList2.map((item, index) => (
                      <Listbox.Option
                        key={index}
                        value={item}
                        //className="flex justify-center  "
                      >
                        {({ active, selected }) => (
                          <li
                            className="editor-project-table-option"
                            style={{
                              background: colorList2[index],
                              color: colorList4[index],
                              //width: "fit-content",
                            }}
                          >
                            {item}
                          </li>
                        )}
                      </Listbox.Option>
                    ))}
                  </Listbox.Options>
                )}
              </Transition>
            </Listbox>
          </td>

          <td className="px-4 py-1 ">
            <div
              className="flex items-center"
              style={{
                color:
                  parseInt(calculateRemainingDays(item)) > 3 ? "grey" : "red",
              }}
            >
              <img
                src={
                  parseInt(calculateRemainingDays(item)) > 3
                    ? greyFlag
                    : redFlag
                }
                alt="icon"
                className="w-3 h-3 me-1 "
              />
              {calculateRemainingDays(item)} Days
            </div>
          </td>
          <td className={`px-4 py-1`}>
            <EditCell
              handleSubmit={handleSubmit}
              font={"editor-project-table-text"}
              value={talentName}
              setValue={setTalentName}
              type={"text"}
              placeholder={"Enter Talent"}
            />
          </td>
          <td className="px-4 py-1 ">
            <Comment
              font={"editor-project-table-text"}
              comment={item?.comments}
              projectId={item?.id}
              setAddProject={setAddProject}
              commentRef={commentRef}
              renderProject={renderProject}
              setRenderProject={setRenderProject}
            />
          </td>

          <td className={`px-4 py-1`}>
            <EditCell
              handleSubmit={handleSubmit}
              font={"editor-project-table-text"}
              value={item?.projectName}
              setValue={setBriefLink}
              link={briefLink}
              type={"link"}
            />
          </td>
          <td className={`px-4 py-1`}>
            <EditCell
              handleSubmit={handleSubmit}
              font={"editor-project-table-text"}
              value={item?.projectName}
              setValue={setTalentFootage}
              link={talentFootage}
              type={"link"}
            />
          </td>
          <td className={`px-4 py-1`}>
            <EditCell
              handleSubmit={handleSubmit}
              font={"editor-project-table-text"}
              value={item?.projectName}
              setValue={setFrameio}
              link={frameio}
              type={"link"}
            />
          </td>

          <td className="px-4 py-1 ">
            <EditCell
              handleSubmit={handleSubmit}
              font={"editor-project-table-text"}
              value={item?.projectName}
              setValue={setFinalFolder}
              link={finalFolder}
              type={"link"}
            />
          </td>
        </tr>
      )}

      {contextMenu && (
        <div
          className="context-menu cursor-pointer"
          style={{
            position: "absolute",
            left: `${contextMenu.left}px`,
            zIndex: 21,
          }}
          ref={contextRef}
        >
          {selectedIds?.length === 0 && (
            <>
              <div
                className="hover:bg-gray-100 p-3 flex"
                onClick={() => {
                  handleContextOption("above");
                }}
              >
                <img src={option1} alt="icon" className="w-3 h-3 me-2" />
                Insert record above
              </div>
              <div
                className="hover:bg-gray-100 p-3 flex"
                onClick={() => {
                  handleContextOption("below");
                }}
              >
                {" "}
                <img src={option2} alt="icon" className="w-3 h-3 me-2" />
                Insert record below
              </div>
              <div
                className="hover:bg-gray-100 p-3 flex"
                onClick={() => {
                  handleContextOption("duplicate");
                }}
              >
                {" "}
                <img src={option3} alt="icon" className="w-3 h-3 me-2" />
                Duplicate record
              </div>
            </>
          )}
          <div
            className="hover:bg-gray-100 p-3 flex"
            onClick={() => {
              if (selectedIds?.length === 0) handleContextOption("delete");
              else if (selectedIds?.length > 0) {
                handleContextOption("deleteAll");
              }
            }}
          >
            {" "}
            <img src={option5} alt="icon" className="w-3 h-3 me-2" />
            {selectedIds?.length === 0
              ? "Delete record"
              : selectedIds?.length > 0 && "Delete seleted rows"}
          </div>
          {selectedIds?.length === 0 && (
            <div
              className="hover:bg-gray-100 p-3 flex"
              onClick={() => {
                if (selectedIds?.length === 0) handleContextOption("comment");
              }}
            >
              {" "}
              <img src={option6} alt="icon" className="w-3 h-3 me-2" />
              Add comment
            </div>
          )}
          <div
            className="hover:bg-gray-100 p-3 flex"
            onClick={() => {
              if (selectedIds?.length === 0) handleContextOption("copy");
              else if (selectedIds?.length > 0) {
                handleContextOption("copyAll");
              }
            }}
          >
            {" "}
            <img src={option3} alt="icon" className="w-3 h-3 me-2" />
            {selectedIds?.length === 0
              ? "Copy row"
              : selectedIds?.length > 0 && "Copy selected rows"}
          </div>

          {/* Add more context menu options */}
        </div>
      )}
    </>
  );
};
export default TableRow;
