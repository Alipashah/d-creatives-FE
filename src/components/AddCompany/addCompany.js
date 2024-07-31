import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { socket } from "../../App";
import { addCompany } from "../../store/addCompanySlice";
import { getCompany } from "../../store/getCompanySlice";

function AddCompany({ companyList, setCompanyList, addUser, setAddNew }) {
  const dispatch = useDispatch();

  const [newCompanyName, setNewCompanyName] = useState("");
  const token = localStorage.getItem("token");

  useEffect(() => {
    socket.on("company-data", (res) => {
      localStorage.setItem("companyList", JSON.stringify(res?.company));
    });
  }, [socket]);

  const handleAddCompany = () => {
    if (newCompanyName.trim() !== "") {
      handleAddCompanyClick(newCompanyName);
      setNewCompanyName("");
      setAddNew(null);
    }
  };
  const handleAddCompanyClick = (newCompanyName) => {
    if (newCompanyName.trim() === "") {
      // Don't add an empty company name
      return;
    }

    const isDuplicate = companyList.some(
      (company) => company.name.toLowerCase() === newCompanyName.toLowerCase()
    );

    if (isDuplicate) {
      // Handle duplicate company name (e.g., display an error message)
      // You can set a state variable to show an error message, for example.
      return;
    }
    const maxId = localStorage.getItem("companyMaxId");
    //console.log(maxId, parseInt(maxId) + 1);
    const newCompany = {
      id: parseInt(maxId) + 1,
      name: newCompanyName,
    };

    setCompanyList([...companyList, newCompany]);
    localStorage.setItem(
      "companyList",
      JSON.stringify([...companyList, newCompany])
    );
    localStorage.setItem("companyMaxId", parseInt(parseInt(maxId) + 1));
    dispatch(
      addCompany({ token: token, data: { companyName: newCompanyName } })
    )
      .unwrap()
      .then((res) => {
        if (res.status) {
          let list = [...companyList];
          list[list?.length - 1] = res?.data;
          setCompanyList(list);
          localStorage.setItem("companyList", JSON.stringify(list));
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };
  return (
    <div className="mt-4 flex">
      <input
        type="text"
        className={`${
          addUser ? "settings-input" : "sm:w-fit w-36"
        } border-gray-300 rounded-md mr-2 px-2 py-1 `}
        placeholder="Enter company name"
        value={newCompanyName}
        onChange={(e) => setNewCompanyName(e.target.value)}
      />
      <button
        className="project-btn-02 ps-3 pe-3 me-2"
        onClick={handleAddCompany}
      >
        Add
      </button>
    </div>
  );
}

export default AddCompany;
