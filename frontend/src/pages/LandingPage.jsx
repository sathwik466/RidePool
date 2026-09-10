import { Link } from 'react-router-dom';
import { Car, Leaf, Shield, Users } from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-brand-50 via-white to-slate-50">
      <header className="mx-auto flex max-w-6xl items-center justify-between px-4 py-6">
        <div className="flex items-center gap-2 text-xl font-bold text-brand-700">
          <Car className="h-7 w-7" />
          RidePool
        </div>
        <div className="flex gap-3">
          <Link to="/login" className="btn-secondary">
            Login
          </Link>
          <Link to="/register" className="btn-primary">
            Get Started
          </Link>
        </div>
      </header>

      <section className="mx-auto max-w-6xl px-4 py-16 text-center">
        <h1 className="text-4xl font-bold tracking-tight text-slate-900 md:text-5xl">
          Share rides. Save money. <span className="text-brand-600">Reduce emissions.</span>
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-lg text-slate-600">
          RidePool connects commuters with verified riders for smart carpooling with live tracking,
          fair fares, and community karma.
        </p>
        <div className="mt-8 flex justify-center gap-4">
          <Link to="/register" className="btn-primary px-6 py-3 text-base">
            Join RidePool
          </Link>
          <Link to="/login" className="btn-secondary px-6 py-3 text-base">
            Sign In
          </Link>
        </div>
      </section>

      <section className="mx-auto grid max-w-6xl gap-6 px-4 pb-20 md:grid-cols-3">
        {[
          {
            icon: Users,
            title: 'Smart Matching',
            desc: 'Find rides by proximity, seats, ratings, and detour tolerance.',
          },
          {
            icon: Leaf,
            title: 'Eco Impact',
            desc: 'Track CO₂ saved and earn karma points for every shared trip.',
          },
          {
            icon: Shield,
            title: 'Safety First',
            desc: 'SOS alerts, trip sharing, women-only rides, and verified riders.',
          },
        ].map(({ icon: Icon, title, desc }) => (
          <div key={title} className="card text-left">
            <Icon className="h-8 w-8 text-brand-600" />
            <h3 className="mt-3 font-semibold">{title}</h3>
            <p className="mt-1 text-sm text-slate-600">{desc}</p>
          </div>
        ))}
      </section>
    </div>
  );
}
