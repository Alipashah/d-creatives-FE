import React, { useEffect, useState } from "react";
import Modal from "react-modal";
import { addComment } from "../../../store/addCommentSlice";
import { useDispatch } from "react-redux";
import Swal from "sweetalert2";
import { socket } from "../../../App";
Modal.setAppElement("#root");

function Comment(props) {
  const dispatch = useDispatch();
  const token = localStorage.getItem("token");
  // const [openModal, setOpenModal] = useState(false);
  const [comment, setComment] = useState(props?.comment[0]?.commentText);
  const [isClick, setIsClick] = useState(false);

  const handleKeyDown = (event, id, text) => {
    if (event.key === "Enter" || text === "blur") {
      event.target.blur();
      props.setAddProject(false);
      dispatch(
        addComment({
          token: token,
          data: { commentText: comment, projectId: id },
        })
      )
        .unwrap()
        .then((res) => {
          if (res.status) socket.emit("project-update", { id: id });
          // Swal.fire({
          //   icon: "success",
          //   title: "Comment added successfully",
          //   timer: 1400,
          //   timerProgressBar: true,
          //   showConfirmButton: false,
          // });
          props.setAddProject(true);
        })
        .catch((err) => {
          Swal.fire({
            icon: "error",
            title: "Oops...",
            text: "Something went wrong!",
          });
        });
    }
  };

  useEffect(() => {
    setComment(props?.comment[0]?.commentText);
  }, [props.comment.length]);
  return (
    // <>
    //   {isClick ? (
    <textarea
      ref={props.commentRef}
      name="comment"
      id="comment"
      value={comment}
      onBlur={(e) => {
        setIsClick(false);
        handleKeyDown(e, props.projectId, "blur");
      }}
      className={`${props.font} bg-transparent p-0 m-0 focus:outline-2 focus:outline-blue-500 focus:rounded`}
      style={{
        backgroundColor: "transparent",
        boxShadow: "none",
        border: "none",
        width: "120px",
        resize: "vertical",
        height: "40px",
      }}
      onChange={(e) => setComment(e.target.value)}
      onClick={(e) => {
        setIsClick(true);
      }}
      onDoubleClick={(e) => {
        setIsClick(true);
      }}
      onKeyDown={(e) => {
        if (e.key === "Enter" && e.shiftKey) {
          //handleKeyDown(e, props.projectId);
        } else if (e.key === "Enter") {
          handleKeyDown(e, props.projectId);
        }
      }}
    />
    // ) : (
    //   <input
    //     ref={props.commentRef}
    //     type="text"
    //     name="comment"
    //     id="comment"
    //     value={comment}
    //     onBlur={(e) => {
    //       handleKeyDown(e, props.projectId, "blur");
    //     }}
    //     className={`${props.font} bg-transparent p-0 m-0 focus:outline-2 focus:outline-blue-500 focus:rounded`}
    //     style={{ boxShadow: "none", border: "none", width: "120px" }}
    //     placeholder="Add Comments"
    //     onChange={(e) => {
    //       setComment(e.target.value);
    //     }}
    //     onDoubleClick={() => {
    //       setIsClick(true);
    //     }}
    //     onKeyDown={(e) => handleKeyDown(e, props.projectId)}
    //   />
    // )}
  );
}

export default Comment;
