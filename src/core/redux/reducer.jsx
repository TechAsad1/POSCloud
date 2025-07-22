import { FetchLoader, FetchErr, getCategoryVar, updateCategoryVar, insertCategoryVar, deleteCategoryVar, getBrandVar, insertBrandVar, updateBrandVar, deleteBrandVar, getUnitVar, insertUnitVar, updateUnitVar, deleteUnitVar, getProductVar, insertProductVar, updateProductVar, deleteProductVar, addToCartVar, incrementVar, decrementVar, discountVar, netTotalVar, paymentModeVar, gstVar, getCustomerVar, insertCustomerVar, updateCustomerVar, deleteCustomerVar, clearCartVar, removeCartRowVar, getSaleInvVar, insertSaleInvVar, getPurchaseInvVar, insertPurchaseInvVar, getPurchaseVar, insertPurchaseVar, getSupplierVar, insertSupplierVar, updateSupplierVar, deleteSupplierVar, getClientVar, insertClientVar, updateClientVar, deleteClientVar, getBranchVar, insertBranchVar, updateBranchVar, deleteBranchVar, getUsersVar, insertUsersVar, updateUsersVar, deleteUsersVar, invIDVar, rowDiscVar, updateInvIDVar, deletePurchaseInvVar, getTransactionIDVar, insertSaleVar, getSaleVar, getTransactionVar, insertTransactionVar, rowGstVar, updateSaleInvVar, updatePurchaseInvVar, getPurchaseByIDVar, getSupplierByIdVar, getBranchByIdVar, rowPriceVar, getCustomerByIdVar, getSaleByIDVar, deleteSaleInvVar, getProductByIdVar, getUserByIdVar, getPurchaseInvByIdVar, getTransactionByRIDVar, UpdateCartRowVar, getCategoryByIdVar, getClientByIdVar } from "./action";
import initialState from "./initial.value";

