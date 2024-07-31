import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getClient } from "../../../store/getClientSlice";
import { getEditor } from "../../../store/getEditorSlice";
import { STATUSES as CLIENTSTATUS } from "../../../store/getClientSlice";
import Project from "../Project/project";
import sortBy from "../../../assets/images/sortBy.svg";
import { Listbox, Transition } from "@headlessui/react";
import Delete from "../../Delete/delete";
import arrowIcon from "../../../assets/images/down-arrow-logo.svg";

function Header(props) {
  const dispatch = useDispatch();
  const role = localStorage.getItem("role");
  const [brand, setBrand] = useState("");
  const [sort, setSort] = useState("");
  const token = localStorage.getItem("token");
  const { data: clientList, status: clientStatus } = useSelector(
    (state) => state.getClient
  );

  useEffect(() => {
    dispatch(getClient({ token: token }));
  }, []);
  // const handleSelectClient = (event) => {
  //   const selectedOption = event.target.value;
  //   setBrand(selectedOption);
  //   props.setClient(selectedOption);
  // };
  // const handleSelectProject = (event) => {
  //   const selectedOption = event.target.value;
  //   props.setProject(selectedOption);
  // };
  const handleSelectSort = (event) => {
    const selectedOption = event;
    setSort(selectedOption);
    props.setSort(selectedOption);
  };
  return (
    <div className="ps-6 p-3 border-b">
      {role === "admin" ? (
        <div className="sidebar-heading mb-3">My Dashboard</div>
      ) : (
        <div className="sidebar-heading mb-3">My Dashboard</div>
      )}
      <div className="md:flex items-center justify-between">
        <div className="flex ">
          <div
            className={`text-center w-28 ${
              props.project === "All Projects" ? "toggler" : "toggler3"
            } ps-2 pe-2`}
            onClick={() => {
              props.setProject("All Projects");
            }}
          >
            All Projects
          </div>
          <div
            className={`text-center ${
              props.project === "My Projects" ? "toggler1" : "toggler2"
            } ps-2 pe-2`}
            onClick={() => {
              props.setProject("My Projects");
            }}
          >
            My Projects
          </div>

          <div className="md:hidden flex items-start ms-3">
            <Project
              setAddProject={props.setAddProject}
              editorList={props.editorList}
              clientList={props.clientList}
              renderProject={props.renderProject}
              setRenderProject={props.setRenderProject}
            />

            <Listbox value={sort} onChange={handleSelectSort}>
              <Listbox.Button
                className="hover:bg-gray-100 rounded flex justify-center items-center"
                style={{ marginRight: "10px" }}
              >
                <img src={sortBy} alt="icon" />
              </Listbox.Button>
              <Transition
                enter="transition duration-100 ease-out"
                enterFrom="transform scale-95 opacity-0"
                enterTo="transform scale-100 opacity-100"
                leave="transition duration-75 ease-out"
                leaveFrom="transform scale-100 opacity-100"
                leaveTo="transform scale-95 opacity-0"
                className="absolute z-20 mt-6 sm:ms-5 sm:ml-0 ml-[-38px] bg-white rounded-lg shadow cursor-pointer whitespace-nowrap"
              >
                <Listbox.Options>
                  <Listbox.Option
                    value=""
                    className="font-bold flex hover:bg-slate-300 ps-2 pe-2 mt-2"
                    style={{ fontSize: "12px" }}
                  >
                    Sort by <img src={arrowIcon} alt="icon" />
                  </Listbox.Option>
                  <Listbox.Option
                    className="hover:bg-slate-300 ps-2 pe-2"
                    value="Company"
                    style={{ fontSize: "12px" }}
                  >
                    Company
                  </Listbox.Option>
                  <Listbox.Option
                    className="hover:bg-slate-300 ps-2 pe-2"
                    value="Name"
                    style={{ fontSize: "12px" }}
                  >
                    Project Name
                  </Listbox.Option>
                  <Listbox.Option
                    className="hover:bg-slate-300 ps-2 pe-2"
                    value="Date Created"
                    style={{ fontSize: "12px" }}
                  >
                    Date Created
                  </Listbox.Option>
                  <Listbox.Option
                    className="hover:bg-slate-300 ps-2 pe-2"
                    value="Deadline"
                    style={{ fontSize: "12px" }}
                  >
                    Deadline
                  </Listbox.Option>
                </Listbox.Options>
              </Transition>
            </Listbox>
          </div>
        </div>

        <div className="flex">
          <div className="md:flex hidden">
            {props.selectedIds.length > 0 && (
              <Delete
                selectedIds={props.selectedIds}
                setAddProject={props.setAddProject}
                setSelectedIds={props.setSelectedIds}
                data={props.data}
                setData={props.setData}
                orderList={props.orderList}
                setOrderList={props.setOrderList}
                renderProject={props.renderProject}
                setRenderProject={props.setRenderProject}
              />
            )}

            <Project
              setAddProject={props.setAddProject}
              editorList={props.editorList}
              clientList={props.clientList}
              renderProject={props.renderProject}
              setRenderProject={props.setRenderProject}
            />

            <Listbox value={sort} onChange={handleSelectSort}>
              <Listbox.Button
                className="hover:bg-gray-100 rounded flex justify-center items-center"
                style={{ marginRight: "10px" }}
              >
                <img src={sortBy} alt="icon" />
              </Listbox.Button>
              <Transition
                enter="transition duration-100 ease-out"
                enterFrom="transform scale-95 opacity-0"
                enterTo="transform scale-100 opacity-100"
                leave="transition duration-75 ease-out"
                leaveFrom="transform scale-100 opacity-100"
                leaveTo="transform scale-95 opacity-0"
                className="absolute z-20 mt-6 sm:ms-5  bg-white rounded-lg shadow cursor-pointer"
              >
                <Listbox.Options>
                  <Listbox.Option
                    value=""
                    className="font-bold flex hover:bg-slate-300 ps-2 pe-2 mt-2"
                    style={{ fontSize: "12px" }}
                  >
                    Sort by <img src={arrowIcon} alt="icon" />
                  </Listbox.Option>
                  <Listbox.Option
                    className="hover:bg-slate-300 ps-2 pe-2"
                    value="Company"
                    style={{ fontSize: "12px" }}
                  >
                    Company
                  </Listbox.Option>
                  <Listbox.Option
                    className="hover:bg-slate-300 ps-2 pe-2"
                    value="Name"
                    style={{ fontSize: "12px" }}
                  >
                    Project Name
                  </Listbox.Option>
                  <Listbox.Option
                    className="hover:bg-slate-300 ps-2 pe-2"
                    value="Date Created"
                    style={{ fontSize: "12px" }}
                  >
                    Date Created
                  </Listbox.Option>
                  <Listbox.Option
                    className="hover:bg-slate-300 ps-2 pe-2"
                    value="Deadline"
                    style={{ fontSize: "12px" }}
                  >
                    Deadline
                  </Listbox.Option>
                </Listbox.Options>
              </Transition>
            </Listbox>
          </div>
          <div className="flex md:mt-0 mt-4">
            <label for="table-search" className="sr-only">
              Search
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <svg
                  className="w-3 h-3 text-gray-500 dark:text-gray-400"
                  aria-hidden="true"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fill-rule="evenodd"
                    d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                    clip-rule="evenodd"
                  ></path>
                </svg>
              </div>
              <input
                type="text"
                id="table-search"
                style={{ borderRadius: "30px" }}
                className="block p-0 pl-7 text-sm text-gray-900 border border-gray-300 w-52 bg-none "
                placeholder="Search..."
                onChange={(e) => {
                  props.setSearch(e.target.value);
                }}
              />
            </div>
            <div className="md:hidden ms-2">
              {props.selectedIds.length > 0 && (
                <Delete
                  selectedIds={props.selectedIds}
                  setAddProject={props.setAddProject}
                  setSelectedIds={props.setSelectedIds}
                  data={props.data}
                  setData={props.setData}
                  orderList={props.orderList}
                  setOrderList={props.setOrderList}
                  renderProject={props.renderProject}
                  setRenderProject={props.setRenderProject}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Header;
