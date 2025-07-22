import React, { useEffect, useRef, useState } from "react";
import { all_routes } from "../../Router/all_routes";
import { useDispatch } from "react-redux";
import { insertBrand } from "../redux/action";
import withReactContent from 'sweetalert2-react-content';
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";

const AddBrand = () => {
  const route = all_routes;
  const dispatch = useDispatch();
  const [name, setName] = useState("");
  const [errors, setErrors] = useState({});
  const nameRef = useRef(null);
  //Validation
  const validate = () => {
    let tempErrors = {};
    if (nameRef.current.value === "") {
      tempErrors.name = "Brand name required";
      setErrors(tempErrors);
      nameRef.current.classList.add("is-invalid");
    }
    else {
      nameRef.current.classList.remove("is-invalid");
    }
    return Object.keys(tempErrors).length === 0;
  };
  //Submit
  const handleSubmit = () => {
    if (validate()) {
      const temp = { clientID: 1, branchID: 1, name: name, desc: name, createdBy: userId, isActive: true };
      dispatch(insertBrand(temp));
      successAlert(null);
    }
  };
  //PopUp
  const MySwal = withReactContent(Swal);
  const successAlert = () => {
    MySwal.fire({
      icon: "success",
      title: "Record inserted successfully",
      confirmButtonText: "Ok",
    })
  };
  //Modal IsVisible
  const handleModalClose = () => {
    nameRef.current.value = "";
  }

  const navigate = useNavigate();
  const userId = localStorage.getItem("userID");
  useEffect(() => {
    if (userId === "undefined" || userId === "0" || userId === null)
      navigate(route.signin);
  }, [userId, navigate]);
  if (userId === "undefined" || userId === "0" || userId === null)
    return null;

  return (
    <>
      {/* Add Brand */}
      <div className="modal fade" id="add-units-brand" onClick={handleModalClose}>
        <div className="modal-dialog modal-dialog-centered custom-modal-two">
          <div className="modal-content">
            <div className="page-wrapper-new p-0">
              <div className="content">
                <div className="modal-header border-0 custom-modal-header">
                  <div className="page-title">
                    <h4>Add New Brand</h4>
                  </div>
                  <button
                    type="button"
                    className="close"
                    data-bs-dismiss="modal"
                    aria-label="Close"
                    onClick={handleModalClose}
                  >
                    <span aria-hidden="true">×</span>
                  </button>
                </div>
                <div className="modal-body custom-modal-body">
                  <div className="mb-3">
                    <label className="form-label">Brand</label>
                    <input type="text" className="form-control" ref={nameRef} onChange={(e) => setName(e.target.value)}/>
                    {errors.name && <p style={{ color: "#ff7676" }}>{errors.name}</p>}
                  </div>
                  <div className="modal-footer-btn">
                    <button
                      to="#"
                      className="btn btn-cancel me-2"
                      data-bs-dismiss="modal"
                      onClick={handleModalClose}
                      >
                      Close
                    </button>
                    <button to={route.addproduct} className="btn btn-submit" onClick={handleSubmit}>
                      Add
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* /Add Brand */}
    </>
  );
};

export default AddBrand;
