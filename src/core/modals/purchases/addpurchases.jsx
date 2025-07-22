import { DatePicker } from "antd";
import { Calendar, MinusCircle, PlusCircle } from "feather-icons-react/build/IconComponents";
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Select from "react-select";
import TextEditor from "../../../feature-module/inventory/texteditor";
import { useDispatch, useSelector } from "react-redux";
import { addToCart, clearCart, decrementCart, getProduct, getPurchaseInv, getSupplier, incrementCart, insertPurchase, insertTransaction, removeCartRow, rowDiscCart, rowGstCart, rowPriceCart, updateInvID, updatePurchaseInv } from "../../redux/action";
import ImageWithBasePath from "../../img/imagewithbasebath";
import withReactContent from 'sweetalert2-react-content'
import Swal from 'sweetalert2'
import axios from "axios";
import { formatCurrency } from "../../../helper/helpers";
import { all_routes } from "../../../Router/all_routes";


const AddPurchases = (p) => {
  const route = all_routes;
  const status = [
    { value: "Choose", label: "Choose" },
    { value: "Received", label: "Received" },
    { value: "Pending", label: "Pending" },
  ];
  const mode = [
    { value: "Choose", label: "Choose" },
    { value: "Cash", label: "Cash" },
    { value: "Credit", label: "Credit" },
  ];
  const [selectedDate, setSelectedDate] = useState(new Date());
  const handleDateChange = (date) => {
    setSelectedDate(date);
  };
  const dispatch = useDispatch();
  //Custom Code
  //Cart
  const invIDStore = useSelector((state) => state.invID);
  const cartStore = useSelector((state) => state.cart);
  const users = useSelector((state) => state.users);
  const [cart, setCart] = useState({ supplierID: 0, paymentStatus: "Choose", item: 0, total: 0, gst: 0, gstPerc: 0, disc: 0, discPerc: 0, netTotal: 0, paymentMode: "Cash" });
  //PaymentMode
  const [selectMode, setSelectMode] = useState(mode[3]);
  //PaymentStatus
  const [selectStatus, setSelectStatus] = useState(status[0]);
  //Product
  const productStore = useSelector((state) => state.posts);
  const [productArray, setProductArray] = useState([{ value: 0, label: 'Choose product name' }]);
  const [selectProduct, setSelectProduct] = useState(productArray[0]);
  //Supplier
  const supplierStore = useSelector((state) => state.suppliers);
  const [supplierArray, setSupplierArray] = useState([{ value: 0, label: 'Choose' }]);
  const [selectSupplier, setSelectSupplier] = useState(supplierArray[0]);
  const [invoiceMode, setInvoiceMode] = useState(false);

  const [loginUser, setLoginUser] = useState(null);

  useEffect(() => {
    if (p.insertMode) {
      dispatch(getSupplier());
      dispatch(getProduct());
      dispatch(clearCart());
      dispatch(updateInvID(0));
    }
  }, [p.insertMode]);
  useEffect(() => {
    if (invoiceMode) {
      let paid = 0;
      let due = 0;
      let status = cart.paymentStatus;
      if (cart.paymentMode === "Credit") {
        paid = 0;
        due = cart.netTotal;
        status = "Pending";
      }
      else {
        paid = cart.netTotal;
        due = 0;
      }
      const invTemp = { ClientId: 1, BranchId: 1, _item: cartStore.length, _total: cart.total, _des: "", _disc: cart.disc, _gst: cart.gst, _netTotal: cart.netTotal, _paid: paid, _due: due, _paymentMode: cart.paymentMode, _paymentStatus: status, _supplierName: cart.supplierName, _supplierId: cart.supplierID }
      dispatch(updatePurchaseInv(invIDStore, invTemp));
      cartStore.map((x) => (
        dispatch(insertPurchase({ Rid: invIDStore, ProductId: x.id, Img: x.img, Name: x.name, Qty: x.qty, Price: x.price, GstPerc: x.gstPerc, Gst: x.gst, DiscPerc: x.discPerc, Disc: x.disc, Total: x.total, netTotal: x.netTotal, costPrice: x.costPrice }))
      ));
      dispatch(insertTransaction({ _clientId: 0, _branchId: 0, _rid: invIDStore, _userId: cart.supplierID, _userName: cart.supplierName, _paymentType: cart.paymentMode, _desc: "Payment", _account: "Purchase", _total: cart.netTotal, _users: "Asad" }));
      successAlert();
      setSelectMode(mode[3]);
      setSelectStatus(status[0]);
      setSelectProduct(productArray[0]);
      setSelectSupplier(supplierArray[0]);
      dispatch(clearCart());
      setInvoiceMode(false)
      dispatch(getPurchaseInv());
    }
  }, [invIDStore, p.insertMode]);
  useEffect(() => {
    if (p.insertMode) {
      setSupplierArray((prev) => [
        prev[0],
        ...supplierStore.filter((i) => i.clientId === loginUser?.clientId && i.branchId === loginUser?.branchId).map((x) => ({
          value: x.distributorId,
          label: x.distributorName
        }))
      ]);
    }
  }, [supplierStore, p.insertMode]);
  useEffect(() => {
    if (p.insertMode) {
      setProductArray((prev) => [
        prev[0],
        ...productStore.filter((i) => i.clientId === loginUser?.clientId && i.branchId === loginUser?.branchId).map((x) => ({
          value: x.productId,
          label: x.productName
        }))
      ]);
    }
  }, [productStore, p.insertMode]);
  useEffect(() => {
    calculate();
  }, [cartStore, p.insertMode]);

  //AddToCart
  const handleChange = (e) => {
    setSelectProduct(productArray.find((x) => x.value === e));
    if (e > 0) {
      dispatch(addToCart(productStore.filter((i) => i.clientId === loginUser?.clientId && i.branchId === loginUser?.branchId && i.productId === e)));
    }
  };
  const handleFormSubmit = async () => {
    const mainUrl = "https://poscloud.itmechanix.com/api/PurchaseInv";
    if (cartStore.length > 0) {
      if (cart.supplierID === 0) {
        supplierReqAlert();
      }
      else if (cart.paymentStatus === "Choose") {
        modeReqAlert();
      }
      else {
        const insertTemp = {
          clientId: 1,
          branchId: 1,
          paymentMode: cart.paymentMode,
          distributorId: cart.supplierID,
          createdBy: loginUser?.userId,
          item: cart.item,
          total: cart.total,
          discPerc: cart.discPerc,
          disc: cart.discount,
          gstPerc: cart.gstPerc,
          gst: cart.gst,
          netTotal: cart.netTotal,
        }
        let rid = 0;
        try {
          await axios.post(mainUrl, insertTemp).then((res) => {
            console.log(insertTemp);
            rid = res.data.purchaseNo;
            dispatch(getPurchaseInv());
          });
        } catch (error) {
          console.log(error.message);
        }
        if (rid > 0) {
          cartStore.map((x) => (
            dispatch(insertPurchase({ purchaseNo: rid, clientId: 1, branchId: 1, productId: x.id, uom: x.uom, factor: x.factor, quantity: x.qty, Total: x.total, purchasePrice: x.price, gstprct: x.gstPerc, gstamount: x.gst, discountPrct: x.discPerc, discountAmount: x.disc, productTotal: x.netTotal, productCost: x.costPrice }))
          ));
          successAlert();
        }
      }
    }
    else {
      productReqAlert();
    }
  }
  const calculate = () => {
    const _total = cartStore.reduce((sum, i) => sum + i.total, 0);
    const _gst = cartStore.reduce((sum, i) => sum + i.gst, 0);
    const _disc = cartStore.reduce((sum, i) => sum + i.disc, 0);
    const _netTotal = cartStore.reduce((sum, i) => sum + i.netTotal, 0);
    setCart({ ...cart, total: _total, gst: _gst, disc: _disc, netTotal: _netTotal });
  }
  const handleRowDecrement = (id, num) => {
    if (num > 1) {
      dispatch(decrementCart(id))
    }
  }
  const handleMode = (e) => {
    setSelectMode(mode.find((x) => x.value === e));
    if (e === "Credit") {
      setSelectStatus(status.find((x) => x.value === "Pending"));
      setCart({ ...cart, paymentStatus: "Pending", paymentMode: "Credit" });
    }
    else {
      setSelectStatus(status.find((x) => x.value === "Received"));
      setCart({ ...cart, paymentStatus: "Received", paymentMode: "Cash" });
    }
  }
  const handleStatus = (e) => {
    if (e === "Pending") {
      setSelectMode(mode.find((x) => x.value === "Credit"));
      setSelectStatus(status.find((x) => x.value === "Pending"));
      setCart({ ...cart, paymentStatus: "Pending", paymentMode: "Credit" });
    }
    else {
      setSelectMode(mode.find((x) => x.value === "Cash"));
      setSelectStatus(status.find((x) => x.value === e));
      setCart({ ...cart, paymentStatus: "Received", paymentMode: "Cash" });
    }
  }
  //Supplier
  const handleSelectSupplier = (e) => {
    setSelectSupplier(supplierArray.find((x) => x.value === e));
    setCart({ ...cart, supplierID: e });
  }
  const MySwal = withReactContent(Swal);
  const showConfirmationAlert = (e) => {
    MySwal.fire({
      title: 'Are you sure ?',
      text: 'You won\'t to remove this product into cart!',
      showCancelButton: true,
      confirmButtonColor: '#00ff00',
      confirmButtonText: 'Yes, delete it!',
      cancelButtonColor: '#ff0000',
      cancelButtonText: 'Cancel',
    }).then((result) => {
      if (result.isConfirmed) {
        dispatch(removeCartRow(e));
        MySwal.close();
      }
    });
  };
  const successAlert = () => {
    MySwal.fire({
      icon: "success",
      title: "Record inserted successfully",
      confirmButtonText: "Ok",
    })
  };
  const supplierReqAlert = () => {
    MySwal.fire({
      icon: "error",
      title: 'Supplier Required!',
      text: "You have not selected a supplier!",
      confirmButtonText: 'OK',
      customClass: {
        confirmButton: 'btn btn-danger',
      },
    });
  }
  const productReqAlert = () => {
    MySwal.fire({
      icon: "error",
      title: 'Empty Cart!',
      text: "You have not added any products to the cart!",
      confirmButtonText: 'OK',
      customClass: {
        confirmButton: 'btn btn-danger',
      },
    });
  }
  const modeReqAlert = () => {
    MySwal.fire({
      icon: "error",
      title: 'Payment Mode Required!',
      text: "You have selected the wrong payment mode!",
      confirmButtonText: 'OK',
      customClass: {
        confirmButton: 'btn btn-danger',
      },
    });
  }
  const handleClose = () => {
    p.setInsertMode(false);
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
    <div>
      {/* Add Purchase */}
      <div className="modal fade" id="add-units" onClick={handleClose}>
        <div className="modal-dialog purchase modal-dialog-centered stock-adjust-modal">
          <div className="modal-content">
            <div className="page-wrapper-new p-0">
              <div className="content">
                <div className="modal-header border-0 custom-modal-header">
                  <div className="page-title">
                    <h4>Add Purchase</h4>
                  </div>
                  <button
                    type="button"
                    className="close"
                    data-bs-dismiss="modal"
                    aria-label="Close"
                    onClick={handleClose}
                  >
                    <span aria-hidden="true">×</span>
                  </button>
                </div>
                <div className="modal-body custom-modal-body">
                  <div className="row">
                    <div className="col-lg-3 col-md-6 col-sm-12">
                      <div className="input-blocks add-product">
                        <label>Supplier Name</label>
                        <div className="row">
                          <div className="col-lg-12 col-sm-10 col-10">
                            <Select
                              options={supplierArray}
                              classNamePrefix="react-select"
                              placeholder="Choose"
                              onChange={(e) => handleSelectSupplier(e.value)}
                              value={selectSupplier}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="col-lg-3 col-md-6 col-sm-12">
                      <div className="input-blocks">
                        <label>Purchase Date</label>
                        <div className="input-groupicon calender-input">
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
                    <div className="col-lg-3 col-md-6 col-sm-12">
                      <div className="input-blocks">
                        <label>Reference No</label>
                        <input type="text" className="form-control" />
                      </div>
                    </div>
                    <div className="col-lg-3 col-md-6 col-sm-12">
                      <div className="input-blocks">
                        <label>Payment Mode</label>
                        <Select
                          options={mode}
                          classNamePrefix="react-select"
                          placeholder="Choose"
                          onChange={(e) => handleMode(e.value)}
                          value={selectMode}
                        />
                      </div>
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-lg-12">
                      <label>Product Name</label>
                      <div className="input-block">
                        <Select
                          options={productArray}
                          classNamePrefix="react-select"
                          placeholder="Please type product code and select"
                          onChange={(e) => handleChange(e.value)}
                          value={selectProduct}
                        />
                        <br />
                      </div>
                    </div>
                    {/* Cart Table */}
                    <div className="col-lg-12">
                      <div className="modal-body-table">
                        <div className="table-responsive">
                          <table className="table">
                            <thead>
                              <tr>
                                <th>Product</th>
                                <th>Qty</th>
                                <th>Purchase Rate($)</th>
                                <th>Gross Amount</th>
                                <th>Discount(%)</th>
                                <th>Discount Amount($)</th>
                                <th>Tax(%)</th>
                                <th>Tax Amount($)</th>
                                <th>Net Amount($)</th>
                                <th>Item Cost($)</th>
                                <th>Action</th>
                              </tr>
                            </thead>
                            <tbody>
                              {cartStore.map((r) => (
                                <tr key={r.id}>
                                  <td className="p-2">{r.name}</td>
                                  <td>
                                    <div className="product-quantity">
                                      <span className="quantity-btn" onClick={() => handleRowDecrement(r.id, r.qty)}>+ <MinusCircle /></span>
                                      <input type="number" name="qtyText" className="quntity-input" value={r.qty} />
                                      <span className="quantity-btn" onClick={() => dispatch(incrementCart(r.id))}> <PlusCircle /></span>
                                    </div>
                                  </td>
                                  <td className="p-2"><input type="number" className="form-control" defaultValue={r.price} onChange={(e) => dispatch(rowPriceCart(r.id, e.target.value))} /></td>
                                  <td className="p-2">{formatCurrency(r.total)}</td>
                                  <td className="p-2"><input type="number" className="form-control" defaultValue={r.discPerc} onChange={(e) => dispatch(rowDiscCart(r.id, e.target.value))} /></td>
                                  <td className="p-2">{formatCurrency(r.disc)}</td>
                                  <td className="p-2"><input type="number" className="form-control" defaultValue={r.gstPerc} onChange={(e) => dispatch(rowGstCart(r.id, e.target.value))} /></td>
                                  <td className="p-2">{formatCurrency(r.gst)}</td>
                                  <td className="p-2">{formatCurrency(r.netTotal)}</td>
                                  <td className="p-2">{formatCurrency(r.costPrice)}</td>
                                  <td>
                                    <Link className="delete-set" onClick={() => showConfirmationAlert(r.id)}><ImageWithBasePath src="assets/img/icons/delete.svg" alt="svg" /></Link>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </div>
                    <div className="row">
                      <div className="col-lg-2 col-md-6 col-sm-12">
                        <div className="input-blocks">
                          <label>Total Items#</label>
                          <input type="text" value={cartStore.length} />
                        </div>
                      </div>
                      <div className="col-lg-2 col-md-6 col-sm-12">
                        <div className="input-blocks">
                          <label>Total Gross</label>
                          <input type="number" className="form-control" value={cart.total} />
                        </div>
                      </div>
                      <div className="col-lg-2 col-md-6 col-sm-12">
                        <div className="input-blocks">
                          <label>Total Discount</label>
                          <input type="number" className="form-control" value={cart.disc} />
                        </div>
                      </div>
                      <div className="col-lg-2 col-md-6 col-sm-12">
                        <div className="input-blocks">
                          <label>Total Tax</label>
                          <input type="number" className="form-control" value={cart.gst} />
                        </div>
                      </div>
                      <div className="col-lg-2 col-md-6 col-sm-12">
                        <div className="input-blocks">
                          <label>Total Net</label>
                          <input type="number" className="form-control" value={cart.netTotal} />
                        </div>
                      </div>
                      <div className="col-lg-2 col-md-6 col-sm-12">
                        <div className="input-blocks">
                          <label>Payment Status</label>
                          <Select
                            options={status}
                            classNamePrefix="react-select"
                            placeholder="Choose"
                            onChange={(e) => handleStatus(e.value)}
                            value={selectStatus}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="col-lg-12">
                    <div className="input-blocks summer-description-box">
                      <label>Notes</label>
                      <div id="summernote" />
                      <TextEditor />
                    </div>
                  </div>
                  <div className="col-lg-12">
                    <div className="modal-footer-btn">
                      <button
                        type="button"
                        className="btn btn-cancel me-2"
                        data-bs-dismiss="modal"
                        onClick={handleClose}
                      >
                        Close
                      </button>
                      <button className="btn btn-submit" onClick={handleFormSubmit}>
                        Submit
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* /Add Purchase */}
    </div>
  );
};

export default AddPurchases;
