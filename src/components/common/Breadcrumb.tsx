import { Fragment } from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';

export interface Crumb {
  label: string;
  to?: string;
}

/** Accessible breadcrumb trail. The last crumb is the current page. */
export function Breadcrumb({ items }: { items: Crumb[] }) {
  return (
    <nav aria-label="Breadcrumb">
      <ol className="flex flex-wrap items-center gap-1 text-sm text-muted">
        <li>
          <Link to="/" className="flex items-center gap-1 rounded-md px-1 transition hover:text-fg" aria-label="Home">
            <Home className="h-3.5 w-3.5" />
          </Link>
        </li>
        {items.map((item, i) => {
          const last = i === items.length - 1;
          return (
            <Fragment key={`${item.label}-${i}`}>
              <ChevronRight className="h-3.5 w-3.5 shrink-0 opacity-60" aria-hidden />
              <li>
                {item.to && !last ? (
                  <Link to={item.to} className="rounded-md px-1 transition hover:text-fg">
                    {item.label}
                  </Link>
                ) : (
                  <span className="px-1 font-medium text-fg" aria-current="page">
                    {item.label}
                  </span>
                )}
              </li>
            </Fragment>
          );
        })}
      </ol>
    </nav>
  );
}
