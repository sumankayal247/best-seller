import { Link } from 'react-router-dom';
import { Github, Heart } from 'lucide-react';
import { PLATFORMS } from '@/data/platforms';

export function Footer() {
  return (
    <footer className="mt-24 border-t border-border bg-surface/50">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 md:grid-cols-[1.4fr_1fr_1fr] lg:px-8">
        <div>
          <Link to="/" className="flex items-center gap-2">
            <span className="grid h-9 w-9 place-items-center rounded-2xl bg-gradient-to-br from-emerald-400 to-emerald-600 text-lg font-extrabold text-white">
              $
            </span>
            <span className="text-lg font-extrabold tracking-tight">
              Best<span className="text-brand">Seller</span>
            </span>
          </Link>
          <p className="mt-4 max-w-xs text-sm leading-relaxed text-muted">
            Discover the highest-selling products across every category on the platforms you love —
            ranked, filtered and beautifully presented.
          </p>
        </div>

        <div>
          <h3 className="text-sm font-semibold text-fg">Platforms</h3>
          <ul className="mt-4 space-y-2.5">
            {PLATFORMS.slice(0, 5).map((p) => (
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
              <Link to="/p/amazon" className="text-sm text-muted transition hover:text-fg">
                Explore categories
              </Link>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-border">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 px-4 py-6 text-xs text-muted sm:flex-row sm:px-6 lg:px-8">
          <p className="flex items-center gap-1.5">
            Built with <Heart className="h-3.5 w-3.5 fill-rose-500 text-rose-500" /> · Demo data ·
            © {new Date().getFullYear()} Best Seller
          </p>
          <a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 transition hover:text-fg"
          >
            <Github className="h-4 w-4" /> Source
          </a>
        </div>
      </div>
    </footer>
  );
}
