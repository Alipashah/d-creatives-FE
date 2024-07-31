import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getProject } from "../../../store/getProjectSlice";
import Header from "../../Internal/ProjectManagment/header";
import ProjectTable from "../../Internal/ProjectTable/projectTable";
import Logout from "../../Logout/logout";

function Final() {
  const dispatch = useDispatch();
  const role = localStorage.getItem("role");
  const token = localStorage.getItem("token");
  const [client, setClient] = useState();
  const [search, setSearch] = useState();
  const [isLoading, setIsLoading] = useState(true);

  const { data: projectList, status: projectStatus } = useSelector(
    (state) => state.getProject
  );
  useEffect(() => {
    if (search) dispatch(getProject({ token: token, name: search }));
    else dispatch(getProject({ token: token }));
  }, [client, search]);

  return (
    <div className="sm:ml-16">
      <div className="sidebar-heading m-4">Final Review</div>
      <div>
        <Header setClient={setClient} setSearch={setSearch} />
      </div>
      <div className="mt-5">
        <ProjectTable
          filter={"Final Review"}
          color={"#FDBCE3"}
          data={projectList?.data}
          setIsLoading={setIsLoading}
          isLoading={isLoading}
        />{" "}
      </div>
      {/* <div className="mt-3">
        <Logout />
      </div> */}
    </div>
  );
}

export default Final;
