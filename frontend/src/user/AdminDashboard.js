import React from "react";
import Layout from "../core/Layout";
import { isAuthenticated } from "../auth";
import { Link } from 'react-router-dom';

const ArrowIcon = () => (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
        <path d="M2 7h10M8 3l4 4-4 4" stroke="currentColor" strokeWidth="1.8"
            strokeLinecap="round" strokeLinejoin="round" />
    </svg>
);

const cards = (_id) => [
    {
        to: '/create/product',
        accent: '#3b82f6',
        title: 'Add Product',
        desc: 'Create and publish a new product to the store.',
        cta: 'Add product',
        icon: (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z"/>
                <polyline points="3.27 6.96 12 12.01 20.73 6.96"/>
                <line x1="12" y1="22.08" x2="12" y2="12"/>
            </svg>
        ),
    },
    {
        to: '/admin/products',
        accent: '#8b5cf6',
        title: 'Manage Products',
        desc: 'Edit, update, or remove existing products.',
        cta: 'View products',
        icon: (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="3" width="7" height="7" rx="1"/>
                <rect x="14" y="3" width="7" height="7" rx="1"/>
                <rect x="3" y="14" width="7" height="7" rx="1"/>
                <rect x="14" y="14" width="7" height="7" rx="1"/>
            </svg>
        ),
    },
    {
        to: '/admin/orders',
        accent: '#f59e0b',
        title: 'All Orders',
        desc: 'View and manage customer orders and delivery status.',
        cta: 'View orders',
        icon: (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2"/>
                <rect x="9" y="3" width="6" height="4" rx="1"/>
                <line x1="9" y1="12" x2="15" y2="12"/>
                <line x1="9" y1="16" x2="13" y2="16"/>
            </svg>
        ),
    },
    {
        to: '/create/category',
        accent: '#10b981',
        title: 'Create Category',
        desc: 'Organise products into browsable categories.',
        cta: 'Add category',
        icon: (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20.59 13.41l-7.17 7.17a2 2 0 01-2.83 0L2 12V2h10l8.59 8.59a2 2 0 010 2.82z"/>
                <circle cx="7" cy="7" r="1.5" fill="currentColor" stroke="none"/>
            </svg>
        ),
    },
    {
        to: `/profile/${_id}`,
        accent: '#6366f1',
        title: 'Update Profile',
        desc: 'Edit your admin account name, email, and password.',
        cta: 'Edit profile',
        icon: (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/>
                <circle cx="12" cy="7" r="4"/>
            </svg>
        ),
    },
    {
        to: '/purchase-history',
        accent: '#ec4899',
        title: 'Purchase History',
        desc: 'Review all completed orders and transactions.',
        cta: 'View history',
        icon: (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"/>
                <polyline points="12 6 12 12 16 14"/>
            </svg>
        ),
    },
];

function AdminDashboard() {
    const { user: { _id, name, email, role } } = isAuthenticated();

    return (
        <Layout>
            <div className="admin-content">

                {/* ── Profile header ── */}
                <div className="admin-dash-header">
                    <div className="admin-avatar">
                        {name?.charAt(0).toUpperCase()}
                    </div>
                    <div className="admin-meta">
                        <p className="admin-name">{name}</p>
                        <p className="admin-email">{email}</p>
                    </div>
                    <span className="admin-role-badge">
                        {role === 1 ? 'Administrator' : 'Registered User'}
                    </span>
                </div>

                {/* ── Action cards ── */}
                <div>
                    <p className="admin-section-label">Quick Actions</p>
                    <div className="admin-dash-grid">
                        {cards(_id).map(({ to, accent, title, desc, cta, icon }) => (
                            <Link
                                key={to}
                                to={to}
                                className="admin-dash-card"
                                style={{ '--card-accent': accent }}
                            >
                                <div className="dash-card-icon">{icon}</div>
                                <p className="dash-card-title">{title}</p>
                                <p className="dash-card-desc">{desc}</p>
                                <div className="dash-card-cta">
                                    {cta} <ArrowIcon />
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>

            </div>
        </Layout>
    );
}

export default AdminDashboard;
