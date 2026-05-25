import { Search } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const SearchBar = ({ initialQuery = '' }) => {
  const [q, setQ] = useState(initialQuery);
  const navigate = useNavigate();

  const submit = (event) => {
    event.preventDefault();
    navigate(`/search?q=${encodeURIComponent(q)}`);
  };

  return (
    <form onSubmit={submit} className="flex flex-col gap-3 rounded-2xl border border-border bg-white p-2 sm:flex-row">
      <div className="relative flex-1">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted" size={18} />
        <input className="h-12 w-full rounded-xl border-0 bg-transparent pl-11 pr-4 text-sm outline-none" value={q} onChange={(event) => setQ(event.target.value)} placeholder="Search businesses, categories or services" />
      </div>
      <button className="btn-accent" type="submit">Search</button>
    </form>
  );
};

export default SearchBar;
