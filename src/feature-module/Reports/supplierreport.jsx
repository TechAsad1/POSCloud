import React, { useEffect, useState } from "react";
import ImageWithBasePath from "../../core/img/imagewithbasebath";
import { Filter, Sliders } from "react-feather";
import Select from "react-select";
import { Link } from "react-router-dom";
import DatePicker from "react-datepicker";
import { Box, Calendar, StopCircle, User, FileText } from "react-feather";
import DateRangePicker from "react-bootstrap-daterangepicker";
import Breadcrumbs from "../../core/breadcrumbs";
import Table from "../../core/pagination/datatable";
import { useDispatch, useSelector } from "react-redux";
import { getPurchaseInv, getSupplier } from "../../core/redux/action";
import { subDays, startOfMonth, endOfMonth } from "date-fns";
import { dateFormat, formatCurrency } from "../../helper/helpers";

const SupplierReport = () => {
  const toggleFilterVisibility = () => {
    setIsFilterVisible((prevVisibility) => !prevVisibility);
  };
  const toggleFilterVisibilityTwo = () => {
    setIsFilterVisibleTwo((prevVisibilityTwo) => !prevVisibilityTwo);
  };
  const toggleFilterVisibilityThree = () => {
    setisFilterVisibleThree((prevVisibilityThree) => !prevVisibilityThree);
  };
  const options = [
    { value: "date", label: "Sort by Date" },
    { value: "newest", label: "Newest" },
    { value: "oldest", label: "Oldest" },
  ];
  const optionsThree = [
    { value: "sortByDate", label: "Sort by Date" },
    { value: "140923", label: "14 09 23" },
    { value: "110923", label: "11 09 23" },
  ];
  const supplierNameOptions = [
    { value: "chooseSupplierName", label: "Choose Supplier Name" },
    { value: "apexComputers", label: "Apex Computers" },
    { value: "beatsHeadphones", label: "Beats Headphones" },
  ];
  const nameOptions = [
    { value: "chooseName", label: "Choose Name" },
    { value: "apexComputers", label: "Apex Computers" },
    { value: "beatsHeadphones", label: "Beats Headphones" },
  ];
  const statusOptions2 = [
    { value: "chooseStatus", label: "Choose Status" },
    { value: "completed", label: "Completed" },
    { value: "incompleted", label: "Incompleted" },
  ];
  const paymentStatusOptions = [
    { value: "choosePaymentStatus", label: "Choose Payment Status" },
    { value: "paid", label: "Paid" },
    { value: "unpaid", label: "Unpaid" },
    { value: "overdue", label: "Overdue" },
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
      dataIndex: "createdDate",
      render: (txt) => (
        <span>{dateFormat(txt)}</span>
      ),
      sorter: (a, b) => a.createdDate.length - b.createdDate.length,
    },
    {
      title: "Invoice ID",
      dataIndex: "purchaseNo",
      sorter: (a, b) => a.purchaseNo.length - b.purchaseNo.length,
    },
    {
      title: "Supplier",
      dataIndex: "distributorId",
      render: (x) => (<span>{suppliers.find((i) => i.distributorId === x).distributorName}</span>),
      sorter: (a, b) => a.distributorId.length - b.distributorId.length,
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
    // {
    //   title: "Status",
    //   dataIndex: "paymentStatus",
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
  ];
  const paymentModeOptions = [
    { value: "Choose Payment Mode", label: "Choose Payment Mode" },
    { value: "Cash", label: "Cash" },
    { value: "Cheque", label: "Cheque" },
    { value: "Crdit", label: "Crdit" },
  ];

  const [isFilterVisible, setIsFilterVisible] = useState(false);
  const [isFilterVisibleTwo, setIsFilterVisibleTwo] = useState(false);
  const [isFilterVisibleThree, setisFilterVisibleThree] = useState(false);
  //Custom Code
  const dispatch = useDispatch();
  const posts = useSelector((state) => state.purchaseInv);
  const suppliers = useSelector((state) => state.suppliers);
  const [dataSource, setDataSource] = useState([]);
  //List
  const [supplierList, setSupplierList] = useState([{ value: 0, label: "Choose Supplier" }]);
  //Select
  const [selectSupplier, setSelectSupplier] = useState(supplierList[0]);
  const [selectPaymentMode, setSelectPaymentMode] = useState(paymentModeOptions[0]);
  const [selectDate, setSelectDate] = useState({ newDate: new Date(), endDate: new Date() });
  //Custom Code
  useEffect(() => {
    dispatch(getSupplier());
    dispatch(getPurchaseInv());
  }, [dispatch]);
  useEffect(() => {
    setSupplierList((prev) => [
      prev[0], ...suppliers.map((x) => ({
        value: x.distributorId,
        label: x.distributorName
      }))
    ]);
  }, [suppliers]);
  useEffect(() => {
    searchEngine("", "");
  }, [posts]);
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
    if (selectSupplier.value > 0 && selectPaymentMode.value === "Choose Payment Mode") {
      setDataSource(posts.filter((x) => x.distributorId === selectSupplier.value && x.createdDate >= selectDate.newDate && x.createdDate <= selectDate.endDate));
    }
    else if (selectSupplier.value === 0 && selectPaymentMode.value != "Choose Payment Mode") {
      setDataSource(posts.filter((x) => x.paymentMode === selectPaymentMode.value && x.createdDate >= selectDate.newDate && x.createdDate <= selectDate.endDate));
    }
    else if (selectSupplier.value === 0 && selectPaymentMode.value === "Choose Payment Mode") {
      setDataSource(posts.filter((x) => x.createdDate >= selectDate.newDate && x.createdDate <= selectDate.endDate));
    }
    else {
      setDataSource(posts.filter((x) => x.distributorId === selectSupplier.value && x.paymentMode === selectPaymentMode.value && x.createdDate >= selectDate.newDate && x.createdDate <= selectDate.endDate));
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
    // setDateRange({
    //   start: picker.startDate.format("YYYY-MM-DD"),
    //   end: picker.endDate.format("YYYY-MM-DD"),
    // });
  };

  return (
    <div className="page-wrapper">
      <div className="content">
        <Breadcrumbs
          maintitle="Supplier Report"
          subtitle="Manage Your Supplier Report"
        />
        <div className="table-tab">
          <div className="tab-content" id="pills-tabContent">
            <div
              className="tab-pane fade show active"
              id="purchase-report"
              role="tabpanel"
              aria-labelledby="purchase-report-tab"
            >
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
                        <div className="col-lg-2 col-sm-6 col-12">
                          <div className="input-blocks">
                            <Box className="info-img" />
                            <Select
                              className="img-select"
                              classNamePrefix="react-select"
                              options={supplierList}
                              onChange={(e) => handleSelectSupplier(e.value)}
                              value={selectSupplier}
                            />
                          </div>
                        </div>
                        <div className="col-lg-2 col-sm-6 col-12">
                          <div className="input-blocks">
                            <StopCircle className="info-img" />
                            <Select
                              className="img-select"
                              classNamePrefix="react-select"
                              options={paymentModeOptions}
                              onChange={(e) => handleSelectPaymentMode(e.value)}
                              value={selectPaymentMode}
                            />
                          </div>
                        </div>
                        <div className="col-lg-2 col-sm-6 col-12">
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
                        <div className="col-lg-6 col-sm-6 col-12 ms-auto">
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
            {/* //Payment */}
            <div
              className="tab-pane fade"
              id="payment-report"
              role="tabpanel"
              aria-labelledby="payment-report-tab"
            >
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
                        />
                        <Link to className="btn btn-searchset">
                          <i data-feather="search" className="feather-search" />
                        </Link>
                      </div>
                    </div>
                    <div className="search-path">
                      <Link
                        className={`btn btn-filter ${isFilterVisibleTwo ? "setclose" : ""
                          }`}
                        id="filter_search"
                      >
                        <Filter
                          className="filter-icon"
                          onClick={toggleFilterVisibilityTwo}
                        />
                        <span onClick={toggleFilterVisibilityTwo}>
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
                        className="img-select"
                        classNamePrefix="react-select"
                        options={optionsThree}
                        placeholder="Sort by Date"
                      />
                    </div>
                  </div>
                  {/* /Filter */}
                  <div
                    className={`card${isFilterVisibleTwo ? " visible" : ""}`}
                    id="filter_inputs1"
                    style={{ display: isFilterVisibleTwo ? "block" : "none" }}
                  >
                    <div className="card-body pb-0">
                      <div className="row">
                        <div className="col-lg-3 col-sm-6 col-12">
                          <div className="input-blocks">
                            <User className="info-img" />
                            <Select
                              className="img-select"
                              classNamePrefix="react-select"
                              options={supplierNameOptions}
                            />
                          </div>
                        </div>
                        <div className="col-lg-3 col-sm-6 col-12">
                          <div className="input-blocks">
                            <Calendar className="info-img" />
                            <div className="input-groupicon">
                              <DatePicker
                                // selected={selectedDate}
                                // onChange={handleDateChange}
                                dateFormat="dd/MM/yyyy"
                                placeholderText="Choose Date"
                                className="datetimepicker"
                              />
                            </div>
                          </div>
                        </div>
                        <div className="col-lg-3 col-sm-6 col-12">
                          <div className="input-blocks">
                            <FileText className="info-img" />
                            <input type="text" placeholder="Enter Reference" />
                          </div>
                        </div>
                        <div className="col-lg-3 col-sm-6 col-12 ms-auto">
                          <div className="input-blocks">
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
                    {/* <Table columns={columnpayment} dataSource={filteredDataPayment} /> */}

                  </div>
                </div>
              </div>
              {/* /product list */}
            </div>
            {/* //Payment */}
            <div
              className="tab-pane fade"
              id="return-report"
              role="tabpanel"
              aria-labelledby="return-report-tab"
            >
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
                        />
                        <Link to className="btn btn-searchset">
                          <i data-feather="search" className="feather-search" />
                        </Link>
                      </div>
                    </div>
                    <div className="search-path">
                      <Link
                        className={`btn btn-filter ${isFilterVisibleThree ? "setclose" : ""
                          }`}
                        id="filter_search"
                      >
                        <Filter
                          className="filter-icon"
                          onClick={toggleFilterVisibilityThree}
                        />
                        <span onClick={toggleFilterVisibilityThree}>
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
                        className="img-select"
                        classNamePrefix="react-select"
                        options={options}
                        placeholder="Sort by Date"
                      />
                    </div>
                  </div>
                  {/* /Filter */}
                  <div
                    className={`card${isFilterVisibleThree ? " visible" : ""}`}
                    id="filter_inputs2"
                    style={{ display: isFilterVisibleThree ? "block" : "none" }}
                  >
                    <div className="card-body pb-0">
                      <div className="row">
                        <div className="col-lg-3 col-sm-6 col-12">
                          <div className="input-blocks">
                            <User className="info-img" />
                            <Select
                              className="img-select"
                              classNamePrefix="react-select"
                              options={nameOptions}
                            />
                          </div>
                        </div>
                        <div className="col-lg-3 col-sm-6 col-12">
                          <div className="input-blocks">
                            <StopCircle className="info-img" />
                            <Select
                              className="img-select"
                              classNamePrefix="react-select"
                              options={statusOptions2}
                            />
                          </div>
                        </div>
                        <div className="col-lg-3 col-sm-6 col-12">
                          <div className="input-blocks">
                            <ImageWithBasePath
                              src="assets/img/icons/payment-status.svg"
                              className="info-img status-icon"
                              alt="Icon"
                            />
                            <Select
                              className="img-select"
                              classNamePrefix="react-select"
                              options={paymentStatusOptions}
                            />
                          </div>
                        </div>
                        <div className="col-lg-3 col-sm-6 col-12 ms-auto">
                          <div className="input-blocks">
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
                    {/* <Table columns={columnsreturnsupplier} dataSource={returnsupplierdatasource} /> */}

                  </div>
                </div>
              </div>
              {/* /product list */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SupplierReport;
