import {
  Box,
  ChevronUp,
  Edit,
  Eye,
  Filter,
  GitMerge,
  PlusCircle,
  RotateCcw,
  Sliders,
  StopCircle,
  Trash2,
} from "feather-icons-react/build/IconComponents";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import Select from "react-select";
import ImageWithBasePath from "../../core/img/imagewithbasebath";
import Brand from "../../core/modals/inventory/brand";
import withReactContent from "sweetalert2-react-content";
import Swal from "sweetalert2";
import { all_routes } from "../../Router/all_routes";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import Table from "../../core/pagination/datatable";
import { deleteProduct, getBrand, getCategory, getProduct, getUnit, getUsers, setInvID, setToogleHeader } from "../../core/redux/action";
import { Download } from "react-feather";
import { getImageFromUrl } from "../../helper/helpers";

const ProductList = () => {
  const dispatch = useDispatch();
  const data = useSelector((state) => state.toggle_header);

  const [isFilterVisible, setIsFilterVisible] = useState(false);
  const toggleFilterVisibility = () => {
    setIsFilterVisible((prevVisibility) => !prevVisibility);
  };
  const route = all_routes;

  const options = [
    { value: "date", label: "Sort by Date" },
    { value: "newest", label: "Newest" },
    { value: "oldest", label: "Oldest" },
  ];
  const columns = [
    {
      title: "Product",
      dataIndex: "productName",
      render: (text, record) => (
        <span className="productimgname">
          <Link to="/profile" className="product-img stock-img">
            <img alt="" src={getImageFromUrl(record.imageName)} />
          </Link>
          <Link to="/profile">{text}</Link>
        </span>
      ),
      sorter: (a, b) => a.productName.length - b.productName.length,
    },
    {
      title: "SKU",
      dataIndex: "sku",
      sorter: (a, b) => a.sku.length - b.sku.length,
    },
    {
      title: "Category",
      dataIndex: "categoryId",
      render: (i) => (<span>{categories.find((x) => x.categoryId === i)?.categoryName}</span>),
      sorter: (a, b) => a.categoryId.length - b.categoryId.length,
    },
    {
      title: "Brand",
      dataIndex: "brandId",
      render: (i) => (<span>{brands.find((x) => x.brandId === i)?.brandName}</span>),
      sorter: (a, b) => a.brandId.length - b.brandId.length,
    },
    {
      title: "MinUom",
      dataIndex: "minUom",
      sorter: (a, b) => a.minUom.length - b.minUom.length,
    },
    {
      title: "Price",
      dataIndex: "salePrice",
      sorter: (a, b) => a.salePrice.length - b.salePrice.length,
    },
    {
      title: "Created By",
      dataIndex: "createdBy",
      render: (text) => (
        <span className="userimgname">
          <Link to="/profile" className="product-img">
            <img alt="" src={getImageFromUrl(users.find((x) => x.userId === text)?.imageName)} />
          </Link>
          <Link to="/profile">{users.find((x) => x.userId === text)?.userName}</Link>
        </span>
      ),
      sorter: (a, b) => a.createdBy.length - b.createdBy.length,
    },
    {
      title: "Action",
      dataIndex: "action",
      render: (_, record) => (
        <div className="action-table-data">
          <div className="edit-delete-action">
            <div className="input-block add-lists"></div>
            <Link className="me-2 p-2" to={route.productdetails} onClick={() => handleSetInvID(record.productId)}>
              <Eye className="feather-view" />
            </Link>

            <Link className="me-2 p-2" to={route.editproduct} onClick={() => handleSetInvID(record.productId)}>
              <Edit className="feather-edit" />
            </Link>
            <Link
              className="confirm-text p-2"
              to="#"
              onClick={() => showConfirmationAlert(record.productId)}
            >
              <Trash2 className="feather-trash-2" />
            </Link>
          </div>
        </div>
      ),
      sorter: (a, b) => a.action.length - b.action.length,
    },
  ];
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
        dispatch(deleteProduct(id));
      } else {
        MySwal.close();
      }
    });
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

  //Custom Code
  const posts1 = useSelector((state) => state.posts);
  const categories = useSelector((state) => state.categories);
  const brands = useSelector((state) => state.brands);
  const units = useSelector((state) => state.units);
  const users = useSelector((state) => state.users);
  const [search, setSearch] = useState({ name: "Choose Product", categoryId: 0, brandId: 0, minUom: "Choose MinUom", min: 0, max: 0 });
  const [productList, setProductList] = useState([{ value: "Choose Product", label: 'Choose Product' }]);
  const [categoryList, setCategoryList] = useState([{ value: 0, label: 'Choose Category' }]);
  const [brandList, setBrandList] = useState([{ value: 0, label: 'Choose Brand' }]);
  const [unitList, setUnitList] = useState([{ value: "Choose MinUom", label: 'Choose MinUom' }]);
  const [dataSource, setDataSource] = useState([]);
  
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
    dispatch(getProduct());
    dispatch(getCategory());
    dispatch(getBrand());
    dispatch(getUnit());
    dispatch(getUsers());
  }, [dispatch]);
  useEffect(() => {
    setProductList((prev) => [
      prev[0],
      ...posts.map((x) => ({
        value: x.productName,
        label: x.productName
      }))
    ]);
    searchEngine("", "");
  }, [posts]);
  useEffect(() => {
    if (!loginUser) return;
    setCategoryList((prev) => [
      prev[0],
      ...categories.filter((i) => i.clientId === loginUser.clientId && i.branchId === loginUser.branchId).map((x) => ({
        value: x.categoryId,
        label: x.categoryName
      }))
    ]);
  }, [loginUser, categories]);
  useEffect(() => {
    if (!loginUser) return;
    setBrandList((prev) => [
      prev[0],
      ...brands.filter((i) => i.clientId === loginUser.clientId && i.branchId === loginUser.branchId).map((x) => ({
        value: x.brandId,
        label: x.brandName
      }))
    ]);
  }, [loginUser, brands]);
  useEffect(() => {
    setUnitList((prev) => [
      prev[0],
      ...units.map((x) => ({
        value: x.uom,
        label: x.uomname
      }))
    ]);
  }, [units]);

  const handleSetInvID = (e) => {
    dispatch(setInvID(e));
    localStorage.setItem("proID", JSON.stringify(e));
  }
  //Search Engine
  const searchEngine = (action, key) => {
    if (action === "newest") {
      setDataSource(posts.sort((a, b) => a.productId - b.productId)
        .slice(0, posts.length));
    }
    else if (action === "oldest") {
      setDataSource(posts.sort((a, b) => b.productId - a.productId)
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
    const filtered = posts.filter((x) => {
      if (search.name !== "Choose Product" &&
        x.productName?.toLowerCase() !== search.name.toLowerCase()) {
        return false;
      }

      if (search.categoryId > 0 && x.categoryId !== search.categoryId) {
        return false;
      }

      if (search.brandId > 0 && x.brandId !== search.brandId) {
        return false;
      }

      if (search.minUom !== "Choose MinUom" &&
        x.minUom?.toLowerCase() !== search.minUom.toLowerCase()) {
        return false;
      }

      if (search.min > 0 && x.salePrice < search.min) {
        return false;
      }

      if (search.max > 0 && x.salePrice > search.max) {
        return false;
      }

      return true;
    });
    console.log(filtered);
    if (!loginUser)
      setDataSource(filtered.filter((i) => i.clientId === loginUser.clientId && i.branchId === loginUser.branchId));
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
        <div className="page-header">
          <div className="add-item d-flex">
            <div className="page-title">
              <h4>Product List</h4>
              <h6>Manage your products</h6>
            </div>
          </div>
          <ul className="table-top-head">
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
                  onClick={(e) => {
                    e.preventDefault();
                    dispatch(setToogleHeader(!data));
                  }}
                >
                  <ChevronUp />
                </Link>
              </OverlayTrigger>
            </li>
          </ul>
          <div className="page-btn">
            <Link to={route.addproduct} className="btn btn-added">
              <PlusCircle className="me-2 iconsize" />
              Add New Product
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
              Import Product
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
                    onChange={(e) => searchEngine("search", e.target.value)}
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
                  <div className="col-lg-12 col-sm-12">
                    <div className="row">
                      <div className="col-lg-2 col-sm-6 col-12">
                        <div className="input-blocks">
                          <Box className="info-img" />
                          <Select
                            className="img-select"
                            classNamePrefix="react-select"
                            options={productList}
                            placeholder="Choose Product"
                            onChange={(e) => setSearch({ ...search, name: e.value })}
                          />
                        </div>
                      </div>
                      <div className="col-lg-2 col-sm-6 col-12">
                        <div className="input-blocks">
                          <StopCircle className="info-img" />
                          <Select
                            className="img-select"
                            classNamePrefix="react-select"
                            options={categoryList}
                            placeholder="Choose Category"
                            onChange={(e) => setSearch({ ...search, categoryId: e.value })}
                          />
                        </div>
                      </div>
                      <div className="col-lg-2 col-sm-6 col-12">
                        <div className="input-blocks">
                          <StopCircle className="info-img" />
                          <Select
                            className="img-select"
                            classNamePrefix="react-select"
                            options={brandList}
                            placeholder="Choose Brand"
                            onChange={(e) => setSearch({ ...search, brandId: e.value })}
                          />
                        </div>
                      </div>
                      <div className="col-lg-2 col-sm-6 col-12">
                        <div className="input-blocks">
                          <GitMerge className="info-img" />
                          <Select
                            className="img-select"
                            classNamePrefix="react-select"
                            options={unitList}
                            placeholder="Choose MinUom"
                            onChange={(e) => setSearch({ ...search, minUom: e.value })}
                          />
                        </div>
                      </div>
                      <div className="col-lg-2 col-sm-6 col-12" style={{ position: "relative" }}>
                        <h6 style={{ position: "absolute", top: "-21px", left: "14px" }}>Price Range:</h6>
                        <div className="row">
                          <div className="col-6">
                            <div className="input-blocks">
                              <i className="fas fa-money-bill info-img" />
                              <input type="text" className="form-control" placeholder="Min Price" onChange={(e) => setSearch({ ...search, min: e.target.value })} />
                            </div>
                          </div>
                          <div className="col-6">
                            <div className="input-blocks">
                              <i className="fas fa-money-bill info-img" />
                              <input type="text" className="form-control" placeholder="Max Price" onChange={(e) => setSearch({ ...search, max: e.target.value })} />
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="col-lg-2 col-sm-6 col-12">
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
              </div>
            </div>
            {/* /Filter */}
            <div className="table-responsive">
              <Table columns={columns} dataSource={dataSource} />
            </div>
          </div>
        </div>
        {/* /product list */}
        <Brand />
      </div>
    </div>
  );
};

export default ProductList;
