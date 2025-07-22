import React, { useEffect, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import ImageWithBasePath from '../../core/img/imagewithbasebath'
import { RefreshCcw, RotateCw, ShoppingCart } from 'feather-icons-react/build/IconComponents'
import { Check, CheckCircle, Edit, MoreVertical, Trash2, UserPlus } from 'react-feather'
import Select from 'react-select'
import PlusCircle from 'feather-icons-react/build/IconComponents/PlusCircle'
import MinusCircle from 'feather-icons-react/build/IconComponents/MinusCircle'
import { OverlayTrigger, Tooltip } from 'react-bootstrap'
import withReactContent from 'sweetalert2-react-content'
import Swal from 'sweetalert2'
import Slider from 'react-slick'
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { useDispatch, useSelector } from 'react-redux'
import no_image from "../../images/no_image.png";
import cartEmpty from "../../images/cartEmpty.png";
import { addToSaleCart, clearCart, decrementCart, getCategory, getCustomer, getProduct, getSaleInv, getTransaction, getTransactionID, getUsers, incrementCart, insertCustomer, insertSale, removeCartRow, updateCartRow } from "../../core/redux/action";
import { useReactToPrint } from 'react-to-print';
import { getImageFromUrl } from '../../helper/helpers'
import axios from 'axios'
import { all_routes } from '../../Router/all_routes'

const Pos = () => {


  const route = all_routes;
  const gst = [
    { value: '0', label: 'GST 0%' },
    { value: '5', label: 'GST 5%' },
    { value: '10', label: 'GST 10%' },
    { value: '15', label: 'GST 15%' },
    { value: '20', label: 'GST 20%' },
    { value: '25', label: 'GST 25%' },
    { value: '30', label: 'GST 30%' },
  ];
  const shipping = [
    { value: '0', label: '0' },
    { value: '15', label: '15' },
    { value: '20', label: '20' },
    { value: '25', label: '25' },
    { value: '30', label: '30' },
  ];
  const discount = [
    { value: '0', label: '0%' },
    { value: '10', label: '10%' },
    { value: '15', label: '15%' },
    { value: '20', label: '20%' },
    { value: '25', label: '25%' },
    { value: '30', label: '30%' },
  ];

  const renderTooltip = (props) => (
    <Tooltip id="pdf-tooltip" {...props}>
      Pdf
    </Tooltip>
  );
  const renderExcelTooltip = (props) => (
    <Tooltip id="excel-tooltip" {...props}>
      Excel
    </Tooltip>
  );
  const renderPrinterTooltip = (props) => (
    <Tooltip id="printer-tooltip" {...props}>
      Printer
    </Tooltip>
  );

  const settings = {
    dots: false,
    autoplay: false,
    slidesToShow: 5,
    margin: 0,
    speed: 500,
    responsive: [
      {
        breakpoint: 992,
        settings: {
          slidesToShow: 5,
        },
      },
      {
        breakpoint: 800,
        settings: {
          slidesToShow: 5,
        },
      },
      {
        breakpoint: 776,
        settings: {
          slidesToShow: 2,
        },
      },
      {
        breakpoint: 567,
        settings: {
          slidesToShow: 1,
        },
      },
    ],
  };
  const MySwal = withReactContent(Swal);

  const showConfirmationAlert = (e) => {
    MySwal.fire({
      title: 'Are you sure?',
      text: 'You won\'t to remove this product into cart!',
      showCancelButton: true,
      confirmButtonColor: '#00ff00',
      confirmButtonText: 'Yes, delete it!',
      cancelButtonColor: '#ff0000',
      cancelButtonText: 'Cancel',
    })
      .then((result) => {
        if (result.isConfirmed) {
          dispatch(removeCartRow(e));
          MySwal.close();
        }
      });
  };
  const dispatch = useDispatch();
  const catStore = useSelector((state) => state.categories);
  const productStore1 = useSelector((state) => state.posts);
  const cartStore = useSelector((state) => state.cart);
  const invStore = useSelector((state) => state.invs);
  const trInv = useSelector((state) => state.trInv);
  const trID = useSelector((state) => state.trID);
  const users = useSelector((state) => state.users);

  const [productStore, setPosts] = useState([]);
  const [loginUser, setLoginUser] = useState(null);

  useEffect(() => {
    if (loginUser) {
      const filtered = productStore1.filter(
        (i) =>
          i.clientId === loginUser?.clientId &&
          i.branchId === loginUser?.branchId
      );
      setPosts(filtered);
    } else {
      setPosts([]);
    }
  }, [loginUser, productStore1]);

  //State
  const [selectedCat, setSelectedCat] = useState(0);
  const [getProductList, setProduct] = useState([]);
  //Cart
  const [cart, setCart] = useState({ createdBy: loginUser?.userId, customerID: 1, customerName: "Walk-in Customer", cardNo: "", paymentStatus: "paid", orderStatus: "Completed", total: 0, gstPerc: 0, gst: 0, discPerc: 0, disc: 0, netTotal: 0, paymentMode: "Cash" });

  //Customer
  const customerStore = useSelector((state) => state.customers);
  const [customerList, setCustomerList] = useState([]);
  const [selectCustomer, setSelectCustomer] = useState(null);
  const [newCustomer, setNewCustomer] = useState({ name: "", email: "", contact: "", address: "", city: "", country: "" });

  //UseRef
  const cartDivRef = useRef(null);
  const nameRef = useRef();
  const cashRef = useRef();
  const cardRef = useRef();
  const scanRef = useRef();
  const closeDebitCardBtn = useRef();
  const cardInputRef = useRef();
  const closeUpdateProBtn = useRef();
  const [errors, setErrors] = useState({});
  const [editProID, setEditProID] = useState(0);

  useEffect(() => {
    dispatch(clearCart());
    dispatch(getTransactionID());
    dispatch(getTransaction());
    dispatch(getCategory());
    dispatch(getProduct());
    dispatch(getCustomer());
    dispatch(getSaleInv());
    dispatch(getUsers());
  }, [dispatch]);
  useEffect(() => {
    const customer1 = customerStore
      ?.filter((i) => i.customerId === 1)
      .map((x) => ({
        value: x.customerId,
        label: x.customerName,
      }));

    const filteredCustomers = customerStore
      ?.filter(
        (i) =>
          i.clientId === loginUser?.clientId &&
          i.branchId === loginUser?.branchId
      )
      .map((x) => ({
        value: x.customerId,
        label: x.customerName,
      }));
    setCustomerList([
      ...(customer1 || []),
      ...(filteredCustomers || []),
    ]);
    setSelectCustomer(customerList[0]);
  }, [customerStore]);
  useEffect(() => {
    setProduct(productStore.map((x) => ({
      key: x.productId,
      value: x.productName,
      label: x.productName
    })));
  }, [productStore]);
  useEffect(() => {
    calculation();
  }, [cartStore]);
  useEffect(() => {
    calculation();
  }, [cart.gstPerc, cart.discPerc]);

  const calculation = () => {
    let _total = cartStore.reduce((sum, i) => { return sum + i.netTotal }, 0);
    let dis = (cart.discPerc * _total) / 100;
    let _gst = (cart.gstPerc * _total) / 100;
    let _netTotal = (_total + _gst) - dis;
    setCart({ ...cart, total: _total, netTotal: _netTotal, disc: dis, gst: _gst });
  }

  //Update Product
  //UpdatePro
  const [updatePro, setUpdatePro] = useState({ _selectedUnit: "Choose Option", gstPerc: 0, gst: 0, discPerc: 0, disc: 0, _price: 0, qty: 0, total: 0 });

  const [unitList, setUnitList] = useState([
    { value: "Choose Option", label: "Choose Option" }
  ]);
  const [selectUnit, setSelectedUnit] = useState(unitList[0]);

  const addUnit = (unit) => {
    if (!unitList.some(u => u.value === unit)) {
      setUnitList(prev => [
        ...prev,
        { value: unit, label: unit }
      ]);
    }
  };

  const handleSelectedUnit = (e) => {
    var x = cartStore.find((x) => x.id === editProID);
    if (x != null) {
      if (x.secUnit != "") {
        setSelectedUnit([{ value: e.value, label: e.label }])
        if (e.value === x.unit) {
          //Box
          let _total = x.SPrice * x.qty;
          let _gst = _total * updatePro.gstPerc / 100;
          let _disc = _total * updatePro.discPerc / 100;
          _total -= _disc;
          _total += _gst;
          setUpdatePro({ ...updatePro, _selectedUnit: e.value, _price: x.SPrice, total: _total, gst: _gst, disc: _disc });
        }
        else {
          //Pcs
          let _total = x.secUnitPrice * x.qty;
          let _gst = _total * updatePro.gstPerc / 100;
          let _disc = _total * updatePro.discPerc / 100;
          _total -= _disc;
          _total += _gst;
          setUpdatePro({ ...updatePro, _selectedUnit: e.value, _price: x.secUnitPrice, total: _total, gst: _gst, disc: _disc });
        }
      }
    }
  }

  useEffect(() => {
    var match = unitList.find((x) => x.value === updatePro._selectedUnit && x.label === updatePro._selectedUnit);
    setSelectedUnit(match);
  }, [updatePro._selectedUnit]);

  const handleEditProductByID = (e) => {
    setEditProID(e);
    const x = cartStore.filter((i) => i.id === e);
    addUnit(x[0].unit);
    if (x[0].secUnit != "") {
      addUnit(x[0].secUnit);
    }
    setUpdatePro({ ...updatePro, _selectedUnit: x[0].selectedUnit, qty: x[0].qty, _price: x[0].price, total: (x[0].total - x[0].disc) + x[0].gst, discPerc: x[0].discPerc, disc: x[0].disc, gstPerc: x[0].gstPerc, gst: x[0].gst });
  }
  const calculateGst_Edit = (perc, total) => {
    let _total = total - updatePro.disc;
    let _gst = _total * perc / 100;
    setUpdatePro({ ...updatePro, total: _total + _gst, gstPerc: perc, gst: _gst });
  }
  const calculateDisc_Edit = (perc, total) => {
    let _total = total;
    let _disc = _total * perc / 100;
    setUpdatePro({ ...updatePro, total: (_total - _disc) + updatePro.gst, discPerc: perc, disc: _disc });
  }
  const updatePro_Click = (e) => {
    e.preventDefault();
    if (selectUnit?.value != null) {
      dispatch(updateCartRow(editProID, selectUnit?.value, updatePro._price, updatePro.gstPerc, updatePro.gst, updatePro.discPerc, updatePro.disc, updatePro._price * updatePro.qty, updatePro.total));
    }
    closeUpdateProBtn.current.click();
  }
  //Update Product End
  //AddToCart
  const handleAddToCart = (e) => {
    removeEmptyCartImg();
    dispatch(addToSaleCart(productStore.filter((a) => a.productId == e)));
  }
  const handleSelectProduct = (e) => {
    removeEmptyCartImg();
    dispatch(addToSaleCart(productStore.filter((a) => a.id == e.key)));
  }
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-PK", {
      style: "currency",
      currency: "PKR",
    }).format(amount);
  }
  //PaymentMode
  const handlePaymentMode = (e) => {
    cashRef.current.classList.remove("paymentMode_Active");
    cardRef.current.classList.remove("paymentMode_Active");
    scanRef.current.classList.remove("paymentMode_Active");
    if (e === "Cash") {
      setCart({ ...cart, cartNo: "", paymentMode: e });
      cashRef.current.classList.add("paymentMode_Active");
    }
    else if (e === "Credit") {
      setCart({ ...cart, cartNo: "", paymentMode: e });
      scanRef.current.classList.add("paymentMode_Active");
    }
    else {
      setCart({ ...cart, paymentMode: e });
      cardRef.current.classList.add("paymentMode_Active");
    }
  }
  //PopUp
  const clearAlert = () => {
    if (cartStore.length > 0) {
      Swal.fire({
        title: "Are you sure you want to clear the cart ?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, clear it!"
      }).then((result) => {
        if (result.isConfirmed) {
          dispatch(clearCart());
        }
      });
    }
  };
  //Payment
  const addEmptyCartImg = () => {
    if (cartEmpty && cartDivRef.current) {
      cartDivRef.current.style.backgroundImage = `url(${cartEmpty})`;
      cartDivRef.current.style.backgroundSize = "cover";
      cartDivRef.current.style.backgroundPosition = "center";
      cartDivRef.current.style.width = "100%";
    }
  }
  const removeEmptyCartImg = () => {
    cartDivRef.current.style.backgroundImage = "none";
  }
  const insertInv = async (isHold) => {
    if (cartStore.length > 0) {
      const temp = {
        clientId: 1,
        branchId: 1,
        createdBy: loginUser?.userId,
        customerId: cart.customerID,
        paymentMode: cart.paymentMode,
        total: cart.total,
        netTotal: cart.netTotal,
        item: cartStore.length,
        gstPerc: cart.gstPerc,
        gst: cart.gst,
        discount: cart.disc,
        discPerc: cart.discPerc,
        isHold: isHold,
      };
      let rid = 0;
      try {
        const mainUrl = "https://poscloud.itmechanix.com/api/SaleInv";
        await axios.post(mainUrl, temp).then((e) => {
          rid = e.data.receiptNo;
        });
      } catch (error) {
        console.log(error.message);
      }
      cartStore.map((x) => (
        dispatch(insertSale({
          clientId: 1,
          branchId: 1,
          receiptNo: rid,
          productId: x.id,
          quantity: x.qty,
          uom: x.minUom || "PCS",
          factor: x.factor,
          salePrice: x.price,
          gstprct: x.gstPerc,
          gstamount: x.gst,
          discountPrct: x.discPerc,
          discountAmount: x.disc,
          productTotal: x.netTotal,
          productCost: 0,
        }))
      ));
      successAlert();
    }
    else {
      cartDivRef.current.style.background = "#ffe6e6";
      removeEmptyCartImg();
      await new Promise(resolve => setTimeout(resolve, 150));
      cartDivRef.current.style.background = "#fff";
      addEmptyCartImg();
    }
  }
  const handlePaymentBtn = () => {
    setCart({ ...cart, paymentStatus: "Paid", orderStatus: "Completed" });
    insertInv(false);
  }
  const handleHoldBtn = () => {
    setCart({ ...cart, paymentStatus: "Pending", orderStatus: "Incomplete" });
    insertInv(true);
  }
  const handleDebitCard = (e) => {
    e.preventDefault();
    if (cardValidate(e)) {
      closeDebitCardBtn.current.click();
    }
  }
  //Clear
  const resetOrder = () => {
    clearAlert();
    setSelectCustomer(customerList[0]);
  }
  //Customer
  const handleNewCustomer = (e) => {
    e.preventDefault();
    if (validate(e)) {
      dispatch(insertCustomer(newCustomer));
      successAlert("Record inserted successfully");
    }
  }
  const handleSelectedCustomer = (e) => {
    setSelectCustomer(customerList.find((x) => x.value === e.value));
    setCart({ ...cart, customerID: e.value, customerName: e.label });
  }
  const dateFormat = (p) => {
    try {
      const apiResponse = { date: p };
      const formattedDate = new Date(apiResponse.date).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
      return formattedDate;
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  //Validation
  const validate = (p) => {
    let tempErrors = {};
    if (p.target[0].value === "") {
      tempErrors.newCustomer = "Customer name required!";
      setErrors(tempErrors);
      nameRef.current.classList.add("is-invalid");
    }
    else {
      setErrors({ ...errors, newCustomer: "" });
      nameRef.current.classList.remove("is-invalid");
    }
    return Object.keys(tempErrors).length === 0;
  };
  const cardValidate = (p) => {
    let tempErrors = {};
    if (p.target[0].value === "") {
      tempErrors.card = "Card number required!";
      setErrors(tempErrors);
      cardInputRef.current.classList.add("is-invalid");
    }
    else {
      setErrors({ ...errors, card: "" });
      cardInputRef.current.classList.remove("is-invalid");
    }
    return Object.keys(tempErrors).length === 0;
  };
  //PopUp
  const successAlert = (msg) => {
    MySwal.fire({
      icon: "success",
      title: msg,
      confirmButtonText: "Ok",
    })
    // dispatch(clearCart());
    // addEmptyCartImg();
  };

  const filteredCategory = (productStore.filter(x => {
    if (selectedCat === 0) {
      return productStore;
    }
    else {
      return x.categoryId === selectedCat;
    }
  }));
  const handleQtyPlus = (id) => {
    const pro = productStore.filter((x) => x.productId === id);
    const proCart = cartStore.filter((x) => x.id === id);
    const reqQty = proCart[0].qty + 1;
    if (!(reqQty > pro[0].qty)) {
      dispatch(incrementCart(id));
    }
  }
  const receiptRef = useRef();
  const handlePrintBtn = useReactToPrint({
    content: () => receiptRef.current,
  });

  const navigate = useNavigate();
  const val = localStorage.getItem("userID");
  useEffect(() => {
    if (!isNaN(val) && Number.isInteger(Number(val)) && Number(val) > 0) {
      const id = Number(val);
      setLoginUser(users.find((i) => i.userId === id));
    }
    else
      navigate(route.signin);
  }, [users, navigate]);


  return (
    <div>
      <div className="page-wrapper pos-pg-wrapper ms-0">
        <div className="content pos-design p-0">
          <div className="btn-row d-sm-flex align-items-center">
            <Link
              to="#"
              className="btn btn-secondary mb-xs-3"
              data-bs-toggle="modal"
              data-bs-target="#orders"
            >
              <span className="me-1 d-flex align-items-center">
                <ShoppingCart className="feather-16" />
              </span>
              View Orders
            </Link>
            <Link to="#" className="btn btn-info" onClick={resetOrder}>
              <span className="me-1 d-flex align-items-center">
                <RotateCw className="feather-16" />
              </span>
              Reset
            </Link>
            <Link
              to="#"
              className="btn btn-primary"
              data-bs-toggle="modal"
              data-bs-target="#recents"
            >
              <span className="me-1 d-flex align-items-center">
                <RefreshCcw className="feather-16" />
              </span>
              Transaction
            </Link>
          </div>
          <div className="row align-items-start pos-wrapper">
            <div className="col-md-12 col-lg-8">
              <div className="pos-categories tabs_wrapper">
                <h5>Categories</h5>
                <p>Select From Below Categories</p>
                <Slider {...settings} className='tabs owl-carousel pos-category'>
                  {(() => {
                    if (catStore.filter((i) => i.clientId === loginUser?.clientId && i.branchId === loginUser?.branchId).length > 0) {
                      return (
                        <div className='pos-slick-item' style={{ maxHeight: "90px" }} key={0}>
                          <Link to="#" onClick={() => setSelectedCat(0)}><img src={no_image} alt="Categories" width="25%" height="25%" /></Link>
                          <h6 onClick={() => setSelectedCat(0)}><Link to="#">All</Link></h6>
                        </div>
                      );
                    }
                  })()}
                  {catStore && catStore.filter((i) => i.clientId === loginUser?.clientId && i.branchId === loginUser?.branchId).map((a) => (
                    <div className='pos-slick-item' key={a.categoryId} style={{ maxHeight: "90px" }}>
                      <Link to="#" onClick={() => setSelectedCat(a.categoryId)}><img src={getImageFromUrl(a.imageName)} alt="Categories" width="25%" height="25%" /></Link>
                      <h6 onClick={() => setSelectedCat(a.categoryId)}><Link to="#">{a.categoryName}</Link></h6>
                    </div>
                  ))}
                </Slider>
                <div className="pos-products">
                  <div className="d-flex align-items-center justify-content-between">
                    <h5 className="mb-3">Products</h5>
                  </div>
                  <div className="tabs_container">
                    <div className="tab_content active" data-tab="all">
                      <div className="row">
                        {filteredCategory.map((a) => (
                          <div className="col-sm-2 col-md-6 col-lg-3 col-xl-3" key={a.productId}>
                            <div className="product-info default-cover card">
                              <Link to="#" className="img-bg">
                                <img
                                  src={getImageFromUrl(a.imageName)}
                                  alt="Products"
                                  width="50%"
                                  height="50%"
                                  onClick={() => handleAddToCart(a.productId)}
                                />
                                <span><Check className="feather-16" /></span>
                              </Link>
                              <h6 className="cat-name"><Link to="#">{catStore.find((i) => i.categoryId === a.categoryId)?.categoryName}</Link></h6>
                              <h6 className="product-name"><Link to="#" onClick={() => handleAddToCart(a.productId)}>{a.productName}</Link></h6>
                              <div className="d-flex align-items-center justify-content-between price">
                                <span>0</span>
                                <p>{a.salePrice}</p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-md-12 col-lg-4 ps-0">
              <aside className="product-order-list">
                <div className="head d-flex align-items-center justify-content-between w-100">
                  <div className="">
                    <h5>Order List</h5>
                    <span>Transaction ID : #{trID}</span>
                  </div>
                  <div className="">
                    <Link className="confirm-text" to="#">
                      <Trash2 className="feather-16 text-danger me-1" />
                    </Link>
                    <Link to="#" className="text-default">
                      <MoreVertical className="feather-16" />
                    </Link>
                  </div>
                </div>
                <div className="customer-info block-section">
                  <h6>Customer Information</h6>
                  <div className="input-block d-flex align-items-center">
                    <div className="flex-grow-1">
                      <Select
                        options={customerList}
                        classNamePrefix="react-select"
                        // placeholder="Walk-in Customer"
                        onChange={handleSelectedCustomer}
                        value={selectCustomer}
                      />
                    </div>
                    <Link
                      to="#"
                      className="btn btn-primary btn-icon"
                      data-bs-toggle="modal"
                      data-bs-target="#create"
                    >
                      <UserPlus className="feather-16" />
                    </Link>
                  </div>
                  <div className="input-block">
                    <Select
                      options={getProductList}
                      classNamePrefix="react-select"
                      placeholder="Select product..."
                      onChange={handleSelectProduct}
                    />
                  </div>
                </div>
                <div className="product-added block-section">
                  <div className="head-text d-flex align-items-center justify-content-between">
                    <h6 className="d-flex align-items-center mb-0">
                      Product Added<span className="count">{cartStore.length}</span>
                    </h6>
                    <Link
                      to="#"
                      className="d-flex align-items-center text-danger"
                      onClick={clearAlert}
                    >
                      <span className="me-1">
                        <i data-feather="x" className="feather-16" />
                      </span>
                      Clear all
                    </Link>
                  </div>
                  <div className="product-wrap" ref={cartDivRef}>
                    {cartStore && cartStore.map((a) => (
                      <div className="product-list d-flex align-items-center justify-content-between" key={a.id}>
                        <div
                          className="d-flex align-items-center product-info"
                          data-bs-toggle="modal"
                          data-bs-target="#products"
                        >
                          <Link to="#" className="img-bg">
                            <img
                              src={getImageFromUrl(a.img)}
                              alt="Products"
                            />
                          </Link>
                          <div className="info">
                            <span>PRO-{a.id}</span>
                            <h6>
                              <Link to="#">{a.name}</Link>
                            </h6>
                            <p>{formatCurrency(a.netTotal)}</p>
                          </div>
                        </div>
                        <div className="qty-item text-center">
                          <OverlayTrigger
                            placement="top"
                            overlay={<Tooltip id="tooltip-minus">Minus</Tooltip>}
                          >
                            <Link
                              to="#"
                              className="dec d-flex justify-content-center align-items-center"
                              onClick={() => dispatch(decrementCart(a.id))}
                            >
                              <MinusCircle className="feather-14" />
                            </Link>
                          </OverlayTrigger>

                          <input
                            type="text"
                            className="form-control text-center"
                            name="qty"
                            value={a.qty}
                            readOnly
                          />
                          <OverlayTrigger
                            placement="top"
                            overlay={<Tooltip id="tooltip-plus">Plus</Tooltip>}
                          >
                            <Link
                              to="#" onClick={() => handleQtyPlus(a.id)}
                              className="inc d-flex justify-content-center align-items-center"
                              data-bs-toggle="tooltip"
                              data-bs-placement="top"
                              title="plus"
                            >
                              <PlusCircle className="feather-14" />
                            </Link>
                          </OverlayTrigger>
                        </div>
                        <div className="d-flex align-items-center action">
                          <Link
                            className="btn-icon edit-icon me-2"
                            to="#"
                            data-bs-toggle="modal"
                            data-bs-target="#edit-product"
                            onClick={() => handleEditProductByID(a.id)}
                          >
                            <Edit className="feather-14" />
                          </Link>
                          <Link onClick={() => showConfirmationAlert(a.id)}
                            className="btn-icon delete-icon confirm-text"
                            to="#"
                            key={a.id}
                          >
                            <Trash2 className="feather-14" />
                          </Link>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="block-section">
                  <div className="selling-info">
                    <div className="row">
                      <div className="col-12 col-sm-4">
                        <div className="input-block">
                          <label>GST Tax</label>
                          <Select
                            classNamePrefix="react-select"
                            options={gst}
                            placeholder="Choose"
                            onChange={(e) => setCart({ ...cart, gstPerc: e.value })}
                          />

                        </div>
                      </div>
                      <div className="col-12 col-sm-4">
                        <div className="input-block">
                          <label>Shipping</label>
                          <Select
                            classNamePrefix="react-select"
                            options={shipping}
                            placeholder="Choose"
                          />
                        </div>
                      </div>
                      <div className="col-12 col-sm-4">
                        <div className="input-block">
                          <label>Discount</label>
                          <Select
                            classNamePrefix="react-select"
                            options={discount}
                            placeholder="Choose"
                            onChange={(e) => setCart({ ...cart, discPerc: e.value })}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="order-total">
                    <table className="table table-responsive table-borderless">
                      <tbody>
                        <tr>
                          <td>Sub Total</td>
                          <td className="text-end">{formatCurrency(cart.total)}</td>
                        </tr>
                        <tr>
                          <td>Tax (GST {cart.gstPerc}%)</td>
                          <td className="text-end">{formatCurrency(cart.gst)}</td>
                        </tr>
                        <tr>
                          <td>Shipping</td>
                          <td className="text-end">0</td>
                        </tr>
                        {/* <tr>
                          <td>Sub Total</td>
                          <td className="text-end">$60,454</td>
                        </tr> */}
                        <tr>
                          <td className="danger">Discount ({cart.discPerc}%)</td>
                          <td className="danger text-end">{formatCurrency(cart.disc)}</td>
                        </tr>
                        <tr>
                          <td>Total</td>
                          <td className="text-end">{formatCurrency(cart.netTotal)}</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
                <div className="block-section payment-method">
                  <h6>Payment Method</h6>
                  <div className="row d-flex align-items-center justify-content-center methods">
                    <div className="col-md-6 col-lg-4 item">
                      <div className="default-cover paymentMode_Active" ref={cashRef}>
                        <Link to="#" onClick={() => handlePaymentMode("Cash")}>
                          <ImageWithBasePath
                            src="assets/img/icons/cash-pay.svg"
                            alt="Payment Method"
                          />
                          <span>Cash</span>
                        </Link>
                      </div>
                    </div>
                    <div className="col-md-6 col-lg-4 item">
                      <div className="default-cover" ref={cardRef}>
                        <Link to="#" onClick={() => handlePaymentMode("Debit Card")} data-bs-toggle="modal" data-bs-target="#debit-Card">
                          <ImageWithBasePath
                            src="assets/img/icons/credit-card.svg"
                            alt="Payment Method"
                          />
                          <span>Debit Card</span>
                        </Link>
                      </div>
                    </div>
                    <div className="col-md-6 col-lg-4 item">
                      <div className="default-cover" ref={scanRef}>
                        <Link to="#" onClick={() => handlePaymentMode("Credit")}>
                          <ImageWithBasePath
                            src="assets/img/icons/qr-scan.svg"
                            alt="Payment Method"
                          />
                          <span>Credit</span>
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="d-grid btn-block">
                  <Link className="btn btn-secondary" to="#">
                    Grand Total : {formatCurrency(cart.netTotal)}
                  </Link>
                </div>
                <div className="btn-row d-sm-flex align-items-center justify-content-between">
                  <Link
                    to="#"
                    className="btn btn-info btn-icon flex-fill"
                    data-bs-toggle="modal"
                    data-bs-target="#hold-order"
                  >
                    <span className="me-1 d-flex align-items-center">
                      <i data-feather="pause" className="feather-16" />
                    </span>
                    Hold
                  </Link>
                  <Link
                    to="#"
                    className="btn btn-danger btn-icon flex-fill"
                  >
                    <span className="me-1 d-flex align-items-center">
                      <i data-feather="trash-2" className="feather-16" />
                    </span>
                    Void
                  </Link>
                  <Link
                    to="#"
                    className="btn btn-success btn-icon flex-fill"
                    data-bs-toggle="modal" data-bs-target="#print-receipt"
                    onClick={handlePaymentBtn}
                  >
                    <span className="me-1 d-flex align-items-center">
                      <i data-feather="credit-card" className="feather-16" />
                    </span>
                    Payment
                  </Link>
                  {/* <button data-bs-toggle="modal" data-bs-target="#print-receipt" onClick={handlePaymentBtn} >Payment</button> */}
                  {/* <button data-bs-toggle="modal" data-bs-target="#payment-completed" data-bs-toggle="modal" data-bs-target="#print-receipt" ref={hiddenPaymentBtnRef} ></button> */}
                </div>
              </aside>
            </div>
          </div>
        </div>
      </div>

      {/* Payment Completed */}
      <div
        className="modal fade modal-default"
        id="payment-completed"
        aria-labelledby="payment-completed"
      >
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-body text-center">
              <form>
                <div className="icon-head">
                  <Link to="#">
                    <CheckCircle className="feather-40" />
                  </Link>
                </div>
                <h4>Payment Completed</h4>
                <p className="mb-0">
                  Do you want to Print Receipt for the Completed Order
                </p>
                <div className="modal-footer d-sm-flex justify-content-between">
                  <button
                    type="button"
                    className="btn btn-primary flex-fill me-1"
                    data-bs-toggle="modal" data-bs-target="#print-receipt"
                  >
                    Print Receipt
                  </button>
                  <Link to="#" className="btn btn-secondary flex-fill" onClick={resetOrder}>
                    Next Order
                  </Link>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
      {/* /Payment Completed */}
      {/* Print Receipt */}
      <div
        className="modal fade modal-default"
        id="print-receipt"
        aria-labelledby="print-receipt"
      >
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="d-flex justify-content-end">
              <button
                type="button"
                className="close p-0"
                data-bs-dismiss="modal"
                aria-label="Close"
              >
                <span aria-hidden="true">×</span>
              </button>
            </div>
            <div className="modal-body">
              <div>

                <div className="icon-head text-center">
                  <Link to="#">
                    <ImageWithBasePath
                      src="assets/img/logo.png"
                      width={100}
                      height={30}
                      alt="Receipt Logo"
                    />
                  </Link>
                </div>
                <div className="text-center info text-center">
                  <h6>Dreamguys Technologies Pvt Ltd.,</h6>
                  <p className="mb-0">Phone Number: +1 5656665656</p>
                  <p className="mb-0">
                    Email: <Link to="mailto:example@gmail.com">example@gmail.com</Link>
                  </p>
                </div>
                <div className="tax-invoice">
                  <h6 className="text-center">Tax Invoice</h6>
                  <div className="row">
                    <div className="col-sm-12 col-md-6">
                      <div className="invoice-user-name">
                        <span>Name: </span>
                        <span>John Doe</span>
                      </div>
                      <div className="invoice-user-name">
                        <span>Invoice No: </span>
                        <span>CS132453</span>
                      </div>
                    </div>
                    <div className="col-sm-12 col-md-6">
                      <div className="invoice-user-name">
                        <span>Customer Id: </span>
                        <span>#LL93784</span>
                      </div>
                      <div className="invoice-user-name">
                        <span>Date: </span>
                        <span>01.07.2022</span>
                      </div>
                    </div>
                  </div>
                </div>
                <table className="table-borderless w-100 table-fit">
                  <thead>
                    <tr>
                      <th># Item</th>
                      <th>Price</th>
                      <th>Qty</th>
                      <th className="text-end">Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>1. Red Nike Laser</td>
                      <td>$50</td>
                      <td>3</td>
                      <td className="text-end">$150</td>
                    </tr>
                    <tr>
                      <td>2. Iphone 14</td>
                      <td>$50</td>
                      <td>2</td>
                      <td className="text-end">$100</td>
                    </tr>
                    <tr>
                      <td>3. Apple Series 8</td>
                      <td>$50</td>
                      <td>3</td>
                      <td className="text-end">$150</td>
                    </tr>
                    <tr>
                      <td colSpan={4}>
                        <table className="table-borderless w-100 table-fit">
                          <tbody>
                            <tr>
                              <td>Sub Total :</td>
                              <td className="text-end">$700.00</td>
                            </tr>
                            <tr>
                              <td>Discount :</td>
                              <td className="text-end">-$50.00</td>
                            </tr>
                            <tr>
                              <td>Shipping :</td>
                              <td className="text-end">0.00</td>
                            </tr>
                            <tr>
                              <td>Tax (5%) :</td>
                              <td className="text-end">$5.00</td>
                            </tr>
                            <tr>
                              <td>Total Bill :</td>
                              <td className="text-end">$655.00</td>
                            </tr>
                            <tr>
                              <td>Due :</td>
                              <td className="text-end">$0.00</td>
                            </tr>
                            <tr>
                              <td>Total Payable :</td>
                              <td className="text-end">$655.00</td>
                            </tr>
                          </tbody>
                        </table>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <div className="text-center invoice-bar">
                <p>
                  **VAT against this challan is payable through central
                  registration. Thank you for your business!
                </p>
                <Link to="#">
                  <ImageWithBasePath src="assets/img/barcode/barcode-03.jpg" alt="Barcode" />
                </Link>
                <p>Sale 31</p>
                <p>Thank You For Shopping With Us. Please Come Again</p>
                <Link to="#" className="btn btn-primary" onClick={handlePrintBtn}>
                  Print Receipt
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* /Print Receipt */}
      {/* Products */}
      <div
        className="modal fade modal-default pos-modal"
        id="products"
        aria-labelledby="products"
      >
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header p-4 d-flex align-items-center justify-content-between">
              <div className="d-flex align-items-center">
                <h5 className="me-4">Products</h5>
                <span className="badge bg-info d-inline-block mb-0">
                  Product ID : #666614
                </span>
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
            <div className="modal-body p-4">
              <form>
                <div className="product-wrap">
                  <div className="product-list d-flex align-items-center justify-content-between">
                    <div className="d-flex align-items-center flex-fill">
                      <Link to="#" className="img-bg me-2">
                        <ImageWithBasePath
                          src="assets/img/products/pos-product-16.png"
                          alt="Products"
                        />
                      </Link>
                      <div className="info d-flex align-items-center justify-content-between flex-fill">
                        <div>
                          <span>PT0005</span>
                          <h6>
                            <Link to="#">Red Nike Laser</Link>
                          </h6>
                        </div>
                        <p>$2000</p>
                      </div>
                    </div>
                  </div>
                  <div className="product-list d-flex align-items-center justify-content-between">
                    <div className="d-flex align-items-center flex-fill">
                      <Link to="#" className="img-bg me-2">
                        <ImageWithBasePath
                          src="assets/img/products/pos-product-17.png"
                          alt="Products"
                        />
                      </Link>
                      <div className="info d-flex align-items-center justify-content-between flex-fill">
                        <div>
                          <span>PT0235</span>
                          <h6>
                            <Link to="#">Iphone 14</Link>
                          </h6>
                        </div>
                        <p>$3000</p>
                      </div>
                    </div>
                  </div>
                  <div className="product-list d-flex align-items-center justify-content-between">
                    <div className="d-flex align-items-center flex-fill">
                      <Link to="#" className="img-bg me-2">
                        <ImageWithBasePath
                          src="assets/img/products/pos-product-16.png"
                          alt="Products"
                        />
                      </Link>
                      <div className="info d-flex align-items-center justify-content-between flex-fill">
                        <div>
                          <span>PT0005</span>
                          <h6>
                            <Link to="#">Red Nike Laser</Link>
                          </h6>
                        </div>
                        <p>$2000</p>
                      </div>
                    </div>
                  </div>
                  <div className="product-list d-flex align-items-center justify-content-between">
                    <div className="d-flex align-items-center flex-fill">
                      <Link to="#" className="img-bg me-2">
                        <ImageWithBasePath
                          src="assets/img/products/pos-product-17.png"
                          alt="Products"
                        />
                      </Link>
                      <div className="info d-flex align-items-center justify-content-between flex-fill">
                        <div>
                          <span>PT0005</span>
                          <h6>
                            <Link to="#">Red Nike Laser</Link>
                          </h6>
                        </div>
                        <p>$2000</p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="modal-footer d-sm-flex justify-content-end">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    data-bs-dismiss="modal"
                  >
                    Cancel
                  </button>
                  <Link to="#" className="btn btn-primary">
                    Submit
                  </Link>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
      {/* /Customer */}
      <div
        className="modal fade"
        id="create"
        tabIndex={-1}
        aria-labelledby="create"
        aria-hidden="true"
      >
        <div
          className="modal-dialog modal-lg modal-dialog-centered"
          role="document"
        >
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Create</h5>
              <button
                type="button"
                className="close"
                data-bs-dismiss="modal"
                aria-label="Close"
              >
                <span aria-hidden="true">×</span>
              </button>
            </div>
            <div className="modal-body">
              <form onSubmit={handleNewCustomer}>
                <div className="row">
                  <div className="col-lg-6 col-sm-12 col-12">
                    <div className="input-blocks">
                      <label>Customer Name</label>
                      <input type="text" className="form-control" ref={nameRef} onChange={(e) => setNewCustomer({ ...newCustomer, name: e.target.value })} />
                      {errors.newCustomer && <p style={{ color: "#ff7676" }}>{errors.newCustomer}</p>}
                    </div>
                  </div>
                  <div className="col-lg-6 col-sm-12 col-12">
                    <div className="input-blocks">
                      <label>Email</label>
                      <input type="email" className="form-control" onChange={(e) => setNewCustomer({ ...newCustomer, email: e.target.value })} />
                    </div>
                  </div>
                  <div className="col-lg-6 col-sm-12 col-12">
                    <div className="input-blocks">
                      <label>Phone</label>
                      <input type="number" className="form-control" onChange={(e) => setNewCustomer({ ...newCustomer, contact: e.target.value })} />
                    </div>
                  </div>
                  <div className="col-lg-6 col-sm-12 col-12">
                    <div className="input-blocks">
                      <label>Country</label>
                      <input type="text" className="form-control" onChange={(e) => setNewCustomer({ ...newCustomer, country: e.target.value })} />
                    </div>
                  </div>
                  <div className="col-lg-6 col-sm-12 col-12">
                    <div className="input-blocks">
                      <label>City</label>
                      <input type="text" className="form-control" onChange={(e) => setNewCustomer({ ...newCustomer, city: e.target.value })} />
                    </div>
                  </div>
                  <div className="col-lg-6 col-sm-12 col-12">
                    <div className="input-blocks">
                      <label>Address</label>
                      <input type="text" className="form-control" onChange={(e) => setNewCustomer({ ...newCustomer, address: e.target.value })} />
                    </div>
                  </div>
                </div>
                <div className="modal-footer d-sm-flex justify-content-end">
                  <button
                    type="button"
                    className="btn btn-cancel"
                    data-bs-dismiss="modal"
                  >
                    Close
                  </button>
                  <button to="#" className="btn btn-submit me-2">
                    Submit
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
      {/* /Customer */}
      {/* Hold */}
      <div
        className="modal fade modal-default pos-modal"
        id="hold-order"
        aria-labelledby="hold-order"
      >
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header p-4">
              <h5>Hold order</h5>
              <button
                type="button"
                className="close"
                data-bs-dismiss="modal"
                aria-label="Close"
              >
                <span aria-hidden="true">×</span>
              </button>
            </div>
            <div className="modal-body p-4">
              <form>
                <h2 className="text-center p-4">{formatCurrency(cart.netTotal)}</h2>
                <div className="input-block">
                  <label>Order Reference</label>
                  <input
                    className="form-control"
                    type="text"
                    defaultValue=""
                    placeholder=""
                  />
                </div>
                <p>
                  The current order will be set on hold. You can retreive this order
                  from the pending order button. Providing a reference to it might
                  help you to identify the order more quickly.
                </p>
                <div className="modal-footer d-sm-flex justify-content-end">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    data-bs-dismiss="modal"
                  >
                    Cancel
                  </button>
                  <Link to="#" className="btn btn-primary" onClick={handleHoldBtn}>
                    Confirm
                  </Link>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
      {/* /Hold */}
      {/* Edit Product */}
      <div
        className="modal fade modal-default pos-modal"
        id="edit-product"
        aria-labelledby="edit-product"
      >
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">

            <div className="modal-header p-4">
              <h5>Edit Product</h5>
              <button
                type="button"
                className="close"
                data-bs-dismiss="modal"
                aria-label="Close"
              >
                <span aria-hidden="true">×</span>
              </button>
            </div>
            <div className="modal-body p-4">
              <form onSubmit={updatePro_Click}>
                <div className="row">
                  {(() => {
                    const product = cartStore.find((e) => e.id === editProID);
                    if (!product) return <p>Product not found!</p>;
                    return (
                      <>
                        <div className="col-lg-6 col-sm-12 col-12">
                          <div className="input-blocks add-product">
                            <label>Product Name <span>*</span>
                            </label>
                            <input type="text" value={product?.name} />
                          </div>
                        </div>
                        <div className="col-lg-6 col-sm-12 col-12">
                          <div className="input-blocks add-product">
                            <label>
                              Sale Unit <span>*</span>
                            </label>
                            <Select
                              classNamePrefix="react-select"
                              options={unitList}
                              onChange={handleSelectedUnit}
                              value={selectUnit}
                            />
                          </div>
                        </div>

                        <div className="col-lg-6 col-sm-12 col-12">
                          <div className="input-blocks add-product">
                            <label>
                              Tax(%) <span>*</span>
                            </label>
                            <input type="number" className="form-control" value={updatePro.gstPerc} onChange={(e) => calculateGst_Edit(e.target.value, updatePro._price * product?.qty)} />
                          </div>
                        </div>
                        <div className="col-lg-6 col-sm-12 col-12">
                          <div className="input-blocks add-product">
                            <label>
                              Tax Amount($) <span>*</span>
                            </label>
                            <input type="number" className="form-control" value={updatePro.gst} readOnly />
                          </div>
                        </div>
                        <div className="col-lg-6 col-sm-12 col-12">
                          <div className="input-blocks add-product">
                            <label>
                              Discount(%) <span>*</span>
                            </label>
                            <input type="number" className="form-control" value={updatePro.discPerc} onChange={(e) => calculateDisc_Edit(e.target.value, updatePro._price * product?.qty)} />
                          </div>
                        </div>
                        <div className="col-lg-6 col-sm-12 col-12">
                          <div className="input-blocks add-product">
                            <label>
                              Discount Amount($) <span>*</span>
                            </label>
                            <input type="number" className="form-control" value={updatePro.disc} readOnly />
                          </div>
                        </div>


                        <aside className="product-order-list">
                          <div className="head d-flex align-items-center justify-content-end">
                            <div className="">
                              <h5>Total</h5>
                              <span>{formatCurrency(updatePro.total)}</span>
                            </div>
                          </div>
                        </aside>
                      </>
                    );
                  })()}
                </div>
                <div className="modal-footer d-sm-flex justify-content-end">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    data-bs-dismiss="modal"
                    ref={closeUpdateProBtn}
                  >
                    Close
                  </button>
                  <button to="#" className="btn btn-primary">
                    Update
                  </button>
                </div>
              </form>
            </div>


          </div>
        </div>
      </div>
      {/* /Edit Product */}
      {/* Recent Transactions */}
      <div
        className="modal fade pos-modal"
        id="recents"
        tabIndex={-1}
        aria-hidden="true"
      >
        <div
          className="modal-dialog modal-lg modal-dialog-centered"
          role="document"
        >
          <div className="modal-content">
            <div className="modal-header p-4">
              <h5 className="modal-title">Recent Transactions</h5>
              <button
                type="button"
                className="close"
                data-bs-dismiss="modal"
                aria-label="Close"
              >
                <span aria-hidden="true">×</span>
              </button>
            </div>
            <div className="modal-body p-4">
              <div className="tabs-sets">
                <div className="tab-content">
                  <div
                    className="tab-pane fade show active"
                    id="purchase"
                    role="tabpanel"
                    aria-labelledby="purchase-tab"
                  >
                    <div className="table-top">
                      <div className="search-set">
                        <div className="search-input">
                          <input
                            type="text"
                            placeholder="Search"
                            className="form-control form-control-sm formsearch"
                          />
                          <Link to className="btn btn-searchset">
                            <i data-feather="search" className="feather-search" />
                          </Link>
                        </div>
                      </div>
                      <div className="wordset">
                        <ul>
                          <li>
                            <OverlayTrigger placement="top" overlay={renderTooltip}>
                              <Link>
                                <ImageWithBasePath src="assets/img/icons/pdf.svg" alt="img" />
                              </Link>
                            </OverlayTrigger>
                          </li>
                          <li>
                            <OverlayTrigger placement="top" overlay={renderExcelTooltip}>
                              <Link data-bs-toggle="tooltip" data-bs-placement="top">
                                <ImageWithBasePath src="assets/img/icons/excel.svg" alt="img" />
                              </Link>
                            </OverlayTrigger>
                          </li>
                          <li>
                            <OverlayTrigger placement="top" overlay={renderPrinterTooltip}>

                              <Link data-bs-toggle="tooltip" data-bs-placement="top">
                                <i data-feather="printer" className="feather-printer" />
                              </Link>
                            </OverlayTrigger>
                          </li>
                        </ul>
                      </div>
                    </div>
                    <div className="table-responsive">
                      <table className="table datanew">
                        <thead>
                          <tr>
                            <th>Date</th>
                            <th>Reference</th>
                            <th>Customer</th>
                            <th>Amount </th>
                            {/* <th className="no-sort">Action</th> */}
                          </tr>
                        </thead>
                        <tbody>
                          {trInv?.length > 0 && trInv?.filter((i) => i.clientId === loginUser?.clientId && i.branchId === loginUser?.branchId).map((x) => (
                            <tr key={x.id}>
                              <td>{dateFormat(x.date)}</td>
                              <td>INV/SL{x.rid}</td>
                              <td>{x.userName}</td>
                              <td>{x.total}</td>
                              {/* <td className="action-table-data">
                                <div className="edit-delete-action">
                                  <Link className="me-2 p-2" to="#">
                                    <i data-feather="eye" className="feather-eye" />
                                  </Link>
                                  <Link className="me-2 p-2" to="#">
                                    <i data-feather="edit" className="feather-edit" />
                                  </Link>
                                  <Link onClick={showConfirmationAlert}
                                    className="p-2 confirm-text"
                                    to="#"
                                  >
                                    <i
                                      data-feather="trash-2"
                                      className="feather-trash-2"
                                    />
                                  </Link>
                                </div>
                              </td> */}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* /Recent Transactions */}

      {/* Recent Orders */}
      <div
        className="modal fade pos-modal"
        id="orders"
        tabIndex={-1}
        aria-hidden="true"
      >
        <div
          className="modal-dialog modal-md modal-dialog-centered"
          role="document"
        >
          <div className="modal-content">
            <div className="modal-header p-4">
              <h5 className="modal-title">Orders</h5>
              <button
                type="button"
                className="close"
                data-bs-dismiss="modal"
                aria-label="Close"
              >
                <span aria-hidden="true">×</span>
              </button>
            </div>
            <div className="modal-body p-4">
              <div className="tabs-sets">
                <ul className="nav nav-tabs" id="myTabs" role="tablist">
                  <li className="nav-item" role="presentation">
                    <button
                      className="nav-link active"
                      id="onhold-tab"
                      data-bs-toggle="tab"
                      data-bs-target="#onhold"
                      type="button"
                      aria-controls="onhold"
                      aria-selected="true"
                      role="tab"
                    >
                      Onhold
                    </button>
                  </li>
                  <li className="nav-item" role="presentation">
                    <button
                      className="nav-link"
                      id="unpaid-tab"
                      data-bs-toggle="tab"
                      data-bs-target="#unpaid"
                      type="button"
                      aria-controls="unpaid"
                      aria-selected="false"
                      role="tab"
                    >
                      Unpaid
                    </button>
                  </li>
                  <li className="nav-item" role="presentation">
                    <button
                      className="nav-link"
                      id="paid-tab"
                      data-bs-toggle="tab"
                      data-bs-target="#paid"
                      type="button"
                      aria-controls="paid"
                      aria-selected="false"
                      role="tab"
                    >
                      Paid
                    </button>
                  </li>
                </ul>
                <div className="tab-content">
                  <div className="tab-pane fade show active" id="onhold" role="tabpanel" aria-labelledby="onhold-tab">
                    <div className="table-top">
                      <div className="search-set w-100 search-order">
                        <div className="search-input w-100">
                          <input
                            type="text"
                            placeholder="Search"
                            className="form-control form-control-sm formsearch w-100"
                          />
                          <Link to className="btn btn-searchset">
                            <i data-feather="search" className="feather-search" />
                          </Link>
                        </div>
                      </div>
                    </div>
                    <div className="order-body">
                      {invStore && invStore.filter((e) => e.clientId === loginUser?.clientId && e.branchId === loginUser?.branchId && e.paymentStatus === "hold").map((x) => (
                        <div className="default-cover p-4 mb-4" key={x.invID}>
                          <span className="badge bg-secondary d-inline-block mb-4" style={{ background: "#666658" }}>
                            Order ID: {x.invID}
                          </span>
                          <div className="row">
                            <div className="col-sm-12 col-md-6 record mb-3">
                              <table>
                                <tbody>
                                  <tr className="mb-3">
                                    <td>Cashier</td>
                                    <td className="colon">:</td>
                                    <td className="text">{x.users}</td>
                                  </tr>
                                  <tr>
                                    <td>Customer</td>
                                    <td className="colon">:</td>
                                    <td className="text">{x.customerName}</td>
                                  </tr>
                                </tbody>
                              </table>
                            </div>
                            <div className="col-sm-12 col-md-6 record mb-3">
                              <table>
                                <tbody>
                                  <tr>
                                    <td>Total</td>
                                    <td className="colon">:</td>
                                    <td className="text">{formatCurrency(x.netTotal)}</td>
                                  </tr>
                                  <tr>
                                    <td>Date</td>
                                    <td className="colon">:</td>
                                    <td className="text">{dateFormat(x.date)}</td>
                                  </tr>
                                </tbody>
                              </table>
                            </div>
                          </div>
                          <p className="p-4">
                            Customer need to recheck the product once
                          </p>
                          <div className="btn-row d-sm-flex align-items-center justify-content-between">
                            <Link
                              to="#"
                              className="btn btn-info btn-icon flex-fill"
                            >
                              Open
                            </Link>
                            <Link
                              to="#"
                              className="btn btn-danger btn-icon flex-fill"
                            >
                              Products
                            </Link>
                            <Link
                              to="#"
                              className="btn btn-success btn-icon flex-fill"
                            >
                              Print
                            </Link>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="tab-pane fade" id="unpaid" role="tabpanel">
                    <div className="table-top">
                      <div className="search-set w-100 search-order">
                        <div className="search-input w-100">
                          <input
                            type="text"
                            placeholder="Search"
                            className="form-control form-control-sm formsearch w-100"
                          />
                          <Link to className="btn btn-searchset">
                            <i data-feather="search" className="feather-search" />
                          </Link>
                        </div>
                      </div>
                    </div>
                    <div className="order-body">
                      {invStore && invStore.filter((e) => e.paymentStatus === "unpaid").map((x) => (
                        <div className="default-cover p-4 mb-4" key={x.invID}>
                          <span className="badge bg-secondary d-inline-block mb-4" style={{ background: "#666658" }}>
                            Order ID: {x.invID}
                          </span>
                          <div className="row">
                            <div className="col-sm-12 col-md-6 record mb-3">
                              <table>
                                <tbody>
                                  <tr className="mb-3">
                                    <td>Cashier</td>
                                    <td className="colon">:</td>
                                    <td className="text">{x.users}</td>
                                  </tr>
                                  <tr>
                                    <td>Customer</td>
                                    <td className="colon">:</td>
                                    <td className="text">{x.customerName}</td>
                                  </tr>
                                </tbody>
                              </table>
                            </div>
                            <div className="col-sm-12 col-md-6 record mb-3">
                              <table>
                                <tbody>
                                  <tr>
                                    <td>Total</td>
                                    <td className="colon">:</td>
                                    <td className="text">{formatCurrency(x.netTotal)}</td>
                                  </tr>
                                  <tr>
                                    <td>Date</td>
                                    <td className="colon">:</td>
                                    <td className="text">{dateFormat(x.date)}</td>
                                  </tr>
                                </tbody>
                              </table>
                            </div>
                          </div>
                          <p className="p-4">
                            Customer need to recheck the product once
                          </p>
                          <div className="btn-row d-sm-flex align-items-center justify-content-between">
                            <Link
                              to="#"
                              className="btn btn-info btn-icon flex-fill"
                            >
                              Open
                            </Link>
                            <Link
                              to="#"
                              className="btn btn-danger btn-icon flex-fill"
                            >
                              Products
                            </Link>
                            <Link
                              to="#"
                              className="btn btn-success btn-icon flex-fill"
                            >
                              Print
                            </Link>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="tab-pane fade" id="paid" role="tabpanel">
                    <div className="table-top">
                      <div className="search-set w-100 search-order">
                        <div className="search-input w-100">
                          <input
                            type="text"
                            placeholder="Search"
                            className="form-control form-control-sm formsearch w-100"
                          />
                          <Link to className="btn btn-searchset">
                            <i data-feather="search" className="feather-search" />
                          </Link>
                        </div>
                      </div>
                    </div>
                    <div className="order-body">
                      {invStore && invStore.filter((e) => e.paymentStatus === "paid").map((x) => (
                        <div className="default-cover p-4 mb-4" key={x.invID}>
                          <span className="badge bg-secondary d-inline-block mb-4" style={{ background: "#666658" }}>
                            Order ID: {x.invID}
                          </span>
                          <div className="row">
                            <div className="col-sm-12 col-md-6 record mb-3">
                              <table>
                                <tbody>
                                  <tr className="mb-3">
                                    <td>Cashier</td>
                                    <td className="colon">:</td>
                                    <td className="text">{x.users}</td>
                                  </tr>
                                  <tr>
                                    <td>Customer</td>
                                    <td className="colon">:</td>
                                    <td className="text">{x.customerName}</td>
                                  </tr>
                                </tbody>
                              </table>
                            </div>
                            <div className="col-sm-12 col-md-6 record mb-3">
                              <table>
                                <tbody>
                                  <tr>
                                    <td>Total</td>
                                    <td className="colon">:</td>
                                    <td className="text">{formatCurrency(x.netTotal)}</td>
                                  </tr>
                                  <tr>
                                    <td>Date</td>
                                    <td className="colon">:</td>
                                    <td className="text">{dateFormat(x.date)}</td>
                                  </tr>
                                </tbody>
                              </table>
                            </div>
                          </div>
                          <p className="p-4">
                            Customer need to recheck the product once
                          </p>
                          <div className="btn-row d-sm-flex align-items-center justify-content-between">
                            <Link
                              to="#"
                              className="btn btn-info btn-icon flex-fill"
                            >
                              Open
                            </Link>
                            <Link
                              to="#"
                              className="btn btn-danger btn-icon flex-fill"
                            >
                              Products
                            </Link>
                            <Link
                              to="#"
                              className="btn btn-success btn-icon flex-fill"
                            >
                              Print
                            </Link>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* /Recent Orders */}

      {/* /Debit Card */}
      <div
        className="modal fade"
        id="debit-Card"
        tabIndex={-1}
        aria-labelledby="debit-Card"
        aria-hidden="true"
      >
        <div
          className="modal-dialog modal-lg modal-dialog-centered"
          role="document"
        >
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Debit Card</h5>
              <button
                type="button"
                className="close"
                data-bs-dismiss="modal"
                aria-label="Close"
              >
                <span aria-hidden="true">×</span>
              </button>
            </div>
            <div className="modal-body">
              <form onSubmit={handleDebitCard}>
                <div className="row">
                  <div className="col-lg-12 col-sm-12 col-12">
                    <div className="input-blocks">
                      <label>Debit Card</label>
                      <input type="text" className="form-control" ref={cardInputRef} onChange={(e) => setCart({ ...cart, cardNo: e.target.value })} />
                      {errors.card && <p style={{ color: "#ff7676" }}>{errors.card}</p>}
                    </div>
                  </div>
                </div>
                <div className="modal-footer d-sm-flex justify-content-end">
                  <button
                    type="button"
                    className="btn btn-cancel"
                    data-bs-dismiss="modal"
                  >
                    Close
                  </button>
                  <button to="#" className="btn btn-submit me-2">Submit</button>
                  <button to="#" ref={closeDebitCardBtn} className="btn btn-submit me-2" data-bs-dismiss="modal" hidden>Submit</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>

    </div>
  )
}

export default Pos