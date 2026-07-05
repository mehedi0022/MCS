import Link from "next/link"

type BreadcrumbItem = {
  name: string
  href: string
}

export function Breadcrumbs({ items }: { items: BreadcrumbItem[] }) {
  if (items.length < 2) return null

  return (
    <nav aria-label="Breadcrumb" className="text-sm">
      <ol className="flex flex-wrap items-center gap-2 text-slate-500 dark:text-slate-400">
        {items.map((item, index) => {
          const isLast = index === items.length - 1

          return (
            <li key={`${item.href}-${item.name}`} className="flex min-w-0 items-center gap-2">
              {index > 0 && <span aria-hidden="true">/</span>}
              {isLast ? (
                <span
                  aria-current="page"
                  className="line-clamp-1 font-semibold text-slate-800 dark:text-slate-100"
                >
                  {item.name}
                </span>
              ) : (
                <Link
                  href={item.href}
                  className="font-medium transition-colors hover:text-primary"
                >
                  {item.name}
                </Link>
              )}
            </li>
          )
        })}
      </ol>
    </nav>
  )
}
