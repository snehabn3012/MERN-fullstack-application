import React, { useState, useEffect, useRef } from "react";
import { Link, Navigate, useParams } from "react-router-dom";

import Layout from "../core/Layout";
import { isAuthenticated } from "../auth";
import { getProduct } from "../api/product";
import { getCategories, updateProduct } from "../api/admin";

const UpdateProduct = () => {
    const { user, token } = isAuthenticated();
    const { productId } = useParams();
    const formData = useRef(new FormData());

    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState('');
    const [updatedName, setUpdatedName] = useState('');
    const [redirect, setRedirect] = useState(false);

    const [values, setValues] = useState({
        name: '', description: '', price: '', quantity: '',
        category: '', shipping: '',
    });

    useEffect(() => {
        formData.current = new FormData();

        Promise.all([
            getProduct(productId),
            getCategories(),
        ]).then(([product, cats]) => {
            if (product.error) { setError(product.error); return; }

            setValues({
                name:        product.name        ?? '',
                description: product.description ?? '',
                price:       product.price       ?? '',
                quantity:    product.quantity    ?? '',
                category:    product.category?._id ?? '',
                shipping:    String(product.shipping ? 1 : 0),
            });

            if (!cats.error) setCategories(cats);
        }).catch(() => setError('Failed to load product data.'))
          .finally(() => setLoading(false));
    }, [productId]);

    const handleChange = (field) => (e) => {
        const value = field === 'photo' ? e.target.files[0] : e.target.value;
        formData.current.set(field, value);
        setValues(prev => ({ ...prev, [field]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setError('');
        setSubmitting(true);

        updateProduct(productId, formData.current).then(data => {
            if (data.error) {
                setError(data.error);
            } else {
                setUpdatedName(data.name);
                setTimeout(() => setRedirect(true), 1200);
            }
        }).catch(() => setError('Update failed. Please try again.'))
          .finally(() => setSubmitting(false));
    };

    if (redirect) return <Navigate to="/admin/products" />;

    return (
        <Layout>
            <div className="page-content">
                <div className="admin-form">

                    {/* ── Header ── */}
                    <div>
                        <Link to="/admin/products" className="back-link">
                            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                                <path d="M10 7H2M6 3L2 7l4 4" stroke="currentColor" strokeWidth="1.8"
                                    strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                            Manage Products
                        </Link>
                        <h2 className="admin-form-title">Update Product</h2>
                        <p className="admin-form-subtitle">
                            Edit product details below. Changes take effect immediately.
                        </p>
                    </div>

                    {/* ── Feedback ── */}
                    {updatedName && (
                        <div className="alert alert-success">
                            <strong>{updatedName}</strong> updated successfully! Redirecting…
                        </div>
                    )}
                    {error && <div className="alert alert-danger">{error}</div>}
                    {loading && <div className="alert alert-info">Loading product data…</div>}

                    {/* ── Form ── */}
                    {!loading && (
                        <form onSubmit={handleSubmit}>
                            <div className="form-group">
                                <label className="form-label">Product Photo</label>
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleChange('photo')}
                                    className="form-control"
                                />
                            </div>

                            <div className="form-row">
                                <div className="form-group">
                                    <label className="form-label">Name</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        value={values.name}
                                        onChange={handleChange('name')}
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Price (₹)</label>
                                    <input
                                        type="number"
                                        className="form-control"
                                        value={values.price}
                                        onChange={handleChange('price')}
                                        required
                                    />
                                </div>
                            </div>

                            <div className="form-group">
                                <label className="form-label">Description</label>
                                <textarea
                                    className="form-control"
                                    value={values.description}
                                    onChange={handleChange('description')}
                                    rows={4}
                                    required
                                />
                            </div>

                            <div className="form-row">
                                <div className="form-group">
                                    <label className="form-label">Category</label>
                                    <select
                                        className="form-control"
                                        value={values.category}
                                        onChange={handleChange('category')}
                                    >
                                        <option value="">Please select</option>
                                        {categories.map((c) => (
                                            <option key={c._id} value={c._id}>{c.name}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Quantity</label>
                                    <input
                                        type="number"
                                        className="form-control"
                                        value={values.quantity}
                                        onChange={handleChange('quantity')}
                                        required
                                    />
                                </div>
                            </div>

                            <div className="form-group">
                                <label className="form-label">Shipping</label>
                                <select
                                    className="form-control"
                                    value={values.shipping}
                                    onChange={handleChange('shipping')}
                                >
                                    <option value="">Please select</option>
                                    <option value="0">No</option>
                                    <option value="1">Yes</option>
                                </select>
                            </div>

                            <button
                                type="submit"
                                className="btn-primary btn-lg"
                                disabled={submitting}
                            >
                                {submitting ? 'Saving changes…' : 'Save Changes'}
                            </button>
                        </form>
                    )}

                </div>
            </div>
        </Layout>
    );
};

export default UpdateProduct;
