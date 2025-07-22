import React, { useEffect, useRef, useState } from 'react'
import { PlusCircle, X } from "feather-icons-react/build/IconComponents";
import { Link } from "react-router-dom";
import { useDispatch } from 'react-redux';
import withReactContent from 'sweetalert2-react-content';
import Swal from "sweetalert2";
import { insertCategory } from '../../redux/action';
import axios from 'axios';

const AddCategoryList = (p) => {
  const dispatch = useDispatch();
  const [isImageVisible, setIsImageVisible] = useState(false);
  const [getImage, setImage] = useState();
  const [getImgFile, setImgFile] = useState(null);
  const [getIsImageChange, setIsImageChange] = useState(false);
  const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState({ imgPath: "", createdBy: p.userId, name: "", desc: "", isActive: true });
  //Ref
  const nameRef = useRef();
  const picRef = useRef();
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
    if (p.target[1].value === "") {
      tempErrors.name = "Category is required";
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
      if (getIsImageChange) {
        const path = await uploadImage();
        dispatch(insertCategory(formData, path));
        clearForm(e.target);
      }
      else {
        if (isImageVisible) {
          dispatch(insertCategory(formData, formData.imgPath));
          clearForm(e.target);
        }
        else {
          //Empty Image
          dispatch(insertCategory(formData, ""));
          clearForm(e.target);
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
      title: "Record inserted successfully",
      confirmButtonText: "Ok",
    })
  };
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
  //Clear
  const clearForm = (e) => {
    setErrors({ ...errors, name: "" });
    nameRef.current.classList.remove("is-invalid");
    setFormData({ ...formData, name: "", desc: "", isActive: true });
    handleRemoveProduct();
    e[0].value = "";
    e[1].value = "";
  }
  const handleModalClose = () => {
    p.setInsertMode(false);
  }

  return (
    <div>
      {/* Add Category */}
      <div className="modal fade" id="add-category" onClick={handleModalClose}>
        <div className="modal-dialog modal-dialog-centered custom-modal-two">
          <div className="modal-content">
            <div className="page-wrapper-new p-0">
              <div className="content">
                <div className="modal-header border-0 custom-modal-header">
                  <div className="page-title">
                    <h4>Create Category</h4>
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
                  <form onSubmit={handleSubmit} ref={formRef}>
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
                      <input type="text" className="form-control" ref={nameRef} value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
                      {errors.name && <p style={{ color: "#ff7676" }}>{errors.name}</p>}
                    </div>
                    <div className="mb-3">
                      <label className="form-label">Category Slug</label>
                      <input type="text" className="form-control" value={formData.desc} onChange={(e) => setFormData({ ...formData, desc: e.target.value })} />
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
                        Create Category
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* /Add Category */}
    </div>
  )
}

export default AddCategoryList
