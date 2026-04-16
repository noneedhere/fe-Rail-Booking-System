import { Carriage, Train } from "@/app/types";
import { BASE_API_URL } from "@/global";
import { AlertInfo } from "@/components/alert";
import AddCarriage from "./addCarriage";
import DeleteCarriage from "./deleteCarriage";
import EditCarriage from "./editCarriage";
import axios from "axios";
import { cookies } from "next/headers";

// Extended type for carriage with train info from API
interface CarriageWithTrain extends Carriage {
    train?: {
        id_train: number;
        train_name: string;
        train_status?: 'ACTIVE' | 'AVAILABLE';
    };
}

export const getCarriages = async (search?: string): Promise<CarriageWithTrain[] | undefined> => {
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
            params: search ? { search } : undefined
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

export const getTrains = async (): Promise<Train[] | undefined> => {
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

const renderCategoryBadge = (category: string): React.ReactNode => {
    switch (category) {
        case "EXECUTIVE":
            return (
                <span className="bg-purple-100 text-purple-800 text-sm font-semibold px-2.5 py-0.5 rounded-full">
                    EXECUTIVE
                </span>
            );
        case "BUSINESS":
            return (
                <span className="bg-blue-100 text-blue-800 text-sm font-semibold px-2.5 py-0.5 rounded-full">
                    BUSINESS
                </span>
            );
        default:
            return (
                <span className="bg-green-100 text-green-800 text-sm font-medium px-2.5 py-0.5 rounded-full">
                    ECONOMY
                </span>
            );
    }
};

const CarriagePage = async ({ searchParams }: { searchParams: Promise<{ [key: string]: string | string[] | undefined }> }) => {
    const params = await searchParams;
    const search = params.search ? params.search.toString() : undefined;
    const carriages: CarriageWithTrain[] = await getCarriages(search) ?? [];
    const trains: Train[] = await getTrains() ?? [];

    return (
        <div className="m-2 bg-white rounded-lg border-t-4 border-t-slate-200 p-3 shadow-md text-slate-700">
            <h4 className="text-2xl text-[#DE5D5B] mb-2">Carriage Management</h4>
            <p className="text-sm text-secondary mb-4">
                Manage carriage data. Creating a carriage auto-generates seats based on category.
            </p>
            <div className="flex justify-end items-end mb-4">
                <div className="ml-4">
                    <AddCarriage trains={trains} />
                </div>
            </div>
            {
                carriages.length === 0 ?
                    <AlertInfo title="Information">
                        No carriages available
                    </AlertInfo>
                    :
                    <div className="m-2">
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Carriage Name</th>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Train</th>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Seats (Quota)</th>
                                        <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {carriages.map((carriage, index) => (
                                        <tr key={`carriage-${index}`}>
                                            <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">
                                                {carriage.carriage_name}
                                            </td>
                                            <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                                                {carriage.train?.train_name || '-'}
                                            </td>
                                            <td className="px-4 py-3 whitespace-nowrap">
                                                {renderCategoryBadge(carriage.carriage_category)}
                                            </td>
                                            <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                                                {carriage.quota}
                                            </td>
                                            <td className="px-4 py-3 whitespace-nowrap text-right">
                                                <div className="flex gap-1 justify-end">
                                                    <EditCarriage selectedCarriage={carriage} trains={trains} />
                                                    <DeleteCarriage selectedCarriage={carriage} />
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
export default CarriagePage
