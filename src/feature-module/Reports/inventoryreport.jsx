import React, { useEffect, useState } from "react";
import Breadcrumbs from "../../core/breadcrumbs";
import ImageWithBasePath from "../../core/img/imagewithbasebath";
import { Link } from "react-router-dom";
import { Filter, Sliders, Box, Zap } from "react-feather";
import Select from "react-select";
import Table from "../../core/pagination/datatable";
import { useDispatch, useSelector } from "react-redux";
import { getBrand, getCategory, getProduct } from "../../core/redux/action";
import { getImageFromUrl } from "../../helper/helpers";

const InventoryReport = () => {
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
      dataIndex: "productName",
      render: (text, r) => (
        <span className="productimgname">
          <Link to="#" className="product-img stock-img">
            <img alt="" src={getImageFromUrl(r.imageName)} />
          </Link>
          <Link to="#">{text}</Link>
        </span>
      ),
      sorter: (a, b) => a.productName.length - b.productName.length,
    },
    {
      title: "SKU",
      dataIndex: "sku",
      sorter: (a, b) => a.sku.length - b.sku.length,
    },
    {
      title: "Category",
      dataIndex: "categoryId",
      render: (x) => (<span>{categories.find((i) => i.categoryId == x)?.categoryName}</span>),
      sorter: (a, b) => a.categoryId.length - b.categoryId.length,
    },
    {
      title: "Brand",
      dataIndex: "brandId",
      render: (x) => (<span>{brands.find((i) => i.brandId == x)?.brandName}</span>),
      sorter: (a, b) => a.brandId.length - b.brandId.length,
    },
    {
      title: "Unit",
      dataIndex: "minUom",
      sorter: (a, b) => a.minUom.length - b.minUom.length,
    },
    // {
    //   title: "Instock Qty",
    //   dataIndex: "qty",
    //   sorter: (a, b) => a.qty.length - b.qty.length,
    // },
  ];
  //Custom Code
  const dispatch = useDispatch();
  const posts = useSelector((state) => state.posts);
  const categories = useSelector((state) => state.categories);
  const brands = useSelector((state) => state.brands);
  const [dataSource, setDataSource] = useState([]);
  const [productList, setProductList] = useState([{ value: 0, label: "Choose Product" }]);
  const [categoryList, setCategoryList] = useState([{ value: 0, label: "Choose Category" }]);
  //Select
  const [selectProduct, setSelectProduct] = useState(productList[0]);
  const [selectCategory, setSelectCategory] = useState(categoryList[0]);
  //Custom Code
  useEffect(() => {
    dispatch(getProduct());
    dispatch(getCategory());
    dispatch(getBrand());
  }, [dispatch]);
  useEffect(() => {
    searchEngine("", "");
    setProductList((prev) => [
      prev[0], ...posts.map((x) => ({
        value: x.productId,
        label: x.productName
      }))
    ]);
  }, [posts]);
  useEffect(() => {
    setCategoryList((prev) => [
      prev[0], ...categories.map((x) => ({
        value: x.categoryId,
        label: x.categoryName
      }))
    ]);
  }, [categories]);
  //Search Engine
  const searchEngine = (action, key) => {
    if (action === "newest") {
      setDataSource(posts.sort((a, b) => a.productId - b.productId)
        .slice(0, posts.length));
    }
    else if (action === "oldest") {
      setDataSource(posts.sort((a, b) => b.productId - a.productId)
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
      setDataSource(posts.filter((x) => x.categoryId == selectCategory.value));
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
          maintitle="Inventory Report"
          subtitle="Manage Your Inventory Report"
        />
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

export default InventoryReport;
