import { React, useEffect, useRef, useState } from 'react'
import withReactContent from 'sweetalert2-react-content';
import Swal from "sweetalert2";
import { useDispatch } from 'react-redux';
import { insertBrand } from '../../redux/action';

const AddBrand = (p) => {
    const dispatch = useDispatch();
    const [errors, setErrors] = useState({});
    const [formData, setFormData] = useState({ name: "", isActive: true, createdBy: p.userId });
    //Ref
    const nameRef = useRef();
    const formRef = useRef(null);
    useEffect(() => {
        clearForm(formRef.current);
    }, [p.insertMode]);
    useEffect(() => {
        setFormData({ ...formData, createdBy: p.userId });
    }, [p.userId]);
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
    const handleSubmit = (e) => {
        e.preventDefault();
        if (validate(e)) {
            dispatch(insertBrand(formData));
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
    const handleModalClose = () => {
        p.setInsertMode(false);
    }
    //Clear
    const clearForm = (e) => {
        nameRef.current.classList.remove("is-invalid");
        setErrors({ ...errors, name: "" });
        setFormData({ ...formData, name: "", isActive: true });
        e[0].value = "";
    }

    return (
        <>
            {/* Add Brand */}
            <div className="modal fade" id="add-brand" onClick={handleModalClose}>
                <div className="modal-dialog modal-dialog-centered custom-modal-two">
                    <div className="modal-content">
                        <div className="page-wrapper-new p-0">
                            <div className="content">
                                <div className="modal-header border-0 custom-modal-header">
                                    <div className="page-title">
                                        <h4>Create Brand</h4>
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
                                <div className="modal-body custom-modal-body new-employee-field">
                                    <form onSubmit={handleSubmit} ref={formRef}>
                                        <div className="mb-3">
                                            <label className="form-label">Brand</label>
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
                                            <button className="btn btn-submit">
                                                Create Brand
                                            </button>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {/* /Add Brand */}
        </>

    )
}

export default AddBrand
