import React, { useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { updateBrand } from '../../redux/action';
import withReactContent from 'sweetalert2-react-content';
import Swal from "sweetalert2";

const EditBrand = (p) => {
    const dispatch = useDispatch();
    const postData = useSelector((state) => state.brands);
    const [formData, setFormData] = useState({ name: "", users: 1, isActive: false });
    const [errors, setErrors] = useState({});
    //Ref
    const nameRef = useRef();

    useEffect(() => {
        if (p.isEditMode) {
            const res = postData.find((i) => i.brandId === Number(p.id));
            setFormData({ ...formData, name: res.brandName, users: res.createdBy, isActive: res.isActive });
            nameRef.current.classList.remove("is-invalid");
            setErrors({ ...errors, name: "" });
        }
    }, [p.isEditMode])
    //Validation
    const validate = (p) => {
        let tempErrors = {};
        if (p.target[0].value === "") {
            tempErrors.name = "Brand name is required";
            setErrors(tempErrors);
            nameRef.current.classList.add("is-invalid");
        }
        else {
            nameRef.current.classList.remove("is-invalid");
            setErrors({ ...errors, name: "" });
        }
        return Object.keys(tempErrors).length === 0;
    };
    //Submit
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (validate(e)) {
            dispatch(updateBrand(p.id, formData));
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
            {/* Edit Brand */}
            <div className="modal fade" id="edit-brand" onClick={handleModalClose}>
                <div className="modal-dialog modal-dialog-centered custom-modal-two">
                    <div className="modal-content">
                        <div className="page-wrapper-new p-0">
                            <div className="content">
                                <div className="modal-header border-0 custom-modal-header">
                                    <div className="page-title">
                                        <h4>Edit Brand</h4>
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
                                <div className="modal-body custom-modal-body new-employee-field">
                                    <form onSubmit={handleSubmit}>
                                        <div className="mb-3">
                                            <label className="form-label">Brand</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                value={formData.name}
                                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                                ref={nameRef}
                                            />
                                            {errors.name && <p style={{ color: "#ff7676" }}>{errors.name}</p>}
                                        </div>
                                        <div className="mb-0">
                                            <div className="status-toggle modal-status d-flex justify-content-between align-items-center">
                                                <span className="status-label">Status</span>
                                                <input
                                                    type="checkbox"
                                                    id="user4"
                                                    className="check"
                                                    checked={formData.isActive}
                                                    onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                                                />
                                                <label htmlFor="user4" className="checktoggle" />
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
                                            <button to="#" className="btn btn-submit">
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
            {/* Edit Brand */}
        </div>
    )
}

export default EditBrand
