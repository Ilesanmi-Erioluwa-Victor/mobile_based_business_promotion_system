import { useEffect, useState } from 'react';
import api from '../services/api';

const AdminPanel = () => {
  const [businesses, setBusinesses] = useState([]);

  useEffect(() => {
    api.get('/businesses?limit=50').then(({ data }) => setBusinesses(data.data.items));
  }, []);

  return (
    <section className="space-y-4">
      <div className="rounded-[2rem] bg-primary p-6 text-white">
        <p className="eyebrow">system overview</p>
        <h1 className="mt-2 text-3xl font-black">Admin Panel</h1>
      </div>
      <div className="card overflow-x-auto">
        <table className="table-modern">
          <thead><tr><th>Business</th><th>Category</th><th>State</th><th>Status</th></tr></thead>
          <tbody>{businesses.map((business) => <tr key={business._id}><td className="font-bold text-primary">{business.name}</td><td>{business.category}</td><td>{business.state}</td><td><span className="rounded-full bg-success/10 px-3 py-1 text-xs font-bold text-green-700">{business.isListed ? 'Listed' : 'Hidden'}</span></td></tr>)}</tbody>
        </table>
      </div>
    </section>
  );
};

export default AdminPanel;
