import React, { useEffect, useRef, useState } from "react";
import Modal from "react-modal";
import Form from "./editProjectForm";
import EditIcon from "../../../assets/images/edit-icon.svg";
Modal.setAppElement("#root");

function EditProject(props) {
  const [openModal, setOpenModal] = useState(false);
  const modalRef = useRef(null);
  // Function to close the drawer when clicking outside of it
  const handleClickOutside = (event) => {
    if (modalRef.current && !modalRef.current.contains(event.target)) {
      setOpenModal(false);
    }
  };

  // useEffect(() => {
  //   // Add event listener to handle clicks outside the drawer
  //   document.addEventListener("mousedown", handleClickOutside);

  //   // Clean up the event listener when the component unmounts
  //   return () => {
  //     document.removeEventListener("mousedown", handleClickOutside);
  //   };
  // }, []);

  return (
    <>
      <button className="w-6" onClick={() => setOpenModal(true)} type="button">
        <img src={EditIcon} alt="icon" className="ms-1 w-3" />
      </button>
      <Modal
        isOpen={openModal}
        onRequestClose={() => setOpenModal(false)}
        className="fixed flex items-center justify-center top-0 left-0 right-0 z-50 w-full overflow-x-hidden overflow-y-auto md:inset-0 h-[calc(100%-1rem)] max-h-full"
      >
        <div className="relative w-full max-w-md md:max-w-lg lg:max-w-3xl max-h-full">
          <div ref={modalRef} className="relative bg-white rounded-lg shadow">
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

            <div className="md:p-6 space-y-6">
              <Form
                item={props.item}
                setAddProject={props.setAddProject}
                setOpenModal={setOpenModal}
                orderList={props.orderList}
                setOrderList={props.setOrderList}
                editorList={props.editorList}
                clientList={props.clientList}
                renderProject={props.renderProject}
                setRenderProject={props.setRenderProject}
              />
            </div>
          </div>
        </div>
      </Modal>
    </>
  );
}

export default EditProject;
