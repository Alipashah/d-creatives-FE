import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Swal from "sweetalert2";
import { blockUser } from "../../../store/blockUserSlice";
import { editUser } from "../../../store/editUser";
import { getClient } from "../../../store/getClientSlice";
import AddUser from "../AddUser/addUser";
import Detail from "../Detail/detail";
import { deleteUser } from "../../../store/deleteUserSlice";
import deleteIcon from "../../../assets/images/delete-icon.png";
import { addEditor } from "../../../store/addEditorSlice";
import { socket } from "../../../App";

function Client() {
  const dispatch = useDispatch();
  const token = localStorage.getItem("token");

  const localClientJSON = localStorage.getItem("clientList");
  const localClientList = localClientJSON ? JSON.parse(localClientJSON) : null;
  const localCompanyJSON = localStorage.getItem("companyList");
  const localCompanyList = localCompanyJSON
    ? JSON.parse(localCompanyJSON)
    : null;

  const [companyList, setCompanyList] = useState(localCompanyList || []);
  const [isActiveClick, setIsActiveClick] = useState(true);
  const [clientList, setClientList] = useState(localClientList || []);
  const { data: clientList1, status: clientStatus } = useSelector(
    (state) => state.getClient
  );

  const [editedData, setEditedData] = useState(localClientList || []);

  const [showDetail, setShowDetail] = useState(false);
  const [showDetailID, setShowDetailID] = useState("");
  let activeUser = editedData?.filter(
    (item) => item.isActive === true && item.isAccepted === true
  );
  let inactiveUser = editedData?.filter(
    (item) => item.isActive === false && item.isAccepted === true
  );
  let pendingList = editedData?.filter((item) => item.isAccepted === false);

  useEffect(() => {
    if (isActiveClick) {
      //console.log("ok");
      dispatch(getClient({ token: token }))
        .unwrap()
        .then((res) => {
          if (res?.status) {
            localStorage.setItem("clientList", JSON.stringify(res.data));
            setClientList(res.data);
            setEditedData(res.data);
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
  }, [isActiveClick]);

  function handleActive(id, isActive) {
    setIsActiveClick(false);
    dispatch(blockUser({ token: token, id: id, data: { isActive: isActive } }))
      .unwrap()
      .then(() => setIsActiveClick(true))
      .catch((err) => {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Something went wrong!",
        });
      });
  }
  function handleDelete(id) {
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
        setIsActiveClick(false);
        dispatch(deleteUser({ token: token, id: id }))
          .unwrap()
          .then((res) => {
            if (res?.status) {
              Swal.fire({
                icon: "success",
                title: "User deleted successfully",
                timer: 1400,
                timerProgressBar: true,
                showConfirmButton: false,
              });
              setIsActiveClick(true);
            } else {
              Swal.fire({
                icon: "error",
                title: "Oops...",
                text: "Something went wrong!",
              });
              setIsActiveClick(true);
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
    });
  }

  const handleNameChange = (index, newName) => {
    setEditedData((prevData) =>
      prevData.map((item) =>
        item.id === index ? { ...item, name: newName } : item
      )
    );
  };
  const handleCompanyChange = (index, newCompany) => {
    setEditedData((prevData) =>
      prevData.map((item) =>
        item.id === index ? { ...item, company: newCompany } : item
      )
    );
  };
  const handleSelectCompany = (event, index) => {
    const selectedOption = event.target.value;
    let companyObject;

    companyObject = companyList.filter(
      (item) => item.id === parseInt(selectedOption)
    );
    //console.log(editedData);
    setEditedData((prevData) =>
      prevData.map((item) =>
        item.id === index ? { ...item, company: companyObject[0] } : item
      )
    );

    //if (selectedOption !== "add-new")

    //else setAddNew(selectedOption);
  };

  const handleEmailChange = (index, newEmail) => {
    setEditedData((prevData) =>
      prevData.map((item) =>
        item.id === index ? { ...item, email: newEmail } : item
      )
    );
  };

  function handleResend(email) {
    dispatch(addEditor({ token: token, data: { email: email } }))
      .unwrap()
      .then((res) => {
        if (res.status)
          Swal.fire("Successfull", "Link send to " + email, "success");
        else
          Swal.fire({
            icon: "error",
            title: "Oops...",
            text: res.message,
          });
      })
      .catch((err) => {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Something went wrong!",
        });
      });
  }

  function handleSubmit(e, item, text, index) {
    if (e.key === "Enter" || text === "blur") {
      setIsActiveClick(false);
      dispatch(
        editUser({
          token: token,
          id: item.id,
          data: {
            name: item.name,
            email: item.email,
            companyId: item.company?.id,
          },
        })
      )
        .unwrap()
        .then((res) => {
          if (res?.status) {
            socket.emit("company-change", { email: item.email });

            // Swal.fire({
            //   icon: "success",
            //   title: "User updated successfully",
            //   timer: 1400,
            //   timerProgressBar: true,
            //   showConfirmButton: false,
            // });
            // setIsActiveClick(true);
          } else {
            // Swal.fire({
            //   icon: "error",
            //   title: "Oops...",
            //   text: "Something went wrong!",
            // });
            setIsActiveClick(true);
          }
        })
        .catch((err) => {
          console.log(err);
          Swal.fire({
            icon: "error",
            title: "Oops...",
            text: "Something went wrong!",
          });
          setIsActiveClick(true);
        });
    }
  }

  useEffect(() => {
    const localCompanyJSON1 = localStorage.getItem("companyList");
    const localCompanyList1 = localCompanyJSON1
      ? JSON.parse(localCompanyJSON1)
      : null;
    setCompanyList(localCompanyList1);
  }, []);

  useEffect(() => {
    socket.on("company-data", (res) => {
      localStorage.setItem("companyList", JSON.stringify(res?.company));
    });
  }, [socket]);

  useEffect(() => {
    socket.on("user-data", (res) => {
      //console.log(res);
      if (res?.isClient) {
        localStorage.setItem("clientList", JSON.stringify(res?.user));
        setEditedData(res?.user);
        activeUser = res?.user?.filter(
          (item) => item.isActive === true && item.isAccepted === true
        );
        inactiveUser = res?.user?.filter(
          (item) => item.isActive === false && item.isAccepted === true
        );
        pendingList = res?.user?.filter((item) => item.isAccepted === false);
      }
    });
  }, [socket]);

  const Table = (data, filter, active) => {
    return (
      <div className="overflow-y-auto" style={{ maxHeight: "280px" }}>
        <table className="w-full text-left text-gray-500 dark:text-gray-400 overflow-y-auto h-50">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400 sticky top-0">
            <tr>
              <th scope="col" className="px-2 py-3">
                No.
              </th>
              <th scope="col" className="px-2 py-3 min-w-[120px]">
                NAME
              </th>
              <th scope="col" className="px-2 py-3 min-w-[120px]">
                EMAIL
              </th>

              {!active && (
                <th scope="col" className="px-2 py-3 min-w-[120px]">
                  SIGNUP STATUS
                </th>
              )}
              {!active && (
                <th scope="col" className="px-2 py-3 min-w-[120px]">
                  ACTION
                </th>
              )}
              {active && (
                <th scope="col" className="px-2 py-3 min-w-[120px]">
                  COMPANY
                </th>
              )}
              {active && (
                <th scope="col" className="px-2 py-3 min-w-[120px]">
                  Action
                </th>
              )}
              {active && (
                <th scope="col" className="px-2 py-3 min-w-[120px]">
                  STATUS
                </th>
              )}
              <th scope="col" className="px-2 py-3 min-w-[120px]">
                Delete
              </th>
            </tr>
          </thead>

          <tbody>
            {data
              ?.filter(
                (item) => item.isActive === filter && item.isAccepted === active
              )
              .map((item, index) => (
                <tr
                  key={item.id}
                  className="bg-white border-b dark:bg-gray-800 dark:border-gray-700"
                >
                  <td className="px-2 py-4 text-xs">{index + 1}</td>
                  <td className="px-2 py-4 min-w-[120px] text-xs">
                    <input
                      type="text"
                      value={item.name}
                      onChange={(e) =>
                        handleNameChange(item.id, e.target.value)
                      }
                      onBlur={(e) => {
                        handleSubmit(e, item, "blur", index);
                      }}
                      onKeyDown={(e) => {
                        handleSubmit(e, item, "", index);
                      }}
                      className="w-full border-none p-1 focus:rounded text-xs"
                    />
                  </td>
                  <td className="px-2 py-4 min-w-[120px] text-xs">
                    <input
                      type="email"
                      value={item.email}
                      onChange={(e) =>
                        handleEmailChange(item.id, e.target.value)
                      }
                      onBlur={(e) => {
                        handleSubmit(e, item, "blur");
                      }}
                      onKeyDown={(e) => {
                        handleSubmit(e, item);
                      }}
                      className="w-full border-none p-1 focus:rounded text-xs"
                    />
                  </td>
                  {!active && (
                    <td className="px-2 py-4 min-w-[120px] text-xs">PENDING</td>
                  )}
                  {!active && (
                    <td className="px-2 py-4 min-w-[120px] text-xs">
                      <button
                        className="me-2 font-medium text-blue-600 dark:text-blue-500 hover:underline"
                        onClick={() => handleResend(item.email)}
                      >
                        RESEND EMAIL
                      </button>
                    </td>
                  )}
                  {active && (
                    <td className="px-2 py-4 min-w-[120px] text-xs">
                      {/* <input
                      type="text"
                      value={item?.company?.name}
                      placeholder="Enter Company"
                      onChange={(e) =>
                        handleCompanyChange(item.id, e.target.value)
                      }
                      onKeyDown={(e) => {
                        handleSubmit(e, item);
                      }}
                      className="w-full border-none p-1 focus:rounded text-xs"
                    /> */}
                      <select
                        className="cursor-pointer p-1 login-input border border-gray-300 "
                        value={item?.company?.id || ""}
                        onChange={(e) => handleSelectCompany(e, item.id)}
                        onBlur={(e) => {
                          handleSubmit(e, item, "blur");
                        }}
                        // onKeyDown={(e) => {
                        //   handleSubmit(e, item);
                        // }}
                        required
                      >
                        <option
                          className="bg-white "
                          value=""
                          disabled
                          selected
                        >
                          Select Company
                        </option>
                        {companyList
                          ?.slice() // Create a shallow copy to avoid mutating the original array
                          .sort((a, b) => a.name.localeCompare(b.name))
                          .map((item1, index) => (
                            <option
                              className="bg-white text-black"
                              key={index}
                              value={item1?.id}
                            >
                              {item1?.name}
                            </option>
                          ))}
                      </select>
                    </td>
                  )}
                  {active && (
                    <td className="px-2 py-4 min-w-[120px] text-xs">
                      <button
                        onClick={() => {
                          setShowDetail(true);
                          setShowDetailID(item.id);
                        }}
                        className="me-2 font-medium text-blue-600 dark:text-blue-500 hover:underline"
                      >
                        Detail
                      </button>
                    </td>
                  )}
                  {active && (
                    <td className="px-2 py-4 min-w-[120px] text-xs">
                      {item.isActive ? (
                        <button
                          onClick={() => {
                            handleActive(item.id, item.isActive);
                          }}
                          className="me-2 font-medium text-blue-600 dark:text-blue-500 hover:underline"
                        >
                          Active
                        </button>
                      ) : (
                        <button
                          onClick={() => {
                            handleActive(item.id, item.isActive);
                          }}
                          className="me-2 font-medium text-blue-600 dark:text-blue-500 hover:underline"
                        >
                          Inactive
                        </button>
                      )}
                    </td>
                  )}
                  <td className="px-2 py-4 min-w-[120px] text-xs">
                    <div
                      className="cursor-pointer"
                      onClick={() => {
                        handleDelete(item.id);
                      }}
                    >
                      <img
                        src={deleteIcon}
                        alt="icon"
                        className="w-6 hover:bg-gray-100 rounded p-1"
                      />
                    </div>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    );
  };

  return (
    <div className="sm:ml-16">
      <div className="sm:flex justify-between sm:m-7 ms-7 mb-3">
        <div className="sidebar-heading">Client Management</div>
        {!showDetail && (
          <AddUser
            client={true}
            setIsLoading={setIsActiveClick}
            setEditedData={setEditedData}
            editedData={editedData}
            companyList={companyList}
            setCompanyList={setCompanyList}
          />
        )}
      </div>

      {!showDetail && (
        <>
          {activeUser?.length > 0 && (
            <>
              <div className="sidebar-heading-2 ms-7">Active Users</div>
              <div className="relative overflow-x-auto shadow-md sm:rounded-lg m-4">
                {clientStatus === "loading" && localClientList === null ? (
                  <div className="w-full flex justify-center items-center p-5">
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
                  <>{Table(editedData, true, true)}</>
                )}
              </div>
            </>
          )}
        </>
      )}

      {!showDetail && (
        <>
          {inactiveUser?.length > 0 && (
            <>
              <div className="sidebar-heading-2 ms-7">Inactive Users</div>
              <div className="relative overflow-x-auto shadow-md sm:rounded-lg m-4">
                {clientStatus === "loading" && localClientList === null ? (
                  <div className="w-full flex justify-center items-center p-5">
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
                  <>{Table(editedData, false, true)}</>
                )}
              </div>
            </>
          )}
        </>
      )}

      {!showDetail && (
        <>
          {pendingList?.length > 0 && (
            <>
              <div className="sidebar-heading-2 ms-7">
                Signup Pending Clients
              </div>
              <div className="relative overflow-x-auto shadow-md sm:rounded-lg m-4">
                {clientStatus === "loading" && localClientList === null ? (
                  <div className="w-full flex justify-center items-center p-5">
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
                  <>{Table(editedData, false, false)}</>
                )}
              </div>
            </>
          )}
        </>
      )}

      {showDetail && (
        <Detail
          setShowDetail={setShowDetail}
          id={showDetailID}
          type={"Client"}
        />
      )}
    </div>
  );
}

export default Client;
