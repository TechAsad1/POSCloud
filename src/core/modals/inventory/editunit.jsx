import React, { useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import withReactContent from 'sweetalert2-react-content';
import Swal from "sweetalert2";
import { updateUnit } from '../../redux/action';

const EditUnit = (p) => {
    const dispatch = useDispatch();
    const postData = useSelector((state) => state.units);
    const [formData, setFormData] = useState({ uom: "", name: "", isActive: false });
    const [errors, setErrors] = useState({});
    //Ref
    const nameRef = useRef();

    useEffect(() => {
        if (p.isEditMode) {
            const res = postData.find((i) => i.uom === p.id);
            setFormData({ ...formData, uom: res.uom, name: res.uomname, isActive: res.isActive });
            nameRef.current.classList.remove("is-invalid");
            setErrors({ ...errors, name: "" });
        }
    }, [p.isEditMode])
    //Validation
    const validate = () => {
        let tempErrors = {};
        if (nameRef.current.value === "") {
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
            dispatch(updateUnit(p.id, formData));
            successAlert(null);
        }
    };
    //PopUp
    const MySwal = withReactContent(Swal);
    const successAlert = () => {
        MySwal.fire({
            icon: "success",
            title: "Record updated successfully",
            confirmButtonText: "Ok",
        })
    };
    //Modal IsVisible
    const handleModalClose = () => {
        p.setEditMode(false);
    }

    return (
        <div>
            {/* Edit Unit */}
            <div className="modal fade" id="edit-units" onClick={handleModalClose}>
                <div className="modal-dialog modal-dialog-centered custom-modal-two">
                    <div className="modal-content">
                        <div className="page-wrapper-new p-0">
                            <div className="content">
                                <div className="modal-header border-0 custom-modal-header">
                                    <div className="page-title">
                                        <h4>Edit Unit</h4>
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
                                        <label className="form-label">UOM Short Form</label>
                                        <input type="text" className="form-control" value={formData.uom} disabled />
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label">Name</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                            ref={nameRef} value={formData.name}
                                        />
                                        {errors.name && <p style={{ color: "#ff7676" }}>{errors.name}</p>}
                                    </div>
                                    <div className="mb-0">
                                        <div className="status-toggle modal-status d-flex justify-content-between align-items-center">
                                            <span className="status-label">Status</span>
                                            <input
                                                type="checkbox"
                                                id="user3"
                                                className="check"
                                                checked={formData.isActive}
                                                onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                                            />
                                            <label htmlFor="user3" className="checktoggle" />
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
                                        <button to="#" className="btn btn-submit" onClick={handleSubmit}>
                                            Save Changes
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

    )
}

export default EditUnit
