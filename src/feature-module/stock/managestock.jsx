import React, { useEffect, useState } from "react";
import Breadcrumbs from "../../core/breadcrumbs";
import { Filter, Search, Sliders } from "react-feather";
import ImageWithBasePath from "../../core/img/imagewithbasebath";
import Select from "react-select";
import { Link, useNavigate } from "react-router-dom";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Archive, Box, Calendar } from "react-feather";
import ManageStockModal from "../../core/modals/stocks/managestockModal";
import { Edit, Trash2 } from "react-feather";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import Table from "../../core/pagination/datatable";
import { useDispatch, useSelector } from "react-redux";
import { deleteProduct, getBranch, getProduct, getUsers } from "../../core/redux/action";
import { dateFormat, getImageFromUrl } from "../../helper/helpers";
import { all_routes } from "../../Router/all_routes";

const Managestock = () => {

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
  const columns = [
    {
      title: "Date",
      dataIndex: "createdDate",
      render: (txt) => (<span>{dateFormat(txt)}</span>),
      sorter: (a, b) => a.createdDate.length - b.createdDate.length,
    },
    {
      title: "Branch",
      dataIndex: "branchId",
      render: (txt) => (<span>{branches.find((x) => x.branchId === txt)?.branchName}</span>),
      sorter: (a, b) => a.branchId.length - b.branchId.length,
    },
    {
      title: "Product",
      dataIndex: "productName",
      render: (text, record) => (
        <span className="userimgname">
          <Link to="#" className="product-img">
            <img alt="" src={getImageFromUrl(record.imageName)} />
          </Link>
          <Link to="#">{record.productName}</Link>
        </span>
      ),
      sorter: (a, b) => a.productName.length - b.productName.length,
    },
    {
      title: "Action",
      dataIndex: "action",
      render: (_, record) => (
        <div className="action-table-data">
          <div className="edit-delete-action">
            <div className="input-block add-lists"></div>

            <Link
              className="me-2 p-2"
              to="#"
              data-bs-toggle="modal"
              data-bs-target="#edit-units"
            // onClick={(e) => updateHandle(e, record.key)}
            >
              <Edit className="feather-edit" />
            </Link>

            <Link
              className="confirm-text p-2"
              to="#"
              onClick={(e) => showConfirmationAlert(e, record.productId)}
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
  const showConfirmationAlert = (e, p) => {
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

  const dispatch = useDispatch();
  const posts1 = useSelector((state) => state.posts);
  const branches = useSelector((state) => state.branches);
  const users = useSelector((state) => state.users);
  const [dataSource, setDataSource] = useState([]);
  const [branchList, setBranchList] = useState([{ value: 0, label: 'Choose Branch' }]);
  const [productList, setProductList] = useState([{ value: "Choose Product", label: 'Choose Product' }]);
  //Select
  const [selectDate, setSelectDate] = useState(null);
  const [selectBranch, setSelectBranch] = useState(branchList[0]);
  const [selectProduct, setSelectProduct] = useState(productList[0]);

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
    dispatch(getBranch());
    dispatch(getProduct());
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
    setBranchList((prev) => [
      prev[0],
      ...branches.filter((i) => i.clientId === loginUser?.clientId && i.branchId === loginUser?.branchId).map((x) => ({
        value: x.branchId,
        label: x.branchName
      }))
    ]);
  }, [branches]);
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
    if (selectBranch.value > 0 && selectProduct.value === "Choose Product" && selectDate === null) {
      setDataSource(posts.filter((x) => x.branchId === selectBranch.value));
    }
    else if (selectBranch.value === 0 && selectProduct.value != "Choose Product" && selectDate === null) {
      setDataSource(posts.filter((x) => x.productName === selectProduct.value));
    }
    else if (selectBranch.value === 0 && selectProduct.value === "Choose Product" && selectDate != null) {
      setDataSource(posts.filter((x) => dateFormat(x.createdDate) === selectDate));
    }
    else if (selectBranch.value > 0 && selectProduct.value != "Choose Product" && selectDate === null) {
      setDataSource(posts.filter((x) => x.branchId === selectBranch.value && x.productName === selectProduct.value));
    }
    else if (selectBranch.value > 0 && selectProduct.value === "Choose Product" && selectDate != null) {
      setDataSource(posts.filter((x) => x.branchId === selectBranch.value && dateFormat(x.createdDate) === selectDate));
    }
    else if (selectBranch.value === 0 && selectProduct.value != "Choose Product" && selectDate != null) {
      setDataSource(posts.filter((x) => x.productName === selectProduct.value && dateFormat(x.createdDate) === selectDate));
    }
    else {
      setDataSource(posts.filter((x) => x.branchId === selectBranch.value && x.productName === selectProduct.value && dateFormat(x.createdDate) === selectDate));
    }
  }
  //Set Select DropDown
  const handleSelectProduct = (e) => {
    setSelectProduct(productList.find((x) => x.value?.toString().toLowerCase() === e?.toLowerCase()));
  }
  const handleSelectDate = (e) => {
    if (e != null) {
      setSelectDate(dateFormat(e));
    }
    else {
      setSelectDate(null);
    }
  }
  const handleSelectBranch = (e) => {
    setSelectBranch(branchList.find((x) => x.label === e));
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
    <div className="page-wrapper">
      <div className="content">
        <Breadcrumbs
          maintitle="Manage Stock"
          subtitle="Manage your stock"
          addButton="Add New"
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
                    onChange={(e) => searchEngine("search", e.target.value.toLowerCase())}
                  />
                  <Link to className="btn btn-searchset">
                    <Search className="feather-search" />
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
                      <Archive className="info-img" />
                      <Select
                        className="img-select"
                        classNamePrefix="react-select"
                        options={branchList}
                        placeholder="Choose Branch"
                        onChange={(e) => handleSelectBranch(e.label)}
                        value={selectBranch}
                      />
                    </div>
                  </div>
                  <div className="col-lg-2 col-sm-6 col-12">
                    <div className="input-blocks">
                      <Box className="info-img" />
                      <Select
                        className="img-select"
                        classNamePrefix="react-select"
                        options={productList}
                        placeholder="Choose Product"
                        onChange={(e) => handleSelectProduct(e.value)}
                        value={selectProduct}
                      />
                    </div>
                  </div>
                  <div className="col-lg-2 col-sm-6 col-12">
                    <div className="input-blocks">
                      <div className="input-groupicon calender-input">
                        <Calendar className="info-img" />
                        <DatePicker
                          onChange={(e) => handleSelectDate(e)}
                          selected={selectDate}
                          type="date"
                          className="datetimepicker"
                          dateFormat="dd-MM-yyyy"
                          placeholder="Choose Date"
                        />
                      </div>
                    </div>
                  </div>
                  <div className="col-lg-4 col-sm-6 col-12 ms-auto">
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
              <Table
                className="table datanew"
                columns={columns}
                dataSource={dataSource}
                rowKey={(record) => record.productId}
              // pagination={true}
              />
            </div>
          </div>
        </div>
        {/* /product list */}
      </div>
      <ManageStockModal />
    </div>
  );
};

export default Managestock;
