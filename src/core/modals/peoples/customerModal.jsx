import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { insertCustomer, updateCustomer } from "../../redux/action";
import withReactContent from "sweetalert2-react-content";
import Swal from "sweetalert2";

const CustomerModal = (p) => {
  const dispatch = useDispatch();
  const postData = useSelector((state) => state.customers);
  const [formData, setFormData] = useState({ name: "", email: "", contact: "", address: "", city: "", country: "", createdBy: p.userId });
  const [errors, setErrors] = useState({});
  //Ref
  const nameRef = useRef();
  const nameRef2 = useRef();
  const formRef = useRef(null);

  const validate = (p) => {
    let tempErrors = {};
    if (p.target[0].value === "") {
      tempErrors.name = "Customer name required";
      setErrors(tempErrors);
      nameRef.current.classList.add("is-invalid");
    }
    else {
      setErrors({ ...errors, name: "" });
      nameRef.current.classList.remove("is-invalid");
    }
    return Object.keys(tempErrors).length === 0;
  };
  const handleInsert = (e) => {
    e.preventDefault();
    if (validate(e)) {
      dispatch(insertCustomer(formData));
      successAlert("Record inserted successfully");
      clearForm(e.target);
    }
  };
  const clearForm = (e) => {
    setErrors({ ...errors, name: "" });
    nameRef.current.classList.remove("is-invalid");
    setFormData({ ...formData, name: "", email: "", contact: "", address: "", city: "", country: "" });
    e[0].value = "";
    e[1].value = "";
    e[2].value = "";
    e[3].value = "";
    e[4].value = "";
    e[5].value = "";
  }
  //Update
  useEffect(() => {
    if (p.editMode) {
      if (p.type === "add")
        clearForm(formRef.current);
      else {
        const res = postData.find((i) => i.customerId === Number(p.id));
        setFormData({ ...formData, name: res.customerName, email: res.email, contact: res.contact, address: res.address, city: res.city, country: res.country });
        setErrors({ ...errors, updateName: "" });
        if (nameRef2?.current)
          nameRef2.current.classList.remove("is-invalid");
      }
    }
  }, [p.editMode])
  //Validation
  const validate2 = (p) => {
    let tempErrors = {};
    if (p.target[0].value === "") {
      tempErrors.updateName = "Customer name required";
      setErrors(tempErrors);
      if (nameRef2?.current) {
        nameRef2.current.classList.add("is-invalid");
      }
    }
    else {
      setErrors({ ...errors, updateName: "" });
      if (nameRef2?.current) {
        nameRef2.current.classList.remove("is-invalid");
      }
    }
    return Object.keys(tempErrors).length === 0;
  };
  //Submit
  const handleUpdate = (e) => {
    e.preventDefault();
    if (validate2(e)) {
      dispatch(updateCustomer(p.id, formData));
      successAlert("Record updated successfully");
    }
  };
  //PopUp
  const MySwal = withReactContent(Swal);
  const successAlert = (msg) => {
    MySwal.fire({
      icon: "success",
      title: msg,
      confirmButtonText: "Ok",
    })
  };
  //Modal IsVisible
  const handleModalClose = () => {
    p.setEditMode(false);
  }

  return (
    <>
      {/* Add Customer */}
      <div className="modal fade" id="add-units" onClick={handleModalClose}>
        <div className="modal-dialog modal-dialog-centered custom-modal-two">
          <div className="modal-content">
            <div className="page-wrapper-new p-0">
              <div className="content">
                <div className="modal-header border-0 custom-modal-header">
                  <div className="page-title">
                    <h4>Add Customer</h4>
                  </div>
                  <button
                    type="button"
                    className="close"
                    data-bs-dismiss="modal"
                    aria-label="Close"
                  >
                    <span aria-hidden="true">×</span>
                  </button>
                </div>
                <div className="modal-body custom-modal-body">
                  <form onSubmit={handleInsert} ref={formRef}>
                    <div className="row">
                      <div className="col-lg-4 pe-0">
                        <div className="mb-3">
                          <label className="form-label">Customer Name</label>
                          <input type="text" className="form-control" ref={nameRef} onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
                          {errors.name && <p style={{ color: "#ff7676" }}>{errors.name}</p>}
                        </div>
                      </div>
                      <div className="col-lg-4 pe-0">
                        <div className="mb-3">
                          <label className="form-label">Email</label>
                          <input type="email" className="form-control" onChange={(e) => setFormData({ ...formData, email: e.target.value })} />
                        </div>
                      </div>
                      <div className="col-lg-4 pe-0">
                        <div className="input-blocks">
                          <label className="mb-2">Phone</label>
                          <input
                            className="form-control"
                            type="text"
                            onChange={(e) => setFormData({ ...formData, contact: e.target.value })}
                          />
                        </div>
                      </div>
                      <div className="col-lg-12 pe-0">
                        <div className="mb-3">
                          <label className="form-label">Address</label>
                          <input type="text" className="form-control" onChange={(e) => setFormData({ ...formData, address: e.target.value })} />
                        </div>
                      </div>
                      <div className="col-lg-6 pe-0">
                        <div className="mb-3">
                          <label className="form-label">City</label>
                          <input type="text" className="form-control" onChange={(e) => setFormData({ ...formData, city: e.target.value })} />
                        </div>
                      </div>
                      <div className="col-lg-6 pe-0">
                        <div className="mb-3">
                          <label className="form-label">Country</label>
                          <input type="text" className="form-control" onChange={(e) => setFormData({ ...formData, country: e.target.value })} />
                        </div>
                      </div>
                    </div>
                    <div className="modal-footer-btn">
                      <button
                        type="button"
                        className="btn btn-cancel me-2"
                        data-bs-dismiss="modal"
                      >
                        Cancel
                      </button>
                      <button type="submit" className="btn btn-submit">
                        Submit
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* /Add Customer */}

      {/* Edit Customer */}
      <div className="modal fade" id="edit-units" onClick={handleModalClose}>
        <div className="modal-dialog modal-dialog-centered custom-modal-two">
          <div className="modal-content">
            <div className="page-wrapper-new p-0">
              <div className="content">
                <div className="modal-header border-0 custom-modal-header">
                  <div className="page-title">
                    <h4>Edit Customer</h4>
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
                  <form onSubmit={handleUpdate}>
                    <div className="row">
                      <div className="col-lg-4 pe-0">
                        <div className="mb-3">
                          <label className="form-label">Customer Name</label>
                          <input
                            type="text"
                            className="form-control"
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            value={formData?.name ?? ""}
                            ref={nameRef2}
                          />
                          {errors.updateName && <p style={{ color: "#ff7676" }}>{errors.updateName}</p>}
                        </div>
                      </div>
                      <div className="col-lg-4 pe-0">
                        <div className="mb-3">
                          <label className="form-label">Email</label>
                          <input
                            type="email"
                            className="form-control"
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            value={formData?.email ?? ""}
                          />
                        </div>
                      </div>
                      <div className="col-lg-4 pe-0">
                        <div className="input-blocks">
                          <label className="mb-2">Phone</label>
                          <input
                            className="form-control"
                            type="text"
                            onChange={(e) => setFormData({ ...formData, contact: e.target.value })}
                            value={formData?.contact ?? ""}
                          />
                        </div>
                      </div>
                      <div className="col-lg-12 pe-0">
                        <div className="mb-3">
                          <label className="form-label">Address</label>
                          <input
                            type="text"
                            className="form-control"
                            onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                            value={formData?.address ?? ""}
                          />
                        </div>
                      </div>
                      <div className="col-lg-6 pe-0">
                        <div className="mb-3">
                          <label className="form-label">City</label>
                          <input
                            type="text"
                            className="form-control"
                            onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                            value={formData?.city ?? ""}
                          />
                        </div>
                      </div>
                      <div className="col-lg-6 pe-0">
                        <div className="mb-3">
                          <label className="form-label">Country</label>
                          <input
                            type="text"
                            className="form-control"
                            onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                            value={formData?.country ?? ""}
                          />
                        </div>
                      </div>
                    </div>

                    <div className="modal-footer-btn">
                      <button
                        type="button"
                        className="btn btn-cancel me-2"
                        data-bs-dismiss="modal"
                        onClick={handleModalClose}
                      >
                        Close
                      </button>
                      <button type="submit" className="btn btn-submit">
                        Save Changes
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* /Edit Customer */}
    </>
  );
};

export default CustomerModal;
