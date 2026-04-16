type Props = {
    title: string
    value: string
    subtitle?: string
    index?: number
}

export default function DashboardCard({
    title,
    value,
    subtitle,
    index = 0,
}: Props) {
    return (
        <div
            style={{
                animationDelay: `${index * 120}ms`,
            }}
            className="
        animate-card-in
        group
        relative
        rounded-xl
        bg-neutral-900/90 dark:bg-neutral-900
        text-neutral-100
        p-5
        border border-neutral-800
        shadow-sm

        transition-all duration-300 ease-out
        hover:-translate-y-1
        hover:shadow-lg
        hover:shadow-black/40
        hover:border-neutral-700
      "
        >
            {/* soft glow */}
            <div
                className="
          pointer-events-none
          absolute inset-0
          rounded-xl
          opacity-0
          transition-opacity duration-300
          group-hover:opacity-100
          bg-gradient-to
          from-white/5
          via-transparent
          to-transparent
        "
            />

            <p className="text-sm text-neutral-400 mb-1">
                {title}
            </p>

            {/* angka nyala pas hover */}
            <p
                className="
          text-3xl font-semibold tracking-tight
          transition-all duration-300

          bg-clip-text
          text-transparent
          bg-gradient-to
          from-neutral-100
          to-neutral-100

          group-hover:from-indigo-400
          group-hover:via-sky-400
          group-hover:to-emerald-400
        "
            >
                {value}
            </p>

            {subtitle && (
                <p className="mt-2 text-xs text-neutral-500">
                    {subtitle}
                </p>
            )}
        </div>
    )
}