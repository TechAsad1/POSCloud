import React, { useEffect, useRef, useState } from 'react'
import { useDispatch } from 'react-redux';
import withReactContent from 'sweetalert2-react-content';
import Swal from "sweetalert2";
import { insertUnit } from '../../redux/action';

const AddUnit = (p) => {
    const dispatch = useDispatch();
    const [errors, setErrors] = useState({});
    const [formData, setFormData] = useState({ uom: "", name: "", createdBy: p?.userId, isActive: true });
    //Ref
    const uomRef = useRef();
    const nameRef = useRef();

    useEffect(() => {
        clearForm();
    }, [p.insertMode]);
    useEffect(() => {
        setFormData({ ...formData, createdBy: p?.userId });
    }, [p]);
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
    const handleSubmit = async () => {
        if (validate()) {
            dispatch(insertUnit(formData));
            clearForm();
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
    //Clear
    const handleModalClose = () => {
        p.setInsertMode(false);
    }
    //Clear
    const clearForm = () => {
        nameRef.current.classList.remove("is-invalid");
        setErrors({ ...errors, name: "", uomErr: "" });
        setFormData({ ...formData, name: "", uom: "", createdBy: p?.userId, isActive: true });
        uomRef.current.value = "";
        nameRef.current.value = "";
    }
    const handleUOM = (e) => {
        if (e.length > 3) {
            let tempErrors = {};
            tempErrors.uomErr = "This field required only 3 letters, you can't add more letter's";
            setErrors(tempErrors);
            uomRef.current.classList.add("is-invalid");
        }
        else {
            setErrors({ ...errors, uomErr: "" });
            uomRef.current.classList.remove("is-invalid");
            setFormData({ ...formData, uom: e })
        }
    }
    return (
        <div>
            {/* Add Unit */}
            <div className="modal fade" id="add-units" onClick={handleModalClose}>
                <div className="modal-dialog modal-dialog-centered custom-modal-two">
                    <div className="modal-content">
                        <div className="page-wrapper-new p-0">
                            <div className="content">
                                <div className="modal-header border-0 custom-modal-header">
                                    <div className="page-title">
                                        <h4>Create Unit</h4>
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
                                    <div className="mb-3">
                                        <label className="form-label">UOM Short Form</label>
                                        <input type="text" className="form-control" ref={uomRef} value={formData.uom} onChange={(e) => handleUOM(e.target.value)} />
                                        {errors.uomErr && <p style={{ color: "#ff7676" }}>{errors.uomErr}</p>}
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label">Name</label>
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
                                            type="button"
                                            className="btn btn-cancel me-2"
                                            data-bs-dismiss="modal"
                                        >
                                            Close
                                        </button>
                                        <button to="#" className="btn btn-submit" onClick={handleSubmit}>
                                            Create Unit
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {/* /Add Unit */}
        </div>
    )
}

export default AddUnit
