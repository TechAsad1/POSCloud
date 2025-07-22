import { PlusCircle, X } from 'feather-icons-react/build/IconComponents'
import React, { useEffect, useRef, useState } from 'react'
import { useDispatch } from 'react-redux'
import Select from 'react-select'
import axios from 'axios';
import withReactContent from 'sweetalert2-react-content';
import Swal from "sweetalert2";
import { insertUsers } from '../../redux/action'
import { Link } from "react-router-dom";

const AddUsers = (p) => {

    const dispatch = useDispatch();
    const [isImageVisible, setIsImageVisible] = useState(false);
    const [getImage, setImage] = useState();
    const [getImgFile, setImgFile] = useState(null);
    const [formData, setFormData] = useState({ imgPath: "", name: "", userRole: "", email: "", password: "", rePassword: "", contact: "", createdBy: p.userId });
    const [errors, setErrors] = useState({});
    const [getIsImageChange, setIsImageChange] = useState(false);
    //UseRef
    const picRef = useRef();
    const nameRef = useRef();

    useEffect(() => {
        addEmptyCartImg();
    }, [getImage]);
    //Image
    const handleRemoveProduct = () => {
        setIsImageVisible(false);
        setIsImageChange(false);
        removeEmptyCartImg();
    };
    const handleImage = (e) => {
        const file = e.target.files;
        if (file) {
            // Allowed image extensions
            const validExtensions = ["jpg", "jpeg", "png", "gif"];
            const fileExtension = file[0].name.split(".").pop().toLowerCase();
            if (!validExtensions.includes(fileExtension)) {
                errorAlert(null);
                return;
            }
            setIsImageChange(true);
            setImgFile(e.target.files[0]);
            setIsImageVisible(true);
            const reader = new FileReader();
            reader.onloadend = (r) => {
                setImage(r.target.result);
            };
            reader.readAsDataURL(e.target.files[0]);
        }
    }
    const uploadImage = async () => {
        const url = 'https://localhost:7151/api/User/uploadImg/file1';
        const formData = new FormData();
        formData.append('file', getImgFile);
        const response = await axios.post(url, formData, {
            headers: { "Content-Type": "multipart/form-data" },
        });
        return response.data.message;
        // console.log(`Upload successful! Image URL: ${response.data.message}`);
    }
    const addEmptyCartImg = () => {
        picRef.current.style.backgroundImage = `url(${getImage})`;
        picRef.current.style.backgroundSize = "cover";
        picRef.current.style.backgroundPosition = "center";
        picRef.current.style.width = "25%";
    }
    const removeEmptyCartImg = () => {
        picRef.current.style.backgroundImage = "none";
    }
    //Validation
    const validate = (p) => {
        let tempErrors = {};
        if (p.target[1].value === "") {
            tempErrors.name = "Username required";
            nameRef.current.classList.add("is-invalid");
            setErrors(tempErrors);
        }
        else if (formData.userRole === "") {
            tempErrors.role = "Userrole required";
            nameRef.current.classList.remove("is-invalid");
            setErrors(tempErrors);
        }
        else if (p.target[5].value === "") {
            tempErrors.password = "Password required";
            setErrors(tempErrors);
        }
        else if (p.target[6].value === "") {
            tempErrors.rePassword = "Confirm password required";
            setErrors(tempErrors);
        }
        else if (p.target[5].value != p.target[6].value) {
            tempErrors.rePassword = "Confirm password does not match!";
            setErrors(tempErrors);
        }
        else {
            setErrors({ ...errors, name: "", password: "", rePassword: "", role: "" });
        }
        return Object.keys(tempErrors).length === 0;
    };
    //Submit
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (validate(e)) {
            if (getIsImageChange) {
                const path = await uploadImage();
                dispatch(insertUsers(formData, path));
            }
            else {
                //Empty Image
                dispatch(insertUsers(formData, ""));
            }
            successAlert(null);
        }
    };
    //PopUp
    const MySwal = withReactContent(Swal);
    const errorAlert = () => {
        MySwal.fire({
            icon: "error",
            title: "Invalid file type! Only JPG, JPEG, PNG, and GIF are allowed.",
            confirmButtonText: "Ok",
        })
    };
    const successAlert = () => {
        MySwal.fire({
            icon: "success",
            title: "Record inserted successfully",
            confirmButtonText: "Ok",
        })
    };
    const role = [
        { value: "Choose Role", label: "Choose Role" },
        { value: "AcStore Keeper", label: "Store Keeper" },
        { value: "Salesman", label: "Salesman" },
        { value: "Manager", label: "Manager" },
        { value: "Supervisor", label: "Supervisor" },
        { value: "Store Keeper", label: "Store Keeper" },
        { value: "Purchase", label: "Purchase" },
        { value: "Delivery Biker", label: "Delivery Biker" },
        { value: "Maintenance", label: "Maintenance" },
        { value: "Quality Analyst", label: "Quality Analyst" },
        { value: "Accountant", label: "Accountant" },
    ];
    const [showPassword, setShowPassword] = useState(false);
    const handleTogglePassword = () => {
        setShowPassword((prevShowPassword) => !prevShowPassword);
    };
    const [showConfirmPassword, setConfirmPassword] = useState(false);
    const handleToggleConfirmPassword = () => {
        setConfirmPassword((prevShowPassword) => !prevShowPassword);
    };

    return (
        <div>
            {/* Add User */}
            <div className="modal fade" id="add-units">
                <div className="modal-dialog modal-dialog-centered custom-modal-two">
                    <div className="modal-content">
                        <div className="page-wrapper-new p-0">
                            <div className="content">
                                <div className="modal-header border-0 custom-modal-header">
                                    <div className="page-title">
                                        <h4>Add User</h4>
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
                                    <form onSubmit={handleSubmit}>
                                        <div className="row">
                                            <div className="col-lg-12">
                                                <div className="new-employee-field">
                                                    <span>Avatar</span>
                                                    <div className="profile-pic-upload mb-2">
                                                        <div className="profile-pic" ref={picRef}>
                                                            {!isImageVisible && <span>
                                                                <PlusCircle className="plus-down-add" />
                                                                Profile Photo
                                                            </span>}
                                                            {isImageVisible && <Link to="#" style={{ position: "absolute", top: "7px", right: "7px" }}>
                                                                <X className="x-square-add remove-product" onClick={handleRemoveProduct} />
                                                            </Link>}
                                                        </div>
                                                        <div className="input-blocks mb-0">
                                                            <div className="image-upload mb-0">
                                                                <input type="file" accept="image/*" onChange={handleImage} />
                                                                <div className="image-uploads">
                                                                    <h4>Change Image</h4>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="col-lg-6">
                                                <div className="input-blocks">
                                                    <label>User Name</label>
                                                    <input type="text" className="form-control" ref={nameRef} onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
                                                    {errors.name && <p style={{ color: "#de4554" }}>{errors.name}</p>}
                                                </div>
                                            </div>
                                            <div className="col-lg-6">
                                                <div className="input-blocks">
                                                    <label>Phone</label>
                                                    <input type="text" className="form-control" onChange={(e) => setFormData({ ...formData, contact: e.target.value })} />
                                                </div>
                                            </div>
                                            <div className="col-lg-6">
                                                <div className="input-blocks">
                                                    <label>Email</label>
                                                    <input type="email" className="form-control" onChange={(e) => setFormData({ ...formData, email: e.target.value })} />
                                                </div>
                                            </div>
                                            <div className="col-lg-6">
                                                <div className="input-blocks">
                                                    <label>Role</label>
                                                    <Select
                                                        classNamePrefix="react-select"
                                                        options={role}
                                                        placeholder="Choose Role"
                                                        onChange={(e) => setFormData({ ...formData, userRole: e.value })}
                                                    />
                                                    {errors.role && <p style={{ color: "#de4554" }}>{errors.role}</p>}
                                                </div>
                                            </div>
                                            <div className="col-lg-6">
                                                <div className="input-blocks">
                                                    <label>Password</label>
                                                    <div className="pass-group">
                                                        <input
                                                            type={showPassword ? 'text' : 'password'}
                                                            className="pass-input"
                                                            placeholder="Enter your password"
                                                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                                        />
                                                        <span
                                                            className={`fas toggle-password ${showPassword ? 'fa-eye' : 'fa-eye-slash'}`}
                                                            onClick={handleTogglePassword}
                                                        />
                                                    </div>
                                                    {errors.password && <p style={{ color: "#de4554" }}>{errors.password}</p>}
                                                </div>
                                            </div>
                                            <div className="col-lg-6">
                                                <div className="input-blocks">
                                                    <label>Confirm Passworrd</label>
                                                    <div className="pass-group">
                                                        <input
                                                            type={showConfirmPassword ? 'text' : 'password'}
                                                            className="pass-input"
                                                            placeholder="Enter your password"
                                                            onChange={(e) => setFormData({ ...formData, rePassword: e.target.value })}
                                                        />
                                                        <span
                                                            className={`fas toggle-password ${showConfirmPassword ? 'fa-eye' : 'fa-eye-slash'}`}
                                                            onClick={handleToggleConfirmPassword}
                                                        />
                                                    </div>
                                                    {errors.rePassword && <p style={{ color: "#de4554" }}>{errors.rePassword}</p>}
                                                </div>
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
                                            <button to="#" className="btn btn-submit">
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
            {/* /Add User */}
        </div>
    )
}

export default AddUsers
