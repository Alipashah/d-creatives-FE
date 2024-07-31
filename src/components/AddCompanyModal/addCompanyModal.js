import React, { useEffect, useState, useRef } from "react";
import Modal from "react-modal";
Modal.setAppElement("#root");

function AddCompanyModal({ companyList, setCompanyList }) {
  const [newCompanyName, setNewCompanyName] = useState("");
  const [openModal, setOpenModal] = useState(false);
  const modalRef1 = useRef(null);
  const handleClickOutside = (event) => {
    if (modalRef1.current && !modalRef1.current.contains(event.target)) {
      setOpenModal(false);
    }
  };

  useEffect(() => {
    // Add event listener to handle clicks outside the drawer
    document.addEventListener("mousedown", handleClickOutside);

    // Clean up the event listener when the component unmounts
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleAddCompany = () => {
    if (newCompanyName.trim() !== "") {
      handleAddCompanyClick(newCompanyName);
      setNewCompanyName("");
      setOpenModal(false);
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

    const newCompany = {
      id: companyList.length + 1,
      name: newCompanyName,
    };

    setCompanyList([...companyList, newCompany]);
  };

  return (
    <>
      <div>
        <div
          className="cursor-pointer"
          onClick={() => {
            setOpenModal(true);
          }}
        >
          add company
        </div>
      </div>
      <Modal
        isOpen={openModal}
        onRequestClose={() => {
          setOpenModal(false);
        }}
        className="fixed flex items-center justify-center top-0 left-0 right-0 z-50 w-full overflow-x-hidden overflow-y-auto md:inset-0 h-[calc(100%-1rem)] max-h-full"
      >
        <div className="relative">
          <div className="relative bg-white rounded-lg shadow-lg border">
            <div
              className="flex justify-end"
              onClick={() => setOpenModal(false)}
            >
              <button
                type="button"
                className=" text-gray-400 bg-transparent  rounded-lg text-sm p-1.5 ml-auto inline-flex items-center dark:hover:bg-gray-800 dark:hover:text-white"
                data-modal-hide="authentication-modal"
              >
                <svg
                  aria-hidden="true"
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fill-rule="evenodd"
                    d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                    clip-rule="evenodd"
                  ></path>
                </svg>
                <span className="sr-only">Close modal</span>
              </button>
            </div>
            <div className="mt-2 flex flex-col p-8">
              <label>Add Company</label>
              <input
                type="text"
                className="w-full border-gray-300 rounded-md mr-2 px-2 py-1"
                placeholder="Enter company name"
                value={newCompanyName}
                onChange={(e) => setNewCompanyName(e.target.value)}
              />
              <div>
                <button
                  className="mt-3 login-btn p-2"
                  onClick={handleAddCompany}
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        </div>
      </Modal>
    </>
  );
}

export default AddCompanyModal;
