import { PlusCircle, X } from 'feather-icons-react/build/IconComponents'
import React, { useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom'
import Select from 'react-select'
import { updateUsers } from '../../redux/action';
import withReactContent from 'sweetalert2-react-content';
import Swal from "sweetalert2";
import { getImageFromUrl, uploadImage } from '../../../helper/helpers';

const EditUser = (p) => {
    const role = [
        { value: "Choose Role", label: "Choose Role" },
        { value: "Admin", label: "Admin" },
        { value: "AcStore Keeper", label: "Store Keeper" },
        { value: "Salesman", label: "Salesman" },
        { value: "Manager", label: "Manager" },
        { value: "Supervisor", label: "Supervisor" },
        { value: "SuperAdmin", label: "SuperAdmin" },
        { value: "Store Keeper", label: "Store Keeper" },
        { value: "Purchase", label: "Purchase" },
        { value: "Delivery Biker", label: "Delivery Biker" },
        { value: "Maintenance", label: "Maintenance" },
        { value: "Quality Analyst", label: "Quality Analyst" },
        { value: "Accountant", label: "Accountant" },
    ];
    const dispatch = useDispatch();
    const users = useSelector((state) => state.users);
    const [getImage, setImage] = useState();
    const [errors, setErrors] = useState({});
    const [getImgFile, setImgFile] = useState(null);
    const [formData, setFormData] = useState({ imgPath: "", name: "", userRole: "", email: "", password: "", rePassword: "", contact: "" });
    const [getIsImageChange, setIsImageChange] = useState(false);
    const [isImageVisible, setIsImageVisible] = useState(false);
    //Select
    const [selectUserRole, setUserRole] = useState(role[0]);
    //UseRef
    const picRef = useRef();
    const nameRef = useRef();
    useEffect(() => {
        addEmptyCartImg();
    }, [getImage]);
    useEffect(() => {
        if (p.isEditMode) {
            const x = users.find((i) => i.userId === p.id);
            setFormData({
                ...formData,
                name: x.userName,
                imgPath: x.img,
                userRole: x.userRole,
                email: x.loginId,
                password: x.passwords,
                rePassword: x.passwords,
                contact: x.contact
            });
            if (x.img === "" || x.img === null) {
                setIsImageVisible(false);
                setImage("");
            }
            else {
                setImage(getImageFromUrl(x.img));
                setIsImageVisible(true);
            }
            handleSelectRole(x.userRole);
        }
    }, [p.isEditMode, users]);

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
            tempErrors.nameErr = "UserName required";
            nameRef.current.classList.add("is-invalid");
            setErrors(tempErrors);
        }
        else if (formData.userRole === "") {
            tempErrors.roleErr = "UserRole required";
            nameRef.current.classList.remove("is-invalid");
            setErrors(tempErrors);
        }
        else if (p.target[5].value === "") {
            tempErrors.passwordErr = "Password required";
            setErrors(tempErrors);
        }
        else if (p.target[6].value === "") {
            tempErrors.rePasswordErr = "Confirm password required";
            setErrors(tempErrors);
        }
        else if (p.target[5].value != p.target[6].value) {
            tempErrors.rePasswordErr = "Confirm password does not match!";
            setErrors(tempErrors);
        }
        else
            setErrors({ ...errors, nameErr: "", passwordErr: "", rePasswordErr: "", roleErr: "" });
        return Object.keys(tempErrors).length === 0;
    };
    //Submit
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (validate(e)) {
            if (getIsImageChange) {
                const path = await uploadImage(getImgFile);
                dispatch(updateUsers(p.id, formData, path));
            }
            else {
                if (isImageVisible) {
                    dispatch(updateUsers(p.id, formData, formData.imgPath));
                }
                else {
                    //Empty Image
                    dispatch(updateUsers(p.id, formData, ""));
                }
            }
            successAlert(null);
        }
    };
    //Modal IsVisible
    const handleModalClose = () => {
        p.setEditMode(false);
    }
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
            title: "Record updated successfully",
            confirmButtonText: "Ok",
        })
    };
    const [showPassword, setShowPassword] = useState(false);
    const handleTogglePassword = () => {
        setShowPassword((prevShowPassword) => !prevShowPassword);
    };
    const [showConfirmPassword, setConfirmPassword] = useState(false);
    const handleToggleConfirmPassword = () => {
        setConfirmPassword((prevShowPassword) => !prevShowPassword);
    };
    const handleSelectRole = (e) => {
        setUserRole(role.find((x) => x.value?.toLowerCase() === e?.toLowerCase()));
    }
    return (
        <div>
            {/* Edit User */}
            <div className="modal fade" id="edit-units" onClick={() => handleModalClose()}>
                <div className="modal-dialog modal-dialog-centered custom-modal-two">
                    <div className="modal-content">
                        <div className="page-wrapper-new p-0">
                            <div className="content">
                                <div className="modal-header border-0 custom-modal-header">
                                    <div className="page-title">
                                        <h4>Edit User</h4>
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
                                                    <input type="text" readOnly className={"form-control " + (errors.nameErr ? "is-invalid" : "")} ref={nameRef} value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
                                                    {errors.nameErr && <p style={{ color: "#ff7676" }}>{errors.nameErr}</p>}
                                                </div>
                                            </div>
                                            <div className="col-lg-6">
                                                <div className="input-blocks">
                                                    <label>Phone</label>
                                                    <input type="text" readOnly className="form-control" value={formData.contact} onChange={(e) => setFormData({ ...formData, contact: e.target.value })} />
                                                </div>
                                            </div>
                                            <div className="col-lg-6">
                                                <div className="input-blocks">
                                                    <label>Email</label>
                                                    <input type="email" readOnly className="form-control" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} />
                                                </div>
                                            </div>
                                            <div className="col-lg-6">
                                                <div className="input-blocks">
                                                    <label>Role</label>
                                                    <Select
                                                        classNamePrefix="react-select"
                                                        options={role}
                                                        placeholder={formData.userRole}
                                                        onChange={(e) => handleSelectRole(e.value)}
                                                        value={selectUserRole}
                                                        isDisabled
                                                    />
                                                    {errors.roleErr && <p style={{ color: "#ff7676" }}>{errors.roleErr}</p>}
                                                </div>
                                            </div>
                                            <div className="col-lg-6">
                                                <div className="input-blocks">
                                                    <label>Password</label>
                                                    <div className="pass-group">
                                                        <input
                                                            type={showPassword ? 'text' : 'password'}
                                                            className={"pass-input " + (errors.nameErr ? "is-invalid" : "")}
                                                            placeholder="Enter your password"
                                                            value={formData.password}
                                                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                                        />
                                                        <span
                                                            className={`fas toggle-password ${showPassword ? 'fa-eye' : 'fa-eye-slash'}`}
                                                            onClick={handleTogglePassword}
                                                        />
                                                    </div>
                                                    {errors.passwordErr && <p style={{ color: "#ff7676" }}>{errors.passwordErr}</p>}
                                                </div>
                                            </div>
                                            <div className="col-lg-6">
                                                <div className="input-blocks">
                                                    <label>Confirm Passworrd</label>
                                                    <div className="pass-group">
                                                        <input
                                                            type={showConfirmPassword ? 'text' : 'password'}
                                                            className={"pass-input " + (errors.nameErr ? "is-invalid" : "")}
                                                            placeholder="Enter your password"
                                                            value={formData.rePassword}
                                                            onChange={(e) => setFormData({ ...formData, rePassword: e.target.value })}
                                                        />
                                                        <span
                                                            className={`fas toggle-password ${showConfirmPassword ? 'fa-eye' : 'fa-eye-slash'}`}
                                                            onClick={handleToggleConfirmPassword}
                                                        />
                                                    </div>
                                                    {errors.rePasswordErr && <p style={{ color: "#ff7676" }}>{errors.rePasswordErr}</p>}
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
            {/* /Edit User */}
        </div>
    )
}

export default EditUser
