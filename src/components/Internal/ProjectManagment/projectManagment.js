import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import Swal from "sweetalert2";
import { getProject } from "../../../store/getProjectSlice";

import ProjectTable from "../ProjectTable/projectTable";
import Header from "./header";
import ProjectEdit from "../EditProject/editProject";

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
import { getEditor } from "../../../store/getEditorSlice";
import { getClient } from "../../../store/getClientSlice";
import { getCompany } from "../../../store/getCompanySlice";
import { getStatsEditor } from "../../../store/getStatsEditorSlice";
import { socket } from "../../../App";

function ProjectManagement() {
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
  const dispatch = useDispatch();

  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");
  const maxId = localStorage.getItem("maxId");
  const projectListJSON = localStorage.getItem("projectList");
  const localData = projectListJSON ? JSON.parse(projectListJSON) : null;
  const projectOrderJSON = localStorage.getItem("projectOrder");
  const localOrder = projectOrderJSON ? JSON.parse(projectOrderJSON) : null;
  const [client, setClient] = useState("");
  const [project, setProject] = useState("Video Editing");
  const [addProject, setAddProject] = useState(false);
  const [sort, setSort] = useState("");
  const [search, setSearch] = useState();
  const [isLoading, setIsLoading] = useState(true);
  const [orderList, setOrderList] = useState(localOrder || []);
  const [projectListData, setProjectListData] = useState(localData || []);
  const [changeStatusCheck, setChangeStatusCheck] = useState(true);
  const [updateProject, setUpdateProject] = useState(false);
  const [renderProject, setRenderProject] = useState(true);

  const { data: projectList, status: projectStatus } = useSelector(
    (state) => state.getProject
  );

  const { data: clientList, status: clientStatus } = useSelector(
    (state) => state.getClient
  );
  const { data: editorList, status: editorStatus } = useSelector(
    (state) => state.getEditor
  );
  const { data: companyList, status: companyStatus } = useSelector(
    (state) => state.getCompany
  );

  useEffect(() => {
    socket.on("project-add", (res) => {
      localStorage.setItem("projectList", JSON.stringify(res?.project));
      localStorage.setItem("projectOrder", JSON.stringify(res?.projectOrder));
      localStorage.setItem("maxId", res?.maxId);

      setProjectListData(res?.project);
      setOrderList(res?.projectOrder);
    });
    socket.on("update-project", (res) => {
      localStorage.setItem("projectOrder", JSON.stringify(res?.projectOrder));
      setOrderList(res?.projectOrder);

      const itemIndex = projectListData?.findIndex(
        (item) => item.id === res?.project?.id
      );
      //console.log({ res, itemIndex, projectListData });
      if (itemIndex !== -1) {
        // Create a copy of the items array
        const updatedItems = [...projectListData];

        // Update the object in the copy
        updatedItems[itemIndex] = { ...res?.project };

        // Update the state with the new array
        setProjectListData(updatedItems);
        localStorage.setItem("projectList", JSON.stringify(updatedItems));
      }
    });
    socket.on("list-order", (res) => {
      localStorage.setItem("projectOrder", JSON.stringify(res?.projectOrder));
      setOrderList(res?.projectOrder);
    });
    socket.on("delete-project", (res) => {
      const updatedItems = projectListData.filter(
        (item) => !res?.id?.includes(item.id)
      );
      localStorage.setItem("projectList", JSON.stringify(updatedItems));
      localStorage.setItem("projectOrder", JSON.stringify(res?.projectOrder));

      setProjectListData(updatedItems);
      setOrderList(res?.projectOrder);
    });
  }, [socket, projectListData, orderList]);

  useEffect(() => {
    dispatch(getClient({ token: token }));
    dispatch(getEditor({ token: token }));
    dispatch(getCompany({ token: token }))
      .unwrap()
      .then((res) => {
        if (res?.status) {
          localStorage.setItem("companyList", JSON.stringify(res.data));
          localStorage.setItem("companyMaxId", res.maxId);
        }
      })
      .catch((err) => {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Something went wrong!",
        });
      });
  }, []);

  useEffect(() => {
    if (updateProject)
      dispatch(getStatsEditor({ token: token }))
        .unwrap()
        .then((res) => {
          if (res?.status)
            localStorage.setItem("projectStats", JSON.stringify(res.data));
        })
        .catch((err) => {
          Swal.fire({
            icon: "error",
            title: "Oops...",
            text: "Something went wrong!",
          });
        });
  }, [updateProject]);

  useEffect(() => {
    if (addProject) {
      if (localData) setIsLoading(false);
      else setIsLoading(true);
      dispatch(getProject({ token: token }))
        .unwrap()
        .then((res) => {
          if (res?.status) {
            let projectListJSON1 = localStorage.getItem("projectList");
            let localData1 = projectListJSON1
              ? JSON.parse(projectListJSON1)
              : null;

            if (
              localData1?.length <= res?.data?.length ||
              localData1 === null
            ) {
              console.log("updated PM");
              localStorage.setItem("projectList", JSON.stringify(res.data));
              localStorage.setItem(
                "projectOrder",
                JSON.stringify(res.projectOrder)
              );

              localStorage.setItem("maxId", res.maxId);
              setProjectListData(res.data);
              setOrderList(res.projectOrder);
            }
            // setIsLoading(false);
          } else {
            // localStorage.setItem("projectList", JSON.stringify(res?.data));
            // localStorage.setItem(
            //   "projectOrder",
            //   JSON.stringify(res?.projectOrder)
            // );
            // localStorage.setItem("maxId", res?.maxId);
            // setProjectListData(res?.data);
            // setOrderList(res?.projectOrder);
            //setIsLoading(false);
          }
        })
        .catch((err) => {
          Swal.fire({
            icon: "error",
            title: "Oops...",
            text: "Something went wrong!",
          });
          setIsLoading(false);
        });
    }
  }, [addProject]);

  useEffect(() => {
    if (localData) setIsLoading(false);
    else setIsLoading(true);

    dispatch(getProject({ token: token }))
      .unwrap()
      .then((res) => {
        if (res?.status) {
          console.log("updated PM");
          localStorage.setItem("projectList", JSON.stringify(res.data));
          localStorage.setItem(
            "projectOrder",
            JSON.stringify(res.projectOrder)
          );

          localStorage.setItem("maxId", res.maxId);
          setProjectListData(res.data);
          setOrderList(res.projectOrder);

          // setIsLoading(false);
        } else {
          // localStorage.setItem("projectList", JSON.stringify(res?.data));
          // localStorage.setItem(
          //   "projectOrder",
          //   JSON.stringify(res?.projectOrder)
          // );
          // localStorage.setItem("maxId", res?.maxId);
          // setProjectListData(res?.data);
          // setOrderList(res?.projectOrder);
          //setIsLoading(false);
        }
      })
      .catch((err) => {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Something went wrong!",
        });
        setIsLoading(false);
      });
  }, []);

  const filteredProjects = useMemo(() => {
    let filtered = [...projectListData];
    let newOrderList = [...orderList];
    if (project === "Video Editing") {
      filtered = filtered.filter(
        (item) => item?.projectType === "Video Editing"
      );
    }
    if (project === "Other Projects") {
      filtered = filtered.filter(
        (item) => item?.projectType === "Other Projects"
      );
    }

    // Apply editor filter
    if (client) {
      filtered = filtered.filter((project) => project?.company?.id === client);
    }

    // Apply search filter
    if (search) {
      const normalizedSearch = search.toLowerCase();
      filtered = filtered.filter((project) =>
        project.projectName.toLowerCase().includes(normalizedSearch)
      );
    }

    // Apply sorting
    if (sort === "Name") {
      filtered.sort((a, b) => {
        const nameA = a.projectName?.toUpperCase().trim(); // Convert to uppercase for case-insensitive sorting
        const nameB = b.projectName?.toUpperCase().trim();

        if (nameA === "" && nameB !== "") {
          // Put empty project names at the end
          return 1;
        } else if (nameA !== "" && nameB === "") {
          // Put empty project names at the end
          return -1;
        }
        if (nameA < nameB) {
          return -1;
        }
        if (nameA > nameB) {
          return 1;
        }
        return 0;
      });
      newOrderList = filtered.map((project) => project.id);
    } else if (sort === "Date Created") {
      filtered.sort((a, b) => a.createdDate.localeCompare(b.createdDate));
      newOrderList = filtered.map((project) => project.id);
    } else if (sort === "Deadline") {
      filtered.sort((a, b) => {
        const durationA = new Date(a.completionDate) - new Date();
        const durationB = new Date(b.completionDate) - new Date();
        return durationA - durationB;
      });
      newOrderList = filtered.map((project) => project.id);
    } else if (sort === "Company") {
      filtered.sort((a, b) => {
        const nameA = a.company?.name.toUpperCase().trim(); // Convert to uppercase for case-insensitive sorting
        const nameB = b.company?.name.toUpperCase().trim();

        if (nameA === "" && nameB !== "") {
          return 1;
        } else if (nameA !== "" && nameB === "") {
          return -1;
        }
        if (nameA < nameB) {
          return -1;
        }
        if (nameA > nameB) {
          return 1;
        }
        return 0;
      });
      newOrderList = filtered.map((project) => project.id);
      // localStorage.setItem("projectOrder", JSON.stringify(newOrderList));
    }
    return { filtered, newOrderList };
  }, [orderList, projectListData, project, search, sort, client]);

  const location = useLocation();

  useEffect(() => {
    const cellId = location.state && location.state.cellId;

    if (cellId) {
      // Scroll to the element with the specified cellId
      const element = document.getElementById(cellId);
      const list = projectListData?.filter((item) => item.id === cellId);

      if (list) {
        setProject(list[0]?.projectType);
      }
    }
  }, [location.state]);

  useEffect(() => {
    //console.log(projectListData);
  }, [projectListData, project]);

  const [selectedIds, setSelectedIds] = useState([]);

  const handleSelectItem = (itemId) => {
    setSelectedIds((prevIds) => {
      if (prevIds.includes(itemId)) {
        return prevIds.filter((id) => id !== itemId);
      } else {
        return [...prevIds, itemId];
      }
    });
  };

  const selectAll = () => {
    setSelectedIds((prevIds) => {
      // If all items are already selected, unselect all
      if (prevIds.length === filteredProjects.filtered.length) {
        return [];
      } else {
        // Select all items that are not already selected
        const unselectedItems = filteredProjects.filtered.filter(
          (item) => !prevIds.includes(item.id)
        );
        return [...prevIds, ...unselectedItems.map((item) => item.id)];
      }
    });
  };

  return (
    <>
      <div className="sm:ml-16 flex flex-col lg:h-screen">
        <div className="sidebar-heading m-3 ms-6">Project Management</div>

        <>
          <Header
            setClient={setClient}
            setSearch={setSearch}
            setProject={setProject}
            project={project}
            setSort={setSort}
            setAddProject={setAddProject}
            selectedIds={selectedIds}
            setSelectedIds={setSelectedIds}
            data={projectListData}
            setData={setProjectListData}
            editorList={editorList}
            clientList={clientList}
            orderList={orderList}
            setOrderList={setOrderList}
            renderProject={renderProject}
            setRenderProject={setRenderProject}
          />
        </>

        {/* <div
          style={{
            display: "flex",
            justifyContent: "center",
          }}
        > */}
        <div
          className="overflow-auto relative pb-32 h-screen lg:h-fit bg-white sm:max-w-[calc(100vw-4.5rem)] max-w-[calc(100vw-5px)]"
          style={{
            margin: "0 auto",
          }}
        >
          {/* <div
            className="w-full bg-white "
            style={{
              position: "-webkit-sticky",
                position: "sticky",
              transform: "translateZ(0)",
            position:"-webkit-sticky",
              top: 0,
              zIndex: 20,
            }}
          > */}

          <div
            className="flex w-max editor-project-table-text-3 whitespace-nowrap"
            style={{
              backgroundColor: "white",

              position: "-webkit-sticky",
              position: "sticky",
              transform: "translateZ(0)",
              top: 0,
              zIndex: 20,
            }}
          >
            <div
              style={{
                position: "-webkit-sticky",
                position: "sticky",
                transform: "translateZ(0)",

                left: 0,
                background: "white",
                zIndex: 20,
              }}
              //className="opacity-0"
            >
              <div className="relative">
                <span className="absolute h-[20px] w-[30px] bg-white left-0"></span>
              </div>
              <ProjectEdit />
            </div>
            <div
              style={{
                position: "-webkit-sticky",
                position: "sticky",
                transform: "translateZ(0)",

                left: 26,
                background: "white",
                zIndex: 20,
              }}
            >
              {/* <div className="relative">
                  <span className="absolute h-[20px] w-[30px] bg-white left-0"></span>
                </div> */}
              <div className="cursor-pointer me-1">
                <input
                  type="checkbox"
                  name="selectItem"
                  className="cursor-pointer mt-[3px]"
                  checked={
                    selectedIds.length === filteredProjects.filtered.length &&
                    selectedIds.length > 0 &&
                    filteredProjects.filtered.length > 0
                  }
                  onChange={() => selectAll()}
                />
              </div>
            </div>
            <div
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
              <div className="flex justify-start" style={{ width: "150px" }}>
                <img src={Icon01} alt="icon" className="w-4 pe-1" />
                <div className="editor-project-table-text-3">Title</div>
              </div>
            </div>
            <div className="px-4 py-1">
              <div className="flex justify-start" style={{ width: "120px" }}>
                <img src={Icon02} alt="icon" className="w-4 pe-1" />
                <div className="editor-project-table-text-3">Start Date</div>
              </div>
            </div>
            <div className="px-4 py-1">
              <div className="flex justify-start w-32">
                <img src={Icon03} alt="icon" className="w-4 pe-1" />
                <div className="editor-project-table-text-3">Editor</div>
              </div>
            </div>
            <div className="px-4 py-1">
              <div className="flex justify-start" style={{ width: "120px" }}>
                <img src={Icon04} alt="icon" className="w-4 pe-1" />
                <div className="editor-project-table-text-3">Status</div>
              </div>
            </div>

            <div className="px-4 py-1">
              <div className="flex justify-start" style={{ width: "120px" }}>
                <img src={Icon05} alt="icon" className="w-4 pe-1" />
                <div className="editor-project-table-text-3">Deadline</div>
              </div>
            </div>
            <div className="px-4 py-1">
              <div className="flex justify-start" style={{ width: "120px" }}>
                <img src={Icon05} alt="icon" className="w-4 pe-1" />

                <div className="editor-project-table-text-3">Due Date</div>
              </div>
            </div>
            <div className="px-4 py-1">
              <div className="flex justify-start" style={{ width: "150px" }}>
                <img src={Icon11} alt="icon" className="w-4 pe-1" />
                <div className="editor-project-table-text-3">Talent</div>
              </div>
            </div>
            <div className="px-4 py-1">
              <div className="flex justify-start" style={{ width: "150px" }}>
                <img src={Icon06} alt="icon" className="w-4 pe-1" />
                <div className="editor-project-table-text-3">
                  Internal Comments
                </div>
              </div>
            </div>

            <div className="px-4 py-1">
              <div className="flex justify-start" style={{ width: "120px" }}>
                <img src={Icon07} alt="icon" className="w-4 pe-1" />
                <div className="editor-project-table-text-3">Brief Link</div>
              </div>
            </div>
            <div className="px-4 py-1">
              <div className="flex justify-start" style={{ width: "120px" }}>
                <img src={Icon08} alt="icon" className="w-4 pe-1" />
                <div className="editor-project-table-text-3">
                  Talent Footage
                </div>
              </div>
            </div>
            <div className="px-4 py-1">
              <div className="flex justify-start" style={{ width: "120px" }}>
                <img src={Icon09} alt="icon" className="w-4 pe-1" />
                <div className="editor-project-table-text-3">Frame.io</div>
              </div>
            </div>

            <div className="px-4 py-1">
              <div className="flex justify-start" style={{ width: "120px" }}>
                <img src={Icon10} alt="icon" className="w-4 pe-1" />
                <div className="editor-project-table-text-3">Final Folder</div>
              </div>
            </div>
          </div>

          {/* </div> */}
          {project === "Video Editing" ? (
            <>
              {statusList2.map((item, index) => (
                <div
                  key={index}
                  style={{ zIndex: 10 - index, position: "relative" }}
                >
                  <ProjectTable
                    sort={sort}
                    project={project}
                    tableID={index}
                    tableName={item}
                    client={client}
                    page={"project-management"}
                    filter={item}
                    data={filteredProjects.filtered}
                    fullData={projectListData}
                    setIsLoading={setIsLoading}
                    isLoading={isLoading}
                    setProjectListData={setProjectListData}
                    setChangeStatusCheck={setChangeStatusCheck}
                    setAddProject={setAddProject}
                    setUpdateProject={setUpdateProject}
                    handleSelectItem={handleSelectItem}
                    selectedIds={selectedIds}
                    setSelectedIds={setSelectedIds}
                    editorList={editorList}
                    clientList={clientList}
                    companyList={companyList}
                    setOrderList={setOrderList}
                    fullOrderList={orderList}
                    orderList={filteredProjects.newOrderList}
                    setSort={setSort}
                    renderProject={renderProject}
                    setRenderProject={setRenderProject}
                  />
                </div>
              ))}
            </>
          ) : (
            <>
              {statusList.map((item, index) => (
                <div
                  key={index}
                  style={{ zIndex: 10 - index, position: "relative" }}
                >
                  <ProjectTable
                    sort={sort}
                    project={project}
                    tableID={index}
                    tableName={item}
                    client={client}
                    page={"project-management"}
                    filter={item}
                    data={filteredProjects.filtered}
                    fullData={projectListData}
                    setIsLoading={setIsLoading}
                    isLoading={isLoading}
                    setProjectListData={setProjectListData}
                    setChangeStatusCheck={setChangeStatusCheck}
                    setAddProject={setAddProject}
                    setUpdateProject={setUpdateProject}
                    handleSelectItem={handleSelectItem}
                    selectedIds={selectedIds}
                    setSelectedIds={setSelectedIds}
                    editorList={editorList}
                    clientList={clientList}
                    companyList={companyList}
                    setOrderList={setOrderList}
                    fullOrderList={orderList}
                    orderList={filteredProjects.newOrderList}
                    setSort={setSort}
                    renderProject={renderProject}
                    setRenderProject={setRenderProject}
                  />
                </div>
              ))}
            </>
          )}
        </div>
        {/* </div> */}
      </div>
    </>
  );
}

export default ProjectManagement;
