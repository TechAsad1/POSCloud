import React, { useRef, useState } from "react";
import withReactContent from 'sweetalert2-react-content';
import Swal from "sweetalert2";
import { useDispatch } from "react-redux";
import { insertUnit } from "../../redux/action";

const Addunits = (p) => {
  const dispatch = useDispatch();
  const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState({ uom: "", name: "", createdBy: p.userId, isActive: true });
  //Ref
  const uomRef = useRef();
  const nameRef = useRef();

  //Validation
  const validate = () => {
    let tempErrors = {};
    if (uomRef.current.value === "") {
      tempErrors.uomErr = "UOM short form required";
      setErrors(tempErrors);
      uomRef.current.classList.add("is-invalid");
    }
    else if (nameRef.current.value === "") {
      tempErrors.name = "Unit name required";
      setErrors(tempErrors);
      nameRef.current.classList.add("is-invalid");
    }
    else {
      nameRef.current.classList.remove("is-invalid");
      setErrors({ ...errors, name: "", uomErr: "" });
    }
    return Object.keys(tempErrors).length === 0;
  };
  //Submit
  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      dispatch(insertUnit(formData));
      clearForm(e.target);
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
    p.setInsertMode(false);
  }
  //Clear
  const clearForm = (e) => {
    nameRef.current.classList.remove("is-invalid");
    setErrors({ ...errors, name: "", uomErr: "" });
    setFormData({ ...formData, name: "", uomErr: "", isActive: true });
    e[0].value = "";
  }

  return (
    <>
      {/* Add Unit */}
      <div className="modal fade" id="add-unit" onClick={handleModalClose}>
        <div className="modal-dialog modal-dialog-centered custom-modal-two">
          <div className="modal-content">
            <div className="page-wrapper-new p-0">
              <div className="content">
                <div className="modal-header border-0 custom-modal-header">
                  <div className="page-title">
                    <h4>Add Unitasdasd</h4>
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
                  <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                      <label className="form-label">UOM Short Form</label>
                      <input type="text" className="form-control" ref={uomRef} value={formData.uom} onChange={(e) => setFormData({ ...formData, uom: e.target.value })} />
                      {errors.uomErr && <p style={{ color: "#ff7676" }}>{errors.uomErr}</p>}
                    </div>
                    <div className="mb-3">
                      <label className="form-label">Unit</label>
                      <input type="text" className="form-control" ref={nameRef} value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
                      {errors.name && <p style={{ color: "#ff7676" }}>{errors.name}</p>}
                    </div>
                    <div className="mb-0">
                      <div className="status-toggle modal-status d-flex justify-content-between align-items-center">
                        <span className="status-label">Status</span>
                        <input
                          type="checkbox"
                          id="user2"
                          className="check"
                          defaultChecked="true"
                          onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                          value={formData.isActive}
                        />
                        <label htmlFor="user2" className="checktoggle" />
                      </div>
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
                      <button className="btn btn-submit">
                        Create Unit
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* /Add Unit */}
    </>
  );
};

export default Addunits;
