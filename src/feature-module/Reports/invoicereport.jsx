import React, { useEffect, useState } from "react";
import Breadcrumbs from "../../core/breadcrumbs";
import ImageWithBasePath from "../../core/img/imagewithbasebath";
import { Link, useNavigate } from "react-router-dom";
import { Filter, Sliders, StopCircle, User, Calendar } from "react-feather";
import Select from "react-select";
import DateRangePicker from "react-bootstrap-daterangepicker";
import Table from "../../core/pagination/datatable";
import { useDispatch, useSelector } from "react-redux";
import { deleteSaleInv, getBranchById, getCustomer, getCustomerById, getSaleByID, getSaleInv, getUsers } from "../../core/redux/action";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { MinusCircle, PlusCircle } from "react-feather";
import { dateFormat, formatCurrency } from "../../helper/helpers";
import { all_routes } from "../../Router/all_routes";

const Invoicereport = () => {

  const route = all_routes;
  // const data = invoicereportsdata;
  const [isFilterVisible, setIsFilterVisible] = useState(false);
  const toggleFilterVisibility = () => {
    setIsFilterVisible((prevVisibility) => !prevVisibility);
  };
  const options = [
    { value: "sortByDate", label: "Sort by Date" },
    { value: "140923", label: "14 09 23" },
    { value: "110923", label: "11 09 23" },
  ];
  const statusOptions = [
    { value: "chooseStatus", label: "Choose Status" },
    { value: "paid", label: "Paid" },
    { value: "unpaid", label: "Unpaid" },
    { value: "overdue", label: "Overdue" },
  ];
  const initialSettings = {
    endDate: new Date("2020-08-11T12:30:00.000Z"),
    ranges: {
      "Last 30 Days": [
        new Date("2020-07-12T04:57:17.076Z"),
        new Date("2020-08-10T04:57:17.076Z"),
      ],
      "Last 7 Days": [
        new Date("2020-08-04T04:57:17.076Z"),
        new Date("2020-08-10T04:57:17.076Z"),
      ],
      "Last Month": [
        new Date("2020-06-30T18:30:00.000Z"),
        new Date("2020-07-31T18:29:59.999Z"),
      ],
      "This Month": [
        new Date("2020-07-31T18:30:00.000Z"),
        new Date("2020-08-31T18:29:59.999Z"),
      ],
      Today: [
        new Date("2020-08-10T04:57:17.076Z"),
        new Date("2020-08-10T04:57:17.076Z"),
      ],
      Yesterday: [
        new Date("2020-08-09T04:57:17.076Z"),
        new Date("2020-08-09T04:57:17.076Z"),
      ],
    },
    startDate: new Date("2020-08-04T04:57:17.076Z"), // Set "Last 7 Days" as default
    timePicker: false,
  };
  const columns = [
    {
      title: "Date",
      dataIndex: "createdDate",
      render: (text) => <span>{dateFormat(text)}</span>,
      sorter: (a, b) => a.createdDate.length - b.createdDate.length,
    },
    {
      title: "Invoice ID",
      dataIndex: "receiptNo",
      render: (text) => <span>SI/-{text}</span>,
      sorter: (a, b) => a.receiptNo.length - b.receiptNo.length,
    },
    {
      title: "Customer",
      dataIndex: "customerId",
      render: (x) => (<span>{customers.find((i) => i.customerId === x).customerName}</span>),
      sorter: (a, b) => a.customerId.length - b.customerId.length,
    },
    {
      title: "Total",
      dataIndex: "netTotal",
      render: (txt) => <span>{formatCurrency(txt)}</span>,
      sorter: (a, b) => a.netTotal.length - b.netTotal.length,
    },
    // {
    //   title: "Status",
    //   dataIndex: "ishold",
    //   render: (text) => (
    //     <div>
    //       {text === "paid" && (
    //         <span className="badge badge-linesuccess">{text}</span>
    //       )}
    //       {text === "unpaid" && (
    //         <span className="badge badge-linedanger">{text}</span>
    //       )}
    //       {text === "pending" && (
    //         <span className="badge badges-warning">{text}</span>
    //       )}

    //     </div>
    //   ),
    //   sorter: (a, b) => a.paymentStatus.length - b.paymentStatus.length,
    // },
    {
      title: "Actions",
      dataIndex: "actions",
      key: "actions",
      render: (_, record) => (
        <div className="action-table-data">
          <div className="edit-delete-action">
            <Link className="me-2 p-2" to="#" data-bs-toggle="modal" data-bs-target="#sale-details" onClick={() => handleUpdateInvID(record.receiptNo)}>
              <i data-feather="eye" className="feather-eye"></i>
            </Link>
            {/* <Link className="me-2 p-2" data-bs-toggle="modal" data-bs-target="#edit-units">
              <i data-feather="edit" className="feather-edit"></i>
            </Link> */}
            <Link className="confirm-text p-2" to="#" onClick={() => showConfirmationAlert(record.receiptNo)}>
              <i data-feather="trash-2" className="feather-trash-2"></i>
            </Link>
          </div>
        </div>
      ),
    },
  ];
  //Custom Code
  const dispatch = useDispatch();
  // const postData = useSelector((state) => state.invs);
  const [searchText, setSearchText] = useState("");
  const rows = useSelector((state) => state.rows);
  const posts1 = useSelector((state) => state.invs);
  const supplier = useSelector((state) => state.singleSupplier);
  const branch = useSelector((state) => state.branches);
  const customers = useSelector((state) => state.customers);
  const users = useSelector((state) => state.users);
  const [detailMode, setDetailMode] = useState(false);
  const [invID, setInvID] = useState(0);
  const [dataSource, setDataSource] = useState([]);

  const [customerList, setCustomerList] = useState([{ value: 0, label: "Choose Customer" }]);
  //Select
  const [selectCustomer, setSelectCustomer] = useState(customerList[0]);

  const [posts, setPosts] = useState([]);
  const [loginUser, setLoginUser] = useState(null);

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
    dispatch(getCustomer());
    dispatch(getSaleInv());
    dispatch(getUsers());
  }, [dispatch]);
  useEffect(() => {
    searchEngine("", "");
  }, [posts]);
  useEffect(() => {
    setCustomerList((prev) => [
      prev[0],
      ...(customers?.filter((i) => i.customerId === 1).map((x) => ({
        value: x.customerId,
        label: x.customerName
      })) || [])
    ]);
    setCustomerList((prev) => [
      prev[0],
      prev[1],
      ...(customers?.filter((i) => i.clientId === loginUser?.clientId && i.branchId === loginUser?.branchId).map((x) => ({
        value: x.customerId,
        label: x.customerName
      })) || [])
    ]);
  }, [customers]);
  // const filteredData = posts.filter((entry) => {
  //   return Object.keys(entry).some((key) => {
  //     return String(entry[key])
  //       .toLowerCase()
  //       .includes(searchText.toLowerCase());
  //   });
  // });
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
    if (selectCustomer.value > 0) {
      setDataSource(posts.filter((x) => x.customerId === selectCustomer.value));
    }
  }
  //Sale Details
  const handleUpdateInvID = (id) => {
    if (id > 0) {
      dispatch(getSaleByID(id));
      const inv = posts.find((x) => x.invId === id);
      dispatch(getBranchById(inv.branchId));
      dispatch(getCustomerById(inv.customerId));
      setInvID(id);
      setDetailMode(true);
    }
  }
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
        dispatch(deleteSaleInv(id));
      } else {
        MySwal.close();
      }
    });
  };
  //Set Select DropDown
  const handleSelectCustomer = (e) => {
    setSelectCustomer(customerList.find((x) => x.value === e));
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
  if (!loginUser)
    return null;

  return (
    <div className="page-wrapper">
      <div className="content">
        <Breadcrumbs
          maintitle="Invoice Report"
          subtitle="Manage Your Invoice Report"
        />
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
                    value={searchText}
                    onChange={(e) => setSearchText(e.target.value)}
                  />
                  <Link to className="btn btn-searchset">
                    <i data-feather="search" className="feather-search" />
                  </Link>
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
              <div className="form-sort stylewidth">
                <Sliders className="info-img" />

                <Select
                  classNamePrefix="react-select"
                  className="img-select"
                  options={options}
                  placeholder="Sort by Date"
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
                        classNamePrefix="react-select"
                        options={customerList}
                        onChange={(e) => handleSelectCustomer(e.value)}
                      />
                    </div>
                  </div>
                  <div className="col-lg-3 col-sm-6 col-12">
                    <div className="input-blocks">
                      <StopCircle className="info-img" />
                      <Select
                        className="img-select"
                        classNamePrefix="react-select"
                        options={statusOptions}
                      />
                    </div>
                  </div>
                  <div className="col-lg-3 col-sm-6 col-12">
                    <div className="input-blocks">
                      <div className="position-relative daterange-wraper">
                        <Calendar className="feather-14 info-img" />
                        <DateRangePicker initialSettings={initialSettings}>
                          <input
                            className="form-control col-4 input-range"
                            type="text"
                          />
                        </DateRangePicker>
                      </div>
                    </div>
                  </div>
                  <div className="col-lg-3 col-sm-6 col-12">
                    <div className="input-blocks">
                      <a className="btn btn-filters ms-auto">
                        {" "}
                        <i
                          data-feather="search"
                          className="feather-search"
                        />{" "}
                        Search{" "}
                      </a>
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

      <div className="modal fade" id="sale-details">
        <div className="modal-dialog sales-details-modal">
          <div className="modal-content">
            <div className="page-wrapper details-blk">
              <div className="content p-0">
                {(() => {
                  if (invID > 0 && detailMode) {
                    const inv = posts.find((x) => x.invId === invID);
                    return (<>
                      <div className="page-header p-4 mb-0">
                        <div className="add-item d-flex">
                          <div className="page-title modal-datail">
                            <h4>Sale Detail : SL/Inv-{inv.invId}</h4>
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
                          <form>
                            <div
                              className="invoice-box table-height"
                            >
                              <div className="sales-details-items d-flex">
                                <div className="details-item">
                                  <h6>Customer Info</h6>
                                  <p>
                                    {inv.customerName}
                                    <br />
                                    {supplier.contact}
                                    <br />
                                    {supplier.address}
                                  </p>
                                </div>
                                <div className="details-item">
                                  <h6>Branch Info</h6>
                                  <p>
                                    <b>Store Name </b>{branch.clientName}
                                    <br />
                                    {branch.name}
                                    <br />
                                    {branch.contact}
                                    <br />
                                    {branch.address}
                                  </p>
                                </div>
                                <div className="details-item">
                                  <h6>Invoice Info</h6>
                                  <p>
                                    Reference
                                    <br />
                                    Payment Mode
                                    <br />
                                    Payment Status
                                  </p>
                                </div>
                                <div className="details-item"><br />
                                  <p>
                                    PR{inv.invId}
                                    <br />
                                    {inv.paymentMode}
                                    <br />
                                    {inv.paymentStatus}
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
                                      <th>Sale Rate($)</th>
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
                                      <tr key={x.id}>
                                        <td>
                                          <img src={`https://localhost:7151/api/Product/getImg/${x.img}`} alt="product" width={50} height={50} />
                                          <span style={{ paddingLeft: "5px" }}> {x.name}</span>
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
                                              value={x.qty}
                                            />
                                            <span className="quantity-btn">
                                              {/* <i
                                          data-feather="minus-circle"
                                          className="feather-minus-circle"
                                        /> */}
                                              <MinusCircle />
                                            </span>
                                          </div>
                                        </td>
                                        <td>{formatCurrency(x.price)}</td>
                                        <td>{formatCurrency(x.total)}</td>
                                        <td>{x.discPerc}</td>
                                        <td>{formatCurrency(x.disc)}</td>
                                        <td>{x.gstPerc}</td>
                                        <td>{formatCurrency(x.gst)}</td>
                                        <td>{formatCurrency(x.netTotal)}</td>
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
                                        <h5>{formatCurrency(inv.disc)}</h5>
                                      </li>
                                      <li>
                                        <h4>Grand Total</h4>
                                        <h5>{formatCurrency(inv.netTotal)}</h5>
                                      </li>
                                      <li>
                                        <h4>Paid</h4>
                                        <h5>{formatCurrency(inv.paid)}</h5>
                                      </li>
                                      <li>
                                        <h4>Due</h4>
                                        <h5>{formatCurrency(inv.due)}</h5>
                                      </li>
                                    </ul>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </form>
                        </div>
                      </div>
                    </>)
                  }
                })()}

              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Invoicereport;
