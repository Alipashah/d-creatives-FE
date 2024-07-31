import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getClient } from "../../../store/getClientSlice";
import { getEditor } from "../../../store/getEditorSlice";
import { STATUSES as CLIENTSTATUS } from "../../../store/getClientSlice";
import Project from "../Project/project";
import Swal from "sweetalert2";
import { Listbox, Transition } from "@headlessui/react";
import Delete from "../../Delete/delete";
import arrowIcon from "../../../assets/images/down-arrow-logo.svg";
import sortBy from "../../../assets/images/sortBy.svg";
import { getCompany } from "../../../store/getCompanySlice";
import AddCompanyModal from "../../AddCompanyModal/addCompanyModal";
import deleteIcon from "../../../assets/images/delete-icon.png";
import { deleteCompany } from "../../../store/deleteCompanySlice";
import { socket } from "../../../App";
function Header(props) {
  const dispatch = useDispatch();
  const role = localStorage.getItem("role");
  const [sort, setSort] = useState("");
  const [company, setCompany] = useState("All Company");
  const token = localStorage.getItem("token");
  const localCompanyJSON = localStorage.getItem("companyList");
  const localCompanyList = localCompanyJSON
    ? JSON.parse(localCompanyJSON)
    : null;
  const [companyList, setCompanyList] = useState(localCompanyList || []);

  useEffect(() => {
    socket.on("company-data", (res) => {
      localStorage.setItem("companyList", JSON.stringify(res?.company));
    });
  }, [socket]);

  useEffect(() => {
    dispatch(getCompany({ token: token }))
      .unwrap()
      .then((res) => {
        if (res?.status) {
          setCompanyList(res?.data);
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

  const handleSelectCompany = (event) => {
    const selectedOption = event.name;
    if (event === "All Company") {
      setCompany(event);
      props.setClient("");
    } else {
      setCompany(selectedOption);
      props.setClient(event.id);
    }
  };

  const handleSelectSort = (event) => {
    const selectedOption = event;
    setSort(selectedOption);
    props.setSort(selectedOption);
  };
  function handleDelete(item) {
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
        const updatedItems = companyList.filter(
          (item1) => item1.id !== item.id
        );
        localStorage.setItem("companyList", JSON.stringify(updatedItems));
        setCompanyList(updatedItems);
        const updatedProjects = props.data?.map((item1) => {
          if (parseInt(item1.company?.id) === parseInt(item.id)) {
            return { ...item1, company: null }; // Set company to an empty array
          }

          return item1; // Keep the item unchanged if the condition is not met
        });

        localStorage.setItem("projectList", JSON.stringify(updatedProjects));
        props.setData(updatedProjects);
        dispatch(deleteCompany({ token: token, id: item.id }));
        // .unwrap()
        // .then((res) => {
        //   if (res.status) {
        //     socket.emit("company-change", { email: item.email });
        //   }
        // })
        // .catch((err) => {
        //   console.log(err);
        // });
      }
    });
  }

  return (
    <div className="sm:flex items-center justify-between ps-6 p-3 border-b">
      <div className="flex">
        <div className="flex justify-center items-center">
          {props.project === "Video Editing" && (
            <div>
              <Listbox value={props?.client}>
                <Listbox.Button
                  className={`cursor-pointer flex justify-center whitespace-nowrap w-28 ${
                    props.project === "Video Editing" ? "toggler4" : "toggler5"
                  }`}
                  onClick={() => {
                    props.setProject("Video Editing");

                    const localCompanyJSON1 =
                      localStorage.getItem("companyList");
                    const localCompanyList1 = localCompanyJSON1
                      ? JSON.parse(localCompanyJSON1)
                      : null;
                    setCompanyList(localCompanyList1 || []);
                  }}
                >
                  {company.length > 11
                    ? company.substring(0, 11) + "..."
                    : company}
                </Listbox.Button>

                <Listbox.Options
                  className={`absolute z-40 bg-black text-white rounded-lg shadow cursor-pointer `}
                  style={{
                    maxeight: "8rem",
                    fontSize: "14px",
                  }}
                >
                  <Listbox.Option
                    className="hover:bg-blue-900 ps-2 pe-2"
                    value="All Company"
                    selected
                    onClick={() => handleSelectCompany("All Company")}
                  >
                    All Company
                  </Listbox.Option>
                  {companyList
                    ?.slice() // Create a shallow copy to avoid mutating the original array
                    .sort((a, b) => a.name.localeCompare(b.name))
                    .map((item, index) => (
                      <Listbox.Option
                        className="hover:bg-blue-900 ps-2 pe-2 whitespace-nowrap"
                        key={index}
                        value={item}
                      >
                        <div className="flex">
                          <div
                            className="pe-4"
                            style={{ width: "90%" }}
                            onClick={() => handleSelectCompany(item)}
                          >
                            {item?.name}
                          </div>
                          <div
                            style={{ width: "10%" }}
                            className="cursor-pointer flex justify-center items-center hover:bg-white hover:rounded-md"
                            onClick={() => handleDelete(item)}
                          >
                            <img src={deleteIcon} alt="" className="w-3 h-3" />
                          </div>
                        </div>
                      </Listbox.Option>
                    ))}
                </Listbox.Options>
              </Listbox>
            </div>
          )}
          {props.project === "Other Projects" && (
            <div
              className={`flex justify-center items-center whitespace-nowrap ${
                props.project === "Video Editing" ? "toggler4" : "toggler5"
              } ps-2 pe-2`}
              onClick={() => {
                props.setProject("Video Editing");
              }}
            >
              {company.length > 11 ? company.substring(0, 11) + "..." : company}
            </div>
          )}
          <div
            className={`flex justify-center items-center whitespace-nowrap ${
              props.project === "Other Projects" ? "toggler1" : "toggler2"
            } ps-2 pe-2`}
            onClick={() => {
              props.setProject("Other Projects");
            }}
          >
            Other Projects
          </div>
        </div>

        <div className="md:hidden flex justify-center items-center ms-1">
          <Project
            project={props.project}
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
              className="absolute z-30 mt-36 sm:ml-0 ml-[-38px] bg-white rounded-lg shadow cursor-pointer"
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
            project={props.project}
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
              className="absolute z-30 mt-8 ms-5 bg-white rounded-lg shadow cursor-pointer"
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
              style={{ borderRadius: "30px 30px 30px 30px" }}
              className="block p-0 pl-7 text-sm text-gray-900 border border-gray-300 w-52 bg-none focus:ring-blue-500 focus:border-blue-500"
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
  );
}

export default Header;
