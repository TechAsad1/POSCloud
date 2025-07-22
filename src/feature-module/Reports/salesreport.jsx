import React, { useEffect, useState } from "react";
import Breadcrumbs from "../../core/breadcrumbs";
import ImageWithBasePath from "../../core/img/imagewithbasebath";
import { Link } from "react-router-dom";
import { Filter, Sliders, Box, Zap } from "react-feather";
import Select from "react-select";
// import { salesreportdata } from "../../core/json/salesreportdata";
import Table from "../../core/pagination/datatable";
import { useDispatch, useSelector } from "react-redux";
import { getCategory, getProduct, getSale } from "../../core/redux/action";
import { formatCurrency, getImageFromUrl } from "../../helper/helpers";


const SalesReport = () => {
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
      title: "Product Name",
      dataIndex: "productId",
      render: (text) => (
        <span className="productimgname">
          <Link to="#" className="product-img stock-img">
            <img alt="" src={getImageFromUrl(stock.find((i) => i.productId === text)?.imageName)} />
          </Link>
          <Link to="#">{stock.find((i) => i.productId === text)?.productName}</Link>
        </span>
      ),
      sorter: (a, b) => a.productId.length - b.productId.length,
    },
    {
      title: "SKU",
      dataIndex: "productId",
      render: (x) => (<span>{stock.find((i) => i.productId == x)?.sku}</span>),
      sorter: (a, b) => a.productId.length - b.productId.length,
    },
    {
      title: "Category",
      dataIndex: "productId",
      render: (x) => (<span>{(() => {
        const pro = stock.find((i) => i.productId == x);
        return categories.find((i) => i.categoryId == pro.categoryId)?.categoryName;
      })()}</span>),
      sorter: (a, b) => a.productId.length - b.productId.length,
    },
    {
      title: "Brand",
      dataIndex: "productId",
      render: (x) => (<span>{stock.find((i) => i.productId == x)?.brand}</span>),
      sorter: (a, b) => a.productId.length - b.productId.length,
    },
    {
      title: "Sold Qty",
      dataIndex: "qty",
      sorter: (a, b) => a.qty.length - b.qty.length,
    },
    {
      title: "Sold Amount",
      dataIndex: "productTotal",
      render: (x) => (<span>{formatCurrency(x)}</span>),
      sorter: (a, b) => a.productTotal.length - b.productTotal.length,
    },
    {
      title: "Instock Qty",
      dataIndex: "productId",
      render: () => (
        <span>0</span>
      ),
      sorter: (a, b) => a.productId.length - b.productId.length,
    },

  ];
  //Custom Code
  const dispatch = useDispatch();
  const stock = useSelector((state) => state.posts);
  const posts = useSelector((state) => state.rows);
  const categories = useSelector((state) => state.categories);
  const [dataSource, setDataSource] = useState([]);
  const [productList, setProductList] = useState([{ value: 0, label: "Choose Product" }]);
  const [categoryList, setCategoryList] = useState([{ value: 0, label: "Choose Category" }]);
  //Select
  const [selectProduct, setSelectProduct] = useState(productList[0]);
  const [selectCategory, setSelectCategory] = useState(categoryList[0]);
  //Custom Code
  useEffect(() => {
    dispatch(getSale());
    dispatch(getProduct());
    dispatch(getCategory());
  }, [dispatch]);
  useEffect(() => {
    searchEngine("", "");
  }, [posts]);
  useEffect(() => {
    setCategoryList((prev) => [
      prev[0], ...categories.map((x) => ({
        value: x.categoryId,
        label: x.categoryName
      }))
    ]);
  }, [categories]);
  useEffect(() => {
    setProductList((prev) => [
      prev[0], ...stock.map((x) => ({
        value: x.productId,
        label: x.productName
      }))
    ]);
  }, [stock]);
  //Search Engine
  const searchEngine = (action, key) => {
    if (action === "newest") {
      setDataSource(posts.sort((a, b) => a.autoId - b.autoId)
        .slice(0, posts.length));
    }
    else if (action === "oldest") {
      setDataSource(posts.sort((a, b) => b.autoId - a.autoId)
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
    if (selectProduct.value > 0 && selectCategory.value === 0) {
      setDataSource(posts.filter((x) => x.productId === selectProduct.value));
    }
    else if (selectProduct.value === 0 && selectCategory.value > 0) {
      setDataSource(posts.filter((x) => x.categoryId === selectCategory.value));
    }
    else {
      setDataSource(posts.filter((x) => x.productId === selectProduct.value && x.categoryId === selectCategory.value));
    }
  }
  //Set Select DropDown
  const handleSelectProduct = (e) => {
    setSelectProduct(productList.find((x) => x.value === e));
  }
  const handleSelectCategory = (e) => {
    setSelectCategory(categoryList.find((x) => x.value === e));
  }

  return (
    <div className="page-wrapper">
      <div className="content">
        <Breadcrumbs
          maintitle="Sales Report"
          subtitle=" Manage Your Sales Report"
        />
        {/* /product list */}
        <div className="card table-list-card">
          <div className="card-body">
            <div className="table-top">
              <div className="search-set">
                <div className="search-input">
                  <input
                    type="search"
                    className="form-control form-control-sm"
                    placeholder="Search"
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
                  <div className="col-lg-3">
                    <div className="input-blocks">
                      <Box className="info-img" />
                      <Select
                        className="img-select"
                        classNamePrefix="react-select"
                        options={productList}
                        onChange={(e) => handleSelectProduct(e.value)}
                        value={selectProduct}
                      />
                    </div>
                  </div>
                  <div className="col-lg-3">
                    <div className="input-blocks">
                      <Zap className="info-img" />
                      <Select
                        className="img-select"
                        classNamePrefix="react-select"
                        options={categoryList}
                        onChange={(e) => handleSelectCategory(e.value)}
                        value={selectCategory}
                      />
                    </div>
                  </div>
                  <div className="col-lg-6 col-sm-6 col-12">
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
    </div>
  );
};

export default SalesReport;
