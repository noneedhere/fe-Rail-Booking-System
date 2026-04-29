'use client';

import React, { useState } from 'react';
import { SeatSelection } from '@/app/types/seatMapping';

export interface BuyerInfo {
    buyer_name: string;
    buyer_email: string;
    buyer_phone: string;
}

interface BookingSummaryProps {
    selectedSeats: SeatSelection[];
    totalPrice: number;
    onConfirm: (buyerInfo: BuyerInfo) => void;
    onBack: () => void;
    isLoading?: boolean;
    maxSeats?: number;
    defaultBuyerInfo?: Partial<BuyerInfo>;
    holdTimeLeft?: number;
}

const BookingSummary: React.FC<BookingSummaryProps> = ({
    selectedSeats,
    totalPrice,
    onConfirm,
    onBack,
    isLoading = false,
    maxSeats = 10,
    defaultBuyerInfo,
    holdTimeLeft = 0,
}) => {
    // Buyer form state
    const [buyerInfo, setBuyerInfo] = useState<BuyerInfo>({
        buyer_name: defaultBuyerInfo?.buyer_name || '',
        buyer_email: defaultBuyerInfo?.buyer_email || '',
        buyer_phone: defaultBuyerInfo?.buyer_phone || '',
    });

    const [errors, setErrors] = useState<Partial<BuyerInfo>>({});

    // Validation
    const validateForm = (): boolean => {
        const newErrors: Partial<BuyerInfo> = {};

        if (!buyerInfo.buyer_name.trim()) {
            newErrors.buyer_name = 'Name is required';
        }

        if (!buyerInfo.buyer_email.trim()) {
            newErrors.buyer_email = 'Email is required';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(buyerInfo.buyer_email)) {
            newErrors.buyer_email = 'Invalid email format';
        }

        if (!buyerInfo.buyer_phone.trim()) {
            newErrors.buyer_phone = 'Phone is required';
        } else if (!/^[0-9+\-\s()]{8,15}$/.test(buyerInfo.buyer_phone)) {
            newErrors.buyer_phone = 'Invalid phone format';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleConfirm = () => {
        if (validateForm()) {
            onConfirm(buyerInfo);
        }
    };

    const canConfirm = selectedSeats.length > 0 && !isLoading;

    // Group seats by carriage
    const seatsByCarriage = selectedSeats.reduce((acc, seat) => {
        if (!acc[seat.carriage_name]) {
            acc[seat.carriage_name] = {
                category: seat.carriage_category,
                seats: [],
            };
        }
        acc[seat.carriage_name].seats.push(seat);
        return acc;
    }, {} as Record<string, { category: string; seats: SeatSelection[] }>);

    return (
        <div className="bg-white rounded-xl shadow-lg p-6 sticky top-4">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-gray-200 pb-4 mb-4">
                <h3 className="text-lg font-bold text-[#29303A]">Booking Summary</h3>
                <span className="text-sm text-[#29303A]/50">
                    {selectedSeats.length}/{maxSeats} seats
                </span>
            </div>

            {/* Hold Countdown Timer */}
            {holdTimeLeft > 0 && selectedSeats.length > 0 && (
                <div className={`p-3 rounded-lg mb-4 text-center transition-colors ${
                    holdTimeLeft < 60000
                        ? 'bg-red-50 border border-red-200'
                        : 'bg-amber-50 border border-amber-200'
                }`}>
                    <div className="flex items-center justify-center gap-2 mb-1">
                        <svg xmlns="http://www.w3.org/2000/svg" className={`h-4 w-4 ${
                            holdTimeLeft < 60000 ? 'text-red-500 animate-pulse' : 'text-amber-600'
                        }`} viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                        </svg>
                        <p className={`text-xs ${
                            holdTimeLeft < 60000 ? 'text-red-500' : 'text-amber-700'
                        }`}>Complete booking within</p>
                    </div>
                    <p className={`text-2xl font-bold font-mono ${
                        holdTimeLeft < 60000 ? 'text-red-500 animate-pulse' : 'text-amber-600'
                    }`}>
                        {Math.floor(holdTimeLeft / 60000)}:{String(Math.floor((holdTimeLeft % 60000) / 1000)).padStart(2, '0')}
                    </p>
                </div>
            )}

            {/* Selected Seats List */}
            {selectedSeats.length === 0 ? (
                <div className="py-8 text-center text-gray-400">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                    <p>No seats selected</p>
                    <p className="text-xs mt-1">Click on available seats to select</p>
                </div>
            ) : (
                <>
                    {/* Seats by carriage */}
                    <div className="space-y-3 max-h-40 overflow-y-auto mb-4">
                        {Object.entries(seatsByCarriage).map(([carriageName, data]) => (
                            <div key={carriageName} className="bg-[#29303A]/5 rounded-lg p-3">
                                <div className="flex items-center justify-between mb-2">
                                    <span className="font-medium text-[#29303A] text-sm">{carriageName}</span>
                                    <span className="text-xs px-2 py-0.5 rounded bg-[#DE5D5B]/10 text-[#DE5D5B]">
                                        {data.category}
                                    </span>
                                </div>
                                <div className="flex flex-wrap gap-1">
                                    {data.seats.map(seat => (
                                        <span
                                            key={seat.id_seat}
                                            className="inline-flex items-center px-2 py-0.5 rounded bg-[#29303A]/10 text-[#29303A] text-xs font-medium"
                                        >
                                            {seat.seat_num.split('-').pop()}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Buyer Information Form */}
                    <div className="border-t border-gray-200 pt-4 mb-4">
                        <h4 className="text-sm font-semibold text-[#29303A] mb-3">Buyer Information</h4>

                        <div className="space-y-3 text-black">
                            {/* Name */}
                            <div>
                                <input
                                    type="text"
                                    placeholder="Full Name *"
                                    value={buyerInfo.buyer_name}
                                    onChange={(e) => setBuyerInfo({ ...buyerInfo, buyer_name: e.target.value })}
                                    className={`w-full px-3 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#DE5D5B] ${errors.buyer_name ? 'border-[#DE5D5B]' : 'border-gray-300'
                                        }`}
                                />
                                {errors.buyer_name && (
                                    <p className="text-xs text-[#DE5D5B] mt-1">{errors.buyer_name}</p>
                                )}
                            </div>

                            {/* Email */}
                            <div>
                                <input
                                    type="email"
                                    placeholder="Email *"
                                    value={buyerInfo.buyer_email}
                                    onChange={(e) => setBuyerInfo({ ...buyerInfo, buyer_email: e.target.value })}
                                    className={`w-full px-3 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#DE5D5B] ${errors.buyer_email ? 'border-[#DE5D5B]' : 'border-gray-300'
                                        }`}
                                />
                                {errors.buyer_email && (
                                    <p className="text-xs text-[#DE5D5B] mt-1">{errors.buyer_email}</p>
                                )}
                            </div>

                            {/* Phone */}
                            <div>
                                <input
                                    type="tel"
                                    placeholder="Phone Number *"
                                    value={buyerInfo.buyer_phone}
                                    onChange={(e) => setBuyerInfo({ ...buyerInfo, buyer_phone: e.target.value })}
                                    className={`w-full px-3 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#DE5D5B] ${errors.buyer_phone ? 'border-[#DE5D5B]' : 'border-gray-300'
                                        }`}
                                />
                                {errors.buyer_phone && (
                                    <p className="text-xs text-[#DE5D5B] mt-1">{errors.buyer_phone}</p>
                                )}
                            </div>
                        </div>
                    </div>
                </>
            )}

            {/* Price Breakdown */}
            <div className="border-t border-gray-200 pt-4 space-y-2">
                <div className="flex justify-between text-sm text-[#29303A]/60">
                    <span>Seats ({selectedSeats.length})</span>
                    <span>Rp {selectedSeats.reduce((sum, s) => sum + s.price, 0).toLocaleString('id-ID')}</span>
                </div>
                <div className="flex justify-between text-lg font-bold text-[#29303A]">
                    <span>Total</span>
                    <span className="text-[#DE5D5B]">Rp {totalPrice.toLocaleString('id-ID')}</span>
                </div>
            </div>

            {/* Action Buttons */}
            <div className="mt-6 space-y-3">
                <button
                    onClick={handleConfirm}
                    disabled={!canConfirm}
                    className={`
                        w-full py-3 rounded-lg font-bold text-white transition-all
                        ${canConfirm
                            ? 'bg-gradient-to-r from-[#DE5D5B] to-[#c94a48] hover:from-[#c94a48] hover:to-[#b53e3c] shadow-lg hover:shadow-xl'
                            : 'bg-gray-300 cursor-not-allowed'
                        }
                    `}
                >
                    {isLoading ? (
                        <span className="flex items-center justify-center gap-2">
                            <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                            </svg>
                            Processing...
                        </span>
                    ) : (
                        `Confirm Booking${selectedSeats.length > 0 ? ` (${selectedSeats.length} seats)` : ''}`
                    )}
                </button>

                <button
                    onClick={onBack}
                    disabled={isLoading}
                    className="w-full py-2 rounded-lg border-2 border-gray-200 text-[#29303A] font-medium hover:bg-[#29303A]/5 transition-all"
                >
                    ← Back to Carriages
                </button>
            </div>

            {/* Warning if max seats reached */}
            {selectedSeats.length >= maxSeats && (
                <div className="mt-4 p-3 bg-[#DE5D5B]/10 border border-[#DE5D5B]/30 rounded-lg">
                    <p className="text-sm text-[#DE5D5B]">
                        ⚠️ Maximum {maxSeats} seats per booking reached
                    </p>
                </div>
            )}
        </div>
    );
};

export default BookingSummary;
