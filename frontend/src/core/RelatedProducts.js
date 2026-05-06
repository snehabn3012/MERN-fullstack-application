import React, { memo, useCallback, useEffect, useState, useRef } from "react";
import { listRelatedProducts } from '../api/product';

import Carousel from '../ui/Carousel';

function RelatedProducts({ productId }) {
    const [products, setProducts] = useState([]);

    const loadProducts = useCallback(() => {
        listRelatedProducts(productId).then(
            (data) => {
                if (data?.products) {
                    setProducts(data.products);
                }
            })
    }, [productId])

    useEffect(() => {
       if (productId) {
            loadProducts();
        }
    }, [productId, loadProducts]);

    return (
        <Carousel
            products={products}
            title="Related Products"
            isLoading={false}
        />
        
    )
}

export default memo(RelatedProducts);
