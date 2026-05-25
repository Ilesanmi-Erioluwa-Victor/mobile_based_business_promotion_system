import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { verifyPayment } from '../services/paystack';

const PaymentSuccess = () => {
  const [params] = useSearchParams();
  const [payment, setPayment] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const reference = params.get('reference');
    if (!reference) return setError('Payment reference is missing.');
    verifyPayment(reference).then(setPayment).catch((err) => setError(err.response?.data?.message || 'Verification failed'));
  }, [params]);

  if (error) return <div className="card"><p className="text-danger">{error}</p><Link className="btn-primary mt-4" to="/dashboard">Back to Dashboard</Link></div>;
  if (!payment) return <p>Verifying payment...</p>;

  return (
    <section className="glass-panel mx-auto max-w-lg p-8 text-center">
      <h1 className="text-3xl font-black text-success">Payment Verified</h1>
      <p className="mt-3 text-muted">Your {payment.type} payment of ₦{(payment.amount / 100).toLocaleString()} was successful.</p>
      <p className="mt-2 text-sm text-muted">Reference: {payment.reference}</p>
      <Link className="btn-primary mt-5" to="/dashboard">Back to Dashboard</Link>
    </section>
  );
};

export default PaymentSuccess;
