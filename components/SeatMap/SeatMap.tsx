'use client';

import React from 'react';
import Seat from './Seat';
import Legend from './Legend';
import { SeatData, LayoutConfig, SeatSelection } from '@/app/types/seatMapping';

interface SeatMapProps {
    carriageId: number;
    carriageName: string;
    carriageCategory: string;
    layout: LayoutConfig;
    seats: SeatData[];
    selectedSeats: number[];
    onSeatSelect: (seat: SeatSelection) => void;
    seatPrice: number;
    readOnly?: boolean;
}

const SeatMap: React.FC<SeatMapProps> = ({
    carriageId,
    carriageName,
    carriageCategory,
    layout,
    seats,
    selectedSeats,
    onSeatSelect,
    seatPrice,
    readOnly = false,
}) => {
    // Organize seats into rows
    const rows: SeatData[][] = [];
    for (let i = 0; i < layout.rows; i++) {
        const rowSeats = seats.filter(seat => seat.row === i + 1);
        rows.push(rowSeats.sort((a, b) => a.col - b.col));
    }

    const handleSeatClick = (seat: SeatData) => {
        if (seat.status === 'BOOKED' || readOnly) return;

        onSeatSelect({
            id_seat: seat.id_seat,
            seat_num: seat.seat_num,
            carriage_id: carriageId,
            carriage_name: carriageName,
            carriage_category: carriageCategory,
            price: seatPrice,
        });
    };

    const getSeatStatus = (seat: SeatData): 'AVAILABLE' | 'BOOKED' | 'SELECTED' => {
        if (seat.status === 'BOOKED') return 'BOOKED';
        if (selectedSeats.includes(seat.id_seat)) return 'SELECTED';
        return 'AVAILABLE';
    };

    // Get category-specific styling
    const getCategoryGradient = () => {
        return 'from-[#29303A] to-[#1e252e]';
    };

    return (
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            {/* Carriage Header */}
            <div className={`bg-gradient-to-r ${getCategoryGradient()} text-white p-4`}>
                <div className="flex justify-between items-center">
                    <div>
                        <h3 className="text-xl font-bold">{carriageName}</h3>
                        <p className="text-sm opacity-90">{carriageCategory} Class</p>
                    </div>
                    <div className="text-right">
                        <p className="text-sm opacity-90">Price per seat</p>
                        <p className="text-xl font-bold">Rp {seatPrice.toLocaleString('id-ID')}</p>
                    </div>
                </div>
            </div>

            {/* Seat Grid */}
            <div className="p-6">
                {/* Column Labels */}
                <div className="flex justify-center mb-4">
                    <div className="flex gap-2 items-center">
                        {Array.from({ length: layout.columns }, (_, i) => (
                            <React.Fragment key={i}>
                                <div className="w-10 h-6 flex items-center justify-center text-xs font-bold text-gray-500">
                                    {String.fromCharCode(65 + i)}
                                </div>
                                {i === layout.aisle_after - 1 && (
                                    <div className="w-8" /> /* Aisle space */
                                )}
                            </React.Fragment>
                        ))}
                    </div>
                </div>

                {/* Seat Rows */}
                <div className="space-y-2">
                    {rows.map((rowSeats, rowIndex) => (
                        <div key={rowIndex} className="flex justify-center items-center gap-2">
                            {/* Row Number */}
                            <div className="w-6 text-xs font-bold text-gray-500 text-right">
                                {rowIndex + 1}
                            </div>

                            {/* Seats with aisle */}
                            <div className="flex gap-2">
                                {rowSeats.map((seat, colIndex) => (
                                    <React.Fragment key={seat.id_seat}>
                                        <Seat
                                            seatNum={seat.seat_num}
                                            status={getSeatStatus(seat)}
                                            onClick={() => handleSeatClick(seat)}
                                            disabled={readOnly}
                                        />
                                        {colIndex === layout.aisle_after - 1 && colIndex < rowSeats.length - 1 && (
                                            <div className="w-8 flex items-center justify-center text-gray-300">
                                                |
                                            </div>
                                        )}
                                    </React.Fragment>
                                ))}
                            </div>

                            {/* Row Number (right) */}
                            <div className="w-6 text-xs font-bold text-gray-500 text-left">
                                {rowIndex + 1}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Legend */}
                <div className="mt-6">
                    <Legend />
                </div>

                {/* Seat Count Info */}
                <div className="mt-4 text-center text-sm text-gray-500">
                    <span className="text-[#DE5D5B] font-medium">
                        {seats.filter(s => s.status === 'AVAILABLE').length}
                    </span>
                    {' '}available of{' '}
                    <span className="font-medium">{seats.length}</span>
                    {' '}seats
                </div>
            </div>
        </div>
    );
};

export default SeatMap;
