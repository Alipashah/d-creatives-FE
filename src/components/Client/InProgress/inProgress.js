import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getProject } from "../../../store/getProjectSlice";
import project01 from "../../../assets/images/project-01.svg";
import project02 from "../../../assets/images/project-02.svg";
import project03 from "../../../assets/images/project-03.svg";
import { useNavigate } from "react-router-dom";
import { socket } from "../../../App";

function InProgress(props) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const role = localStorage.getItem("role");
  const token = localStorage.getItem("token");
  const email = localStorage.getItem("email");
  let companyIdLocal = localStorage.getItem("clientCompany");
  const [companyId, setCompanyId] = useState(companyIdLocal);
  const projectListJSON = localStorage.getItem("clientProjectList");
  const localData = projectListJSON ? JSON.parse(projectListJSON) : null;
  const [projectListData, setProjectListData] = useState(localData || []);

  const { data: projectList, status: projectStatus } = useSelector(
    (state) => state.getProject
  );

  useEffect(() => {
    //console.log({ socket });
    socket.on("project-add", (res) => {
      localStorage.setItem("clientProjectList", JSON.stringify(res?.project));
      setProjectListData(res?.project);
    });
    socket.on("company-id", (res) => {
      //console.log(res);
      if (res?.company !== companyId && res?.email === email) {
        //console.log(res);
        localStorage.setItem("clientCompany", res?.company);
        setCompanyId(res?.company);
      }
    });
    socket.on("company-delete", (res) => {
      //console.log(res);
      if (res?.user?.length > 0) {
        const emailExists = res?.user?.some(
          (item) => item?.user_email === email
        );
        if (emailExists) {
          localStorage.setItem("clientCompany", null);
          setCompanyId(null);
        }
      }
    });
  }, [socket]);

  useEffect(() => {
    dispatch(getProject({ token: token }))
      .unwrap()
      .then((res) => {
        if (res?.status) {
          localStorage.setItem("clientProjectList", JSON.stringify(res.data));
          setProjectListData(res.data);
        } else {
          // localStorage.setItem("clientProjectList", JSON.stringify(res?.data));
          // setProjectListData(res?.data);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  const filteredProjects = useMemo(() => {
    if (companyId) {
      let filtered = [...projectListData];
      filtered = filtered.filter(
        (item) => item.completed === false && !item.hide
      );
      if (companyId) {
        filtered = filtered?.filter(
          (project) => project?.company?.id === parseInt(companyId)
        );
      }
      // Apply search filter
      if (props.search) {
        let search = props.search;
        const normalizedSearch = search.toLowerCase();
        filtered = filtered.filter((project) =>
          project.projectName.toLowerCase().includes(normalizedSearch)
        );
      }

      return filtered;
    }
  }, [projectListData, props.search, companyId]);

  const ProjectList = (data) => {
    return (
      <>
        {data
          ?.filter((item) => item.hide === false)
          .map((project, index) => (
            <div
              className="mb-8 bg-card grid grid-cols-12 lg:divide-x p-1"
              key={index}
            >
              <div className="lg:col-span-9 col-span-12 md:m-8 sm:m-4 m-2">
                <div className="project-card-heading">
                  {project.projectName}
                </div>

                <div className="pt-2">
                  {project.projectType === "Video Editing" ? (
                    <ProgressStepper
                      progress={project.clientEditingStatuses}
                      projectStart={project.createdDate}
                      projectComplete={project.completionDate}
                    />
                  ) : (
                    <ProgressStepper
                      progress={project.clientOtherStatuses}
                      projectStart={project.createdDate}
                      projectComplete={project.completionDate}
                    />
                  )}
                </div>
              </div>

              <div className="flex lg:justify-between justify-center lg:col-span-3 col-span-12 p-1">
                <a
                  className="flex flex-col justify-center items-center lg:p-0 p-1 lg:m-0 m-1"
                  target="_blank"
                  href={project.talentFootageLink}
                >
                  <img src={project03} alt="logo-1" className="w-5" />
                  <div
                    style={{
                      color: "rgba(142, 142, 142, 1)",
                      fontSize: "10px",
                    }}
                  >
                    Raw Files
                  </div>
                </a>

                <a
                  className="flex flex-col justify-center items-center lg:p-0 p-1 lg:m-0 m-1"
                  target="_blank"
                  href={project.briefLink}
                >
                  <img src={project01} alt="logo-1" className="w-5 " />
                  <div
                    style={{
                      color: "rgba(142, 142, 142, 1)",
                      fontSize: "10px",
                    }}
                  >
                    Brief Link
                  </div>
                </a>

                <a
                  className="flex flex-col justify-center items-center lg:p-0 p-1 lg:m-0 m-1"
                  target="_blank"
                  href={project.finalFolder}
                >
                  <img src={project03} alt="logo-1" className="w-5 " />
                  <div
                    style={{
                      color: "rgba(142, 142, 142, 1)",
                      fontSize: "10px",
                    }}
                  >
                    Final Video
                  </div>
                </a>
              </div>
            </div>
          ))}
      </>
    );
  };

  const ProgressStepper = ({ progress, projectStart, projectComplete }) => {
    return (
      <ol className="flex sm:flex-row flex-col sm:items-center w-full p-0">
        {progress.map((step, index) => (
          <div
            key={index}
            className="flex-1 sm:p-0 p-2"
            style={{ height: "40px" }}
          >
            {index === progress.length - 1 && step.status ? (
              <>
                <li>
                  <div className="flex items-center w-full">
                    <span className="flex items-center justify-center w-2 h-2 project-status-done rounded-full lg:h-4 lg:w-4  shrink-0">
                      <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z"></path>
                      <path
                        fill-rule="evenodd"
                        d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm9.707 5.707a1 1 0 00-1.414-1.414L9 12.586l-1.293-1.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clip-rule="evenodd"
                      ></path>
                    </span>
                  </div>
                  <div className="project-progress-name">Completed</div>
                  <div className="project-progress-date">{projectComplete}</div>
                </li>
              </>
            ) : index === progress.length - 1 && !step.status ? (
              <>
                <li>
                  <div className="flex items-center w-full">
                    <span className="flex items-center justify-center w-2 h-2 project-status-Inprogress rounded-full lg:h-4 lg:w-4  shrink-0">
                      <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z"></path>
                      <path
                        fill-rule="evenodd"
                        d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm9.707 5.707a1 1 0 00-1.414-1.414L9 12.586l-1.293-1.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clip-rule="evenodd"
                      ></path>
                    </span>
                  </div>
                  <div className="project-progress-name">Completed</div>
                  <div className="project-progress-date">{projectComplete}</div>
                </li>
              </>
            ) : !step.status && index === 0 ? (
              <>
                <li>
                  <div className="flex w-full items-center  project-status-Inprogress-1">
                    <span className="flex items-center justify-center w-2 h-2 project-status-done rounded-full lg:h-4 lg:w-4  shrink-0">
                      <path
                        fill-rule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clip-rule="evenodd"
                      ></path>
                    </span>
                  </div>
                  <div className="project-progress-name">Project Start</div>
                  <div className="project-progress-date">{projectStart}</div>
                </li>
              </>
            ) : step.status && index === 0 ? (
              //&& progress[index + 1].status
              <>
                <li>
                  <div className="flex w-full items-center after:content-[''] after:w-full after:h-1 after:border-b after:border-blue-300 after:border-4 after:inline-block dark:after:border-blue-800 project-status-done-1">
                    <span className="flex items-center justify-center w-2 h-2 project-status-done rounded-full lg:h-4 lg:w-4  shrink-0">
                      <path
                        fill-rule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clip-rule="evenodd"
                      ></path>
                    </span>
                  </div>
                  <div className="project-progress-name">Project Start</div>
                  <div className="project-progress-date">{projectStart}</div>
                </li>
              </>
            ) : // : step.status && index === 0 && !progress[index + 1].status ? (
            //   <>
            //     <li>
            //       <div className="flex w-full items-center  project-status-Inprogress-1">
            //         <span className="flex items-center justify-center w-2 h-2 project-status-done rounded-full lg:h-4 lg:w-4  shrink-0">
            //           <path
            //             fill-rule="evenodd"
            //             d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
            //             clip-rule="evenodd"
            //           ></path>
            //         </span>
            //       </div>
            //       <div className="project-progress-name">Project Start</div>
            //       <div className="project-progress-date">{projectStart}</div>
            //     </li>
            //   </>
            // ) : step.status && !progress[index + 1].status ? (
            //   <>
            //     <li>
            //       <div className="flex w-full items-center  project-status-Inprogress-1">
            //         <span className="flex items-center justify-center w-2 h-2 project-status-done rounded-full lg:h-4 lg:w-4  shrink-0">
            //           <path
            //             fill-rule="evenodd"
            //             d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
            //             clip-rule="evenodd"
            //           ></path>
            //         </span>
            //       </div>
            //       <div className="project-progress-name">{step.name}</div>
            //       <div className="project-progress-date">{step.endDate}</div>
            //     </li>
            //   </>
            // )
            step.status ? (
              //&& progress[index + 1].status
              <>
                <li>
                  <div className="flex w-full items-center after:content-[''] after:w-full after:h-1 after:border-b after:border-blue-300 after:border-4 after:inline-block dark:after:border-blue-800 project-status-done-1">
                    <span className="flex items-center justify-center w-2 h-2 project-status-done rounded-full lg:h-4 lg:w-4  shrink-0">
                      <path
                        fill-rule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clip-rule="evenodd"
                      ></path>
                    </span>
                  </div>
                  <div className="project-progress-name">{step.name}</div>
                  <div className="project-progress-date">
                    {step.endDate || step.startDate}
                  </div>
                </li>
              </>
            ) : !step.status ? (
              <>
                <li>
                  <div className="flex w-full items-center  project-status-Inprogress-1">
                    <span className="flex items-center justify-center w-2 h-2 project-status-Inprogress rounded-full lg:h-4 lg:w-4  shrink-0">
                      <path
                        fill-rule="evenodd"
                        d="M10 2a1 1 0 00-1 1v1a1 1 0 002 0V3a1 1 0 00-1-1zM4 4h3a3 3 0 006 0h3a2 2 0 012 2v9a2 2 0 01-2 2H4a2 2 0 01-2-2V6a2 2 0 012-2zm2.5 7a1.5 1.5 0 100-3 1.5 1.5 0 000 3zm2.45 4a2.5 2.5 0 10-4.9 0h4.9zM12 9a1 1 0 100 2h3a1 1 0 100-2h-3zm-1 4a1 1 0 011-1h2a1 1 0 110 2h-2a1 1 0 01-1-1z"
                        clip-rule="evenodd"
                      ></path>
                    </span>
                  </div>
                  <div className="project-progress-name">{step.name}</div>
                  {/* <div className="project-progress-date">{step.startDate}</div> */}
                </li>
              </>
            ) : (
              ""
            )}
          </div>
        ))}
      </ol>
    );
  };

  return (
    <div>
      <div className="sm:p-8 p-4 sm:ml-64 mt-16">
        <div className="dashboard-heading-02 mb-2">
          <span
            className="cursor-pointer"
            onClick={() => {
              navigate("/client");
            }}
          >
            Dashboard .
          </span>{" "}
          In Progress
        </div>
        <div className="dashboard-heading mb-5">In Progress</div>

        {projectStatus === "loading" && localData === null ? (
          <div className="flex justify-center p-5">
            <svg
              aria-hidden="true"
              role="status"
              className="inline w-4 h-4 mr-3 text-gray-200 animate-spin dark:text-gray-600"
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
        ) : (
          <>
            {filteredProjects?.length > 0 ? (
              <>{ProjectList(filteredProjects)}</>
            ) : (
              <div className={`flex justify-center sidebar-heading-2 p-2`}>
                No Data Found
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default InProgress;
