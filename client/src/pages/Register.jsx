import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useAuth } from '../hooks/useAuth';

const Register = () => {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'customer' });
  const [error, setError] = useState('');

  const submit = async (event) => {
    event.preventDefault();
    if (!form.name || !form.email.includes('@') || form.password.length < 6) return setError('Name, valid email and 6-character password are required.');
    try {
      const response = await register(form);
      navigate(response.data.user.role === 'owner' ? '/business/add' : '/');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <section className="mx-auto grid max-w-5xl overflow-hidden rounded-[2rem] bg-white lg:grid-cols-[0.9fr_1.1fr]">
      <div className="bg-primary p-8 text-white">
        <p className="eyebrow">join bizpromo</p>
        <h1 className="mt-3 text-4xl font-black">Create your account</h1>
        <p className="mt-4 text-white/90">Customers can discover businesses. Owners can publish profiles and promote offers.</p>
      </div>
      <form onSubmit={submit} className="space-y-4 p-6 sm:p-8">
        <h2 className="text-2xl font-bold text-primary">Register</h2>
        {error && <p className="rounded bg-danger/10 p-3 text-sm text-danger">{error}</p>}
        <label className="block"><span className="label">Name</span><input className="input" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></label>
        <label className="block"><span className="label">Email</span><input className="input" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} /></label>
        <label className="block"><span className="label">Password</span><input className="input" type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} /></label>
        <label className="block"><span className="label">Role</span><select className="input" value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })}><option value="customer">Customer</option><option value="owner">Business Owner</option></select></label>
        <button className="btn-primary w-full">Register</button>
        <p className="text-sm text-muted">Already registered? <Link className="font-semibold text-primary" to="/login">Login</Link></p>
      </form>
    </section>
  );
};

export default Register;
