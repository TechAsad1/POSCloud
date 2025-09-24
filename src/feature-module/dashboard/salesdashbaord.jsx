import {
  ArrowRight,
  Calendar,
  ChevronUp,
  RotateCcw,
} from "feather-icons-react/build/IconComponents";
import React, { useEffect, useState } from "react";
import CountUp from "react-countup";
import Chart from "react-apexcharts";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import "bootstrap-daterangepicker/daterangepicker.css";
import ImageWithBasePath from "../../core/img/imagewithbasebath";
import { Link } from "react-router-dom";
import { getProduct, getPurchaseInv, getSale, getSaleInv, getTransaction, setToogleHeader } from "../../core/redux/action";
import { useDispatch, useSelector } from "react-redux";
import { Tooltip } from "react-bootstrap";
import { all_routes } from "../../Router/all_routes";
import DateRangePicker from "react-bootstrap-daterangepicker";
import moment from "moment";
import { dateFormat, formatCurrency, getImageFromUrl } from "../../helper/helpers";
import { useLoginData } from "../../helper/loginUserData";


const SalesDashbaord = () => {
  const route = all_routes;
  //const data = useSelector((state) => state.saleshdashboard_recenttransaction);
  const dispatch = useDispatch();
  const data = useSelector((state) => state.toggle_header);
  const sales = useSelector((state) => state.rows);
  const stock = useSelector((state) => state.posts);
  const saleInv = useSelector((state) => state.saleInv) || [];
  const trInvs = useSelector((state) => state.trInv);
  const purchaseInv = useSelector((state) => state.purchaseInv);
  const loginUser = useLoginData();

  const [dates, setDates] = useState({ start: moment().subtract(8, 'days').startOf('day').toDate(), end: moment() });

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
  const [chartOptions, setChartOptions] = useState({
    series: [
      {
        name: "Sales Analysis",
        data: [],
      },
    ],
    chart: {
      height: 273,
      type: "area",
      zoom: {
        enabled: false,
      },
    },
    colors: ["#FF9F43"],
    dataLabels: {
      enabled: false,
    },
    stroke: {
      curve: "straight",
    },
    title: {
      text: "",
      align: "left",
    },
    xaxis: {
      categories: [],
    },
    // yaxis: {
    //   min: 10,
    //   max: 60,
    //   tickAmount: 5,
    //   labels: {
    //     formatter: (val) => {
    //       return val / 1 + "K";
    //     },
    //   },
    // },
    legend: {
      position: "top",
      horizontalAlign: "left",
    },
  });
  const salesData = trInvs.filter((i) => i.clientId === loginUser?.clientId && i.branchId === loginUser?.branchId && i.account === "Sale" && moment(i.createdDate).isBetween(dates.start, dates.end, undefined, '[]')).map((x) => x.total);
  const month = trInvs.filter((i) => i.clientId === loginUser?.clientId && i.branchId === loginUser?.branchId && i.account === "Sale" && moment(i.createdDate).isBetween(dates.start, dates.end, undefined, '[]')).map((x) =>
    new Intl.DateTimeFormat("en-US", { month: "long" }).format(new Date(x.createdDate))
  );

  const initialSettings = {
    endDate: new Date(),
    ranges: {
      "Last 30 Days": [
        moment().subtract(30, 'days').startOf('day').toDate(),
        moment()
      ],
      "Last 7 Days": [
        moment().subtract(7, 'days').startOf('day').toDate(),
        moment()
      ],
      "Last Month": [
        moment().subtract(1, 'months').startOf('day').toDate(),
        moment()
      ],
      "This Month": [
        moment().startOf('month').toDate(),
        moment().endOf('month').toDate()
      ],
      Today: [
        moment(),
        moment()
      ],
      Yesterday: [
        moment().subtract(1, 'days').startOf('day').toDate(),
        moment().subtract(1, 'days').endOf('day').toDate()
      ],
    },
    startDate: moment().subtract(8, 'days'),
    timePicker: false,
  };

  useEffect(() => {
    dispatch(getSaleInv());
    dispatch(getSale());
    dispatch(getProduct());
    dispatch(getTransaction());
    dispatch(getPurchaseInv());
  }, [dispatch]);

  useEffect(() => {
    // calculateWeeklySales();
    setChartOptions((prevOptions) => ({
      ...prevOptions,
      series: [
        {
          name: "Sales Analysis",
          data: [...salesData],
        },
      ],
      xaxis: {
        categories: [...month],
      },
    }));
    setDataByDate();
  }, [saleInv]);

  useEffect(() => {
    setChartOptions((prevOptions) => ({
      ...prevOptions,
      series: [
        {
          name: "Sales Analysis",
          data: [...salesData],
        },
      ],
      xaxis: {
        categories: [...month],
      },
    }));
  }, [dates, trInvs]);

  const setDataByDate = () => {
    // const bestFive = Object.values(
    //   sales
    //     .filter(x => moment(x.date).isBetween(dates.start, dates.end, undefined, '[]'))
    //     .reduce((acc, cur) => {
    //       if (!acc[cur.productId]) {
    //         acc[cur.productId] = { ...cur };
    //       } else {
    //         acc[cur.productId].qty += cur.qty;
    //       }
    //       return acc;
    //     }, {})
    // )
    //   .sort((a, b) => b.qty - a.qty)
    //   .slice(0, 5);
    // setSaleRows(bestFive);

    // let count = 1;
    // const recentItems = saleInv.sort((a, b) => b.invId - a.invId).slice(0, 5).map((inv) => {
    //   const match = sales.find(e => e.rid === inv.invId);
    //   if (match) {
    //     return {
    //       index: count++,
    //       img: match.img,
    //       name: match.name,
    //       paymentMode: inv.paymentMode,
    //       paymentStatus: inv.paymentStatus,
    //       amount: inv.netTotal,
    //     };
    //   }
    //   return null;
    // }).filter(x => x !== null && moment(x.date).isBetween(dates.start, dates.end, undefined, '[]'));
    // setRecent(recentItems);
  }
  const totalSales = salesData.reduce((sum, i) => sum + i, 0);
  const ids = saleInv.filter(x => x.clientId === loginUser?.clientId && x.branchId === loginUser?.branchId && moment(x.createdDate).isBetween(dates.start, dates.end, undefined, '[]')).map((i) => i.receiptNo);

  const bestFive = Object.values(
    sales
      .filter(x => ids.includes(x.receiptNo))
      .reduce((acc, cur) => {
        if (!acc[cur.productId]) {
          acc[cur.productId] = { ...cur };
        } else {
          acc[cur.productId].qty += cur.qty;
        }
        return acc;
      }, {})
  ).sort((a, b) => b.qty - a.qty).slice(0, 5);

  return (
    <>
      <div className="page-wrapper">
        <div className="content">
          <div className="welcome d-lg-flex align-items-center justify-content-between">
            <div className="d-flex align-items-center welcome-text">
              <h3 className="d-flex align-items-center">
                <ImageWithBasePath src="assets/img/icons/hi.svg" alt="img" />
                &nbsp;Hi {loginUser?.userName},
              </h3>
              &nbsp;
              <h6>here&apos;s what&apos;s happening with your store today.</h6>
            </div>
            <div className="d-flex align-items-center">
              <div className="position-relative daterange-wraper me-2">
                <div className="input-groupicon calender-input">
                  <DateRangePicker initialSettings={initialSettings} onCallback={(_start, _end) => setDates({ ...dates, start: _start, end: _end })}>
                    <input
                      className="form-control col-4 input-range"
                      type="text"
                    />
                  </DateRangePicker>
                </div>
                <Calendar className="feather-14" />
              </div>

              <OverlayTrigger placement="top" overlay={renderRefreshTooltip}>
                <Link data-bs-toggle="tooltip" data-bs-placement="top">
                  <RotateCcw className="feather feather-rotate-ccw feather-16" />
                </Link>
              </OverlayTrigger>

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
            </div>
          </div>
          <div className="row sales-cards">
            <div className="col-xl-6 col-sm-12 col-12">
              <div className="card d-flex align-items-center justify-content-between default-cover mb-4">
                <div>
                  <h6>Weekly Earning</h6>
                  <h3><span className="counters" data-count={totalSales}>{formatCurrency(totalSales)}</span></h3>
                  {/* <p className="sales-range">
                    <span className="text-success">
                      <ChevronUp className="feather-16" />
                      48%&nbsp;
                    </span>
                    increase compare to last week
                  </p> */}
                </div>
                <ImageWithBasePath src="assets/img/icons/weekly-earning.svg" alt="img" />
              </div>
            </div>
            <div className="col-xl-3 col-sm-6 col-12">
              <div className="card color-info bg-primary mb-4">
                <ImageWithBasePath
                  src="assets/img/icons/total-sales.svg"
                  alt="img"
                />
                <h3>
                  {" "}
                  <CountUp end={saleInv.filter((x) => x.clientId === loginUser?.clientId && x.branchId === loginUser?.branchId).length} duration={4}>+</CountUp>
                </h3>
                <p>No# of Total Sales</p>
                <OverlayTrigger placement="top" overlay={renderRefreshTooltip}>
                  <Link data-bs-toggle="tooltip" className="feather-dashboard">
                    <RotateCcw className="feather-16" />
                  </Link>
                </OverlayTrigger>
              </div>
            </div>
            <div className="col-xl-3 col-sm-6 col-12">
              <div className="card color-info bg-secondary mb-4">
                <ImageWithBasePath
                  src="assets/img/icons/purchased-earnings.svg"
                  alt="img"
                />
                <h3>
                  <CountUp end={purchaseInv.filter((x) => x.clientId === loginUser?.clientId && x.branchId === loginUser?.branchId).length} duration={4}>+</CountUp>
                </h3>
                <p>No# of Total Purchase</p>
                <OverlayTrigger placement="top" overlay={renderRefreshTooltip}>
                  <Link data-bs-toggle="tooltip" data-bs-placement="top" className="feather-dashboard">
                    <RotateCcw className="feather-16" />
                  </Link>
                </OverlayTrigger>
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-sm-12 col-md-12 col-xl-4 d-flex">
              <div className="card flex-fill default-cover w-100 mb-4">
                <div className="card-header d-flex justify-content-between align-items-center">
                  <h4 className="card-title mb-0">Best Seller</h4>
                  <div className="dropdown">
                    <Link to="#" className="view-all d-flex align-items-center">
                      View All
                      <span className="ps-2 d-flex align-items-center">
                        <ArrowRight className="feather-16" />
                      </span>
                    </Link>
                  </div>
                </div>
                <div className="card-body">
                  <div className="table-responsive">
                    <table className="table table-borderless best-seller">
                      <tbody>
                        {bestFive && bestFive.map(x => (
                          <tr key={x.autoId}>
                            <td>
                              <div className="product-info">
                                <Link
                                  to={route.productlist}
                                  className="product-img"
                                >
                                  <img
                                    src={getImageFromUrl(stock.find((i) => i.productId === x.productId)?.imageName)}
                                    alt="product"
                                  />
                                </Link>
                                <div className="info">
                                  <Link to={route.productlist}>{stock?.find((i) => i.productId === x.productId)?.productName}</Link>
                                  <p className="dull-text">{formatCurrency(x.productTotal)}</p>
                                </div>
                              </div>
                            </td>
                            <td>
                              <p className="head-text">Sales</p>{x.qty}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-sm-12 col-md-12 col-xl-8 d-flex">
              <div className="card flex-fill default-cover w-100 mb-4">
                <div className="card-header d-flex justify-content-between align-items-center">
                  <h4 className="card-title mb-0">Recent Transactions</h4>
                  <div className="dropdown">
                    <Link to="#" className="view-all d-flex align-items-center">
                      View All
                      <span className="ps-2 d-flex align-items-center">
                        <ArrowRight className="feather-16" />
                      </span>
                    </Link>
                  </div>
                </div>
                <div className="card-body">
                  <div className="table-responsive">
                    <table className="table table-borderless recent-transactions">
                      <thead>
                        <tr>
                          <th>DateTime</th>
                          <th>Total Items</th>
                          <th>PaymentMode</th>
                          <th>Amount</th>
                        </tr>
                      </thead>
                      <tbody>
                        {(() => {
                          return saleInv && saleInv.filter((i) => i.clientId === loginUser?.clientId && i.branchId === loginUser?.branchId && moment(i.createdDate).isBetween(dates.start, dates.end, undefined, '[]')).map((x) => (
                            <tr key={x?.id}>
                              <td>
                                <span className="dull-text d-flex align-items-center">{dateFormat(x?.createdDate)}</span>
                                {/* <div className="product-info"> 
                                  <Link to={route.productlist} className="product-img">
                                    <img src={getImageFromUrl(stock.find((i) => i.productId === x.productId).imageName)} alt="product"/>
                                  </Link>
                                  <div className="info">
                                    <Link to={route.productlist}>{products.find((i) => i.productId === x.productId).productName}</Link>
                                    <span className="dull-text d-flex align-items-center">
                                      <Clock className="feather-14" />
                                      15 Mins
                                    </span>
                                  </div>
                                </div> */}
                              </td>
                              <td>
                                <span className="dull-text d-flex align-items-center">{x?.item}</span>
                              </td>
                              <td>
                                <span className="d-block head-text">{x?.paymentMode}</span>
                                {/* <span className="text-blue">#416645453773</span> */}
                              </td>
                              <td>{formatCurrency(x?.netTotal)}</td>
                            </tr>
                          ));
                        })()}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* Button trigger modal */}
          <div className="row sales-board">
            {/* Chart */}
            <div className="col-md-12 col-lg-7 col-sm-12 col-12">
              <div className="card flex-fill default-cover">
                <div className="card-header d-flex justify-content-between align-items-center">
                  <h5 className="card-title mb-0">Sales Analytics</h5>
                  <div className="graph-sets">
                    <div className="dropdown dropdown-wraper">
                      <button
                        className="btn btn-white btn-sm dropdown-toggle d-flex align-items-center"
                        type="button"
                        id="dropdown-sales"
                        data-bs-toggle="dropdown"
                        aria-expanded="false"
                      >
                        <Calendar className="feather-14" />
                        2023
                      </button>
                      <ul
                        className="dropdown-menu"
                        aria-labelledby="dropdown-sales"
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
                  <div id="sales-analysis" className="chart-set" />
                  <Chart
                    options={chartOptions}
                    series={chartOptions.series}
                    type="area"
                    height={273}
                  />
                </div>
              </div>
            </div>
            <div className="col-md-12 col-lg-5 col-sm-12 col-12">
              {/* World Map */}
              <div className="card default-cover">
                <div className="card-header d-flex justify-content-between align-items-center">
                  <h5 className="card-title mb-0">Sales by Countries</h5>
                  <div className="graph-sets">
                    <div className="dropdown dropdown-wraper">
                      <button
                        className="btn btn-white btn-sm dropdown-toggle d-flex align-items-center"
                        type="button"
                        id="dropdown-country-sales"
                        data-bs-toggle="dropdown"
                        aria-expanded="false"
                      >
                        This Week
                      </button>
                      <ul
                        className="dropdown-menu"
                        aria-labelledby="dropdown-country-sales"
                      >
                        <li>
                          <Link to="#" className="dropdown-item">
                            This Month
                          </Link>
                        </li>
                        <li>
                          <Link to="#" className="dropdown-item">
                            This Year
                          </Link>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
                <div className="card-body">
                  <div id="sales_db_world_map" style={{ height: "265px" }}>
                    <iframe
                      src="https://www.google.com/maps/embed"
                      style={{ border: "0", height: "265px", width: "364px" }}
                      allowFullScreen=""
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                      className="contact-map"
                    />
                  </div>

                  <p className="sales-range">
                    <span className="text-success">
                      <ChevronUp className="feather-16" />
                      48%&nbsp;
                    </span>
                    increase compare to last week
                  </p>
                </div>
              </div>
              {/* /World Map */}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default SalesDashbaord;
