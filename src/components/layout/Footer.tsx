import { Link } from 'react-router-dom';
import { Heart, Info } from 'lucide-react';
import { useCountry } from '@/context/CountryContext';

export function Footer() {
  const { platforms } = useCountry();

  return (
    <footer className="mt-24 border-t border-border bg-surface/50">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 md:grid-cols-[1.6fr_1fr_1fr] lg:px-8">
        <div>
          <Link to="/" className="flex items-center gap-2">
            <span className="grid h-9 w-9 place-items-center rounded-2xl bg-gradient-to-br from-emerald-400 to-emerald-600 text-lg font-extrabold text-white">
              $
            </span>
            <span className="text-lg font-extrabold tracking-tight">
              Best<span className="text-brand">Seller</span>
            </span>
          </Link>
          <p className="mt-4 max-w-sm text-sm leading-relaxed text-muted">
            Browse top-rated products by category across the stores you love — ranked, filtered and
            beautifully presented.
          </p>
          <div className="mt-4 flex items-start gap-2 rounded-2xl border border-border bg-surface-2 p-3 text-xs leading-relaxed text-muted">
            <Info className="mt-0.5 h-4 w-4 shrink-0 text-brand" />
            <span>
              Product data comes from the public{' '}
              <a href="https://dummyjson.com" target="_blank" rel="noopener noreferrer" className="font-medium text-fg underline-offset-2 hover:underline">
                DummyJSON
              </a>{' '}
              catalog. Live per-store best-seller rankings aren’t shown because they require each
              platform’s affiliate API and a backend — so nothing here is fabricated.
            </span>
          </div>
        </div>

        <div>
          <h3 className="text-sm font-semibold text-fg">Stores</h3>
          <ul className="mt-4 space-y-2.5">
            {platforms.slice(0, 5).map((p) => (
              <li key={p.id}>
                <Link to={`/p/${p.id}`} className="text-sm text-muted transition hover:text-fg">
                  Best of {p.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="text-sm font-semibold text-fg">Product</h3>
          <ul className="mt-4 space-y-2.5">
            <li>
              <Link to="/favorites" className="text-sm text-muted transition hover:text-fg">
                Favorites
              </Link>
            </li>
            <li>
              <Link to={`/p/${platforms[0]?.id ?? 'flipkart'}`} className="text-sm text-muted transition hover:text-fg">
                Explore categories
              </Link>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-border">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 px-4 py-6 text-xs text-muted sm:flex-row sm:px-6 lg:px-8">
          <p className="flex items-center gap-1.5 text-center">
            For personal use · made with the help of AI ·{' '}
            <Heart className="h-3.5 w-3.5 fill-rose-500 text-rose-500" /> © {new Date().getFullYear()} Best Seller
          </p>
          <p>Not affiliated with any brand shown.</p>
        </div>
      </div>
    </footer>
  );
}
