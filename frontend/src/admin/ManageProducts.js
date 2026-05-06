import React, { useState, useEffect } from "react";
import Layout from "../core/Layout";
import { isAuthenticated } from "../auth";
import { Link } from "react-router-dom";
import { getProducts, deleteProduct } from "../api/admin";

const ManageProducts = () => {
    const [products, setProducts] = useState([]);
    const { user, token } = isAuthenticated();

    const loadProducts = () => {
        getProducts().then(data => {
            if (!data.error) setProducts(data.data);
        });
    };

    const destroy = productId => {
        deleteProduct(productId, user._id, token).then(data => {
            if (!data.error) loadProducts();
        });
    };

    useEffect(() => { loadProducts(); }, []);

    return (
        <Layout>
            <div className="page-content">
                <div className="admin-topbar">
                    <h2 className="admin-page-title">Manage Products</h2>
                    <div className="admin-actions">
                        <Link to="/create/product" className="btn-primary">+ Add Product</Link>
                    </div>
                </div>

                <div className="admin-table-wrapper" style={{ marginTop: '1.5rem' }}>
                    <table className="admin-table">
                        <thead>
                            <tr>
                                <th>Product Name</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {products.map((p, i) => (
                                <tr key={i}>
                                    <td><strong>{p.name}</strong></td>
                                    <td>
                                        <div className="table-actions">
                                            <Link to={`/admin/product/update/${p._id}`} className="btn-secondary btn-sm">
                                                Edit
                                            </Link>
                                            <button className="btn-danger btn-sm" onClick={() => destroy(p._id)}>
                                                Delete
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    {products.length === 0 && (
                        <p className="text-muted text-center" style={{ padding: '2rem' }}>
                            No products yet.
                        </p>
                    )}
                </div>
            </div>
        </Layout>
    );
};

export default ManageProducts;
