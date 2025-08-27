import axios from "axios";
//import moment from "moment";
export const product_list = () => ({ type: "Product_list" });
export const set_product_list = (payload) => ({
  type: "Product_list",
  payload,
});
export const dashboard_recentproduct = () => ({
  type: "Dashbaord_RecentProduct",
});
export const setdashboard_recentproduct = (payload) => ({
  type: "Dashbaord_RecentProduct",
  payload,
});
export const dashboard_expiredproduct = () => ({
  type: "Dashbaord_ExpiredProduct",
});
export const setdashboard_expiredproduct = (payload) => ({
  type: "Dashbaord_ExpiredProduct",
  payload,
});
export const saleshdashboard_recenttransaction = () => ({
  type: "Salesdashbaord_ExpiredProduct",
});
export const setsaleshdashboard_recenttransaction = (payload) => ({
  type: "Salesdashbaord_ExpiredProduct",
  payload,
});
export const brand_list = () => ({ type: "Brand_list" });
export const setbrand_list = (payload) => ({
  type: "Brand_list",
  payload,
});
export const unit_data = () => ({ type: "Unit_Data" });
export const setunit_data = (payload) => ({
  type: "Unit_Data",
  payload,
});
export const variantattributes_data = () => ({ type: "Variantattribute_Data" });
export const setvariantattributes_data = (payload) => ({
  type: "Variantattribute_Data",
  payload,
});
export const warranty_data = () => ({ type: "Warranty_Data" });
export const setwarranty_data = (payload) => ({
  type: "Warranty_Data",
  payload,
});
export const barcode_data = () => ({ type: "Barcode_Data" });
export const setbarcode_data = (payload) => ({
  type: "Barcode_Data",
  payload,
});
export const departmentlist_data = () => ({ type: "Department_Data" });
export const setdepartmentlist_data = (payload) => ({
  type: "Department_Data",
  payload,
});
export const designation_data = () => ({ type: "Designation_Data" });
export const setdesignation_data = (payload) => ({
  type: "Designation_Data",
  payload,
});
export const shiftlist_data = () => ({ type: "Shiftlist_Data" });
export const setshiftlist_data = (payload) => ({
  type: "Shiftlist_Data",
  payload,
});
export const attendenceemployee_data = () => ({
  type: "Attendenceemployee_Data",
});
export const setattendenceemployee_data = (payload) => ({
  type: "Attendenceemployee_Data",
  payload,
});
export const toogleHeader_data = () => ({ type: "toggle_header" });
export const setToogleHeader = (payload) => ({
  type: "toggle_header",
  payload,
});
export const invoicereport_data = () => ({ type: "Invoicereport_Data" });
export const setinvoicereport_data = (payload) => ({
  type: "Invoicereport_Data",
  payload,
});
export const salesreturns_data = () => ({ type: "Salesreturns_Data" });
export const setsalesreturns_data = (payload) => ({
  type: "Salesreturns_Data",
  payload,
});
export const quotationlist_data = () => ({ type: "Quatation_Data" });
export const setquotationlist_data = (payload) => ({
  type: "Quatation_Data",
  payload,
});
export const customer_data = () => ({ type: "customer_data" });
export const setcustomer_data = (payload) => ({
  type: "customer_data",
  payload,
});
export const userlist_data = () => ({ type: "Userlist_data" });
export const setuserlist_data = (payload) => ({
  type: "Userlist_data",
  payload,
});
export const rolesandpermission_data = () => ({
  type: "Rolesandpermission_data",
});
export const setrolesandpermission_data = (payload) => ({
  type: "Rolesandpermission_data",
  payload,
});
export const deleteaccount_data = () => ({ type: "Deleteaccount_data" });
export const setdeleteaccount_data = (payload) => ({
  type: "Deleteaccount_data",
  payload,
});
export const attendanceadmin_data = () => ({ type: "Attendenceadmin_data" });
export const setattendanceadmin_data = (payload) => ({
  type: "Attendenceadmin_data",
  payload,
});
export const leavesadmin_data = () => ({ type: "Leavesadmin_data" });
export const setleavesadmin_data = (payload) => ({
  type: "Leavesadmin_data",
  payload,
});
export const leavetypes_data = () => ({ type: "Leavestype_data" });
export const setleavetypes_data = (payload) => ({
  type: "Leavestype_data",
  payload,
});
export const holiday_data = () => ({ type: "Holiday_data" });
export const setholiday_data = (payload) => ({
  type: "Holiday_data",
  payload,
});
export const expiredproduct_data = () => ({ type: "Expiredproduct_data" });
export const setexpiredproduct_data = (payload) => ({
  type: "Expiredproduct_data",
  payload,
});
export const lowstock_data = () => ({ type: "Lowstock_data" });
export const setlowstock_data = (payload) => ({
  type: "Lowstock_data",
  payload,
});
export const categotylist_data = () => ({ type: "Categotylist_data" });
// export const setcategotylist_data = (payload) => ({
//   type: "Categotylist_data",
//   payload,
// });
export const setLayoutChange = (payload) => ({
  type: "Layoutstyle_data",
  payload,
});

