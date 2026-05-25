import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, BadgeCheck, Megaphone, Users } from 'lucide-react';
import api from '../services/api';
import BusinessCard from '../components/BusinessCard';
import PromoBanner from '../components/PromoBanner';
import SearchBar from '../components/SearchBar';
import { BUSINESS_CATEGORIES } from '../utils/options';

const Home = () => {
  const [businesses, setBusinesses] = useState([]);
  const [promotions, setPromotions] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    api.get('/businesses?limit=9').then(({ data }) => setBusinesses(data.data.items));
    api.get('/promotions').then(({ data }) => setPromotions(data.data));
  }, []);

  return (
    <div className="space-y-10">
      <section className="grid overflow-hidden rounded-[2rem] bg-primary text-white lg:grid-cols-[1.2fr_0.8fr]">
        <div className="p-6 sm:p-10 lg:p-12">
          <p className="eyebrow">Small business marketplace</p>
          <h1 className="mt-4 max-w-3xl text-4xl font-black leading-tight tracking-tight sm:text-6xl">Promote Your Business. Reach More Customers.</h1>
          <p className="mt-5 max-w-2xl text-base leading-7 text-white/90">Discover trusted small-scale enterprises, live offers, products and services across Nigeria from one mobile-friendly platform.</p>
          <div className="mt-8 max-w-2xl"><SearchBar /></div>
          <div className="mt-8 grid gap-3 sm:grid-cols-3">
            <div className="rounded-2xl bg-white/10 p-4"><BadgeCheck className="text-accent" /><p className="mt-2 text-2xl font-black">{businesses.length}+</p><p className="text-xs text-white/85">listed businesses</p></div>
            <div className="rounded-2xl bg-white/10 p-4"><Megaphone className="text-accent" /><p className="mt-2 text-2xl font-black">{promotions.length}+</p><p className="text-xs text-white/85">active promos</p></div>
            <div className="rounded-2xl bg-white/10 p-4"><Users className="text-accent" /><p className="mt-2 text-2xl font-black">24/7</p><p className="text-xs text-white/85">mobile access</p></div>
          </div>
        </div>
        <div className="bg-white/10 p-5 sm:p-8 lg:border-l lg:border-white/10">
          <div className="mb-4 flex items-center justify-between">
            <p className="font-bold">Featured promotions</p>
            <Link className="text-sm font-semibold text-accent" to="/promotions">See all</Link>
          </div>
          <div className="space-y-4">
            {promotions.slice(0, 2).map((promo) => <PromoBanner key={promo._id} promotion={promo} />)}
          </div>
        </div>
      </section>

      <section className="glass-panel p-4">
        <div className="flex gap-3 overflow-x-auto pb-1">
          {BUSINESS_CATEGORIES.map((category) => <button key={category} onClick={() => navigate(`/search?category=${category}`)} className="shrink-0 rounded-full border border-border bg-white px-5 py-3 text-sm font-bold text-primary transition hover:border-accent hover:bg-accent/10">{category}</button>)}
        </div>
      </section>

      <section>
        <div className="mb-4 flex items-end justify-between">
          <div>
            <p className="eyebrow">live offers</p>
            <h2 className="section-title">Active Promotions</h2>
          </div>
          <Link className="hidden items-center gap-1 text-sm font-bold text-primary sm:flex" to="/promotions">Explore <ArrowRight size={16} /></Link>
        </div>
        <div className="flex gap-4 overflow-x-auto pb-3">
          {promotions.map((promo) => <PromoBanner key={promo._id} promotion={promo} />)}
        </div>
      </section>

      <section>
        <div className="mb-4 flex items-center justify-between">
          <div>
            <p className="eyebrow">discover</p>
            <h2 className="section-title">Featured Businesses</h2>
          </div>
          <Link className="inline-flex items-center gap-1 text-sm font-bold text-primary" to="/search">View all <ArrowRight size={16} /></Link>
        </div>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {businesses.map((business) => <BusinessCard key={business._id} business={business} />)}
        </div>
      </section>
    </div>
  );
};

export default Home;
