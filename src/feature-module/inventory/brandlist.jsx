import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom/dist";
import AddBrand from "../../core/modals/inventory/addbrand";
import EditBrand from "../../core/modals/inventory/editbrand";
import Swal from "sweetalert2";
import Table from "../../core/pagination/datatable";
import Select from "react-select";
import Sliders from "feather-icons-react/build/IconComponents/Sliders";
import {
  Calendar,
  ChevronUp,
  Filter,
  PlusCircle,
  RotateCcw,
  StopCircle,
  Zap,
} from "feather-icons-react/build/IconComponents";
import { DatePicker } from "antd";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import ImageWithBasePath from "../../core/img/imagewithbasebath";
import { deleteBrand, getBrand, getUsers, setToogleHeader } from "../../core/redux/action";
import withReactContent from "sweetalert2-react-content";
import { useEffect } from "react";
import { format } from "date-fns";
import { dateFormat } from "../../helper/helpers";
import { useLoginData } from "../../helper/loginUserData";

const BrandList = () => {

  const dispatch = useDispatch();
  const data = useSelector((state) => state.toggle_header);
  const postData1 = useSelector((state) => state.brands);
  const loading = useSelector((state) => state.loading);
  const users = useSelector((state) => state.users);
  const [getEditMode, setEditMode] = useState(false);
  const [search, setSearch] = useState({ name: "Choose Brand", date: null, status: true });
  const [option, setOption] = useState([{ value: "Choose Brand", label: 'Choose Brand' }]);
  const [getInvId, setInvId] = useState();
  const [dataSource, setDataSource] = useState([]);
  const [insertMode, setInsertMode] = useState(false);
  const loginUser = useLoginData();

  const [postData, setPosts] = useState([]);

  useEffect(() => {
    if (loginUser) {
      const filtered = postData1.filter(
        (i) =>
          i.clientId === loginUser.clientId &&
          i.branchId === loginUser.branchId
      );
      setPosts(filtered);
    } else {
      setPosts([]);
    }
  }, [loginUser, postData1]);

  const oldandlatestvalue = [
    { value: "date", label: "Sort by Date" },
    { value: "newest", label: "Newest" },
    { value: "oldest", label: "Oldest" },
  ];
  const status = [
    { value: "choose Status", label: "Choose Status" },
    { value: "active", label: "Active" },
    { value: "inactive", label: "InActive" },
  ];
  const [isFilterVisible, setIsFilterVisible] = useState(false);
  const toggleFilterVisibility = () => {
    setIsFilterVisible((prevVisibility) => !prevVisibility);
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
  const columns = [
    {
      title: "Brand",
      dataIndex: "brandName",
      sorter: (a, b) => a.brandName.length - b.brandName.length,
    },
    {
      title: "CreatedBy",
      dataIndex: "createdBy",
      render: (x, r) => {
        const user = users?.find((a) => a.userId === r.createdBy);
        return <span>{user?.userName || "Unknown"}</span>;
      },
      sorter: (a, b) => {
        const nameA = users?.find((u) => u.userId === a.createdBy)?.userName || "";
        const nameB = users?.find((u) => u.userId === b.createdBy)?.userName || "";
        return nameA.localeCompare(nameB);
      }
    },
    {
      title: "Createdon",
      dataIndex: "createdDate",
      render: (x) => (<span>{dateFormat(x)}</span>),
      sorter: (a, b) => a.date.length - b.date.length,
    },
    {
      title: "Status",
      dataIndex: "isActive",
      render: (x) => (
        <div>
          {x && (<span className="badge badge-linesuccess">Active</span>)}
          {!x && (<span className="badge badge-linedanger">InActive</span>)}
        </div>
      ),
      sorter: (a, b) => a.active.length - b.active.length,
    },
    {
      title: "Actions",
      dataIndex: "actions",
      render: (_, record) => (
        <div className="action-table-data">
          <div className="edit-delete-action">
            <Link
              className="me-2 p-2"
              to="#"
              data-bs-toggle="modal"
              data-bs-target="#edit-brand"
              onClick={(e) => updateHandle(e, record.brandId)}
            >
              <i data-feather="edit" className="feather-edit"></i>
            </Link>
            <Link className="confirm-text p-2" to="#">
              <i
                data-feather="trash-2"
                className="feather-trash-2"
                onClick={(e) => showConfirmationAlert(e, record.brandId)}
              ></i>
            </Link>
          </div>
        </div>
      ),
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
        dispatch(deleteBrand(p));
      } else {
        MySwal.close();
      }
    });
  };

  //Custom Code
  useEffect(() => {
    dispatch(getBrand());
    dispatch(getUsers());
  }, [dispatch]);
  useEffect(() => {
    setOption((prev) => [
      prev[0],
      ...postData.map((x) => ({
        value: x.brandName,
        label: x.brandName
      }))
    ]);
    searchEngine("", "");
  }, [postData]);
  const updateHandle = (e, id) => {
    setEditMode(true);
    setInvId(id);
  }
  //Search Engine
  const searchEngine = (action, key) => {
    if (action === "newest") {
      setDataSource(postData.sort((a, b) => a.brandId - b.brandId)
        .slice(0, postData.length));
    }
    else if (action === "oldest") {
      setDataSource(postData.sort((a, b) => b.brandId - a.brandId)
        .slice(0, postData.length));
    }
    else if (action === "filter") {
      handleFilter();
    }
    else {
      setDataSource(postData.filter((item) =>
        Object.values(item).some(
          (value) =>
            typeof value === "string" &&
            value.toLowerCase().includes(key.toLowerCase())
        )
      ));
    }
  }
  const handleFilter = () => {
    if (search.name === "Choose Brand" && search.date === null) {
      setDataSource(postData.filter((x) => x.isActive === search.status));
    }
    else if (search.name != "Choose Brand" && search.date === null) {
      setDataSource(postData.filter((x) => x.brandName.toLowerCase().includes(search.name.toLowerCase()) && x.isActive === search.status));
    }
    else if (search.name === "Choose Brand" && search.date != null) {
      setDataSource(postData.filter((x) => format(x.createdDate, "yyyy-MM-dd") === search.date && x.isActive === search.status));
    }
    else {
      setDataSource(postData.filter((x) => x.brandName.toLowerCase().includes(search.name.toLowerCase()) && format(x.createdDate, "yyyy-MM-dd") === search.date && x.isActive === search.status));
    }
  }
  const handleStatus = (e) => {
    if (e.toLowerCase() === "active") {
      setSearch({ ...search, status: true })
    }
    else {
      setSearch({ ...search, status: false })
    }
  }
  const handleDate = (e) => {
    if (e != null) {
      setSearch({ ...search, date: format(e.$d, "yyyy-MM-dd") })
    }
    else {
      setSearch({ ...search, date: null })
    }
  }
  const handleInsert = () => {
    setInsertMode(true);
  }

  return (
    <div>
      <div className="page-wrapper">
        <div className="content">
          <div className="page-header">
            <div className="add-item d-flex">
              <div className="page-title">
                <h4>Brand</h4>
                <h6>Manage your brands</h6>
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
                data-bs-target="#add-brand"
                onClick={() => handleInsert()}
              >
                <PlusCircle className="me-2" />
                Add New Brand
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
                        <Zap className="info-img" />
                        <Select
                          className="img-select"
                          classNamePrefix="react-select"
                          options={option}
                          placeholder="Choose Brand"
                          onChange={(e) => setSearch({ ...search, name: e.value })}
                        />
                      </div>
                    </div>
                    <div className="col-lg-3 col-sm-6 col-12">
                      <div className="input-blocks">
                        <Calendar className="info-img" />
                        <div className="input-groupicon">
                          <DatePicker
                            type="date"
                            className="filterdatepicker"
                            dateFormat="dd-MM-yyyy"
                            placeholder="Choose Date"
                            onChange={(e) => handleDate(e)}
                          />
                        </div>
                      </div>
                    </div>
                    <div className="col-lg-3 col-sm-6 col-12">
                      <div className="input-blocks">
                        <i data-feather="stop-circle" className="info-img" />
                        <StopCircle className="info-img" />
                        <Select
                          className="img-select"
                          classNamePrefix="react-select"
                          options={status}
                          placeholder="Choose Status"
                          onChange={(e) => handleStatus(e.value)}
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
                {loading && <h3>Loading...</h3>}
                <Table columns={columns} dataSource={dataSource} />
              </div>
            </div>
            {/* /product list */}
          </div>
        </div>
      </div>
      <AddBrand userId={loginUser?.userId} insertMode={insertMode} setInsertMode={setInsertMode} />
      <EditBrand id={getInvId} isEditMode={getEditMode} setEditMode={setEditMode} />
    </div>
  );
};

export default BrandList;