const rootReducer = (state = initialState, action) => {
  switch (action.type) {
    //Category
    case getCategoryVar:
      return { ...state, categories: action.payload, error: null, loading: false };
    case getCategoryByIdVar:
      return { ...state, categories: action.payload };
    case insertCategoryVar:
      return { ...state, categories: [...state.categories, action.payload] };
    case updateCategoryVar:
      return {
        ...state,
        categories: state.categories.map((post) =>
          post.categoryId === action.payload.categoryId ? action.payload : post
        ),
      };
    case deleteCategoryVar:
      return {
        ...state,
        categories: state.categories.filter((post) => post.categoryId !== action.payload),
      };
    //Brand
    case getBrandVar:
      return { ...state, brands: action.payload, error: null, loading: false };
    case insertBrandVar:
      return { ...state, brands: [...state.brands, action.payload] };
    case updateBrandVar:
      return {
        ...state,
        brands: state.brands.map((post) =>
          post.brandId === action.payload.brandId ? action.payload : post
        ),
      };
    case deleteBrandVar:
      return {
        ...state,
        brands: state.brands.filter((post) => post.brandId !== action.payload),
      };
    //Unit
    case getUnitVar:
      return { ...state, units: action.payload, error: null, loading: false };
    case insertUnitVar:
      return { ...state, units: [...state.units, action.payload] };
    case updateUnitVar:
      return {
        ...state,
        units: state.units.map((post) =>
          post.uom === action.payload.uom ? action.payload : post
        ),
      };
    case deleteUnitVar:
      return {
        ...state,
        units: state.units.filter((post) => post.uom !== action.payload),
      };
    //Product
    case getProductVar:
      return { ...state, posts: action.payload, error: null, loading: false };
    case insertProductVar:
      return { ...state, posts: [...state.posts, action.payload] };
    case getProductByIdVar:
      return { ...state, singleProduct: action.payload };
    case updateProductVar:
      return {
        ...state,
        posts: state.posts.map((post) =>
          post.productId === action.payload.productId ? action.payload : post
        ),
      };
    case deleteProductVar:
      return {
        ...state,
        posts: state.posts.filter((post) => post.productId !== action.payload),
      };
    //Cart
    case addToCartVar:
      if (state.cart.find((x) => x.id === action.payload.id)) {
        return {
          ...state,
          cart: calculate("plus", state, action.payload.id, 0)
        };
      } else {
        return {
          ...state,
          cart: [...state.cart, { ...action.payload }],
        };
      }
    case removeCartRowVar:
      return {
        ...state,
        cart: state.cart.filter((post) => post.id !== action.payload),
      };
    case clearCartVar:
      return {
        ...state,
        cart: state.cart.filter(() => false),
      };
    case incrementVar:
      return {
        ...state,
        cart: calculate("plus", state, action.payload, 0)
      };
    case decrementVar:
      return {
        ...state,
        cart: calculate("minus", state, action.payload, 0)
      };
    case rowGstVar:
      return {
        ...state,
        cart: calculate("gst", state, action.payload, action.num)
      };
    case rowDiscVar:
      return {
        ...state,
        cart: calculate("discount", state, action.payload, action.num)
      };
    case UpdateCartRowVar:
      return {
        ...state,
        cart: state.cart.map((x) => x.id === action.payload ? { ...x, selectedUnit: action.unit, price: action.price, gstPerc: action.gstPerc, gst: action.gst, discPerc: action.discPerc, disc: action.disc, total: action.total, netTotal: action.netTotal } : x),
      };
    case discountVar:
      return { ...state, discount: action.payload };
    case rowPriceVar:
      return {
        ...state,
        cart: state.cart.map((x) => x.id === action.payload ? { ...x, price: action.num, } : x),
      };
    case netTotalVar:
      return { ...state, netTotal: action.payload };
    case paymentModeVar:
      return { ...state, paymentMode: action.payload };
    case gstVar:
      return { ...state, gst: action.payload };
    //Customer
    case getCustomerVar:
      return { ...state, customers: action.payload, error: null, loading: false };
    case getCustomerByIdVar:
      return { ...state, singleCustomer: action.payload };
    case insertCustomerVar:
      return { ...state, customers: [...state.customers, action.payload] };
    case updateCustomerVar:
      return {
        ...state,
        customers: state.customers.map((post) =>
          post.customerId === action.payload.customerId ? action.payload : post
        ),
      };
    case deleteCustomerVar:
      return {
        ...state,
        customers: state.customers.filter((post) => post.customerId !== action.payload),
      };
    //Supplier
    case getSupplierVar:
      return { ...state, suppliers: action.payload, error: null, loading: false };
    case getSupplierByIdVar:
      return { ...state, singleSupplier: action.payload };
    case insertSupplierVar:
      return { ...state, suppliers: [...state.suppliers, action.payload] };
    case updateSupplierVar:
      return {
        ...state,
        suppliers: state.suppliers.map((post) =>
          post.distributorId === action.payload.distributorId ? action.payload : post
        ),
      };
    case deleteSupplierVar:
      return {
        ...state,
        suppliers: state.suppliers.filter((post) => post.distributorId !== action.payload),
      };

    //Update InvID
    case updateInvIDVar:
      return { ...state, invID: action.payload };
    //SaleInv
    case getSaleInvVar:
      return { ...state, saleInv: action.payload, error: null, loading: false };
    case insertSaleInvVar:
      return { ...state, invID: action.payload };
    case updateSaleInvVar:
      return { ...state, saleInv: [...state.saleInv, action.payload] };
    case deleteSaleInvVar:
      return {
        ...state,
        saleInv: state.saleInv.filter((post) => post.receiptNo !== action.payload),
      };
    //Sale
    case getSaleVar:
      return { ...state, rows: action.payload, error: null, loading: false };
    case getSaleByIDVar:
      return { ...state, rows: action.payload };
    case insertSaleVar:
      return { ...state, rows: [...state.rows, action.payload] };

    //PurchaseInv
    case getPurchaseInvVar:
      return { ...state, purchaseInv: action.payload, error: null, loading: false };
    case getPurchaseInvByIdVar:
      return { ...state, purchaseInv: action.payload };
    case insertPurchaseInvVar:
      return { ...state, invID: action.payload };
    case deletePurchaseInvVar:
      return {
        ...state,
        purchaseInv: state.purchaseInv.filter((post) => post.purchaseNo !== action.payload),
      };
    case updatePurchaseInvVar:
      return {
        ...state,
        purchaseInv: state.purchaseInv.map((post) =>
          post.invId === action.payload.invId ? action.payload : post
        ),
      };
    //Purchase
    case getPurchaseVar:
      return { ...state, rows: action.payload, error: null, loading: false };
    case getPurchaseByIDVar:
      return { ...state, rows: action.payload };
    case insertPurchaseVar:
      return { ...state, rows: [...state.rows, action.payload] };
    //Transaction
    case getTransactionIDVar:
      return { ...state, trID: action.payload };
    case getTransactionVar:
      return { ...state, trInv: action.payload, error: null, loading: false };
    case insertTransactionVar:
      return { ...state, trInv: [...state.trInv, action.payload] };
    case getTransactionByRIDVar:
      return { ...state, trInv: action.payload };
    //Client
    case getClientVar:
      return { ...state, clients: action.payload, error: null, loading: false };
    case getClientByIdVar:
      return { ...state, clients: action.payload };
    case insertClientVar:
      return { ...state, clients: [...state.clients, action.payload] };
    case updateClientVar:
      return {
        ...state,
        clients: state.clients.map((post) =>
          post.clientId === action.payload.clientId ? action.payload : post
        ),
      };
    case deleteClientVar:
      return {
        ...state,
        clients: state.clients.filter((post) => post.clientId !== action.payload),
      };
    //Branch
    case getBranchVar:
      return { ...state, branches: action.payload, error: null, loading: false };
    case getBranchByIdVar:
      return { ...state, branches: action.payload };
    case insertBranchVar:
      return { ...state, branches: [...state.branches, action.payload] };
    case updateBranchVar:
      return {
        ...state,
        branches: state.branches.map((post) =>
          post.branchId === action.payload.branchId ? action.payload : post
        ),
      };
    case deleteBranchVar:
      return {
        ...state,
        branches: state.branches.filter((post) => post.branchId !== action.payload),
      };
    //Users
    case getUsersVar:
      return { ...state, users: action.payload, error: null, loading: false };
    case getUserByIdVar:
      return { ...state, singleUser: action.payload };
    case insertUsersVar:
      return { ...state, users: [...state.users, action.payload] };
    case updateUsersVar:
      return {
        ...state,
        users: state.users.map((post) =>
          post.userId === action.payload.userId ? action.payload : post
        ),
      };
    case deleteUsersVar:
      return {
        ...state,
        users: state.users.filter((post) => post.userId !== action.payload),
      };
    //InvID
    case invIDVar:
      return { ...state, invID: action.payload };




    case FetchErr:
      return { ...state, error: action.payload };
    case FetchLoader:
      return { ...state, loading: true, error: null };
    case "Product_list":
      return { ...state, product_list: action.payload };
    case "Dashbaord_RecentProduct":
      return { ...state, dashboard_recentproduct: action.payload };
    case "Dashbaord_ExpiredProduct":
      return { ...state, dashboard_expiredproduct: action.payload };
    case "Salesdashbaord_ExpiredProduct":
      return { ...state, saleshdashboard_recenttransaction: action.payload };
    case "Brand_list":
      return { ...state, brand_list: action.payload };

    case "Unit_Data":
      return { ...state, unit_data: action.payload };
    case "Variantattribute_Data":
      return { ...state, variantattributes_data: action.payload };
    case "Warranty_Data":
      return { ...state, warranty_data: action.payload };
    case "Barcode_Data":
      return { ...state, barcode_data: action.payload };
    case "Department_Data":
      return { ...state, departmentlist_data: action.payload };
    case "Designation_Data":
      return { ...state, designation_data: action.payload };
    case "Shiftlist_Data":
      return { ...state, shiftlist_data: action.payload };
    case "Attendenceemployee_Data":
      return { ...state, attendenceemployee_data: action.payload };
    case "toggle_header":
      return { ...state, toggle_header: action.payload };
    case "Invoicereport_Data":
      return { ...state, invoicereport_data: action.payload };
    case "Salesreturns_Data":
      return { ...state, salesreturns_data: action.payload };
    case "Quatation_Data":
      return { ...state, quotationlist_data: action.payload };
    case "customer_data":
      return { ...state, customerdata: action.payload };
    case "Userlist_data":
      return { ...state, userlist_data: action.payload };
    case "Rolesandpermission_data":
      return { ...state, rolesandpermission_data: action.payload };
    case "Deleteaccount_data":
      return { ...state, deleteaccount_data: action.payload };
    case "Attendenceadmin_data":
      return { ...state, attendanceadmin_data: action.payload };
    case "Leavesadmin_data":
      return { ...state, leavesadmin_data: action.payload };
    case "Leavestype_data":
      return { ...state, leavetypes_data: action.payload };
    case "Holiday_data":
      return { ...state, holiday_data: action.payload };
    case "Expiredproduct_data":
      return { ...state, expiredproduct_data: action.payload };
    case "Lowstock_data":
      return { ...state, lowstock_data: action.payload };
    case "Categotylist_data":
      return { ...state, categotylist_data: action.payload };
    case "Layoutstyle_data":
      return { ...state, layoutstyledata: action.payload };
    default:
      return state;
  }
};

