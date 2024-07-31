import React from "react";
import { useDispatch } from "react-redux";
import Swal from "sweetalert2";
import { deleteProject } from "../../store/deleteProjectSlice";
import deleteIcon from "../../assets/images/delete-icon.png";
import { socket } from "../../App";

function Delete(props) {
  const dispatch = useDispatch();
  const token = localStorage.getItem("token");

  function handleDelete() {
    //props.setAddProject(false);
    //console.log(props.selectedIds);
    const updatedItems = props.data?.filter(
      (item) => !props.selectedIds?.includes(item.id)
    );
    const updatedItemsOrder = props.orderList.filter(
      (item) => !props.selectedIds?.includes(item)
    );
    localStorage.setItem("projectList", JSON.stringify(updatedItems));
    localStorage.setItem("projectOrder", JSON.stringify(updatedItemsOrder));
    props.setData(updatedItems);
    props.setOrderList(updatedItemsOrder);

    dispatch(
      deleteProject({
        token: token,
        data: { ids: props.selectedIds, projectOrder: updatedItemsOrder },
      })
    )
      .unwrap()
      .then((res) => {
        if (res?.status) {
          socket.emit("project-delete", { id: props.selectedIds });
          //Swal.fire("Deleted!", "Project has been deleted.", "success");

          props.setSelectedIds([]);
          //props.setAddProject(true);
        }
      })
      .catch((err) => {
        console.log(err);
        props.setSelectedIds([]);
        //props.setAddProject(true);
      });

    // Swal.fire({
    //   title: "Are you sure?",
    //   text: "You won't be able to revert this!",
    //   icon: "warning",
    //   showCancelButton: true,
    //   confirmButtonColor: "#3085d6",
    //   cancelButtonColor: "#d33",
    //   confirmButtonText: "Yes, delete it!",
    // }).then((result) => {
    //   if (result.isConfirmed) {
    //     dispatch(
    //       deleteProject({ token: token, data: { ids: props.selectedIds } })
    //     )
    //       .unwrap()
    //       .then((res) => {
    //         if (res?.status) {
    //           Swal.fire("Deleted!", "Project has been deleted.", "success");
    //         }
    //         props.setAddProject(true);
    //         props.setSelectedIds([]);
    //       })
    //       .catch((err) => {
    //         console.log(err);
    //       });
    //   }
    // });
  }
  return (
    <div
      onClick={() => {
        if (props.selectedIds?.length > 1) {
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
              handleDelete();
            }
          });
        } else {
          handleDelete();
        }
      }}
      className="w-5 hover:bg-gray-100 rounded flex justify-center items-center cursor-pointer me-1"
    >
      <img src={deleteIcon} alt="icon" />
    </div>
  );
}

export default Delete;
