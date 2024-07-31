import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { login } from "../../store/loginSlice";
import bg from "../../assets/images/login.png";

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});

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

      dispatch(login({ email: email, password: password }))
        .unwrap()
        .then((res) => {
          console.log(res.status);
          if (res.status) {
            localStorage.setItem("token", res.data.accessToken);
            localStorage.setItem("role", res.data.role);
            if (res.data.role === "admin") navigate("/admin");
            if (res.data.role === "client") navigate("/client");
            if (res.data.role === "editor") navigate("/editor");
          }
        })
        .catch((err) => {
          console.log(err);
          console.log("catcchhh");
        });
    }
  };

  return (
    <div>
      <div className="split left">
        <img src={bg} alt="icon" className="login-img" />
      </div>
      <div className="relative split right flex flex-col justify-center items-center">
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
            {errors.email && <p className="text-red-500">{errors.email}</p>}
          </div>
          <div className="flex flex-col">
            <label htmlFor="password" className="login-text mb-1">
              Password
            </label>
            <input
              type="password"
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
            {errors.password && (
              <p className="text-red-500">{errors.password}</p>
            )}
          </div>
          <div className="flex justify-center">
            <button type="submit" className="login-btn px-4 py-2 mt-4">
              Login
            </button>
          </div>
        </form>
        <div className="absolute" style={{ bottom: "1px" }}>
          Don't have an Account? Signup
        </div>
      </div>
    </div>
  );
};

export default Login;
