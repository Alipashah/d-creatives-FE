import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import { confirmPassword } from "../../store/confirmSlice";
import bg from "../../assets/images/login.png";
import bgText from "../../assets/images/login-text.png";
import Swal from "sweetalert2";
import showpass from "../../assets/images/showpass.png";
import hidepass from "../../assets/images/hidepass.png";

const ForgetPassword = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();
  const [password, setPassword] = useState("");
  const [confirmPass, setConfirmPass] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showPassword1, setShowPassword1] = useState(false);
  const [errors, setErrors] = useState({});

  const handleSubmit = (e) => {
    e.preventDefault();

    // Perform validation here
    const validationErrors = {};
    if (!password) {
      validationErrors.password = "Password is required";
    }
    if (password && password.length < 8) {
      validationErrors.password = "Password must be more than 8 characters.";
    }
    if (!confirmPass) {
      validationErrors.confirmPass = "Confirm Password is required";
    }
    if (confirmPass && confirmPass.length < 8) {
      validationErrors.confirmPass = "Password must be more than 8 characters.";
    }

    if (
      password &&
      confirmPass &&
      password !== confirmPass &&
      password.length >= 8 &&
      confirmPass.length >= 8
    ) {
      validationErrors.confirmPass = "Passwords not matching";
    }

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
    } else {
      // Submit the form

      dispatch(
        confirmPassword({
          data: {
            id: id,
            password: password,
          },
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
            navigate("/");
          } else {
            Swal.fire({
              icon: "error",
              title: "Oops...",
              text: "Something went wrong!",
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
  };

  return (
    <div>
      <div className="split left flex justify-center items-center flex-col">
        <img src={bg} alt="icon" className="login-img" />
        <img src={bgText} alt="icon" className="login-img w-5/6" />
      </div>
      <div className="split right flex flex-col justify-center items-center">
        <div className="mid pb-4 mt-4 mb-12">
          <img src={bg} alt="icon" className="login-img" />
          <img src={bgText} alt="icon" className="login-img" />
        </div>
        <form onSubmit={handleSubmit}>
          <div className="login-heading mb-4 mt-1">Forgot Password</div>

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
              />{" "}
              <span
                className="absolute inset-y-0 right-0 flex items-center pr-5"
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
            <label htmlFor="confirmPass" className="login-text mb-1">
              Confirm Password
            </label>
            <div className="relative">
              <input
                type={showPassword1 ? "text" : "password"}
                id="confirmPass"
                placeholder="Enter Password"
                value={confirmPass}
                onChange={(e) => {
                  if (e.target.value) {
                    let error = errors;
                    delete error.confirmPass;
                    setErrors(error);
                  }
                  setConfirmPass(e.target.value);
                }}
                className={`login-input border ${
                  errors.confirmPass ? "border-red-500" : "border-gray-300"
                } p-2`}
              />
              <span
                className="absolute inset-y-0 right-0 flex items-center pr-5"
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
            {errors.confirmPass && (
              <p className="login-text2 text-red-500">{errors.confirmPass}</p>
            )}
          </div>
          <div className="flex justify-center">
            <button type="submit" className="login-btn px-5 py-2 mt-3">
              Update
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ForgetPassword;
