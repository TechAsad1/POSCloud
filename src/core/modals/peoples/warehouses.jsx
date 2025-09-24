import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { Filter, Sliders } from "react-feather";
import Select from "react-select";
import { Globe, User } from "react-feather";
import ImageWithBasePath from "../../img/imagewithbasebath";
import Table from "../../pagination/datatable";
import withReactContent from "sweetalert2-react-content";
import Swal from "sweetalert2";
import { useDispatch, useSelector } from "react-redux";
import { deleteBranch, getBranch, getClient, insertBranch, updateBranch, setToogleHeader } from "../../redux/action";
import { ChevronUp, PlusCircle, RotateCcw } from "feather-icons-react/build/IconComponents";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import { useLoginData } from "../../../helper/loginUserData";

const WareHouses = () => {

  const loginUser = useLoginData();
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
        dispatch(deleteBranch(p));
      } else {
        MySwal.close();
      }
    });
  };
  const [isFilterVisible, setIsFilterVisible] = useState(false);
  const toggleFilterVisibility = () => {
    setIsFilterVisible((prevVisibility) => !prevVisibility);
  };
  const columns = [
    {
      title: "Branch",
      dataIndex: "branchName",
      sorter: (a, b) => a.branchName.length - b.branchName.length,
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
      title: "ZipCode",
      dataIndex: "zipCode",
      sorter: (a, b) => a.zipCode.length - b.zipCode.length,
    },
    {
      title: "State",
      dataIndex: "state",
      sorter: (a, b) => a.state.length - b.state.length,
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
  ];
  if (loginUser?.userRole === "SuperAdmin") {
    columns.push({
      title: "Actions",
      dataIndex: "actions",
      render: (_, record) => (
        <div className="action-table-data">
          <div className="edit-delete-action">
            <Link
              className="me-2 p-2"
              to="#"
              data-bs-toggle="modal"
              data-bs-target="#edit-units"
              onClick={() => updateHandle(record.branchId)}
            >
              <i data-feather="edit" className="feather-edit"></i>
            </Link>
            <Link
              className="confirm-text p-2"
              to="#"
              onClick={() => showConfirmationAlert(record.branchId)}
            >
              <i data-feather="trash-2" className="feather-trash-2"></i>
            </Link>
          </div>
        </div>
      ),
    });
  }
  const options = [
    { value: "date", label: "Sort by Date" },
    { value: "newest", label: "Newest" },
    { value: "oldest", label: "Oldest" },
  ];

  const dispatch = useDispatch();
  const branches = useSelector((state) => state.branches);
  //Custom Code
  const [page, setPage] = useState("add");
  const [dataSource, setDataSource] = useState([]);
  const [branchList, setBranchList] = useState([{ value: 0, label: 'Choose Branch' }]);
  const [countryList, setCountryList] = useState([{ value: "Choose Country", label: 'Choose Country' }]);
  //Select
  const [selectBranch, setSelectBranch] = useState(branchList[0]);
  const [selectCountry, setSelectCountry] = useState(countryList[0]);

  useEffect(() => {
    dispatch(getBranch());
    dispatch(getClient());
  }, [dispatch]);
  useEffect(() => {
    setBranchList((prev) => [
      prev[0], ...branches.map((x) => ({
        value: x.branchId,
        label: x.branchName
      }))
    ]);
    setCountryList((prev) => {
      return branches.reduce((acc, x) => {
        if (!acc.some((item) => item.value === x.country)) {
          acc.push({ value: x.country, label: x.country });
        }
        return acc;
      }, [prev[0]]);
    });
    searchEngine("", "");
  }, [branches]);
  //Search Engine
  const searchEngine = (action, key) => {
    if (action === "newest") {
      setDataSource(branches.sort((a, b) => a.branchId - b.branchId)
        .slice(0, branches.length).map((item) => ({ ...item, key: item.branchId, })));
    }
    else if (action === "oldest") {
      setDataSource(branches.sort((a, b) => b.branchId - a.branchId)
        .slice(0, branches.length).map((item) => ({ ...item, key: item.branchId, })));
    }
    else if (action === "filter") {
      handleFilter();
    }
    else {
      setDataSource(branches.filter((item) =>
        Object.values(item).some(
          (value) =>
            typeof value === "string" &&
            value.toLowerCase().includes(key.toLowerCase())
        )
      ).map((item) => ({ ...item, key: item.branchId, })));
    }
  }
  const handleFilter = () => {
    if (selectBranch.value > 0 && selectCountry.value === "Choose Country") {
      setDataSource(branches.filter((x) => x.branchId === selectBranch.value).map((item) => ({ ...item, key: item.branchId, })));
    }
    else if (selectBranch.value === 0 && selectCountry.value != "Choose Country") {
      setDataSource(branches.filter((x) => x.country === selectCountry.value).map((item) => ({ ...item, key: item.branchId, })));
    }
    else {
      setDataSource(branches.filter((x) => x.branchId === selectBranch.value && x.country === selectCountry.value).map((item) => ({ ...item, key: item.branchId, })));
    }
  }
  //Set Select DropDown
  const handleSelectBranch = (e) => {
    setSelectBranch(branchList.find((x) => x.value === e));
  }
  const handleSelectCountry = (e) => {
    setSelectCountry(countryList.find((x) => x.value?.toLowerCase() === e?.toLowerCase()));
  }

  //Insert/Update
  const [clientStore, setPosts] = useState([]);

  const [invID, setInvID] = useState(0);
  const [editMode, setEditMode] = useState(false);
  const clientStore1 = useSelector((state) => state.clients);
  const [clients, setClients] = useState([{ value: 0, label: "Choose Client Name" }]);
  const [formData, setFormData] = useState({ clientID: 1, name: "", email: "", contact: "", address: "", state: "", zipCode: "", city: "", country: "", createdBy: loginUser?.userId });
  const [errors, setErrors] = useState({});
  //Ref
  const nameRef = useRef();
  const contactRef = useRef();
  const emailRef = useRef();
  const addressRef = useRef();
  const stateRef = useRef();
  const zipRef = useRef();
  const cityRef = useRef();
  const countryRef = useRef();

  const nameRef2 = useRef();
  const formRef = useRef(null);

  useEffect(() => {
    setFormData({ ...formData, createdBy: loginUser?.userId });
  }, [loginUser]);

  useEffect(() => {
    setPosts(clientStore1);
  }, [loginUser, clientStore1]);

  const [selectClient, setSelectClient] = useState(clients[0]);
  const handleSelectClient = (e) => {
    const selected = clients.find((x) => x.value === e);
    setSelectClient(selected);
    if (e === 0) {
      setFormData({ ...formData, clientID: 0, clientName: "" });
    }
    else {
      setFormData({ ...formData, clientID: e, clientName: selected.label });
    }
  }
  useEffect(() => {
    setClients((prev) => [
      prev[0], ...clientStore.map((x) => ({
        value: x.clientId,
        label: x.clientName
      }))
    ]);
  }, [clientStore]);
  //Validation
  const validate = () => {
    let tempErrors = {};
    if (nameRef.current.value === "") {
      tempErrors.name = "Branch name required";
      setErrors(tempErrors);
    }
    else if (selectClient.label === "Choose Client Name") {
      tempErrors.insertClientName = "Client name required";
      setErrors(tempErrors);
    }
    else {
      setErrors({ ...errors, name: "", insertClientName: "" });
    }
    return Object.keys(tempErrors).length === 0;
  };
  //Submit
  const handleInsert = () => {
    if (validate()) {
      dispatch(insertBranch(formData));
      successAlert("Record inserted successfully");
      clearForm();
    }
  };
  const clearForm = () => {
    setErrors({ ...errors, name: "", insertClientName: "" });
    setFormData({ ...formData, name: "", email: "", contact: "", address: "", city: "", country: "" });
    nameRef.current.value = "";
    contactRef.current.value = "0";
    emailRef.current.value = "";
    addressRef.current.value = "";
    stateRef.current.value = "";
    zipRef.current.value = "";
    cityRef.current.value = "";
    countryRef.current.value = "";
  }
  useEffect(() => {
    if (editMode) {
      if (page === "add") {
        handleSelectClient(0);
        clearForm(formRef.current);
      }
      else {
        const res = branches.find((i) => i.branchId === Number(invID));
        setFormData({ ...formData, name: res.branchName, email: res.email, contact: res.contact, address: res.address, state: res.state, zipCode: res.zipCode, city: res.city, country: res.country });
        setErrors({ ...errors, updateErr: "" });
      }
    }
  }, [editMode])
  //Modal IsVisible
  const handleModalClose = () => {
    setEditMode(false);
  }
  //Validation
  const validate2 = () => {
    let tempErrors = {};
    if (nameRef2.current.value === "") {
      tempErrors.updateErr = "Branch name required";
      setErrors(tempErrors);
    }
    else {
      setErrors({ ...errors, updateErr: "" });
    }
    return Object.keys(tempErrors).length === 0;
  };
  const handleUpdate = () => {
    if (validate2()) {
      dispatch(updateBranch(invID, formData));
      successAlert("Record updated successfully");
    }
  };
  const updateHandle = (id) => {
    setPage("edit");
    setInvID(id);
    setEditMode(true);
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

  return (
    <div className="page-wrapper">
      <div className="content">
        <div className="page-header">
          <div className="add-item d-flex">
            <div className="page-title">
              <h4>Branch List</h4>
              <h6>Manage your Branch</h6>
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
          {loginUser?.userRole === "SuperAdmin" &&
            (
              <div className="page-btn">
                <Link
                  to="#"
                  className="btn btn-added"
                  data-bs-toggle="modal"
                  data-bs-target="#add-units"
                  onClick={handleInsertMode}
                >
                  <PlusCircle className="me-2" />
                  Add New Branch
                </Link>
              </div>
            )}
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
                        classNamePrefix="react-select"
                        className="img-select"
                        options={branchList}
                        placeholder="Choose Branch Name"
                        onChange={(e) => handleSelectBranch(e.value)}
                        value={selectBranch}
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

      <div>
        {/* Add Branch */}
        <div className="modal fade" id="add-units" onClick={handleModalClose}>
          <div className="modal-dialog modal-dialog-centered custom-modal-two">
            <div className="modal-content">
              <div className="page-wrapper-new p-0">
                <div className="content p-0">
                  <div className="modal-header border-0 custom-modal-header">
                    <div className="page-title">
                      <h4>Add Branch</h4>
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
                    <div className="row">
                      <div className="col-lg-6">
                        <div className="mb-3 input-blocks">
                          <label className="form-label">Branch Name</label>
                          <input type="text" className={`form-control ${errors.name ? "is-invalid" : ""}`} ref={nameRef} onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
                          {errors.name && <p style={{ color: "#ff7676" }}>{errors.name}</p>}
                        </div>
                      </div>
                      <div className="col-lg-6">
                        <div className="mb-3 input-blocks">
                          <label className="form-label">Client Name</label>
                          <Select
                            classNamePrefix="react-select"
                            options={clients}
                            onChange={(e) => handleSelectClient(e.value)}
                            value={selectClient}
                          />
                          {errors.insertClientName && <p style={{ color: "#ff7676" }}>{errors.insertClientName}</p>}
                        </div>
                      </div>
                      <div className="col-lg-12">
                        <div className="mb-3 war-add">
                          <label className="mb-2">Phone Number</label>
                          <input
                            className="form-control"
                            type="number"
                            ref={contactRef}
                            onChange={(e) => setFormData({ ...formData, contact: e.target.value })}
                          />
                        </div>
                      </div>
                      <div className="col-lg-12">
                        <div className="mb-3">
                          <label className="form-label">Email</label>
                          <input type="email" className="form-control" ref={emailRef} onChange={(e) => setFormData({ ...formData, email: e.target.value })} />
                        </div>
                      </div>
                      <div className="col-lg-12">
                        <div className="mb-3">
                          <label className="form-label">Address</label>
                          <input type="text" className="form-control" ref={addressRef} onChange={(e) => setFormData({ ...formData, address: e.target.value })} />
                        </div>
                      </div>
                      <div className="col-lg-6">
                        <div className="mb-3 mb-0">
                          <label>State</label>
                          <input type="text" className="form-control" ref={stateRef} onChange={(e) => setFormData({ ...formData, state: e.target.value })} />
                        </div>
                      </div>
                      <div className="col-lg-6">
                        <div className="mb-3 mb-0">
                          <label>ZipCode</label>
                          <input type="text" className="form-control" ref={zipRef} onChange={(e) => setFormData({ ...formData, zipCode: e.target.value })} />
                        </div>
                      </div>
                      <div className="col-lg-6">
                        <div className="mb-3 mb-0">
                          <label>City</label>
                          <input type="text" className="form-control" ref={cityRef} onChange={(e) => setFormData({ ...formData, city: e.target.value })} />
                        </div>
                      </div>
                      <div className="col-lg-6">
                        <div className="mb-3 mb-0">
                          <label className="form-label">Country</label>
                          <input type="text" className="form-control" ref={countryRef} onChange={(e) => setFormData({ ...formData, country: e.target.value })} style={{ marginTop: "-9px" }} />
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
                      <button type="submit" className="btn btn-submit" onClick={handleInsert}>
                        Create Branch
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* /Add Branch */}
        {/* Edit Branch */}
        <div className="modal fade" id="edit-units" onClick={handleModalClose}>
          <div className="modal-dialog modal-dialog-centered custom-modal-two">
            <div className="modal-content">
              <div className="page-wrapper-new p-0">
                <div className="content p-0">
                  <div className="modal-header border-0 custom-modal-header">
                    <div className="page-title">
                      <h4>Edit Branch</h4>
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
                    <div className="row">
                      <div className="col-lg-12">
                        <div className="mb-3">
                          <label className="form-label">Branch Name</label>
                          <input
                            type="text"
                            className={`form-control ${errors.updateErr ? "is-invalid" : ""}`}
                            value={formData?.name ?? ""}
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
                            value={formData?.contact ?? ""}
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
                            value={formData?.email ?? ""}
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
                            value={formData?.address ?? ""}
                            onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                          />
                        </div>
                      </div>
                      <div className="col-lg-6">
                        <div className="mb-3 mb-0">
                          <label>State</label>
                          <input type="text" className="form-control" value={formData.state} onChange={(e) => setFormData({ ...formData, state: e.target.value })} />
                        </div>
                      </div>
                      <div className="col-lg-6">
                        <div className="mb-3 mb-0">
                          <label>ZipCode</label>
                          <input type="text" className="form-control" value={formData?.zipCode ?? ""} onChange={(e) => setFormData({ ...formData, zipCode: e.target.value })} />
                        </div>
                      </div>
                      <div className="col-lg-6">
                        <div className="mb-3">
                          <label>City</label>
                          <input
                            type="text"
                            className="form-control"
                            value={formData?.city ?? ""}
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
                            value={formData?.country ?? ""}
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
                      <button type="submit" className="btn btn-submit" onClick={handleUpdate}>
                        Save Changes
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
};

export default WareHouses;
