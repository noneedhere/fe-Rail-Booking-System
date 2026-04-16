'use client'

import React, { useEffect, useState } from 'react';
import { Schedule } from '@/app/types';
import { getCookie } from '@/lib/client-cookies';
import { BASE_API_URL } from '@/global';

const SchedulePage = () => {
    const [schedules, setSchedules] = useState<Schedule[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const [roundTrip, setRoundTrip] = useState(false)

    // Fetch schedules from backend API (same endpoint as admin)
    useEffect(() => {
        const fetchSchedules = async () => {
            try {
                const TOKEN = getCookie("token") || "";
                const response = await fetch(`${BASE_API_URL}/schedule/`, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${TOKEN}`,
                        'Content-Type': 'application/json'
                    }
                });

                if (!response.ok) {
                    throw new Error('Failed to fetch schedules');
                }

                const result = await response.json();
                if (result.status) {
                    // Filter only ACTIVED schedules for customers
                    const activeSchedules = (result.data || []).filter(
                        (s: Schedule) => s.status === 'ACTIVED'
                    );
                    setSchedules(activeSchedules);
                } else {
                    setSchedules([]);
                }
            } catch (err) {
                setError(err instanceof Error ? err.message : 'An error occurred');
            } finally {
                setLoading(false);
            }
        };

        fetchSchedules();
    }, []);

    // Format time from datetime string (HH:mm)
    const formatTime = (dateStr: string): string => {
        const date = new Date(dateStr);
        return date.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', hour12: false });
    };

    // Format date from datetime string (DD MMM YYYY)
    const formatDate = (dateStr: string): string => {
        const date = new Date(dateStr);
        return date.toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' });
    };

    // Calculate duration between departure and arrival
    const calculateDuration = (departure: string, arrival: string): string => {
        const dep = new Date(departure);
        const arr = new Date(arrival);
        const diffMs = arr.getTime() - dep.getTime();
        const hours = Math.floor(diffMs / (1000 * 60 * 60));
        const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
        return `${hours}j ${minutes}m`;
    };

    // Format price to Indonesian Rupiah
    const formatPrice = (price: number): string => {
        return `Rp ${price.toLocaleString('id-ID')}`;
    };

    return (
        <div>
            <div id='home' className='relative w-full h-[650px] flex items-center justify-center p-20'>
                <img src="/images/dashboardFoto.png" alt="" className='absolute top-0 left-0 w-full h-full object-cover'/>

                <div className="text-white min-w-[750px] px-20 relative items-center justify-center flex flex-col z-20">
                    <h1 className='text-6xl pt-20 font-bold'>
                        {loading ? 'Loading...' : `${schedules.length} Search Result${schedules.length !== 1 ? 's' : ''}`}
                    </h1>
                    <p>Choose your departure schedule</p>

                    <div className="mt-[70px] flex gap-4">
                    </div>
                </div>
            </div>

            <section id="schedule" className="w-full bg-white py-[45px]">
                <div className="max-w-[1112px] mx-auto flex flex-col gap-6">

                    {loading && (
                        <div className="w-full h-[291px] bg-white rounded-xl shadow-md px-[60px] py-[45px] flex items-center justify-center">
                            <div className="flex flex-col items-center gap-4">
                                <div className="w-12 h-12 border-4 border-gray-300 border-t-[#DE5D5B] rounded-full animate-spin"></div>
                                <p className="text-gray-500 text-lg">Loading schedules...</p>
                            </div>
                        </div>
                    )}
                    {error && !loading && (
                        <div className="w-full h-[291px] bg-white rounded-xl shadow-md px-[60px] py-[45px] flex items-center justify-center">
                            <div className="flex flex-col items-center gap-4 text-center">
                                <svg xmlns="http://www.w3.org/2000/svg" className="w-16 h-16 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                </svg>
                                <p className="text-red-500 text-lg font-medium">{error}</p>
                            </div>
                        </div>
                    )}
                    {!loading && !error && schedules.length === 0 && (
                        <div className="w-full h-[291px] bg-white rounded-xl shadow-md px-[60px] py-[45px] flex items-center justify-center">
                            <div className="flex flex-col items-center gap-4 text-center">
                                <svg xmlns="http://www.w3.org/2000/svg" className="w-16 h-16 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                                <p className="text-gray-500 text-xl font-medium">No schedules available</p>
                                <p className="text-gray-400 text-sm">There are currently no active train schedules.</p>
                            </div>
                        </div>
                    )}

                    {!loading && !error && schedules.map((schedule) => (
                        <div key={schedule.id_schedule} className="w-full h-[291px] bg-white text-[#29303A] rounded-xl shadow-md px-[60px] py-[45px] flex flex-col justify-between">

                            <div className="grid grid-cols-4 items-center">

                                <div>
                                    <p className="text-[28px] font-semibold text-[#29303A] pr-10">
                                        {schedule.schedule_name}
                                    </p>
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-[15px] text-gray-500">
                                        {schedule.departure}
                                    </span>
                                    <span className="text-[30px] font-bold">
                                        {formatTime(schedule.departure_date)}
                                    </span>
                                    <span className="text-[15px] text-gray-500">
                                        {formatDate(schedule.departure_date)}
                                    </span>
                                </div>

                                <div className="flex flex-col items-center">
                                    <span className="text-[15px] text-gray-500">
                                        Duration
                                    </span>

                                    <span className="text-[18px] font-medium">
                                        {calculateDuration(schedule.departure_date, schedule.arrival_date)}
                                    </span>

                                    <img
                                        src="/images/Schedule/Duration Logo.jpg"
                                        alt="duration"
                                        className="w-[250px] pt-6"
                                    />
                                </div>

                                <div className="flex flex-col text-right">
                                    <span className="text-[15px] text-gray-500">
                                        {schedule.destination}
                                    </span>
                                    <span className="text-[30px] font-bold">
                                        {formatTime(schedule.arrival_date)}
                                    </span>
                                    <span className="text-[15px] text-gray-500">
                                        {formatDate(schedule.arrival_date)}
                                    </span>
                                </div>
                            </div>
                            <div className="flex justify-end items-center">
                                <span className="text-[30px] font-bold text-[#DE5D5B]">
                                    {formatPrice(schedule.price)}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            </section>
        </div>
    )
}

export default SchedulePage
