import React, { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Select from "react-select";
import { all_routes } from "../../Router/all_routes";
// import { DatePicker } from "antd";
import Addunits from "../../core/modals/inventory/addunits";
import AddCategory from "../../core/modals/inventory/addcategory";
import AddBrand from "../../core/modals/addbrand";
import {
  ArrowLeft,
  ChevronDown,
  ChevronUp,
  Info,
  LifeBuoy,
  PlusCircle,
  X,
} from "feather-icons-react/build/IconComponents";
import { useDispatch, useSelector } from "react-redux";
import { setToogleHeader, updateProduct } from "../../core/redux/action";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import axios from "axios";
import withReactContent from 'sweetalert2-react-content';
import Swal from "sweetalert2";
import "react-datepicker/dist/react-datepicker.css";
// import { format } from "date-fns";
import { getImageFromUrl } from "../../helper/helpers";

const EditProduct = () => {
  const route = all_routes;
  const dispatch = useDispatch();
  const data = useSelector((state) => state.toggle_header);
  const navigate = useNavigate();
  const renderCollapseTooltip = (props) => (
    <Tooltip id="refresh-tooltip" {...props}>
      Collapse
    </Tooltip>
  );
  const [isImageVisible, setIsImageVisible] = useState(true);
  const handleRemoveProduct = () => {
    setIsImageVisible(false);
    removeEmptyCartImg();
  };
  // //Custom Code
  // const [getImage, setImage] = useState();
  // const [getImgFile, setImgFile] = useState(null);
  // const [formData, setFormData] = useState({ imgPath: "", name: "", barcode: "", sku: "", category: "", brand: "", unit: "", desc: "", qty: 0, qtyAlert: 0, cPrice: 0, sPrice: 0, disc: 0, isActive: false });
  // const [errors, setErrors] = useState({});
  // const [getIsImageChange, setIsImageChange] = useState(false);
  // const catStore = useSelector((state) => state.categories);
  // const brandStore = useSelector((state) => state.brands);
  // const unitStore = useSelector((state) => state.units);
  // const [getCatList, setCatList] = useState({});
  // const [getBrandList, setBrandList] = useState({});
  // const [getUnitList, setUnitList] = useState({});
  // //Ref
  // const nameRef = useRef();
  // const cPriceRef = useRef();
  // const sPriceRef = useRef();

  // useEffect(() => {
  //   dispatch(getCategory());
  //   dispatch(getBrand());
  //   dispatch(getUnit());
  // }, [dispatch]);
  // //Category
  // useEffect(() => {
  //   setCatList(catStore.map((a) => ({
  //     ...a,
  //     value: a.categoryName,
  //     label: a.categoryName
  //   })));
  // }, [catStore]);
  // //Brand
  // useEffect(() => {
  //   setBrandList(brandStore.map((a) => ({
  //     ...a,
  //     value: a.name,
  //     label: a.name
  //   })));
  // }, [brandStore]);
  // //Unit
  // useEffect(() => {
  //   setUnitList(unitStore.map((a) => ({
  //     ...a,
  //     value: a.name,
  //     label: a.name
  //   })));
  // }, [unitStore]);
  // //Image
  // const handleImage = (e) => {
  //   const file = e.target.files;
  //   if (file) {
  //     // Allowed image extensions
  //     const validExtensions = ["jpg", "jpeg", "png", "gif"];
  //     const fileExtension = file[0].name.split(".").pop().toLowerCase();
  //     if (!validExtensions.includes(fileExtension)) {
  //       errorAlert(null);
  //       return;
  //     }
  //     setIsImageChange(true);
  //     setImgFile(e.target.files[0]);
  //     setIsImageVisible(true);
  //     const reader = new FileReader();
  //     reader.onloadend = (r) => {
  //       setImage(r.target.result);
  //     };
  //     reader.readAsDataURL(e.target.files[0]);
  //   }
  // }
  // const uploadImage = async () => {
  //   const url = 'https://localhost:7151/api/Product/uploadImg/file1';
  //   const formData = new FormData();
  //   formData.append('file', getImgFile);
  //   const response = await axios.post(url, formData, {
  //     headers: { "Content-Type": "multipart/form-data" },
  //   });
  //   return response.data.message;
  // }
  // //Validation
  // const validate = () => {
  //   let tempErrors = {};
  //   if (formData.name === "") {
  //     tempErrors.name = "Name is required";
  //     setErrors(tempErrors);
  //     nameRef.current.classList.add("is-invalid");
  //   }
  //   else if (formData.category === "") {
  //     tempErrors.category = "Category is required";
  //     setErrors(tempErrors);
  //     nameRef.current.classList.remove("is-invalid");
  //   }
  //   else if (formData.unit === "") {
  //     tempErrors.unit = "Unit is required";
  //     setErrors(tempErrors);
  //   }
  //   else if (formData.cPrice <= 0) {
  //     tempErrors.cPrice = "Cost Price is required";
  //     setErrors(tempErrors);
  //     cPriceRef.current.classList.add("is-invalid");
  //   }
  //   else if (formData.sPrice <= 0) {
  //     tempErrors.sPrice = "Sale Price is required";
  //     setErrors(tempErrors);
  //     cPriceRef.current.classList.remove("is-invalid");
  //     sPriceRef.current.classList.add("is-invalid");
  //   }
  //   return Object.keys(tempErrors).length === 0;
  // };
  // //Submit
  // const handleSubmit = async (e) => {
  //   e.preventDefault();
  //   if (validate()) {
  //     setErrors({ ...errors, name: "", category: "", unit: "", cPrice: "", sPrice: "" });
  //     if (getIsImageChange) {
  //       const path = await uploadImage();
  //       console.log(path);
  //       dispatch(insertProduct(formData, path));
  //     }
  //     else {
  //       //Empty Image
  //       dispatch(insertProduct(formData, ""));
  //     }
  //     successAlert(null);
  //   }
  // };
  // //PopUp
  // const MySwal = withReactContent(Swal);
  // const errorAlert = () => {
  //   MySwal.fire({
  //     icon: "error",
  //     title: "Invalid file type! Only JPG, JPEG, PNG, and GIF are allowed.",
  //     confirmButtonText: "Ok",
  //   })
  // };
  // const successAlert = () => {
  //   MySwal.fire({
  //     icon: "success",
  //     title: "Record inserted successfully",
  //     confirmButtonText: "Ok",
  //   })
  // };

  // const handleCategory = (selected) => {
  //   setFormData({ ...formData, category: selected.value });
  // };
  // const handleBrand = (selected) => {
  //   setFormData({ ...formData, brand: selected.value });
  // };
  // const handleUnit = (selected) => {
  //   setFormData({ ...formData, unit: selected.value });
  // };
  const id = Number(localStorage.getItem("proID"));
  const catStore = useSelector((state) => state.categories);
  const brandStore = useSelector((state) => state.brands);
  const unitStore = useSelector((state) => state.units);
  const posts = useSelector((state) => state.posts);

  const [getImage, setImage] = useState();
  const [getImgFile, setImgFile] = useState(null);
  const [getIsImageChange, setIsImageChange] = useState(false);
  const [formData, setFormData] = useState({ imgPath: "", barcode: "", name: "", categoryId: 0, brandId: 0, sku: "", desc: "", minUom: "Choose MinUom", maxUom: "Choose MaxUom", factor: 0, consumerPrice: 0, cPrice: 0, sPrice: 0, discPerc: 0, disc: 0, gstPerc: 0, gst: 0 });
  const [errors, setErrors] = useState({});

  const [getCatList, setCatList] = useState([{ value: 0, label: "Choose Category" }]);
  const [getBrandList, setBrandList] = useState([{ value: 0, label: "Choose Brand" }]);
  const [getUnitList, setUnitList] = useState([{ value: "Choose MinUom", label: "Choose MinUom" }]);

  //Select
  const [selectCategory, setSelectCategory] = useState([]);
  const [selectBrand, setSelectBrand] = useState([]);
  const [selectMinUom, setSelectMinUom] = useState([]);
  const [selectMaxUom, setSelectMaxUom] = useState([]);
  //Ref
  const nameRef = useRef();
  const cPriceRef = useRef();
  const sPriceRef = useRef();
  const picRef = useRef();
  const factorRef = useRef();

  const product = posts.find((i) => i.productId == id);
  useEffect(() => {
    if (product === undefined)
      navigate(route.productlist);
  }, [product]);


  useEffect(() => {
    addEmptyCartImg();
  }, [getImage]);
  //Category
  useEffect(() => {
    setCatList((prev) => [
      prev[0],
      ...catStore.map((x) => ({
        value: x.categoryId,
        label: x.categoryName
      }))
    ]);
  }, [catStore]);
  //Brand
  useEffect(() => {
    setBrandList((prev) => [
      prev[0],
      ...brandStore.map((x) => ({
        value: x.brandId,
        label: x.brandName
      }))
    ]);
  }, [brandStore]);
  //Unit
  useEffect(() => {
    setUnitList((prev) => [
      prev[0],
      ...unitStore.map((x) => ({
        value: x.uom,
        label: x.uomname
      }))
    ]);
  }, [unitStore]);
  useEffect(() => {
    if (id && posts.length > 0) {
      const x = posts.find((i) => i.productId == id);
      handleSelectCategory(x.categoryId);
      handleSelectBrand(x.brandId);
      handleMinUom(x.minUom);
      handleMaxUom(x.maxUom);
      setFormData({ ...formData, imgPath: x.imageName, name: x.productName, barcode: x.qrcodeBarcode, sku: x.sku, categoryId: x.categoryId, brandId: x.brandId, minUom: x.minUom, maxUom: x.maxUom, factor: x.factor, desc: x.desc, consumerPrice: x.consumerPrice, cPrice: x.purchasePrice, sPrice: x.salePrice, discPerc: x.discountPrct, disc: x.discountValue, gstPerc: x.gstprct, gst: x.gstvalue });
      if (!x?.imageName) {
        setIsImageVisible(false);
      }
      else {
        setImage(getImageFromUrl(x?.imageName));
        setIsImageVisible(true);
      }
    }
  }, [id, posts, getCatList, getBrandList, getUnitList]);
  //Image
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
    const url = 'http://localhost:5057/api/Product/uploadImg/file1';
    const formData = new FormData();
    formData.append('file', getImgFile);
    const response = await axios.post(url, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data.message;
  }
  //Validation
  const validate = () => {
    let tempErrors = {};
    if (formData.name === "") {
      tempErrors.name = "Product name is required!";
      setErrors(tempErrors);
      nameRef.current.classList.add("is-invalid");
    }
    else if (formData.categoryId === 0) {
      tempErrors.category = "Category is required!";
      setErrors(tempErrors);
      nameRef.current.classList.remove("is-invalid");
      categoryRequiredAlert();
    }
    else if (formData.minUom === "" || formData.minUom === "Choose MinUom") {
      tempErrors.minUom = "MinUom is required!";
      setErrors(tempErrors);
      nameRef.current.classList.remove("is-invalid");
      minUomRequiredAlert();
    }
    else if (formData.maxUom === "" || formData.maxUom === "Choose MaxUom") {
      tempErrors.maxUom = "MaxUom is required!";
      setErrors(tempErrors);
      nameRef.current.classList.remove("is-invalid");
      maxUomRequiredAlert();
    }
    else if (formData.cPrice <= 0) {
      tempErrors.cPrice = "Cost Price is required!";
      setErrors(tempErrors);
      nameRef.current.classList.remove("is-invalid");
      cPriceRef.current.classList.add("is-invalid");
    }
    else if (formData.sPrice <= 0) {
      tempErrors.sPrice = "Sale Price is required!";
      setErrors(tempErrors);
      nameRef.current.classList.remove("is-invalid");
      cPriceRef.current.classList.remove("is-invalid");
      sPriceRef.current.classList.add("is-invalid");
    }
    else {
      nameRef.current.classList.remove("is-invalid");
      cPriceRef.current.classList.remove("is-invalid");
      sPriceRef.current.classList.remove("is-invalid");
      setErrors({ ...errors, name: "", category: "", minUom: "", cPrice: "", sPrice: "", factor: "" });
    }
    return Object.keys(tempErrors).length === 0;
  };
  //Submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validate()) {
      if (getIsImageChange) {
        const path = await uploadImage();
        dispatch(updateProduct(id, formData, path));
      }
      else {
        if (isImageVisible) {
          dispatch(updateProduct(id, formData, formData.imgPath));
        }
        else {
          //Empty Image
          dispatch(updateProduct(id, formData, ""));
        }
      }
      successAlert();
    }
  };
  //PopUp
  const MySwal = withReactContent(Swal);
  const categoryRequiredAlert = () => {
    MySwal.fire({
      icon: "warning",
      title: "Category is required!",
      confirmButtonText: "Ok",
    })
  };
  const minUomRequiredAlert = () => {
    MySwal.fire({
      icon: "warning",
      title: "MinUom is required!",
      confirmButtonText: "Ok",
    })
  };
  const maxUomRequiredAlert = () => {
    MySwal.fire({
      icon: "warning",
      title: "MaxUom is required!",
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
  const successAlert = () => {
    MySwal.fire({
      icon: "success",
      title: "Record updated successfully",
      confirmButtonText: "Ok",
    })
  };
  const addEmptyCartImg = () => {
    picRef.current.style.backgroundImage = `url(${getImage})`;
    picRef.current.style.backgroundSize = "cover";
    picRef.current.style.backgroundPosition = "center";
    picRef.current.style.width = "120px";
  }
  const removeEmptyCartImg = () => {
    picRef.current.style.backgroundImage = "none";
  }
  //Set Select DropDown
  const handleSelectCategory = (e) => {
    setSelectCategory(getCatList.find((x) => x.value === e));
    setFormData({ ...formData, categoryId: e });
  }
  const handleSelectBrand = (e) => {
    if (e === 0) {
      setSelectBrand(getBrandList[0]);
      setFormData({ ...formData, brandId: 0 });
    }
    else {
      setSelectBrand(getBrandList.find((x) => x.value === e));
      setFormData({ ...formData, brandId: e });
    }
  }
  const handleMinUom = (selected) => {
    setFormData({ ...formData, minUom: selected });
    setSelectMinUom(getUnitList.find((x) => x.value === selected));
  };
  const handleMaxUom = (e) => {
    setFormData({ ...formData, maxUom: e })
    setSelectMaxUom(getUnitList.find((x) => x.value === e));
  }
  return (
    <div className="page-wrapper">
      <div className="content">
        <div className="page-header">
          <div className="add-item d-flex">
            <div className="page-title">
              <h4>Edit Product</h4>
            </div>
          </div>
          <ul className="table-top-head">
            <li>
              <div className="page-btn">
                <Link to={route.productlist} className="btn btn-secondary">
                  <ArrowLeft className="me-2" />
                  Back to Product
                </Link>
              </div>
            </li>
            <li>
              <OverlayTrigger placement="top" overlay={renderCollapseTooltip}>
                <Link
                  data-bs-toggle="tooltip"
                  data-bs-placement="top"
                  title="Collapse"
                  id="collapse-header"
                  className={data ? "active" : ""}
                  onClick={() => {
                    dispatch(setToogleHeader(!data));
                  }}
                >
                  <ChevronUp className="feather-chevron-up" />
                </Link>
              </OverlayTrigger>
            </li>
          </ul>
        </div>
        {/* /add */}
        <form onSubmit={handleSubmit} className="needs-validation">
          {(() => {
            const x = posts.find((i) => i.productId == id);
            return (<>
              <div className="card">
                <div className="card-body add-product pb-0">
                  <div
                    className="accordion-card-one accordion"
                    id="accordionExample"
                  >
                    <div className="accordion-item">
                      <div className="accordion-header" id="headingOne">
                        <div
                          className="accordion-button"
                          data-bs-toggle="collapse"
                          data-bs-target="#collapseOne"
                          aria-controls="collapseOne"
                        >
                          <div className="addproduct-icon">
                            <h5>
                              <Info className="add-info" />
                              <span>Product Information</span>
                            </h5>
                            <Link to="#">
                              <ChevronDown className="chevron-down-add" />
                            </Link>
                          </div>
                        </div>
                      </div>
                      <div
                        id="collapseOne"
                        className="accordion-collapse collapse show"
                        aria-labelledby="headingOne"
                        data-bs-parent="#accordionExample"
                      >
                        <div className="accordion-body">
                          <div className="row">
                            <div className="col-lg-4 col-sm-6 col-12">
                              <div className="mb-3 add-product">
                                <label className="form-label">Product Name</label>
                                <input type="text" className="form-control" ref={nameRef} defaultValue={x?.productName} onChange={(e) => setFormData({ ...formData, name: e.target.value })} required />
                                {errors.name && <p className="invalid-feedback">{errors.name}</p>}
                              </div>
                            </div>
                            <div className="col-lg-4 col-sm-6 col-12">
                              <div className="mb-3 add-product">
                                <label className="form-label">Barcode</label>
                                <input type="text" className="form-control" defaultValue={x?.qrcodeBarcode} onChange={(e) => setFormData({ ...formData, barcode: e.target.value })} />
                              </div>
                            </div>
                            <div className="col-lg-4 col-sm-6 col-12">
                              <div className="input-blocks add-product list">
                                <label>SKU</label>
                                <input
                                  type="text"
                                  className="form-control list"
                                  placeholder="Enter SKU"
                                  defaultValue={x?.sku}
                                  onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                                />
                                <Link
                                  to={route.addproduct}
                                  className="btn btn-primaryadd"
                                >
                                  Generate Code
                                </Link>
                              </div>
                            </div>
                          </div>
                          <div className="addservice-info">
                            <div className="row">
                              <div className="col-lg-4 col-sm-6 col-12">
                                <div className="mb-3 add-product">
                                  <div className="add-newplus">
                                    <label className="form-label">Category</label>
                                    <Link
                                      to="#"
                                      data-bs-toggle="modal"
                                      data-bs-target="#add-units-category"
                                    >
                                      <PlusCircle className="plus-down-add" />
                                      <span>Add New</span>
                                    </Link>
                                  </div>
                                  <Select
                                    classNamePrefix="react-select"
                                    options={getCatList}
                                    placeholder={formData.category}
                                    onChange={(e) => handleSelectCategory(e.value)}
                                    value={selectCategory}
                                  />
                                  {errors.category && <span style={{ color: "#ff7f7f" }}>{errors.category}</span>}
                                </div>
                              </div>
                              <div className="col-lg-4 col-sm-6 col-12">
                                <div className="mb-3 add-product">
                                  <div className="add-newplus">
                                    <label className="form-label">Brand</label>
                                    <Link
                                      to="#"
                                      data-bs-toggle="modal"
                                      data-bs-target="#add-units-brand"
                                    >
                                      <PlusCircle className="plus-down-add" />
                                      <span>Add New</span>
                                    </Link>
                                  </div>
                                  <Select
                                    classNamePrefix="react-select"
                                    options={getBrandList}
                                    placeholder={formData.brandId}
                                    onChange={(e) => handleSelectBrand(e.value)}
                                    value={selectBrand}
                                  />
                                </div>
                              </div>
                              <div className="col-lg-4 col-sm-6 col-12">
                                <div className="mb-3 add-product">
                                  <div className="add-newplus">
                                    <label className="form-label">Unit</label>
                                    <Link
                                      to="#"
                                      data-bs-toggle="modal"
                                      data-bs-target="#add-unit"
                                    >
                                      <PlusCircle className="plus-down-add" />
                                      <span>Add New</span>
                                    </Link>
                                  </div>
                                  <Select
                                    classNamePrefix="react-select"
                                    options={getUnitList}
                                    placeholder={formData.minUom}
                                    onChange={(e) => handleMinUom(e.value)}
                                    value={selectMinUom}
                                  />
                                  {errors.minUom && <span style={{ color: "#ff7f7f" }}>{errors.minUom}</span>}
                                </div>
                              </div>
                            </div>
                            <div className="row">
                              <div className="col-lg-4 col-sm-6 col-12">
                                <div className="mb-3 add-product">
                                  <label className="form-label">MaxUom</label>
                                  <Select
                                    classNamePrefix="react-select"
                                    options={getUnitList}
                                    placeholder="Choose MaxUom"
                                    onChange={(e) => handleMaxUom(e.value)}
                                    value={selectMaxUom}
                                  />
                                </div>
                                {errors.maxUom && <span style={{ color: "#ff7f7f" }}>{errors.maxUom}</span>}
                              </div>
                              <div className="col-lg-4 col-sm-6 col-12">
                                <div className="mb-3 add-product">
                                  <label className="form-label">Factor#</label>
                                  <input type="number" className="form-control" placeholder="factor" ref={factorRef} defaultValue={x?.factor} onChange={(e) => setFormData({ ...formData, factor: e.target.value })} />
                                  {errors.factor && <span style={{ color: "#ff7f7f" }}>{errors.factor}</span>}
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="add-product-new">
                            <div className="row">
                              {/* <div className="col-lg-4 col-sm-6 col-12">
                            <div className="mb-3 add-product">
                              <label className="form-label">Selling Type</label>
                              <Select
                                classNamePrefix="react-select"
                                options={sellingtype}
                                placeholder="Solution selling"
                              />
                            </div>
                          </div> */}
                            </div>
                          </div>
                          {/* <div className="row">
                        <div className="col-lg-6 col-sm-6 col-12">
                          <div className="mb-3 add-product">
                            <label className="form-label">
                              Barcode Symbology
                            </label>
                            <Select
                              classNamePrefix="react-select"
                              options={barcodesymbol}
                              placeholder="Code34"
                            />
                          </div>
                        </div>
                        <div className="col-lg-6 col-sm-6 col-12">
                          <div className="input-blocks add-product list">
                            <label>Item Code</label>
                            <input
                              type="text"
                              className="form-control list"
                              placeholder="Please Enter Item Code"
                            />
                            <Link
                              to={route.addproduct}
                              className="btn btn-primaryadd"
                            >
                              Generate Code
                            </Link>
                          </div>
                        </div>
                      </div> */}
                          {/* Editor */}
                          <div className="col-lg-12">
                            <div className="input-blocks summer-description-box transfer mb-3">
                              <label>Description</label>
                              <textarea
                                className="form-control h-100"
                                rows={5}
                                defaultValue={x?.productDesc}
                                onChange={(e) => setFormData({ ...formData, desc: e.target.value })}
                              />
                              <p className="mt-1">Maximum 60 Characters</p>
                            </div>
                          </div>
                          {/* /Editor */}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div
                    className="accordion-card-one accordion"
                    id="accordionExample2"
                  >
                    <div className="accordion-item">
                      <div className="accordion-header" id="headingTwo">
                        <div
                          className="accordion-button"
                          data-bs-toggle="collapse"
                          data-bs-target="#collapseTwo"
                          aria-controls="collapseTwo"
                        >
                          <div className="text-editor add-list">
                            <div className="addproduct-icon list icon">
                              <h5>
                                <LifeBuoy className="add-info" />
                                <span>Pricing &amp; Stocks</span>
                              </h5>
                              <Link to="#">
                                <ChevronDown className="chevron-down-add" />
                              </Link>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div
                        id="collapseTwo"
                        className="accordion-collapse collapse show"
                        aria-labelledby="headingTwo"
                        data-bs-parent="#accordionExample2"
                      >
                        <div className="accordion-body">
                          {/* <div className="input-blocks add-products">
                        <label className="d-block">Product Type</label>
                        <div className="single-pill-product">
                          <ul
                            className="nav nav-pills"
                            id="pills-tab1"
                            role="tablist"
                          >
                            <li className="nav-item" role="presentation">
                              <span
                                className="custom_radio me-4 mb-0 active"
                                id="pills-home-tab"
                                data-bs-toggle="pill"
                                data-bs-target="#pills-home"
                                role="tab"
                                aria-controls="pills-home"
                                aria-selected="true"
                              >
                                <input
                                  type="radio"
                                  className="form-control"
                                  name="payment"
                                />
                                <span className="checkmark" /> Single Product
                              </span>
                            </li>
                            <li className="nav-item" role="presentation">
                              <span
                                className="custom_radio me-2 mb-0"
                                id="pills-profile-tab"
                                data-bs-toggle="pill"
                                data-bs-target="#pills-profile"
                                role="tab"
                                aria-controls="pills-profile"
                                aria-selected="false"
                              >
                                <input
                                  type="radio"
                                  className="form-control"
                                  name="sign"
                                />
                                <span className="checkmark" /> Variable Product
                              </span>
                            </li>
                          </ul>
                        </div>
                      </div> */}
                          <div className="tab-content" id="pills-tabContent">
                            <div
                              className="tab-pane fade show active"
                              id="pills-home"
                              role="tabpanel"
                              aria-labelledby="pills-home-tab"
                            >
                              <div className="row">
                                <div className="col-lg-4 col-sm-6 col-12">
                                  <div className="input-blocks add-product">
                                    <label>Consumer Price</label>
                                    <input type="number" className="form-control" defaultValue={x?.consumerPrice} onChange={(e) => setFormData({ ...formData, consumerPrice: e.target.value })} />
                                  </div>
                                </div>
                                <div className="col-lg-4 col-sm-6 col-12">
                                  <div className="input-blocks add-product">
                                    <label>Cost Price</label>
                                    <input type="number" className="form-control" defaultValue={x?.purchasePrice} ref={cPriceRef} onChange={(e) => setFormData({ ...formData, cPrice: e.target.value })} required />
                                    {errors.cPrice && <p className="invalid-feedback">{errors.cPrice}</p>}
                                  </div>
                                </div>
                                <div className="col-lg-4 col-sm-6 col-12">
                                  <div className="input-blocks add-product">
                                    <label>Sale Price</label>
                                    <input type="number" className="form-control" defaultValue={x?.salePrice} ref={sPriceRef} onChange={(e) => setFormData({ ...formData, sPrice: e.target.value })} required />
                                    {errors.sPrice && <p className="invalid-feedback">{errors.sPrice}</p>}
                                  </div>
                                </div>
                              </div>
                              <div className="row">
                                <div className="col-lg-3 col-sm-6 col-12">
                                  <div className="input-blocks add-product">
                                    <label>Discount Percent(%)</label>
                                    <input type="number" placeholder="Choose" className="form-control" defaultValue={x?.discountPrct} onChange={(e) => setFormData({ ...formData, discPerc: e.target.value })} />
                                  </div>
                                </div>
                                <div className="col-lg-3 col-sm-6 col-12">
                                  <div className="input-blocks add-product">
                                    <label>Discount Amount</label>
                                    <input type="number" placeholder="Choose" className="form-control" defaultValue={x?.discountValue} onChange={(e) => setFormData({ ...formData, disc: e.target.value })} />
                                  </div>
                                </div>
                                <div className="col-lg-3 col-sm-6 col-12">
                                  <div className="input-blocks add-product">
                                    <label>Gst Percent(%)</label>
                                    <input type="number" className="form-control" defaultValue={x?.gstprct} onChange={(e) => setFormData({ ...formData, gstPerc: e.target.value })} />
                                  </div>
                                </div>
                                <div className="col-lg-3 col-sm-6 col-12">
                                  <div className="input-blocks add-product">
                                    <label>Tax(GST) Amount</label>
                                    <input type="number" className="form-control" defaultValue={x?.gstvalue} onChange={(e) => setFormData({ ...formData, gst: e.target.value })} />
                                  </div>
                                </div>
                              </div>

                              <div
                                className="accordion-card-one accordion"
                                id="accordionExample3"
                              >
                                <div className="accordion-item">
                                  <div
                                    className="accordion-header"
                                    id="headingThree"
                                  >
                                    <div
                                      className="accordion-button"
                                      data-bs-toggle="collapse"
                                      data-bs-target="#collapseThree"
                                      aria-controls="collapseThree"
                                    >
                                      <div className="addproduct-icon list">
                                        <h5>
                                          <i
                                            data-feather="image"
                                            className="add-info"
                                          />
                                          <span>Images</span>
                                        </h5>
                                        <Link to="#">
                                          <ChevronDown className="chevron-down-add" />
                                        </Link>
                                      </div>
                                    </div>
                                  </div>
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
                            </div>

                            {/* <div
                          className="tab-pane fade"
                          id="pills-profile"
                          role="tabpanel"
                          aria-labelledby="pills-profile-tab"
                        >
                          <div className="row select-color-add">
                            <div className="col-lg-6 col-sm-6 col-12">
                              <div className="input-blocks add-product">
                                <label>Variant Attribute</label>
                                <div className="row">
                                  <div className="col-lg-10 col-sm-10 col-10">
                                    <select
                                      className="form-control variant-select select-option"
                                      id="colorSelect"
                                    >
                                      <option>Choose</option>
                                      <option>Color</option>
                                      <option value="red">Red</option>
                                      <option value="black">Black</option>
                                    </select>
                                  </div>
                                  <div className="col-lg-2 col-sm-2 col-2 ps-0">
                                    <div className="add-icon tab">
                                      <Link
                                        className="btn btn-filter"
                                        data-bs-toggle="modal"
                                        data-bs-target="#add-units"
                                      >
                                        <PlusCircle className="feather feather-plus-circle" />
                                      </Link>
                                    </div>
                                  </div>
                                </div>
                              </div>
                              <div
                                className="selected-hide-color"
                                id="input-show"
                              >
                                <div className="row align-items-center">
                                  <div className="col-sm-10">
                                    <div className="input-blocks">
                                      <input
                                        className="input-tags form-control"
                                        id="inputBox"
                                        type="text"
                                        data-role="tagsinput"
                                        name="specialist"
                                        defaultValue="red, black"
                                      />
                                    </div>
                                  </div>
                                  <div className="col-lg-2">
                                    <div className="input-blocks ">
                                      <Link to="#" className="remove-color">
                                        <Trash2 />
                                      </Link>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                          <div
                            className="modal-body-table variant-table"
                            id="variant-table"
                          >
                            <div className="table-responsive">
                              <table className="table">
                                <thead>
                                  <tr>
                                    <th>Variantion</th>
                                    <th>Variant Value</th>
                                    <th>SKU</th>
                                    <th>Quantity</th>
                                    <th>Price</th>
                                    <th className="no-sort">Action</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  <tr>
                                    <td>
                                      <div className="add-product">
                                        <input
                                          type="text"
                                          className="form-control"
                                          defaultValue="color"
                                        />
                                      </div>
                                    </td>
                                    <td>
                                      <div className="add-product">
                                        <input
                                          type="text"
                                          className="form-control"
                                          defaultValue="red"
                                        />
                                      </div>
                                    </td>
                                    <td>
                                      <div className="add-product">
                                        <input
                                          type="text"
                                          className="form-control"
                                          defaultValue={1234}
                                        />
                                      </div>
                                    </td>
                                    <td>
                                      <div className="product-quantity">
                                        <span className="quantity-btn">
                                          <i
                                            data-feather="minus-circle"
                                            className="feather-search"
                                          />
                                        </span>
                                        <input
                                          type="text"
                                          className="quntity-input"
                                          defaultValue={2}
                                        />
                                        <span className="quantity-btn">
                                          +
                                          <i
                                            data-feather="plus-circle"
                                            className="plus-circle"
                                          />
                                        </span>
                                      </div>
                                    </td>
                                    <td>
                                      <div className="add-product">
                                        <input
                                          type="text"
                                          className="form-control"
                                          defaultValue={50000}
                                        />
                                      </div>
                                    </td>
                                    <td className="action-table-data">
                                      <div className="edit-delete-action">
                                        <div className="input-block add-lists">
                                          <label className="checkboxs">
                                            <input
                                              type="checkbox"
                                              defaultChecked=""
                                            />
                                            <span className="checkmarks" />
                                          </label>
                                        </div>
                                        <Link
                                          className="me-2 p-2"
                                          to="#"
                                          data-bs-toggle="modal"
                                          data-bs-target="#add-variation"
                                        >
                                          <i
                                            data-feather="plus"
                                            className="feather-edit"
                                          />
                                        </Link>
                                        <Link
                                          className="confirm-text p-2"
                                          to="#"
                                        >
                                          <i
                                            data-feather="trash-2"
                                            className="feather-trash-2"
                                          />
                                        </Link>
                                      </div>
                                    </td>
                                  </tr>
                                  <tr>
                                    <td>
                                      <div className="add-product">
                                        <input
                                          type="text"
                                          className="form-control"
                                          defaultValue="color"
                                        />
                                      </div>
                                    </td>
                                    <td>
                                      <div className="add-product">
                                        <input
                                          type="text"
                                          className="form-control"
                                          defaultValue="black"
                                        />
                                      </div>
                                    </td>
                                    <td>
                                      <div className="add-product">
                                        <input
                                          type="text"
                                          className="form-control"
                                          defaultValue={2345}
                                        />
                                      </div>
                                    </td>
                                    <td>
                                      <div className="product-quantity">
                                        <span className="quantity-btn">
                                          <i
                                            data-feather="minus-circle"
                                            className="feather-search"
                                          />
                                        </span>
                                        <input
                                          type="text"
                                          className="quntity-input"
                                          defaultValue={3}
                                        />
                                        <span className="quantity-btn">
                                          +
                                          <i
                                            data-feather="plus-circle"
                                            className="plus-circle"
                                          />
                                        </span>
                                      </div>
                                    </td>
                                    <td>
                                      <div className="add-product">
                                        <input
                                          type="text"
                                          className="form-control"
                                          defaultValue={50000}
                                        />
                                      </div>
                                    </td>
                                    <td className="action-table-data">
                                      <div className="edit-delete-action">
                                        <div className="input-block add-lists">
                                          <label className="checkboxs">
                                            <input
                                              type="checkbox"
                                              defaultChecked=""
                                            />
                                            <span className="checkmarks" />
                                          </label>
                                        </div>
                                        <Link
                                          className="me-2 p-2"
                                          to="#"
                                          data-bs-toggle="modal"
                                          data-bs-target="#edit-units"
                                        >
                                          <i
                                            data-feather="plus"
                                            className="feather-edit"
                                          />
                                        </Link>
                                        <Link
                                          className="confirm-text p-2"
                                          to="#"
                                        >
                                          <i
                                            data-feather="trash-2"
                                            className="feather-trash-2"
                                          />
                                        </Link>
                                      </div>
                                    </td>
                                  </tr>
                                </tbody>
                              </table>
                            </div>
                          </div>
                        </div> */}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* <div
                className="accordion-card-one accordion"
                id="accordionExample4"
              >
                <div className="accordion-item">
                  <div className="accordion-header" id="headingFour">
                    <div
                      className="accordion-button"
                      data-bs-toggle="collapse"
                      data-bs-target="#collapseFour"
                      aria-controls="collapseFour"
                    >
                      <div className="text-editor add-list">
                        <div className="addproduct-icon list">
                          <h5>
                            <List className="add-info" />
                            <span>Custom Fields</span>
                          </h5>
                          <Link to="#">
                            <ChevronDown className="chevron-down-add" />
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div
                    id="collapseFour"
                    className="accordion-collapse collapse show"
                    aria-labelledby="headingFour"
                    data-bs-parent="#accordionExample4"
                  >
                    <div className="accordion-body">
                      <div className="text-editor add-list add">
                        <div className="custom-filed">
                          <div className="input-block add-lists">
                            <label className="checkboxs">
                              <input type="checkbox" />
                              <span className="checkmarks" />
                              Warranties
                            </label>
                            <label className="checkboxs">
                              <input type="checkbox" />
                              <span className="checkmarks" />
                              Manufacturer
                            </label>
                            <label className="checkboxs">
                              <input type="checkbox" />
                              <span className="checkmarks" />
                              Expiry
                            </label>
                          </div>
                        </div>
                        <div className="row">
                          <div className="col-lg-4 col-sm-6 col-12">
                            <div className="input-blocks add-product">
                              <label>Discount Type</label>
                              <Select
                                classNamePrefix="react-select"
                                options={discounttype1}
                                placeholder="Choose"
                              />
                            </div>
                          </div>
                        </div>
                        <div className="row">
                          <div className="col-lg-4 col-sm-6 col-12">
                            <div className="input-blocks add-product">
                              <label>Quantity Alert</label>
                              <input type="text" className="form-control" />
                            </div>
                          </div>
                          <div className="col-lg-4 col-sm-6 col-12">
                            <div className="input-blocks">
                              <label>Manufactured Date</label>
                              <div className="input-groupicon calender-input">
                                <Calendar className="info-img" />
                                <DatePicker
                                  selected={formData.date}
                                  onChange={handleDateChange}
                                  className="datetimepicker"
                                  dateFormat="dd-MM-yyyy"
                                  placeholder="Choose Date"
                                  showTimeSelect={false}
                                  timeIntervals={null}
                                />
                              </div>
                            </div>
                          </div>
                          <div className="col-lg-4 col-sm-6 col-12">
                            <div className="input-blocks">
                              <label>Expiry On</label>
                              <div className="input-groupicon calender-input">
                                <Calendar className="info-img" />
                                <DatePicker
                                  selected={formData.expiryDate}
                                  onChange={handleDateExpiry}
                                  className="datetimepicker"
                                  dateFormat="dd-MM-yyyy"
                                  placeholder="Choose Date"
                                  showTimeSelect={false}
                                  timeIntervals={null}
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div> */}
                </div>
              </div>
            </>);
          })()}
          <div className="col-lg-12">
            <div className="btn-addproduct mb-4">
              <button type="button" className="btn btn-cancel me-2">Cancel</button>
              <button to={route.addproduct} className="btn btn-submit">Update Product</button>
            </div>
          </div>
        </form>
        {/* /add */}
      </div>
      <Addunits />
      <AddCategory />
      <AddBrand />
    </div>
  );
};

export default EditProduct;
