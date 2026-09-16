import Link from "next/link";

export const PAGE_SIZE = 20;

type RawSearchParams = Record<string, string | string[] | undefined> | undefined;

export function parsePage(searchParams: RawSearchParams): { page: number; from: number; to: number } {
  const raw = searchParams?.page;
  const value = Array.isArray(raw) ? raw[0] : raw;
  const page = Math.max(1, Math.floor(Number(value)) || 1);
  const from = (page - 1) * PAGE_SIZE;
  const to = from + PAGE_SIZE - 1;
  return { page, from, to };
}

interface PagerProps {
  page: number;
  total: number;
  basePath: string;
}

// Server component — plain <Link>-based prev/next, no client JS, consistent
// with this codebase's progressive-enhancement style (see /shop's filters).
export function Pager({ page, total, basePath }: PagerProps) {
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  if (totalPages <= 1) return null;

  const hasPrev = page > 1;
  const hasNext = page < totalPages;

  return (
    <div className="flex items-center justify-between font-mono text-xs uppercase pt-2">
      {hasPrev ? (
        <Link href={`${basePath}?page=${page - 1}`} className="clay-button-secondary px-4 py-2">
          PREV
        </Link>
      ) : (
        <span className="clay-button-secondary px-4 py-2 opacity-40 pointer-events-none">PREV</span>
      )}
      <span className="text-zinc-500">
        PAGE {page} OF {totalPages}
      </span>
      {hasNext ? (
        <Link href={`${basePath}?page=${page + 1}`} className="clay-button-secondary px-4 py-2">
          NEXT
        </Link>
      ) : (
        <span className="clay-button-secondary px-4 py-2 opacity-40 pointer-events-none">NEXT</span>
      )}
    </div>
  );
}
