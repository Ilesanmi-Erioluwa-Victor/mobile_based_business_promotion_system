import { CreditCard, Loader2 } from 'lucide-react';
import { usePaystack } from '../hooks/usePaystack';

const PaystackButton = ({ type, businessId, promotionId, label, amount, onSuccess }) => {
  const { initializePayment, loading, error } = usePaystack();

  const handleClick = async () => {
    try {
      await initializePayment({
        type,
        businessId,
        promotionId,
        amount,
        onSuccess: (payment) => {
          window.alert('Payment successful');
          onSuccess?.(payment);
        }
      });
    } catch (err) {
      window.alert(err.message);
    }
  };

  return (
    <div>
      <button className="btn-accent" onClick={handleClick} disabled={loading || !businessId}>
        {loading ? <Loader2 size={16} className="animate-spin" /> : <CreditCard size={16} />} {label}
      </button>
      {error && <p className="mt-2 text-sm text-danger">{error}</p>}
    </div>
  );
};

export default PaystackButton;
