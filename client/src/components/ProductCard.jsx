import { mediaUrl } from '../utils/media';

const ProductCard = ({ product }) => (
  <article className="group overflow-hidden rounded-3xl border border-border/80 bg-white transition hover:-translate-y-1">
    <div className="h-36 bg-border">
      {product.imageUrl && <img src={mediaUrl(product.imageUrl)} alt="" className="h-full w-full object-cover transition duration-500 group-hover:scale-105" />}
    </div>
    <div className="p-5">
      <div className="flex items-start justify-between gap-3">
        <h3 className="font-bold text-text">{product.name}</h3>
        <span className={`rounded-full px-2.5 py-1 text-xs font-bold ${product.inStock ? 'bg-success/10 text-green-700' : 'bg-danger/10 text-danger'}`}>{product.inStock ? 'In stock' : 'Out'}</span>
      </div>
      <p className="mt-2 line-clamp-2 text-sm text-muted">{product.description}</p>
      <p className="mt-4 text-lg font-extrabold text-primary">{product.price ? `₦${Number(product.price).toLocaleString()}` : 'Contact for price'}</p>
    </div>
  </article>
);

export default ProductCard;
