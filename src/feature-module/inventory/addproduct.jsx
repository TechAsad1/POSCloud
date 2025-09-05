import React, { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Select from "react-select";
import { all_routes } from "../../Router/all_routes";
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
import { getBrand, getCategory, getUnit, insertProduct, setToogleHeader } from "../../core/redux/action";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import withReactContent from 'sweetalert2-react-content';
import Swal from "sweetalert2";
import { uploadImage } from "../../helper/helpers";

const AddProduct = () => {
  const route = all_routes;
  const dispatch = useDispatch();
  const data = useSelector((state) => state.toggle_header);
  const renderCollapseTooltip = (props) => (
    <Tooltip id="refresh-tooltip" {...props}>
      Collapse
    </Tooltip>
  );
  const [isImageVisible, setIsImageVisible] = useState(false);
  const handleRemoveProduct = () => {
    setIsImageVisible(false);
    setIsImageChange(false);
    removeEmptyCartImg();
  };

  //Custom Code
  const [userId, setUserId] = useState(0);
  const catStore = useSelector((state) => state.categories);
  const brandStore = useSelector((state) => state.brands);
  const unitStore = useSelector((state) => state.units);
  const [getImage, setImage] = useState();
  const [getImgFile, setImgFile] = useState(null);
  const [getIsImageChange, setIsImageChange] = useState(false);
  const [formData, setFormData] = useState({ createdBy: userId, imgPath: "", date: new Date(), barcode: "", name: "", categoryId: 0, brandId: 0, sku: "", desc: "", minUom: "Choose MinUom", maxUom: "Choose MaxUom", factor: 0, consumerPrice: 0, cPrice: 0, sPrice: 0, discPerc: 0, disc: 0, gstPerc: 0, gst: 0 });
  const [errors, setErrors] = useState({});

  const [catList, setCatList] = useState([{ value: 0, label: "Choose Category" }]);
  const [selectCategory, setSelectCategory] = useState(catList[0]);

  const [brandList, setBrandList] = useState([{ value: 0, label: "Choose Brand" }]);
  const [selectBrand, setSelectBrand] = useState(brandList[0]);

  const [unitList, setUnitList] = useState([{ value: "Choose Uom", label: "Choose Uom" }]);
  const [selectMinUom, setSelectMinUom] = useState(unitList[0]);

  const [selectMaxUom, setSelectMaxUom] = useState(unitList[0]);

  //Ref
  const nameRef = useRef();
  const cPriceRef = useRef();
  const sPriceRef = useRef();
  const picRef = useRef();
  const factorRef = useRef();

  useEffect(() => {
    dispatch(getCategory());
    dispatch(getBrand());
    dispatch(getUnit());
  }, [dispatch]);
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
    addEmptyCartImg();
  }, [getImage]);
  useEffect(() => {
    setFormData({ ...formData, createdBy: userId });
  }, [userId]);
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
  // const uploadImage = async () => {
  //   const url = 'https://poscloud.itmechanix.com/api/Product/uploadImg/file1';
  //   const formData = new FormData();
  //   formData.append('file', getImgFile);
  //   const response = await axios.post(url, formData, {
  //     headers: { "Content-Type": "multipart/form-data" },
  //   });
  //   return response.data.message;
  // }
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
        const path = await uploadImage(getImgFile);
        dispatch(insertProduct(formData, path));
        clearForm(e.target);
      }
      else {
        //Empty Image
        dispatch(insertProduct(formData, ""));
        clearForm(e.target);
      }
      successAlert(null);
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
      title: "Record inserted successfully",
      confirmButtonText: "Ok",
    })
  };
  const handleCategory = (selected) => {
    setFormData({ ...formData, categoryId: selected.value });
    setSelectCategory(catList.find((x) => x.value === selected.value));
  };
  const handleBrand = (selected) => {
    setFormData({ ...formData, brandId: selected.value });
    setSelectBrand(brandList.find((x) => x.value === selected.value));
  };
  const handleMinUom = (selected) => {
    setFormData({ ...formData, minUom: selected.value });
    setSelectMinUom(unitList.find((x) => x.value === selected.value));
  };
  const handleMaxUom = (e) => {
    setFormData({ ...formData, maxUom: e })
    setSelectMaxUom(unitList.find((x) => x.value === e));
  }
  const addEmptyCartImg = () => {
    if (getImage) {
      picRef.current.style.backgroundImage = `url(${getImage})`;
      picRef.current.style.backgroundSize = "cover";
      picRef.current.style.backgroundPosition = "center";
      picRef.current.style.width = "120px";
    }
  }
  const removeEmptyCartImg = () => {
    picRef.current.style.backgroundImage = "none";
  }
  //Clear
  const clearForm = (e) => {
    setErrors({ ...errors, name: "", category: "", minUom: "", cPrice: "", sPrice: "", factor: "", maxUom: "" });
    nameRef.current.classList.remove("is-invalid");
    cPriceRef.current.classList.remove("is-invalid");
    sPriceRef.current.classList.remove("is-invalid");
    setFormData({ ...formData, name: "", barcode: "", categoryId: 0, brandId: 0, sku: "", minUom: "", maxUom: "" });
    handleRemoveProduct();
    setSelectCategory(catList[0]);
    setSelectBrand(brandList[0]);
    setSelectMinUom(unitList[0]);
    setSelectMaxUom(unitList[0]);
    e[0].value = "";
    e[1].value = "";
    e[2].value = "";
    e[7].value = "";
    e[8].value = "";
    e[9].value = "";
    e[10].value = "";
    e[11].value = "";
    e[12].value = "";
    e[14].value = "";
    e[15].value = "";
  }

  const toNum = (val) => parseFloat(val) || 0;

  const setDiscount = (num) => {
    let _discPerc = toNum(formData.discPerc);
    let _disc = toNum(formData.disc);
    if (_discPerc > 0)
      _disc = (num * _discPerc) / 100;
    else
      _discPerc = (_disc / num) * 100;
    setFormData({ ...formData, discPerc: _discPerc });
    return _disc;
  }
  const setGst = (num) => {
    let _gstPerc = toNum(formData.gstPerc);
    let _gst = toNum(formData.gst);
    if (_gstPerc > 0)
      _gst = (num * _gstPerc) / 100;
    else
      _gstPerc = (_gst / num) * 100;
    setFormData({ ...formData, gstPerc: _gstPerc });
    return _gst;
  }

  const consumer_KeyDown = (consumerPrice) => {
    let _consumerPrice = toNum(consumerPrice);
    let _sPrice = 0;
    let _disc = 0;
    let _gst = 0;
    _disc = setDiscount(_consumerPrice);
    _gst = setGst(_consumerPrice);
    _sPrice = _consumerPrice - _disc + _gst;
    if (_consumerPrice > 0)
      setFormData({ ...formData, consumerPrice: _consumerPrice, sPrice: _sPrice, disc: _disc, gst: _gst });
    else
      setFormData({ ...formData, consumerPrice: consumerPrice, sPrice: _sPrice, disc: _disc, gst: _gst });
  }

  const salePrice_KeyDown = (salePrice) => {
    let _salePrice = toNum(salePrice);
    let _consumerPrice = 0;
    let _discPerc = toNum(formData.discPerc);
    let _gstPerc = toNum(formData.gstPerc);
    let _disc = toNum(formData.disc);
    let _gst = toNum(formData.gst);

    if (!(_discPerc > 0)) {
      _disc = setDiscount(_salePrice);
    }
    if (!(_gstPerc > 0)) {
      _gst = setGst(_salePrice);
    }

    _consumerPrice = _salePrice + _disc + _gst;
    if (_salePrice > 0)
      setFormData({ ...formData, consumerPrice: _consumerPrice, sPrice: _salePrice, disc: _disc, gst: _gst });
    else
      setFormData({ ...formData, consumerPrice: _consumerPrice, sPrice: salePrice, disc: _disc, gst: _gst });
  }

  const discPerc_KeyDown = (discPerc) => {
    let _discPerc = toNum(discPerc);
    let _consumerPrice = toNum(formData.consumerPrice);
    let _salePrice = toNum(formData.sPrice);
    let _gst = 0;
    let _disc = 0;

    if (_consumerPrice > 0) {
      _disc = (_discPerc * _consumerPrice) / 100;
      _gst = setGst(_consumerPrice);
      _salePrice = _consumerPrice - _disc + _gst;
    }
    else {
      _disc = (_discPerc * _salePrice) / 100;
      _gst = setGst(_salePrice);
      _consumerPrice = _salePrice + _disc + _gst;
    }
    if (_discPerc > 0)
      setFormData({ ...formData, consumerPrice: _consumerPrice, sPrice: _salePrice, discPerc: _discPerc, disc: _disc, gst: _gst });
    else
      setFormData({ ...formData, consumerPrice: _consumerPrice, sPrice: _salePrice, discPerc: discPerc, disc: _disc, gst: _gst });
  }

  const disc_KeyDown = (disc) => {
    let _disc = toNum(disc);
    let _consumerPrice = toNum(formData.consumerPrice);
    let _salePrice = toNum(formData.sPrice);
    let _gst = 0;
    let _discPerc = 0;

    if (_consumerPrice > 0) {
      _discPerc = (_disc / _consumerPrice) * 100;
      _gst = setGst(_consumerPrice);
      _salePrice = _consumerPrice - _disc + _gst;
    }
    else {
      _discPerc = (_disc / _salePrice) * 100;
      _gst = setGst(_salePrice);
      _consumerPrice = _salePrice + _disc + _gst;
    }
    if (_disc > 0)
      setFormData({ ...formData, consumerPrice: _consumerPrice, sPrice: _salePrice, discPerc: _discPerc, disc: _disc, gst: _gst });
    else
      setFormData({ ...formData, consumerPrice: _consumerPrice, sPrice: _salePrice, discPerc: _discPerc, disc: disc, gst: _gst });
  }

  const gstPerc_KeyDown = (gstPerc) => {
    let _gstPerc = toNum(gstPerc);
    let _consumerPrice = toNum(formData.consumerPrice);
    let _salePrice = toNum(formData.sPrice);
    let _gst = 0;
    let _disc = 0;

    if (_consumerPrice > 0) {
      _gst = (_gstPerc * _consumerPrice) / 100;
      _disc = setDiscount(_consumerPrice);
      _salePrice = _consumerPrice - _disc + _gst;
    }
    else {
      _gst = (_gstPerc * _salePrice) / 100;
      _disc = setDiscount(_salePrice);
      _consumerPrice = _salePrice + _disc + _gst;
    }
    if (_gstPerc > 0)
      setFormData({ ...formData, consumerPrice: _consumerPrice, sPrice: _salePrice, gstPerc: _gstPerc, disc: _disc, gst: _gst });
    else
      setFormData({ ...formData, consumerPrice: _consumerPrice, sPrice: _salePrice, gstPerc: gstPerc, disc: _disc, gst: _gst });
  }

  const gst_KeyDown = (gst) => {
    let _gst = toNum(gst);
    let _consumerPrice = toNum(formData.consumerPrice);
    let _salePrice = toNum(formData.sPrice);
    let _gstPerc = 0;
    let _disc = 0;

    if (_consumerPrice > 0) {
      _gstPerc = (_gst / _consumerPrice) * 100;
      _disc = setDiscount(_consumerPrice);
      _salePrice = _consumerPrice - _disc + _gst;
    }
    else {
      _gstPerc = (_gst / _salePrice) * 100;
      _disc = setDiscount(_salePrice);
      _consumerPrice = _salePrice + _disc + _gst;
    }
    if (_gst > 0)
      setFormData({ ...formData, consumerPrice: _consumerPrice, sPrice: _salePrice, gstPerc: _gstPerc, disc: _disc, gst: _gst });
    else
      setFormData({ ...formData, consumerPrice: _consumerPrice, sPrice: _salePrice, gstPerc: _gstPerc, disc: _disc, gst: gst });
  }

  console.log("!");
  const navigate = useNavigate();
  const val = localStorage.getItem("userID");
  useEffect(() => {
    if (!isNaN(val) && Number.isInteger(Number(val)) && Number(val) > 0) {
      const id = Number(val);
      setUserId(id);
    }
    else
      navigate(route.signin);
  }, [navigate]);
  if (userId === 0)
    return null;

  return (
    <div className="page-wrapper">
      <div className="content">
        <div className="page-header">
          <div className="add-item d-flex">
            <div className="page-title">
              <h4>New Product</h4>
              <h6>Create new product</h6>
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
        <span>!</span>
        {/* /add */}
        <form onSubmit={handleSubmit} className="needs-validation">
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
                      <div className="row"></div>
                      <div className="row">
                        <div className="col-lg-4 col-sm-6 col-12">
                          <div className="mb-3 add-product">
                            <label className="form-label">Product Name</label>
                            <input type="text" className="form-control" ref={nameRef} onChange={(e) => setFormData({ ...formData, name: e.target.value })} required />
                            {errors.name && <p className="invalid-feedback">{errors.name}</p>}
                          </div>
                        </div>
                        <div className="col-lg-4 col-sm-6 col-12">
                          <div className="mb-3">
                            <label className="form-label">Barcode</label>
                            <input type="text" className="form-control" onChange={(e) => setFormData({ ...formData, barcode: e.target.value })} />
                          </div>
                        </div>
                        <div className="col-lg-4 col-sm-6 col-12">
                          <div className="input-blocks add-product list">
                            <label>SKU</label>
                            <input
                              type="text"
                              className="form-control list"
                              placeholder="Enter SKU"
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
                      <div className="add-product-new">
                        <div className="row">
                          {/* Category */}
                          <div className="col-lg-6 col-sm-6 col-12">
                            <div className="mb-3 add-product is-invalid">
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
                                options={catList}
                                placeholder="Choose Category"
                                onChange={handleCategory}
                                value={selectCategory}
                                required
                              />
                              {errors.category && <span style={{ color: "#ff7f7f" }}>{errors.category}</span>}
                            </div>
                          </div>
                          {/* Brand */}
                          <div className="col-lg-6 col-sm-6 col-12">
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
                                options={brandList}
                                placeholder="Choose Brand"
                                onChange={handleBrand}
                                value={selectBrand}
                              />
                            </div>
                          </div>
                        </div>
                        <div className="row">

                          {/* Unit */}
                          <div className="col-lg-4 col-sm-6 col-12">
                            <div className="mb-3 add-product">
                              <div className="add-newplus">
                                <label className="form-label">MinUom</label>
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
                                options={unitList}
                                placeholder="Choose MinUom"
                                onChange={handleMinUom}
                                value={selectMinUom}
                                required
                              />
                              {errors.minUom && <span style={{ color: "#ff7f7f" }}>{errors.minUom}</span>}
                            </div>
                          </div>

                          <div className="col-lg-4 col-sm-6 col-12">
                            <div className="mb-3 add-product">
                              <label className="form-label">Factor#</label>
                              <input type="number" className="form-control" placeholder="factor" ref={factorRef} defaultValue={0} onChange={(e) => setFormData({ ...formData, factor: e.target.value })} />
                              {errors.factor && <span style={{ color: "#ff7f7f" }}>{errors.factor}</span>}
                            </div>
                          </div>

                          <div className="col-lg-4 col-sm-6 col-12">
                            <div className="mb-3 add-product">
                              <label className="form-label">MaxUom</label>
                              <Select
                                classNamePrefix="react-select"
                                options={unitList}
                                placeholder="Choose MaxUom"
                                onChange={(e) => handleMaxUom(e.value)}
                                value={selectMaxUom}
                              />
                            </div>
                            {errors.maxUom && <span style={{ color: "#ff7f7f" }}>{errors.maxUom}</span>}
                          </div>

                        </div>
                      </div>
                      {/* Editor Description */}
                      <div className="col-lg-12">
                        <div className="input-blocks summer-description-box transfer mb-3">
                          <label>Description</label>
                          <textarea
                            className="form-control h-100"
                            rows={5}
                            defaultValue={""}
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
                                <label>Purchase Price</label>
                                <input type="number" className="form-control" defaultValue="0" ref={cPriceRef} onChange={(e) => setFormData({ ...formData, cPrice: e.target.value })} required />
                                {errors.cPrice && <p className="invalid-feedback">{errors.cPrice}</p>}
                              </div>
                            </div>
                            <div className="col-lg-4 col-sm-6 col-12">
                              <div className="input-blocks add-product">
                                <label>Consumer Price</label>
                                <input type="number" className="form-control" defaultValue="0" value={formData.consumerPrice} onChange={(e) => consumer_KeyDown(e.target.value)} />
                              </div>
                            </div>
                            <div className="col-lg-4 col-sm-6 col-12">
                              <div className="input-blocks add-product">
                                <label>Sale Price</label>
                                <input type="number" className="form-control" defaultValue="0" value={formData.sPrice} ref={sPriceRef} onChange={(e) => salePrice_KeyDown(e.target.value)} required />
                                {errors.sPrice && <p className="invalid-feedback">{errors.sPrice}</p>}
                              </div>
                            </div>
                          </div>
                          <div className="row">
                            <div className="col-lg-3 col-sm-6 col-12">
                              <div className="input-blocks add-product">
                                <label>Discount Percent(%)</label>
                                <input type="number" placeholder="Choose" className="form-control" defaultValue="0" value={formData.discPerc} onChange={(e) => discPerc_KeyDown(e.target.value)} />
                              </div>
                            </div>
                            <div className="col-lg-3 col-sm-6 col-12">
                              <div className="input-blocks add-product">
                                <label>Discount Amount</label>
                                <input type="number" placeholder="Choose" className="form-control" defaultValue="0" value={formData.disc} onChange={(e) => disc_KeyDown(e.target.value)} />
                              </div>
                            </div>
                            <div className="col-lg-3 col-sm-6 col-12">
                              <div className="input-blocks add-product">
                                <label>Gst Percent(%)</label>
                                <input type="number" className="form-control" defaultValue="0" value={formData.gstPerc} onChange={(e) => gstPerc_KeyDown(e.target.value)} />
                              </div>
                            </div>
                            <div className="col-lg-3 col-sm-6 col-12">
                              <div className="input-blocks add-product">
                                <label>Tax(GST) Amount</label>
                                <input type="number" className="form-control" defaultValue="0" value={formData.gst} onChange={(e) => gst_KeyDown(e.target.value)} />
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
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="col-lg-12">
            <div className="btn-addproduct mb-4">
              <button type="button" className="btn btn-cancel me-2">Cancel</button>
              <button type="submit" className="btn btn-submit" onClick={validate}>Save Product</button>
            </div>
          </div>
        </form>
        {/* /add */}
      </div>
      <Addunits userId={userId} />
      <AddCategory userId={userId} />
      <AddBrand userId={userId} />
    </div>
  );
};

export default AddProduct;
