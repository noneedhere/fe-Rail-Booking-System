import { Seat, Carriage } from "@/app/types";
import { BASE_API_URL } from "@/global";
import { AlertInfo } from "@/components/alert";
import AddSeat from "./addSeat";
import DeleteSeat from "./deleteSeat";
import EditSeat from "./editSeat";
import axios from "axios";
import { cookies } from "next/headers";

export const getSeats = async (search?: string): Promise<Seat[] | undefined> => {
    const token = (await cookies()).get("token")?.value;

    if (!token) {
        console.error("No token found in cookies.");
        return undefined;
    }

    try {
        const response = await axios.get(`${BASE_API_URL}/seat/`, {
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
            console.error("Error fetching seats:", error.message || error);
        }
        return undefined;
    }
};

export const getCarriages = async (): Promise<Carriage[] | undefined> => {
    const token = (await cookies()).get("token")?.value;

    if (!token) {
        console.error("No token found in cookies.");
        return undefined;
    }

    try {
        const response = await axios.get(`${BASE_API_URL}/carriage/`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data?.status ? response.data.data : undefined;
    } catch (error: any) {
        if (error.response) {
            console.error("API response error:", error.response.status, error.response.data);
        } else {
            console.error("Error fetching carriages:", error.message || error);
        }
        return undefined;
    }
};

const SeatPage = async ({ searchParams }: { searchParams: Promise<{ [key: string]: string | string[] | undefined }> }) => {
    const params = await searchParams;
    const search = params.search ? params.search.toString() : undefined;
    const seats: Seat[] = await getSeats(search) ?? [];
    const carriages: Carriage[] = await getCarriages() ?? [];

    return (
        <div className="m-2 bg-white rounded-lg border-t-4 border-t-slate-200 p-3 shadow-md text-slate-700">
            <h4 className="text-2xl text-[#DE5D5B] mb-2">Seat Management</h4>
            <p className="text-sm text-secondary mb-4">
                Manage seat data including seat number and carriage assignment.
            </p>
            <div className="flex justify-end items-end mb-4">
                <div className="ml-4">
                    <AddSeat carriages={carriages} />
                </div>
            </div>
            {
                seats.length === 0 ?
                    <AlertInfo title="Information">
                        No seats available
                    </AlertInfo>
                    :
                    <div className="m-2">
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Seat Number</th>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Carriage</th>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Train</th>
                                        <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {seats.map((seat, index) => (
                                        <tr key={`seat-${index}`}>
                                            <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">
                                                {seat.seat_num}
                                            </td>
                                            <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                                                {seat.carriage?.carriage_name || '-'}
                                            </td>
                                            <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                                                {seat.carriage?.train?.train_name || '-'}
                                            </td>
                                            <td className="px-4 py-3 whitespace-nowrap text-right">
                                                <div className="flex gap-1 justify-end">
                                                    <EditSeat selectedSeat={seat} carriages={carriages} />
                                                    <DeleteSeat selectedSeat={seat} />
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
export default SeatPage
