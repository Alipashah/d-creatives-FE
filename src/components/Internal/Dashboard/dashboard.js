import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getProject } from "../../../store/getProjectSlice";
import { getStatsEditor } from "../../../store/getStatsEditorSlice";
import ProjectTable from "../ProjectTable/projectTable";
import Header from "./header";
import { getFirebaseToken } from "../../Firebase/firebase";
import { Notification } from "../../../store/notificationSlice";
import ProjectEdit from "../EditProject/editProject";
import { getCompany } from "../../../store/getCompanySlice";

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
import Swal from "sweetalert2";
import { getClient } from "../../../store/getClientSlice";
import { socket } from "../../../App";

function Dashboard() {
  const dispatch = useDispatch();
  const role = localStorage.getItem("role");
  const token = localStorage.getItem("token");
  const id = localStorage.getItem("id");

  const projectListJSON = localStorage.getItem("projectList");
  const localData = projectListJSON ? JSON.parse(projectListJSON) : null;
  const projectOrderJSON = localStorage.getItem("projectOrder");
  const localOrder = projectOrderJSON ? JSON.parse(projectOrderJSON) : null;
  const [orderList, setOrderList] = useState(localOrder || []);
  const projectStatsJSON = localStorage.getItem("projectStats");
  const localStats1 = projectStatsJSON ? JSON.parse(projectStatsJSON) : null;
  const [localStats, setLocalStats] = useState(localStats1 || null);
  const [client, setClient] = useState();
  const [search, setSearch] = useState();
  const [isLoading, setIsLoading] = useState(true);
  const [project, setProject] = useState("All Projects");
  const [sort, setSort] = useState("");
  const [changeStatusCheck, setChangeStatusCheck] = useState(
    localData ? false : true
  );
  const [addProject, setAddProject] = useState(false);
  const [updateProject, setUpdateProject] = useState(false);
  const [renderProject, setRenderProject] = useState(true);
  const [projectListData, setProjectListData] = useState(localData || []);

  const { data: projectList, status: projectStatus } = useSelector(
    (state) => state.getProject
  );
  const { data: statsEditor, status: statsEditorStatus } = useSelector(
    (state) => state.getStatsEditor
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

      if (itemIndex !== -1) {
        // Create a copy of the items array
        const updatedItems = [...projectListData];

        // Update the object in the copy
        updatedItems[itemIndex] = { ...res?.project };
        //console.log(updatedItems[itemIndex]);
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

  const handleGetFirebaseToken = () => {
    getFirebaseToken()
      .then((firebaseToken) => {
        console.log("Firebase token: ", firebaseToken);
        if (firebaseToken) {
          dispatch(
            Notification({ token: token, data: { fcm_token: firebaseToken } })
          );
        }
      })
      .catch((err) =>
        console.error("An error occured while retrieving firebase token. ", err)
      );
  };

  useEffect(() => {
    handleGetFirebaseToken();
  }, []);

  useEffect(() => {
    dispatch(getClient({ token: token }))
      .unwrap()
      .then((res) => {
        if (res?.status)
          localStorage.setItem("clientList", JSON.stringify(res.data));
      })
      .catch((err) => {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Something went wrong!",
        });
      });
    dispatch(getEditor({ token: token }))
      .unwrap()
      .then((res) => {
        if (res?.status)
          localStorage.setItem("editorList", JSON.stringify(res.data));
      })
      .catch((err) => {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Something went wrong!",
        });
      });
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
    dispatch(getStatsEditor({ token: token }))
      .unwrap()
      .then((res) => {
        if (res?.status) {
          localStorage.setItem("projectStats", JSON.stringify(res.data));
          setLocalStats(res.data);
        }
      })
      .catch((err) => {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Something went wrong!",
        });
      });
  }, [projectListData]);

  function getProjectData(check) {
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
            localData1 === null ||
            !check
          ) {
            console.log("updated Dashboard");
            localStorage.setItem("projectList", JSON.stringify(res.data));
            localStorage.setItem(
              "projectOrder",
              JSON.stringify(res.projectOrder)
            );
            localStorage.setItem("maxId", res.maxId);

            setProjectListData(res.data);
            setOrderList(res.projectOrder);
          }
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
        //setIsLoading(false);
      });
  }
  useEffect(() => {
    if (addProject) {
      getProjectData(addProject);
    }
  }, [addProject]);

  useEffect(() => {
    getProjectData(false);
  }, []);

  // useEffect(() => {
  //   if (addProject) {
  //     setIsLoading(true);
  //     if (project === "All Projects" && changeStatusCheck) {
  //       dispatch(getProject({ token: token, name: search, sortBy: sort }))
  //         .unwrap()
  //         .then((res) => {
  //           setProjectListData(res?.data);
  //           setIsLoading(false);
  //         })
  //         .catch((err) => {
  //           Swal.fire({
  //             icon: "error",
  //             title: "Oops...",
  //             text: "Something went wrong!",
  //           });
  //           setIsLoading(false);
  //         });
  //     } else if (changeStatusCheck) {
  //       dispatch(
  //         getProject({ token: token, status: true, name: search, sortBy: sort })
  //       )
  //         .unwrap()
  //         .then((res) => {
  //           setProjectListData(res?.data);
  //           setIsLoading(false);
  //         })
  //         .catch((err) => {
  //           Swal.fire({
  //             icon: "error",
  //             title: "Oops...",
  //             text: "Something went wrong!",
  //           });
  //           setIsLoading(false);
  //         });
  //     }
  //   }
  // }, [addProject]);

  const filteredProjects = useMemo(() => {
    let filtered = [...projectListData];
    let newOrderList = [...orderList];
    // Apply editor filter
    if (project !== "All Projects") {
      filtered = filtered?.filter((project) =>
        project?.projectEditors?.some((editor) => editor?.id === parseInt(id))
      );
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
        const nameA = a.company?.name?.toUpperCase().trim(); // Convert to uppercase for case-insensitive sorting
        const nameB = b.company?.name?.toUpperCase().trim();

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
  }, [orderList, projectListData, project, search, sort]);

  useEffect(() => {
    //console.log(projectListData);
  }, [projectListData, localStats]);

  const [selectedIds, setSelectedIds] = useState([]);

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

  const handleSelectItem = (itemId) => {
    setSelectedIds((prevIds) => {
      if (prevIds.includes(itemId)) {
        return prevIds.filter((id) => id !== itemId);
      } else {
        return [...prevIds, itemId];
      }
    });
  };
  // console.log(localStats);
  return (
    <div className="sm:ml-16 flex flex-col lg:h-screen">
      <div>
        <div className="flex sm:p-5 lg:flex-row flex-col">
          <div className="dashboard-header-card-text3 flex justify-center items-center lg:me-20">
            Overview
          </div>
          <div className="flex flex-row items-center justify-between w-full lg:w-fit">
            <div className="sm:flex justify-center items-center w-full ">
              <div className="dashboard-header-card ">
                {localStats && (
                  <div className="dashboard-header-card-text1">
                    {localStats[0]?.count || 0}
                  </div>
                )}
                <div className="dashboard-header-card-text2">
                  Incoming Projects
                </div>
              </div>
              <div className="dashboard-header-card ">
                {localStats && (
                  <div className="dashboard-header-card-text1">
                    {localStats[1]?.count || 0}
                  </div>
                )}
                <div className="dashboard-header-card-text2">
                  Ongoing Projects
                </div>
              </div>
            </div>
            <div className="sm:flex justify-center items-center w-full">
              <div className="dashboard-header-card ">
                {localStats && (
                  <div className="dashboard-header-card-text1">
                    {localStats[2]?.count || 0}
                  </div>
                )}
                <div className="dashboard-header-card-text2">
                  Initial Reviews
                </div>
              </div>
              <div className="dashboard-header-card ">
                {localStats && (
                  <div className="dashboard-header-card-text1">
                    {localStats[3]?.count || 0}
                  </div>
                )}
                <div className="dashboard-header-card-text2">Final Reviews</div>
              </div>
            </div>
          </div>
        </div>

        <div>
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
        </div>
      </div>

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
          style={{
            position: "-webkit-sticky",
                position: "sticky",
              transform: "translateZ(0)",
            position:"-webkit-sticky",
            top: 0,
            zIndex: 11,
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
            zIndex: 11,
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
            // className="opacity-0"
          >
            <div className="border">
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
              <div className="editor-project-table-text-3">Talent Footage</div>
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
        <div style={{ zIndex: "8", position: "relative" }}>
          <ProjectTable
            sort={sort}
            type={"Video Editing"}
            client={client}
            page={"dashboard"}
            color={"#FFF"}
            data={filteredProjects.filtered}
            fullData={projectListData}
            filter={null}
            setIsLoading={setIsLoading}
            isLoading={isLoading}
            setChangeStatusCheck={setChangeStatusCheck}
            setAddProject={setAddProject}
            setUpdateProject={setUpdateProject}
            handleSelectItem={handleSelectItem}
            selectedIds={selectedIds}
            setSelectedIds={setSelectedIds}
            editorList={editorList}
            clientList={clientList}
            companyList={companyList}
            setProjectListData={setProjectListData}
            setOrderList={setOrderList}
            fullOrderList={orderList}
            orderList={filteredProjects.newOrderList}
            setSort={setSort}
            projectFilter={project}
            renderProject={renderProject}
            setRenderProject={setRenderProject}
          />
        </div>
        <div style={{ zIndex: "7", position: "relative" }}>
          <ProjectTable
            sort={sort}
            type={"Other Projects"}
            client={client}
            page={"dashboard"}
            color={"#FFF"}
            data={filteredProjects.filtered}
            fullData={projectListData}
            filter={null}
            setIsLoading={setIsLoading}
            isLoading={isLoading}
            setChangeStatusCheck={setChangeStatusCheck}
            setAddProject={setAddProject}
            setUpdateProject={setUpdateProject}
            handleSelectItem={handleSelectItem}
            selectedIds={selectedIds}
            setSelectedIds={setSelectedIds}
            editorList={editorList}
            clientList={clientList}
            companyList={companyList}
            setProjectListData={setProjectListData}
            setOrderList={setOrderList}
            fullOrderList={orderList}
            orderList={filteredProjects.newOrderList}
            setSort={setSort}
            projectFilter={project}
            renderProject={renderProject}
            setRenderProject={setRenderProject}
          />
        </div>
      </div>

      {/* </div> */}
    </div>
  );
}

export default Dashboard;
