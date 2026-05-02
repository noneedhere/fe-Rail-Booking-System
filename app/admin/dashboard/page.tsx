import { BASE_API_URL } from "@/global";
import axios from "axios";
import { cookies } from "next/headers";
import Link from "next/link";
import { FaUsers, FaTicketAlt, FaMoneyBillWave, FaCalendarCheck, FaTrain, FaClipboardList, FaArrowRight, FaChartLine } from "react-icons/fa";

// --- Types ---
interface DashboardSummary {
    total_users: number;
    total_bookings: number;
    total_revenue: number;
    active_schedules: number;
    recent_purchases: RecentPurchase[];
}

interface RecentPurchase {
    id_ticketpurchase: number;
    buyer_name: string;
    buyer_email: string;
    total_price: number;
    purchase_date: string;
    schedule: {
        departure: string;
        destination: string;
    } | null;
}

// --- Data Fetching (single optimized API call) ---
const fetchDashboardSummary = async (): Promise<DashboardSummary> => {
    const token = (await cookies()).get("token")?.value;

    if (!token) {
        throw new Error("No authentication token found");
    }

    try {
        const res = await axios.get(`${BASE_API_URL}/dashboard/summary`, {
            headers: { Authorization: `Bearer ${token}` },
        });

        if (!res.data?.status || !res.data?.data) {
            throw new Error("Invalid response from dashboard API");
        }

        return res.data.data;
    } catch (error: any) {
        if (error.response?.status === 401 || error.response?.status === 403) {
            throw new Error("Unauthorized access to dashboard");
        }
        throw new Error(`Failed to fetch dashboard data: ${error.message}`);
    }
};

const getUserName = async (): Promise<string> => {
    const name = (await cookies()).get("name")?.value;
    return name ? decodeURIComponent(name) : "Admin";
};

// --- Helpers ---
const formatPrice = (price: number) => {
    return new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        minimumFractionDigits: 0,
    }).format(price);
};

const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleString("id-ID", {
        dateStyle: "medium",
        timeStyle: "short",
    });
};

const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 17) return "Good Afternoon";
    return "Good Evening";
};

