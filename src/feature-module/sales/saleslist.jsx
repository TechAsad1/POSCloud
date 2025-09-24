import React, { useEffect, useRef, useState } from "react";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import { Link } from "react-router-dom";
import ImageWithBasePath from "../../core/img/imagewithbasebath";
import {
  Calendar,
  ChevronUp,
  PlusCircle,
  RotateCcw,
  Sliders,
  StopCircle,
  User,
} from "feather-icons-react/build/IconComponents";
import { addToSaleCart, addToSaleCartWithoutPics, changeUnitCartRow, clearCart, decrementCart, deleteSaleInv, getBranchById, getClientById, getCustomer, getProduct, getSaleByID, getSaleInv, getTransactionByRID, incrementCart, insertSale, qty_KeyDownCart, qty_LeaveCart, removeCartRow, rowDiscCart, rowGstCart, rowPrice_Leave, rowPriceCart, setToogleHeader } from "../../core/redux/action";
import { useDispatch, useSelector } from "react-redux";
import { Filter, MinusCircle } from "react-feather";
import Select from "react-select";
import { DatePicker } from "antd";
import Table from "../../core/pagination/datatable";
import withReactContent from "sweetalert2-react-content";
import Swal from "sweetalert2";
import { dateFormat, formatCurrency, getImageFromUrl } from "../../helper/helpers";
import { FaMinus, FaPlus } from "react-icons/fa";
import config from "../../core/redux/api/config"
import axios from "axios";
import { useLoginData } from "../../helper/loginUserData";

