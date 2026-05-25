import { useEffect, useState } from 'react';
import api from '../services/api';
import { useBusiness } from '../hooks/useBusiness';

const Inquiries = () => {
  const { business } = useBusiness();
  const [inquiries, setInquiries] = useState([]);

  const load = () => {
    if (business?._id) api.get(`/inquiries/business/${business._id}`).then(({ data }) => setInquiries(data.data));
  };

  useEffect(() => {
    load();
  }, [business?._id]);

  const markRead = async (id) => {
    await api.patch(`/inquiries/${id}/read`);
    load();
  };

  return (
    <section className="space-y-4">
      <div className="rounded-[2rem] bg-primary p-6 text-white">
        <p className="eyebrow">messages</p>
        <h1 className="mt-2 text-3xl font-black">Customer Inquiries</h1>
        <p className="mt-2 text-white/90">Read and manage messages from customers interested in your business.</p>
      </div>
      {inquiries.map((inquiry) => (
        <article key={inquiry._id} className="card">
          <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-start">
            <div>
              <p className="font-bold text-primary">{inquiry.senderName} <span className="text-sm font-normal text-muted">{inquiry.senderEmail}</span></p>
              <p className="mt-2 leading-6 text-muted">{inquiry.message}</p>
            </div>
            {!inquiry.isRead && <button className="btn-primary" onClick={() => markRead(inquiry._id)}>Mark Read</button>}
          </div>
        </article>
      ))}
    </section>
  );
};

export default Inquiries;
