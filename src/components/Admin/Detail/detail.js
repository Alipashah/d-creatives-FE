import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getEditorProject } from "../../../store/getEditorProjectSlice";
import { getClientProject } from "../../../store/getClientProjectSlice";
import { hideProject } from "../../../store/hideProjectSlice";
import Swal from "sweetalert2";
import icon from "../../../assets/images/down-arrow-logo.svg";
import { socket } from "../../../App";

function Detail(props) {
  const dispatch = useDispatch();
  const id = localStorage.getItem("id");
  const token = localStorage.getItem("token");
  const projectListJSON = localStorage.getItem("projectList");
  const localData = projectListJSON ? JSON.parse(projectListJSON) : null;
  const [projectList, setProjectList] = useState(localData || []);
  const [isHideClick, setIsHideClick] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  let data = projectList.filter((project) => {
    return project?.company?.users?.some((user) => user.id === props.id);
  });
  let data1 = projectList.filter((project) =>
    project?.projectEditors?.some((editor) => editor?.id === parseInt(props.id))
  );

  function handleActive(id, hide) {
    setIsHideClick(false);
    const updatedProjects = projectList.map((project) => {
      if (project.id === id) {
        return { ...project, hide: !project.hide };
      }
      return project;
    });

    setProjectList(updatedProjects);
    localStorage.setItem("projectList", JSON.stringify(updatedProjects));

    dispatch(hideProject({ token: token, data: { projectId: id, hide: hide } }))
      .unwrap()
      .then((res) => {
        if (res?.status) {
          setIsHideClick(true);
          socket.emit("project-list", { message: "update-project-data" });
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

  const Table = ({ data }) => {
    return (
      <div className="relative overflow-x-auto" style={{ maxHeight: "400px" }}>
        <table className="w-full text-left dashboard-table-text">
          <thead className="text-xs border-b uppercase bg-gray-50 sticky top-0">
            <tr>
              <th scope="col" className="px-2 py-3 text-xs min-w-[100px]">
                BRIEF #
              </th>
              <th scope="col" className="px-2 py-3 text-xs min-w-[100px]">
                STATUS
              </th>
              <th scope="col" className="px-2 py-3 text-xs min-w-[100px]">
                STAGE
              </th>
              <th scope="col" className="px-2 py-3 text-xs min-w-[100px]">
                COMPANY NAME
              </th>
              <th scope="col" className="px-2 py-3 text-xs min-w-[100px]">
                START DATE
              </th>
              <th scope="col" className="px-2 py-3 text-xs min-w-[100px]">
                DUE DATE
              </th>
              <th scope="col" className="px-2 py-3 text-xs min-w-[100px]">
                VISIBILITY STATUS
              </th>
            </tr>
          </thead>
          <tbody>
            {data?.map((item) => (
              <tr className="border-b">
                <th scope="row" className="px-2 py-4 text-xs min-w-[100px]">
                  {item.projectName}
                </th>
                <td className="px-2 py-4 text-xs min-w-[100px]">
                  {item.currentStatus}
                </td>
                <td className="px-2 py-4 text-xs min-w-[100px]">
                  {item.currentStage}
                </td>
                <td className="px-2 py-4 text-xs min-w-[100px]">
                  {item.company?.name}
                </td>
                <td className="px-2 py-4 text-xs min-w-[100px]">
                  {item?.createdDate}
                </td>
                <td className="px-2 py-4 text-xs min-w-[100px]">
                  {item.completionDate}
                </td>
                <td className="px-2 py-4 text-xs min-w-[100px]">
                  {item.hide ? (
                    <button
                      onClick={() => {
                        handleActive(item.id, item.hide);
                      }}
                      className="me-2 font-medium text-blue-600 dark:text-blue-500 hover:underline"
                    >
                      Hide
                    </button>
                  ) : (
                    <button
                      onClick={() => {
                        handleActive(item.id, item.hide);
                      }}
                      className="me-2 font-medium text-blue-600 dark:text-blue-500 hover:underline"
                    >
                      Show
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  useEffect(() => {
    setIsLoading(false);
    if (isHideClick) {
      data = projectList.filter((project) => {
        return project?.company?.users?.some((user) => user.id === props.id);
      });
      data1 = projectList.filter((project) =>
        project?.projectEditors?.some(
          (editor) => editor?.id === parseInt(props.id)
        )
      );
    }
  }, [projectList]);
  return (
    <div className="bg-card m-4">
      <button
        className="ms-4 mt-4 font-bold"
        onClick={() => {
          props.setShowDetail(false);
        }}
      >
        <img src={icon} alt="icon" className="rotate-90" />
      </button>
      <div className="dashboard-main-heading p-5">All Projects</div>
      {isLoading ? (
        <div
          className="w-full flex items-center justify-center p-5"
          style={{ maxHeight: "400px" }}
        >
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
          {(data && data?.length > 0 && props.type === "Client") ||
          (data1 && data1?.length > 0 && props.type === "Editor") ? (
            <Table data={props.type === "Editor" ? data1 : data} />
          ) : (
            <div
              className="flex items-center justify-center sidebar-heading-2 p-5"
              style={{ maxHeight: "400px" }}
            >
              No Projects Found
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default Detail;