const SalesList = () => {

  const data = useSelector((state) => state.toggle_header);
  const [isFilterVisible, setIsFilterVisible] = useState(false);
  const toggleFilterVisibility = () => {
    setIsFilterVisible((prevVisibility) => !prevVisibility);
  };
  const oldandlatestvalue = [
    { value: "date", label: "Sort by Date" },
    { value: "newest", label: "Newest" },
    { value: "oldest", label: "Oldest" },
  ];
  const statusupdate = [
    { value: "Supplier", label: "Choose" },
    { value: "Completed", label: "Completed" },
    { value: "InProgress", label: "InProgress" },
  ];
  const paymentModes = [
    { value: "Choose Payment Mode", label: "Choose Payment Mode" },
    { value: "Cash", label: "Cash" },
    { value: "Cheque", label: "Cheque" },
    { value: "Credit", label: "Credit" },
  ];
  const paymentStatus = [
    { value: "Choose", label: "Choose" },
    { value: "Received", label: "Received" },
    { value: "Pending", label: "Pending" },
  ];

  const [selectedDate, setSelectedDate] = useState(new Date());
  const handleDateChange = (date) => {
    setSelectedDate(date);
  };
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
  const renderRefreshTooltip = (props) => (
    <Tooltip id="refresh-tooltip" {...props}>
      Refresh
    </Tooltip>
  );
  const renderCollapseTooltip = (props) => (
    <Tooltip id="refresh-tooltip" {...props}>
      Collapse
    </Tooltip>
  );
  const MySwal = withReactContent(Swal);
  const showConfirmationAlert = (id) => {
    MySwal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      showCancelButton: true,
      confirmButtonColor: "#00ff00",
      confirmButtonText: "Yes, delete it!",
      cancelButtonColor: "#ff0000",
      cancelButtonText: "Cancel",
    }).then((result) => {
      if (result.isConfirmed) {
        MySwal.fire({
          title: "Deleted!",
          text: "Your file has been deleted.",
          className: "btn btn-success",
          confirmButtonText: "OK",
          customClass: {
            confirmButton: "btn btn-success",
          },
        });
        dispatch(deleteSaleInv(id));
      } else {
        MySwal.close();
      }
    });
  };
  const columns = [
    {
      title: "Date",
      dataIndex: "createdDate",
      render: (text) => <span>{dateFormat(text)}</span>,
      sorter: (a, b) => a.createdDate.length - b.createdDate.length,
    },
    {
      title: "InvoiceNo",
      dataIndex: "receiptNo",
      render: (text) => <span>SI/{text}</span>,
      sorter: (a, b) => a.receiptNo.length - b.receiptNo.length,
    },
    {
      title: "Customer",
      dataIndex: "customerId",
      render: (x) => <span>{customerStore.find((i) => i.customerId == x)?.customerName}</span>,
      sorter: (a, b) => a.customerId.length - b.customerId.length,
    },
    {
      title: "PaymentMode",
      dataIndex: "paymentMode",
      sorter: (a, b) => a.paymentMode.length - b.paymentMode.length,
    },
    {
      title: "Invoice Status",
      dataIndex: "isHold",
      render: (x) => (
        <div>
          {!x && (
            <span className="badge badge-linesuccess">Completed</span>
          )}
          {x && (
            <span className="badge badges-warning">Hold</span>
          )}
        </div>
      ),
      sorter: (a, b) => a.status.length - b.status.length,
    },
    {
      title: "Total",
      dataIndex: "netTotal",
      render: (txt) => <span>{formatCurrency(txt)}</span>,
      sorter: (a, b) => a.netTotal.length - b.netTotal.length,
    },
    {
      title: "Actions",
      dataIndex: "actions",
      key: "actions",
      render: (_, record) => (
        <div className="text-center">
          <Link className="action-set" to="#" data-bs-toggle="dropdown" aria-expanded="true">
            <i className="fa fa-ellipsis-v" aria-hidden="true"></i>
          </Link>
          <ul className="dropdown-menu">
            <li>
              <Link to="#" className="dropdown-item" data-bs-toggle="modal" data-bs-target="#sales-details-new" onClick={() => handleViewDetail(record.receiptNo)}><i data-feather="eye" className="feather-eye me-2"></i>Sale Detail</Link>
            </li>
            <li>
              <Link to="#" className="dropdown-item" data-bs-toggle="modal" data-bs-target="#edit-sales-new"><i data-feather="edit" className="feather-edit me-2"></i>Edit Sale</Link>
            </li>
            <li>
              <Link to="#" className="dropdown-item" data-bs-toggle="modal" data-bs-target="#showpayment" onClick={() => handleShowPayment(record.receiptNo)}><i data-feather="dollar-sign" className="feather-dollar-sign"></i>Show Payments</Link>
            </li>
            <li>
              <Link to="#" className="dropdown-item" data-bs-toggle="modal" data-bs-target="#createpayment"><i data-feather="plus-circle" className="feather-plus-circle me-2"></i>Create Payment</Link>
            </li>
            <li>
              <Link to="#" className="dropdown-item"><i data-feather="download" className="feather-edit me-2"></i>Download pdf</Link>
            </li>
            <li>
              <Link to="#" className="dropdown-item confirm-text mb-0" onClick={() => showConfirmationAlert(record.receiptNo)}><i data-feather="trash-2" className="feather-trash me-2"  ></i>Delete Sale</Link>
            </li>
          </ul>
        </div>
      ),
    },
  ];
  //Custom Code
  const dispatch = useDispatch();
  const stock = useSelector((state) => state.posts);
  const rows = useSelector((state) => state.rows);
  const posts1 = useSelector((state) => state.saleInv);
  const singleBranch = useSelector((state) => state.branches);
  const trInv = useSelector((state) => state.trInv);
  const singleClient = useSelector((state) => state.clients);
  const [showView, setShowView] = useState(false);
  const [invID, setInvID] = useState(0);
  const [dataSource, setDataSource] = useState([]);
  const loginUser = useLoginData();


  const cartStore = useSelector((state) => state.cart);
  const [cart, setCart] = useState({ customerID: 1, paymentStatus: "Received", total: 0, gst: 0, gstPerc: 0, disc: 0, discPerc: 0, netTotal: 0, paymentMode: "Cash" });
  //Product
  const productStore = useSelector((state) => state.posts);
  const [productArray, setProductArray] = useState([{ value: 0, label: 'Choose product name' }]);
  const [selectProduct, setSelectProduct] = useState(productArray[0]);
  //Customer
  const customerStore = useSelector((state) => state.customers);
  const [customerList, setCustomerList] = useState([]);
  const [selectCustomer, setSelectCustomer] = useState(customerList[0]);

  //PaymentMode
  const [selectPaymentMode, setSelectPaymentMode] = useState(paymentModes[0]);
  const [selectPaymentStatus, setSelectPaymentStatus] = useState(paymentStatus[0]);
  //Invoice PaymentMode
  const [selectMode, setSelectMode] = useState(paymentModes[1]);
  //Invoice PaymentStatus
  const [selectStatus, setSelectStatus] = useState(paymentStatus[1]);

  const [posts, setPosts] = useState([]);

  const dynamicTableBG = useRef();
  const barcodeRef = useRef();

  useEffect(() => {
    if (loginUser) {
      const filtered = posts1.filter(
        (i) =>
          i.clientId === loginUser.clientId &&
          i.branchId === loginUser.branchId
      );
      setPosts(filtered);
    } else {
      setPosts([]);
    }
  }, [loginUser, posts1]);

  useEffect(() => {
    dispatch(clearCart());
    dispatch(getSaleInv());
    dispatch(getCustomer());
    dispatch(getProduct());
  }, [dispatch]);
  useEffect(() => {
    searchEngine("", "");
  }, [posts]);
  useEffect(() => {
    setCustomerList([]);
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
      ...(filteredCustomers || []),
    ]);
    setSelectCustomer(customerList[0]);
  }, [customerStore, loginUser]);
  useEffect(() => {
    setShowView(true);
  }, [rows]);
  useEffect(() => {
    setProductArray((prev) => [
      prev[0],
      ...productStore.filter((i) => i.clientId === loginUser?.clientId && i.branchId === loginUser?.branchId).map((x) => ({
        value: x.productId,
        label: x.productName
      }))
    ]);
  }, [productStore, loginUser]);
  useEffect(() => {
    calculation();
  }, [cart.gstPerc, cart.discPerc]);
  useEffect(() => {
    calculation();
  }, [cartStore]);

  //AddToCart
  const handleChange = (e) => {
    setSelectProduct(productArray.find((x) => x.value === e));
    if (e > 0) {
      dispatch(addToSaleCartWithoutPics(productStore.filter((i) => i.clientId === loginUser?.clientId && i.branchId === loginUser?.branchId && i.productId === e)));
      const currentHeight = dynamicTableBG.current.offsetHeight;
      dynamicTableBG.current.style.height = currentHeight + 70 + "px";
      calculation();
    }
  };
  const handleChangeBarcode = (e) => {
    if (e != "") {
      const x = productStore.filter((i) => i.clientId === loginUser?.clientId && i.branchId === loginUser?.branchId && i.qrcodeBarcode === e);
      if (x.length > 0) {
        dispatch(addToSaleCart(x));
        const currentHeight = dynamicTableBG.current.offsetHeight;
        dynamicTableBG.current.style.height = currentHeight + 70 + "px";
        barcodeRef.current.value = "";
      }
    }
  };
  const handleSelectCustomer = (e) => {
    setSelectCustomer(customerList.find((x) => x.value === e));
    setCart({ ...cart, customerID: e });
  };
  const handleMode = (e) => {
    setSelectMode(paymentModes.find((x) => x.value === e));
    if (e === "Credit") {
      setSelectStatus(paymentStatus.find((x) => x.value === "Pending"));
      setCart({ ...cart, paymentStatus: "Pending", paymentMode: "Credit" });
    }
    else {
      setSelectStatus(paymentStatus.find((x) => x.value === "Received"));
      setCart({ ...cart, paymentStatus: "Received", paymentMode: "Cash" });
    }
  };
  const handleStatus = (e) => {
    if (e === "Pending") {
      setSelectMode(paymentModes.find((x) => x.value === "Credit"));
      setSelectStatus(paymentStatus.find((x) => x.value === "Pending"));
      setCart({ ...cart, paymentStatus: "Pending", paymentMode: "Credit" });
    }
    else {
      setSelectMode(paymentModes.find((x) => x.value === "Cash"));
      setSelectStatus(paymentStatus.find((x) => x.value === e));
      setCart({ ...cart, paymentStatus: "Received", paymentMode: "Cash" });
    }
  };
  const handleRowDecrement = (num, index) => {
    if (num > 1) {
      dispatch(decrementCart(index))
    }
  };
  const handleRowUOM = (e, index) => {
    dispatch(changeUnitCartRow(e.value, index));
  };
  const uomOptions = (min, max) => {
    if (min === max)
      return [
        { value: min, label: min },
      ]
    else
      return [
        { value: min, label: min },
        ...(max ? [{ value: max, label: max }] : [])
      ]
  };
  const calculation = () => {
    let _total = cartStore.reduce((sum, i) => { return sum + i.netTotal }, 0);
    let dis = (cart.discPerc * _total) / 100;
    let _gst = (cart.gstPerc * _total) / 100;
    let _netTotal = (_total + _gst) - dis;
    setCart({ ...cart, total: _total, netTotal: _netTotal, disc: dis, gst: _gst });
  }

  const url = config.url;
  const handleFormSubmit = async () => {
    const mainUrl = url + "SaleInv";
    if (cartStore.length > 0) {
      if (cart.paymentStatus === "Choose")
        modeReqAlert();
      else {
        const insertTemp = {
          clientId: loginUser?.clientId,
          branchId: loginUser?.branchId,
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
          isHold: false,
        };
        let rid = 0;
        try {
          await axios.post(mainUrl, insertTemp).then((e) => {
            rid = e.data.receiptNo;
            dispatch(getSaleInv());
          });
        } catch (error) {
          console.log(error.message);
        }
        if (rid > 0) {
          const array = cartStore.map((x) => ({
            clientId: loginUser?.clientId,
            branchId: loginUser?.branchId,
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
          }));
          dispatch(insertSale(array));
          successAlert();
        }
      }
    }
    else
      productReqAlert();
  };
  const successAlert = () => {
    MySwal.fire({
      icon: "success",
      title: "Record inserted successfully",
      confirmButtonText: "Ok",
    })
    dispatch(clearCart());
    calculation();
    setSelectProduct(productArray[0]);
    setSelectCustomer(customerList[0]);
    setCart({ ...cart, customerID: 1, paymentStatus: "Received", total: 0, gst: 0, gstPerc: 0, disc: 0, discPerc: 0, netTotal: 0, paymentMode: "Cash" });
    setSelectMode(paymentModes[1]);
    setSelectStatus(paymentStatus[1]);
  };
  const productReqAlert = () => {
    MySwal.fire({
      icon: "error",
      title: 'Empty Cart!',
      text: "You have not added any products to the cart!",
      confirmButtonText: 'OK',
      customClass: {
        confirmButton: 'btn btn-danger',
      },
    });
  };
  const modeReqAlert = () => {
    MySwal.fire({
      icon: "error",
      title: 'Payment Mode Required!',
      text: "You have selected the wrong payment mode!",
      confirmButtonText: 'OK',
      customClass: {
        confirmButton: 'btn btn-danger',
      },
    });
  };
  const removeCartRowAlert = (i) => {
    MySwal.fire({
      title: 'Are you sure ?',
      text: 'You won\'t to remove this product into cart!',
      showCancelButton: true,
      confirmButtonColor: '#00ff00',
      confirmButtonText: 'Yes, delete it!',
      cancelButtonColor: '#ff0000',
      cancelButtonText: 'Cancel',
    }).then((result) => {
      if (result.isConfirmed) {
        const currentHeight = dynamicTableBG.current.offsetHeight;
        dynamicTableBG.current.style.height = `${currentHeight - 70}px`;
        dispatch(removeCartRow(i));
        MySwal.close();
      }
    });
  };

  //Search Engine
  const searchEngine = (action, key) => {
    if (action === "newest") {
      setDataSource(posts.sort((a, b) => a.receiptNo - b.receiptNo)
        .slice(0, posts.length));
    }
    else if (action === "oldest") {
      setDataSource(posts.sort((a, b) => b.receiptNo - a.receiptNo)
        .slice(0, posts.length));
    }
    else if (action === "filter") {
      handleFilter();
    }
    else {
      setDataSource(posts.filter((item) =>
        Object.values(item).some(
          (value) =>
            typeof value === "string" &&
            value.toLowerCase().includes(key.toLowerCase())
        )
      ));
    }
  }
  const handleFilter = () => {
    if (selectCustomer.value === 0 && selectPaymentMode.value === "Choose Payment Mode" && selectPaymentStatus.value === "Choose Payment Status") {
      setDataSource(posts.filter((x) => x.customerName === selectCustomer.label));
    }
    else if (selectCustomer.value < 0 && selectPaymentMode.value != "Choose Payment Mode" && selectPaymentStatus.value === "Choose Payment Status") {
      setDataSource(posts.filter((x) => x.paymentMode === selectPaymentMode.value));
    }
    else if (selectCustomer.value < 0 && selectPaymentMode.value === "Choose Payment Mode" && selectPaymentStatus.value != "Choose Payment Status") {
      setDataSource(posts.filter((x) => x.paymentStatus === selectPaymentStatus.value));
    }
    //Walk-In-Customer
    else if (selectCustomer.value === 0 && selectPaymentMode.value != "Choose Payment Mode" && selectPaymentStatus.value === "Choose Payment Status") {
      setDataSource(posts.filter((x) => x.customerName === selectCustomer.label && x.paymentMode === selectPaymentMode.value));
    }
    else if (selectCustomer.value === 0 && selectPaymentMode.value === "Choose Payment Mode" && selectPaymentStatus.value != "Choose Payment Status") {
      setDataSource(posts.filter((x) => x.customerName === selectCustomer.label && x.paymentStatus === selectPaymentStatus.value));
    }
    else if (selectCustomer.value === 0 && selectPaymentMode.value != "Choose Payment Mode" && selectPaymentStatus.value != "Choose Payment Status") {
      setDataSource(posts.filter((x) => x.customerName === selectCustomer.label && x.paymentMode === selectPaymentMode.value && x.paymentStatus === selectPaymentStatus.value));
    }

    else if (selectCustomer.value > 0 && selectPaymentMode.value != "Choose Payment Mode" && selectPaymentStatus.value === "Choose Payment Status") {
      setDataSource(posts.filter((x) => x.customerId === selectCustomer.value && x.paymentMode === selectPaymentMode.value));
    }
    else if (selectCustomer.value > 0 && selectPaymentMode.value === "Choose Payment Mode" && selectPaymentStatus.value != "Choose Payment Status") {
      setDataSource(posts.filter((x) => x.customerId === selectCustomer.value && x.paymentStatus === selectPaymentStatus.value));
    }
    else if (selectCustomer.value < 0 && selectPaymentMode.value != "Choose Payment Mode" && selectPaymentStatus.value != "Choose Payment Status") {
      setDataSource(posts.filter((x) => x.paymentMode === selectPaymentMode.value && x.paymentStatus === selectPaymentStatus.value));
    }
    else {
      setDataSource(posts.filter((x) => x.customerId === selectCustomer.value && x.paymentMode === selectPaymentMode.value && x.paymentStatus === selectPaymentStatus.value));
    }
  }
  const handleViewDetail = (id) => {
    const inv = posts.find((x) => x.receiptNo === id);
    dispatch(getBranchById(inv.branchId));
    dispatch(getClientById(inv.clientId));
    dispatch(getSaleByID(id));
    dispatch(getTransactionByRID(id, "Sale"));
    setInvID(id);
  }
  const handleShowPayment = (id) => {
    dispatch(getTransactionByRID(id, "Sale"));
  }

  const gst = [
    { value: '0', label: 'GST 0%' },
    { value: '5', label: 'GST 5%' },
    { value: '10', label: 'GST 10%' },
    { value: '15', label: 'GST 15%' },
    { value: '20', label: 'GST 20%' },
    { value: '25', label: 'GST 25%' },
    { value: '30', label: 'GST 30%' },
  ];
  const discount = [
    { value: '0', label: '0%' },
    { value: '5', label: '5%' },
    { value: '10', label: '10%' },
    { value: '15', label: '15%' },
    { value: '20', label: '20%' },
    { value: '25', label: '25%' },
    { value: '30', label: '30%' },
  ];
  const [selectGst, setSelectGst] = useState(gst[0]);
  const [selectDiscount, setSelectDiscount] = useState(discount[0]);
  const handleChangeGst = (e) => {
    setSelectGst(gst.find((i) => i.value === e));
    setCart({ ...cart, gstPerc: e })
  }
  const handleChangeDiscount = (e) => {
    setSelectDiscount(discount.find((i) => i.value === e));
    setCart({ ...cart, discPerc: e })
  }

  return (
    <div>
      <div className="page-wrapper">
        <div className="content">
          <div className="page-header">
            <div className="add-item d-flex">
              <div className="page-title">
                <h4>Sales List</h4>
                <h6>Manage Your Sales</h6>
              </div>
            </div>
            <ul className="table-top-head">
              <li>
                <OverlayTrigger placement="top" overlay={renderTooltip}>
                  <Link>
                    <ImageWithBasePath
                      src="assets/img/icons/pdf.svg"
                      alt="img"
                    />
                  </Link>
                </OverlayTrigger>
              </li>
              <li>
                <OverlayTrigger placement="top" overlay={renderExcelTooltip}>
                  <Link data-bs-toggle="tooltip" data-bs-placement="top">
                    <ImageWithBasePath
                      src="assets/img/icons/excel.svg"
                      alt="img"
                    />
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
              <li>
                <OverlayTrigger placement="top" overlay={renderRefreshTooltip}>
                  <Link data-bs-toggle="tooltip" data-bs-placement="top">
                    <RotateCcw />
                  </Link>
                </OverlayTrigger>
              </li>
              <li>
                <OverlayTrigger placement="top" overlay={renderCollapseTooltip}>
                  <Link
                    data-bs-toggle="tooltip"
                    data-bs-placement="top"
                    id="collapse-header"
                    className={data ? "active" : ""}
                    onClick={() => {
                      dispatch(setToogleHeader(!data));
                    }}
                  >
                    <ChevronUp />
                  </Link>
                </OverlayTrigger>
              </li>
            </ul>
            <div className="page-btn">
              <Link
                to="#"
                className="btn btn-added"
                data-bs-toggle="modal"
                data-bs-target="#add-sales-new"
              >
                <PlusCircle className="me-2" />
                Add New Sales
              </Link>
            </div>
          </div>
          {/* /product list */}
          <div className="card table-list-card">
            <div className="card-body">
              <div className="table-top">
                <div className="search-set">
                  <div className="search-input">
                    <input
                      type="text"
                      placeholder="Search"
                      className="form-control form-control-sm formsearch"
                      aria-controls="DataTables_Table_0"
                      onChange={(e) => searchEngine("search", e.target.value.toLowerCase())}
                    />
                    <Link to className="btn btn-searchset">
                      <i data-feather="search" className="feather-search" />
                    </Link>
                  </div>
                </div>
                <div className="search-path">
                  <div className="d-flex align-items-center">
                    <div className="search-path">
                      <Link
                        className={`btn btn-filter ${isFilterVisible ? "setclose" : ""
                          }`}
                        id="filter_search"
                      >
                        <Filter
                          className="filter-icon"
                          onClick={toggleFilterVisibility}
                        />
                        <span onClick={toggleFilterVisibility}>
                          <ImageWithBasePath
                            src="assets/img/icons/closes.svg"
                            alt="img"
                          />
                        </span>
                      </Link>
                    </div>
                  </div>
                </div>
                <div className="form-sort">
                  <Sliders className="info-img" />
                  <Select
                    className="img-select"
                    classNamePrefix="react-select"
                    options={oldandlatestvalue}
                    placeholder="Newest"
                    onChange={(e) => searchEngine(e.value, "")}
                  />
                </div>
              </div>
              {/* /Filter */}
              <div
                className={`card${isFilterVisible ? " visible" : ""}`}
                id="filter_inputs"
                style={{ display: isFilterVisible ? "block" : "none" }}
              >
                <div className="card-body pb-0">
                  <div className="row">
                    <div className="col-lg-3 col-sm-6 col-12">
                      <div className="input-blocks">
                        <User className="info-img" />
                        <Select
                          className="img-select"
                          options={customerList}
                          classNamePrefix="react-select"
                          placeholder="Choose Customer Name"
                          onChange={(e) => setSelectCustomer(customerList.find((x) => x.value === e.value))}
                          value={selectCustomer}
                        />
                      </div>
                    </div>
                    <div className="col-lg-3 col-sm-6 col-12">
                      <div className="input-blocks">
                        <StopCircle className="info-img" />
                        <Select
                          className="img-select"
                          options={paymentModes}
                          classNamePrefix="react-select"
                          placeholder="Choose Payment Mode"
                          onChange={(e) => setSelectPaymentMode(paymentModes.find((x) => x.value === e.value))}
                          value={selectPaymentMode}
                        />
                      </div>
                    </div>
                    {/* <div className="col-lg-2 col-sm-6 col-12">
                      <div className="input-blocks">
                        <File className="info-img" />
                        <Select
                          className="img-select"
                          options={refrencecode}
                          classNamePrefix="react-select"
                          placeholder="Enter Reference"
                        />
                      </div>
                    </div> */}
                    <div className="col-lg-3 col-sm-6 col-12">
                      <div className="input-blocks">
                        <i className="fas fa-money-bill info-img" />
                        <Select
                          className="img-select"
                          options={paymentStatus}
                          classNamePrefix="react-select"
                          placeholder="Choose Payment Status"
                          onChange={(e) => setSelectPaymentStatus(paymentStatus.find((x) => x.value === e.value))}
                          value={selectPaymentStatus}
                        />
                      </div>
                    </div>
                    <div className="col-lg-3 col-sm-6 col-12 ms-auto">
                      <div className="input-blocks" onClick={() => searchEngine("filter", "")}>
                        <Link className="btn btn-filters ms-auto">
                          {" "}
                          <i
                            data-feather="search"
                            className="feather-search"
                          />{" "}
                          Search{" "}
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              {/* /Filter */}
              <div className="table-responsive">
                <Table columns={columns} dataSource={dataSource} />
              </div>
            </div>
          </div>
          {/* /product list */}
        </div>
      </div>
      <>
        {/*add popup */}
        <div className="modal fade" id="add-sales-new">
          <div className="modal-dialog modal-fullscreen" style={{ width: "100vw" }}>
            <div className="modal-content">
              <div className="page-wrapper p-0 m-0">
                <div className="content p-0">
                  <div className="modal-header border-0 custom-modal-header">
                    <div className="page-title">
                      <h4> Add Sales</h4>
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
                  <div className="card">
                    <div className="card-body">
                      <div className="row">
                        {/* Customner */}
                        <div className="col-lg-4 col-sm-6 col-12">
                          <div className="input-blocks">
                            <label>Customer Name</label>
                            <Select
                              classNamePrefix="react-select"
                              options={customerList}
                              onChange={(e) => handleSelectCustomer(e.value)}
                              placeholder="Choose Option"
                              value={selectCustomer}
                            />
                          </div>
                        </div>
                        <div className="col-lg-4 col-sm-6 col-12">
                          <div className="input-blocks">
                            <label>Date</label>
                            <div className="input-groupicon calender-input">
                              <Calendar className="info-img" />
                              <DatePicker
                                selected={selectedDate}
                                onChange={handleDateChange}
                                type="date"
                                className="filterdatepicker"
                                dateFormat="dd-MM-yyyy"
                                placeholder="Choose Date"
                              />
                            </div>
                          </div>
                        </div>
                        <div className="col-lg-4 col-sm-6 col-6">
                          <div className="input-blocks">
                            <label>Payment Mode</label>
                            <Select
                              classNamePrefix="react-select"
                              value={selectMode}
                              options={paymentModes}
                              placeholder="Choose Option"
                              onChange={(e) => handleMode(e.value)}
                            />
                          </div>
                        </div>
                      </div>
                      <div className="row">
                        <div className="col-lg-8 col-sm-6 col-12">
                          <label>Product Name</label>
                          <Select
                            className="react-select"
                            options={productArray}
                            value={selectProduct}
                            onChange={(e) => handleChange(e.value)}
                          />
                        </div>
                        <div className="col-lg-4 col-sm-6 col-12">
                          <label>Product Barcode</label>
                          <input type="text" className="form-control" ref={barcodeRef} onChange={(e) => handleChangeBarcode(e.target.value)} />
                        </div>
                      </div>
                      <div className="table-responsive" ref={dynamicTableBG} style={{ height: "120px", transition: "0.3s" }}>
                        <table className="table">
                          <thead>
                            <tr>
                              <th>Product</th>
                              <th>Qty</th>
                              <th>Unit</th>
                              <th>Consumer Price</th>
                              <th>Gross Amount</th>
                              <th>Discount(%)</th>
                              <th>Discount Amount</th>
                              <th>Tax(%)</th>
                              <th>Tax Amount</th>
                              <th>Net Amount</th>
                              <th>Item Price</th>
                              <th>Action</th>
                            </tr>
                          </thead>
                          <tbody>
                            {cartStore?.map((r, index) => (
                              <tr key={index}>
                                <td className="p-2">{r.name}</td>
                                <td className="d-flex text-center">
                                  <button className="btn text-white me-1 qty-btn" onClick={() => handleRowDecrement(r?.qty, index)}>
                                    <FaMinus className="qty-i" />
                                  </button>
                                  <input
                                    type="number"
                                    className="form-control text-center"
                                    name="qty"
                                    value={r?.qty}
                                    onFocus={(e) => e.target.select()}
                                    onChange={(e) => dispatch(qty_KeyDownCart(e.target.value, index))}
                                    onBlur={(e) => dispatch(qty_LeaveCart(e.target.value, index))}
                                  />
                                  <button className="btn text-white ms-1 qty-btn" onClick={() => dispatch(incrementCart(index))}>
                                    <FaPlus className="qty-i" />
                                  </button>
                                </td>
                                <td className="p-2">
                                  <Select
                                    options={uomOptions(r.minUom, r.maxUom)}
                                    classNamePrefix="react-select"
                                    placeholder="Choose Option"
                                    onChange={(e) => handleRowUOM(e, index)}
                                    value={r.uom ? { value: r.uom, label: r.uom } : null}
                                  />
                                </td>
                                <td className="p-2"><input type="number" className="form-control" value={r.price}
                                  onChange={(e) => dispatch(rowPriceCart(e.target.value, index))}
                                  onBlur={(e) => dispatch(rowPrice_Leave(e.target.value, index))}
                                />
                                </td>
                                <td className="p-2">{formatCurrency(r.total)}</td>
                                <td className="p-2"><input type="number" className="form-control" value={r.discPerc} onChange={(e) => dispatch(rowDiscCart(e.target.value, index))} /></td>
                                <td className="p-2">{formatCurrency(r.disc)}</td>
                                <td className="p-2"><input type="number" className="form-control" value={r.gstPerc} onChange={(e) => dispatch(rowGstCart(e.target.value, index))} /></td>
                                <td className="p-2">{formatCurrency(r.gst)}</td>
                                <td className="p-2">{formatCurrency(r.netTotal)}</td>
                                <td className="p-2">{formatCurrency(r.costPrice)}</td>
                                <td>
                                  <Link className="delete-set" onClick={() => removeCartRowAlert(index)}><ImageWithBasePath src="assets/img/icons/delete.svg" alt="svg" /></Link>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                      <div className="row">
                        <div className="col-lg-2 col-md-6 col-sm-12">
                          <div className="input-blocks">
                            <label>Total Items#</label>
                            <input type="text" value={cartStore.length} />
                          </div>
                        </div>
                        <div className="col-lg-2 col-md-6 col-sm-12">
                          <div className="input-blocks">
                            <label>Total</label>
                            <input type="number" className="form-control" value={cart.total.toFixed(2)} />
                          </div>
                        </div>
                        <div className="col-lg-2 col-md-6 col-sm-12">
                          <div className="input-blocks">
                            <label>Discount</label>
                            <div className="row">
                              <div className="col-lg-6 col-md-6 col-sm-12">
                                <Select
                                  classNamePrefix="react-select"
                                  options={discount}
                                  onChange={(e) => handleChangeDiscount(e.value)}
                                  value={selectDiscount}
                                />
                              </div>
                              <div className="col-lg-6 col-md-6 col-sm-12">
                                <input type="number" className="form-control" value={cart.disc.toFixed(2)} />
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="col-lg-2 col-md-6 col-sm-12">
                          <div className="input-blocks">
                            <label>Tax</label>
                            <div className="row">
                              <div className="col-lg-6 col-md-6 col-sm-12">
                                <Select
                                  classNamePrefix="react-select"
                                  options={gst}
                                  onChange={(e) => handleChangeGst(e.value)}
                                  value={selectGst}
                                />
                              </div>
                              <div className="col-lg-6 col-md-6 col-sm-12">
                                <input type="number" className="form-control" value={cart.gst.toFixed(2)} />
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="col-lg-2 col-md-6 col-sm-12">
                          <div className="input-blocks">
                            <label>Net Total</label>
                            <input type="number" className="form-control" value={cart.netTotal.toFixed(2)} />
                          </div>
                        </div>
                        <div className="col-lg-2 col-md-6 col-sm-12">
                          <div className="input-blocks">
                            <label>Payment Status</label>
                            <Select
                              options={paymentStatus}
                              classNamePrefix="react-select"
                              placeholder="Choose Option"
                              onChange={(e) => handleStatus(e.value)}
                              value={selectStatus}
                            />
                          </div>
                        </div>
                      </div>
                      <div className="col-lg-12 text-end">
                        <button
                          type="button"
                          className="btn btn-cancel add-cancel me-3"
                          data-bs-dismiss="modal"
                        >
                          Cancel
                        </button>
                        <Link to="#" className="btn btn-submit add-sale" onClick={handleFormSubmit}>
                          Submit
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* /add popup */}
        {/* details popup */}
        <div className="modal fade" id="sales-details-new">
          <div className="modal-dialog modal-fullscreen">
            <div className="modal-content">
              <div className="page-wrapper details-blk">
                <div className="content p-0">
                  <div className="modal-header border-0 custom-modal-header">
                    <div className="page-title">
                      <h4>Sales Detail : SI/Inv-{invID}</h4>
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
                  {/* <div className="page-header p-4 mb-0">
                    <ul className="table-top-head">
                      <li>
                        <Link
                          data-bs-toggle="tooltip"
                          data-bs-placement="top"
                          title="Pdf"
                        >
                          <i
                            data-feather="edit"
                            className="feather-edit sales-action"
                          />
                        </Link>
                      </li>
                      <li>
                        <Link
                          data-bs-toggle="tooltip"
                          data-bs-placement="top"
                          title="Pdf"
                        >
                          <ImageWithBasePath
                            src="assets/img/icons/pdf.svg"
                            alt="img"
                          />
                        </Link>
                      </li>
                      <li>
                        <Link
                          data-bs-toggle="tooltip"
                          data-bs-placement="top"
                          title="Excel"
                        >
                          <ImageWithBasePath
                            src="assets/img/icons/excel.svg"
                            alt="img"
                          />
                        </Link>
                      </li>
                      <li>
                        <Link
                          data-bs-toggle="tooltip"
                          data-bs-placement="top"
                          title="Print"
                        >
                          <i
                            data-feather="printer"
                            className="feather-rotate-ccw"
                          />
                        </Link>
                      </li>
                    </ul>
                  </div> */}
                  <div className="card">
                    <div className="card-body">
                      {(() => {
                        if (invID > 0 && showView) {
                          const inv = posts.find((x) => x.receiptNo === invID);
                          let contact = ""; let address = ""; let customerName = "";
                          if (inv.customerId > 0) {
                            const cus = customerStore.find((x) => x.customerId === inv.customerId);
                            contact = cus.contact;
                            address = cus.address;
                            customerName = cus.customerName;
                          }
                          return (<>
                            <form>
                              <table className="table table-borderless">
                                <thead>
                                  <tr>
                                    <th>Customer Info</th>
                                    <th>Company Info</th>
                                    <th>Invoice Info</th>
                                    <th></th>
                                  </tr>
                                </thead>
                                <tbody>
                                  <tr>
                                    <td>{customerName}</td>
                                    <td><b>Store Name:</b> {singleClient.clientName}</td>
                                    <td>Reference</td>
                                    <td>SI/Inv-{inv.receiptNo}</td>
                                  </tr>
                                  <tr>
                                    <td>{contact ? contact : ""}</td>
                                    <td>{singleBranch.branchName}</td>
                                    <td>Payment Mode</td>
                                    <td>{inv.paymentMode}</td>
                                  </tr>
                                  <tr>
                                    <td>{address ? address : ""}</td>
                                    <td>{singleBranch.contact}</td>
                                    <td>Receipt Date</td>
                                    <td>{inv.receiptDate}</td>
                                  </tr>
                                  <tr>
                                    <td></td>
                                    <td>{singleBranch.address}</td>
                                    <td></td>
                                    <td></td>
                                  </tr>
                                </tbody>
                              </table>
                              <div className="invoice-box table-height">
                                <h5 className="order-text">Order Summary</h5>
                                <div className="table-responsive no-pagination">
                                  <table className="table  datanew">
                                    <thead>
                                      <tr>
                                        <th>Product</th>
                                        <th>Qty</th>
                                        <th>Sale Price($)</th>
                                        <th>Gross Amount</th>
                                        <th>Discount(%)</th>
                                        <th>Discount Amount($)</th>
                                        <th>Tax(%)</th>
                                        <th>Tax Amount($)</th>
                                        <th>Net Amount($)</th>
                                      </tr>
                                    </thead>
                                    <tbody>
                                      {rows && rows.map((x) => (
                                        <tr key={x.autoId}>
                                          <td>
                                            <img src={getImageFromUrl(stock.find((i) => i.productId === x.productId)?.imageName)} alt="product" width={50} height={50} />
                                            <span style={{ paddingLeft: "5px" }}> {stock.find((i) => i.productId === x.productId)?.productName}</span>
                                          </td>
                                          <td>{x.qty}</td>
                                          <td>{formatCurrency(x.salePrice)}</td>
                                          <td>{formatCurrency(x.qty * x.salePrice)}</td>
                                          <td>{x.discountPrct}</td>
                                          <td>{formatCurrency(x.discountAmount)}</td>
                                          <td>{x.gstprct}</td>
                                          <td>{formatCurrency(x.gstamount)}</td>
                                          <td>{formatCurrency(x.productTotal)}</td>
                                        </tr>
                                      ))}
                                    </tbody>
                                  </table>
                                </div>
                              </div>
                              <div className="row">
                                <div className="row">
                                  <div className="col-lg-6 ms-auto">
                                    <div className="total-order w-100 max-widthauto m-auto mb-4">
                                      <ul>
                                        <li>
                                          <h4>Total Items#</h4>
                                          <h5>{inv.item}</h5>
                                        </li>
                                        <li>
                                          <h4>Total</h4>
                                          <h5>{inv.total}</h5>
                                        </li>
                                        <li>
                                          <h4>Discount({inv.discPerc}%)</h4>
                                          <h5>{formatCurrency(inv.discount)}</h5>
                                        </li>
                                        <li>
                                          <h4>GST(Tax{inv.gstPerc}%)</h4>
                                          <h5>{formatCurrency(inv.gst)}</h5>
                                        </li>
                                        <li>
                                          <h4>Grand Total</h4>
                                          <h5>{formatCurrency(inv.netTotal)}</h5>
                                        </li>
                                      </ul>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </form>
                          </>)
                        }
                      })()}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* /details popup */}
        {/* edit popup */}
        <div className="modal fade" id="edit-sales-new">
          <div className="modal-dialog edit-sales-modal">
            <div className="modal-content">
              <div className="page-wrapper p-0 m-0">
                <div className="content p-0">
                  <div className="page-header p-4 mb-0">
                    <div className="add-item new-sale-items d-flex">
                      <div className="page-title">
                        <h4>Edit Sales</h4>
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
                  </div>
                  <div className="card">
                    <div className="card-body">
                      <form>
                        <div className="row">
                          <div className="col-lg-4 col-sm-6 col-12">
                            <div className="input-blocks">
                              <label>Customer</label>
                              <div className="row">
                                <div className="col-lg-10 col-sm-10 col-10">
                                  <Select
                                    classNamePrefix="react-select"
                                    options={customerStore}
                                    placeholder="Newest"
                                  />
                                </div>
                                <div className="col-lg-2 col-sm-2 col-2 ps-0">
                                  <div className="add-icon">
                                    <Link to="#" className="choose-add">
                                      <PlusCircle className="plus" />
                                    </Link>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="col-lg-4 col-sm-6 col-12">
                            <div className="input-blocks">
                              <label>Purchase Date</label>
                              <div className="input-groupicon calender-input">
                                <Calendar className="info-img" />
                                <DatePicker
                                  selected={selectedDate}
                                  onChange={handleDateChange}
                                  type="date"
                                  className="filterdatepicker"
                                  dateFormat="dd-MM-yyyy"
                                  placeholder="Choose Date"
                                />
                              </div>
                            </div>
                          </div>
                          <div className="col-lg-4 col-sm-6 col-12">
                            <div className="input-blocks">
                              <label>Supplier</label>
                              <Select
                                classNamePrefix="react-select"
                                // options={suppliername}
                                placeholder="Newest"
                              />
                            </div>
                          </div>
                          <div className="col-lg-12 col-sm-6 col-12">
                            <div className="input-blocks">
                              <label>Product Name</label>
                              <div className="input-groupicon select-code">
                                <input
                                  type="text"
                                  placeholder="Please type product code and select"
                                />
                                <div className="addonset">
                                  <ImageWithBasePath
                                    src="assets/img/icons/scanners.svg"
                                    alt="img"
                                  />
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="table-responsive no-pagination">
                          <table className="table  datanew">
                            <thead>
                              <tr>
                                <th>Product</th>
                                <th>Qty</th>
                                <th>Purchase Price($)</th>
                                <th>Discount($)</th>
                                <th>Tax(%)</th>
                                <th>Tax Amount($)</th>
                                <th>Unit Cost($)</th>
                                <th>Total Cost(%)</th>
                              </tr>
                            </thead>
                            <tbody>
                              <tr>
                                <td>
                                  <div className="productimgname">
                                    <Link
                                      to="#"
                                      className="product-img stock-img"
                                    >
                                      <ImageWithBasePath
                                        src="assets/img/products/stock-img-02.png"
                                        alt="product"
                                      />
                                    </Link>
                                    <Link to="#">Nike Jordan</Link>
                                  </div>
                                </td>
                                <td>
                                  <div className="product-quantity">
                                    <span className="quantity-btn">
                                      +
                                      <PlusCircle />
                                    </span>
                                    <input
                                      type="text"
                                      className="quntity-input"
                                      defaultValue={2}
                                    />
                                    <span className="quantity-btn">
                                      <MinusCircle />
                                    </span>
                                  </div>
                                </td>
                                <td>2000</td>
                                <td>500</td>
                                <td>0.00</td>
                                <td>0.00</td>
                                <td>0.00</td>
                                <td>1500</td>
                              </tr>
                              <tr>
                                <td>
                                  <div className="productimgname">
                                    <Link
                                      to="#"
                                      className="product-img stock-img"
                                    >
                                      <ImageWithBasePath
                                        src="assets/img/products/stock-img-03.png"
                                        alt="product"
                                      />
                                    </Link>
                                    <Link to="#">Apple Series 5 Watch</Link>
                                  </div>
                                </td>
                                <td>
                                  <div className="product-quantity">
                                    <span className="quantity-btn">
                                      +
                                      <PlusCircle />
                                    </span>
                                    <input
                                      type="text"
                                      className="quntity-input"
                                      defaultValue={2}
                                    />
                                    <span className="quantity-btn">
                                      <MinusCircle />
                                    </span>
                                  </div>
                                </td>
                                <td>3000</td>
                                <td>400</td>
                                <td>0.00</td>
                                <td>0.00</td>
                                <td>0.00</td>
                                <td>1700</td>
                              </tr>
                              <tr>
                                <td>
                                  <div className="productimgname">
                                    <Link
                                      to="#"
                                      className="product-img stock-img"
                                    >
                                      <ImageWithBasePath
                                        src="assets/img/products/stock-img-05.png"
                                        alt="product"
                                      />
                                    </Link>
                                    <Link to="#">Lobar Handy</Link>
                                  </div>
                                </td>
                                <td>
                                  <div className="product-quantity">
                                    <span className="quantity-btn">
                                      +
                                      <PlusCircle />
                                    </span>
                                    <input
                                      type="text"
                                      className="quntity-input"
                                      defaultValue={2}
                                    />
                                    <span className="quantity-btn">
                                      <MinusCircle />
                                    </span>
                                  </div>
                                </td>
                                <td>2500</td>
                                <td>500</td>
                                <td>0.00</td>
                                <td>0.00</td>
                                <td>0.00</td>
                                <td>2000</td>
                              </tr>
                            </tbody>
                          </table>
                        </div>
                        <div className="row">
                          <div className="col-lg-6 ms-auto">
                            <div className="total-order w-100 max-widthauto m-auto mb-4">
                              <ul>
                                <li>
                                  <h4>Order Tax</h4>
                                  <h5>$ 0.00</h5>
                                </li>
                                <li>
                                  <h4>Discount</h4>
                                  <h5>$ 0.00</h5>
                                </li>
                                <li>
                                  <h4>Shipping</h4>
                                  <h5>$ 0.00</h5>
                                </li>
                                <li>
                                  <h4>Grand Total</h4>
                                  <h5>$5200.00</h5>
                                </li>
                              </ul>
                            </div>
                          </div>
                        </div>
                        <div className="row">
                          <div className="col-lg-3 col-sm-6 col-12">
                            <div className="input-blocks">
                              <label>Order Tax</label>
                              <div className="input-groupicon select-code">
                                <input type="text" placeholder={0} />
                              </div>
                            </div>
                          </div>
                          <div className="col-lg-3 col-sm-6 col-12">
                            <div className="input-blocks">
                              <label>Discount</label>
                              <div className="input-groupicon select-code">
                                <input type="text" placeholder={0} />
                              </div>
                            </div>
                          </div>
                          <div className="col-lg-3 col-sm-6 col-12">
                            <div className="input-blocks">
                              <label>Shipping</label>
                              <div className="input-groupicon select-code">
                                <input type="text" placeholder={0} />
                              </div>
                            </div>
                          </div>
                          <div className="col-lg-3 col-sm-6 col-12">
                            <div className="input-blocks mb-5">
                              <label>Status</label>
                              <Select
                                classNamePrefix="react-select"
                                options={statusupdate}
                                placeholder="Newest"
                              />
                            </div>
                          </div>
                          <div className="col-lg-12">
                            <div className="input-blocks">
                              <label>Notes</label>
                              <textarea
                                className="form-control"
                                defaultValue={""}
                              />
                            </div>
                          </div>
                          <div className="col-lg-12 text-end">
                            <button
                              type="button"
                              className="btn btn-cancel add-cancel me-3"
                              data-bs-dismiss="modal"
                            >
                              Cancel
                            </button>
                            <Link to="#" className="btn btn-submit add-sale">
                              Submit
                            </Link>
                          </div>
                        </div>
                      </form>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* /edit popup */}
        {/* show payment Modal */}
        <div
          className="modal fade"
          id="showpayment"
          tabIndex={-1}
          aria-labelledby="showpayment"
          aria-hidden="true"
        >
          <div className="modal-dialog modal-dialog-centered stock-adjust-modal">
            <div className="modal-content">
              <div className="page-wrapper-new p-0">
                <div className="content">
                  <div className="modal-header border-0 custom-modal-header">
                    <div className="page-title">
                      <h4>Show Payments</h4>
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
                    <div className="row">
                      <div className="col-lg-12">
                        <div className="modal-body-table total-orders">
                          <div className="table-responsive">
                            <table className="table  datanew">
                              <thead>
                                <tr>
                                  <th>Date</th>
                                  <th>Reference</th>
                                  <th>Amount</th>
                                  <th>Paid By</th>
                                  <th className="no-sort">Action</th>
                                </tr>
                              </thead>
                              <tbody>
                                {(() => {
                                  if (trInv === null) {
                                    return (<>
                                      <tr>
                                        <td colSpan="5" className="text-center">Result not found!</td>
                                      </tr>
                                    </>)
                                  }
                                  else {
                                    return (<>
                                      <tr key={trInv.id}>
                                        <td>{dateFormat(trInv.createdDate)}</td>
                                        <td>{trInv.rid}</td>
                                        <td>{trInv.total}</td>
                                        <td>{trInv.paymentMode}</td>
                                        <td className="action-table-data">
                                          <div className="edit-delete-action">
                                            <Link className="me-3 p-2" to="#">
                                              <i
                                                data-feather="printer"
                                                className="feather-rotate-ccw"
                                              />
                                            </Link>
                                            <Link
                                              className="me-3 p-2"
                                              to="#"
                                              data-bs-toggle="modal"
                                              data-bs-target="#editpayment"
                                            >
                                              <i
                                                data-feather="edit"
                                                className="feather-edit"
                                              />
                                            </Link>
                                            <Link className="confirm-text p-2" to="#">
                                              <i
                                                data-feather="trash-2"
                                                className="feather-trash-2"
                                              />
                                            </Link>
                                          </div>
                                        </td>
                                      </tr>
                                    </>)
                                  }
                                })()}

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
          </div>
        </div>
        {/* show payment Modal */}
        {/* Create payment Modal */}
        <div
          className="modal fade"
          id="createpayment"
          tabIndex={-1}
          aria-labelledby="createpayment"
          aria-hidden="true"
        >
          <div className="modal-dialog modal-lg modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header border-0 custom-modal-header">
                <div className="page-title">
                  <h4>Create Payments</h4>
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
                <form>
                  <div className="row">
                    <div className="col-lg-6">
                      <div className="input-blocks">
                        <label> Date</label>
                        <div className="input-groupicon calender-input ">
                          <Calendar className="info-img" />
                          <DatePicker
                            selected={selectedDate}
                            onChange={handleDateChange}
                            type="date"
                            className="filterdatepicker"
                            dateFormat="dd-MM-yyyy"
                            placeholder="Choose Date"
                          />
                        </div>
                      </div>
                    </div>
                    <div className="col-lg-6 col-sm-12 col-12">
                      <div className="input-blocks">
                        <label>Reference</label>
                        <input type="text" className="form-control" />
                      </div>
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-lg-4 col-sm-12 col-12">
                      <div className="input-blocks">
                        <label>Received Amount</label>
                        <div className="input-groupicon calender-input">
                          <i data-feather="dollar-sign" className="info-img" />
                          <input type="text" />
                        </div>
                      </div>
                    </div>
                    <div className="col-lg-4 col-sm-12 col-12">
                      <div className="input-blocks">
                        <label>Paying Amount</label>
                        <div className="input-groupicon calender-input">
                          <i data-feather="dollar-sign" className="info-img" />
                          <input type="text" />
                        </div>
                      </div>
                    </div>
                    <div className="col-lg-4 col-sm-12 col-12">
                      <div className="input-blocks">
                        <label>Payment type</label>
                        <Select
                          classNamePrefix="react-select"
                          options={paymentModes}
                          placeholder="Newest"
                        />
                      </div>
                    </div>
                    <div className="col-lg-12">
                      <div className="input-blocks">
                        <label>Description</label>
                        <textarea className="form-control" defaultValue={""} />
                        <p>Maximum 60 Characters</p>
                      </div>
                    </div>
                  </div>
                  <div className="col-lg-12">
                    <div className="modal-footer-btn">
                      <button
                        type="button"
                        className="btn btn-cancel me-2"
                        data-bs-dismiss="modal"
                      >
                        Cancel
                      </button>
                      <Link to="#" className="btn btn-submit">
                        Submit
                      </Link>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
        {/* Create payment Modal */}
        {/* edit payment Modal */}
        <div
          className="modal fade"
          id="editpayment"
          tabIndex={-1}
          aria-labelledby="editpayment"
          aria-hidden="true"
        >
          <div className="modal-dialog modal-lg modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header border-0 custom-modal-header">
                <div className="page-title">
                  <h4>Edit Payments</h4>
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
                <form>
                  <div className="row">
                    <div className="col-lg-6">
                      <div className="input-blocks">
                        <label>19 Jan 2023</label>
                        <div className="input-groupicon calender-input">
                          <Calendar className="info-img" />
                          <input
                            type="text"
                            className="datetimepicker form-control"
                            placeholder="Select Date"
                          />
                        </div>
                      </div>
                    </div>
                    <div className="col-lg-6 col-sm-12 col-12">
                      <div className="input-blocks">
                        <label>Reference</label>
                        <input type="text" defaultValue="INV/SL0101" />
                      </div>
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-lg-4 col-sm-12 col-12">
                      <div className="input-blocks">
                        <label>Received Amount</label>
                        <div className="input-groupicon calender-input">
                          <i data-feather="dollar-sign" className="info-img" />
                          <input type="text" defaultValue={1500} />
                        </div>
                      </div>
                    </div>
                    <div className="col-lg-4 col-sm-12 col-12">
                      <div className="input-blocks">
                        <label>Paying Amount</label>
                        <div className="input-groupicon calender-input">
                          <i data-feather="dollar-sign" className="info-img" />
                          <input type="text" defaultValue={1500} />
                        </div>
                      </div>
                    </div>
                    <div className="col-lg-4 col-sm-12 col-12">
                      <div className="input-blocks">
                        <label>Payment type</label>
                        <select className="react-select">
                          <option>Cash</option>
                          <option>Online</option>
                          <option>Inprogress</option>
                        </select>
                      </div>
                    </div>
                    <div className="col-lg-12">
                      <div className="input-blocks summer-description-box transfer">
                        <label>Description</label>
                        <textarea className="form-control" defaultValue={""} />
                      </div>
                      <p>Maximum 60 Characters</p>
                    </div>
                  </div>
                  <div className="col-lg-12">
                    <div className="modal-footer-btn mb-3 me-3">
                      <button
                        type="button"
                        className="btn btn-cancel me-2"
                        data-bs-dismiss="modal"
                      >
                        Cancel
                      </button>
                      <button type="submit" className="btn btn-submit">
                        Save Changes
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
        {/* edit payment Modal */}
        <div className="customizer-links" id="setdata">
          <ul className="sticky-sidebar">
            <li className="sidebar-icons">
              <Link
                to="#"
                className="navigation-add"
                data-bs-toggle="tooltip"
                data-bs-placement="left"
                data-bs-original-title="Theme"
              >
                <i data-feather="settings" className="feather-five" />
              </Link>
            </li>
          </ul>
        </div>
      </>
    </div>
  );
};

export default SalesList;
