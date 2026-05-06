import React, { useState, useEffect } from "react";
import { Link } from 'react-router-dom';
import Layout from "../core/Layout";
import { listOrders, getStatusValues, updateOrderStatus } from '../api/admin';

const STATUS_CLASS = {
    'Not processed': 'status-badge-neutral',
    'Processing':    'status-badge-warning',
    'Shipped':       'status-badge-info',
    'Delivered':     'status-badge-success',
    'Cancelled':     'status-badge-danger',
};

const formatAmount = (paise) =>
    '₹' + (paise / 100).toLocaleString('en-IN');

const formatDate = (iso) =>
    iso ? new Date(iso).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : '—';

function Orders() {
    const [orders, setOrders] = useState([]);
    const [statusValues, setStatusValues] = useState([]);
    const [loading, setLoading] = useState(true);

    const loadOrders = () => {
        listOrders().then(data => {
            if (!data?.error) setOrders(data ?? []);
        }).finally(() => setLoading(false));
    };

    useEffect(() => {
        loadOrders();
        getStatusValues().then(data => {
            if (!data?.error) setStatusValues(data ?? []);
        });
    }, []);

    const handleStatusChange = (e, orderId) => {
        updateOrderStatus(orderId, e.target.value).then(data => {
            if (!data?.error) loadOrders();
        });
    };

    const emptyState = (
        <div style={{ textAlign: 'center', padding: '4rem 2rem', color: 'var(--text-muted)' }}>
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"
                style={{ margin: '0 auto 1rem', display: 'block', opacity: 0.4 }}>
                <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2"/>
                <rect x="9" y="3" width="6" height="4" rx="1"/>
            </svg>
            <p style={{ fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.25rem' }}>
                No orders yet
            </p>
            <p style={{ fontSize: '0.875rem' }}>
                Orders from customers will appear here.
            </p>
        </div>
    );

    return (
        <Layout>
            <div className="page-content">
                <div style={{ maxWidth: '72rem', marginInline: 'auto' }}>

                    {/* ── Top bar ── */}
                    <div className="admin-topbar" style={{ marginBottom: '1.5rem' }}>
                        <div>
                            <Link to="/admin/dashboard" className="back-link">
                                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                                    <path d="M10 7H2M6 3L2 7l4 4" stroke="currentColor" strokeWidth="1.8"
                                        strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                                Dashboard
                            </Link>
                            <h2 className="admin-page-title" style={{ marginTop: '0.375rem' }}>
                                All Orders
                                {orders.length > 0 && (
                                    <span style={{
                                        marginLeft: '0.625rem',
                                        fontSize: '0.875rem',
                                        fontWeight: 500,
                                        color: 'var(--text-muted)',
                                    }}>
                                        ({orders.length})
                                    </span>
                                )}
                            </h2>
                        </div>
                    </div>

                    {/* ── Table ── */}
                    {loading ? (
                        <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
                            Loading orders…
                        </div>
                    ) : orders.length === 0 ? emptyState : (
                        <div className="admin-table-wrapper">
                            <table className="admin-table">
                                <thead>
                                    <tr>
                                        <th>Order ID</th>
                                        <th>Customer</th>
                                        <th>Amount</th>
                                        <th>Status</th>
                                        <th>Delivery Address</th>
                                        <th>Items</th>
                                        <th>Date</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {orders.map((order) => (
                                        <tr key={order._id}>
                                            <td>
                                                <code style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                                                    #{order._id?.slice(-8).toUpperCase()}
                                                </code>
                                            </td>

                                            <td>
                                                <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>
                                                    {order.user?.name ?? '—'}
                                                </span>
                                            </td>

                                            <td style={{ fontWeight: 700, color: 'var(--text-primary)' }}>
                                                {formatAmount(order.amount)}
                                            </td>

                                            <td>
                                                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                                    <span className={`status-badge ${STATUS_CLASS[order.status] ?? 'status-badge-neutral'}`}>
                                                        {order.status}
                                                    </span>
                                                    <select
                                                        className="status-select"
                                                        defaultValue=""
                                                        onChange={(e) => handleStatusChange(e, order._id)}
                                                    >
                                                        <option value="" disabled>Update status</option>
                                                        {statusValues.map((s) => (
                                                            <option key={s} value={s}>{s}</option>
                                                        ))}
                                                    </select>
                                                </div>
                                            </td>

                                            <td style={{ maxWidth: '14rem', whiteSpace: 'normal', fontSize: '0.85rem' }}>
                                                {order.address ?? '—'}
                                            </td>

                                            <td>
                                                <div className="order-product-list">
                                                    {order.products?.map((p, i) => (
                                                        <div key={i} className="order-product-row">
                                                            <span className="op-name">{p.name}</span>
                                                            <span className="op-qty">×{p.count ?? 1}</span>
                                                            <span style={{ color: 'var(--text-muted)' }}>
                                                                ₹{p.price}
                                                            </span>
                                                        </div>
                                                    ))}
                                                </div>
                                            </td>

                                            <td style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>
                                                {formatDate(order.createdAt)}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}

                </div>
            </div>
        </Layout>
    );
}

export default Orders;
