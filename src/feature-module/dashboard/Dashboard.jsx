import React, { useEffect, useState } from "react";
import CountUp from "react-countup";
import {
  File,
  User,
  UserCheck,
} from "feather-icons-react/build/IconComponents";
import Chart from "react-apexcharts";
import { Link } from "react-router-dom";
import ImageWithBasePath from "../../core/img/imagewithbasebath";
import { ArrowRight } from "react-feather";
import { all_routes } from "../../Router/all_routes";
import { useDispatch, useSelector } from "react-redux";
import { getCategory, getCustomer, getProduct, getPurchaseInv, getSale, getSaleInv, getSupplier } from "../../core/redux/action";
import { formatCurrency, getImageFromUrl } from "../../helper/helpers";
import { useLoginData } from "../../helper/loginUserData";

const Dashboard = () => {
  const route = all_routes;
  const dispatch = useDispatch();
  const sales = useSelector((state) => state.rows);
  const purchaseInv = useSelector((state) => state.purchaseInv) || [];
  const saleInv = useSelector((state) => state.saleInv) || [];
  const suppliers = useSelector((state) => state.suppliers);
  const customers = useSelector((state) => state.customers);
  const products = useSelector((state) => state.posts);
  const categoryStore = useSelector((state) => state.categories);
  const loginUser = useLoginData();

  useEffect(() => {
    dispatch(getPurchaseInv());
    dispatch(getSaleInv());
    dispatch(getCustomer());
    dispatch(getSupplier());
    dispatch(getProduct());
    dispatch(getSale());
    dispatch(getCategory());
  }, [dispatch]);
  const month = saleInv.map((x) =>
    new Intl.DateTimeFormat("en-US", { month: "long" }).format(new Date(x.createdDate))
  );
  const salesData = saleInv.filter((i) => i.clientId === loginUser?.clientId && i.branchId === loginUser?.branchId).map((x) => x.netTotal);
  const purchaseData = purchaseInv.filter((i) => i.clientId === loginUser?.clientId && i.branchId === loginUser?.branchId).map((x) => -(x.netTotal));

  const [chartOptions, setChartOptions] = useState({
    series: [
      {
        name: "Sales",
        data: [],
      },
      {
        name: "Purchase",
        data: [],
      },
    ],
    colors: ["#28C76F", "#EA5455"],
    chart: {
      type: "bar",
      height: 320,
      stacked: true,
      zoom: {
        enabled: true,
      },
    },
    responsive: [
      {
        breakpoint: 280,
        options: {
          legend: {
            position: "bottom",
            offsetY: 0,
          },
        },
      },
    ],
    plotOptions: {
      bar: {
        horizontal: false,
        borderRadius: 4,
        borderRadiusApplication: "end", // "around" / "end"
        borderRadiusWhenStacked: "all", // "all"/"last"
        columnWidth: "20%",
      },
    },
    dataLabels: {
      enabled: false,
    },
    // yaxis: {
    //   min: -200,
    //   max: 300,
    //   tickAmount: 5,
    // },
    xaxis: {
      categories: [],
    },
    legend: { show: false },
    fill: {
      opacity: 1,
    },
  });
  useEffect(() => {
    if (saleInv.length > 0) {
      setChartOptions((prevOptions) => ({
        ...prevOptions,
        series: [
          {
            name: "Sales",
            data: [...salesData],
          },
          {
            name: "Purchase",
            data: [...purchaseData],
          },
        ],
        xaxis: {
          categories: [...month],
        },
      }));
    }
  }, [saleInv, purchaseInv]);
  const recentProducts = [...products]
    .filter((i) => i.clientId === loginUser?.clientId && i.branchId === loginUser?.branchId)
    .sort((a, b) => new Date(b.createdDate) - new Date(a.createdDate))
    .slice(0, 5);
  const topSellingProducts = [...sales]
    .filter((i) => i.clientId === loginUser?.clientId && i.branchId === loginUser?.branchId)
    .sort((a, b) => b.qty - a.qty)
    .slice(0, 5);

  return (
    <div>
      {/* {loading ? <Loader setLoading={setLoading} /> : ""} */}
      <div className="page-wrapper">
        <div className="content">
          <div className="row">
            <div className="col-xl-3 col-sm-6 col-12 d-flex">
              <div className="dash-widget w-100">
                <div className="dash-widgetimg">
                  <span>
                    <ImageWithBasePath
                      src="assets/img/icons/dash1.svg"
                      alt="img"
                    />
                  </span>
                </div>
                <div className="dash-widgetcontent">
                  <h5>
                    <CountUp start={0} end={purchaseInv.filter((i) => i.clientId === loginUser?.clientId && i.branchId === loginUser?.branchId).reduce((sum, i) => sum + i.due, 0)} duration={3} prefix="Rs" />
                  </h5>
                  <h6>Total Purchase Due</h6>
                </div>
              </div>
            </div>
            <div className="col-xl-3 col-sm-6 col-12 d-flex">
              <div className="dash-widget dash1 w-100">
                <div className="dash-widgetimg">
                  <span>
                    <ImageWithBasePath
                      src="assets/img/icons/dash2.svg"
                      alt="img"
                    />
                  </span>
                </div>
                <div className="dash-widgetcontent">
                  <h5>
                    <CountUp
                      start={0}
                      end={saleInv.filter((i) => i.clientId === loginUser?.clientId && i.branchId === loginUser?.branchId).reduce((sum, i) => sum + i.due, 0)}
                      duration={3}
                      prefix="Rs"
                    />
                  </h5>
                  <h6>Total Sales Due</h6>
                </div>
              </div>
            </div>
            <div className="col-xl-3 col-sm-6 col-12 d-flex">
              <div className="dash-widget dash2 w-100">
                <div className="dash-widgetimg">
                  <span>
                    <ImageWithBasePath
                      src="assets/img/icons/dash3.svg"
                      alt="img"
                    />
                  </span>
                </div>
                <div className="dash-widgetcontent">
                  <h5>
                    <CountUp
                      start={0}
                      end={saleInv.filter((i) => i.clientId === loginUser?.clientId && i.branchId === loginUser?.branchId).reduce((sum, i) => sum + i.netTotal, 0)}
                      duration={3} // Duration in seconds
                      decimals={1}
                      prefix="Rs"
                    />
                  </h5>
                  <h6>Total Sale Amount</h6>
                </div>
              </div>
            </div>
            <div className="col-xl-3 col-sm-6 col-12 d-flex">
              <div className="dash-widget dash3 w-100">
                <div className="dash-widgetimg">
                  <span>
                    <ImageWithBasePath
                      src="assets/img/icons/dash4.svg"
                      alt="img"
                    />
                  </span>
                </div>
                <div className="dash-widgetcontent">
                  <h5>
                    <CountUp
                      start={0}
                      end={0}
                      duration={3} // Duration in seconds
                      prefix="Rs"
                    />
                  </h5>
                  <h6>Total Expense Amount</h6>
                </div>
              </div>
            </div>
            <div className="col-xl-3 col-sm-6 col-12 d-flex">
              <div className="dash-count">
                <div className="dash-counts">
                  <h4>{customers.filter((i) => i.clientId === loginUser?.clientId && i.branchId === loginUser?.branchId).length}</h4>
                  <h5>Customers</h5>
                </div>
                <div className="dash-imgs">
                  <User />
                </div>
              </div>
            </div>
            <div className="col-xl-3 col-sm-6 col-12 d-flex">
              <div className="dash-count das1">
                <div className="dash-counts">
                  <h4>{suppliers.filter((i) => i.clientId === loginUser?.clientId && i.branchId === loginUser?.branchId).length}</h4>
                  <h5>Suppliers</h5>
                </div>
                <div className="dash-imgs">
                  <UserCheck />
                </div>
              </div>
            </div>
            <div className="col-xl-3 col-sm-6 col-12 d-flex">
              <div className="dash-count das2">
                <div className="dash-counts">
                  <h4>{purchaseInv.filter((i) => i.clientId === loginUser?.clientId && i.branchId === loginUser?.branchId).length}</h4>
                  <h5>Purchase Invoice</h5>
                </div>
                <div className="dash-imgs">
                  <ImageWithBasePath
                    src="assets/img/icons/file-text-icon-01.svg"
                    className="img-fluid"
                    alt="icon"
                  />
                </div>
              </div>
            </div>
            <div className="col-xl-3 col-sm-6 col-12 d-flex">
              <div className="dash-count das3">
                <div className="dash-counts">
                  <h4>{saleInv.filter((i) => i.clientId === loginUser?.clientId && i.branchId === loginUser?.branchId).length}</h4>
                  <h5>Sales Invoice</h5>
                </div>
                <div className="dash-imgs">
                  <File />
                </div>
              </div>
            </div>
          </div>
          {/* Button trigger modal */}

          <div className="row">
            <div className="col-xl-7 col-sm-12 col-12 d-flex">
              <div className="card flex-fill">
                <div className="card-header d-flex justify-content-between align-items-center">
                  <h5 className="card-title mb-0">Purchase &amp; Sales</h5>
                  <div className="graph-sets">
                    <ul className="mb-0">
                      <li>
                        <span>Sales</span>
                      </li>
                      <li>
                        <span>Purchase</span>
                      </li>
                    </ul>
                    <div className="dropdown dropdown-wraper">
                      <button
                        className="btn btn-light btn-sm dropdown-toggle"
                        type="button"
                        id="dropdownMenuButton"
                        data-bs-toggle="dropdown"
                        aria-expanded="false"
                      >
                        2023
                      </button>
                      <ul
                        className="dropdown-menu"
                        aria-labelledby="dropdownMenuButton"
                      >
                        <li>
                          <Link to="#" className="dropdown-item">
                            2023
                          </Link>
                        </li>
                        <li>
                          <Link to="#" className="dropdown-item">
                            2022
                          </Link>
                        </li>
                        <li>
                          <Link to="#" className="dropdown-item">
                            2021
                          </Link>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
                <div className="card-body">
                  <div id="sales_charts" />
                  <Chart
                    options={chartOptions}
                    series={chartOptions.series}
                    type="bar"
                    height={320}
                  />
                </div>
              </div>
            </div>
            <div className="col-xl-5 col-sm-12 col-12 d-flex">
              <div className="card flex-fill default-cover mb-4">
                <div className="card-header d-flex justify-content-between align-items-center">
                  <h4 className="card-title mb-0">Recent Products</h4>
                  <div className="view-all-link">
                    <Link to="#" className="view-all d-flex align-items-center">
                      View All
                      <span className="ps-2 d-flex align-items-center">
                        <ArrowRight className="feather-16" />
                      </span>
                    </Link>
                  </div>
                </div>
                <div className="card-body">
                  <div className="table-responsive dataview">
                    <table className="table dashboard-recent-products">
                      <thead>
                        <tr>
                          <th>#</th>
                          <th>Products</th>
                          <th>Price</th>
                        </tr>
                      </thead>
                      <tbody>
                        {recentProducts && recentProducts.map((x) => (
                          <tr key={x.productId}>
                            <td>1</td>
                            <td className="productimgname">
                              <Link
                                to={route.productlist}
                                className="product-img"
                              >
                                <img
                                  src={getImageFromUrl(x.imageName)}
                                  alt="product"
                                />
                              </Link>
                              <Link to={route.productlist}>{x.productName}</Link>
                            </td>
                            <td>{formatCurrency(x.salePrice)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="card">
            <div className="card-header">
              <h4 className="card-title">Best Selling Products</h4>
            </div>
            <div className="card-body">
              <div className="table-responsive dataview">
                <table className="table dashboard-expired-products">
                  <thead>
                    <tr>
                      {/* <th className="no-sort">
                        <label className="checkboxs">
                          <input type="checkbox" id="select-all" />
                          <span className="checkmarks" />
                        </label>
                      </th> */}
                      <th>Product</th>
                      <th>Category</th>
                      <th>Unit</th>
                      <th>Total Qty</th>
                      <th>Price</th>
                      {/* <th className="no-sort">Action</th> */}
                    </tr>
                  </thead>
                  <tbody>
                    {topSellingProducts && topSellingProducts.map((x) => (
                      <tr key={x.autoId}>
                        {/* <td>
                          <label className="checkboxs">
                            <input type="checkbox" />
                            <span className="checkmarks" />
                          </label>
                        </td> */}
                        <td>
                          <div className="productimgname">
                            <Link to="#" className="product-img stock-img">
                              <img
                                src={getImageFromUrl(products.find((i) => i.productId === x.productId)?.imageName)}
                                alt="product"
                              />
                            </Link>
                            <Link to="#">{products.find((i) => i.productId === x.productId)?.productName}</Link>
                          </div>
                        </td>
                        <td>
                          <Link to="#">
                            {(() => {
                              const product = products.find((i) => i.productId === x.productId);
                              const categoryId = product?.categoryId;
                              const category = categoryStore.find((i) => i.categoryId === categoryId);
                              return category?.categoryName || "N/A";
                            })()}
                          </Link>
                        </td>
                        <td>{x.uom}</td>
                        <td>{sales.filter((i) => i.productId === x.productId).reduce((sum, x) => sum + x.qty, 0)}</td>
                        <td>{formatCurrency(x?.salePrice)}</td>
                        {/* <td className="action-table-data">
                        <div className="edit-delete-action">
                          <Link className="me-2 p-2" to="#">
                            <i data-feather="edit" className="feather-edit" />
                          </Link>
                          <Link
                            className=" confirm-text p-2"
                            to="#"
                            onClick={showConfirmationAlert}
                          >
                            <i
                              data-feather="trash-2"
                              className="feather-trash-2"
                            />
                          </Link>
                        </div>
                      </td> */}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
