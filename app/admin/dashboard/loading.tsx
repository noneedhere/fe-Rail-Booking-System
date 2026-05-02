export default function DashboardLoading() {
    return (
        <div className="p-6 md:p-8 max-w-7xl mx-auto animate-pulse">
            {/* Welcome skeleton */}
            <div className="mb-8">
                <div className="flex items-center gap-2 mb-2">
                    <div className="w-8 h-8 bg-gray-200 rounded-full" />
                    <div className="h-8 w-80 bg-gray-200 rounded-lg" />
                </div>
                <div className="h-4 w-64 bg-gray-100 rounded ml-10" />
            </div>

            {/* Summary cards skeleton */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
                {[...Array(4)].map((_, i) => (
                    <div key={i} className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
                        <div className="absolute top-0 left-0 right-0 h-1 rounded-t-2xl bg-gray-200" />
                        <div className="flex items-start justify-between">
                            <div>
                                <div className="h-4 w-24 bg-gray-200 rounded mb-2" />
                                <div className="h-8 w-16 bg-gray-200 rounded" />
                            </div>
                            <div className="w-11 h-11 bg-gray-100 rounded-xl" />
                        </div>
                        <div className="mt-3 h-3 w-20 bg-gray-100 rounded" />
                    </div>
                ))}
            </div>

            {/* Main content skeleton */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Recent purchases skeleton */}
                <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 shadow-sm">
                    <div className="flex items-center justify-between p-5 border-b border-gray-50">
                        <div className="h-5 w-40 bg-gray-200 rounded" />
                        <div className="h-4 w-16 bg-gray-100 rounded" />
                    </div>
                    <div className="p-5 space-y-4">
                        {[...Array(5)].map((_, i) => (
                            <div key={i} className="flex items-center gap-4">
                                <div className="flex-1 space-y-2">
                                    <div className="h-4 w-32 bg-gray-200 rounded" />
                                    <div className="h-3 w-48 bg-gray-100 rounded" />
                                </div>
                                <div className="h-4 w-24 bg-gray-100 rounded" />
                                <div className="h-4 w-20 bg-gray-200 rounded" />
                            </div>
                        ))}
                    </div>
                </div>

                {/* Quick actions skeleton */}
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm">
                    <div className="p-5 border-b border-gray-50">
                        <div className="h-5 w-28 bg-gray-200 rounded mb-1" />
                        <div className="h-3 w-36 bg-gray-100 rounded" />
                    </div>
                    <div className="p-3 space-y-2">
                        {[...Array(4)].map((_, i) => (
                            <div key={i} className="flex items-center gap-3 p-3">
                                <div className="w-10 h-10 bg-gray-100 rounded-lg" />
                                <div className="flex-1 space-y-1">
                                    <div className="h-4 w-24 bg-gray-200 rounded" />
                                    <div className="h-3 w-36 bg-gray-100 rounded" />
                                </div>
                            </div>
                        ))}
                    </div>
                    {/* Schedule overview skeleton */}
                    <div className="mx-5 mb-5 mt-3 p-4 bg-gray-200 rounded-xl h-24" />
                </div>
            </div>
        </div>
    );
}
