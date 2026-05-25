import { Link } from 'react-router-dom';
import { ArrowUpRight, MapPin, Phone, ShieldCheck } from 'lucide-react';
import { mediaUrl } from '../utils/media';

const BusinessCard = ({ business }) => (
  <article className="group flex h-full flex-col overflow-hidden rounded-3xl border border-border/80 bg-white transition hover:-translate-y-1">
    <div className="relative h-40 bg-primary/10">
      {(business.coverImageUrl || business.logoUrl) && <img src={mediaUrl(business.coverImageUrl || business.logoUrl)} alt="" className="h-full w-full object-cover transition duration-500 group-hover:scale-105" />}
      <span className="absolute left-3 top-3 rounded-full bg-white/95 px-3 py-1 text-xs font-bold text-primary">{business.category}</span>
      {business.isVerified && <span className="absolute right-3 top-3 grid h-8 w-8 place-items-center rounded-full bg-success text-white"><ShieldCheck size={16} /></span>}
    </div>
    <div className="flex flex-1 flex-col p-5">
      <div className="flex items-start justify-between gap-3">
        <h3 className="text-lg font-bold text-text">{business.name}</h3>
      </div>
      <p className="mt-2 line-clamp-3 text-sm text-muted">{business.description}</p>
      <div className="mt-4 space-y-1 text-xs font-medium text-muted">
        <p className="flex items-center gap-1.5"><MapPin size={14} /> {business.state || 'Nigeria'}</p>
        {business.phone && <p className="flex items-center gap-1.5"><Phone size={14} /> {business.phone}</p>}
      </div>
      <Link to={`/businesses/${business._id}`} className="mt-5 inline-flex items-center justify-between rounded-2xl bg-primary/5 px-4 py-3 text-sm font-bold text-primary transition group-hover:bg-primary group-hover:text-white">
        View Profile <ArrowUpRight size={16} />
      </Link>
    </div>
  </article>
);

export default BusinessCard;
