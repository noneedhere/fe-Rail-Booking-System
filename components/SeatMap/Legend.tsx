'use client';

import React from 'react';

const Legend: React.FC = () => {
    return (
        <div className="flex items-center justify-center gap-6 p-4 bg-white border border-gray-200 rounded-lg">
            <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded bg-[#DE5D5B] border-2 border-[#c94a48]"></div>
                <span className="text-sm text-[#29303A]">Available</span>
            </div>
            <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded bg-[#29303A] border-2 border-[#1e252e] ring-2 ring-[#29303A]/50"></div>
                <span className="text-sm text-[#29303A]">Selected</span>
            </div>
            <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded bg-gray-400 border-2 border-gray-500"></div>
                <span className="text-sm text-[#29303A]">Booked</span>
            </div>
        </div>
    );
};

export default Legend;
