import React from 'react';
import { Link } from 'react-router-dom';

/* ── Right-side illustrated scene ── */
const FarmVisual = () => (
  <div className="hero-visual" aria-hidden="true">
    {/* Decorative rings */}
    <div className="hero-ring hero-ring-outer" />
    <div className="hero-ring hero-ring-middle" />
    <div className="hero-ring hero-ring-inner" />

    {/* Central farm-to-table SVG illustration */}
    <div className="hero-icon-center">
      <svg viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* Plate */}
        <circle cx="60" cy="70" r="32" fill="rgba(255,255,255,0.07)" stroke="rgba(255,255,255,0.2)" strokeWidth="1.5"/>
        <circle cx="60" cy="70" r="24" fill="rgba(255,255,255,0.05)" stroke="rgba(255,255,255,0.12)" strokeWidth="1"/>

        {/* Carrot */}
        <path d="M52 64 Q54 58 56 63 Q58 68 52 64Z" fill="#fb923c"/>
        <path d="M54 58 C54 55 52 53 54 51" stroke="#4ade80" strokeWidth="1.5" strokeLinecap="round"/>
        <path d="M56 57 C56 54 54 52 56 50" stroke="#4ade80" strokeWidth="1.5" strokeLinecap="round"/>

        {/* Tomato */}
        <circle cx="63" cy="67" r="6" fill="#f87171"/>
        <path d="M61 61 C62 59 64 59 63 61" stroke="#4ade80" strokeWidth="1.5" strokeLinecap="round"/>
        <line x1="63" y1="61" x2="63" y2="59" stroke="#4ade80" strokeWidth="1.5" strokeLinecap="round"/>

        {/* Leaf / lettuce */}
        <path d="M50 72 Q53 66 58 70 Q55 76 50 72Z" fill="#4ade80" opacity="0.9"/>
        <path d="M50 72 Q53 69 58 70" stroke="#22c55e" strokeWidth="0.8"/>

        {/* Broccoli */}
        <circle cx="70" cy="65" r="3.5" fill="#4ade80"/>
        <circle cx="67" cy="63" r="2.5" fill="#22c55e"/>
        <circle cx="73" cy="63" r="2.5" fill="#22c55e"/>
        <line x1="70" y1="68" x2="70" y2="74" stroke="#15803d" strokeWidth="1.5" strokeLinecap="round"/>

        {/* Grain / wheat stem */}
        <path d="M56 78 Q60 74 64 78" stroke="rgba(255,255,255,0.35)" strokeWidth="1" strokeLinecap="round"/>

        {/* Farm house at top (small, decorative) */}
        <path d="M53 30 L60 22 L67 30 L67 38 L53 38Z" fill="rgba(255,255,255,0.08)" stroke="rgba(255,255,255,0.2)" strokeWidth="1"/>
        <rect x="57" y="32" width="6" height="6" rx="0.5" fill="rgba(255,255,255,0.1)" stroke="rgba(255,255,255,0.2)" strokeWidth="0.8"/>

        {/* Sun */}
        <circle cx="88" cy="22" r="7" fill="rgba(251,191,36,0.25)" stroke="rgba(251,191,36,0.5)" strokeWidth="1.2"/>
        <circle cx="88" cy="22" r="4" fill="rgba(251,191,36,0.4)"/>
        {[0,45,90,135,180,225,270,315].map((deg, i) => {
          const rad = (deg * Math.PI) / 180;
          const x1 = 88 + 6 * Math.cos(rad);
          const y1 = 22 + 6 * Math.sin(rad);
          const x2 = 88 + 9 * Math.cos(rad);
          const y2 = 22 + 9 * Math.sin(rad);
          return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="rgba(251,191,36,0.5)" strokeWidth="1" strokeLinecap="round"/>;
        })}
      </svg>
    </div>

    {/* Floating stat pills */}
    <div className="hero-float hero-float-1">
      <span className="float-icon">🥕</span>
      <span className="float-text">500+ Veggies</span>
    </div>
    <div className="hero-float hero-float-2">
      <span className="float-icon">👨‍🌾</span>
      <span className="float-text">200+ Farmers</span>
    </div>
    <div className="hero-float hero-float-3">
      <span className="float-icon">🌿</span>
      <span className="float-text">100% Organic</span>
    </div>
  </div>
);

const Banner = () => (
  <section className="hero hero-farm">
    {/* Atmospheric blobs */}
    <div className="hero-blob hero-blob-1" />
    <div className="hero-blob hero-blob-2" />
    <div className="hero-blob hero-blob-3" />

    <div className="hero-inner">
      {/* ── Left: copy ── */}
      <div className="hero-content">
        <span className="hero-eyebrow">
          <span className="eyebrow-dot" />
          Harvested Fresh · No Middlemen
        </span>

        <h1 className="hero-title">
          From{' '}
          <span className="hero-highlight">Farm to Table</span>
          {' '}— Freshness You Can Taste
        </h1>

        <p className="hero-subtitle">
          100% organic produce, seasonal vegetables & wholesome foods sourced
          directly from local farmers. Delivered to your door within 24 hours —
          no preservatives, no compromise.
        </p>

        <div className="hero-actions">
          <Link to="/shop" className="hero-btn-primary">
            Shop Fresh Now
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.8"
                strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </Link>
        </div>

        {/* Trust badges */}
        <div className="hero-trust">
          <div className="trust-item">
            <span className="trust-icon">🌱</span>
            <span>100% Organic</span>
          </div>
          <div className="trust-divider" />
          <div className="trust-item">
            <span className="trust-icon">👨‍🌾</span>
            <span>Direct from Farmers</span>
          </div>
          <div className="trust-divider" />
          <div className="trust-item">
            <span className="trust-icon">🚚</span>
            <span>24-hr Delivery</span>
          </div>
          <div className="trust-divider" />
          <div className="trust-item">
            <span className="trust-icon">🚫</span>
            <span>No Preservatives</span>
          </div>
        </div>

        {/* Farm journey strip */}
        <div className="hero-journey">
          <div className="journey-step">
            <span className="journey-icon">🌾</span>
            <span className="journey-label">Grown</span>
          </div>
          <div className="journey-line" />
          <div className="journey-step">
            <span className="journey-icon">🧺</span>
            <span className="journey-label">Harvested</span>
          </div>
          <div className="journey-line" />
          <div className="journey-step">
            <span className="journey-icon">📦</span>
            <span className="journey-label">Packed</span>
          </div>
          <div className="journey-line" />
          <div className="journey-step active">
            <span className="journey-icon">🏠</span>
            <span className="journey-label">Your Door</span>
          </div>
        </div>
      </div>

      {/* ── Right: illustration ── */}
      <FarmVisual />
    </div>

    {/* Bottom wave */}
    <div className="hero-wave" aria-hidden="true">
      <svg viewBox="0 0 1440 60" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M0,40 C360,80 1080,0 1440,40 L1440,60 L0,60 Z" fill="var(--bg-primary)" />
      </svg>
    </div>
  </section>
);

export default Banner;
