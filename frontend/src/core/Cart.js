import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Layout from "./Layout";
import { getCart, removeItem, updateItem } from "../utils/cartHelpers";
import { API } from "../utils/config";
import Checkout from "./Checkout";

/* ── Single cart row ───────────────────────────────────────────── */
const CartItem = ({ product, onUpdate, onRemove }) => {
    const [count, setCount] = useState(product.count || 1);

    const changeQty = (delta) => {
        const next = count + delta;
        if (next < 1) return;
        setCount(next);
        updateItem(product._id, next);
        onUpdate();
    };

    const handleRemove = () => {
        removeItem(product._id);
        onRemove();
    };

    return (
        <div className="cart-item">
            <img
                src={`${API}/products/photo/${product._id}`}
                alt={product.name}
                className="cart-item-image"
                loading="lazy"
                decoding="async"
                onError={e => { e.currentTarget.src = ''; e.currentTarget.style.background = 'var(--bg-surface-alt)'; }}
            />

            <div className="cart-item-info">
                <Link to={`/product/${product._id}`} className="cart-item-name">
                    {product.name}
                </Link>
                <span className="cart-item-category">
                    {product.category?.name || "Product"}
                </span>
                <span className="cart-item-unit-price">₹ {product.price} each</span>
            </div>

            <div className="qty-stepper">
                <button
                    className="qty-btn"
                    onClick={() => changeQty(-1)}
                    disabled={count <= 1}
                    aria-label="Decrease quantity"
                >−</button>
                <span className="qty-value">{count}</span>
                <button
                    className="qty-btn"
                    onClick={() => changeQty(1)}
                    aria-label="Increase quantity"
                >+</button>
            </div>

            <span className="cart-item-subtotal">₹{(product.price * count).toLocaleString()}</span>

            <button className="cart-item-remove" onClick={handleRemove} aria-label="Remove item">
                <svg width="16" height="16" viewBox="0 0 20 20" fill="none">
                    <path d="M3 6h14M8 6V4h4v2M5 6l1 11h8l1-11"
                        stroke="currentColor" strokeWidth="1.6"
                        strokeLinecap="round" strokeLinejoin="round" />
                </svg>
            </button>
        </div>
    );
};

/* ── Cart page ─────────────────────────────────────────────────── */
const Cart = () => {
    const [items, setItems] = useState([]);

    const refresh = () => setItems(getCart());

    useEffect(() => { refresh(); }, []);

    return (
        <Layout>
            <div className="cart-page">

                {/* ── Left: item list ── */}
                <div className="cart-main">
                    <div className="cart-header">
                        <h2 className="cart-heading">Shopping Cart</h2>
                        <span className="cart-count">
                            {items.length} {items.length === 1 ? "item" : "items"}
                        </span>
                    </div>

                    {items.length > 0 ? (
                        <>
                            <div className="cart-list-labels">
                                <span>Product</span>
                                <span>Qty</span>
                                <span>Subtotal</span>
                                <span />
                            </div>

                            <div className="cart-list">
                                {items.map(product => (
                                    <CartItem
                                        key={product._id}
                                        product={product}
                                        onUpdate={refresh}
                                        onRemove={refresh}
                                    />
                                ))}
                            </div>

                            <div className="cart-actions">
                                <Link to="/shop" className="cart-continue-link">
                                    ← Continue Shopping
                                </Link>
                            </div>
                        </>
                    ) : (
                        <div className="cart-empty">
                            <span className="cart-empty-icon">
                                <svg width="56" height="56" viewBox="0 0 24 24" fill="none">
                                    <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4zM3 6h18M16 10a4 4 0 01-8 0"
                                        stroke="currentColor" strokeWidth="1.5"
                                        strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            </span>
                            <h3 className="empty-title">Your cart is empty</h3>
                            <p className="empty-desc">Looks like you haven't added anything yet.</p>
                            <Link to="/shop" className="btn-primary">Browse Products</Link>
                        </div>
                    )}
                </div>

                {/* ── Right: order summary ── */}
                {items.length > 0 && (
                    <div className="cart-summary">
                        <Checkout products={items} />
                    </div>
                )}
            </div>
        </Layout>
    );
};

export default Cart;
