import React, { useEffect, useState } from "react";
import { Filter, Sliders } from "react-feather";
import { Link, useNavigate } from "react-router-dom";
import ImageWithBasePath from "../../core/img/imagewithbasebath";
import Select from "react-select";
import Breadcrumbs from "../../core/breadcrumbs";
import Table from "../../core/pagination/datatable";
import { useDispatch, useSelector } from "react-redux";
import { getCustomer, getSaleInv, getUsers } from "../../core/redux/action";
import { subDays, startOfMonth, endOfMonth } from "date-fns";
import { Calendar, User } from "react-feather";
import DateRangePicker from "react-bootstrap-daterangepicker";
import { dateFormat, formatCurrency } from "../../helper/helpers";
import { all_routes } from "../../Router/all_routes";

const CustomerReport = () => {


  const route = all_routes;
  const [isFilterVisible, setIsFilterVisible] = useState(false);
  const toggleFilterVisibility = () => {
    setIsFilterVisible((prevVisibility) => !prevVisibility);
  };
  const options = [
    { value: "date", label: "Sort by Date" },
    { value: "newest", label: "Newest" },
    { value: "oldest", label: "Oldest" },
  ];
  const paymentModeOptions = [
    { value: "Choose Payment Mode", label: "Choose Payment Mode" },
    { value: "Cash", label: "Cash" },
    { value: "Cheque", label: "Cheque" },
    { value: "Crdit", label: "Crdit" },
  ];
  const initialSettings = {
    endDate: new Date(),
    ranges: {
      "Last 30 Days": [subDays(new Date(), 30), new Date()],
      "Last 7 Days": [subDays(new Date(), 7), new Date()],
      "Last Month": [
        startOfMonth(subDays(new Date(), new Date().getDate())),
        endOfMonth(subDays(new Date(), new Date().getDate())),
      ],
      "This Month": [startOfMonth(new Date()), endOfMonth(new Date())],
      Today: [new Date(), new Date()],
      Yesterday: [subDays(new Date(), 1), subDays(new Date(), 1)],
    },
    startDate: new Date(), // Set "Last 7 Days" as default
    timePicker: false,
  };
  const columns = [
    {
      title: "Date",
      dataIndex: "createdBy",
      render: (txt) => (
        <span>{dateFormat(txt)}</span>
      ),
      sorter: (a, b) => a.createdBy.length - b.createdBy.length,
    },
    {
      title: "Invoice ID",
      dataIndex: "receiptNo",
      render: (x) => (<span>SI/{x}</span>),
      sorter: (a, b) => a.receiptNo.length - b.receiptNo.length,
    },
    {
      title: "Customer",
      dataIndex: "customerId",
      render: (x) => (<span>{suppliers.find((i) => i.customerId === x).customerName}</span>),
      sorter: (a, b) => a.customerId.length - b.customerId.length,
    },
    {
      title: "Items",
      dataIndex: "item",
      sorter: (a, b) => a.item.length - b.item.length,
    },
    {
      title: "Total",
      dataIndex: "netTotal",
      render: (x) => (<span>{formatCurrency(x)}</span>),
      sorter: (a, b) => a.netTotal.length - b.netTotal.length,
    },
    {
      title: "Payment Mode",
      dataIndex: "paymentMode",
      sorter: (a, b) => a.paymentMode.length - b.paymentMode.length,
    },
    {
      title: "Status",
      dataIndex: "isHold",
      render: (text) => (
        <div>
          {text && (
            <span className="badges status-badge bg-warning">Hold</span>
          )}
          {!text && (
            <span className="badges status-badge">Completed</span>
          )}
        </div>
      ),
      sorter: (a, b) => a.orderStatus.length - b.orderStatus.length,
    },
    // {
    //   title: "Payment Status",
    //   dataIndex: "paymentStatus",
    //   render: (text) => (
    //     <div>
    //       {text === "Paid" && (
    //         <span className="badge-linesuccess">{text}</span>
    //       )}
    //       {text === "Unpaid" && (
    //         <span className="badge badge-linedanger">{text}</span>
    //       )}
    //       {text === "Pending" && (
    //         <span className="badges-warning">{text}</span>
    //       )}

    //     </div>
    //   ),
    //   sorter: (a, b) => a.paymentStatus.length - b.paymentStatus.length,
    // },
  ];
  //Custom Code
  const dispatch = useDispatch();
  const posts1 = useSelector((state) => state.saleInv);
  const suppliers = useSelector((state) => state.customers);
  const users = useSelector((state) => state.users);
  const [dataSource, setDataSource] = useState([]);
  //List
  const [supplierList, setSupplierList] = useState([{ value: 0, label: "Choose Customer" }]);
  //Select
  const [selectSupplier, setSelectSupplier] = useState(supplierList[0]);
  const [selectPaymentMode, setSelectPaymentMode] = useState(paymentModeOptions[0]);
  const [selectDate, setSelectDate] = useState({ newDate: new Date(), endDate: new Date() });

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


  //Custom Code
  useEffect(() => {
    dispatch(getCustomer());
    dispatch(getSaleInv());
    dispatch(getUsers());
  }, [dispatch]);
  useEffect(() => {
    setSupplierList((prev) => [
      prev[0], ...suppliers.filter((i) => i.clientId === loginUser?.clientId && i.branchId === loginUser?.branchId).map((x) => ({
        value: x.customerId,
        label: x.customerName
      }))
    ]);
  }, [suppliers]);
  useEffect(() => {
    searchEngine("", "");
  }, [posts]);
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
    if (selectSupplier.value > 0 && selectPaymentMode.value === "Choose Payment Mode") {
      setDataSource(posts.filter((x) => x.customerID === selectSupplier.value && x.createdDate >= selectDate.newDate && x.createdDate <= selectDate.endDate));
    }
    else if (selectSupplier.value === 0 && selectPaymentMode.value != "Choose Payment Mode") {
      setDataSource(posts.filter((x) => x.paymentMode === selectPaymentMode.value && x.createdDate >= selectDate.newDate && x.createdDate <= selectDate.endDate));
    }
    else if (selectSupplier.value === 0 && selectPaymentMode.value === "Choose Payment Mode") {
      setDataSource(posts.filter((x) => x.createdDate >= selectDate.newDate && x.createdDate <= selectDate.endDate));
    }
    else {
      setDataSource(posts.filter((x) => x.customerID === selectSupplier.value && x.paymentMode === selectPaymentMode.value && x.createdDate >= selectDate.newDate && x.createdDate <= selectDate.endDate));
    }
  }
  //Set Select DropDown
  const handleSelectSupplier = (e) => {
    setSelectSupplier(supplierList.find((x) => x.value === e));
  }
  const handleSelectPaymentMode = (e) => {
    setSelectPaymentMode(paymentModeOptions.find((x) => x.value?.toLowerCase() === e?.toLowerCase()));
  }
  const handleSelectDate = (event, picker) => {
    setSelectDate({ ...selectDate, newDate: picker.startDate.format("YYYY-MM-DD"), endDate: picker.endDate.format("YYYY-MM-DD") });
  };

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
    <div className="page-wrapper">
      <div className="content">
        <Breadcrumbs
          maintitle="Customer Report"
          subtitle="Manage Your Customer Report"
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
                    onChange={(e) => searchEngine("search", e.target.value.toLowerCase())}
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
                        classNamePrefix="react-select"
                        options={supplierList}
                        onChange={(e) => handleSelectSupplier(e.value)}
                        value={selectSupplier}
                      />
                    </div>
                  </div>
                  <div className="col-lg-3 col-sm-6 col-12">
                    <div className="input-blocks">
                      <Select
                        className="img-select"
                        classNamePrefix="react-select"
                        options={paymentModeOptions}
                        onChange={(e) => handleSelectPaymentMode(e.value)}
                        value={selectPaymentMode}
                      />
                    </div>
                  </div>
                  <div className="col-lg-3 col-sm-6 col-12">
                    <div className="input-blocks">
                      <div className="position-relative daterange-wraper">
                        <Calendar className="feather-14 info-img" />
                        <DateRangePicker
                          initialSettings={initialSettings}
                          onApply={handleSelectDate}
                        >
                          <input
                            className="form-control col-4 input-range"
                            type="text"
                            style={{ border: "none" }}
                          />
                        </DateRangePicker>
                      </div>
                    </div>
                  </div>
                  <div className="col-lg-3 col-sm-6 col-12">
                    <div className="input-blocks" onClick={() => searchEngine("filter", "")}>
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
    </div>
  );
};

export default CustomerReport;
