import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { login } from "../../store/loginSlice";
import { forgetPassword } from "../../store/forgetSlice";
import bg from "../../assets/images/login.png";
import bgText from "../../assets/images/login-text.png";
import Swal from "sweetalert2";
import ForgetModal from "../ForgetModal/forgetModal";
import showpass from "../../assets/images/showpass.png";
import hidepass from "../../assets/images/hidepass.png";

const Login = (props) => {
  const role = localStorage.getItem("role");
  const token = localStorage.getItem("token");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    if (role === "admin" && token) {
      navigate("/admin");
    } else if (role === "editor" && token) {
      navigate("editor");
    } else if (role === "client" && token) {
      navigate("client");
    } else {
      setLoading(false);
    }
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    // Perform validation here
    const validationErrors = {};

    if (!email) {
      validationErrors.email = "Email is required";
    }

    if (!password) {
      validationErrors.password = "Password is required";
    }

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
    } else {
      // Submit the form
      console.log("Form submitted");
      setIsLoading(true);

      dispatch(login({ email: email, password: password }))
        .unwrap()
        .then((res) => {
          if (res.status) {
            localStorage.setItem("token", res.data.accessToken);
            localStorage.setItem("role", res.data.role);
            localStorage.setItem("name", res.data.name);
            localStorage.setItem("email", res.data.email);
            localStorage.setItem("image", res.data.image);
            localStorage.setItem("id", res.data.id);
            localStorage.setItem("isSuperAdmin", res.data.is_super_admin);
            if (res.data.role === "client")
              localStorage.setItem("clientCompany", res.data.company);
            props.login(res.data.role, res.data.accessToken);
            if (res.data.role === "admin") navigate("/admin");
            if (res.data.role === "client") navigate("/client");
            if (res.data.role === "editor") navigate("/editor");

            //window.location.reload(false);
          } else {
            Swal.fire({
              icon: "error",
              title: "Oops...",
              text: res.message,
            });
          }
          //window.location.reload(false);
          setIsLoading(false);
        })
        .catch((err) => {
          Swal.fire({
            icon: "error",
            title: "Oops...",
            text: "Something went wrong!",
          });
          setIsLoading(false);
        });
    }
  };

  return (
    <>
      {!loading && (
        <div>
          <div className="split left flex justify-center items-center flex-col">
            <img src={bg} alt="icon" className="login-img" />
            <img src={bgText} alt="icon" className="login-img w-5/6" />
          </div>
          <div className="split right flex flex-col justify-center items-center">
            <div className="mid mb-12">
              <img src={bg} alt="icon" className="login-img" />
              <img src={bgText} alt="icon" className="login-img" />
            </div>
            <form onSubmit={handleSubmit}>
              <div className="login-heading mb-4 mt-1">Log In</div>
              <div className="flex flex-col mb-3">
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
                  className={`login-input border ${
                    errors.email ? "border-red-500" : "border-gray-300"
                  } p-2`}
                />
                {errors.email && (
                  <p className="login-text2 text-red-500">{errors.email}</p>
                )}
              </div>
              <div className="flex flex-col">
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
              <div
                className="flex justify-end underline cursor-pointer"
                style={{ color: "rgba(29, 29, 31, 1)", fontSize: "10px" }}
              >
                <ForgetModal />
              </div>
              <div className="flex justify-center">
                {isLoading ? (
                  <button
                    disabled
                    type="button"
                    className="login-btn mt-4 ps-4 pe-4 pt-3 pb-3"
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
                  <button
                    type="submit"
                    className="login-btn mt-4 ps-7 pe-7 pt-3 pb-3"
                  >
                    Login
                  </button>
                )}
              </div>
            </form>
            <div
              className="absolute login-text"
              style={{ cursor: "pointer", bottom: "10px", fontWeight: "400" }}
              onClick={() => {
                navigate("/signup");
              }}
            >
              <span style={{ color: "#8E8E8E" }}>Don't have an Account?</span>{" "}
              <span style={{ color: "rgba(0, 0, 0, 1)" }}>Signup</span>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Login;
