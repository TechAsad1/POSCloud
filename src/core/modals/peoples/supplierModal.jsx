import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import withReactContent from "sweetalert2-react-content";
import Swal from "sweetalert2";
import { insertSupplier, updateSupplier } from "../../redux/action";

const SupplierModal = (p) => {

  const dispatch = useDispatch();
  const postData = useSelector((state) => state.suppliers);
  const [formData, setFormData] = useState({ name: "", email: "", contact: "", address: "", city: "", country: "", createdBy: p.userId });
  const [errors, setErrors] = useState({});
  //Ref
  const nameRef = useRef();
  const nameRef2 = useRef();
  const formRef = useRef(null);
  const validate = (p) => {
    let tempErrors = {};
    if (p.target[0].value === "") {
      tempErrors.name = "Supplier name required";
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
      dispatch(insertSupplier(formData));
      successAlert("Record inserted successfully");
      clearForm(e);
    }
  };
  const clearForm = (e) => {
    setErrors({ ...errors, name: "" });
    nameRef.current.classList.remove("is-invalid");
    setFormData({ ...formData, name: "", email: "", contact: "", address: "", city: "", country: "" });
    if (e[0] != null) {
      e[0].value = "";
    }
    if (e[1] != null) {
      e[1].value = "";
    }
    if (e[2] != null) {
      e[2].value = "";
    }
    if (e[3] != null) {
      e[3].value = "";
    }
    if (e[4] != null) {
      e[4].value = "";
    }
    if (e[5] != null) {
      e[5].value = "";
    }
  }
  //update
  useEffect(() => {
    if (p.editMode) {
      if (p.type === "add") {
        clearForm(formRef.current);
      }
      else {
        setErrors({ ...errors, updateName: "" });
        const x = postData.find((x) => x.distributorId === p.id);
        setFormData({ ...formData, name: x.distributorName, email: x.email, contact: x.contact, address: x.address, city: x.city, country: x.country });
        if (nameRef2?.current) {
          nameRef2.current.classList.remove("is-invalid");
        }
      }
    }
  }, [p.editMode, postData])
  const validate2 = (p) => {
    let tempErrors = {};
    if (p.target[0].value === "") {
      tempErrors.updateName = "Supplier name required";
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
      dispatch(updateSupplier(p.id, formData));
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
    <div>
      {/* Add Supplier */}
      <div className="modal fade" id="add-units" onClick={() => handleModalClose()}>
        <div className="modal-dialog modal-dialog-centered custom-modal-two">
          <div className="modal-content">
            <div className="page-wrapper-new p-0">
              <div className="content">
                <div className="modal-header border-0 custom-modal-header">
                  <div className="page-title">
                    <h4>Add Supplier</h4>
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
                      <div className="col-lg-4">
                        <div className="input-blocks">
                          <label>Supplier Name</label>
                          <input type="text" className="form-control" ref={nameRef} value={formData?.name ?? ""} onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
                          {errors.name && <p style={{ color: "#ff7676" }}>{errors.name}</p>}
                        </div>
                      </div>
                      <div className="col-lg-4">
                        <div className="input-blocks">
                          <label>Email</label>
                          <input type="email" className="form-control" value={formData?.email ?? ""} onChange={(e) => setFormData({ ...formData, email: e.target.value })} />
                        </div>
                      </div>
                      <div className="col-lg-4">
                        <div className="input-blocks">
                          <label>Phone</label>
                          <input type="text" className="form-control" value={formData?.contact ?? ""} onChange={(e) => setFormData({ ...formData, contact: e.target.value })} />
                        </div>
                      </div>
                      <div className="col-lg-12">
                        <div className="input-blocks">
                          <label>Address</label>
                          <input type="text" className="form-control" value={formData?.address ?? ""} onChange={(e) => setFormData({ ...formData, address: e.target.value })} />
                        </div>
                      </div>
                      <div className="col-lg-6 col-sm-10 col-10">
                        <div className="input-blocks">
                          <label>City</label>
                          <input type="text" className="form-control" value={formData?.city ?? ""} onChange={(e) => setFormData({ ...formData, city: e.target.value })} />
                        </div>
                      </div>
                      <div className="col-lg-6 col-sm-10 col-10">
                        <div className="input-blocks">
                          <label>Country</label>
                          <input type="text" className="form-control" value={formData?.country ?? ""} onChange={(e) => setFormData({ ...formData, country: e.target.value })} />
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
      {/* /Add Supplier */}
      {/* Edit Supplier */}
      <div className="modal fade" id="edit-units" onClick={() => handleModalClose()}>
        <div className="modal-dialog modal-dialog-centered custom-modal-two">
          <div className="modal-content">
            <div className="page-wrapper-new p-0">
              <div className="content">
                <div className="modal-header border-0 custom-modal-header">
                  <div className="page-title">
                    <h4>Edit Supplier</h4>
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
                      <div className="col-lg-4">
                        <div className="input-blocks">
                          <label>Supplier Name</label>
                          <input type="text" ref={nameRef2} className="form-control" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
                          {errors.updateName && <p style={{ color: "#ff7676" }}>{errors.updateName}</p>}
                        </div>
                      </div>
                      <div className="col-lg-4">
                        <div className="input-blocks">
                          <label>Email</label>
                          <input
                            type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          />
                        </div>
                      </div>
                      <div className="col-lg-4">
                        <div className="input-blocks">
                          <label>Phone</label>
                          <input type="text" value={formData.contact} onChange={(e) => setFormData({ ...formData, contact: e.target.value })} />
                        </div>
                      </div>
                      <div className="col-lg-12">
                        <div className="input-blocks">
                          <label>Address</label>
                          <input
                            type="text"
                            value={formData.address} onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                          />
                        </div>
                      </div>
                      <div className="col-lg-6 col-sm-10 col-10">
                        <div className="input-blocks">
                          <label>City</label>
                          <input type="text" value={formData.city} onChange={(e) => setFormData({ ...formData, city: e.target.value })} />
                        </div>
                      </div>
                      <div className="col-lg-6 col-sm-10 col-10">
                        <div className="input-blocks">
                          <label>Country</label>
                          <input type="text" value={formData.country} onChange={(e) => setFormData({ ...formData, country: e.target.value })} />
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
                        Cancel
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
      {/* /Edit Supplier */}
    </div>
  );
};

export default SupplierModal;
