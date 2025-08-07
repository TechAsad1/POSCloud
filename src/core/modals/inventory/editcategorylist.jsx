import React, { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios';
import { PlusCircle, X } from "feather-icons-react/build/IconComponents";
import defImg from "../../../images/no_image.png";
import { useDispatch, useSelector } from 'react-redux';
import withReactContent from "sweetalert2-react-content";
import Swal from "sweetalert2";
import { updateCategory } from '../../redux/action';

const EditCategoryList = (p) => {
    const dispatch = useDispatch();
    const postData = useSelector((state) => state.categories);
    const [isImageVisible, setIsImageVisible] = useState(true);
    const [getImage, setImage] = useState();
    const [getImgFile, setImgFile] = useState(null);
    const [getIsImageChange, setIsImageChange] = useState(false);
    const [formData, setFormData] = useState({ imgPath: "", name: "", desc: "", isActive: false });
    const [errors, setErrors] = useState({});
    //Ref
    const nameRef = useRef();
    const picRef = useRef();
    useEffect(() => {
        if (p.isEditMode) {
            getData();
        }
    }, [p.isEditMode])
    const getData = () => {
        const res = postData.find((i) => i.categoryId === Number(p.p));
        setFormData({ ...formData, imgPath: res.imageName, name: res.categoryName, desc: res.categoryDesc, isActive: res.isActive });
        if (res.imageName === null) {
            setImage(defImg);
        }
        else {
            setImage("https://poscloud.itmechanix.com/api/Category/getImg/" + res.imageName);
            setIsImageVisible(true);
        }
        setErrors({ ...errors, name: "" });
        nameRef.current.classList.remove("is-invalid");
    }
    //Validation
    const validate = (p) => {
        let tempErrors = {};
        if (p.target[1].value === "") {
            tempErrors.name = "Category is required";
            setErrors(tempErrors);
            nameRef.current.classList.add("is-invalid");
        }
        else {
            setErrors({ ...errors, name: "" });
            nameRef.current.classList.remove("is-invalid");
        }
        return Object.keys(tempErrors).length === 0;
    };
    //Submit
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (validate(e)) {
            if (getIsImageChange) {
                const path = await uploadImage();
                dispatch(updateCategory(p.p, formData, path));
            }
            else {
                if (isImageVisible) {
                    dispatch(updateCategory(p.p, formData, formData.imgPath));
                }
                else {
                    //Empty Image
                    dispatch(updateCategory(p.p, formData, ""));
                }
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
            title: "Record updated successfully",
            confirmButtonText: "Ok",
        })
    };
    //Modal IsVisible
    const handleModalClose = () => {
        p.setEditMode(false);
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
    const uploadImage = async () => {
        const url = 'https://poscloud.itmechanix.com/api/Product/uploadImg/file1';
        const formData = new FormData();
        formData.append('file', getImgFile);
        const response = await axios.post(url, formData, {
            headers: { "Content-Type": "multipart/form-data" },
        });
        return response.data.message;
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
            {/* Edit Category */}

            <div className="modal fade" id="edit-category" onClick={handleModalClose}>
                <div className="modal-dialog modal-dialog-centered custom-modal-two">
                    <div className="modal-content">
                        <div className="page-wrapper-new p-0">
                            <div className="content">
                                <div className="modal-header border-0 custom-modal-header">
                                    <div className="page-title">
                                        <h4>Edit Category</h4>
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
                                            <div className="col-4">
                                                <div
                                                    id="collapseThree"
                                                    className="accordion-collapse collapse show"
                                                    aria-labelledby="headingThree"
                                                    data-bs-parent="#accordionExample3"
                                                >
                                                    <div className="accordion-body">
                                                        <div className="new-employee-field">
                                                            <div className="profile-pic-upload mb-2">
                                                                <div className="profile-pic" ref={picRef}>
                                                                    {!isImageVisible && <span>
                                                                        <PlusCircle className="plus-down-add" />
                                                                        Product Picture
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
                                                </div>
                                            </div>
                                        </div>


                                        <div className="mb-3">
                                            <label className="form-label">Category</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                value={formData.name}
                                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                                ref={nameRef}
                                            />
                                            {errors.name && <p style={{ color: "#ff7676" }}>{errors.name}</p>}
                                        </div>
                                        <div className="mb-3">
                                            <label className="form-label">Category Slug</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                value={formData.desc}
                                                onChange={(e) => setFormData({ ...formData, desc: e.target.value })}
                                            />
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
                                                Cancel
                                            </button>
                                            <button className="btn btn-submit">
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
            {/* /Edit Category */}
        </div>
    )
}

export default EditCategoryList
