import React, { useState } from "react";
import { Link } from 'react-router-dom';
import { useUserData } from "../hooks/useAuth";
import Layout from "../core/Layout";
import { createCategory } from '../api/admin';

function AddCategory() {
    const [name, setName] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(false);

    const { user, token } = useUserData();

    const handleSubmit = (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        setLoading(true);

        createCategory(user._id, token, { name })
            .then((data) => {
                if (data.error) {
                    setError(data.error);
                } else {
                    setSuccess(`Category "${name}" created successfully!`);
                    setName('');
                }
            })
            .catch(() => setError('Failed to create category. Please try again.'))
            .finally(() => setLoading(false));
    };

    return (
        <Layout>
            <div className="page-content">
                <div className="admin-form">

                    {/* ── Header ── */}
                    <div>
                        <Link to="/admin/dashboard" className="back-link">
                            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                                <path d="M10 7H2M6 3L2 7l4 4" stroke="currentColor" strokeWidth="1.8"
                                    strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                            Back to Dashboard
                        </Link>
                        <h2 className="admin-form-title">Create Category</h2>
                        <p className="admin-form-subtitle">
                            Add a new category to organise your products.
                        </p>
                    </div>

                    {/* ── Feedback ── */}
                    {success && (
                        <div className="alert alert-success">
                            <strong>Done!</strong> {success}
                        </div>
                    )}
                    {error && (
                        <div className="alert alert-danger">{error}</div>
                    )}

                    {/* ── Form ── */}
                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label className="form-label" htmlFor="category-name">
                                Category Name
                            </label>
                            <input
                                id="category-name"
                                type="text"
                                className="form-control"
                                placeholder="e.g. Vegetables, Fruits, Dairy…"
                                value={name}
                                onChange={(e) => { setError(''); setName(e.target.value); }}
                                required
                            />
                        </div>

                        <button
                            type="submit"
                            className="btn-primary btn-lg"
                            disabled={loading || !name.trim()}
                        >
                            {loading ? 'Creating…' : 'Create Category'}
                        </button>
                    </form>

                </div>
            </div>
        </Layout>
    );
}

export default AddCategory;
