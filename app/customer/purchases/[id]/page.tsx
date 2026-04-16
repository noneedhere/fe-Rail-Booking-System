'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { getCookie } from '@/lib/client-cookies';
import { BASE_API_URL } from '@/global';

interface PurchaseDetail {
    id_ticketpurchase: number;
    purchase_date: string;
    buyer_name: string;
    buyer_email: string;
    buyer_phone: string;
    total_price: number;
    schedule: {
        id_schedule: number;
        schedule_name: string;
        departure: string;
        destination: string;
        departure_date: string;
        arrival_date: string;
        price: number;
        train: {
            id_train: number;
            train_name: string;
        };
    };
    user: {
        username: string;
        email: string;
    };
    purchase_detail: Array<{
        id_purchasedetail: number;
        total_price: number;
        seat: {
            id_seat: number;
            seat_num: string;
            carriage: {
                id_carriage: number;
                carriage_name: string;
                carriage_category: string;
            };
        };
    }>;
}

const PurchaseDetailPage = () => {
    const router = useRouter();
    const params = useParams();
    const purchaseId = params.id as string;

    const [purchase, setPurchase] = useState<PurchaseDetail | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchPurchase = async () => {
            if (!purchaseId) return;

            try {
                const TOKEN = getCookie("token") || "";
                const response = await fetch(`${BASE_API_URL}/purchase/${purchaseId}`, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${TOKEN}`,
                        'Content-Type': 'application/json'
                    }
                });

                if (response.status === 401) {
                    router.push('/login');
                    return;
                }

                if (response.status === 403) {
                    setError('You do not have permission to view this purchase');
                    return;
                }

                if (response.status === 404) {
                    setError('Purchase not found');
                    return;
                }

                const result = await response.json();
                if (result.status) {
                    setPurchase(result.data);
                } else {
                    setError(result.message || 'Failed to load purchase');
                }
            } catch (err) {
                setError(err instanceof Error ? err.message : 'An error occurred');
            } finally {
                setLoading(false);
            }
        };

        fetchPurchase();
    }, [purchaseId, router]);

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('id-ID', {
            weekday: 'long',
            day: 'numeric',
            month: 'long',
            year: 'numeric',
        });
    };

    const formatTime = (dateString: string) => {
        return new Date(dateString).toLocaleTimeString('id-ID', {
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    const formatDateTime = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('id-ID', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    const handlePrint = () => {
        window.print();
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#DE5D5B]"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="p-6">
                <div className="bg-[#DE5D5B]/10 border border-[#DE5D5B]/30 rounded-lg p-6 text-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-[#DE5D5B] mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                    <p className="text-[#DE5D5B] font-medium mb-4">{error}</p>
                    <button
                        onClick={() => router.push('/customer/purchases')}
                        className="px-4 py-2 bg-[#29303A]/10 text-[#29303A] rounded-lg hover:bg-[#29303A]/20 transition-colors"
                    >
                        ← Back to Purchases
                    </button>
                </div>
            </div>
        );
    }

    if (!purchase) {
        return null;
    }

    // Group seats by carriage
    const seatsByCarriage = purchase.purchase_detail.reduce((acc, detail) => {
        const key = detail.seat.carriage.carriage_name;
        if (!acc[key]) {
            acc[key] = {
                category: detail.seat.carriage.carriage_category,
                seats: [],
                subtotal: 0,
            };
        }
        acc[key].seats.push(detail);
        acc[key].subtotal += detail.total_price;
        return acc;
    }, {} as Record<string, { category: string; seats: typeof purchase.purchase_detail; subtotal: number }>);

    return (
        <div className="pt-24 max-w-4xl mx-auto">
            {/* Action Bar - Hidden when printing */}
            <div className="mb-6 flex items-center justify-between print:hidden">
                <button
                    onClick={() => router.push('/customer/purchases')}
                    className="flex items-center gap-2 text-[#29303A] hover:text-[#DE5D5B] transition-colors"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
                    </svg>
                    Back to Purchases
                </button>
                <button
                    onClick={handlePrint}
                    className="flex items-center gap-2 px-4 py-2 bg-[#DE5D5B] text-white rounded-lg hover:bg-[#c94a48] transition-colors"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M5 4v3H4a2 2 0 00-2 2v3a2 2 0 002 2h1v2a2 2 0 002 2h6a2 2 0 002-2v-2h1a2 2 0 002-2V9a2 2 0 00-2-2h-1V4a2 2 0 00-2-2H7a2 2 0 00-2 2zm8 0H7v3h6V4zm0 8H7v4h6v-4z" clipRule="evenodd" />
                    </svg>
                    Print Receipt
                </button>
            </div>

            {/* Receipt Card */}
            <div className="bg-white rounded-xl shadow-lg overflow-hidden print:shadow-none">
                {/* Header */}
                <div className="bg-gradient-to-r from-[#DE5D5B] to-[#c94a48] p-6 text-white">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-2xl font-bold">Ticket Receipt</h1>
                            <p className="text-white/80 text-sm">Purchase ID: #{purchase.id_ticketpurchase}</p>
                        </div>
                        <div className="text-right">
                            <p className="text-sm text-white/80">Purchase Date</p>
                            <p className="font-medium">{formatDateTime(purchase.purchase_date)}</p>
                        </div>
                    </div>
                </div>

                {/* Journey Info */}
                <div className="p-6 border-b border-gray-200">
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex-1">
                            <p className="text-sm text-gray-500">From</p>
                            <p className="text-xl font-bold text-[#29303A]">{purchase.schedule.departure}</p>
                        </div>
                        <div className="px-4">
                            <div className="w-16 h-0.5 bg-gray-300 relative">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 absolute -right-3 -top-3 text-[#DE5D5B]" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                                </svg>
                            </div>
                        </div>
                        <div className="flex-1 text-right">
                            <p className="text-sm text-gray-500">To</p>
                            <p className="text-xl font-bold text-[#29303A]">{purchase.schedule.destination}</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div>
                            <p className="text-gray-500">Train</p>
                            <p className="font-medium text-[#29303A]">{purchase.schedule.train.train_name}</p>
                        </div>
                        <div>
                            <p className="text-gray-500">Schedule</p>
                            <p className="font-medium text-[#29303A]">{purchase.schedule.schedule_name}</p>
                        </div>
                        <div>
                            <p className="text-gray-500">Departure</p>
                            <p className="font-medium text-[#29303A]">{formatDate(purchase.schedule.departure_date)}</p>
                            <p className="text-[#29303A]/60">{formatTime(purchase.schedule.departure_date)}</p>
                        </div>
                        <div>
                            <p className="text-gray-500">Arrival</p>
                            <p className="font-medium text-[#29303A]">{formatDate(purchase.schedule.arrival_date)}</p>
                            <p className="text-[#29303A]/60">{formatTime(purchase.schedule.arrival_date)}</p>
                        </div>
                    </div>
                </div>

                {/* Buyer Info */}
                <div className="p-6 border-b border-gray-200 bg-[#29303A]/5">
                    <h3 className="text-sm font-semibold text-[#29303A]/60 mb-3">BUYER INFORMATION</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                        <div>
                            <p className="text-gray-500">Name</p>
                            <p className="font-medium text-[#29303A]">{purchase.buyer_name}</p>
                        </div>
                        <div>
                            <p className="text-gray-500">Email</p>
                            <p className="font-medium text-[#29303A]">{purchase.buyer_email}</p>
                        </div>
                        <div>
                            <p className="text-gray-500">Phone</p>
                            <p className="font-medium text-[#29303A]">{purchase.buyer_phone}</p>
                        </div>
                    </div>
                </div>

                {/* Tickets */}
                <div className="p-6 border-b border-gray-200">
                    <h3 className="text-sm font-semibold text-[#29303A]/60 mb-4">TICKETS ({purchase.purchase_detail.length})</h3>

                    <div className="space-y-4">
                        {Object.entries(seatsByCarriage).map(([carriageName, data]) => (
                            <div key={carriageName} className="bg-[#29303A]/5 rounded-lg p-4">
                                <div className="flex items-center justify-between mb-3">
                                    <div className="flex items-center gap-2">
                                        <span className="font-medium text-[#29303A]">{carriageName}</span>
                                        <span className="text-xs px-2 py-0.5 rounded bg-[#DE5D5B]/10 text-[#DE5D5B]">
                                            {data.category}
                                        </span>
                                    </div>
                                    <span className="text-sm text-[#29303A]/60">
                                        Subtotal: Rp {data.subtotal.toLocaleString('id-ID')}
                                    </span>
                                </div>

                                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                                    {data.seats.map((detail) => (
                                        <div
                                            key={detail.id_purchasedetail}
                                            className="bg-white rounded-lg p-3 border border-gray-200"
                                        >
                                            <p className="font-bold text-[#29303A] text-lg">
                                                {detail.seat.seat_num.split('-').pop()}
                                            </p>
                                            <p className="text-xs text-gray-500">
                                                Rp {detail.total_price.toLocaleString('id-ID')}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Total */}
                <div className="p-6 bg-white border-t border-[#DE5D5B]/20">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-[#29303A]/50 text-sm">Total Tickets</p>
                            <p className="text-[#29303A] font-medium">{purchase.purchase_detail.length} seat(s)</p>
                        </div>
                        <div className="text-right">
                            <p className="text-[#29303A]/50 text-sm">Total Amount</p>
                            <p className="text-3xl font-bold text-[#DE5D5B]">
                                Rp {purchase.total_price.toLocaleString('id-ID')}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="p-4 bg-[#29303A] text-center text-sm text-white/70 print:bg-transparent print:text-[#29303A]/50">
                    <p>Thank you for your purchase!</p>
                    <p>Please present this receipt when boarding.</p>
                </div>
            </div>
        </div>
    );
};

export default PurchaseDetailPage;
