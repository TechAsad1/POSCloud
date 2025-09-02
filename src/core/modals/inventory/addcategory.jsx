import React, { useEffect, useRef, useState } from "react";
import { all_routes } from "../../../Router/all_routes";
import withReactContent from 'sweetalert2-react-content';
import Swal from "sweetalert2";
import { useDispatch } from "react-redux";
import { insertCategory } from "../../redux/action";
import { Link } from 'react-router-dom'
import { PlusCircle, X } from 'feather-icons-react/build/IconComponents'
import { uploadImage } from "../../../helper/helpers";

const AddCategory = (p) => {
  const route = all_routes;
  const dispatch = useDispatch();
  const [name, setName] = useState("");
  const [errors, setErrors] = useState({});
  const [isImageVisible, setIsImageVisible] = useState(false);
  const [getImage, setImage] = useState();
  const [getImgFile, setImgFile] = useState(null);
  const [getIsImageChange, setIsImageChange] = useState(false);
  const picRef = useRef();
  const nameRef = useRef(null);

  //Image
  useEffect(() => {
    addEmptyCartImg();
  }, [getImage]);
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
  //Validation
  const validate = () => {
    let tempErrors = {};
    if (nameRef.current.value === "") {
      tempErrors.name = "Category is required!";
      setErrors(tempErrors);
      nameRef.current.classList.add("is-invalid");
    }
    else {
      nameRef.current.classList.remove("is-invalid");
    }
    return Object.keys(tempErrors).length === 0;
  };
  //Submit
  const handleSubmit = async () => {
    if (validate()) {
      const temp = { name: name, desc: name, isActive: true, createdBy: p.userId };
      if (getIsImageChange) {
        const path = await uploadImage(getImgFile);
        dispatch(insertCategory(temp, path));
      }
      else {
        if (isImageVisible) {
          dispatch(insertCategory(temp, temp.img));
        }
        else {
          //Empty Image
          dispatch(insertCategory(temp, ""));
        }
      }
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
  const errorAlert = () => {
    MySwal.fire({
      icon: "error",
      title: "Invalid file type! Only JPG, JPEG, PNG, and GIF are allowed.",
      confirmButtonText: "Ok",
    })
  };
  //Modal IsVisible
  const handleModalClose = () => {
    nameRef.current.value = "";
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

  return (
    <>
      {/* Add Category */}
      <div className="modal fade" id="add-units-category" onClick={handleModalClose}>
        <div className="modal-dialog modal-dialog-centered custom-modal-two">
          <div className="modal-content">
            <div className="page-wrapper-new p-0">
              <div className="content">
                <div className="modal-header border-0 custom-modal-header">
                  <div className="page-title">
                    <h4>Add New Category</h4>
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
                  <div className="col-lg-12">
                    <div className="new-employee-field">
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
                  <div className="mb-3">
                    <label className="form-label">Name</label>
                    <input type="text" className="form-control" ref={nameRef} onChange={(e) => setName(e.target.value)} />
                    {errors.name && <p style={{ color: "#ff7676" }}>{errors.name}</p>}
                  </div>
                  <div className="modal-footer-btn">
                    <button
                      to="#"
                      className="btn btn-cancel me-2"
                      data-bs-dismiss="modal"
                      onClick={handleModalClose}
                    >
                      Close
                    </button>
                    <button to={route.addproduct} className="btn btn-submit" onClick={handleSubmit}>
                      Add
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* /Add Category */}
    </>
  );
};

export default AddCategory;
