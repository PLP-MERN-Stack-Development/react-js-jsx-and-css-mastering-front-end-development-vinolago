import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import Card from '../components/Card';
import Button from '../components/Button';

const PAGE_SIZE = 10;

export default function ApiData({ theme }) {
  const [items, setItems] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [query, setQuery] = useState('');
  const [hasMore, setHasMore] = useState(true);

  const observer = useRef();
  const lastItemRef = useRef();

  useEffect(() => {
    setItems([]);
    setPage(1);
    setHasMore(true);
  }, [query]);

  useEffect(() => {
    let cancelled = false;
    async function fetchPage() {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`https://fakestoreapi.com/products`);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        if (cancelled) return;
        const sliced = data.slice(0, PAGE_SIZE * page);
        setItems(sliced);
        setHasMore(sliced.length < data.length);
      } catch (err) {
        setError(err.message || 'Unknown error');
      } finally {
        setLoading(false);
      }
    }
    fetchPage();
    return () => { cancelled = true; };
  }, [page]);

  useEffect(() => {
    if (loading) return;
    if (observer.current) observer.current.disconnect();
    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore) {
        setPage(p => p + 1);
      }
    });
    if (lastItemRef.current) observer.current.observe(lastItemRef.current);
  }, [loading, hasMore]);

  const filtered = items.filter(i => {
    if (!query) return true;
    const q = query.toLowerCase();
    return (
      i.title.toLowerCase().includes(q) ||
      i.description.toLowerCase().includes(q) ||
      i.category.toLowerCase().includes(q)
    );
  });

  return (
    <Card title="Products from FakeStoreAPI" theme={theme} className="mt-8" shadow>
      <div className="flex items-center gap-2 mb-4">
        <input
          aria-label="Search products"
          placeholder="Search products..."
          value={query}
          onChange={e => setQuery(e.target.value)}
          className="px-3 py-2 border rounded flex-1"
        />
        <Button variant="primary" onClick={() => { setItems([]); setPage(1); setHasMore(true); }}>
          Search
        </Button>
      </div>

      {error && (
        <div className="text-red-600 mb-4">Error: {error}</div>
      )}

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((product, idx) => {
          const isLast = idx === filtered.length - 1;
          return (
            <div
              key={product.id}
              ref={isLast ? lastItemRef : null}
              className="flex flex-col bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden border border-gray-200 dark:border-gray-700 transition-transform duration-200 hover:-translate-y-1 hover:shadow-xl animate-fadeIn"
            >
              <div className="flex-shrink-0 bg-gray-100 dark:bg-gray-900 flex items-center justify-center h-48">
                <img src={product.image} alt={product.title} className="h-32 object-contain" />
              </div>
              <div className="flex-1 flex flex-col p-4">
                <h4 className="font-semibold text-lg mb-1 truncate" title={product.title}>{product.title}</h4>
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">{product.category}</p>
                <p className="text-sm text-gray-700 dark:text-gray-300 mb-2 line-clamp-3">{product.description}</p>
                <div className="mt-auto flex items-center justify-between">
                  <span className="font-bold text-blue-600 dark:text-blue-400 text-lg">${product.price}</span>
                  <Button variant="primary" size="sm">View</Button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-4 flex items-center justify-center gap-2">
        {loading && <div>Loading...</div>}
        {!loading && hasMore && (
          <Button onClick={() => setPage(p => p + 1)}>Load more</Button>
        )}
      </div>
    </Card>
  );
}

ApiData.propTypes = {
  theme: PropTypes.string,
};
