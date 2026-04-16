"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"

const menu = [
    { label: "Dashboard", href: "/admin" },
    { label: "Kereta", href: "/admin/kereta" },
    { label: "Gerbong", href: "/admin/gerbong" },
    { label: "Kursi", href: "/admin/kursi" },
    { label: "Jadwal", href: "/admin/jadwal" },
    { label: "Booking", href: "/admin/booking" },
    { label: "Rekap Pemasukan", href: "/admin/rekap" },
]

export default function Sidebar() {
    const pathname = usePathname()
    const router = useRouter()

    function handleLogout() {
        document.cookie =
            "admin_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;"
        router.push("/login")
        router.refresh()
    }

    return (
        <aside className="w-64 bg-neutral-900 text-neutral-200 min-h-screen p-4">
            <h2 className="text-xl font-semibold mb-6 text-neutral-100">
                Admin Panel
            </h2>

            <nav className="flex flex-col gap-1">
                {menu.map(item => {
                    const active =
                        pathname === item.href ||
                        pathname.startsWith(item.href + "/")

                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`
                group relative px-3 py-2 rounded-md
                transition-colors duration-200
                ${active
                                    ? "text-white"
                                    : "text-neutral-400 hover:text-neutral-200"
                                }
              `}
                        >
                            {item.label}

                            {/* underline anim */}
                            <span
                                className={`
                  pointer-events-none
                  absolute left-3 right-3 bottom-1 h-[2px]
                  origin-left
                  scale-x-0
                  bg-gradient-to
                  from-indigo-400
                  via-sky-400
                  to-emerald-400
                  transition-transform duration-300 ease-out

                  group-hover:scale-x-100
                  ${active ? "scale-x-100" : ""}
                `}
                            />
                        </Link>
                    )
                })}
            </nav>

            <button
                onClick={handleLogout}
                className="mt-8 w-full bg-red-600/90 hover:bg-red-600 transition text-white px-3 py-2 rounded-md"
            >
                Logout
            </button>
        </aside>
    )
}