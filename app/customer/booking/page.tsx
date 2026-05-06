'use client';

import React, { useEffect, useState, useCallback, useRef, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Schedule } from '@/app/types';
import { SeatMappingData, SeatSelection, SeatMappingResponse } from '@/app/types/seatMapping';
import { getCookie } from '@/lib/client-cookies';
import { BASE_API_URL } from '@/global';
import CarriageSelector from '@/components/CarriageSelector/CarriageSelector';
import SeatMap from '@/components/SeatMap/SeatMap';
import BookingSummary, { BuyerInfo } from '@/components/BookingSummary/BookingSummary';
import { toast } from 'react-toastify';

type BookingStep = 'schedule' | 'carriage' | 'seats';

interface BookingState {
    step: BookingStep;
    scheduleId: number | null;
    scheduleData: SeatMappingData | null;
    selectedCarriageId: number | null;
    selectedSeats: SeatSelection[];
}

const CustomerBookingPage = () => {
    const router = useRouter();
    const searchParams = useSearchParams();

    const activeTrain = 'whoosh';

    // Schedule list state
    const [schedules, setSchedules] = useState<Schedule[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Booking state
    const [booking, setBooking] = useState<BookingState>({
        step: 'schedule',
        scheduleId: null,
        scheduleData: null,
        selectedCarriageId: null,
        selectedSeats: [],
    });

    const [seatMapLoading, setSeatMapLoading] = useState(false);
    const [purchaseLoading, setPurchaseLoading] = useState(false);

    // Hold timer state
    const [holdExpiry, setHoldExpiry] = useState<Date | null>(null);
    const [timeLeft, setTimeLeft] = useState<number>(0);
    const [holdLoading, setHoldLoading] = useState(false);

    // Track seats to release on unmount
    const bookingRef = useRef(booking);
    bookingRef.current = booking;

    // Countdown timer effect
    useEffect(() => {
        if (!holdExpiry || booking.selectedSeats.length === 0) {
            setTimeLeft(0);
            return;
        }

        const interval = setInterval(() => {
            const remaining = Math.max(0, holdExpiry.getTime() - Date.now());
            setTimeLeft(remaining);

            if (remaining === 0) {
                toast.warning('Your seat hold has expired. Please select seats again.');
                setBooking(prev => ({ ...prev, selectedSeats: [] }));
                setHoldExpiry(null);
                // Refresh seat map
                if (bookingRef.current.scheduleId) {
                    fetchSeatMapping(bookingRef.current.scheduleId);
                }
            }
        }, 1000);

        return () => clearInterval(interval);
    }, [holdExpiry, booking.selectedSeats.length]);

    // Release holds when navigating away or unmounting
    useEffect(() => {
        const releaseHoldsOnUnload = () => {
            const current = bookingRef.current;
            if (current.selectedSeats.length > 0 && current.scheduleId) {
                const TOKEN = getCookie("token") || "";
                // Use fetch with keepalive for reliability on page close
                fetch(`${BASE_API_URL}/purchase/hold`, {
                    method: 'DELETE',
                    headers: {
                        'Authorization': `Bearer ${TOKEN}`,
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        id_schedule: current.scheduleId,
                        seat_ids: current.selectedSeats.map(s => s.id_seat),
                    }),
                    keepalive: true,
                }).catch(() => { /* best-effort, cron will clean up */ });
            }
        };

        window.addEventListener('beforeunload', releaseHoldsOnUnload);
        return () => {
            window.removeEventListener('beforeunload', releaseHoldsOnUnload);
            releaseHoldsOnUnload();
        };
    }, []);

    // Fetch schedules
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


    // Fetch seat mapping for schedule
    const fetchSeatMapping = useCallback(async (scheduleId: number) => {
        setSeatMapLoading(true);
        try {
            const TOKEN = getCookie("token") || "";
            const response = await fetch(`${BASE_API_URL}/schedule/seatmapping/${scheduleId}`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${TOKEN}`,
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                throw new Error('Failed to fetch seat mapping');
            }

            const result: SeatMappingResponse = await response.json();
            if (result.status) {
                setBooking(prev => ({
                    ...prev,
                    step: 'carriage',
                    scheduleId,
                    scheduleData: result.data,
                    selectedCarriageId: null,
                    selectedSeats: [],
                }));
            }
        } catch (err) {
            toast.error(err instanceof Error ? err.message : 'Failed to load seat mapping');
        } finally {
            setSeatMapLoading(false);
        }
    }, []);

    // Auto-navigate to seat selection when ?schedule=ID is in the URL
    const preselectedScheduleId = searchParams.get('schedule');
    const hasAutoTriggered = useRef(false);

    useEffect(() => {
        if (preselectedScheduleId && !hasAutoTriggered.current) {
            hasAutoTriggered.current = true;
            const scheduleId = Number(preselectedScheduleId);
            if (!isNaN(scheduleId) && scheduleId > 0) {
                fetchSeatMapping(scheduleId);
            }
        }
    }, [preselectedScheduleId, fetchSeatMapping]);

    // Release seats helper
    const releaseSeatsAPI = async (scheduleId: number, seatIds: number[]) => {
        try {
            const TOKEN = getCookie("token") || "";
            await fetch(`${BASE_API_URL}/purchase/hold`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${TOKEN}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    id_schedule: scheduleId,
                    seat_ids: seatIds,
                }),
            });
        } catch {
            // Best effort — cron will clean up
        }
    };

    // Handle seat selection — now calls hold API
    const handleSeatToggle = async (seat: SeatSelection) => {
        if (holdLoading) return;

        const exists = booking.selectedSeats.find(s => s.id_seat === seat.id_seat);

        if (exists) {
            // Deselect: release hold
            setHoldLoading(true);
            if (booking.scheduleId) {
                await releaseSeatsAPI(booking.scheduleId, [seat.id_seat]);
            }

            setBooking(prev => {
                const newSeats = prev.selectedSeats.filter(s => s.id_seat !== seat.id_seat);
                if (newSeats.length === 0) {
                    setHoldExpiry(null);
                }
                return { ...prev, selectedSeats: newSeats };
            });
            setHoldLoading(false);
        } else {
            // Select: hold seat
            if (booking.selectedSeats.length >= 10) {
                toast.warning('Maximum 10 seats per booking');
                return;
            }

            setHoldLoading(true);
            try {
                const TOKEN = getCookie("token") || "";
                const response = await fetch(`${BASE_API_URL}/purchase/hold`, {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${TOKEN}`,
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        id_schedule: booking.scheduleId,
                        seat_ids: [seat.id_seat],
                    }),
                });

                const result = await response.json();

                if (result.status) {
                    setBooking(prev => ({
                        ...prev,
                        selectedSeats: [...prev.selectedSeats, seat],
                    }));
                    // Use duration from server to calculate local expiry (avoids timezone issues)
                    const durationMs = (result.data.hold_duration_seconds || 300) * 1000;
                    setHoldExpiry(new Date(Date.now() + durationMs));
                } else {
                    toast.error(result.message || 'Seat is no longer available');
                    // Refresh seat map to show updated availability
                    if (booking.scheduleId) {
                        fetchSeatMapping(booking.scheduleId);
                    }
                }
            } catch (err) {
                toast.error('Failed to hold seat. Please try again.');
            } finally {
                setHoldLoading(false);
            }
        }
    };

    // Handle carriage selection
    const handleCarriageSelect = (carriageId: number) => {
        setBooking(prev => ({
            ...prev,
            step: 'seats',
            selectedCarriageId: carriageId,
        }));
    };

    // Handle back navigation — release holds when going back
    const handleBack = async () => {
        const current = booking;

        if (current.step === 'seats' && current.selectedSeats.length > 0 && current.scheduleId) {
            // Release all held seats when going back from seat selection
            await releaseSeatsAPI(
                current.scheduleId,
                current.selectedSeats.map(s => s.id_seat)
            );
            setHoldExpiry(null);
        }

        setBooking(prev => {
            switch (prev.step) {
                case 'seats':
                    return { ...prev, step: 'carriage', selectedCarriageId: null, selectedSeats: [] };
                case 'carriage':
                    return { ...prev, step: 'schedule', scheduleId: null, scheduleData: null, selectedSeats: [] };
                default:
                    return prev;
            }
        });
    };

    // Handle booking confirmation with buyer info
    const handleConfirmBooking = async (buyerInfo: BuyerInfo) => {
        if (!booking.scheduleId || booking.selectedSeats.length === 0) return;

        setPurchaseLoading(true);
        try {
            const TOKEN = getCookie("token") || "";
            const response = await fetch(`${BASE_API_URL}/purchase`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${TOKEN}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    id_schedule: booking.scheduleId,
                    seat_ids: booking.selectedSeats.map(s => s.id_seat),
                    buyer_name: buyerInfo.buyer_name,
                    buyer_email: buyerInfo.buyer_email,
                    buyer_phone: buyerInfo.buyer_phone,
                }),
            });

            const result = await response.json();

            if (result.status) {
                setHoldExpiry(null); // Clear timer on success
                toast.success(`Booking successful! Total: Rp ${result.data.total_price.toLocaleString('id-ID')}`);
                // Navigate to purchase detail/receipt page
                router.push(`/customer/purchases/${result.data.id_ticketpurchase}`);
            } else if (response.status === 409 && result.error_code === 'SEAT_CONFLICT') {
                // Race condition caught — seats were taken by another user
                const conflicting = result.conflicting_seats?.join(', ') || 'some seats';
                toast.error(
                    `⚠️ Seats no longer available: ${conflicting}. The seat map has been refreshed.`,
                    { autoClose: 6000 }
                );
                // Clear selections and refresh seat map
                setBooking(prev => ({ ...prev, selectedSeats: [] }));
                setHoldExpiry(null);
                if (booking.scheduleId) {
                    fetchSeatMapping(booking.scheduleId);
                }
            } else {
                toast.error(result.message || 'Booking failed');
                // Refresh seat mapping to get updated availability
                if (booking.scheduleId) {
                    fetchSeatMapping(booking.scheduleId);
                }
            }
        } catch (err) {
            toast.error(err instanceof Error ? err.message : 'Booking failed');
        } finally {
            setPurchaseLoading(false);
        }
    };

    // Get total price
    const getTotalPrice = () => {
        return booking.selectedSeats.reduce((sum, seat) => sum + seat.price, 0);
    };

    // Get selected carriage data
    const getSelectedCarriage = () => {
        if (!booking.scheduleData || !booking.selectedCarriageId) return null;
        return booking.scheduleData.carriages.find(c => c.id_carriage === booking.selectedCarriageId);
    };

    // Format helpers
    const formatTime = (dateStr: string): string => {
        const date = new Date(dateStr);
        return date.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', hour12: false });
    };

    const formatDate = (dateStr: string): string => {
        const date = new Date(dateStr);
        return date.toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' });
    };

    const calculateDuration = (departure: string, arrival: string): string => {
        const dep = new Date(departure);
        const arr = new Date(arrival);
        const diffMs = arr.getTime() - dep.getTime();
        const hours = Math.floor(diffMs / (1000 * 60 * 60));
        const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
        return `${hours}j ${minutes}m`;
    };

    const formatPrice = (price: number): string => {
        return `Rp ${price.toLocaleString('id-ID')}`;
    };

    // Render schedule list
    const renderScheduleList = () => (
        <>
            {/* Hero Section */}
            <div id='home' className='relative w-full h-[650px] flex items-center justify-center p-20'>
                <img src="/images/dashboardFoto.png" alt="" className='absolute top-0 left-0 w-full h-full object-cover'/>

                <div className="text-white text-center z-20">
                    <h1 className='text-5xl font-bold mb-4'>Book Your Journey</h1>
                    <p className='text-xl opacity-80'>Select a schedule to begin</p>
                </div>
            </div>

            {/* Schedule Cards */}
            <section className="w-full bg-white py-12">
                <div className="max-w-[1200px] mx-auto px-6">
                    {loading && (
                        <div className="flex flex-col items-center justify-center py-20">
                            <div className="w-12 h-12 border-4 border-gray-300 border-t-[#DE5D5B] rounded-full animate-spin"></div>
                            <p className="text-gray-500 text-lg mt-4">Loading schedules...</p>
                        </div>
                    )}

                    {error && !loading && (
                        <div className="bg-[#DE5D5B]/10 border border-[#DE5D5B]/30 rounded-xl p-8 text-center">
                            <p className="text-[#DE5D5B] text-lg">{error}</p>
                        </div>
                    )}

                    {!loading && !error && schedules.length === 0 && (
                        <div className="bg-white rounded-xl shadow-md p-12 text-center">
                            <svg xmlns="http://www.w3.org/2000/svg" className="w-16 h-16 mx-auto text-gray-300 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            <p className="text-gray-500 text-xl font-medium">No schedules available</p>
                            <p className="text-gray-400 text-sm mt-2">Check back later for new schedules</p>
                        </div>
                    )}

                    <div className="grid gap-6">
                        {!loading && !error && schedules.map((schedule) => (
                            <div
                                key={schedule.id_schedule}
                                className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden"
                            >
                                <div className="p-6">
                                    <div className="grid grid-cols-5 items-center gap-4">
                                        {/* Schedule Name */}
                                        <div>
                                            <p className="text-xl font-bold text-[#29303A]">{schedule.schedule_name}</p>
                                            <p className="text-sm text-gray-400 mt-1">Train #{schedule.id_train}</p>
                                        </div>

                                        {/* Departure */}
                                        <div className="text-center">
                                            <p className="text-sm text-gray-500">{schedule.departure}</p>
                                            <p className="text-2xl font-bold text-[#29303A]">{formatTime(schedule.departure_date)}</p>
                                            <p className="text-sm text-gray-400">{formatDate(schedule.departure_date)}</p>
                                        </div>

                                        {/* Duration */}
                                        <div className="text-center">
                                            <p className="text-sm text-gray-500">Duration</p>
                                            <p className="text-lg font-medium text-[#29303A]">{calculateDuration(schedule.departure_date, schedule.arrival_date)}</p>
                                            <div className="w-full h-0.5 bg-gradient-to-r from-transparent via-gray-300 to-transparent mt-2"></div>
                                        </div>

                                        {/* Arrival */}
                                        <div className="text-center">
                                            <p className="text-sm text-gray-500">{schedule.destination}</p>
                                            <p className="text-2xl font-bold text-[#29303A]">{formatTime(schedule.arrival_date)}</p>
                                            <p className="text-sm text-gray-400">{formatDate(schedule.arrival_date)}</p>
                                        </div>

                                        {/* Price & Book Button */}
                                        <div className="text-right">
                                            <p className="text-sm text-gray-500">Starting from</p>
                                            <p className="text-2xl font-bold text-[#DE5D5B]">{formatPrice(schedule.price)}</p>
                                            <button
                                                onClick={() => fetchSeatMapping(schedule.id_schedule)}
                                                disabled={seatMapLoading}
                                                className="mt-3 px-6 py-2 bg-gradient-to-r from-[#DE5D5B] to-[#c94a48] text-white rounded-lg font-medium hover:from-[#c94a48] hover:to-[#b53e3c] transition-all shadow-md hover:shadow-lg disabled:opacity-50"
                                            >
                                                {seatMapLoading ? 'Loading...' : 'Book Now →'}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </>
    );

    // Render carriage selection
    const renderCarriageSelection = () => (
        <div className="min-h-screen bg-white py-8 pt-24">
            <div className="max-w-[1200px] mx-auto px-6">
                {/* Schedule Info Header */}
                {booking.scheduleData && (
                    <div className="bg-white rounded-xl shadow-md p-6 mb-8">
                        <div className="flex justify-between items-center">
                            <div>
                                <h2 className="text-2xl font-bold text-[#29303A]">{booking.scheduleData.schedule.schedule_name}</h2>
                                <p className="text-gray-500">{booking.scheduleData.train.train_name}</p>
                            </div>
                            <div className="text-right">
                                <p className="text-sm text-gray-500">
                                    {booking.scheduleData.schedule.departure} → {booking.scheduleData.schedule.destination}
                                </p>
                                <p className="text-gray-700 font-medium">
                                    {formatDate(booking.scheduleData.schedule.departure_date)} • {formatTime(booking.scheduleData.schedule.departure_date)}
                                </p>
                            </div>
                        </div>
                        {/* Availability Summary */}
                        <div className="mt-4 pt-4 border-t border-gray-100 flex gap-6">
                            <div className="text-sm">
                                <span className="text-[#DE5D5B] font-bold">{booking.scheduleData.summary.available_seats}</span>
                                <span className="text-gray-500"> available</span>
                            </div>
                            <div className="text-sm">
                                <span className="text-[#29303A] font-bold">{booking.scheduleData.summary.booked_seats}</span>
                                <span className="text-gray-500"> booked</span>
                            </div>
                            <div className="text-sm">
                                <span className="text-[#29303A] font-bold">{booking.scheduleData.summary.total_seats}</span>
                                <span className="text-gray-500"> total seats</span>
                            </div>
                        </div>
                    </div>
                )}

                {/* Carriage Selector */}
                {booking.scheduleData && (
                    <CarriageSelector
                        carriages={booking.scheduleData.carriages}
                        onSelect={handleCarriageSelect}
                        onBack={handleBack}
                    />
                )}
            </div>
        </div>
    );

    // Render seat selection
    const renderSeatSelection = () => {
        const carriage = getSelectedCarriage();
        if (!carriage || !booking.scheduleData) return null;

        return (
            <div className="min-h-screen bg-white py-8 pt-24">
                <div className="max-w-[1400px] mx-auto px-6">
                    {/* Header */}
                    <div className="mb-8">
                        <button
                            onClick={handleBack}
                            className="flex items-center gap-2 px-4 py-2 text-[#29303A] hover:text-[#DE5D5B] hover:bg-[#29303A]/5 rounded-lg transition-all mb-4"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
                            </svg>
                            Back to Carriages
                        </button>

                        <div className="flex justify-between items-center">
                            <div>
                                <h1 className="text-3xl font-bold text-[#29303A]">Select Your Seats</h1>
                                <p className="text-gray-500">
                                    {booking.scheduleData.schedule.schedule_name} • {carriage.carriage_name}
                                </p>
                            </div>
                            {/* Hold timer indicator in header */}
                            {holdLoading && (
                                <div className="flex items-center gap-2 text-sm text-amber-600">
                                    <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                                    </svg>
                                    Securing seat...
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Main Content */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Seat Map */}
                        <div className="lg:col-span-2">
                            <SeatMap
                                carriageId={carriage.id_carriage}
                                carriageName={carriage.carriage_name}
                                carriageCategory={carriage.carriage_category}
                                layout={carriage.layout}
                                seats={carriage.seats}
                                selectedSeats={booking.selectedSeats.map(s => s.id_seat)}
                                onSeatSelect={handleSeatToggle}
                                seatPrice={carriage.seat_price}
                            />
                        </div>

                        {/* Booking Summary */}
                        <div className="lg:col-span-1">
                            <BookingSummary
                                selectedSeats={booking.selectedSeats}
                                totalPrice={getTotalPrice()}
                                onConfirm={handleConfirmBooking}
                                onBack={handleBack}
                                isLoading={purchaseLoading}
                                maxSeats={10}
                                holdTimeLeft={timeLeft}
                            />
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    // Main render
    return (
        <div>
            {booking.step === 'schedule' && renderScheduleList()}
            {booking.step === 'carriage' && renderCarriageSelection()}
            {booking.step === 'seats' && renderSeatSelection()}
        </div>
    );
};

const BookingPage = () => (
    <Suspense fallback={
        <div className="min-h-screen flex items-center justify-center bg-white">
            <div className="flex flex-col items-center gap-4">
                <div className="w-12 h-12 border-4 border-gray-300 border-t-[#DE5D5B] rounded-full animate-spin"></div>
                <p className="text-gray-500 text-lg">Loading booking...</p>
            </div>
        </div>
    }>
        <CustomerBookingPage />
    </Suspense>
);

export default BookingPage;
