import { Train } from "@/app/types";
import { BASE_API_URL } from "@/global";
import { AlertInfo } from "@/components/alert";
import Image from 'next/image';
import AddTrain from "./addTrain";
import DeleteTrain from "./deleteTrain";
import EditTrain from "./editTrain";
import axios from "axios";
import { cookies } from "next/headers";

export const getTrains = async (search?: string): Promise<Train[] | undefined> => {
    const token = (await cookies()).get("token")?.value;

    if (!token) {
        console.error("No token found in cookies.");
        return undefined;
    }

    try {
        const response = await axios.get(`${BASE_API_URL}/train/`, {
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
            console.error("Error fetching trains:", error.message || error);
        }
        return undefined;
    }
};

const renderStatus = (status?: string): React.ReactNode => {
    if (status === "ACTIVE") {
        return (
            <span className="bg-green-100 text-green-800 text-sm font-semibold px-2.5 py-0.5 rounded-full">
                ACTIVE
            </span>
        );
    }
    return (
        <span className="bg-gray-100 text-gray-800 text-sm font-medium px-2.5 py-0.5 rounded-full">
            AVAILABLE
        </span>
    );
};

const TrainPage = async ({ searchParams }: { searchParams: Promise<{ [key: string]: string | string[] | undefined }> }) => {
    const params = await searchParams;
    const search = params.search ? params.search.toString() : undefined;
    const trains: Train[] = await getTrains(search) ?? [];

    return (
        <div className="m-2 bg-white rounded-lg border-t-4 border-t-slate-200 p-3 shadow-md text-slate-700">
            <h4 className="text-2xl text-[#DE5D5B] mb-2">Train Management</h4>
            <p className="text-sm text-secondary mb-4">
                Manage train data including name, description, and pictures.
            </p>
            <div className="flex justify-end items-end mb-4">
                <div className="ml-4">
                    <AddTrain />
                </div>
            </div>
            {
                trains.length === 0 ?
                    <AlertInfo title="Information">
                        No trains available
                    </AlertInfo>
                    :
                    <div className="m-2">
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Picture</th>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Train Name</th>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                        <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {trains.map((train, index) => (
                                        <tr key={`train-${index}`}>
                                            <td className="px-4 py-3 whitespace-nowrap">
                                                <Image
                                                    width={60}
                                                    height={40}
                                                    src={train.train_picture ? `${BASE_API_URL}/train_picture/${train.train_picture}` : '/images/default-avatar.png'}
                                                    className="rounded overflow-hidden object-cover"
                                                    alt={train.train_name}
                                                    unoptimized
                                                />
                                            </td>
                                            <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">
                                                {train.train_name}
                                            </td>
                                            <td className="px-4 py-3 text-sm text-gray-500 max-w-xs truncate">
                                                {train.description}
                                            </td>
                                            <td className="px-4 py-3 whitespace-nowrap">
                                                {renderStatus(train.train_status)}
                                            </td>
                                            <td className="px-4 py-3 whitespace-nowrap text-right">
                                                <div className="flex gap-1 justify-end">
                                                    <EditTrain selectedTrain={train} />
                                                    <DeleteTrain selectedTrain={train} />
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
export default TrainPage
