import { useState } from 'react';
import api from '../services/api';

const InquiryForm = ({ businessId }) => {
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState('');

  const submit = async (event) => {
    event.preventDefault();
    if (message.trim().length < 5) return setStatus('Please enter a message of at least 5 characters.');
    await api.post('/inquiries', { businessId, message });
    setMessage('');
    setStatus('Inquiry sent successfully.');
  };

  return (
    <form onSubmit={submit} className="card mt-6 space-y-4">
      <div>
        <p className="eyebrow">contact owner</p>
        <h3 className="mt-1 text-xl font-black text-primary">Send Inquiry</h3>
      </div>
      <textarea className="input min-h-28" value={message} onChange={(event) => setMessage(event.target.value)} placeholder="Write your message" />
      {status && <p className="text-sm text-muted">{status}</p>}
      <button className="btn-primary w-full sm:w-auto" type="submit">Send Message</button>
    </form>
  );
};

export default InquiryForm;
