import { Schedule, Train } from "@/app/types";
import { BASE_API_URL } from "@/global";
import { AlertInfo } from "@/components/alert";
import AddSchedule from "./addSchedule";
import DeleteSchedule from "./deleteSchedule";
import EditSchedule from "./editSchedule";
import axios from "axios";
import { cookies } from "next/headers";

export const getSchedules = async (search?: string): Promise<Schedule[] | undefined> => {
    const token = (await cookies()).get("token")?.value;

    if (!token) {
        console.error("No token found in cookies.");
        return undefined;
    }

    try {
        const response = await axios.get(`${BASE_API_URL}/schedule/`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
            params: search ? { search } : undefined
        });
        return response.data?.status ? response.data.data : undefined;
    } catch (error: any) {
        if (error.response) {
            console.error("API response error:", error.response.status, error.response.data);
        } else {
            console.error("Error fetching schedules:", error.message || error);
        }
        return undefined;
    }
};

export const getTrains = async (): Promise<Train[] | undefined> => {
    const token = (await cookies()).get("token")?.value;
    if (!token) return undefined;
    try {
        const response = await axios.get(`${BASE_API_URL}/train/`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        return response.data?.status ? response.data.data : undefined;
    } catch {
        return undefined;
    }
};

const renderStatus = (status: string): React.ReactNode => {
    const styles: Record<string, string> = {
        'ACTIVED': 'bg-green-100 text-green-800',
        'FINISHED': 'bg-gray-100 text-gray-800',
        'CANCELLED': 'bg-red-100 text-red-800'
    };
    return (
        <span className={`${styles[status] || styles['FINISHED']} text-sm font-semibold px-2.5 py-0.5 rounded-full`}>
            {status}
        </span>
    );
};

const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleString('id-ID', {
        dateStyle: 'medium',
        timeStyle: 'short'
    });
};

const formatPrice = (price: number) => {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0
    }).format(price);
};

const SchedulePage = async ({ searchParams }: { searchParams: Promise<{ [key: string]: string | string[] | undefined }> }) => {
    const params = await searchParams;
    const search = params.search ? params.search.toString() : undefined;
    const schedules: Schedule[] = await getSchedules(search) ?? [];
    const trains: Train[] = await getTrains() ?? [];

    return (
        <div className="m-2 bg-white rounded-lg border-t-4 border-t-slate-200 p-3 shadow-md text-slate-700">
            <h4 className="text-2xl text-[#DE5D5B] mb-2">Schedule Management</h4>
            <p className="text-sm text-secondary mb-4">
                Manage train schedules including routes, dates, and pricing.
            </p>
            <div className="flex justify-end items-end mb-4">
                <div className="ml-4">
                    <AddSchedule trains={trains} />
                </div>
            </div>
            {
                schedules.length === 0 ?
                    <AlertInfo title="Information">
                        No schedules available
                    </AlertInfo>
                    :
                    <div className="m-2">
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Schedule</th>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Route</th>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Departure</th>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Arrival</th>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                        <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {schedules.map((schedule, index) => (
                                        <tr key={`schedule-${index}`}>
                                            <td className="px-4 py-3 whitespace-nowrap">
                                                <div className="text-sm font-medium text-gray-900">{schedule.schedule_name}</div>
                                                <div className="text-xs text-gray-500">Train ID: {schedule.id_train}</div>
                                            </td>
                                            <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                                                {schedule.departure} → {schedule.destination}
                                            </td>
                                            <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                                                {formatDate(schedule.departure_date)}
                                            </td>
                                            <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                                                {formatDate(schedule.arrival_date)}
                                            </td>
                                            <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">
                                                {formatPrice(schedule.price)}
                                            </td>
                                            <td className="px-4 py-3 whitespace-nowrap">
                                                {renderStatus(schedule.status)}
                                            </td>
                                            <td className="px-4 py-3 whitespace-nowrap text-right">
                                                <div className="flex gap-1 justify-end">
                                                    <EditSchedule selectedSchedule={schedule} trains={trains} />
                                                    <DeleteSchedule selectedSchedule={schedule} />
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
            }
        </div>
    )
}
export default SchedulePage
