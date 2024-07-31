import Modal from "react-modal";
import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Swal from "sweetalert2";
import { addEditor } from "../../../store/addEditorSlice";
import { getClient } from "../../../store/getClientSlice";
import AddCompany from "../../AddCompany/addCompany";
Modal.setAppElement("#root");

function EditClient(props) {
  const dispatch = useDispatch();
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");
  const [openModal, setOpenModal] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);

  const localCompanyJSON = localStorage.getItem("companyList");
  const localCompanyList = localCompanyJSON
    ? JSON.parse(localCompanyJSON)
    : null;

  const [companyList, setCompanyList] = useState(localCompanyList || []);
  const [addNew, setAddNew] = useState(null);
  const [company, setCompany] = useState(props?.company);
  const modalRef = useRef(null);
  const clientModal = useRef(null);
  const handleClickOutside = (event) => {
    if (modalRef.current && !modalRef.current.contains(event.target)) {
      setOpenModal(false);
      setAddNew(null);
    }
    if (clientModal.current && !clientModal.current.contains(event.target)) {
      setShowDropdown(false);
      setAddNew(null);
    }
  };

  useEffect(() => {
    setCompany(props?.company || "");
  }, [props?.company]);

  useEffect(() => {
    // Add event listener to handle clicks outside the drawer
    document.addEventListener("mousedown", handleClickOutside);

    // Clean up the event listener when the component unmounts
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // const { data: clientList, status: clientStatus } = useSelector(
  //   (state) => state.getClient
  // );

  const handleSelectCompany = (event) => {
    const selectedOption = event.target.value;
    //console.log(selectedOption);
    if (selectedOption !== "add-new") {
      props.setCompany(parseInt(selectedOption));
      setCompany(parseInt(selectedOption));
    } else setAddNew(selectedOption);
  };

  useEffect(() => {
    const localCompanyJSON2 = localStorage.getItem("companyList");
    const localCompanyList2 = localCompanyJSON2
      ? JSON.parse(localCompanyJSON2)
      : null;
    setCompanyList(localCompanyList2);
  }, []);

  // const handleSelectClient = (event) => {
  //   const selectedClientId = parseInt(event.target.value);
  //   const isSelected = event.target.checked;

  //   if (isSelected) {
  //     // Add the selected client ID to the list of selected brands
  //     const updatedBrands = [...props.brand, selectedClientId];
  //     props.setBrand(updatedBrands); // Update the state with the new selected brands
  //     const clients = clientList?.data?.filter((item) =>
  //       updatedBrands?.includes(item.id)
  //     );
  //     props.setClientList(clients);
  //   } else {
  //     // Remove the deselected client ID from the list of selected brands
  //     const updatedBrands = props.brand.filter((id) => id !== selectedClientId);
  //     props.setBrand(updatedBrands); // Update the state with the new selected brands
  //     const clients = clientList?.data?.filter((item) =>
  //       updatedBrands?.includes(item.id)
  //     );
  //     props.setClientList(clients);
  //   }
  // };

  return (
    <>
      <div>
        <div
          className="cursor-pointer"
          onClick={() => {
            const localCompanyJSON1 = localStorage.getItem("companyList");
            const localCompanyList1 = localCompanyJSON1
              ? JSON.parse(localCompanyJSON1)
              : null;
            setCompanyList(localCompanyList1);
            setOpenModal(true);
          }}
        >
          {props?.companyName ? props.companyName : "choose company"}
        </div>
      </div>
      {openModal && (
        <Modal
          isOpen={openModal}
          onRequestClose={() => {
            setOpenModal(false);
            setAddNew(null);
          }}
          className="fixed flex items-center justify-center top-0 left-0 right-0 z-50 w-full overflow-x-hidden overflow-y-auto md:inset-0 h-[calc(100%-1rem)] max-h-full"
        >
          <div className="relative">
            <div
              ref={modalRef}
              className="relative bg-white rounded-lg shadow-lg border "
            >
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

              <div className="sm:p-6 p-3 md:w-80">
                <label
                  htmlFor="company"
                  className="flex items-center col-span-1 text-sm font-medium text-gray-700"
                >
                  Company
                </label>

                <select
                  className="cursor-pointer mt-1 col-span-2 focus:ring-indigo-500 focus:border-indigo-500 w-fit sm:w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                  value={company ? company : ""}
                  onChange={handleSelectCompany}
                  required
                >
                  <option value="" disabled selected>
                    Select Company
                  </option>
                  {companyList
                    ?.slice() // Create a shallow copy to avoid mutating the original array
                    .sort((a, b) => a.name.localeCompare(b.name))
                    .map((item, index) => (
                      <option key={index} value={item?.id}>
                        {item?.name}
                      </option>
                    ))}
                  <option value="add-new">Add Company</option>
                </select>
                {addNew === "add-new" && (
                  <div>
                    <AddCompany
                      companyList={companyList}
                      setCompanyList={setCompanyList}
                      setAddNew={setAddNew}
                    />
                  </div>
                )}
                {/* <AddCompany onAddCompany={handleAddCompany} /> */}
              </div>

              <button
                value={"click-btn"}
                className="mb-6 ms-6 project-btn-02 ps-3 pe-3 pt-1 pb-1"
                onClick={(e) => {
                  setOpenModal(false);
                  props.handleSubmit(e);
                }}
                onKeyDown={(e) => {
                  setOpenModal(false);
                  props.handleSubmit(e);
                }}
              >
                Save
              </button>
            </div>
          </div>
        </Modal>
      )}
    </>
  );
}

export default EditClient;
