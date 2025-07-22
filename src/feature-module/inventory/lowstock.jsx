import React, { useEffect, useState } from "react";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import { Link } from "react-router-dom";
import ImageWithBasePath from "../../core/img/imagewithbasebath";
import {
  Archive,
  Box,
  ChevronUp,
  Mail,
  RotateCcw,
  Sliders,
  Zap,
} from "feather-icons-react/build/IconComponents";
import { useDispatch, useSelector } from "react-redux";
import { getBranch, getCategory, getProduct, setToogleHeader } from "../../core/redux/action";
import Select from "react-select";
import { Filter } from "react-feather";
import EditLowStock from "../../core/modals/inventory/editlowstock";
// import withReactContent from "sweetalert2-react-content";
// import Swal from "sweetalert2";
import Table from "../../core/pagination/datatable";
import no_image from "../../images/no_image.png";

const LowStock = () => {
  const dispatch = useDispatch();
  const data = useSelector((state) => state.toggle_header);
  const posts = useSelector((state) => state.posts);
  const categories = useSelector((state) => state.categories);
  const branch = useSelector((state) => state.branches);
  const [dataSource, setDataSource] = useState([]);
  const [categoryList, setCategoryList] = useState([{ value: "Choose Category", label: 'Choose Category' }]);
  const [branchList, setBranchList] = useState([{ value: 0, label: 'Choose Branch' }]);
  const [productList, setProductList] = useState([{ value: "Choose Product", label: 'Choose Product' }]);
  //Select
  const [selectCategory, setSelectCategory] = useState(categoryList[0]);
  const [selectBranch, setSelectBranch] = useState(branchList[0]);
  const [selectProduct, setSelectProduct] = useState(productList[0]);

  const [tab, setTab] = useState("low");

  const [isFilterVisible, setIsFilterVisible] = useState(false);
  const toggleFilterVisibility = () => {
    setIsFilterVisible((prevVisibility) => !prevVisibility);
  };

  const oldandlatestvalue = [
    { value: "date", label: "Sort by Date" },
    { value: "newest", label: "Newest" },
    { value: "oldest", label: "Oldest" },
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

  const columns = [
    {
      title: "Branch",
      dataIndex: "branch",

      sorter: (a, b) => a.branch.length - b.branch.length,
      width: "5%",
    },
    {
      title: "Product",
      dataIndex: "name",
      render: (text, record) => (
        <span className="productimgname">
          <Link to="#" className="product-img stock-img">
            <img alt="" src={record.img === "" ? no_image : `https://localhost:7151/api/Category/getImg/${record.img}`} />
          </Link>
          {text}
        </span>
      ),
      sorter: (a, b) => a.name.length - b.name.length,
    },
    {
      title: "Category",
      dataIndex: "category",
      sorter: (a, b) => a.category.length - b.category.length,
    },
    {
      title: "Unit",
      dataIndex: "unit",
      sorter: (a, b) => a.sku.length - b.sku.length,
    },
    {
      title: "Qty",
      dataIndex: "qty",
      sorter: (a, b) => a.qty.length - b.qty.length,
    },
    {
      title: "Qty Alert",
      dataIndex: "qtyAlert",
      sorter: (a, b) => a.qtyAlert.length - b.qtyAlert.length,
    },
    // {
    //   title: "Actions",
    //   dataIndex: "actions",
    //   render: () => (
    //     <div className="action-table-data">
    //       <div className="edit-delete-action">
    //         <Link
    //           className="me-2 p-2"
    //           to="#"
    //           data-bs-toggle="modal"
    //           data-bs-target="#edit-stock"
    //         >
    //           <i data-feather="edit" className="feather-edit"></i>
    //         </Link>
    //         <Link className="confirm-text p-2" to="#">
    //           <i
    //             data-feather="trash-2"
    //             className="feather-trash-2"
    //             onClick={showConfirmationAlert}
    //           ></i>
    //         </Link>
    //       </div>
    //     </div>
    //   ),
    // },
  ];
  // const MySwal = withReactContent(Swal);
  // const showConfirmationAlert = () => {
  //   MySwal.fire({
  //     title: "Are you sure?",
  //     text: "You won't be able to revert this!",
  //     showCancelButton: true,
  //     confirmButtonColor: "#00ff00",
  //     confirmButtonText: "Yes, delete it!",
  //     cancelButtonColor: "#ff0000",
  //     cancelButtonText: "Cancel",
  //   }).then((result) => {
  //     if (result.isConfirmed) {
  //       MySwal.fire({
  //         title: "Deleted!",
  //         text: "Your file has been deleted.",
  //         className: "btn btn-success",
  //         confirmButtonText: "OK",
  //         customClass: {
  //           confirmButton: "btn btn-success",
  //         },
  //       });
  //     } else {
  //       MySwal.close();
  //     }
  //   });
  // };
  useEffect(() => {
    dispatch(getProduct());
    dispatch(getCategory());
    dispatch(getBranch());
  }, [dispatch]);
  useEffect(() => {
    setProductList((prev) => [
      prev[0],
      ...posts.map((x) => ({
        value: x.name,
        label: x.name
      }))
    ]);
    searchEngine("low", "");
  }, [posts]);
  useEffect(() => {
    setCategoryList((prev) => [
      prev[0],
      ...categories.map((x) => ({
        value: x.categoryName,
        label: x.categoryName
      }))
    ]);
  }, [categories]);
  useEffect(() => {
    setBranchList((prev) => [
      prev[0],
      ...branch.map((x) => ({
        value: x.invId,
        label: x.name
      }))
    ]);
  }, [branch]);
  //Search Engine
  const searchEngine = (action, key) => {
    if (action === "newest") {
      setDataSource(posts.sort((a, b) => a.id - b.id)
        .slice(0, posts.length));
    }
    else if (action === "oldest") {
      setDataSource(posts.sort((a, b) => b.id - a.id)
        .slice(0, posts.length));
    }
    else if (action === "filter") {
      handleFilter();
    }
    else if (action === "low") {
      setDataSource(posts.filter((x) => Number(x.qty ?? 0) <= Number(x.qtyAlert ?? 0)));
    }
    else if (action === "out") {
      setDataSource(posts.filter((x) => Number(x.qty ?? 0) <= 0));
    }
    else {
      if (tab === "low") {
        setDataSource(posts.filter((item) =>
          Object.values(item).some(
            (value) =>
              typeof value === "string" &&
              value.toLowerCase().includes(key.toLowerCase()) && Number(item.qty ?? 0) <= Number(item.qtyAlert ?? 0)
          )
        ));
      }
      else {
        setDataSource(posts.filter((item) =>
          Object.values(item).some(
            (value) =>
              typeof value === "string" &&
              value.toLowerCase().includes(key.toLowerCase()) && Number(item.qty ?? 0) <= 0
          )
        ));
      }
    }
  }
  const handleFilter = () => {
    if (selectCategory.value != "Choose Category" && selectBranch.value === 0 && selectProduct.value === "Choose Product") {
      if (tab === "low") {
        setDataSource(posts.filter((x) => Number(x.qty ?? 0) <= Number(x.qtyAlert ?? 0) && x.category === selectCategory.value));
      }
      else {
        setDataSource(posts.filter((x) => Number(x.qty ?? 0) <= 0 && x.category === selectCategory.value));
      }
    }
    else if (selectCategory.value === "Choose Category" && selectBranch.value > 0 && selectProduct.value === "Choose Product") {
      if (tab === "low") {
        setDataSource(posts.filter((x) => Number(x.qty ?? 0) <= Number(x.qtyAlert ?? 0) && x.branchId === selectBranch.value));
      }
      else {
        setDataSource(posts.filter((x) => Number(x.qty ?? 0) <= 0 && x.branchId === selectBranch.value));
      }
    }
    else if (selectCategory.value === "Choose Category" && selectBranch.value === 0 && selectProduct.value != "Choose Product") {
      if (tab === "low") {
        setDataSource(posts.filter((x) => Number(x.qty ?? 0) <= Number(x.qtyAlert ?? 0) && x.name === selectProduct.value));
      }
      else {
        setDataSource(posts.filter((x) => Number(x.qty ?? 0) <= 0 && x.name === selectProduct.value));
      }
    }
  }
  //Set Select DropDown
  const handleSelectProduct = (e) => {
    setSelectProduct(productList.find((x) => x.value?.toString().toLowerCase() === e?.toLowerCase()));
  }
  const handleSelectCategory = (e) => {
    setSelectCategory(categoryList.find((x) => x.value?.toString().toLowerCase() === e?.toLowerCase()));
  }
  const handleSelectBranch = (e) => {
    setSelectBranch(branchList.find((x) => x.label?.toString().toLowerCase() === e?.toLowerCase()));
  }
  const handleSwitchTab = (e) => {
    setTab(e);
    searchEngine(e, "");
  }
  return (
    <div>
      <div className="page-wrapper">
        <div className="content">
          <div className="page-header">
            <div className="page-title me-auto">
              <h4>Low Stocks</h4>
              <h6>Manage your low stocks</h6>
            </div>
            <ul className="table-top-head">
              <li>
                <div className="status-toggle d-flex justify-content-between align-items-center">
                  <input
                    type="checkbox"
                    id="user2"
                    className="check"
                    defaultChecked="true"
                  />
                  <label htmlFor="user2" className="checktoggle">
                    checkbox
                  </label>
                  Notify
                </div>
              </li>
              <li>
                <Link
                  to=""
                  className="btn btn-secondary"
                  data-bs-toggle="modal"
                  data-bs-target="#send-email"
                >
                  <Mail className="feather-mail" />
                  Send Email
                </Link>
              </li>
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
          </div>
          <div className="table-tab">
            <ul className="nav nav-pills" id="pills-tab" role="tablist">
              <li className="nav-item" role="presentation">
                <button
                  className="nav-link active"
                  id="pills-home-tab"
                  data-bs-toggle="pill"
                  // data-bs-target="#pills-home"
                  // type="button"
                  // role="tab"
                  // aria-controls="pills-home"
                  // aria-selected="true"
                  onClick={() => handleSwitchTab("low")}
                >
                  Low Stocks
                </button>
              </li>
              <li className="nav-item" role="presentation">
                <button
                  className="nav-link"
                  id="pills-profile-tab"
                  data-bs-toggle="pill"
                  // data-bs-target="#pills-profile"
                  // type="button"
                  // role="tab"
                  // aria-controls="pills-profile"
                  // aria-selected="false"
                  onClick={() => handleSwitchTab("out")}
                >
                  Out of Stocks
                </button>
              </li>
            </ul>
            <div className="tab-content" id="pills-tabContent">
              <div
                className="tab-pane fade show active"
                id="pills-home"
                role="tabpanel"
                aria-labelledby="pills-home-tab"
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
                            onChange={(e) => searchEngine("search", e.target.value)}
                          />
                          <Link to className="btn btn-searchset">
                            <i
                              data-feather="search"
                              className="feather-search"
                            />
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
                      {" "}
                      <div className="card-body pb-0">
                        <div className="row">
                          <div className="col-lg-3 col-sm-6 col-12">
                            <div className="input-blocks">
                              <Box className="info-img" />
                              <Select
                                className="img-select"
                                options={categoryList}
                                classNamePrefix="react-select"
                                placeholder="Choose Product"
                                onChange={(e) => handleSelectCategory(e.value)}
                                value={selectCategory}
                              />
                            </div>
                          </div>
                          <div className="col-lg-3 col-sm-6 col-12">
                            <div className="input-blocks">
                              <i data-feather="zap" className="info-img" />
                              <Zap className="info-img" />
                              <Select
                                className="img-select"
                                options={productList}
                                classNamePrefix="react-select"
                                placeholder="Choose Category"
                                onChange={(e) => handleSelectProduct(e.value)}
                                value={selectProduct}
                              />
                            </div>
                          </div>
                          <div className="col-lg-3 col-sm-6 col-12">
                            <div className="input-blocks">
                              <Archive className="info-img" />
                              <Select
                                className="img-select"
                                options={branchList}
                                classNamePrefix="react-select"
                                placeholder="Choose Branch"
                                onChange={(e) => handleSelectBranch(e.label)}
                                value={selectBranch}
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
          </div>
        </div>
      </div>
      <EditLowStock />
    </div>
  );
};

export default LowStock;
