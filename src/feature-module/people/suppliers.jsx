import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Filter, Sliders, User, Globe, Edit, Trash2 } from "react-feather";
import ImageWithBasePath from "../../core/img/imagewithbasebath";
import Select from "react-select";
import { useDispatch, useSelector } from "react-redux";
import Table from "../../core/pagination/datatable";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import SupplierModal from "../../core/modals/peoples/supplierModal";
import { deleteSupplier, getSupplier, setToogleHeader } from "../../core/redux/action";
import { ChevronUp, PlusCircle, RotateCcw } from "feather-icons-react/build/IconComponents";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import { useLoginData } from "../../helper/loginUserData";

const Suppliers = () => {

  const data = useSelector((state) => state.toggle_header);
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

  const dispatch = useDispatch();
  const posts1 = useSelector((state) => state.suppliers);
  const [invID, setInvID] = useState(0);
  const [editMode, setEditMode] = useState(false);
  const [dataSource, setDataSource] = useState([]);
  const [supplierList, setSupplierList] = useState([{ value: 0, label: 'Choose Supplier' }]);
  const [countryList, setCountryList] = useState([{ value: "Choose Country", label: 'Choose Country' }]);
  const [page, setPage] = useState("add");

  const [posts, setPosts] = useState([]);
  const loginUser = useLoginData();

  useEffect(() => {
    if (loginUser) {
      const filtered = posts1.filter(
        (i) =>
          i.clientId === loginUser.clientId &&
          i.branchId === loginUser.branchId
      );
      setPosts(filtered);
    } else
      setPosts([]);
  }, [loginUser, posts1]);

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
      title: "Supplier Name",
      dataIndex: "distributorName",
      sorter: (a, b) => a.distributorName.length - b.distributorName.length,
    },
    {
      title: "ContactNO#",
      dataIndex: "contact",
      sorter: (a, b) => a.contact.length - b.contact.length,
    },
    {
      title: "Address",
      dataIndex: "address",
      sorter: (a, b) => a.address.length - b.address.length,
    },
    {
      title: "City",
      dataIndex: "city",
      sorter: (a, b) => a.city.length - b.city.length,
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
              onClick={() => updateHandle(record.distributorId)}
            >
              <Edit className="feather-edit" />
            </Link>
            <Link
              className="confirm-text p-2"
              to="#"
              onClick={() => showConfirmationAlert(record.distributorId)}
            >
              <Trash2 className="feather-trash-2" />
            </Link>
          </div>
        </div>
      ),
      // sorter: (a, b) => a.createdon.length - b.createdon.length,
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
        dispatch(deleteSupplier(p));
      } else {
        MySwal.close();
      }
    });
  };
  //Select
  const [selectSupplier, setSelectSupplier] = useState(supplierList[0]);
  const [selectCountry, setSelectCountry] = useState(countryList[0]);
  //Custom Code
  useEffect(() => {
    dispatch(getSupplier());
  }, [dispatch]);
  useEffect(() => {
    if (posts.length > 0) {
      setSupplierList((prev) => [
        prev[0], ...posts.map((x) => ({
          value: x.distributorId,
          label: x.distributorName
        }))
      ]);
    }
    setCountryList((prev) => {
      return posts.reduce((acc, x) => {
        if (!acc.some((item) => item.value === x.country)) {
          acc.push({ value: x.country, label: x.country });
        }
        return acc;
      }, [prev[0]]);
    });
    searchEngine("", "");
  }, [posts]);
  const updateHandle = (id) => {
    setPage("edit");
    setInvID(id);
    setEditMode(true);
  }
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
    if(selectSupplier.value === 0 && selectCountry.value === "Choose Country"){
      setDataSource(posts);
    }
    else if (selectSupplier.value > 0 && selectCountry.value === "Choose Country") {
      setDataSource(posts.filter((x) => x.distributorId === selectSupplier.value));
    }
    else if (selectSupplier.value === 0 && selectCountry.value != "Choose Country") {
      setDataSource(posts.filter((x) => x.country === selectCountry.value));
    }
    else {
      setDataSource(posts.filter((x) => x.distributorId === selectSupplier.value && x.country === selectCountry.value));
    }
  }
  //Set Select DropDown
  const handleSelectSupplier = (e) => {
    setSelectSupplier(supplierList.find((x) => x.value === e));
  }
  const handleSelectCountry = (e) => {
    setSelectCountry(countryList.find((x) => x.value?.toLowerCase() === e?.toLowerCase()));
  }
  const handleInsert = () => {
    setPage("add");
    setEditMode(true);
  }

  return (
    <div className="page-wrapper">
      <div className="content">
        <div className="page-header">
          <div className="add-item d-flex">
            <div className="page-title">
              <h4>Supplier</h4>
              <h6>Manage your suppliers</h6>
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
              data-bs-target="#add-units"
              onClick={() => handleInsert()}
            >
              <PlusCircle className="me-2" />
              Add New Supplier
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
                  <div className="col-lg-3 col-sm-6 col-12">
                    <div className="input-blocks">
                      <User className="info-img" />
                      <Select
                        classNamePrefix="react-select"
                        className="img-select"
                        options={supplierList}
                        placeholder="Choose Supplier Name"
                        onChange={(e) => handleSelectSupplier(e.value)}
                        value={selectSupplier}
                      />
                    </div>
                  </div>
                  <div className="col-lg-3 col-sm-6 col-12">
                    <div className="input-blocks">
                      <Globe className="info-img" />
                      <Select
                        classNamePrefix="react-select"
                        className="img-select"
                        options={countryList}
                        placeholder="Choose Country"
                        onChange={(e) => handleSelectCountry(e.value)}
                        value={selectCountry}
                      />
                    </div>
                  </div>
                  <div className="col-lg-3 col-sm-6 col-12 ms-auto">
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
              // rowKey={(record) => record.id}
              />
            </div>
          </div>
        </div>
        {/* /product list */}
      </div>
      <SupplierModal id={invID} userId={loginUser.userId} editMode={editMode} setEditMode={setEditMode} type={page} />
    </div>
  );
};

export default Suppliers;
