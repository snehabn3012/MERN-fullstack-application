import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { addItem } from '../utils/cartHelpers';
import { API } from '../utils/config';
import { ProductGridSkeleton } from './ProductCardSkeleton';

const AUTOPLAY_MS = 3800;

const CarouselCard = ({ product, renderBadge }) => {
  const [added, setAdded] = useState(false);

  const handleAdd = (e) => {
    e.preventDefault();
    addItem(product, () => {
      setAdded(true);
      setTimeout(() => setAdded(false), 1800);
    });
  };

  return (
    <Link to={`/product/${product._id}`} className="bs-card">
      <div className="bs-card-img-wrap">
        <img
          src={`${API}/products/photo/${product._id}`}
          alt={product.name}
          className="bs-card-img"
          loading="lazy"
        />
        {renderBadge}
      </div>

      <div className="bs-card-body">
        <p className="bs-card-category">{product.category?.name || 'Product'}</p>
        <h3 className="bs-card-title">{product.name}</h3>
        <p className="bs-card-desc">
          {product.description?.substring(0, 72) || ''}
          {product.description?.length > 72 ? '…' : ''}
        </p>
        <div className="bs-card-footer">
          <span className="bs-card-price">₹ {product.price}</span>
          <button
            className={`bs-card-btn${added ? ' added' : ''}`}
            onClick={handleAdd}
          >
            {added ? '✓ Added' : 'Add to Cart'}
          </button>
        </div>
      </div>
    </Link>
  );
};

const Carousel = ({ products = [], isLoading, eyebrow, title, renderBadge }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [itemsPerView, setItemsPerView] = useState(4);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState(0);
  const timerRef = useRef(null);

  /* ── Responsive items-per-view ── */
  useEffect(() => {
    const update = () => {
      if (window.innerWidth < 640)       setItemsPerView(1);
      else if (window.innerWidth < 1024) setItemsPerView(2);
      else                               setItemsPerView(4);
    };
    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, []);

  const maxIndex = Math.max(0, products.length - itemsPerView);

  const next = useCallback(() => {
    setCurrentIndex(prev => (prev >= maxIndex ? 0 : prev + 1));
  }, [maxIndex]);

  const prev = useCallback(() => {
    setCurrentIndex(prev => (prev <= 0 ? maxIndex : prev - 1));
  }, [maxIndex]);

  /* ── Auto-play ── */
  const startTimer = useCallback(() => {
    timerRef.current = setInterval(next, AUTOPLAY_MS);
  }, [next]);

  const stopTimer = () => clearInterval(timerRef.current);

  useEffect(() => {
    startTimer();
    return stopTimer;
  }, [startTimer]);

  /* ── Touch / mouse drag ── */
  const onDragStart = (x) => { stopTimer(); setIsDragging(true); setDragStart(x); };
  const onDragEnd   = (x) => {
    if (!isDragging) return;
    setIsDragging(false);
    const diff = dragStart - x;
    if (Math.abs(diff) > 50) { diff > 0 ? next() : prev(); }
    startTimer();
  };

  if(isLoading) {
    return (
        <section className="bs-section">
            <div className="bs-container">
                <div className="bs-header">
                    <div className="bs-header-left">
                        <span className="skeleton-line w-50" style={{ height: '0.75rem', display: 'block', marginBottom: '0.5rem' }} />
                        <span className="skeleton-line w-75" style={{ height: '1.5rem', display: 'block' }} />
                    </div>
                </div>
                <ProductGridSkeleton count={4} />
            </div>
        </section>
    )
  }
  if (!products.length) return null;

  const translateX = -(currentIndex * (100 / itemsPerView));

  return (
    <section className="bs-section">
      <div className="bs-container">

        {/* ── Section header ── */}
        <div className="bs-header">
          <div className="bs-header-left">
            <span className="bs-eyebrow">{eyebrow}</span>
            <h2 className="bs-title">{title}</h2>
          </div>
          <div className="bs-nav-arrows">
            <button
              className="bs-arrow"
              onClick={() => { stopTimer(); prev(); startTimer(); }}
              aria-label="Previous"
            >
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                <path d="M11 4L6 9l5 5" stroke="currentColor" strokeWidth="2"
                  strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
            <button
              className="bs-arrow"
              onClick={() => { stopTimer(); next(); startTimer(); }}
              aria-label="Next"
            >
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                <path d="M7 4l5 5-5 5" stroke="currentColor" strokeWidth="2"
                  strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </div>
        </div>

        {/* ── Track ── */}
        <div
          className="bs-viewport"
          onMouseEnter={stopTimer}
          onMouseLeave={startTimer}
          onMouseDown={e  => onDragStart(e.clientX)}
          onMouseUp={e    => onDragEnd(e.clientX)}
          onTouchStart={e => onDragStart(e.touches[0].clientX)}
          onTouchEnd={e   => onDragEnd(e.changedTouches[0].clientX)}
        >
          <div
            className="bs-track"
            style={{ transform: `translateX(${translateX}%)` }}
          >
            {products.map(product => (
              <div
                key={product._id}
                className="bs-slide"
                style={{ flex: `0 0 ${100 / itemsPerView}%` }}
              >
                <CarouselCard product={product} renderBadge={renderBadge}/>
              </div>
            ))}
          </div>
        </div>

        {/* ── Dots ── */}
        {maxIndex > 0 && (
          <div className="bs-dots">
            {Array.from({ length: maxIndex + 1 }).map((_, i) => (
              <button
                key={i}
                className={`bs-dot${i === currentIndex ? ' active' : ''}`}
                onClick={() => { stopTimer(); setCurrentIndex(i); startTimer(); }}
                aria-label={`Go to slide ${i + 1}`}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default Carousel;