const getTotal = (qty, price) => { return qty * price; }
const getNetTotal = (total, discPerc, gstPerc) => { return ((total - getDiscAmount(discPerc, total)) + getGstAmount(gstPerc, total)); }
const getGstAmount = (gstPerc, total) => { return gstPerc * total / 100; }
const getDiscAmount = (discPerc, total) => { return discPerc * total / 100; }
const getCostPrice = (qty, netTotal) => { return netTotal / qty; }

const calculate = (task, state, id, num) => {
  const x = state.cart.filter((x) => x.id === id);
  let qty = x[0].qty;
  let gstPerc = x[0].gstPerc;
  let discPerc = x[0].discPerc;
  let price = x[0].price;
  if (task === "plus") {
    qty = qty + 1;
  }
  else if (task === "minus") {
    if (qty > 1) {
      qty = qty - 1;
    }
  }
  else if (task === "gst") {
    gstPerc = num;
  }
  else if (task === "price") {
    price = num;
  }
  else {
    discPerc = num;
  }
  let _total = getTotal(qty, price);
  let _netTotal = getNetTotal(_total, discPerc, gstPerc);
  let _costPrice = getCostPrice(qty, _netTotal);
  const _disc = getDiscAmount(discPerc, _total);
  const _gst = getGstAmount(gstPerc, _total);
  return state.cart.map((x) => x.id === id ? { ...x, qty: qty, total: _total, price: price, discPerc: discPerc, gstPerc: gstPerc, disc: _disc, gst: _gst, netTotal: _netTotal, costPrice: _costPrice } : x);
}

export default rootReducer;
