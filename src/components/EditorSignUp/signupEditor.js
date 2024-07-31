import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import { signupEditor } from "../../store/signupEditorSlice";
import bg from "../../assets/images/login.png";
import bgText from "../../assets/images/login-text.png";
import profile from "../../assets/images/profile-pic-2.jpg";
import { Image } from "../../store/imageSlice";
import Swal from "sweetalert2";
import showpass from "../../assets/images/showpass.png";
import hidepass from "../../assets/images/hidepass.png";

const SignUpEditor = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [company, setCompany] = useState("");
  const [image, setImage] = useState();
  const [imageURL, setImageURL] = useState();
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showPassword1, setShowPassword1] = useState(false);

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

    if (!password) {
      validationErrors.password = "Password is required";
    }
    if (password && password.length < 8) {
      validationErrors.password = "Password must be more than 8 characters.";
    }

    if (!username) {
      validationErrors.username = "Username is required";
    }

    if (!confirmPassword) {
      validationErrors.confirmPassword = "Confirm Password is required";
    }
    if (confirmPassword && confirmPassword.length < 8) {
      validationErrors.confirmPassword =
        "Password must be more than 8 characters.";
    }
    if (
      password &&
      confirmPassword &&
      password !== confirmPassword &&
      password.length > 8 &&
      confirmPassword.length > 8
    ) {
      validationErrors.confirmPassword = "Password not matching";
    }

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
    } else {
      // Submit the form
      console.log("Form submitted");
      const formData = new FormData();
      formData.append("image", image);
      dispatch(Image(formData))
        .unwrap()
        .then((res) => {
          if (res.status) {
            dispatch(
              signupEditor({
                id: id,
                name: username,
                password: password,
                image: res.imageUrl,
              })
            )
              .unwrap()
              .then((res) => {
                if (res?.status) {
                  Swal.fire({
                    icon: "success",
                    title: "Editor signup successfully",
                    timer: 1400,
                    timerProgressBar: true,
                    showConfirmButton: false,
                  });
                  navigate("/");
                } else {
                  Swal.fire({
                    icon: "error",
                    title: "Oops...",
                    text: res?.message,
                  });
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
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };

  return (
    <div>
      <div className="split left flex justify-center items-center flex-col">
        <img src={bg} alt="icon" className="login-img" />
        <img src={bgText} alt="icon" className="login-img w-5/6" />
      </div>
      <div className="split right flex flex-col justify-center items-center">
        <div className="mid pb-4 mt-20 mb-8">
          <img src={bg} alt="icon" className="login-img" />
          <img src={bgText} alt="icon" className="login-img" />
        </div>
        <form onSubmit={handleSubmit}>
          <div className="login-heading mb-4 mt-2">User Sign up</div>
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
                    setImage(e.target.files[0]);
                    setImageURL(url);
                  } else {
                    let url = URL.createObjectURL(e.target.files[0]);
                    setImage(e.target.files[0]);
                    setImageURL(url);
                    let error = errors;
                    error.image = "Image size must less than 1mb";
                    setErrors(error);
                  }
                }
              }}
            />

            <div className="flex justify-center cursor-pointer mb-1">
              {image ? (
                <img
                  id="preview_img"
                  class="h-24 w-24 object-cover rounded-full"
                  src={imageURL}
                  alt="Current profile photo"
                />
              ) : (
                <img
                  id="preview_img"
                  class="h-24 w-24 object-cover rounded-full"
                  src={profile}
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
          <div className="flex flex-col mb-3">
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
              className={`login-input border ${
                errors.username ? "border-red-500" : "border-gray-300"
              } p-2`}
            />
            {errors.username && (
              <p className="login-text2 text-red-500">{errors.username}</p>
            )}
          </div>

          <div className="flex flex-col mb-3">
            <label htmlFor="password" className="login-text mb-1">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                placeholder="Enter Password"
                value={password}
                onChange={(e) => {
                  if (e.target.value) {
                    let error = errors;
                    delete error.password;
                    setErrors(error);
                  }
                  setPassword(e.target.value);
                }}
                className={`login-input border ${
                  errors.password ? "border-red-500" : "border-gray-300"
                } p-2`}
              />
              <span
                className="absolute inset-y-0 right-0 flex items-center pr-3"
                onClick={() => setShowPassword(!showPassword)}
                style={{ cursor: "pointer" }}
              >
                {showPassword ? (
                  <img src={showpass} alt="icon" className="w-3 h-3" />
                ) : (
                  <img src={hidepass} alt="icon" className="w-3 h-3" />
                )}
              </span>
            </div>
            {errors.password && (
              <p className="login-text2 text-red-500">{errors.password}</p>
            )}
          </div>
          <div className="flex flex-col">
            <label htmlFor="confirmPassword" className="login-text mb-1">
              Confirm Password
            </label>
            <div className="relative">
              <input
                type={showPassword1 ? "text" : "password"}
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
                className={`login-input border ${
                  errors.confirmPassword ? "border-red-500" : "border-gray-300"
                } p-2`}
              />
              <span
                className="absolute inset-y-0 right-0 flex items-center pr-3"
                onClick={() => setShowPassword1(!showPassword1)}
                style={{ cursor: "pointer" }}
              >
                {showPassword1 ? (
                  <img src={showpass} alt="icon" className="w-3 h-3" />
                ) : (
                  <img src={hidepass} alt="icon" className="w-3 h-3" />
                )}
              </span>
            </div>
            {errors.confirmPassword && (
              <p className="login-text2 text-red-500">
                {errors.confirmPassword}
              </p>
            )}
          </div>
          <div className="flex justify-center mb-3">
            <button type="submit" className="login-btn px-5 py-2 mt-3">
              Sign up
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SignUpEditor;
