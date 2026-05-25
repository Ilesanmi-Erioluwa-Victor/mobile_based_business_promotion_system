import { useEffect, useState } from 'react';
import api from '../services/api';
import PaystackButton from '../components/PaystackButton';
import { useBusiness } from '../hooks/useBusiness';

const Promotions = () => {
  const { business } = useBusiness();
  const [promotions, setPromotions] = useState([]);
  const [form, setForm] = useState({ title: '', discount: '', description: '' });
  const [image, setImage] = useState(null);
  const [error, setError] = useState('');

  const load = () => api.get('/promotions/mine').then(({ data }) => setPromotions(data.data));

  useEffect(() => {
    load();
  }, []);

  const submit = async (event) => {
    event.preventDefault();
    if (!business?._id) return setError('Create a business first.');
    if (!form.title) return setError('Promotion title is required.');
    const payload = new FormData();
    Object.entries({ ...form, businessId: business._id }).forEach(([key, value]) => payload.append(key, value));
    if (image) payload.append('image', image);
    await api.post('/promotions', payload);
    setForm({ title: '', discount: '', description: '' });
    setImage(null);
    load();
  };

  return (
    <div className="grid gap-6 lg:grid-cols-[380px_1fr]">
      <form onSubmit={submit} className="card h-fit space-y-4 lg:sticky lg:top-24">
        <p className="eyebrow">owner offer</p>
        <h1 className="text-2xl font-black text-primary">Add Promotion</h1>
        {error && <p className="text-sm text-danger">{error}</p>}
        <label className="block"><span className="label">Title</span><input className="input" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} /></label>
        <label className="block"><span className="label">Discount</span><input className="input" value={form.discount} onChange={(e) => setForm({ ...form, discount: e.target.value })} /></label>
        <label className="block"><span className="label">Description</span><textarea className="input min-h-24" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} /></label>
        <label className="block"><span className="label">Image</span><input className="input" type="file" accept="image/*" onChange={(e) => setImage(e.target.files[0])} /></label>
        <button className="btn-primary">Create Promotion</button>
      </form>
      <section className="space-y-4">
        <h2 className="section-title">Your Promotions</h2>
        {promotions.map((promo) => (
          <article key={promo._id} className="card">
            <div className="flex flex-col justify-between gap-3 md:flex-row md:items-start">
              <div>
                <h3 className="text-lg font-bold text-primary">{promo.title} {promo.isBoosted && <span className="rounded-full bg-accent px-3 py-1 text-xs text-text">★ Featured</span>}</h3>
                <p className="mt-1 text-sm text-muted">{promo.description}</p>
                {!promo.isBoosted && <p className="mt-3 text-sm font-medium">Boost this promotion for ₦500 — get featured on the homepage</p>}
              </div>
              {!promo.isBoosted && <PaystackButton type="boost" businessId={promo.business?._id || business?._id} promotionId={promo._id} label="Boost (₦500)" amount={500} onSuccess={load} />}
            </div>
          </article>
        ))}
      </section>
    </div>
  );
};

export default Promotions;
