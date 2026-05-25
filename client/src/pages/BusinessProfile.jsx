import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../services/api';
import ProductCard from '../components/ProductCard';
import InquiryForm from '../components/InquiryForm';
import PromoBanner from '../components/PromoBanner';
import { mediaUrl } from '../utils/media';

const BusinessProfile = () => {
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [tab, setTab] = useState('Products');

  useEffect(() => {
    api.get(`/businesses/${id}`).then((res) => setData(res.data.data));
  }, [id]);

  if (!data) return <p>Loading profile...</p>;
  const { business, products, promotions } = data;

  return (
    <div className="space-y-7">
      <section className="overflow-hidden rounded-[2rem] border border-border/80 bg-white">
        <div className="h-56 bg-primary/20 sm:h-72">{(business.coverImageUrl || business.logoUrl) && <img src={mediaUrl(business.coverImageUrl || business.logoUrl)} alt="" className="h-full w-full object-cover" />}</div>
        <div className="p-5 sm:p-7">
          <div className="-mt-16 mb-4 h-24 w-24 rounded-3xl border-4 border-white bg-accent/20">{business.logoUrl && <img src={mediaUrl(business.logoUrl)} alt="" className="h-full w-full rounded-2xl object-cover" />}</div>
          <span className="pill">{business.category}</span>
          <h1 className="mt-3 text-3xl font-black text-primary sm:text-4xl">{business.name}</h1>
          <p className="mt-2 text-muted">{business.address} • {business.phone}</p>
          <p className="mt-4 max-w-3xl text-sm leading-6 text-muted">{business.description}</p>
        </div>
      </section>

      <div className="flex gap-2 overflow-x-auto rounded-2xl border border-border bg-white p-2">
        {['Products', 'Promotions', 'About'].map((name) => <button key={name} onClick={() => setTab(name)} className={`rounded-xl px-5 py-3 text-sm font-bold transition ${tab === name ? 'bg-primary text-white' : 'text-muted hover:bg-background'}`}>{name}</button>)}
      </div>

      {tab === 'Products' && <section className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">{products.map((product) => <ProductCard key={product._id} product={product} />)}</section>}
      {tab === 'Promotions' && <section className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">{promotions.map((promotion) => <PromoBanner key={promotion._id} promotion={promotion} />)}</section>}
      {tab === 'About' && <section className="card"><p className="text-muted">{business.description}</p></section>}

      <InquiryForm businessId={business._id} />
    </div>
  );
};

export default BusinessProfile;
