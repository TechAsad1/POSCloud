import React, { useEffect, useState } from "react";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import { Link } from "react-router-dom";
import ImageWithBasePath from "../../core/img/imagewithbasebath";
import {
  Calendar,
  ChevronUp,
  Filter,
  RotateCcw,
  Sliders,
  Edit,
  Trash2,
} from "feather-icons-react/build/IconComponents";
import { deleteProduct, getProduct, setToogleHeader } from "../../core/redux/action";
import { useDispatch, useSelector } from "react-redux";
import Select from "react-select";
import { Box } from "react-feather";
import { DatePicker } from "antd";
import withReactContent from "sweetalert2-react-content";
import Swal from "sweetalert2";
import Table from "../../core/pagination/datatable";
import no_image from "../../images/no_image.png";
import { all_routes } from "../../Router/all_routes";

const ExpiredProduct = () => {
  const dispatch = useDispatch();
  const data = useSelector((state) => state.toggle_header);
  // const dataSource = useSelector((state) => state.expiredproduct_data);

  const [isFilterVisible, setIsFilterVisible] = useState(false);
  const toggleFilterVisibility = () => {
    setIsFilterVisible((prevVisibility) => !prevVisibility);
  };
  const [selectedDate, setSelectedDate] = useState(new Date());
  const handleDateChange = (date) => {
    setSelectedDate(date);
  };

  const options = [
    { value: "date", label: "Sort by Date" },
    { value: "newest", label: "Newest" },
    { value: "oldest", label: "Oldest" },
  ];

  // const brands = [
  //   { value: "chooseType", label: "Choose Type" },
  //   { value: "lenovo3rdGen", label: "Lenovo 3rd Generation" },
  //   { value: "nikeJordan", label: "Nike Jordan" },
  // ];

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
  const route = all_routes;

  const columns = [
    {
      title: "Product",
      dataIndex: "name",
      render: (text, record) => (
        <span className="productimgname">
          <Link to="/profile" className="product-img stock-img">
            <img alt="" src={record.img === "" ? no_image : `https://localhost:7151/api/Category/getImg/${record.img}`} />
          </Link>
          <Link to="/profile">{text}</Link>
        </span>
      ),
      sorter: (a, b) => a.name.length - b.name.length,
    },
    {
      title: "SKU",
      dataIndex: "sku",
      sorter: (a, b) => a.sku.length - b.sku.length,
    },
    {
      title: "Manufactured Date",
      dataIndex: "date",
      render: (x) => (<span>{dateFormat(x)}</span>),
      sorter: (a, b) => a.date.length - b.date.length,
    },
    {
      title: "Expired Date",
      dataIndex: "expiryDate",
      render: (x) => (<span>{dateFormat(x)}</span>),
      sorter: (a, b) => a.expiryDate.length - b.expiryDate.length,
    },
    {
      title: "Actions",
      dataIndex: "actions",
      key: "actions",
      render: (_, record) => (
        <div className="action-table-data">
          <div className="edit-delete-action">
            <Link className="me-2 p-2" to={route.editproduct} onClick={() => handleSetInvID(record.invId)}>
              <Edit className="feather-edit" />
            </Link>
            <Link
              className="confirm-text p-2"
              to="#"
              onClick={() => showConfirmationAlert(record.invId)}
            >
              <Trash2 className="feather-trash-2" />
            </Link>
          </div>
        </div>
      ),
    },
  ];
  const MySwal = withReactContent(Swal);

  const showConfirmationAlert = (p) => {
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
        dispatch(deleteProduct(p));
      } else {
        MySwal.close();
      }
    });
  };
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

  //Custom Code
  const posts = useSelector((state) => state.posts);
  const [search, setSearch] = useState({ name: "Choose Product", category: "Choose Category", brand: "Choose Brand", unit: "Choose Unit", min: 0, max: 0 });
  const [productList, setProductList] = useState([{ value: "Choose Product", label: 'Choose Product' }]);
  const [dataSource, setDataSource] = useState([]);
  const handleSetInvID = (e) => {
    localStorage.setItem("id", JSON.stringify(e));
  }
  useEffect(() => {
    dispatch(getProduct());
  }, [dispatch]);
  useEffect(() => {
    setProductList((prev) => [
      prev[0],
      ...posts.filter(item => item.date != item.expiryDate && new Date() >= new Date(item.expiryDate)).map((x) => ({
        value: x.name,
        label: x.name
      }))
    ]);
    searchEngine("", "");
  }, [posts]);
  //Search Engine
  const searchEngine = (action, key) => {
    if (action === "newest") {
      setDataSource(posts.filter(item => item.date != item.expiryDate && new Date() >= new Date(item.expiryDate)).sort((a, b) => a.id - b.id)
        .slice(0, posts.length));
    }
    else if (action === "oldest") {
      setDataSource(posts.filter(item => item.date != item.expiryDate && new Date() >= new Date(item.expiryDate)).sort((a, b) => b.id - a.id)
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
        ) && item.date != item.expiryDate && new Date() >= new Date(item.expiryDate)
      ));
    }
  }
  const handleFilter = () => {
    if (search.name != "Choose Product" && selectedDate === "Choose Date") {
      setDataSource(posts.filter((x) => x.name.toLowerCase() === search.name.toLowerCase()));
    }
    else if (search.name === "Choose Product" && selectedDate != "Choose Date") {
      setDataSource(posts.filter((x) => dateFormat(x.expiryDate) === dateFormat(selectedDate)));
    }
    else {
      setDataSource(posts.filter((x) => x.name.toLowerCase() === search.name.toLowerCase() && dateFormat(x.expiryDate) === dateFormat(selectedDate)));
    }
  }


  return (
    <div>
      <div className="page-wrapper">
        <div className="content">
          <div className="page-header">
            <div className="add-item d-flex">
              <div className="page-title">
                <h4>Expired Products</h4>
                <h6>Manage your expired products</h6>
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
                      onChange={(e) => searchEngine("search", e.target.value)}
                    />
                    <Link to className="btn btn-searchset">
                      <i data-feather="search" className="feather-search" />
                    </Link>
                  </div>
                </div>
                <div className="search-path">
                  <div className="d-flex align-items-center">
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
                <div className="form-sort">
                  <Sliders className="info-img" />
                  <Select
                    className="img-select"
                    classNamePrefix="react-select"
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
                        <Box className="info-img" />

                        <Select
                          className="img-select"
                          options={productList}
                          classNamePrefix="react-select"
                          placeholder="Choose Type"
                          onChange={(e) => setSearch({ ...search, name: e.value })}
                        />
                      </div>
                    </div>
                    <div className="col-lg-3 col-sm-6 col-12">
                      <div className="input-blocks">
                        <div className="input-groupicon">
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
  );
};

export default ExpiredProduct;
