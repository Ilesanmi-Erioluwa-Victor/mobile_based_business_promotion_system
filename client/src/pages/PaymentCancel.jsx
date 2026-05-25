import { Link } from 'react-router-dom';

const PaymentCancel = () => (
  <section className="glass-panel mx-auto max-w-lg p-8 text-center">
    <h1 className="text-3xl font-black text-primary">Payment was not completed.</h1>
    <p className="mt-3 text-muted">You can try again from your Dashboard.</p>
    <Link className="btn-primary mt-5" to="/dashboard">Back to Dashboard</Link>
  </section>
);

export default PaymentCancel;
