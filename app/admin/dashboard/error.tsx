"use client";

import { FaExclamationTriangle } from "react-icons/fa";

export default function DashboardError({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    return (
        <div className="p-6 md:p-8 max-w-7xl mx-auto">
            <div className="flex flex-col items-center justify-center py-20">
                <div className="bg-red-50 p-4 rounded-full mb-5">
                    <FaExclamationTriangle className="text-3xl text-[#DE5D5B]" />
                </div>
                <h2 className="text-xl font-bold text-[#29303A] mb-2">
                    Failed to load dashboard
                </h2>
                <p className="text-sm text-gray-400 mb-6 text-center max-w-md">
                    Something went wrong while fetching dashboard data. This could be a temporary network issue.
                </p>
                <button
                    onClick={() => reset()}
                    className="px-6 py-2.5 bg-[#DE5D5B] text-white text-sm font-medium rounded-lg hover:bg-[#c94a48] transition-colors shadow-sm"
                >
                    Try Again
                </button>
            </div>
        </div>
    );
}
