import React, { useEffect, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { all_routes } from "../../../Router/all_routes";
import { getUsers } from "../../../core/redux/action";
import { useDispatch, useSelector } from "react-redux";

const Signin = () => {
  const [isPasswordVisible, setPasswordVisible] = useState(false);
  const togglePasswordVisibility = () => {
    setPasswordVisible((prevState) => !prevState);
  };
  const route = all_routes;
  const dispatch = useDispatch();
  const posts = useSelector((state) => state.users);
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  //Ref
  const emailRef = useRef();
  const passwordRef = useRef();

  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || route.dashboard;
  //Custom Code
  useEffect(() => {
    dispatch(getUsers());
  }, [dispatch]);
  //Validation
  const validate = () => {
    let tempErrors = {};
    if (formData.email === "") {
      tempErrors.email = "Email required";
      setErrors(tempErrors);
      emailRef.current.classList.add("is-invalid");
    }
    else {
      const user = posts.find((x) => x.loginId === formData.email);
      if (!user) {
        tempErrors.email = "Email not found!";
        emailRef.current.classList.add("is-invalid");
        setErrors(tempErrors);
      }
      else {
        if (formData.password === "") {
          tempErrors.password = "Password required";
          setErrors(tempErrors);
          passwordRef.current.classList.add("is-invalid");
        }
        else {
          if (user.passwords != formData.password) {
            tempErrors.password = "Incorrect password!";
            passwordRef.current.classList.add("is-invalid");
            setErrors(tempErrors);
          }
          else {
            setErrors({ ...errors, email: "", password: "" });
            emailRef.current.classList.remove("is-invalid");
            passwordRef.current.classList.remove("is-invalid");
            localStorage.setItem("userID", JSON.stringify(user.userId));
          }
        }
      }
    }
    return Object.keys(tempErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      navigate(from, { replace: true });
    }
  }
  console.log(posts);
  return (
    <div className="main-wrapper">
      <div className="account-content">
        <div className="login-wrapper bg-img">
          <div className="login-content" style={{ width: '100%' }}>
            <form action="index" onSubmit={handleSubmit}>
              <div className="login-userset">
                <div className="login-logo logo-normal">
                  <img src="assets/img/logo.png" alt="img" />
                </div>
                <Link to={route.dashboard} className="login-logo logo-white">
                  <img src="assets/img/logo-white.png" alt />
                </Link>
                <div className="login-userheading">
                  <h3>Sign In</h3>
                  <h4>
                    Access the Dreamspos panel using your email and passcode.
                  </h4>
                </div>
                <div className="form-login mb-3">
                  <label className="form-label">Email Address</label>
                  <div className="form-addons">
                    <input type="text" className="form- control" ref={emailRef} onChange={(e) => setFormData({ ...formData, email: e.target.value })} />
                    {errors.email && <p style={{ color: "#ff7676" }}>{errors.email}</p>}
                    <img
                      src="assets/img/icons/mail.svg"
                      alt="img"
                    />
                  </div>
                </div>
                <div className="form-login mb-3">
                  <label className="form-label">Password</label>
                  <div className="pass-group">
                    <input
                      type={isPasswordVisible ? "text" : "password"}
                      className="pass-input form-control"
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      ref={passwordRef}
                    />
                    {errors.password && <p style={{ color: "#ff7676" }}>{errors.password}</p>}
                    <span
                      className={`fas toggle-password ${isPasswordVisible ? "fa-eye" : "fa-eye-slash"
                        }`}
                      onClick={togglePasswordVisibility}
                    >
                    </span>
                  </div>
                </div>
                <div className="form-login authentication-check">
                  <div className="row">
                    <div className="col-12 d-flex align-items-center justify-content-between">
                      <div className="custom-control custom-checkbox">
                        <label className="checkboxs ps-4 mb-0 pb-0 line-height-1">
                          <input type="checkbox" className="form-control" />
                          <span className="checkmarks" />
                          Remember me
                        </label>
                      </div>
                      <div className="text-end">
                        <Link className="forgot-link" to={route.forgotPassword}>
                          Forgot Password?
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="form-login">
                  <center>
                    <button className="btn">Sign In</button>
                  </center>
                  {/* <Link to={route.dashboard} className="btn btn-login">
                    Sign In
                  </Link> */}
                </div>
                <div className="signinform">
                  <h4>
                    New on our platform?
                    <Link to={route.register} className="hover-a">
                      {" "}
                      Create an account
                    </Link>
                  </h4>
                </div>
                <div className="form-setlogin or-text">
                  <h4>OR</h4>
                </div>
                <div className="form-sociallink">
                  <ul className="d-flex">
                    <li>
                      <Link to="#" className="facebook-logo">
                        <img
                          src="assets/img/icons/facebook-logo.svg"
                          alt="Facebook"
                        />
                      </Link>
                    </li>
                    <li>
                      <Link to="#">
                        <img
                          src="assets/img/icons/google.png"
                          alt="Google"
                        />
                      </Link>
                    </li>
                    <li>
                      <Link to="#" className="apple-logo">
                        <img
                          src="assets/img/icons/apple-logo.svg"
                          alt="Apple"
                        />
                      </Link>
                    </li>
                  </ul>
                  <div className="my-4 d-flex justify-content-center align-items-center copyright-text">
                    <p>Copyright © 2023 DreamsPOS. All rights reserved</p>
                  </div>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signin;
