import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { useBusiness } from '../hooks/useBusiness';

const AddProduct = () => {
  const { business } = useBusiness();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', description: '', price: '' });
  const [image, setImage] = useState(null);
  const [error, setError] = useState('');

  const submit = async (event) => {
    event.preventDefault();
    if (!business?._id) return setError('Create a business profile first.');
    if (!form.name) return setError('Product name is required.');
    const payload = new FormData();
    Object.entries({ ...form, businessId: business._id }).forEach(([key, value]) => payload.append(key, value));
    if (image) payload.append('image', image);
    await api.post('/products', payload);
    navigate('/dashboard');
  };

  return (
    <form onSubmit={submit} className="card mx-auto max-w-2xl space-y-5">
      <div>
        <p className="eyebrow">catalog</p>
        <h1 className="mt-2 text-3xl font-black text-primary">Add Product</h1>
      </div>
      {error && <p className="text-sm text-danger">{error}</p>}
      <label className="block"><span className="label">Name</span><input className="input" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></label>
      <label className="block"><span className="label">Description</span><textarea className="input min-h-24" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} /></label>
      <label className="block"><span className="label">Price</span><input className="input" type="number" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} /></label>
      <label className="block"><span className="label">Image</span><input className="input" type="file" accept="image/*" onChange={(e) => setImage(e.target.files[0])} /></label>
      <button className="btn-primary w-full sm:w-auto">Save Product</button>
    </form>
  );
};

export default AddProduct;