export const FetchErr = "FetchErr";
export const FetchLoader = "FetchLoader";
//Category
const mainUrl = "https://posclouds.itmechanix.com/api/";
const catUrl = mainUrl + "Category";
export const getCategoryVar = "CategoryList";
export const getCategory = () => async (dispatch) => {
  dispatch({ type: FetchLoader });
  try {
    const response = await axios.get(catUrl);
    dispatch({ type: getCategoryVar, payload: response.data });
  } catch (error) {
    dispatch({ type: FetchErr, payload: error.message });
  }
};
export const getCategoryByIdVar = "CategoryList";
export const getCategoryById = (id) => async (dispatch) => {
  try {
    const response = await axios.get(catUrl + `/${id}`);
    dispatch({ type: getCategoryByIdVar, payload: response.data });
  } catch (error) {
    dispatch({ type: FetchErr, payload: error.message });
  }
};
export const insertCategoryVar = "InsertCategory";
export const insertCategory = (x, path) => async (dispatch) => {
  try {
    const temp = { imageName: path, clientId: 1, branchId: 1, _Name: x.name, desc: x.desc, isActive: x.isActive, createdBy: x.createdBy };
    await axios.post(catUrl, temp).then((e) => {
      dispatch({ type: insertCategoryVar, payload: e.data });
    });
  } catch (error) {
    dispatch({ type: FetchErr, payload: error.message });
  }
};
export const updateCategoryVar = "UpdateCategory";
export const updateCategory = (id, x, path) => async (dispatch) => {
  try {
    const response = await axios.put(catUrl + `/${id}`, { imageName: path, _Name: x.name, desc: x.desc, isActive: x.isActive });
    dispatch({ type: updateCategoryVar, payload: response.data });
  } catch (error) {
    dispatch({ type: FetchErr, payload: error.message });
  }
};
export const deleteCategoryVar = "deleteCategory";
export const deleteCategory = (id) => async (dispatch) => {
  try {
    await axios.delete(catUrl + `/${id}`).then(() => {
      dispatch({ type: deleteCategoryVar, payload: id });
    });
  } catch (error) {
    dispatch({ type: FetchErr, payload: error.message });
  }
};
//Brand
const brandUrl = mainUrl + "Brand";
export const getBrandVar = "BrandList";
export const getBrand = () => async (dispatch) => {
  dispatch({ type: FetchLoader });
  try {
    const response = await axios.get(brandUrl);
    dispatch({ type: getBrandVar, payload: response.data });
  } catch (error) {
    dispatch({ type: FetchErr, payload: error.message });
  }
};
export const insertBrandVar = "InsertBrand";
export const insertBrand = (x) => async (dispatch) => {
  try {
    const temp = { clientID: 1, branchID: 1, _Name: x.name, desc: x.desc, createdBy: x.createdBy, isActive: x.isActive };
    await axios.post(brandUrl, temp).then((e) => {
      dispatch({ type: insertBrandVar, payload: e.data });
    });
  } catch (error) {
    dispatch({ type: FetchErr, payload: error.message });
  }
};
export const updateBrandVar = "UpdateBrand";
export const updateBrand = (id, x) => async (dispatch) => {
  try {
    const temp = { _Name: x.name, desc: x.desc, isActive: x.isActive };
    const response = await axios.put(brandUrl + `/${id}`, temp);
    dispatch({ type: updateBrandVar, payload: response.data });
  } catch (error) {
    dispatch({ type: FetchErr, payload: error.message });
  }
};
export const deleteBrandVar = "deleteBrand";
export const deleteBrand = (id) => async (dispatch) => {
  try {
    await axios.delete(brandUrl + `/${id}`).then(() => {
      dispatch({ type: deleteBrandVar, payload: id });
    });
  } catch (error) {
    dispatch({ type: FetchErr, payload: error.message });
  }
};
//Unit
const unitUrl = mainUrl + "Unit";
export const getUnitVar = "UnitList";
export const getUnit = () => async (dispatch) => {
  dispatch({ type: FetchLoader });
  try {
    const response = await axios.get(unitUrl);
    dispatch({ type: getUnitVar, payload: response.data });
  } catch (error) {
    dispatch({ type: FetchErr, payload: error.message });
  }
};
export const insertUnitVar = "InsertUnit";
export const insertUnit = (x) => async (dispatch) => {
  try {
    const temp = { _Name: x.name, desc: x.desc, createdBy: x.createdBy, isActive: x.isActive };
    await axios.post(unitUrl, temp).then((e) => {
      dispatch({ type: insertUnitVar, payload: e.data });
    });
  } catch (error) {
    dispatch({ type: FetchErr, payload: error.message });
  }
};
export const updateUnitVar = "UpdateUnit";
export const updateUnit = (id, x) => async (dispatch) => {
  try {
    const temp = { _Name: x.name, desc: x.desc, isActive: x.isActive };
    const response = await axios.put(unitUrl + `/${id}`, temp);
    dispatch({ type: updateUnitVar, payload: response.data });
  } catch (error) {
    dispatch({ type: FetchErr, payload: error.message });
  }
};
export const deleteUnitVar = "deleteUnit";
export const deleteUnit = (id) => async (dispatch) => {
  try {
    await axios.delete(unitUrl + `/${id}`).then(() => {
      dispatch({ type: deleteUnitVar, payload: id });
    });
  } catch (error) {
    dispatch({ type: FetchErr, payload: error.message });
  }
};
//Product
const productUrl = mainUrl + "Product";
export const getProductVar = "ProductList";
export const getProduct = () => async (dispatch) => {
  dispatch({ type: FetchLoader });
  try {
    const response = await axios.get(productUrl);
    dispatch({ type: getProductVar, payload: response.data });
  } catch (error) {
    dispatch({ type: FetchErr, payload: error.message });
  }
};
export const getProductByIdVar = "ProductById";
export const getProductById = (id) => async (dispatch) => {
  try {
    const response = await axios.get(`${productUrl}/${id}`);
    dispatch({ type: getProductByIdVar, payload: response.data });
  } catch (error) {
    dispatch({ type: FetchErr, payload: error.message });
  }
};
export const insertProductVar = "InsertProduct";
export const insertProduct = (x, path) => async (dispatch) => {
  try {
    const temp = { clientId: 1, branchId: 1, _Name: x.name, createdBy: x.createdBy, qrcodeBarcode: x.barcode, imageName: path, categoryId: x.categoryId, brandId: x.brandId, maxUom: x.maxUom, minUom: x.minUom, factor: x.factor, desc: x.desc, sku: x.sku, purchasePrice: x.cPrice, consumerPrice: x.consumerPrice, salePrice: x.sPrice, discountPrct: x.discPerc, discountValue: x.disc, gstprct: x.gstPerc, gstvalue: x.gst };
    await axios.post(productUrl, temp).then((e) => {
      dispatch({ type: insertProductVar, payload: e.data });
    });
  } catch (error) {
    dispatch({ type: FetchErr, payload: error.message });
  }
};
export const updateProductVar = "UpdateProduct";
export const updateProduct = (id, x, path) => async (dispatch) => {
  try {
    const temp = { _Name: x.name, qrcodeBarcode: x.barcode, imageName: path, categoryId: x.categoryId, brandId: x.brandId, maxUom: x.maxUom, minUom: x.minUom, factor: x.factor, desc: x.desc, sku: x.sku, purchasePrice: x.cPrice, consumerPrice: x.consumerPrice, salePrice: x.sPrice, discountPrct: x.discPerc, discountValue: x.disc, gstprct: x.gstPerc, gstvalue: x.gst };
    const response = await axios.put(productUrl + `/${id}`, temp);
    dispatch({ type: updateProductVar, payload: response.data });
  } catch (error) {
    dispatch({ type: FetchErr, payload: error.message });
  }
};
export const deleteProductVar = "DeleteProduct";
export const deleteProduct = (id) => async (dispatch) => {
  try {
    await axios.delete(productUrl + `/${id}`).then(() => {
      dispatch({ type: deleteProductVar, payload: id });
    });
  } catch (error) {
    dispatch({ type: FetchErr, payload: error.message });
  }
};
//Cart
export const addToCartVar = "AddToCart";
export const addToCart = (row) => (dispatch) => {
  row.map((x) => {
    const temp = { id: x.productId, img: x.imageName, name: x.productName, uom: x.minUom, factor: x.factor, qty: 1, gstPerc: 0, gst: 0, discPerc: 0, disc: 0, price: x.purchasePrice, total: x.purchasePrice, netTotal: x.purchasePrice, costPrice: x.purchasePrice };
    dispatch({ type: addToCartVar, payload: temp });
  });
};
export const addToSaleCart = (row) => (dispatch) => {
  row.map((x) => {
    const temp = { id: x.productId, img: x.imageName, name: x.productName, minUom: x.minUom, maxUom: x.maxUom, factor: x.factor, qty: 1, gstPerc: 0, gst: 0, discPerc: 0, disc: 0, price: x.salePrice, total: x.salePrice, netTotal: x.salePrice };
    dispatch({ type: addToCartVar, payload: temp });
  });
};

