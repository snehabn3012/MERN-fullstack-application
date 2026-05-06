import React, { useState, useRef, useEffect } from "react";
import { Link } from 'react-router-dom';
import { useUserData } from "../hooks/useAuth";
import Layout from "../core/Layout";
import { createProduct, getCategories } from '../api/admin';

function AddProduct() {
    const { user, token } = useUserData();
    const [isLoading, setIsLoading] = useState(false);
    const [categories, setCategories] = useState([]);
    const formData = useRef(new FormData());

    const [values, setValues] = useState({
        name: '', description: '', price: '', quantity: '',
        category: '', shipping: '', error: '', createdProduct: '',
    });

    const { name, description, price, category, shipping, quantity, error, createdProduct } = values;

    useEffect(() => {
        getCategories({ token }).then((data) => { if (!data.error) setCategories(data); });
    }, [token]);

    const handleChange = (field) => (event) => {
        const value = field === 'photo' ? event.target.files[0] : event.target.value;
        formData.current.set(field, value);
        setValues(prev => ({ ...prev, [field]: value }));
    };

    const clickSubmit = (e) => {
        e.preventDefault();
        setValues(prev => ({ ...prev, error: '' }));
        setIsLoading(true);
        createProduct(user._id, token, formData.current).then((data) => {
            setIsLoading(false);
            if (data.error) {
                setValues(prev => ({ ...prev, error: data.error }));
            } else if (data.result) {
                setValues({ name: '', description: '', price: '', quantity: '', category: '', shipping: '', error: '', createdProduct: data.result.name });
                formData.current = new FormData();
            }
        });
    };

    return (
        <Layout>
            <div className="page-content">
                <div className="admin-form">
                    <div>
                        <Link to="/admin/dashboard" className="back-link">
                            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                                <path d="M10 7H2M6 3L2 7l4 4" stroke="currentColor" strokeWidth="1.8"
                                    strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                            Back to Dashboard
                        </Link>
                        <h2 className="admin-form-title">Add Product</h2>
                        <p className="admin-form-subtitle">Fill in the details to add a new product to the store.</p>
                    </div>

                    {createdProduct && (
                        <div className="alert alert-success">
                            <strong>{createdProduct}</strong> was created successfully!
                        </div>
                    )}
                    {error && <div className="alert alert-danger">{error}</div>}
                    {isLoading && <div className="alert alert-info">Creating product…</div>}

                    <form onSubmit={clickSubmit}>
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
                                <input type="text" className="form-control" value={name} onChange={handleChange('name')} required />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Price ($)</label>
                                <input type="number" className="form-control" value={price} onChange={handleChange('price')} required />
                            </div>
                        </div>

                        <div className="form-group">
                            <label className="form-label">Description</label>
                            <textarea className="form-control" value={description} onChange={handleChange('description')} rows={4} required />
                        </div>

                        <div className="form-row">
                            <div className="form-group">
                                <label className="form-label">Category</label>
                                <select className="form-control" value={category} onChange={handleChange('category')}>
                                    <option value="">Please select</option>
                                    {categories.map((cat, i) => (
                                        <option key={i} value={cat._id}>{cat.name}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="form-group">
                                <label className="form-label">Quantity</label>
                                <input type="number" className="form-control" value={quantity} onChange={handleChange('quantity')} required />
                            </div>
                        </div>

                        <div className="form-group">
                            <label className="form-label">Shipping</label>
                            <select className="form-control" value={shipping} onChange={handleChange('shipping')}>
                                <option value="">Please select</option>
                                <option value="0">No</option>
                                <option value="1">Yes</option>
                            </select>
                        </div>

                        <button type="submit" className="btn-primary btn-lg" disabled={isLoading}>
                            {isLoading ? 'Creating…' : 'Create Product'}
                        </button>
                    </form>
                </div>
            </div>
        </Layout>
    );
}

export default AddProduct;
