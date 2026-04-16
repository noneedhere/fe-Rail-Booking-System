'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getCookie } from '@/lib/client-cookies';
import { BASE_API_URL } from '@/global';

interface PurchaseItem {
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
        train: {
            train_name: string;
        };
    };
    purchase_detail: Array<{
        id_purchasedetail: number;
        seat: {
            seat_num: string;
            carriage: {
                carriage_name: string;
                carriage_category: string;
            };
        };
    }>;
}

const PurchaseHistoryPage = () => {
    const router = useRouter();
    const [purchases, setPurchases] = useState<PurchaseItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchPurchases = async () => {
            try {
                const TOKEN = getCookie("token") || "";
                const response = await fetch(`${BASE_API_URL}/purchase/my`, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${TOKEN}`,
                        'Content-Type': 'application/json'
                    }
                });

                if (!response.ok) {
                    if (response.status === 401) {
                        router.push('/login');
                        return;
                    }
                    throw new Error('Failed to fetch purchases');
                }

                const result = await response.json();
                if (result.status) {
                    setPurchases(result.data || []);
                } else {
                    setError(result.message || 'Failed to load purchases');
                }
            } catch (err) {
                setError(err instanceof Error ? err.message : 'An error occurred');
            } finally {
                setLoading(false);
            }
        };

        fetchPurchases();
    }, [router]);

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('id-ID', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
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
                <div className="bg-[#DE5D5B]/10 border border-[#DE5D5B]/30 rounded-lg p-4 text-[#DE5D5B]">
                    {error}
                </div>
            </div>
        );
    }

    return (
        <div className="p-6 bg-white pt-28">
            {/* Header */}
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-[#29303A]">My Purchases</h1>
                <p className="text-[#29303A]/50">View your ticket purchase history</p>
            </div>

            {/* Purchase List */}
            {purchases.length === 0 ? (
                <div className="bg-white rounded-xl shadow-lg p-8 text-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-gray-300 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
                    </svg>
                    <h3 className="text-lg font-semibold text-[#29303A]/60 mb-2">No Purchases Yet</h3>
                    <p className="text-gray-400 mb-4">Start your journey by booking a train ticket</p>
                    <button
                        onClick={() => router.push('/customer/booking')}
                        className="px-6 py-2 bg-[#DE5D5B] text-white rounded-lg hover:bg-[#c94a48] transition-colors"
                    >
                        Book Now
                    </button>
                </div>
            ) : (
                <div className="space-y-4">
                    {purchases.map((purchase) => (
                        <div
                            key={purchase.id_ticketpurchase}
                            className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow cursor-pointer"
                            onClick={() => router.push(`/customer/purchases/${purchase.id_ticketpurchase}`)}
                        >
                            <div className="p-5">
                                <div className="flex items-start justify-between">
                                    {/* Left: Journey Info */}
                                    <div className="flex-1">
                                        <div className="flex items-center gap-3 mb-2">
                                            <span className="text-xs px-2 py-1 rounded-full bg-[#DE5D5B]/10 text-[#DE5D5B] font-medium">
                                                #{purchase.id_ticketpurchase}
                                            </span>
                                            <span className="text-sm text-gray-500">
                                                {formatDate(purchase.purchase_date)}
                                            </span>
                                        </div>

                                        <h3 className="text-lg font-bold text-[#29303A] mb-1">
                                            {purchase.schedule.departure} → {purchase.schedule.destination}
                                        </h3>

                                        <p className="text-sm text-[#29303A]/60 mb-2">
                                            {purchase.schedule.train.train_name} • {purchase.schedule.schedule_name}
                                        </p>

                                        <div className="flex flex-wrap gap-1">
                                            {purchase.purchase_detail.slice(0, 5).map((detail) => (
                                                <span
                                                    key={detail.id_purchasedetail}
                                                    className="text-xs px-2 py-0.5 bg-[#29303A]/10 text-[#29303A] rounded"
                                                >
                                                    {detail.seat.carriage.carriage_name} - {detail.seat.seat_num.split('-').pop()}
                                                </span>
                                            ))}
                                            {purchase.purchase_detail.length > 5 && (
                                                <span className="text-xs px-2 py-0.5 bg-[#29303A]/10 text-[#29303A] rounded">
                                                    +{purchase.purchase_detail.length - 5} more
                                                </span>
                                            )}
                                        </div>
                                    </div>

                                    {/* Right: Price */}
                                    <div className="text-right ml-4">
                                        <p className="text-lg font-bold text-[#DE5D5B]">
                                            Rp {purchase.total_price.toLocaleString('id-ID')}
                                        </p>
                                        <p className="text-xs text-gray-500">
                                            {purchase.purchase_detail.length} seat(s)
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Bottom border indicator */}
                            <div className="h-1 bg-gradient-to-r from-[#DE5D5B] to-[#c94a48]"></div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default PurchaseHistoryPage;
