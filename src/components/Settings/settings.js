import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import Swal from "sweetalert2";
import pic from "../../assets/images/profile-pic.png";
import { editUser } from "../../store/editUser";
import { Image } from "../../store/imageSlice";
import Logout from "../Logout/logout";
import { updatePassword } from "../../store/updatePasswordSlice";
import { getUser } from "../../store/getUserSlice";

function Settings() {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");
  const dispatch = useDispatch();
  const id = localStorage.getItem("id");
  const [username, setUsername] = useState(localStorage.getItem("name"));
  const [email, setEmail] = useState(localStorage.getItem("email"));
  const [image, setImage] = useState(localStorage.getItem("image"));
  const [imageURL, setImageURL] = useState(localStorage.getItem("image"));
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [oldPassword, setOldPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [imageUpdate, setImageUpdate] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoading2, setIsLoading2] = useState(false);
  let regex = /^[^@]*@[^@]*$/;

  const [type, setType] = useState("Profile");

  useEffect(() => {
    dispatch(getUser({ token: token, id: id }))
      .unwrap()
      .then((res) => {
        if (res?.status) {
          setUsername(res?.data?.name);
          setEmail(res?.data?.email);
          setImage(res?.data?.image);
          setImageURL(res?.data?.image);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();

    // Perform validation here
    const validationErrors = {};
    if (!image) {
      validationErrors.image = "Image is required";
    }
    if (image?.size > 1000000) {
      validationErrors.image = "Image size must less than 1mb";
    }
    if (!email) {
      validationErrors.email = "Email is required";
    }
    if (!email) {
      validationErrors.email = "Email is required";
    }
    if (!username) {
      validationErrors.username = "Username is required";
    }

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
    } else {
      // Submit the form
      setIsLoading(true);
      console.log("Form submitted");
      const formData = new FormData();
      formData.append("image", image);
      if (imageUpdate) {
        dispatch(Image(formData))
          .unwrap()
          .then((res1) => {
            if (res1.status) {
              dispatch(
                editUser({
                  token: token,
                  id: id,
                  data: {
                    name: username,
                    email: email,
                    image: res1.imageUrl,
                  },
                })
              )
                .unwrap()
                .then((res) => {
                  if (res?.status) {
                    localStorage.setItem("image", res1.imageUrl);
                    localStorage.setItem("name", username);
                    localStorage.setItem("email", email);

                    Swal.fire({
                      icon: "success",
                      title: "User updated successfully",
                      timer: 1400,
                      timerProgressBar: true,
                      showConfirmButton: false,
                    });
                    setIsLoading(false);
                  } else {
                    Swal.fire({
                      icon: "error",
                      title: "Oops...",
                      text: "Something went wrong!",
                    });
                    setIsLoading(false);
                  }
                })
                .catch((err) => {
                  console.log(err);
                  Swal.fire({
                    icon: "error",
                    title: "Oops...",
                    text: "Something went wrong!",
                  });
                  setIsLoading(false);
                });
            } else {
              Swal.fire({
                icon: "error",
                title: "Oops...",
                text: "Something went wrong!",
              });
              setIsLoading(false);
            }
          })
          .catch((err) => {
            console.log(err);
            setIsLoading(false);
          });
      } else {
        dispatch(
          editUser({
            token: token,
            id: id,
            data: {
              name: username,
              email: email,
              image: image,
            },
          })
        )
          .unwrap()
          .then((res) => {
            if (res?.status) {
              localStorage.setItem("image", image);
              localStorage.setItem("name", username);
              localStorage.setItem("email", email);
              Swal.fire({
                icon: "success",
                title: "User updated successfully",
                timer: 1400,
                timerProgressBar: true,
                showConfirmButton: false,
              });
              setIsLoading(false);
            } else {
              Swal.fire({
                icon: "error",
                title: "Oops...",
                text: "Something went wrong!",
              });
              setIsLoading(false);
            }
          })
          .catch((err) => {
            console.log(err);
            Swal.fire({
              icon: "error",
              title: "Oops...",
              text: "Something went wrong!",
            });
            setIsLoading(false);
          });
      }
    }
  };

  function handleChangePassword() {
    const validationErrors = {};
    if (!oldPassword) {
      validationErrors.oldPassword = "Old Password is required";
    }
    if (oldPassword && oldPassword.length < 8) {
      validationErrors.oldPassword = "Password must be more than 8 characters.";
    }
    if (!password) {
      validationErrors.password = "New Password is required";
    }
    if (password && password.length < 8) {
      validationErrors.password = "Password must be more than 8 characters.";
    }

    if (!confirmPassword) {
      validationErrors.confirmPassword = "Confirm Password is required";
    }
    if (confirmPassword && confirmPassword.length < 8) {
      validationErrors.confirmPassword =
        "Password must be more than 8 characters.";
    }
    if (confirmPassword !== password) {
      validationErrors.confirmPassword = "Passwords must match";
    }

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
    } else {
      setIsLoading2(true);
      dispatch(
        updatePassword({
          token: token,
          data: { oldPassword: oldPassword, newPassword: password },
        })
      )
        .unwrap()
        .then((res) => {
          if (res?.status) {
            Swal.fire({
              icon: "success",
              title: "Password updated successfully",
              timer: 1400,
              timerProgressBar: true,
              showConfirmButton: false,
            });
            setIsLoading2(false);
            setPassword("");
            setOldPassword("");
            setConfirmPassword("");
          } else {
            Swal.fire({
              icon: "error",
              title: "Oops...",
              text: res?.message,
            });
            setIsLoading2(false);
          }
        })
        .catch((err) => {
          Swal.fire({
            icon: "error",
            title: "Oops...",
            text: err,
          });
          setIsLoading2(false);
        });
    }
  }
  return (
    <div className={`${role === "client" ? "sm:ml-64 mt-20" : "sm:ml-16"}`}>
      <div className="flex justify-between sm:m-8 m-4">
        <div className="sidebar-heading">Settings</div>
        {(role === "admin" || role === "editor") && (
          <div className="">
            <Logout />
          </div>
        )}
      </div>
      <div className="sm:m-8 m-4">
        <div className="cursor-pointer flex">
          <div
            className={`ps-4 pe-4 pt-2 pb-2 w-28 ${
              type === "Profile" ? "setting-profile" : "setting-profile2"
            }`}
            onClick={() => {
              setType("Profile");
            }}
          >
            Profile
          </div>
          <div
            className={`ps-4 pe-4 pt-2 pb-2 w-28 ${
              type === "Password" ? "setting-password2" : "setting-password"
            }`}
            onClick={() => {
              setType("Password");
            }}
          >
            Password
          </div>
        </div>

        {type === "Profile" ? (
          <div
            className="p-4 w-fit"
            style={{
              borderRadius: "0px 11px 11px 11px",
              background: "rgba(244, 244, 244, 1)",
            }}
          >
            <div
              className="sidebar-heading m-2"
              style={{ fontSize: "20px", fontWeight: "700" }}
            >
              Profile Details
            </div>

            <div className="flex sm:flex-row flex-col">
              <div className="flex justify-center m-3">
                <div className="relative cursor-pointer">
                  <input
                    className="absolute inset-0 w-full h-full opacity-0 z-50"
                    type="file"
                    accept="image/png, image/jpeg"
                    onChange={(e) => {
                      const allowedTypes = ["image/jpeg", "image/png"];

                      if (!allowedTypes.includes(e.target.files[0]?.type)) {
                        let error = errors;
                        error.image = "Image type is not valid";
                        setErrors(error);
                      } else {
                        if (e.target.files[0].size <= 1000000) {
                          let error = errors;
                          delete error.image;
                          setErrors(error);
                          let url = URL.createObjectURL(e.target.files[0]);
                          setImageUpdate(true);
                          setImage(e.target.files[0]);
                          setImageURL(url);
                        } else {
                          let url = URL.createObjectURL(e.target.files[0]);
                          setImage(e.target.files[0]);
                          setImageURL(url);
                          setImageUpdate(true);
                          let error = errors;
                          error.image = "Image size must less than 1mb";
                          setErrors(error);
                        }
                      }
                    }}
                  />

                  <div className="flex justify-center cursor-pointer mb-1 w-max">
                    {image ? (
                      <img
                        id="preview_img"
                        class="object-cover rounded-full"
                        style={{ width: "175px", height: "175px" }}
                        src={imageURL}
                        alt="Current profile photo"
                      />
                    ) : (
                      <img
                        id="preview_img"
                        class="object-cover rounded-full"
                        style={{ width: "175px", height: "175px" }}
                        src={pic}
                        alt="Current profile photo"
                      />
                    )}
                  </div>
                  {errors.image && (
                    <p className="flex justify-center login-text2 text-red-500 mb-1">
                      {errors.image}
                    </p>
                  )}
                </div>
              </div>

              <div className="flex flex-col sm:items-start items-center sm:ms-6">
                <div className="flex flex-col m-2">
                  <label htmlFor="username" className="login-text mb-1">
                    Username
                  </label>
                  <input
                    type="text"
                    id="username"
                    placeholder="Enter Username"
                    value={username}
                    onChange={(e) => {
                      if (e.target.value) {
                        let error = errors;
                        delete error.username;
                        setErrors(error);
                      }
                      setUsername(e.target.value);
                    }}
                    className={`settings-input-2 focus:outline-none border ${
                      errors.username ? "border-red-500" : "border-gray-300"
                    } p-2`}
                  />
                  {errors.username && (
                    <p className="login-text2 text-red-500">
                      {errors.username}
                    </p>
                  )}
                </div>
                <div className="flex flex-col m-2">
                  <label htmlFor="email" className="login-text mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    placeholder="Enter Email"
                    value={email}
                    onChange={(e) => {
                      if (e.target.value) {
                        let error = errors;
                        delete error.email;
                        setErrors(error);
                      }
                      setEmail(e.target.value);
                    }}
                    className={`settings-input-2 focus:outline-none border ${
                      errors.email ? "border-red-500" : "border-gray-300"
                    } p-2`}
                  />
                  {errors.email && (
                    <p className="login-text2 text-red-500">{errors.email}</p>
                  )}
                </div>

                {isLoading ? (
                  <button
                    disabled
                    type="button"
                    className="login-btn px-4 py-3 m-2 whitespace-nowrap"
                  >
                    <svg
                      aria-hidden="true"
                      role="status"
                      className="inline w-4 h-4 mr-3 text-white animate-spin"
                      viewBox="0 0 100 101"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                        fill="#E5E7EB"
                      />
                      <path
                        d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                        fill="currentColor"
                      />
                    </svg>
                    Loading...
                  </button>
                ) : (
                  <div className="">
                    <button
                      onClick={handleSubmit}
                      className="login-btn px-4 py-3 m-2 whitespace-nowrap"
                    >
                      Save Changes
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        ) : (
          <div
            className="p-4 flex flex-col w-fit"
            style={{
              borderRadius: "0px 11px 11px 11px",
              background: "rgba(244, 244, 244, 1)",
            }}
          >
            <div
              className="sidebar-heading m-2"
              style={{ fontSize: "20px", fontWeight: "700" }}
            >
              Change Password
            </div>
            <div className="flex flex-col">
              <div className="flex flex-col m-2">
                <label htmlFor="oldPassword" className="login-text mb-1">
                  Old Password
                </label>
                <input
                  type="password"
                  id="oldPassword"
                  placeholder="Enter Old Password"
                  value={oldPassword}
                  onChange={(e) => {
                    if (e.target.value) {
                      let error = errors;
                      delete error.oldPassword;
                      setErrors(error);
                    }
                    setOldPassword(e.target.value);
                  }}
                  className={`settings-input-2 border ${
                    errors.oldPassword ? "border-red-500" : "border-gray-300"
                  } p-2`}
                />
                {errors.oldPassword && (
                  <p className="login-text2 text-red-500">
                    {errors.oldPassword}
                  </p>
                )}
              </div>
              <div className="flex flex-col m-2">
                <label htmlFor="password" className="login-text mb-1">
                  New Password
                </label>
                <input
                  type="password"
                  id="password"
                  placeholder="Enter New Password"
                  value={password}
                  onChange={(e) => {
                    if (e.target.value) {
                      let error = errors;
                      delete error.password;
                      setErrors(error);
                    }
                    setPassword(e.target.value);
                  }}
                  className={`settings-input-2 border ${
                    errors.password ? "border-red-500" : "border-gray-300"
                  } p-2`}
                />
                {errors.password && (
                  <p className="login-text2 text-red-500">{errors.password}</p>
                )}
              </div>
              <div className="flex flex-col m-2">
                <label htmlFor="confirmPassword" className="login-text mb-1">
                  Confirm Password
                </label>
                <input
                  type="password"
                  id="confirmPassword"
                  placeholder="Enter Password"
                  value={confirmPassword}
                  onChange={(e) => {
                    if (e.target.value) {
                      let error = errors;
                      delete error.confirmPassword;
                      setErrors(error);
                    }
                    setConfirmPassword(e.target.value);
                  }}
                  className={`settings-input-2 border ${
                    errors.confirmPassword
                      ? "border-red-500"
                      : "border-gray-300"
                  } p-2`}
                />
                {errors.confirmPassword && (
                  <p className="login-text2 text-red-500">
                    {errors.confirmPassword}
                  </p>
                )}
              </div>
              {isLoading2 ? (
                <button
                  disabled
                  type="button"
                  className="login-btn px-2 py-3 m-2 whitespace-nowrap"
                >
                  <svg
                    aria-hidden="true"
                    role="status"
                    className="inline w-4 h-4 mr-3 text-white animate-spin"
                    viewBox="0 0 100 101"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                      fill="#E5E7EB"
                    />
                    <path
                      d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                      fill="currentColor"
                    />
                  </svg>
                  Loading...
                </button>
              ) : (
                <div className="">
                  <button
                    onClick={handleChangePassword}
                    className="login-btn px-2 py-3 m-2 whitespace-nowrap"
                  >
                    Change Password
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Settings;
