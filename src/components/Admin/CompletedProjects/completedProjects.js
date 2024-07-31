import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Swal from "sweetalert2";
import { getProject } from "../../../store/getProjectSlice";
import { socket } from "../../../App";

function Completed() {
  const dispatch = useDispatch();
  const token = localStorage.getItem("token");
  const projectListJSON = localStorage.getItem("projectList");
  const localData = projectListJSON ? JSON.parse(projectListJSON) : null;
  const [projectList, setProjectList] = useState(localData || []);

  useEffect(() => {
    //console.log({ socket });
    socket.on("project-add", (res) => {
      //console.log(res);
      localStorage.setItem("projectList", JSON.stringify(res?.project));
      setProjectList(res?.project);
    });
  }, [socket]);

  const Table = (data, filter) => {
    return (
      <div className="overflow-y-auto max-h-[calc(100vh-100px)]">
        <table className="w-full text-left text-gray-500 dark:text-gray-400 overflow-y-auto h-50">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400 sticky top-0">
            <tr>
              <th scope="col" className="px-6 py-3 ">
                PROJECT NAME
              </th>
              <th scope="col" className="px-6 py-3 ">
                STATUS
              </th>

              <th scope="col" className="px-6 py-3 ">
                START DATE
              </th>
              <th scope="col" className="px-6 py-3 ">
                DUE DATE
              </th>
            </tr>
          </thead>

          <tbody>
            {projectList
              ?.filter(
                (item) =>
                  item.completed === true && item.currentStage === "Completed"
              )
              .map((item) => (
                <tr key={item.id} className="border-b">
                  <th scope="row" className="px-6 py-4 text-sm ">
                    {item.projectName}
                  </th>
                  <td className="px-6 py-4  text-xs">{item.currentStatus}</td>
                  <td className="px-6 py-4  text-xs">{item?.createdDate}</td>
                  <td className="px-6 py-4  text-xs">{item.completionDate}</td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    );
  };

  useEffect(() => {
    dispatch(getProject({ token: token }))
      .unwrap()
      .then((res) => {
        if (res?.status) {
          localStorage.setItem("projectList", JSON.stringify(res.data));
          localStorage.setItem(
            "projectOrder",
            JSON.stringify(res.projectOrder)
          );
          localStorage.setItem("maxId", res.maxId);
        } else {
          // localStorage.setItem("projectList", JSON.stringify(res?.data));
          // localStorage.setItem(
          //   "projectOrder",
          //   JSON.stringify(res?.projectOrder)
          // );
          // localStorage.setItem("maxId", res?.maxId);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  return (
    <div className="sm:ml-16">
      <div className="sidebar-heading sm:m-6 ms-6">Completed Projects</div>

      {localData === null ? (
        <div
          className="w-full flex items-center justify-center"
          style={{ height: "260px" }}
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
          {projectList?.filter(
            (item) =>
              item.completed === true && item.currentStage === "Completed"
          )?.length === 0 ? (
            <div
              className="w-full flex items-center justify-center"
              style={{ height: "260px" }}
            >
              <div className="sidebar-heading-2">No Projects Completed</div>
            </div>
          ) : (
            <div className="relative overflow-x-auto shadow-md sm:rounded-lg m-4">
              <Table />
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default Completed;
