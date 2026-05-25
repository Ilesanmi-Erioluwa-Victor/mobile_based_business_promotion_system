import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { BUSINESS_CATEGORIES, NIGERIAN_STATES } from '../utils/options';

const AddBusiness = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', category: '', state: '', address: '', phone: '', description: '' });
  const [logo, setLogo] = useState(null);
  const [error, setError] = useState('');

  const submit = async (event) => {
    event.preventDefault();
    if (!form.name || !form.category || !form.state || !form.phone) return setError('Name, category, state and phone are required.');
    const payload = new FormData();
    Object.entries(form).forEach(([key, value]) => payload.append(key, value));
    if (logo) payload.append('logo', logo);
    await api.post('/businesses', payload);
    navigate('/dashboard', { state: { message: 'Business created! Complete payment to make it visible to customers.' } });
  };

  return (
    <form onSubmit={submit} className="card mx-auto max-w-3xl space-y-5">
      <div>
        <p className="eyebrow">owner setup</p>
        <h1 className="mt-2 text-3xl font-black text-primary">Create Business Profile</h1>
      </div>
      {error && <p className="rounded bg-danger/10 p-3 text-sm text-danger">{error}</p>}
      <label className="block"><span className="label">Name</span><input className="input" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></label>
      <label className="block"><span className="label">Category</span><select className="input" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}><option value="">Select category</option>{BUSINESS_CATEGORIES.map((category) => <option key={category} value={category}>{category}</option>)}</select></label>
      <label className="block"><span className="label">State</span><select className="input" value={form.state} onChange={(e) => setForm({ ...form, state: e.target.value })}><option value="">Select state</option>{NIGERIAN_STATES.map((state) => <option key={state} value={state}>{state}</option>)}</select></label>
      <label className="block"><span className="label">Address</span><input className="input" value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} /></label>
      <label className="block"><span className="label">Phone</span><input className="input" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} /></label>
      <label className="block"><span className="label">Description</span><textarea className="input min-h-28" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} /></label>
      <label className="block"><span className="label">Logo</span><input className="input" type="file" accept="image/*" onChange={(e) => setLogo(e.target.files[0])} /></label>
      <button className="btn-primary w-full sm:w-auto">Save Business</button>
    </form>
  );
};

export default AddBusiness;