export const removeCartRowVar = "RemoveCartRow";
export const removeCartRow = (id) => (dispatch) => {
  dispatch({ type: removeCartRowVar, payload: id });
}
export const clearCartVar = "ClearCart";
export const clearCart = () => (dispatch) => {
  dispatch({ type: clearCartVar, payload: null });
}
export const incrementVar = "Increment";
export const incrementCart = (id) => (dispatch) => {
  dispatch({ type: incrementVar, payload: id });
};
export const decrementVar = "Decrement";
export const decrementCart = (id) => (dispatch) => {
  dispatch({ type: decrementVar, payload: id });
};
export const rowGstVar = "RowGst";
export const rowGstCart = (id, _num) => (dispatch) => {
  dispatch({ type: rowGstVar, payload: id, num: _num });
};
export const rowDiscVar = "RowDisc";
export const rowDiscCart = (id, _num) => (dispatch) => {
  dispatch({ type: rowDiscVar, payload: id, num: _num });
};
export const discountVar = "Discount";
export const discountCart = (val) => (dispatch) => {
  dispatch({ type: discountVar, payload: val });
};
export const rowPriceVar = "RowPrice";
export const rowPriceCart = (id, _num) => (dispatch) => {
  dispatch({ type: rowPriceVar, payload: id, num: _num });
};
export const netTotalVar = "NetTotal";
export const netTotalCart = (val) => (dispatch) => {
  dispatch({ type: netTotalVar, payload: val });
};
export const paymentModeVar = "PaymentMode";
export const paymentModeCart = (val) => (dispatch) => {
  dispatch({ type: paymentModeVar, payload: val });
};
export const UpdateCartRowVar = "UpdateCartRow";
export const updateCartRow = (id, _unit, _price, _gstPerc, _gst, _discPerc, _disc, _total, _netTotal) => (dispatch) => {
  dispatch({ type: UpdateCartRowVar, payload: id, unit: _unit, price: _price, gstPerc: _gstPerc, gst: _gst, discPerc: _discPerc, disc: _disc, total: _total, netTotal: _netTotal });
};
export const gstVar = "GST";
export const gstCart = (val) => (dispatch) => {
  dispatch({ type: gstVar, payload: val });
};
//Customer
const customerUrl = mainUrl + "Customer";
export const getCustomerVar = "CustomerList";
export const getCustomer = () => async (dispatch) => {
  dispatch({ type: FetchLoader });
  try {
    const response = await axios.get(customerUrl);
    dispatch({ type: getCustomerVar, payload: response.data });
  } catch (error) {
    dispatch({ type: FetchErr, payload: error.message });
  }
};
export const insertCustomerVar = "InsertCustomer";
export const insertCustomer = (x) => async (dispatch) => {
  try {
    const temp = { clientId: x.clientID, branchId: x.branchID, createdBy: x.createdBy, _Name: x.name, email: x.email, contact: x.contact, address: x.address, city: x.city, country: x.country };
    await axios.post(customerUrl, temp).then((e) => {
      dispatch({ type: insertCustomerVar, payload: e.data });
    });
  } catch (error) {
    dispatch({ type: FetchErr, payload: error.message });
  }
};
export const getCustomerByIdVar = "CustomerById";
export const getCustomerById = (id) => async (dispatch) => {
  try {
    const response = await axios.get(`${customerUrl}/${id}`);
    dispatch({ type: getCustomerByIdVar, payload: response.data });
  } catch (error) {
    dispatch({ type: FetchErr, payload: error.message });
  }
};
export const updateCustomerVar = "UpdateCustomer";
export const updateCustomer = (id, x) => async (dispatch) => {
  try {
    const temp = { _Name: x.name, email: x.email, contact: x.contact, address: x.address, city: x.city, country: x.country };
    const response = await axios.put(customerUrl + `/${id}`, temp);
    dispatch({ type: updateCustomerVar, payload: response.data });
  } catch (error) {
    dispatch({ type: FetchErr, payload: error.message });
  }
};
export const deleteCustomerVar = "DeleteCustomer";
export const deleteCustomer = (id) => async (dispatch) => {
  try {
    await axios.delete(customerUrl + `/${id}`).then(() => {
      dispatch({ type: deleteCustomerVar, payload: id });
    });
  } catch (error) {
    dispatch({ type: FetchErr, payload: error.message });
  }
};
//Supplier
const supplierUrl = mainUrl + "Supplier";
export const getSupplierVar = "SupplierList";
export const getSupplier = () => async (dispatch) => {
  dispatch({ type: FetchLoader });
  try {
    const response = await axios.get(supplierUrl);
    dispatch({ type: getSupplierVar, payload: response.data });
  } catch (error) {
    dispatch({ type: FetchErr, payload: error.message });
  }
};
export const insertSupplierVar = "InsertSupplier";
export const insertSupplier = (x) => async (dispatch) => {
  try {
    const temp = { clientId: x.clientID, branchId: x.branchID, createdBy: x.createdBy, _Name: x.name, email: x.email, contact: x.contact, address: x.address, city: x.city, country: x.country };
    await axios.post(supplierUrl, temp).then((e) => {
      dispatch({ type: insertSupplierVar, payload: e.data });
    });
  } catch (error) {
    dispatch({ type: FetchErr, payload: error.message });
  }
};
export const getSupplierByIdVar = "SupplierById";
export const getSupplierById = (id) => async (dispatch) => {
  try {
    const response = await axios.get(`${supplierUrl}/${id}`);
    dispatch({ type: getSupplierByIdVar, payload: response.data });
  } catch (error) {
    dispatch({ type: FetchErr, payload: error.message });
  }
};
export const updateSupplierVar = "UpdateSupplier";
export const updateSupplier = (id, x) => async (dispatch) => {
  try {
    const temp = { _Name: x.name, email: x.email, contact: x.contact, address: x.address, city: x.city, country: x.country };
    const response = await axios.put(supplierUrl + `/${id}`, temp);
    dispatch({ type: updateSupplierVar, payload: response.data });
  } catch (error) {
    dispatch({ type: FetchErr, payload: error.message });
  }
};
export const deleteSupplierVar = "DeleteSupplier";
export const deleteSupplier = (id) => async (dispatch) => {
  try {
    await axios.delete(supplierUrl + `/${id}`).then(() => {
      dispatch({ type: deleteSupplierVar, payload: id });
    });
  } catch (error) {
    dispatch({ type: FetchErr, payload: error.message });
  }
};
//SaleInvoice
const saleInvUrl = mainUrl + "SaleInv";
export const getSaleInvVar = "SaleInvList";
export const getSaleInv = () => async (dispatch) => {
  dispatch({ type: FetchLoader });
  try {
    const response = await axios.get(saleInvUrl);
    dispatch({ type: getSaleInvVar, payload: response.data });
  } catch (error) {
    dispatch({ type: FetchErr, payload: error.message });
  }
};
export const insertSaleInvVar = "InsertSaleInv";
export const insertSaleInv = (x) => async (dispatch) => {
  try {
    const temp = {
      clientId: x.clientId,
      branchId: x.branchId,
      customerId: x.customerId,
      paymentMode: x.paymentMode,
      createdBy: x.createdBy,
      total: x.total,
      netTotal: x.netTotal,
      item: x.item,
      gstPerc: x.gstPerc,
      gst: x.gst,
      discount: x.disc,
      discPerc: x.discPerc,
      isHold: x.isHold,
    };
    await axios.post(saleInvUrl, temp).then((e) => {
      dispatch({ type: insertSaleInvVar, payload: e.data });
    });
  } catch (error) {
    console.log(error.message);
  }
};
export const updateSaleInvVar = "UpdateSaleInv";
export const updateSaleInv = (id, x) => async (dispatch) => {
  await axios.put(saleInvUrl + `/${id}`, { BranchId: x.BranchId, CardNo: x.CardNo, ClientId: x.ClientId, CustomerId: x.CustomerId, CustomerName: x.CustomerName, Discount: x.Disc, DiscPerc: x.DiscPerc, Gst: x.Gst, GstPerc: x.GstPerc, Item: x.Item, NetTotal: x.NetTotal, PaymentMode: x.PaymentMode, Total: x.Total }).then((e) => {
    dispatch({ type: updateSaleInvVar, payload: e.data });
  });
};
export const deleteSaleInvVar = "DeleteSaleInv";
export const deleteSaleInv = (id) => async (dispatch) => {
  try {
    await axios.delete(saleInvUrl + `/${id}`).then(() => {
      dispatch({ type: deleteSaleInvVar, payload: id });
    });
  } catch (error) {
    dispatch({ type: FetchErr, payload: error.message });
  }
};
//Sale
const saleUrl = mainUrl + "Sale";
export const getSaleVar = "SaleList";
export const getSale = () => async (dispatch) => {
  dispatch({ type: FetchLoader });
  try {
    const response = await axios.get(saleUrl);
    dispatch({ type: getSaleVar, payload: response.data });
  } catch (error) {
    dispatch({ type: FetchErr, payload: error.message });
  }
};
export const getSaleByIDVar = "SaleListByID";
export const getSaleByID = (id) => async (dispatch) => {
  try {
    const response = await axios.get(`${saleUrl}/GetSaleByRid/${id}`);
    dispatch({ type: getSaleByIDVar, payload: response.data });
  } catch (error) {
    dispatch({ type: FetchErr, payload: error.message });
  }
};
export const insertSaleVar = "InsertSale";
export const insertSale = (x) => async (dispatch) => {
  try {
    await axios.post(saleUrl, x).then((res) => {
      dispatch({ type: insertSaleVar, payload: res.data });
    });
  } catch (error) {
    dispatch({ type: FetchErr, payload: error.message });
  }
};
//PurchaseInvoice
const purchaseInvUrl = mainUrl + "PurchaseInv";
export const getPurchaseInvVar = "PurchaseInvList";
export const getPurchaseInv = () => async (dispatch) => {
  dispatch({ type: FetchLoader });
  try {
    const response = await axios.get(purchaseInvUrl);
    dispatch({ type: getPurchaseInvVar, payload: response.data });
  } catch (error) {
    dispatch({ type: FetchErr, payload: error.message });
  }
};
export const getPurchaseInvByIdVar = "PurchaseInvById";
export const getPurchaseInvById = (id) => async (dispatch) => {
  try {
    const response = await axios.get(`${purchaseInvUrl}/${id}`);
    dispatch({ type: getPurchaseInvByIdVar, payload: response.data });
  } catch (error) {
    dispatch({ type: FetchErr, payload: error.message });
  }
};
export const insertPurchaseInvVar = "InsertPurchaseInv";
export const insertPurchaseInv = (temp) => async (dispatch) => {
  dispatch({ type: insertPurchaseInvVar, payload: temp });
  // try {
  //   await axios.post(purchaseInvUrl, temp).then((res) => {
  //     dispatch({ type: insertPurchaseInvVar, payload: res.data.message });
  //   });
  // } catch (error) {
  //   dispatch({ type: FetchErr, payload: error.message });
  // }
};
export const updatePurchaseInvVar = "UpdatePurchaseInv";
export const updatePurchaseInv = (id, x) => async (dispatch) => {
  await axios.put(purchaseInvUrl + `/${id}`, { ClientId: x.ClientId, BranchId: x.BranchId, SupplierId: x._supplierId, SupplierName: x._supplierName, PaymentMode: x._paymentMode, PaymentStatus: x._paymentStatus, Des: x._des, Item: x._item, Total: x._total, Disc: x._dis, Gst: x._gst, NetTotal: x._netTotal, Paid: x._paid, Due: x._due }).then((e) => {
    dispatch({ type: updatePurchaseInvVar, payload: e.data });
  });
};
export const deletePurchaseInvVar = "DeletePurchaseInv";
export const deletePurchaseInv = (id) => async (dispatch) => {
  try {
    await axios.delete(purchaseInvUrl + `/${id}`).then(() => {
      dispatch({ type: deletePurchaseInvVar, payload: id });
    });
  } catch (error) {
    dispatch({ type: FetchErr, payload: error.message });
  }
};
//InvID
export const updateInvIDVar = "UpdateInvID";
export const updateInvID = (num) => async (dispatch) => {
  try {
    dispatch({ type: updateInvIDVar, payload: num });
  } catch (error) {
    dispatch({ type: FetchErr, payload: error.message });
  }
};
//Purchase
const purchaseUrl = mainUrl + "Purchase";
export const getPurchaseVar = "PurchaseList";
export const getPurchase = () => async (dispatch) => {
  dispatch({ type: FetchLoader });
  try {
    const response = await axios.get(purchaseUrl);
    dispatch({ type: getPurchaseVar, payload: response.data });
  } catch (error) {
    dispatch({ type: FetchErr, payload: error.message });
  }
};
export const getPurchaseByIDVar = "PurchaseListByID";
export const getPurchaseByID = (id) => async (dispatch) => {
  try {
    const response = await axios.get(`${purchaseUrl}/GetPurchaseByRid/${id}`);
    dispatch({ type: getPurchaseByIDVar, payload: response.data });
  } catch (error) {
    dispatch({ type: FetchErr, payload: error.message });
  }
};
export const insertPurchaseVar = "InsertPurchase";
export const insertPurchase = (temp) => async (dispatch) => {
  try {
    await axios.post(purchaseUrl, temp).then((res) => {
      dispatch({ type: insertPurchaseVar, payload: res.data });
    });
  } catch (error) {
    dispatch({ type: FetchErr, payload: error.message });
  }
};
//Transaction
const transactionUrl = mainUrl + "Transactions";
export const getTransactionVar = "TransactionList";
export const getTransaction = () => async (dispatch) => {
  dispatch({ type: FetchLoader });
  try {
    const response = await axios.get(transactionUrl);
    dispatch({ type: getTransactionVar, payload: response.data });
  } catch (error) {
    dispatch({ type: FetchErr, payload: error.message });
  }
};
export const getTransactionIDVar = "TransactionID";
export const getTransactionID = () => async (dispatch) => {
  dispatch({ type: FetchLoader });
  try {
    const response = await axios.get(transactionUrl + "/GetTransactionID");
    dispatch({ type: getTransactionIDVar, payload: response.data.message });
  } catch (error) {
    dispatch({ type: FetchErr, payload: error.message });
  }
};
export const insertTransactionVar = "InsertTransaction";
export const insertTransaction = (x) => async (dispatch) => {
  try {
    await axios.post(transactionUrl, { clientId: x._clientId, branchId: x._branchId, rid: x._rid, userId: x._userId, userName: x._userName, paymentType: x._paymentType, desc: x._desc, account: x._account, total: x._total, createdBy: x.createdBy }).then((res) => {
      dispatch({ type: insertTransactionVar, payload: res.data });
    });
  } catch (error) {
    dispatch({ type: FetchErr, payload: error.message });
  }
};
export const getTransactionByRIDVar = "TransactionByRID";
export const getTransactionByRID = (id, acc) => async (dispatch) => {
  try {
    const response = await axios.get(`${transactionUrl}/GetTransactionByRID/${id}/${acc}`);
    dispatch({ type: getTransactionByRIDVar, payload: response.data });
  } catch (error) {
    dispatch({ type: FetchErr, payload: error.message });
  }
};
//Client
const clientUrl = mainUrl + "Client";
export const getClientVar = "ClientList";
export const getClient = () => async (dispatch) => {
  dispatch({ type: FetchLoader });
  try {
    const response = await axios.get(clientUrl);
    dispatch({ type: getClientVar, payload: response.data });
  } catch (error) {
    dispatch({ type: FetchErr, payload: error.message });
  }
};
export const getClientByIdVar = "ClientById";
export const getClientById = (id) => async (dispatch) => {
  try {
    const response = await axios.get(`${clientUrl}/${id}`);
    dispatch({ type: getClientByIdVar, payload: response.data });
  } catch (error) {
    dispatch({ type: FetchErr, payload: error.message });
  }
};
export const insertClientVar = "InsertClient";
export const insertClient = (x) => async (dispatch) => {
  try {
    const temp = { _Name: x.name, email: x.email, contact: x.contact, address: x.address, city: x.city, country: x.country, createdBy: x.createdBy };
    await axios.post(clientUrl, temp).then((e) => {
      dispatch({ type: insertClientVar, payload: e.data });
    });
  } catch (error) {
    dispatch({ type: FetchErr, payload: error.message });
  }
};
export const updateClientVar = "UpdateClient";
export const updateClient = (id, x) => async (dispatch) => {
  try {
    const temp = { _Name: x.name, email: x.email, contact: x.contact, address: x.address, city: x.city, country: x.country, createdBy: 1 };
    const response = await axios.put(clientUrl + `/${id}`, temp);
    dispatch({ type: updateClientVar, payload: response.data });
  } catch (error) {
    dispatch({ type: FetchErr, payload: error.message });
  }
};
export const deleteClientVar = "DeleteClient";
export const deleteClient = (id) => async (dispatch) => {
  try {
    await axios.delete(clientUrl + `/${id}`).then(() => {
      dispatch({ type: deleteClientVar, payload: id });
    });
  } catch (error) {
    dispatch({ type: FetchErr, payload: error.message });
  }
};
//Branch
const branchUrl = mainUrl + "Branch";
export const getBranchVar = "BranchList";
export const getBranch = () => async (dispatch) => {
  dispatch({ type: FetchLoader });
  try {
    const response = await axios.get(branchUrl);
    dispatch({ type: getBranchVar, payload: response.data });
  } catch (error) {
    dispatch({ type: FetchErr, payload: error.message });
  }
};
export const insertBranchVar = "InsertBranch";
export const insertBranch = (x) => async (dispatch) => {
  try {
    const temp = { clientId: x.clientID, _Name: x.name, email: x.email, contact: x.contact, address: x.address, state: x.state, zipCode: x.zipCode, city: x.city, country: x.country, createdBy: x.createdBy };
    await axios.post(branchUrl, temp).then((e) => {
      dispatch({ type: insertBranchVar, payload: e.data });
    });
  } catch (error) {
    dispatch({ type: FetchErr, payload: error.message });
  }
};
export const updateBranchVar = "UpdateBranch";
export const updateBranch = (id, x) => async (dispatch) => {
  try {
    const temp = { _Name: x.name, email: x.email, contact: x.contact, address: x.address, state: x.state, zipCode: x.zipCode, city: x.city, country: x.country, createdBy: 1 };
    const response = await axios.put(branchUrl + `/${id}`, temp);
    dispatch({ type: updateBranchVar, payload: response.data });
  } catch (error) {
    dispatch({ type: FetchErr, payload: error.message });
  }
};
export const getBranchByIdVar = "BranchById";
export const getBranchById = (id) => async (dispatch) => {
  try {
    const response = await axios.get(`${branchUrl}/${id}`);
    dispatch({ type: getBranchByIdVar, payload: response.data });
  } catch (error) {
    dispatch({ type: FetchErr, payload: error.message });
  }
};
export const deleteBranchVar = "DeleteBranch";
export const deleteBranch = (id) => async (dispatch) => {
  try {
    await axios.delete(branchUrl + `/${id}`).then(() => {
      dispatch({ type: deleteBranchVar, payload: id });
    });
  } catch (error) {
    dispatch({ type: FetchErr, payload: error.message });
  }
};
//Users
const usersUrl = mainUrl + "User";
export const getUsersVar = "UsersList";
export const getUsers = () => async (dispatch) => {
  dispatch({ type: FetchLoader });
  try {
    const response = await axios.get(usersUrl);
    dispatch({ type: getUsersVar, payload: response.data });
  } catch (error) {
    dispatch({ type: FetchErr, payload: error.message });
  }
};
export const getUserByIdVar = "UserById";
export const getUserById = (id) => async (dispatch) => {
  try {
    const response = await axios.get(`${usersUrl}/${id}`);
    dispatch({ type: getUserByIdVar, payload: response.data });
  } catch (error) {
    dispatch({ type: FetchErr, payload: error.message });
  }
};
export const insertUsersVar = "InsertUsers";
export const insertUsers = (x, path) => async (dispatch) => {
  try {
    const temp = { clientId: x.clientID, branchId: x.branchId, _Name: x.name, loginId: x.email, contact: x.contact, userRole: x.userRole, passwords: x.password, imageName: path, createdBy: x.createdBy };
    await axios.post(usersUrl, temp).then((e) => {
      dispatch({ type: insertUsersVar, payload: e.data });
    });
  } catch (error) {
    dispatch({ type: FetchErr, payload: error.message });
  }
};
export const updateUsersVar = "UpdateUsers";
export const updateUsers = (id, x, path) => async (dispatch) => {
  try {
    const temp = { _Name: x.name, loginId: x.email, contact: x.contact, userRole: x.userRole, passwords: x.password, imageName: path };
    const response = await axios.put(usersUrl + `/${id}`, temp);
    dispatch({ type: updateUsersVar, payload: response.data });
  } catch (error) {
    dispatch({ type: FetchErr, payload: error.message });
  }
};
export const deleteUsersVar = "DeleteUsers";
export const deleteUsers = (id) => async (dispatch) => {
  try {
    await axios.delete(usersUrl + `/${id}`).then(() => {
      dispatch({ type: deleteUsersVar, payload: id });
    });
  } catch (error) {
    dispatch({ type: FetchErr, payload: error.message });
  }
};
//InvID
export const invIDVar = "InvID";
export const setInvID = (val) => (dispatch) => {
  dispatch({ type: invIDVar, payload: val });
};



