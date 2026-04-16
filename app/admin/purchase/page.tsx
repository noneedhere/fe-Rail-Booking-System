import { Purchase } from "@/app/types";
import { BASE_API_URL } from "@/global";
import { AlertInfo } from "@/components/alert";
import DeletePurchase from "./deletePurchase";
import axios from "axios";
import { cookies } from "next/headers";

export const getPurchases = async (): Promise<Purchase[] | undefined> => {
    const token = (await cookies()).get("token")?.value;

    if (!token) {
        console.error("No token found in cookies.");
        return undefined;
    }

    try {
        const response = await axios.get(`${BASE_API_URL}/purchase/`, {
            headers: {
                Authorization: `Bearer ${token}`,
            }
        });
        return response.data?.status ? response.data.data : undefined;
    } catch (error: any) {
        if (error.response) {
            console.error("API response error:", error.response.status, error.response.data);
        } else {
            console.error("Error fetching purchases:", error.message || error);
        }
        return undefined;
    }
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

const PurchasePage = async () => {
    const purchases: Purchase[] = await getPurchases() ?? [];

    return (
        <div className="m-2 bg-white rounded-lg border-t-4 border-t-slate-200 p-3 shadow-md text-slate-700">
            <h4 className="text-2xl text-[#DE5D5B] mb-2">Purchase History</h4>
            <p className="text-sm text-secondary mb-4">
                View all ticket purchases made by customers.
            </p>
            {
                purchases.length === 0 ?
                    <AlertInfo title="Information">
                        No purchases yet
                    </AlertInfo>
                    :
                    <div className="m-2">
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Buyer</th>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Schedule</th>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tickets</th>
                                        <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {purchases.map((purchase, index) => (
                                        <tr key={`purchase-${index}`}>
                                            <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                                                #{purchase.id_ticketpurchase}
                                            </td>
                                            <td className="px-4 py-3 whitespace-nowrap">
                                                <div className="text-sm font-medium text-gray-900">{purchase.buyer_name}</div>
                                                <div className="text-xs text-gray-500">{purchase.buyer_email}</div>
                                                <div className="text-xs text-gray-500">{purchase.buyer_phone}</div>
                                            </td>
                                            <td className="px-4 py-3 whitespace-nowrap">
                                                {purchase.schedule ? (
                                                    <>
                                                        <div className="text-sm font-medium text-gray-900">{purchase.schedule.schedule_name}</div>
                                                        <div className="text-xs text-gray-500">{purchase.schedule.departure} → {purchase.schedule.destination}</div>
                                                    </>
                                                ) : (
                                                    <span className="text-sm text-gray-400">N/A</span>
                                                )}
                                            </td>
                                            <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                                                {formatDate(purchase.purchase_date)}
                                            </td>
                                            <td className="px-4 py-3 whitespace-nowrap">
                                                {purchase.purchase_detail && purchase.purchase_detail.length > 0 ? (
                                                    <div className="space-y-1">
                                                        {purchase.purchase_detail.map((detail, idx) => (
                                                            <div key={idx} className="text-xs bg-blue-50 px-2 py-1 rounded">
                                                                {detail.seat?.carriage?.carriage_name} - Seat {detail.seat?.seat_num}
                                                            </div>
                                                        ))}
                                                    </div>
                                                ) : (
                                                    <span className="text-sm text-gray-400">No details</span>
                                                )}
                                            </td>
                                            <td className="px-4 py-3 whitespace-nowrap text-right text-sm font-bold text-green-600">
                                                {formatPrice(purchase.total_price)}
                                                <td className="px-4 py-3 whitespace-nowrap text-right">
                                                    <div className="flex gap-1 justify-end">
                                                        <DeletePurchase selectedPurchase={purchase} />
                                                    </div>
                                                </td>
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
export default PurchasePage
