import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { socket } from "../../../App";
import { getProject } from "../../../store/getProjectSlice";
import { getStatsClient } from "../../../store/getStatsClientSlice";

function Dashboard(props) {
  const dispatch = useDispatch();
  const role = localStorage.getItem("role");
  const token = localStorage.getItem("token");
  const name = localStorage.getItem("name");
  const email = localStorage.getItem("email");
  let companyIdLocal = localStorage.getItem("clientCompany");
  const [companyId, setCompanyId] = useState(companyIdLocal);
  const projectListJSON = localStorage.getItem("clientProjectList");
  const localData = projectListJSON ? JSON.parse(projectListJSON) : null;
  const clientStatsJSON = localStorage.getItem("clientStats");
  let localStats = clientStatsJSON ? JSON.parse(clientStatsJSON) : null;
  const [projectListData, setProjectListData] = useState(localData || []);

  const { data: projectList, status: projectStatus } = useSelector(
    (state) => state.getProject
  );
  const { data: statsClient, status: statsClientStatus } = useSelector(
    (state) => state.getStatsClient
  );
  const [stats, setStats] = useState(localStats);

  useEffect(() => {
    //console.log({ socket });
    socket.on("project-add", (res) => {
      //console.log(res);
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
    dispatch(getStatsClient({ token: token }))
      .unwrap()
      .then((res) => {
        if (res?.status) {
          localStorage.setItem("clientStats", JSON.stringify(res?.data));
          setStats(res?.data);
        } else {
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }, [companyId, projectListData]);

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

  const Table = ({ data }) => {
    return (
      <div className="relative overflow-x-auto" style={{ maxHeight: "250px" }}>
        <table className="w-full text-left dashboard-table-text">
          <thead className="border-b uppercase sticky top-0 bg-white">
            <tr>
              <th
                scope="col"
                className="px-6 py-3 sm:text-sm text-xs text-black"
              >
                BRIEF #
              </th>
              <th scope="col" className="px-6 py-3 sm:text-sm text-xs">
                STATUS
              </th>
              <th scope="col" className="px-6 py-3 sm:text-sm text-xs">
                COMPANY Name
              </th>
              <th scope="col" className="px-6 py-3 sm:text-sm text-xs">
                PRIORITY
              </th>
              <th scope="col" className="px-6 py-3 sm:text-sm text-xs">
                UPDATED
              </th>
              <th scope="col" className="px-6 py-3 sm:text-sm text-xs">
                DUE DATE
              </th>
            </tr>
          </thead>
          <tbody>
            {data
              ?.filter((item) => item?.hide === false)
              .map((item) => (
                <tr className="border-b">
                  <th
                    scope="row"
                    className="px-6 py-4 sm:text-sm text-xs text-black"
                  >
                    {item?.projectName}
                  </th>
                  <td className="px-6 py-4 sm:text-sm text-xs">
                    {item?.currentStatus}
                  </td>
                  <td className="px-6 py-4 sm:text-sm text-xs">
                    {item?.company?.name}
                  </td>
                  <td className="px-6 py-4 sm:text-sm text-xs">
                    {item?.priority.toUpperCase()}
                  </td>
                  <td className="px-6 py-4 sm:text-sm text-xs">
                    {item?.createdDate}
                  </td>
                  <td className="px-6 py-4 sm:text-sm text-xs">
                    {item?.completionDate}
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    );
  };

  return (
    <div>
      <div className="p-4 sm:ml-64 mt-16">
        <div className="md:p-4">
          <div className="dashboard-heading-02">Dashboard</div>
          <div className="dashboard-heading">Welcome, {name || "Client"}</div>
        </div>

        <div className=" md:pe-5">
          {stats && (
            <div className="grid grid-cols-12 md:gap-3 pb-5">
              <div className="md:col-span-3 col-span-12 bg-card p-5 mb-2">
                <div className="dashboard-heading-02">In Progress</div>
                <div className="dashboard-heading">
                  {stats[3]?.count || (localStats && localStats[3]?.count) || 0}
                </div>
              </div>
              <div className="md:col-span-3 col-span-12 bg-card p-5 mb-2">
                <div className="dashboard-heading-02">Running Projects</div>
                <div className="dashboard-heading">
                  {stats[2]?.count || (localStats && localStats[2]?.count) || 0}
                </div>
              </div>
              <div className="md:col-span-3 col-span-12 bg-card p-5 mb-2">
                <div className="dashboard-heading-02">Completed</div>
                <div className="dashboard-heading">
                  {stats[0]?.count || (localStats && localStats[0]?.count) || 0}
                </div>
              </div>
              <div className="md:col-span-3 col-span-12 bg-card p-5 mb-2">
                <div className="dashboard-heading-02">Delivered</div>
                <div className="dashboard-heading">
                  {stats[1]?.count || (localStats && localStats[1]?.count) || 0}
                </div>
              </div>
            </div>
          )}

          <div className="bg-card">
            <div className="dashboard-main-heading p-5">All Projects</div>
            {projectStatus === "loading" && localData === null ? (
              <div
                className="flex justify-center items-center"
                style={{ height: "200px" }}
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
                {filteredProjects?.length > 0 ? (
                  <Table data={filteredProjects} />
                ) : (
                  <div
                    className={`flex justify-center items-center sidebar-heading-2`}
                    style={{ height: "200px" }}
                  >
                    No Data Found
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