// --- Page ---
const DashboardPage = async () => {
    const [userName, summary] = await Promise.all([
        getUserName(),
        fetchDashboardSummary(),
    ]);

    const summaryCards = [
        {
            title: "Total Users",
            value: summary.total_users.toString(),
            icon: <FaUsers />,
            color: "from-blue-500 to-blue-600",
            bgLight: "bg-blue-50",
            textColor: "text-blue-600",
            link: "/admin/user",
        },
        {
            title: "Total Bookings",
            value: summary.total_bookings.toString(),
            icon: <FaTicketAlt />,
            color: "from-emerald-500 to-emerald-600",
            bgLight: "bg-emerald-50",
            textColor: "text-emerald-600",
            link: "/admin/purchase",
        },
        {
            title: "Total Revenue",
            value: formatPrice(summary.total_revenue),
            icon: <FaMoneyBillWave />,
            color: "from-amber-500 to-orange-500",
            bgLight: "bg-amber-50",
            textColor: "text-amber-600",
            link: "/admin/purchase",
        },
        {
            title: "Active Schedules",
            value: summary.active_schedules.toString(),
            icon: <FaCalendarCheck />,
            color: "from-violet-500 to-purple-600",
            bgLight: "bg-violet-50",
            textColor: "text-violet-600",
            link: "/admin/schedule",
        },
    ];

    const quickActions = [
        { label: "Manage Users", icon: <FaUsers />, path: "/admin/user", desc: "Add, edit, or remove users" },
        { label: "Manage Trains", icon: <FaTrain />, path: "/admin/train", desc: "Configure train fleet" },
        { label: "Manage Schedules", icon: <FaCalendarCheck />, path: "/admin/schedule", desc: "Set routes and timings" },
        { label: "View Purchases", icon: <FaClipboardList />, path: "/admin/purchase", desc: "Review all transactions" },
    ];

    return (
        <div className="p-6 md:p-8 max-w-7xl mx-auto">
            {/* Welcome Section */}
            <div className="mb-8">
                <div className="flex items-center gap-2 mb-1">
                    <span className="text-2xl">👋</span>
                    <h1 className="text-2xl md:text-3xl font-bold text-[#29303A]">
                        {getGreeting()}, <span className="text-[#DE5D5B]">{userName}</span>
                    </h1>
                </div>
                <p className="text-gray-400 text-sm ml-10">
                    Here&apos;s what&apos;s happening with your train system today.
                </p>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
                {summaryCards.map((card, i) => (
                    <Link
                        key={i}
                        href={card.link}
                        className="group relative bg-white rounded-2xl p-5 border border-gray-100 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300"
                    >
                        {/* Gradient accent bar */}
                        <div className={`absolute top-0 left-0 right-0 h-1 rounded-t-2xl bg-gradient-to-r ${card.color} opacity-80`} />

                        <div className="flex items-start justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-400 mb-1">{card.title}</p>
                                <p className="text-2xl font-bold text-[#29303A] tracking-tight">{card.value}</p>
                            </div>
                            <div className={`${card.bgLight} ${card.textColor} p-3 rounded-xl text-lg group-hover:scale-110 transition-transform duration-300`}>
                                {card.icon}
                            </div>
                        </div>

                        <div className="mt-3 flex items-center text-xs text-gray-400 group-hover:text-[#DE5D5B] transition-colors">
                            <span>View details</span>
                            <FaArrowRight className="ml-1 text-[10px] group-hover:translate-x-1 transition-transform duration-300" />
                        </div>
                    </Link>
                ))}
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Recent Purchases - spans 2 columns */}
                <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 shadow-sm">
                    <div className="flex items-center justify-between p-5 border-b border-gray-50">
                        <div className="flex items-center gap-2">
                            <FaChartLine className="text-[#DE5D5B]" />
                            <h2 className="text-lg font-semibold text-[#29303A]">Recent Purchases</h2>
                        </div>
                        <Link
                            href="/admin/purchase"
                            className="text-xs font-medium text-[#DE5D5B] hover:text-[#c94a48] flex items-center gap-1 transition-colors"
                        >
                            View All <FaArrowRight className="text-[9px]" />
                        </Link>
                    </div>

                    {summary.recent_purchases.length === 0 ? (
                        <div className="p-10 text-center">
                            <FaTicketAlt className="text-4xl text-gray-200 mx-auto mb-3" />
                            <p className="text-gray-400 text-sm">No purchases yet</p>
                            <p className="text-gray-300 text-xs mt-1">Purchases will appear here once customers start booking.</p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                                        <th className="px-5 py-3">Buyer</th>
                                        <th className="px-5 py-3">Route</th>
                                        <th className="px-5 py-3">Date</th>
                                        <th className="px-5 py-3 text-right">Amount</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-50">
                                    {summary.recent_purchases.map((purchase, i) => (
                                        <tr key={purchase.id_ticketpurchase} className="hover:bg-gray-50/50 transition-colors">
                                            <td className="px-5 py-3.5">
                                                <div className="text-sm font-medium text-[#29303A]">{purchase.buyer_name}</div>
                                                <div className="text-xs text-gray-400">{purchase.buyer_email}</div>
                                            </td>
                                            <td className="px-5 py-3.5">
                                                {purchase.schedule ? (
                                                    <div className="text-sm text-gray-600">
                                                        {purchase.schedule.departure}
                                                        <span className="mx-1.5 text-gray-300">→</span>
                                                        {purchase.schedule.destination}
                                                    </div>
                                                ) : (
                                                    <span className="text-sm text-gray-300">N/A</span>
                                                )}
                                            </td>
                                            <td className="px-5 py-3.5 text-sm text-gray-400">
                                                {formatDate(purchase.purchase_date)}
                                            </td>
                                            <td className="px-5 py-3.5 text-right">
                                                <span className="text-sm font-semibold text-emerald-600">
                                                    {formatPrice(purchase.total_price)}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>

                {/* Quick Actions */}
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm">
                    <div className="p-5 border-b border-gray-50">
                        <h2 className="text-lg font-semibold text-[#29303A]">Quick Actions</h2>
                        <p className="text-xs text-gray-400 mt-0.5">Jump to common tasks</p>
                    </div>
                    <div className="p-3 space-y-1">
                        {quickActions.map((action, i) => (
                            <Link
                                key={i}
                                href={action.path}
                                className="group flex items-center gap-3 p-3 rounded-xl hover:bg-[#DE5D5B]/5 transition-all duration-200"
                            >
                                <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-gray-50 group-hover:bg-[#DE5D5B]/10 flex items-center justify-center text-gray-400 group-hover:text-[#DE5D5B] transition-all duration-200">
                                    {action.icon}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium text-[#29303A] group-hover:text-[#DE5D5B] transition-colors">
                                        {action.label}
                                    </p>
                                    <p className="text-xs text-gray-400 truncate">{action.desc}</p>
                                </div>
                                <FaArrowRight className="text-xs text-gray-300 group-hover:text-[#DE5D5B] group-hover:translate-x-1 transition-all duration-200" />
                            </Link>
                        ))}
                    </div>

                    {/* Schedule Overview Mini */}
                    <div className="mx-5 mb-5 mt-3 p-4 bg-gradient-to-br from-[#29303A] to-[#3d4654] rounded-xl text-white">
                        <div className="flex items-center gap-2 mb-3">
                            <FaCalendarCheck className="text-[#DE5D5B]" />
                            <span className="text-sm font-semibold">Schedule Overview</span>
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                            <div>
                                <p className="text-2xl font-bold">{summary.total_bookings}</p>
                                <p className="text-xs text-gray-400">Bookings</p>
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-emerald-400">{summary.active_schedules}</p>
                                <p className="text-xs text-gray-400">Active</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DashboardPage;