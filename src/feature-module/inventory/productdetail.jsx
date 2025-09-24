import ImageWithBasePath from '../../core/img/imagewithbasebath'
import { getImageFromUrl } from '../../helper/helpers';
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
// import { all_routes } from "../../Router/all_routes";
import { useParams } from 'react-router-dom';
import { getProduct, getUsers } from '../../core/redux/action';

const ProductDetail = () => {
    const dispatch = useDispatch();
    const posts = useSelector((state) => state.posts);
    const categoryStore = useSelector((state) => state.categories);
    const brandStore = useSelector((state) => state.brands);
    const { id } = useParams();
    const productId = parseInt(id, 10);

    const data = posts.filter((x) => x.productId === productId).map((x) => ({
        ...x,
        categoryName:
            categoryStore.find((i) => i.categoryId === x.categoryId)?.categoryName || "-",
        brandName:
            brandStore.find((i) => i.brandId === x.brandId)?.brandName || "-",
    }));

    useEffect(() => {
        dispatch(getProduct());
        dispatch(getUsers());
    }, [dispatch]);
    // useEffect(() => {
    //     if (data.length === 0)
    //         navigate(route.productlist);
    // }, [data]);
    // if (data.length === 0)
    //     return null;
    const x = data[0];
    return (
        <div>
            <div className="page-wrapper">
                <div className="content">
                    <div className="page-header">
                        <div className="page-title">
                            <h4>Product Details</h4>
                            <h6>Full details of a product</h6>
                        </div>
                    </div>
                    {/* /add */}
                    <div className="row">
                        <div className="col-lg-8 col-sm-12">
                            <div className="card">
                                <div className="card-body">
                                    <div className="bar-code-view">
                                        <ImageWithBasePath src="assets/img/barcode/barcode1.png" alt="barcode" />
                                        <a className="printimg">
                                            <ImageWithBasePath src="assets/img/icons/printer.svg" alt="print" />
                                        </a>
                                    </div>
                                    <div className="productdetails">
                                        <ul className="product-bar">
                                            <li>
                                                <h4>Product ID</h4>
                                                <h6>/PRO-{x?.productId}</h6>
                                            </li>
                                            <li>
                                                <h4>Product</h4>
                                                <h6>{x?.productName}</h6>
                                            </li>
                                            <li>
                                                <h4>Category</h4>
                                                <h6>{x?.categoryName}</h6>
                                            </li>
                                            <li>
                                                <h4>Brand</h4>
                                                <h6>{x?.brandName}</h6>
                                            </li>
                                            <li>
                                                <h4>SKU</h4>
                                                <h6>{x?.sku}</h6>
                                            </li>
                                            <li>
                                                <h4>MinUom</h4>
                                                <h6>{x?.minUom}</h6>
                                            </li>
                                            <li>
                                                <h4>MaxUom</h4>
                                                <h6>{x?.maxUom}</h6>
                                            </li>
                                            <li>
                                                <h4>Factor</h4>
                                                <h6>{x?.factor}</h6>
                                            </li>
                                            <li>
                                                <h4>Consumer Price</h4>
                                                <h6>{x?.consumerPrice}</h6>
                                            </li>
                                            <li>
                                                <h4>Purchase Price</h4>
                                                <h6>{x?.purchasePrice}</h6>
                                            </li>
                                            <li>
                                                <h4>Sale Price</h4>
                                                <h6>{x?.salePrice}</h6>
                                            </li>
                                            <li>
                                                <h4>Discount Percent(%)</h4>
                                                <h6>{x?.discountPrct}</h6>
                                            </li>
                                            <li>
                                                <h4>Discount Amount($)</h4>
                                                <h6>{x?.discountValue}</h6>
                                            </li>
                                            <li>
                                                <h4>Tax Percent(%)</h4>
                                                <h6>{x?.gstprct}</h6>
                                            </li>
                                            <li>
                                                <h4>Tax Amount($)</h4>
                                                <h6>{x?.gstvalue}</h6>
                                            </li>
                                            <li>
                                                <h4>Barcode</h4>
                                                <h6>{x?.qrcodeBarcode}</h6>
                                            </li>
                                            <li>
                                                <h4>Description</h4>
                                                <h6>{x?.desc}</h6>
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-lg-4 col-sm-12">
                            <div className="card">
                                <div className="card-body">
                                    <div className="slider-product-details">
                                        <div className="owl-carousel owl-theme product-slide">
                                            <div className="slider-product">
                                                <img src={getImageFromUrl(x?.imageName)} alt="img" />
                                                {/* <h4>macbookpro.jpg</h4> */}
                                                {/* <h6>581kb</h6> */}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    {/* /add */}
                </div>
            </div>
        </div >
    )
}

export default ProductDetail
