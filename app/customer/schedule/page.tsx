'use client'

import React, { useEffect, useState, Suspense } from 'react';
import { Schedule } from '@/app/types';
import { getCookie } from '@/lib/client-cookies';
import { BASE_API_URL } from '@/global';
import { useSearchParams, useRouter } from 'next/navigation';
import { MapPin, ArrowRight, CalendarDays, Users, Search, AlertCircle, Loader2, ArrowLeft } from 'lucide-react';

function ScheduleContent() {
    const searchParams = useSearchParams();
    const router = useRouter();

    const [schedules, setSchedules] = useState<Schedule[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [searchMessage, setSearchMessage] = useState<string>('');

    // Read search params
    const departure = searchParams.get('departure');
    const arrival = searchParams.get('arrival');
    const date = searchParams.get('date');
    const returnDate = searchParams.get('returnDate');
    const guests = searchParams.get('guests');

    const hasSearchParams = departure && arrival && date;

    // Fetch schedules from backend API
    useEffect(() => {
        const fetchSchedules = async () => {
            setLoading(true);
            setError(null);
            try {
                const TOKEN = getCookie("token") || "";

                let url: string;
                if (hasSearchParams) {
                    // Use search endpoint with filters
                    const params = new URLSearchParams({
                        departure: departure!,
                        arrival: arrival!,
                        date: date!,
                    });
                    if (guests) params.set('guests', guests);
                    url = `${BASE_API_URL}/schedule/search?${params.toString()}`;
                } else {
                    // No filters — fetch all active schedules
                    url = `${BASE_API_URL}/schedule/`;
                }

                const response = await fetch(url, {
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
                    if (hasSearchParams) {
                        // Search endpoint returns filtered results directly
                        setSchedules(result.data || []);
                        setSearchMessage(result.message || '');
                    } else {
                        // All schedules endpoint — filter only ACTIVED
                        const activeSchedules = (result.data || []).filter(
                            (s: Schedule) => s.status === 'ACTIVED'
                        );
                        setSchedules(activeSchedules);
                        setSearchMessage('');
                    }
                } else {
                    setSchedules([]);
                    setSearchMessage(result.message || '');
                }
            } catch (err) {
                setError(err instanceof Error ? err.message : 'An error occurred');
            } finally {
                setLoading(false);
            }
        };

        fetchSchedules();
    }, [departure, arrival, date, guests, hasSearchParams]);

    // Format time from datetime string (HH:mm)
    const formatTime = (dateStr: string): string => {
        const d = new Date(dateStr);
        return d.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', hour12: false });
    };

    // Format date from datetime string (DD MMM YYYY)
    const formatDate = (dateStr: string): string => {
        const d = new Date(dateStr);
        return d.toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' });
    };

    // Calculate duration between departure and arrival
    const calculateDuration = (dep: string, arr: string): string => {
        const depDate = new Date(dep);
        const arrDate = new Date(arr);
        const diffMs = arrDate.getTime() - depDate.getTime();
        const hours = Math.floor(diffMs / (1000 * 60 * 60));
        const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
        return `${hours}j ${minutes}m`;
    };

    // Format price to Indonesian Rupiah
    const formatPrice = (price: number): string => {
        return `Rp ${price.toLocaleString('id-ID')}`;
    };

    // Format search date for display
    const formatSearchDate = (dateStr: string): string => {
        const d = new Date(dateStr);
        return d.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
    };

    return (
        <div>
            <div id='home' className='relative w-full h-[400px] flex items-center justify-center overflow-hidden'>
                <img src="/images/dashboardFoto.png" alt="" className='absolute top-0 left-0 w-full h-full object-cover' />
                <div className="absolute inset-0 bg-gradient-to-b from-[#29303A]/70 via-[#29303A]/50 to-[#29303A]/80"></div>

                <div className="text-white px-20 relative items-center justify-center flex flex-col z-20">
                    {hasSearchParams ? (
                        <>
                            {/* Search Summary */}
                            <div className="flex items-center gap-3 text-lg mb-4 opacity-90">
                                <MapPin size={18} />
                                <span className="font-semibold">{departure}</span>
                                <ArrowRight size={18} />
                                <span className="font-semibold">{arrival}</span>
                                {returnDate && (
                                    <>
                                        <ArrowRight size={18} className="rotate-180" />
                                        <span className="font-semibold">{departure}</span>
                                    </>
                                )}
                            </div>

                            <h1 className='text-5xl font-bold mb-3'>
                                {loading ? (
                                    <span className="flex items-center gap-3">
                                        <Loader2 className="animate-spin" size={36} />
                                        Searching...
                                    </span>
                                ) : (
                                    `${schedules.length} Result${schedules.length !== 1 ? 's' : ''} Found`
                                )}
                            </h1>

                            <div className="flex items-center gap-4 text-sm opacity-80 mt-2">
                                <div className="flex items-center gap-1">
                                    <CalendarDays size={14} />
                                    <span>{formatSearchDate(date!)}</span>
                                    {returnDate && <span>— {formatSearchDate(returnDate)}</span>}
                                </div>
                                {guests && (
                                    <div className="flex items-center gap-1">
                                        <Users size={14} />
                                        <span>{guests} Guest{Number(guests) !== 1 ? 's' : ''}</span>
                                    </div>
                                )}
                            </div>
                        </>
                    ) : (
                        <>
                            <h1 className='text-5xl font-bold'>
                                {loading ? 'Loading...' : `${schedules.length} Schedule${schedules.length !== 1 ? 's' : ''} Available`}
                            </h1>
                            <p className="mt-2 opacity-80">Choose your departure schedule</p>
                        </>
                    )}
                </div>
            </div>

            <section id="schedule" className="w-full bg-[#f7f7f9] min-h-[400px] py-[45px]">
                <div className="max-w-[1112px] mx-auto flex flex-col gap-6">

                    {/* Back to search & search info */}
                    {hasSearchParams && (
                        <div className="flex items-center justify-between mb-2">
                            <button
                                onClick={() => router.push('/customer/dashboard')}
                                className="flex items-center gap-2 text-[#DE5D5B] hover:text-[#c94d4b] font-medium text-sm transition-colors"
                            >
                                <ArrowLeft size={16} />
                                New Search
                            </button>

                            {!loading && searchMessage && (
                                <span className="text-sm text-gray-500">{searchMessage}</span>
                            )}
                        </div>
                    )}

                    {/* Loading state */}
                    {loading && (
                        <div className="w-full bg-white rounded-2xl shadow-sm px-[60px] py-[60px] flex items-center justify-center">
                            <div className="flex flex-col items-center gap-4">
                                <div className="w-14 h-14 border-4 border-gray-200 border-t-[#DE5D5B] rounded-full animate-spin"></div>
                                <p className="text-gray-400 text-lg font-medium">Loading schedules...</p>
                            </div>
                        </div>
                    )}

                    {/* Error state */}
                    {error && !loading && (
                        <div className="w-full bg-white rounded-2xl shadow-sm px-[60px] py-[60px] flex items-center justify-center">
                            <div className="flex flex-col items-center gap-4 text-center">
                                <div className="w-16 h-16 rounded-full bg-red-50 flex items-center justify-center">
                                    <AlertCircle size={32} className="text-red-400" />
                                </div>
                                <p className="text-red-500 text-lg font-medium">{error}</p>
                                <button
                                    onClick={() => window.location.reload()}
                                    className="mt-2 px-6 py-2 bg-[#DE5D5B] text-white rounded-lg text-sm font-medium hover:bg-[#c94d4b] transition"
                                >
                                    Try Again
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Empty state */}
                    {!loading && !error && schedules.length === 0 && (
                        <div className="w-full bg-white rounded-2xl shadow-sm px-[60px] py-[60px] flex items-center justify-center">
                            <div className="flex flex-col items-center gap-4 text-center">
                                <div className="w-20 h-20 rounded-full bg-gray-50 flex items-center justify-center">
                                    <Search size={36} className="text-gray-300" />
                                </div>
                                <p className="text-gray-600 text-xl font-semibold">
                                    {hasSearchParams ? 'No schedules found for your criteria' : 'No schedules available'}
                                </p>
                                <p className="text-gray-400 text-sm max-w-md">
                                    {hasSearchParams
                                        ? 'Try changing your departure, arrival, or travel date to find available trains.'
                                        : 'There are currently no active train schedules.'}
                                </p>
                                {hasSearchParams && (
                                    <button
                                        onClick={() => router.push('/customer/dashboard')}
                                        className="mt-3 px-6 py-2.5 bg-[#DE5D5B] text-white rounded-xl text-sm font-semibold hover:bg-[#c94d4b] transition-all shadow-md hover:shadow-lg"
                                    >
                                        Search Again
                                    </button>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Schedule cards */}
                    {!loading && !error && schedules.map((schedule) => (
                        <div
                            key={schedule.id_schedule}
                            className="w-full bg-white text-[#29303A] rounded-2xl shadow-sm hover:shadow-md px-[60px] py-[45px] flex flex-col justify-between transition-all duration-300 border border-gray-100 hover:border-[#DE5D5B]/20 group"
                        >
                            <div className="grid grid-cols-4 items-center">

                                <div>
                                    <p className="text-[28px] font-semibold text-[#29303A] pr-10 group-hover:text-[#DE5D5B] transition-colors">
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

                            <div className="flex justify-between items-center mt-4 pt-4 border-t border-gray-100">
                                <div className="flex items-center gap-2">
                                    {schedule.quota_total && schedule.quota_total > 0 && (
                                        <span className="px-3 py-1 bg-green-50 text-green-600 rounded-full text-xs font-medium">
                                            {schedule.quota_total} seats available
                                        </span>
                                    )}
                                </div>
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

const SchedulePage = () => {
    return (
        <Suspense fallback={
            <div className="w-full h-screen flex items-center justify-center bg-[#f7f7f9]">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-14 h-14 border-4 border-gray-200 border-t-[#DE5D5B] rounded-full animate-spin"></div>
                    <p className="text-gray-400 text-lg font-medium">Loading...</p>
                </div>
            </div>
        }>
            <ScheduleContent />
        </Suspense>
    )
}

export default SchedulePage
