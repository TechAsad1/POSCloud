import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { insertClient } from "../../redux/action";
import { PlusCircle, X } from "feather-icons-react/build/IconComponents";
import { uploadImage } from "../../../helper/helpers";

const AddStore = (p) => {

    const MySwal = withReactContent(Swal);
    const dispatch = useDispatch();
    const posts = useSelector((state) => state.clients);

    const [isImageVisible, setIsImageVisible] = useState(false);
    const [getImage, setImage] = useState();
    const [getImgFile, setImgFile] = useState(null);
    const [getIsImageChange, setIsImageChange] = useState(false);

    // const [loginUser, setLoginUser] = useState(null);
    const [names, setNames] = useState([]);

    // loginUser?.userId
    const [formData, setFormData] = useState({ name: "", email: "", contact: "", address: "", city: "", country: "", createdBy: 1 });
    const [errors, setErrors] = useState({});
    //Ref
    const nameRef = useRef();
    const formRef = useRef(null);
    const picRef = useRef();
    useEffect(() => {
        if (posts?.length > 0) {
            const temp = posts.map((i) => i.clientName);
            setNames(temp);
        }
    }, [posts]);
    //Validation
    const validate = () => {
        let tempErrors = {};
        if (nameRef.current.value === "") {
            tempErrors.nameErr = "Store name required";
            setErrors(tempErrors);
        }
        else if (names.includes(nameRef.current.value)) {
            tempErrors.nameErr = "Store name already exists.. please change the store name!";
            setErrors(tempErrors);
        }
        else
            setErrors({ ...errors, nameErr: "" });
        return Object.keys(tempErrors).length === 0;
    };
    //Submit
    const handleInsert = async (e) => {
        e.preventDefault();
        if (validate()) {
            let path = "";
            if (getIsImageChange)
                path = await uploadImage(getImgFile);
            dispatch(insertClient(formData, path));
            successAlert("Record inserted successfully");
            clearForm(e.target);
        }
    };
    const clearForm = (e) => {
        setErrors({ ...errors, name: "" });
        nameRef.current.classList.remove("is-invalid");
        setFormData({ ...formData, name: "", email: "", imageName: "", contact: "", address: "", city: "", country: "" });
        e[0].value = "";
        e[1].value = "";
        e[2].value = "";
        e[3].value = "";
        e[4].value = "";
        e[5].value = "";
    }
    //PopUp
    const errorAlert = () => {
        MySwal.fire({
            icon: "error",
            title: "Invalid file type! Only JPG, JPEG, PNG, and GIF are allowed.",
            confirmButtonText: "Ok",
        })
    };
    const successAlert = (msg) => {
        MySwal.fire({
            icon: "success",
            title: msg,
            confirmButtonText: "Ok",
        })
    };
    //Modal IsVisible
    const handleModalClose = () => {
        p.setInsertMode(false);
    }

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
        picRef.current.style.width = "120px";
    }
    const removeEmptyCartImg = () => {
        picRef.current.style.backgroundImage = "none";
    }
    useEffect(() => {
        addEmptyCartImg();
    }, [getImage]);

    return (
        <div>
            <div className="modal fade" id="add-store" onClick={handleModalClose}>
                <div className="modal-dialog modal-dialog-centered custom-modal-two">
                    <div className="modal-content">
                        <div className="page-wrapper-new p-0">
                            <div className="content p-0">
                                <div className="modal-header border-0 custom-modal-header">
                                    <div className="page-title">
                                        <h4>Add Store</h4>
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
                                    <form onSubmit={handleInsert} ref={formRef}>
                                        <div className="modal-title-head">
                                            <h6 className="d-flex justify-content-start">
                                                <span><i data-feather="info" className="feather-info me-2" /></span>
                                                Store Info
                                            </h6>
                                            <div className="profile-pic-upload row">
                                                <div className="profile-pic col-lg-6" ref={picRef}>
                                                    {!isImageVisible && <span className="text-center">
                                                        <PlusCircle className="plus-down-add" />
                                                        Store Picture
                                                    </span>}
                                                    {isImageVisible && <Link to="#" style={{ position: "absolute", top: "7px", right: "7px" }}>
                                                        <X className="x-square-add remove-product" onClick={handleRemoveProduct} />
                                                    </Link>}
                                                </div>
                                                <div className="image-upload col-lg-6" style={{ background: "#FF9F43" }}>
                                                    <input type="file" className="input-blocks" accept="image/*" onChange={handleImage} style={{ height: "40px" }} />
                                                    <div className="image-uploads">
                                                        <h4 style={{ color: "#fff" }}>Change Image</h4>
                                                    </div>
                                                </div>
                                            </div>

                                        </div>
                                        <div className="row">
                                            <div className="col-lg-12">
                                                <div className="mb-3 input-blocks">
                                                    <label className="form-label">Name</label>
                                                    <input type="text" className={"form-control " + (errors.nameErr ? "is-invalid" : "")} ref={nameRef} onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
                                                    {errors.nameErr && <p style={{ color: "#ff7676" }}>{errors.nameErr}</p>}
                                                </div>
                                            </div>
                                            <div className="col-lg-12">
                                                <div className="mb-3 war-add">
                                                    <label className="mb-2">Phone Number</label>
                                                    <input
                                                        className="form-control"
                                                        type="number"
                                                        onChange={(e) => setFormData({ ...formData, contact: e.target.value })}
                                                    />
                                                </div>
                                            </div>
                                            <div className="col-lg-12">
                                                <div className="mb-3">
                                                    <label className="form-label">Email</label>
                                                    <input type="email" className="form-control" onChange={(e) => setFormData({ ...formData, email: e.target.value })} />
                                                </div>
                                            </div>
                                            <div className="col-lg-12">
                                                <div className="mb-3">
                                                    <label className="form-label">Address</label>
                                                    <input type="text" className="form-control" onChange={(e) => setFormData({ ...formData, address: e.target.value })} />
                                                </div>
                                            </div>
                                            <div className="col-lg-6">
                                                <div className="mb-3 mb-0">
                                                    <label>City</label>
                                                    <input type="text" className="form-control" onChange={(e) => setFormData({ ...formData, city: e.target.value })} />
                                                </div>
                                            </div>
                                            <div className="col-lg-6">
                                                <div className="mb-3 mb-0">
                                                    <label className="form-label">Country</label>
                                                    <input type="text" className="form-control" onChange={(e) => setFormData({ ...formData, country: e.target.value })} style={{ marginTop: "-9px" }} />
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
                                            <button type="submit" className="btn btn-submit">
                                                Create Client
                                            </button>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
};

export default AddStore;
