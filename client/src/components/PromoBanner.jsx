import { mediaUrl } from '../utils/media';

const PromoBanner = ({ promotion }) => (
  <article className="min-w-[280px] overflow-hidden rounded-3xl border border-border/80 bg-white">
    {promotion.imageUrl && <img src={mediaUrl(promotion.imageUrl)} alt="" className="h-32 w-full object-cover" />}
    <div className="p-5">
      {promotion.isBoosted && <span className="mb-3 inline-flex rounded-full bg-accent px-3 py-1 text-xs font-bold text-text">★ Featured</span>}
      <h3 className="font-bold text-primary">{promotion.title}</h3>
      <p className="mt-2 line-clamp-2 text-sm text-muted">{promotion.description}</p>
      <p className="mt-4 inline-flex rounded-full bg-danger/10 px-3 py-1 text-sm font-bold text-danger">{promotion.discount}</p>
      {promotion.business?.name && <p className="mt-3 text-xs font-semibold text-muted">{promotion.business.name}</p>}
    </div>
  </article>
);

export default PromoBanner;
