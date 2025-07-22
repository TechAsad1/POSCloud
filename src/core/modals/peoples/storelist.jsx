import React, { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Filter, Sliders } from "react-feather";
import Select from "react-select";
import { Edit, Eye, Globe, Trash2, User } from "react-feather";
import { useDispatch, useSelector } from "react-redux";
import Table from "../../../core/pagination/datatable";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import ImageWithBasePath from "../../img/imagewithbasebath";
import { deleteClient, getClient, insertClient, updateClient, setToogleHeader, getUsers } from "../../redux/action";
import { ChevronUp, PlusCircle, RotateCcw } from "feather-icons-react/build/IconComponents";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import { all_routes } from "../../../Router/all_routes";

const StoreList = () => {

  const route = all_routes;
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
      title: "Store Name",
      dataIndex: "clientName",
      sorter: (a, b) => a.clientName.length - b.clientName.length,
    },
    {
      title: "Email",
      dataIndex: "email",
      sorter: (a, b) => a.email.length - b.email.length,
    },

    {
      title: "Phone",
      dataIndex: "contact",
      sorter: (a, b) => a.contact.length - b.contact.length,
    },
    {
      title: "City",
      dataIndex: "city",
      sorter: (a, b) => a.city.length - b.city.length,
    },
    {
      title: "Country",
      dataIndex: "country",
      sorter: (a, b) => a.country.length - b.country.length,
    },

    {
      title: "Action",
      dataIndex: "action",
      render: (_, record) => (
        <div className="action-table-data">
          <div className="edit-delete-action">
            <div className="input-block add-lists"></div>

            <Link className="me-2 p-2" to="#">
              <Eye className="feather-view" />
            </Link>

            <Link
              className="me-2 p-2"
              to="#"
              data-bs-toggle="modal"
              data-bs-target="#edit-units"
              onClick={() => updateHandle(record.clientId)}
            >
              <Edit className="feather-edit" />
            </Link>

            <Link
              className="confirm-text p-2"
              to="#"
              onClick={() => showConfirmationAlert(record.clientId)}
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
        dispatch(deleteClient(p));
      } else {
        MySwal.close();
      }
    });
  };

  const dispatch = useDispatch();
  const [page, setPage] = useState("add");
  const posts1 = useSelector((state) => state.posts);
  const users = useSelector((state) => state.users);
  const [dataSource, setDataSource] = useState([]);
  const [storeList, setStoreList] = useState([{ value: 0, label: 'Choose Store' }]);
  const [countryList, setCountryList] = useState([{ value: "Choose Country", label: 'Choose Country' }]);
  //Select
  const [selectStore, setSelectStore] = useState(storeList[0]);
  const [selectCountry, setSelectCountry] = useState(countryList[0]);

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

  
  //Custom Code
  useEffect(() => {
    dispatch(getClient());
    dispatch(getUsers());
  }, [dispatch]);
  useEffect(() => {
    setStoreList((prev) => [
      prev[0], ...posts.map((x) => ({
        value: x.clientId,
        label: x.clientName
      }))
    ]);
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
  //Search Engine
  const searchEngine = (action, key) => {
    if (action === "newest") {
      setDataSource(posts.sort((a, b) => a.clientId - b.clientId)
        .slice(0, posts.length));
    }
    else if (action === "oldest") {
      setDataSource(posts.sort((a, b) => b.clientId - a.clientId)
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
    if (selectStore.value > 0 && selectCountry.value === "Choose Country") {
      setDataSource(posts.filter((x) => x.clientId === selectStore.value));
    }
    else if (selectStore.value === 0 && selectCountry.value != "Choose Country") {
      setDataSource(posts.filter((x) => x.country === selectCountry.value));
    }
    else {
      setDataSource(posts.filter((x) => x.clientId === selectStore.value && x.country === selectCountry.value));
    }
  }
  //Set Select DropDown
  const handleSelectStore = (e) => {
    setSelectStore(storeList.find((x) => x.value === e));
  }
  const handleSelectCountry = (e) => {
    setSelectCountry(countryList.find((x) => x.value?.toLowerCase() === e?.toLowerCase()));
  }
  //Insert
  const [invID, setInvID] = useState(0);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({ name: "", email: "", contact: "", address: "", city: "", country: "", createdBy: loginUser?.userId });
  const [errors, setErrors] = useState({});
  //Ref
  const nameRef = useRef();
  const nameRef2 = useRef();
  const formRef = useRef(null);
  //Validation
  const validate = (p) => {
    let tempErrors = {};
    if (p.target[0].value === "") {
      tempErrors.name = "Store name required";
      setErrors(tempErrors);
      nameRef.current.classList.add("is-invalid");
    }
    else {
      setErrors({ ...errors, name: "" });
      nameRef.current.classList.remove("is-invalid");
    }
    return Object.keys(tempErrors).length === 0;
  };
  //Submit
  const handleInsert = (e) => {
    e.preventDefault();
    if (validate(e)) {
      dispatch(insertClient(formData));
      successAlert("Record inserted successfully");
      clearForm(e.target);
    }
  };
  const clearForm = (e) => {
    setErrors({ ...errors, name: "" });
    nameRef.current.classList.remove("is-invalid");
    setFormData({ ...formData, name: "", email: "", contact: "", address: "", city: "", country: "" });
    e[0].value = "";
    e[1].value = "";
    e[2].value = "";
    e[3].value = "";
    e[4].value = "";
    e[5].value = "";
  }
  //PopUp
  const successAlert = (msg) => {
    MySwal.fire({
      icon: "success",
      title: msg,
      confirmButtonText: "Ok",
    })
  };
  const handleInsertMode = () => {
    setPage("add");
    setEditMode(true);
  }
  //Update
  useEffect(() => {
    if (editMode) {
      if (page === "add") {
        clearForm(formRef.current);
      }
      else {
        setErrors({ ...errors, updateErr: "" });
        const res = posts.find((i) => i.clientId === Number(invID));
        setFormData({ ...formData, name: res.clientName, email: res.email, contact: res.contact, address: res.address, city: res.city, country: res.country });
        if (nameRef2?.current) {
          nameRef2.current.classList.remove("is-invalid");
        }
      }
    }
  }, [editMode])
  const validate2 = (p) => {
    let tempErrors = {};
    if (p.target[0].value === "") {
      tempErrors.updateErr = "Store name required";
      setErrors(tempErrors);
      if (nameRef2?.current) {
        nameRef2.current.classList.add("is-invalid");
      }
    }
    else {
      setErrors({ ...errors, updateErr: "" });
      if (nameRef2?.current) {
        nameRef2.current.classList.remove("is-invalid");
      }
    }
    return Object.keys(tempErrors).length === 0;
  };
  const handleUpdate = (e) => {
    e.preventDefault();
    if (validate2(e)) {
      dispatch(updateClient(invID, formData));
      successAlert("Record updated successfully");
    }
  };
  //Modal IsVisible
  const handleModalClose = () => {
    setEditMode(false);
  }
  const updateHandle = (id) => {
    setPage("edit");
    setInvID(id);
    setEditMode(true);
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
        <div className="page-header">
          <div className="add-item d-flex">
            <div className="page-title">
              <h4>Store List</h4>
              <h6>Manage your Store</h6>
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
              onClick={handleInsertMode}
            >
              <PlusCircle className="me-2" />
              Add New Store
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
                        classNamePrefix="react-select"
                        className="img-select"
                        options={storeList}
                        placeholder="Choose Store Name"
                        onChange={(e) => handleSelectStore(e.value)}
                        value={selectStore}
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
              // pagination={true}
              />
            </div>
          </div>
        </div>
        {/* /product list */}
      </div>

      <div>
        {/* Add Client */}
        <div className="modal fade" id="add-units" onClick={handleModalClose}>
          <div className="modal-dialog modal-dialog-centered custom-modal-two">
            <div className="modal-content">
              <div className="page-wrapper-new p-0">
                <div className="content p-0">
                  <div className="modal-header border-0 custom-modal-header">
                    <div className="page-title">
                      <h4>Add Client</h4>
                    </div>
                    <button
                      type="button"
                      className="close"
                      data-bs-dismiss="modal"
                      aria-label="Close"
                    >
                      <span aria-hidden="true">×</span>
                    </button>
                  </div>
                  <div className="modal-body custom-modal-body">
                    <form onSubmit={handleInsert} ref={formRef}>
                      <div className="modal-title-head">
                        <h6>
                          <span>
                            <i data-feather="info" className="feather-info me-2" />
                          </span>
                          Client Info
                        </h6>
                      </div>
                      <div className="row">
                        <div className="col-lg-12">
                          <div className="mb-3 input-blocks">
                            <label className="form-label">Name</label>
                            <input type="text" className="form-control" ref={nameRef} onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
                            {errors.name && <p style={{ color: "#ff7676" }}>{errors.name}</p>}
                          </div>
                        </div>
                        <div className="col-lg-12">
                          <div className="mb-3 war-add">
                            <label className="mb-2">Phone Number</label>
                            <input
                              className="form-control"
                              type="text"
                              onChange={(e) => setFormData({ ...formData, contact: e.target.value })}
                            />
                          </div>
                        </div>
                        <div className="col-lg-12">
                          <div className="mb-3">
                            <label className="form-label">Email</label>
                            <input type="email" className="form-control" onChange={(e) => setFormData({ ...formData, email: e.target.value })} />
                          </div>
                        </div>
                        <div className="col-lg-12">
                          <div className="mb-3">
                            <label className="form-label">Address</label>
                            <input type="text" className="form-control" onChange={(e) => setFormData({ ...formData, address: e.target.value })} />
                          </div>
                        </div>
                        <div className="col-lg-6">
                          <div className="mb-3 mb-0">
                            <label>City</label>
                            <input type="text" className="form-control" onChange={(e) => setFormData({ ...formData, city: e.target.value })} />
                          </div>
                        </div>
                        <div className="col-lg-6">
                          <div className="mb-3 mb-0">
                            <label className="form-label">Country</label>
                            <input type="text" className="form-control" onChange={(e) => setFormData({ ...formData, country: e.target.value })} style={{ marginTop: "-9px" }} />
                          </div>
                        </div>
                      </div>
                      <div className="modal-footer-btn">
                        <button
                          type="button"
                          className="btn btn-cancel me-2"
                          data-bs-dismiss="modal"
                        >
                          Close
                        </button>
                        <button type="submit" className="btn btn-submit">
                          Create Client
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* /Add Client */}
        {/* Edit Client */}
        <div className="modal fade" id="edit-units" onClick={handleModalClose}>
          <div className="modal-dialog modal-dialog-centered custom-modal-two">
            <div className="modal-content">
              <div className="page-wrapper-new p-0">
                <div className="content p-0">
                  <div className="modal-header border-0 custom-modal-header">
                    <div className="page-title">
                      <h4>Edit Client</h4>
                    </div>
                    <button
                      type="button"
                      className="close"
                      data-bs-dismiss="modal"
                      aria-label="Close"
                      onClick={handleModalClose}
                    >
                      <span aria-hidden="true">×</span>
                    </button>
                  </div>
                  <div className="modal-body custom-modal-body">
                    <form onSubmit={handleUpdate}>
                      <div className="modal-title-head">
                        <h6>
                          <span>
                            <i data-feather="info" className="feather-info me-2" />
                          </span>
                          Client Info
                        </h6>
                      </div>
                      <div className="row">
                        <div className="col-lg-12">
                          <div className="mb-3">
                            <label className="form-label">Name</label>
                            <input
                              type="text"
                              className="form-control"
                              value={formData.name}
                              ref={nameRef2} onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            />
                            {errors.updateErr && <p style={{ color: "#ff7676" }}>{errors.updateErr}</p>}
                          </div>
                        </div>
                        <div className="col-lg-12">
                          <div className="mb-3">
                            <label className="mb-2">Phone Number</label>
                            <input
                              className="form-control"
                              type="text"
                              value={formData.contact}
                              onChange={(e) => setFormData({ ...formData, contact: e.target.value })}
                            />
                          </div>
                        </div>
                        <div className="col-lg-12">
                          <div className="mb-3">
                            <label className="form-label">Email</label>
                            <input
                              type="email"
                              className="form-control"
                              value={formData.email}
                              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            />
                          </div>
                        </div>
                        <div className="col-lg-12">
                          <div className="mb-3">
                            <label className="form-label">Address</label>
                            <input
                              type="text"
                              className="form-control"
                              value={formData.address}
                              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                            />
                          </div>
                        </div>
                        <div className="col-lg-6">
                          <div className="mb-3">
                            <label>City</label>
                            <input
                              type="text"
                              className="form-control"
                              value={formData.city}
                              onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                            />
                          </div>
                        </div>
                        <div className="col-lg-6">
                          <div className="mb-3">
                            <label className="form-label">Country</label>
                            <input
                              type="text"
                              className="form-control"
                              value={formData.country}
                              onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                              style={{ marginTop: "-9px" }}
                            />
                          </div>
                        </div>
                      </div>
                      <div className="modal-footer-btn">
                        <button
                          type="button"
                          className="btn btn-cancel me-2"
                          data-bs-dismiss="modal"
                          onClick={handleModalClose}
                        >
                          Close
                        </button>
                        <button type="submit" className="btn btn-submit">
                          Save Changes
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* <storeModal /> */}
    </div>
  );
};

export default StoreList;
