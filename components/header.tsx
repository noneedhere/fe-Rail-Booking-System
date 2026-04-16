"use client"

import { usePathname } from "next/navigation"
import ThemeToggle from "@/components/theme-toggle"
import Link from "next/link"

const TITLE_MAP: Record<string, string> = {
    "/admin": "Dashboard",
    "/admin/kereta": "Data Kereta",
    "/admin/gerbong": "Data Gerbong",
    "/admin/kursi": "Data Kursi",
    "/admin/jadwal": "Data Jadwal",
    "/admin/booking": "Booking Tiket",
    "/admin/rekap": "Rekap Pemasukan",
    "/admin/transaksi": "Transaksi",
    "/admin/petugas": "Petugas",
}

export default function Header() {
    const pathname = usePathname()

    const title =
        TITLE_MAP[pathname] ??
        TITLE_MAP[
        Object.keys(TITLE_MAP).find(p =>
            pathname.startsWith(p)
        ) || ""
        ] ??
        "Admin Panel"

    // breadcrumb segments
    const segments = pathname
        .split("/")
        .filter(Boolean)

    return (
        <header className="
      px-6 py-3
      flex items-center justify-between
      border-b border-neutral-200
      dark:border-neutral-800
      bg-neutral-100/80
      dark:bg-neutral-950/80
      backdrop-blur
    ">
            <div>
                <h1 className="text-xl font-semibold leading-tight">
                    {title}
                </h1>

                {/* breadcrumb */}
                <nav className="mt-1 text-xs text-neutral-500 flex gap-1">
                    {segments.map((seg, i) => {
                        const href = "/" + segments.slice(0, i + 1).join("/")
                        const isLast = i === segments.length - 1

                        return (
                            <span key={href} className="flex gap-1">
                                {!isLast ? (
                                    <Link
                                        href={href}
                                        className="hover:text-neutral-700 dark:hover:text-neutral-300 transition"
                                    >
                                        {seg}
                                    </Link>
                                ) : (
                                    <span className="text-neutral-400">
                                        {seg}
                                    </span>
                                )}
                                {!isLast && <span>/</span>}
                            </span>
                        )
                    })}
                </nav>
            </div>

            <ThemeToggle />
        </header>
    )
}