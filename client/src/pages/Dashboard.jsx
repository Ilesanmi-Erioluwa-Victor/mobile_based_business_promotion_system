import { Link } from 'react-router-dom';
import { useCallback, useEffect, useMemo, useState } from 'react';
import api from '../services/api';
import PaystackButton from '../components/PaystackButton';
import { useBusiness } from '../hooks/useBusiness';
import { getPaymentHistory, verifyPayment } from '../services/paystack';
import ProductCard from '../components/ProductCard';
import PromoBanner from '../components/PromoBanner';
import { BarChart3, CheckCircle2, CreditCard, Inbox, Package, Plus, RadioTower } from 'lucide-react';

const Dashboard = () => {
  const { business, loading, fetchMyBusiness } = useBusiness();
  const [products, setProducts] = useState([]);
  const [promotions, setPromotions] = useState([]);
  const [inquiries, setInquiries] = useState([]);
  const [payments, setPayments] = useState([]);

  const loadDashboardData = useCallback(async () => {
    if (!business?._id) return;
    const [productsRes, promotionsRes, paymentsRes] = await Promise.all([
      api.get(`/products/business/${business._id}`),
      api.get(`/promotions/business/${business._id}`),
      getPaymentHistory()
    ]);
    setProducts(productsRes.data.data);
    setPromotions(promotionsRes.data.data);
    setPayments(paymentsRes);
    try {
      const { data } = await api.get(`/inquiries/business/${business._id}`);
      setInquiries(data.data);
    } catch {
      setInquiries([]);
    }
  }, [business?._id]);

  useEffect(() => {
    loadDashboardData();
  }, [loadDashboardData]);

  const handlePaymentSuccess = async () => {
    await fetchMyBusiness();
    await getPaymentHistory().then(setPayments);
    await loadDashboardData();
  };

  const verifyPendingPayment = async (reference) => {
    await verifyPayment(reference);
    await handlePaymentSuccess();
  };

  const completeness = useMemo(() => {
    if (!business) return 0;
    const fields = ['name', 'category', 'description', 'address', 'state', 'phone', 'logoUrl'];
    return Math.round((fields.filter((field) => Boolean(business[field])).length / fields.length) * 100);
  }, [business]);

  if (loading) return <p className="text-muted">Loading dashboard...</p>;
  if (!business) return <div className="glass-panel p-8"><h1 className="text-2xl font-black text-primary">Business Dashboard</h1><p className="mt-2 text-muted">Create a profile before publishing your business.</p><Link className="btn-primary mt-5" to="/business/add"><Plus size={16} /> Create Business</Link></div>;

  return (
    <div className="space-y-7">
      <div className="grid gap-5 rounded-[2rem] bg-primary p-6 text-white lg:grid-cols-[1fr_auto] lg:p-8">
        <div>
          <p className="eyebrow">owner workspace</p>
          <h1 className="mt-2 text-3xl font-black tracking-tight sm:text-4xl">{business.name}</h1>
          <p className="mt-2 max-w-2xl text-white/90">{business.category} business in {business.state}. Manage products, promotions, inquiries and publishing payments from one dashboard.</p>
        </div>
        <div className="flex flex-wrap gap-3 lg:items-start">
          <Link className="btn-accent" to={`/business/edit/${business._id}`}>Edit Business</Link>
          <Link className="rounded-xl border border-white/20 px-5 py-3 text-sm font-bold text-white transition hover:bg-white/10" to={`/businesses/${business._id}`}>View Public Page</Link>
        </div>
      </div>

      {!business.isListed ? (
        <div className="rounded-3xl border border-accent/40 bg-accent/15 p-5">
          <p className="font-bold text-primary">Your business is not yet listed. Pay ₦2,000 to publish your business.</p>
          <p className="mt-1 text-sm text-muted">Once Paystack verifies the payment, your business becomes visible in search and public listings.</p>
          <div className="mt-3"><PaystackButton type="listing" businessId={business._id} label="Pay & Publish (₦2,000)" amount={2000} onSuccess={handlePaymentSuccess} /></div>
        </div>
      ) : (
        <div className="flex items-center gap-3 rounded-3xl border border-success/40 bg-success/10 p-5 font-bold text-primary"><CheckCircle2 className="text-success" /> Business is live and visible to customers</div>
      )}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="card"><Package className="text-accent" /><p className="mt-3 text-sm font-semibold text-muted">Products</p><p className="text-3xl font-black text-primary">{products.length}</p></div>
        <div className="card"><Inbox className="text-accent" /><p className="mt-3 text-sm font-semibold text-muted">Inquiries</p><p className="text-3xl font-black text-primary">{inquiries.length}</p></div>
        <div className="card"><RadioTower className="text-accent" /><p className="mt-3 text-sm font-semibold text-muted">Promotions</p><p className="text-3xl font-black text-primary">{promotions.length}</p></div>
        <div className="card"><BarChart3 className="text-accent" /><p className="mt-3 text-sm font-semibold text-muted">Completeness</p><p className="text-3xl font-black text-primary">{completeness}%</p></div>
      </div>

      <div className="card">
        <div className="mb-2 flex justify-between text-sm"><span>Profile completeness</span><span>{completeness}%</span></div>
        <div className="h-3 rounded-full bg-border"><div className="h-3 rounded-full bg-success" style={{ width: `${completeness}%` }} /></div>
      </div>

      <div className="flex flex-wrap gap-3">
        <Link className="btn-primary" to="/products/add"><Plus size={16} /> Add Product</Link>
        <Link className="btn-primary" to="/promotions"><RadioTower size={16} /> Add Promotion</Link>
        <Link className="btn-primary" to="/inquiries"><Inbox size={16} /> View Inquiries</Link>
      </div>

      <section>
        <div className="mb-3 flex items-center justify-between">
          <h2 className="section-title">Products</h2>
          <Link className="text-sm font-bold text-primary" to="/products/add">Add Product</Link>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((product) => <ProductCard key={product._id} product={product} />)}
          {!products.length && <div className="card text-sm text-muted">No products added yet.</div>}
        </div>
      </section>

      <section>
        <div className="mb-3 flex items-center justify-between">
          <h2 className="section-title">Promotions</h2>
          <Link className="text-sm font-bold text-primary" to="/promotions">Manage Promotions</Link>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {promotions.map((promotion) => <PromoBanner key={promotion._id} promotion={promotion} />)}
          {!promotions.length && <div className="card text-sm text-muted">No promotions created yet.</div>}
        </div>
      </section>

      <section className="card overflow-x-auto">
        <div className="mb-3 flex items-center gap-2"><CreditCard className="text-accent" /><h2 className="text-lg font-bold text-primary">Payment History</h2></div>
        <table className="table-modern">
          <thead><tr><th>Reference</th><th>Type</th><th>Amount</th><th>Status</th><th>Date</th><th>Action</th></tr></thead>
          <tbody>{payments.map((payment) => <tr key={payment._id}><td className="font-semibold text-primary">{payment.reference}</td><td className="capitalize">{payment.type}</td><td>₦{(payment.amount / 100).toLocaleString()}</td><td><span className={`rounded-full px-3 py-1 text-xs font-bold ${payment.status === 'success' ? 'bg-success/10 text-green-700' : payment.status === 'failed' ? 'bg-danger/10 text-danger' : 'bg-accent/15 text-primary'}`}>{payment.status}</span></td><td>{new Date(payment.createdAt).toLocaleDateString()}</td><td>{payment.status === 'pending' && <button className="rounded-xl border border-primary px-3 py-2 text-xs font-bold text-primary" onClick={() => verifyPendingPayment(payment.reference)}>Verify</button>}</td></tr>)}</tbody>
        </table>
      </section>
    </div>
  );
};

export default Dashboard;
