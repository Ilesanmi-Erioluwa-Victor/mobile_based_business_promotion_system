import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import api from '../services/api';
import BusinessCard from '../components/BusinessCard';
import SearchBar from '../components/SearchBar';
import { BUSINESS_CATEGORIES, NIGERIAN_STATES } from '../utils/options';

const SearchResults = () => {
  const [params, setParams] = useSearchParams();
  const [items, setItems] = useState([]);
  const [filters, setFilters] = useState({ category: params.get('category') || '', state: params.get('state') || '' });
  const q = params.get('q') || '';

  useEffect(() => {
    api.get(`/search?${params.toString()}`).then(({ data }) => setItems(data.data.items));
  }, [params]);

  const apply = () => {
    const next = new URLSearchParams(params);
    filters.category ? next.set('category', filters.category) : next.delete('category');
    filters.state ? next.set('state', filters.state) : next.delete('state');
    setParams(next);
  };

  return (
    <div className="space-y-6">
      <div className="rounded-[2rem] bg-primary p-6 text-white">
        <p className="eyebrow">business directory</p>
        <h1 className="mt-2 text-3xl font-black">Find trusted small businesses</h1>
        <p className="mt-2 text-white/90">Search by product, service, category or state.</p>
        <div className="mt-5"><SearchBar initialQuery={q} /></div>
      </div>
      <div className="grid gap-5 lg:grid-cols-[260px_1fr]">
        <aside className="card h-fit space-y-4 lg:sticky lg:top-24">
          <h2 className="font-bold text-primary">Filters</h2>
          <select className="input" value={filters.category} onChange={(e) => setFilters({ ...filters, category: e.target.value })}><option value="">All categories</option>{BUSINESS_CATEGORIES.map((category) => <option key={category} value={category}>{category}</option>)}</select>
          <select className="input" value={filters.state} onChange={(e) => setFilters({ ...filters, state: e.target.value })}><option value="">All states</option>{NIGERIAN_STATES.map((state) => <option key={state} value={state}>{state}</option>)}</select>
          <button className="btn-primary w-full" onClick={apply}>Apply</button>
        </aside>
        <section className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {items.map((business) => <BusinessCard key={business._id} business={business} />)}
          {!items.length && <p className="text-muted">No listed businesses found.</p>}
        </section>
      </div>
    </div>
  );
};

export default SearchResults;
