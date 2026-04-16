'use client';

import React from 'react';
import { CarriageMappingData } from '@/app/types/seatMapping';

interface CarriageSelectorProps {
    carriages: CarriageMappingData[];
    onSelect: (carriageId: number) => void;
    onBack: () => void;
}

const CarriageSelector: React.FC<CarriageSelectorProps> = ({
    carriages,
    onSelect,
    onBack,
}) => {
    // Get category-specific styling
    const getCategoryStyles = (category: string) => {
        const icon = category === 'EXECUTIVE' ? '👑' : category === 'BUSINESS' ? '💼' : category === 'ECONOMY' ? '🎫' : '🚃';
        return {
            gradient: 'from-[#DE5D5B] to-[#c94a48]',
            badge: 'bg-[#DE5D5B]/10 text-[#DE5D5B]',
            border: 'border-gray-200 hover:border-[#DE5D5B]',
            icon,
        };
    };

    const getAvailableSeats = (carriage: CarriageMappingData) => {
        return carriage.seats.filter(s => s.status === 'AVAILABLE').length;
    };

    return (
        <div className="space-y-6">
            {/* Header with Back Button */}
            <div className="flex items-center gap-4">
                <button
                    onClick={onBack}
                    className="flex items-center gap-2 px-4 py-2 text-[#29303A] hover:text-[#DE5D5B] hover:bg-[#DE5D5B]/5 rounded-lg transition-all"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
                    </svg>
                    Back to Schedules
                </button>
            </div>

            <div className="text-center">
                <h2 className="text-2xl font-bold text-[#29303A]">Select a Carriage</h2>
                <p className="text-[#29303A]/60 mt-2">Choose your preferred carriage class</p>
            </div>

            {/* Carriage Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {carriages.map((carriage) => {
                    const styles = getCategoryStyles(carriage.carriage_category);
                    const availableSeats = getAvailableSeats(carriage);
                    const isSoldOut = availableSeats === 0;

                    return (
                        <button
                            key={carriage.id_carriage}
                            onClick={() => !isSoldOut && onSelect(carriage.id_carriage)}
                            disabled={isSoldOut}
                            className={`
                                relative p-6 rounded-xl border-2 ${styles.border}
                                bg-white shadow-md transition-all duration-300
                                ${isSoldOut
                                    ? 'opacity-50 cursor-not-allowed'
                                    : 'hover:shadow-xl hover:scale-[1.02] cursor-pointer'
                                }
                            `}
                        >
                            {/* Category Badge */}
                            <div className={`absolute -top-3 left-4 px-3 py-1 rounded-full text-xs font-bold ${styles.badge}`}>
                                {styles.icon} {carriage.carriage_category}
                            </div>

                            {/* Sold Out Badge */}
                            {isSoldOut && (
                                <div className="absolute -top-3 right-4 px-3 py-1 rounded-full text-xs font-bold bg-[#DE5D5B]/10 text-[#DE5D5B]">
                                    SOLD OUT
                                </div>
                            )}

                            {/* Carriage Name */}
                            <h3 className="text-xl font-bold text-[#29303A] mt-2">
                                {carriage.carriage_name}
                            </h3>

                            {/* Seat Availability */}
                            <div className="mt-4 flex items-center justify-between">
                                <div className="text-sm text-[#29303A]/60">
                                    <span className="text-[#DE5D5B] font-bold">{availableSeats}</span>
                                    <span> / {carriage.quota} seats</span>
                                </div>
                                <div className="text-sm text-[#29303A]/60">
                                    {carriage.layout.columns} seats/row
                                </div>
                            </div>

                            {/* Progress Bar */}
                            <div className="mt-3 h-2 bg-gray-200 rounded-full overflow-hidden">
                                <div
                                    className={`h-full bg-gradient-to-r ${styles.gradient} transition-all`}
                                    style={{ width: `${(availableSeats / carriage.quota) * 100}%` }}
                                />
                            </div>

                            {/* Price */}
                            <div className="mt-4 pt-4 border-t border-gray-100">
                                <div className="flex justify-between items-center">
                                    <span className="text-sm text-gray-500">Price per seat</span>
                                    <span className="text-lg font-bold text-[#DE5D5B]">
                                        Rp {carriage.seat_price.toLocaleString('id-ID')}
                                    </span>
                                </div>
                                {carriage.price_multiplier > 1 && (
                                    <div className="text-xs text-gray-400 text-right">
                                        {carriage.price_multiplier}x base price
                                    </div>
                                )}
                            </div>

                            {/* Select Button */}
                            <div className={`mt-4 py-2 rounded-lg bg-gradient-to-r ${styles.gradient} text-white font-medium text-center`}>
                                {isSoldOut ? 'Sold Out' : 'Select Seats →'}
                            </div>
                        </button>
                    );
                })}
            </div>
        </div>
    );
};

export default CarriageSelector;
