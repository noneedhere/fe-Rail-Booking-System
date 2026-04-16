"use client"

import { useTheme } from "next-themes"
import { useEffect, useState } from "react"

export default function ThemeToggle() {
    const { theme, setTheme } = useTheme()
    const [mounted, setMounted] = useState(false)

    useEffect(() => setMounted(true), [])

    if (!mounted) return null

    return (
        <button
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="text-sm px-3 py-1 rounded bg-neutral-800 text-white dark:bg-neutral-200 dark:text-black"
        >
            {theme === "dark" ? "Light mode" : "Dark mode"}
        </button>
    )
}