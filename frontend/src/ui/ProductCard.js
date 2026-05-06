import React, { useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { addItem, removeItem, updateItem } from '../utils/cartHelpers';
import ProductCardImage from './ProductCardImage';
import { Input } from '@chakra-ui/react';
import "./ProductCard.css";

const ProductCard = ({ product, showAddToCartButton = true,
    showRemoveProductButton = false, cartUpdate = false }) => {
    const [redirect, setRedirect] = useState(false);
    const [count, setCount] = useState(product.count);


    const addToCart = (e) => {
        addItem(product, () => {
            setRedirect(true);
        });
    }

    const removeFromCart = (productId) => () => {
        removeItem(productId);
    }

    const shouldRedirect = redirect => {
        if (redirect) {
            return <Navigate to="/cart" />
        }
    }

    const handleChange = (productId) => (event) => {
        const val = event.target.value;
        setCount(val < 1 ? 1 : val);
        if (val >= 1) {
            updateItem(productId, val);
        }
    }



    return (
        <div className="product-card">
  <Link to={`/product/${product._id}`}>
    <ProductCardImage product={product} url="product"/>

    <div className="product-card-body">
      <div className="product-title">{product.name}</div>

      {/* <p className="product-description">
        {product.description?.substring(0, 100) || product.description}
      </p> */}
    </div>
  </Link>

  <div className="product-card-footer">
    <span className="product-price">
      ₹{product.price}
    </span>

    {showAddToCartButton && (
      <button onClick={addToCart} className="btn-primary">
        Add to Cart
      </button>
    )}

    {cartUpdate && (
      <div className="cart-update">
        <Input
          type="number"
          value={count}
          onChange={handleChange(product._id)}
        />
      </div>
    )}

    {showRemoveProductButton && (
      <button
        onClick={() => removeFromCart(product._id)}
        className="btn-primary"
      >
        Remove Item
      </button>
    )}

    {shouldRedirect(redirect)}
  </div>
</div>
    );
};

export default ProductCard;
