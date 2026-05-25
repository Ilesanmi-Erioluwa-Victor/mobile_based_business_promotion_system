import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../services/api';
import { BUSINESS_CATEGORIES, NIGERIAN_STATES } from '../utils/options';

const EditBusiness = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState(null);

  useEffect(() => {
    api.get(`/businesses/${id}`).then(({ data }) => setForm(data.data.business));
  }, [id]);

  const submit = async (event) => {
    event.preventDefault();
    await api.put(`/businesses/${id}`, form);
    navigate('/dashboard');
  };

  if (!form) return <p>Loading business...</p>;

  return (
    <form onSubmit={submit} className="card mx-auto max-w-3xl space-y-5">
      <div>
        <p className="eyebrow">profile settings</p>
        <h1 className="mt-2 text-3xl font-black text-primary">Edit Business</h1>
      </div>
      <label className="block"><span className="label">Name</span><input className="input" value={form.name || ''} onChange={(e) => setForm({ ...form, name: e.target.value })} /></label>
      <label className="block"><span className="label">Category</span><select className="input" value={form.category || ''} onChange={(e) => setForm({ ...form, category: e.target.value })}><option value="">Select category</option>{BUSINESS_CATEGORIES.map((category) => <option key={category} value={category}>{category}</option>)}</select></label>
      <label className="block"><span className="label">State</span><select className="input" value={form.state || ''} onChange={(e) => setForm({ ...form, state: e.target.value })}><option value="">Select state</option>{NIGERIAN_STATES.map((state) => <option key={state} value={state}>{state}</option>)}</select></label>
      <label className="block"><span className="label">Address</span><input className="input" value={form.address || ''} onChange={(e) => setForm({ ...form, address: e.target.value })} /></label>
      <label className="block"><span className="label">Phone</span><input className="input" value={form.phone || ''} onChange={(e) => setForm({ ...form, phone: e.target.value })} /></label>
      <label className="block"><span className="label">Email</span><input className="input" value={form.email || ''} onChange={(e) => setForm({ ...form, email: e.target.value })} /></label>
      <label className="block"><span className="label">Description</span><textarea className="input min-h-28" value={form.description || ''} onChange={(e) => setForm({ ...form, description: e.target.value })} /></label>
      <button className="btn-primary w-full sm:w-auto">Update Business</button>
    </form>
  );
};

export default EditBusiness;
