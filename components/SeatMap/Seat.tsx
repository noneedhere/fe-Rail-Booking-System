'use client';

import React from 'react';

interface SeatProps {
    seatNum: string;
    status: 'AVAILABLE' | 'BOOKED' | 'SELECTED' | 'HELD';
    onClick: () => void;
    disabled?: boolean;
}

const Seat: React.FC<SeatProps> = ({ seatNum, status, onClick, disabled = false }) => {
    const getStatusStyles = () => {
        switch (status) {
            case 'AVAILABLE':
                return 'bg-[#DE5D5B] hover:bg-[#c94a48] cursor-pointer border-[#c94a48] text-white';
            case 'SELECTED':
                return 'bg-[#29303A] hover:bg-[#1e252e] cursor-pointer border-[#1e252e] text-white ring-2 ring-[#29303A]/50';
            case 'HELD':
                return 'bg-amber-400 cursor-not-allowed border-amber-500 text-amber-800';
            case 'BOOKED':
                return 'bg-gray-400 cursor-not-allowed border-gray-500 text-gray-200';
            default:
                return 'bg-gray-300 border-gray-400';
        }
    };

    const handleClick = () => {
        if (!disabled && status !== 'BOOKED' && status !== 'HELD') {
            onClick();
        }
    };

    return (
        <button
            onClick={handleClick}
            disabled={disabled || status === 'BOOKED' || status === 'HELD'}
            className={`
                w-10 h-10 rounded-lg border-2 flex items-center justify-center
                text-xs font-bold transition-all duration-200 transform
                ${getStatusStyles()}
                ${status !== 'BOOKED' && status !== 'HELD' ? 'hover:scale-105 active:scale-95' : ''}
            `}
            title={`${seatNum} - ${status === 'HELD' ? 'Held by another user' : status}`}
        >
            {status === 'HELD' ? '🔒' : seatNum.split('-').pop()}
        </button>
    );
};

export default Seat;
