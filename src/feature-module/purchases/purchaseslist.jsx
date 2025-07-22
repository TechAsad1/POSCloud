import React, { useEffect, useState } from "react";
import ImageWithBasePath from "../../core/img/imagewithbasebath";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import {
  ChevronUp,
  Download,
  Filter,
  PlusCircle,
  RotateCcw,
  Sliders,
  StopCircle,
  User,
} from "feather-icons-react/build/IconComponents";
import { deletePurchaseInv, getBranchById, getClientById, getProduct, getPurchaseByID, getPurchaseInv, getSupplier, getUsers, setToogleHeader } from "../../core/redux/action";
import { useDispatch, useSelector } from "react-redux";
import Select from "react-select";
import ImportPurchases from "../../core/modals/purchases/importpurchases";
import EditPurchases from "../../core/modals/purchases/editpurchases";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import Table from "../../core/pagination/datatable";
import AddPurchases from "../../core/modals/purchases/addpurchases";
import { MinusCircle } from "react-feather";
import { dateFormat, formatCurrency, getImageFromUrl } from "../../helper/helpers";
import { all_routes } from "../../Router/all_routes";

const PurchasesList = () => {

  const route = all_routes;
  const columns = [
    {
      title: "Date",
      dataIndex: "createdDate",
      render: (txt) => <span>{dateFormat(txt)}</span>,
      sorter: (a, b) => new Date(a.createdDate) - new Date(b.createdDate),
    },
    {
      title: "Invoice No#",
      dataIndex: "purchaseNo",
      render: (txt) => <span>PI-{txt}</span>,
      sorter: (a, b) => a.purchaseNo.length - b.purchaseNo.length,
    },
    {
      title: "SupplierName",
      dataIndex: "distributorId",
      render: (txt) => {
        const found = supplier.find((x) => x.distributorId == txt);
        return <span>{found ? found.distributorName : "N/A"}</span>;
      },
      sorter: (a, b) => {
        const nameA = (supplier.find((x) => x.distributorId == a.distributorId)?.distributorName || "").toLowerCase();
        const nameB = (supplier.find((x) => x.distributorId == b.distributorId)?.distributorName || "").toLowerCase();
        return nameA.localeCompare(nameB);
      },
    },
    {
      title: "PaymentMode",
      dataIndex: "paymentMode",
      sorter: (a, b) => a.paymentMode.length - b.paymentMode.length,
    },
    {
      title: "Payment Status",
      dataIndex: "paymentStatus",
      render: (text) => (
        <div>
          {text === "paid" || text === "Received" && (
            <span className="badge badge-linesuccess">{text}</span>
          )}
          {text === "unpaid" && (
            <span className="badge badge-linedanger">{text}</span>
          )}
          {text === "pending" || text === "Pending" && (
            <span className="badge badges-warning">{text}</span>
          )}
        </div>
      ),
      sorter: (a, b) => a.status.length - b.status.length,
    },
    {
      title: "GrandTotal",
      dataIndex: "netTotal",
      render: (txt) => <span>{formatCurrency(txt)}</span>,
      sorter: (a, b) => a.netTotal - b.netTotal,
    },
    {
      title: "Actions",
      dataIndex: "actions",
      key: "actions",
      render: (_, record) => (
        <div className="action-table-data">
          <div className="edit-delete-action">
            <Link className="me-2 p-2" to="#" data-bs-toggle="modal" data-bs-target="#purchase-details" onClick={() => handleViewDetail(record.purchaseNo)}>
              <i data-feather="eye" className="feather-eye"></i>
            </Link>
            {/* <Link className="me-2 p-2" data-bs-toggle="modal" data-bs-target="#edit-units">
              <i data-feather="edit" className="feather-edit"></i>
            </Link> */}
            <Link className="confirm-text p-2" to="#" onClick={() => showConfirmationAlert(record.purchaseNo)}>
              <i data-feather="trash-2" className="feather-trash-2"></i>
            </Link>
          </div>
        </div>
      ),
    },
  ];
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
  const paymentMode = [
    { value: "Choose Payment Mode", label: "Choose Payment Mode" },
    { value: "Cash", label: "Cash" },
    { value: "Cheque", label: "Cheque" },
    { value: "Credit", label: "Credit" },
  ];
  // const refrencecode = [
  //   { value: "enterReference", label: "Enter Reference" },
  //   { value: "PT001", label: "PT001" },
  //   { value: "PT002", label: "PT002" },
  //   { value: "PT003", label: "PT003" },
  // ];
  const paymentStatus = [
    { value: "Choose Payment Status", label: "Choose Payment Status" },
    { value: "Received", label: "Received" },
    { value: "Ordered", label: "Ordered" },
    { value: "Pending", label: "Pending" },
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
      title: 'Are you sure?',
      text: 'You won\'t be able to revert this!',
      showCancelButton: true,
      confirmButtonColor: '#00ff00',
      confirmButtonText: 'Yes, delete it!',
      cancelButtonColor: '#ff0000',
      cancelButtonText: 'Cancel',
    }).then((result) => {
      if (result.isConfirmed) {
        MySwal.fire({
          title: 'Deleted!',
          text: 'Your file has been deleted.',
          confirmButtonText: 'OK',
          customClass: {
            confirmButton: 'btn btn-success',
          },
        });
        dispatch(deletePurchaseInv(id));
      } else {
        MySwal.close();
      }
    });
  };

  //Custom Code
  const dispatch = useDispatch();
  const stock = useSelector((state) => state.posts);
  const rows = useSelector((state) => state.rows);
  const posts1 = useSelector((state) => state.purchaseInv);
  const supplier = useSelector((state) => state.suppliers);
  const singleBranch = useSelector((state) => state.branches);
  const singleClient = useSelector((state) => state.clients);
  const users = useSelector((state) => state.users);
  const [showView, setShowView] = useState(false);
  const [supplierList, setSupplierList] = useState([{ value: 0, label: 'Choose Supplier' }]);
  const [invID, setInvID] = useState(0);
  const [dataSource, setDataSource] = useState([]);

  const [selectSupplier, setSelectSupplier] = useState(supplierList[0]);
  const [selectPaymentMode, setSelectPaymentMode] = useState(paymentMode[0]);
  const [selectPaymentStatus, setSelectPaymentStatus] = useState(paymentStatus[0]);
  const [insertMode, setInsertMode] = useState(false);

  const [posts, setPosts] = useState([]);
  const [loginUser, setLoginUser] = useState(null);

  useEffect(() => {
    if (loginUser) {
      const filtered = posts1.filter(
        (i) =>
          i.clientId === loginUser?.clientId &&
          i.branchId === loginUser?.branchId
      );
      setPosts(filtered);
    } else {
      setPosts([]);
    }
  }, [loginUser, posts1]);


  useEffect(() => {
    dispatch(getPurchaseInv());
    dispatch(getSupplier());
    dispatch(getProduct());
    dispatch(getUsers());
  }, [dispatch]);
  useEffect(() => {
    searchEngine("", "");
  }, [posts]);
  useEffect(() => {
    setSupplierList((prev) => [
      prev[0],
      ...supplier.filter((i) => i.clientId === loginUser?.clientId && i.branchId === loginUser?.branchId).map((x) => ({
        value: x.distributorId,
        label: x.distributorName
      }))
    ]);
  }, [supplier]);
  useEffect(() => {
    setShowView(true);
  }, [rows]);
  //Search Engine
  const searchEngine = (action, key) => {
    if (action === "newest") {
      setDataSource(posts.sort((a, b) => a.purchaseNo - b.purchaseNo)
        .slice(0, posts.length));
    }
    else if (action === "oldest") {
      setDataSource(posts.sort((a, b) => b.purchaseNo - a.purchaseNo)
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
    if (selectSupplier.value > 0 && selectPaymentMode.value === "Choose Payment Mode" && selectPaymentStatus.value === "Choose Payment Status") {
      setDataSource(posts.filter((x) => x.supplierId === selectSupplier.value));
    }
    else if (selectSupplier.value === 0 && selectPaymentMode.value != "Choose Payment Mode" && selectPaymentStatus.value === "Choose Payment Status") {
      setDataSource(posts.filter((x) => x.paymentMode === selectPaymentMode.value));
    }
    else if (selectSupplier.value === 0 && selectPaymentMode.value === "Choose Payment Mode" && selectPaymentStatus.value != "Choose Payment Status") {
      setDataSource(posts.filter((x) => x.paymentStatus === selectPaymentStatus.value));
    }

    else if (selectSupplier.value > 0 && selectPaymentMode.value != "Choose Payment Mode" && selectPaymentStatus.value === "Choose Payment Status") {
      setDataSource(posts.filter((x) => x.supplierId === selectSupplier.value && x.paymentMode === selectPaymentMode.value));
    }
    else if (selectSupplier.value > 0 && selectPaymentMode.value === "Choose Payment Mode" && selectPaymentStatus.value != "Choose Payment Status") {
      setDataSource(posts.filter((x) => x.supplierId === selectSupplier.value && x.paymentStatus === selectPaymentStatus.value));
    }
    else if (selectSupplier.value == 0 && selectPaymentMode.value != "Choose Payment Mode" && selectPaymentStatus.value != "Choose Payment Status") {
      setDataSource(posts.filter((x) => x.paymentMode === selectPaymentMode.value && x.paymentStatus === selectPaymentStatus.value));
    }
    else {
      setDataSource(posts.filter((x) => x.supplierId === selectSupplier.value && x.paymentMode === selectPaymentMode.value && x.paymentStatus === selectPaymentStatus.value));
    }
  }
  const handleInsert = () => {
    setInsertMode(true);
  }
  const handleViewDetail = (id) => {
    const inv = posts.find((x) => x.purchaseNo === id);
    dispatch(getBranchById(inv.branchId));
    dispatch(getClientById(inv.clientId));
    dispatch(getPurchaseByID(id));
    setInvID(id);
  }

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
      <div className="page-wrapper">
        <div className="content">
          <div className="page-header transfer">
            <div className="add-item d-flex">
              <div className="page-title">
                <h4>Purchase List</h4>
                <h6>Manage your purchases</h6>
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
            <div className="d-flex purchase-pg-btn">
              <div className="page-btn">
                <Link
                  to="#"
                  className="btn btn-added"
                  data-bs-toggle="modal"
                  data-bs-target="#add-units"
                  onClick={() => handleInsert()}
                >
                  <PlusCircle className="me-2" />
                  Add New Purchase
                </Link>
              </div>
              <div className="page-btn import">
                <Link
                  to="#"
                  className="btn btn-added color"
                  data-bs-toggle="modal"
                  data-bs-target="#view-notes"
                >
                  <Download className="me-2" />
                  Import Purchase
                </Link>
              </div>
            </div>
          </div>
          {/* /product list */}
          <div className="card table-list-card">
            <div className="card-body">
              <div className="table-top">
                <div className="search-set">
                  <div className="search-input">
                    <Link to="#" className="btn btn-searchset">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width={24}
                        height={24}
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth={2}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="feather feather-search"
                      >
                        <circle cx={11} cy={11} r={8} />
                        <line
                          x1={21}
                          y1={21}
                          x2="16.65"
                          y2="16.65"
                        />
                      </svg>
                    </Link>
                    <div
                      id="DataTables_Table_0_filter"
                      className="dataTables_filter"
                    >
                      <label>
                        {" "}
                        <input
                          type="search"
                          className="form-control form-control-sm"
                          placeholder="Search"
                          aria-controls="DataTables_Table_0"
                          onChange={(e) => searchEngine("search", e.target.value.toLowerCase())}
                        />
                      </label>
                    </div>
                  </div>
                </div>
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
                          options={supplierList}
                          classNamePrefix="react-select"
                          placeholder="Choose Supplier Name"
                          onChange={(e) => setSelectSupplier(supplierList.find((x) => x.value === e.value))}
                          value={selectSupplier}
                        />
                      </div>
                    </div>
                    <div className="col-lg-3 col-sm-6 col-12">
                      <div className="input-blocks">
                        <StopCircle className="info-img" />
                        <Select
                          className="img-select"
                          options={paymentMode}
                          classNamePrefix="react-select"
                          placeholder="Choose Payment Mode"
                          onChange={(e) => setSelectPaymentMode(paymentMode.find((x) => x.value === e.value))}
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
              <div className="table-responsive product-list">
                <Table columns={columns} dataSource={dataSource} />
              </div>
            </div>
          </div>
          {/* /product list */}
        </div>
      </div>

      {/* //Purchase Detail */}
      <div className="modal fade" id="purchase-details">
        <div className="modal-dialog sales-details-modal">
          <div className="modal-content">
            <div className="page-wrapper details-blk">
              <div className="content p-0">
                <div className="page-header p-4 mb-0">
                  <div className="add-item d-flex">
                    <div className="page-title modal-datail">
                      <h4>Purchase Detail : PI/Inv-{invID}</h4>
                    </div>
                  </div>
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
                </div>
                <div className="card">
                  <div className="card-body">
                    {(() => {
                      if (invID > 0 && showView) {
                        const inv = posts.find((x) => x.purchaseNo === invID);
                        const invSupplier = supplier.find((x) => x.distributorId === inv.distributorId);

                        return (<>
                          <form>
                            <div className="invoice-box table-height">
                              <div className="sales-details-items d-flex">
                                <div className="details-item">
                                  <h6>Supplier Info</h6>
                                  <p>
                                    {invSupplier.distributorName}
                                    <br />
                                    {invSupplier.contact}
                                    <br />
                                    {invSupplier.address}
                                    <br />
                                  </p>
                                </div>
                                <div className="details-item">
                                  <h6>Branch Info</h6>
                                  <p>
                                    <b>Store Name </b>{singleClient.clientName}
                                    <br />
                                    {singleBranch.branchName}
                                    <br />
                                    {singleBranch.contact}
                                    <br />
                                    {singleBranch.address}
                                  </p>
                                </div>
                                <div className="details-item">
                                  <h6>Invoice Info</h6>
                                  <p>
                                    Reference
                                    <br />
                                    Payment Mode
                                    {/* <br />
                                    Payment Status */}
                                  </p>
                                </div>
                                <div className="details-item"><br />
                                  <p>
                                    PI{inv.purchaseNo}
                                    <br />
                                    {inv.paymentMode}
                                    <br />
                                    {/* {inv.paymentStatus} */}
                                  </p>
                                </div>
                              </div>
                              <h5 className="order-text">Order Summary</h5>
                              <div className="table-responsive no-pagination">
                                <table className="table  datanew">
                                  <thead>
                                    <tr>
                                      <th>Product</th>
                                      <th>Qty</th>
                                      <th>Purchase Rate($)</th>
                                      <th>Gross Amount</th>
                                      <th>Discount(%)</th>
                                      <th>Discount Amount($)</th>
                                      <th>Tax(%)</th>
                                      <th>Tax Amount($)</th>
                                      <th>Net Amount($)</th>
                                      <th>Item Cost($)</th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {rows.map((x) => (
                                      <tr key={x.autoId}>
                                        <td>
                                          <img src={getImageFromUrl(stock.find((i) => i.productId === x.productId)?.imageName)} alt="product" width={50} height={50} />
                                          <span style={{ paddingLeft: "5px" }}> {stock.find((i) => i.productId === x.productId)?.productName}</span>
                                        </td>
                                        <td>
                                          <div className="product-quantity">
                                            <span className="quantity-btn"><MinusCircle /></span>
                                            <input
                                              type="text"
                                              className="quntity-input"
                                              defaultValue={x.qty}
                                            />
                                            <span className="quantity-btn">+<PlusCircle /></span>
                                          </div>
                                        </td>
                                        <td>{formatCurrency(x.purchasePrice)}</td>
                                        <td>{x.total}</td>
                                        <td>{x.discountPrct}</td>
                                        <td>{formatCurrency(x.discountAmount)}</td>
                                        <td>{x.gstprct}</td>
                                        <td>{formatCurrency(x.gstamount)}</td>
                                        <td>{formatCurrency(x.productTotal)}</td>
                                        <td>{formatCurrency(x.productCost)}</td>
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
                                        <h4>Order Tax</h4>
                                        <h5>{formatCurrency(inv.gst)}</h5>
                                      </li>
                                      <li>
                                        <h4>Discount</h4>
                                        <h5>{formatCurrency(inv.discount)}</h5>
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
                      else {
                        return (<>Result not found!</>)
                      }
                    })()}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>


      <AddPurchases insertMode={insertMode} setInsertMode={setInsertMode} />
      <ImportPurchases />
      <EditPurchases />
    </div>
  );
};

export default PurchasesList;
