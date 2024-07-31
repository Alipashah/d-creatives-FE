import React, { useState } from "react";
import editIcon from "../../../assets/images/edit-icon.png";

function EditCell(props) {
  const [isUserTyping, setIsUserTyping] = useState(false);
  const [isClick, setIsClick] = useState(false);
  const [isDoubleClick, setIsDoubleClick] = useState(false);
  const [isDoubleClick2, setIsDoubleClick2] = useState(false);
  const isValidLink = (text) => {
    // Define a regular expression to validate links
    // This pattern matches URLs that start with http://, https://, ftp://, or www.
    const linkPattern =
      /((https?:\/\/|ftp:\/\/|www\.)[\w-]+\.\w{2,}(\/[\w- ./?%&=]*)?)/g;
    return linkPattern.test(text);
  };
  let click = 0;

  return (
    <>
      {props.type === "link" ? (
        // <>
        //   {isClick ? (
        <>
          {isDoubleClick2 ? (
            <textarea
              value={isUserTyping ? props.link : props.link && props.value}
              onChange={(e) => {
                setIsUserTyping(true);
                props.setValue(e.target.value);
              }}
              placeholder="Enter Link"
              onFocus={() => setIsUserTyping(true)}
              onBlur={(e) => {
                click = 0;
                setIsUserTyping(false);
                setIsClick(false);
                setIsDoubleClick2(false);
                props.handleSubmit(e, "blur");
              }}
              autoFocus
              onKeyDown={(e) => {
                props.handleSubmit(e);
              }}
              className={`${props.font} underline bg-transparent p-0 m-0 focus:outline-2 focus:outline-blue-500 focus:rounded shadow-none outline-none`}
              style={{
                boxShadow: "none",
                border: "none",
                width: "120px",
                resize: "vertical",
                minHeight: "50px",
              }}
            />
          ) : (
            <div
              // type={props.type}
              // value={isUserTyping ? props.link : props.link && props.value}
              // placeholder="Enter Link"
              onClick={() => {
                setTimeout(() => {
                  click += 1;
                  if (!isDoubleClick && props.link && click === 1) {
                    // When clicked (not double-clicked), act as a hyperlink
                    click = 0;
                    window.open(props.link, "_blank");
                  }
                }, 300);
              }}
              // onChange={(e) => {
              //   setIsUserTyping(true);
              //   props.setValue(e.target.value);
              // }}
              //onFocus={() => setIsUserTyping(true)}
              // onBlur={(e) => {
              //   setIsUserTyping(false);
              //   setIsClick(false);
              //   setIsDoubleClick2(false);
              //   props.handleSubmit(e, "blur");
              // }}
              onDoubleClick={() => {
                click += 1;
                setIsDoubleClick2(!isDoubleClick2);
              }}
              // onClick={(e) => {
              //   setIsClick(true);
              //   setIsUserTyping(true);
              //   setIsDoubleClick2(true);
              // }}

              // onKeyDown={(e) => {
              //   props.handleSubmit(e);
              // }}
              className={`${props.font} underline cursor-pointer bg-transparent p-0 m-0 focus:outline-2 focus:outline-blue-500 focus:rounded shadow-none outline-none`}
              style={{ boxShadow: "none", border: "none", width: "120px" }}
            >
              {props.link
                ? props.value !== ""
                  ? props.value
                  : props.link?.substring(0, 15) + "...."
                : "Enter Link"}
            </div>
          )}
        </>
      ) : (
        //   ) : (
        //     <div style={{ width: "120px" }}>
        //       {props.link ? (
        //         <>
        //           {/* <a className="underline" target="_blank" href={props.link}>
        //             {props.value || props.link}
        //           </a> */}
        //           <div
        //             className="w-full"
        //             // onClick={(e) => {
        //             //   setIsClick(true);
        //             //   setIsUserTyping(true);
        //             // }}
        //             onDoubleClick={(e) => {
        //               setIsClick(true);
        //               setIsUserTyping(true);
        //               setIsDoubleClick2(true);
        //             }}
        //             // className="cursor-pointer opacity-0 w-2 flex items-center"
        //           >
        //             {props.value || props.link}
        //             {/* <img src={editIcon} alt="icon" className="mb-1 ms-2" /> */}
        //           </div>
        //         </>
        //       ) : (
        //         <>
        //           <div
        //             className="cursor-pointer"
        //             // onClick={(e) => {
        //             //   setIsClick(true);
        //             //   setIsUserTyping(true);
        //             // }}
        //             onDoubleClick={(e) => {
        //               setIsClick(true);
        //               setIsUserTyping(true);
        //               setIsDoubleClick2(true);
        //             }}
        //           >
        //             Enter Link
        //           </div>
        //         </>
        //       )}
        //     </div>
        //   )}
        // </>
        <>
          {isDoubleClick && props.type !== "date" ? (
            <textarea
              value={props.value}
              placeholder={`${props?.placeholder}`}
              onKeyDown={(e) => {
                props.handleSubmit(e);
              }}
              autoFocus
              onBlur={(e) => {
                setIsDoubleClick(false);
                props.handleSubmit(e, "blur");
              }}
              onChange={(e) => props.setValue(e.target.value)}
              className={`${props.font} outline-none bg-transparent p-0 m-0 focus:outline-2 focus:outline-blue-500 focus:rounded`}
              style={{
                boxShadow: "none",
                border: "none",
                width: "120px",
                resize: "vertical", // Allow vertical resizing
                minHeight: "50px", // Set a minimum height
              }}
            />
          ) : (
            <input
              type={props.type}
              value={props.value}
              min={props.min}
              placeholder={`${props?.placeholder}`}
              onBlur={(e) => {
                props.handleSubmit(e, "blur");
              }}
              onKeyDown={(e) => {
                props.handleSubmit(e);
              }}
              onChange={(e) => props.setValue(e.target.value)}
              onDoubleClick={() => {
                setIsDoubleClick(true);
              }}
              className={`${props.font} outline-none bg-transparent p-0 m-0 focus:outline-2 focus:outline-blue-500 focus:rounded`}
              style={{
                boxShadow: "none",
                border: "none",
                width: props.type === "text" ? "150px" : "120px",
              }}
            />
          )}
        </>
      )}
    </>
  );
}

export default EditCell;
