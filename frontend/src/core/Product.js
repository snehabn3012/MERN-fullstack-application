import React, { memo, useEffect, useState, useRef } from "react";
import { useParams } from 'react-router-dom';
import { getProduct } from '../api/product';
import Layout from "./Layout";
import ProductDetailsCard from "../ui/ProductDetailsCard";
import RelatedProducts from "./RelatedProducts";

function Product() {
    const [product, setProduct] = useState({});
    const [error, setError] = useState(false);
    const isInitialMount = useRef(true);
    const { productId } = useParams();

    useEffect(() => {
        // if (isInitialMount.current) {
        //     isInitialMount.current = false;
        //     return;
        // }
        if (productId) {
            getProduct(productId)
                .then((res) => {
                    if (res.error) throw res.error;
                    setProduct(res);
                })
                .catch(setError);
        }
    }, [productId]);

    return (
        <Layout>
            <div className="page-content">
                {error && <div className="alert alert-danger">{String(error)}</div>}
                <ProductDetailsCard product={product} />
                {productId && <RelatedProducts productId={productId} />}
            </div>
        </Layout>
    );
}

export default memo(Product);
