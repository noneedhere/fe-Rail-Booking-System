'use client'

import React, { useEffect, useState, useRef, useCallback } from 'react'
import { Search, Users, ArrowLeftRight, CalendarDays, MapPin, Minus, Plus, X, Loader2 } from 'lucide-react'
import { getCookie } from '@/lib/client-cookies'
import { BASE_API_URL } from '@/global'
import { useRouter } from 'next/navigation'

interface GuestState {
    adult: number
    child: number
}

const SearchBar = () => {
    const router = useRouter()

    // Station data
    const [stations, setStations] = useState<string[]>([])
    const [stationsLoading, setStationsLoading] = useState(false)

    // Search form state
    const [departure, setDeparture] = useState('')
    const [arrival, setArrival] = useState('')
    const [departureDate, setDepartureDate] = useState('')
    const [returnDate, setReturnDate] = useState('')
    const [roundTrip, setRoundTrip] = useState(false)
    const [guests, setGuests] = useState<GuestState>({ adult: 1, child: 0 })

    // Dropdown visibility
    const [showDeparture, setShowDeparture] = useState(false)
    const [showArrival, setShowArrival] = useState(false)
    const [showGuests, setShowGuests] = useState(false)

    // Filtered stations for dropdowns
    const [departureQuery, setDepartureQuery] = useState('')
    const [arrivalQuery, setArrivalQuery] = useState('')

    // Debounce timers
    const departureTimerRef = useRef<NodeJS.Timeout | null>(null)
    const arrivalTimerRef = useRef<NodeJS.Timeout | null>(null)

    // Refs for click outside
    const departureRef = useRef<HTMLDivElement>(null)
    const arrivalRef = useRef<HTMLDivElement>(null)
    const guestsRef = useRef<HTMLDivElement>(null)

    // Search loading state
    const [searching, setSearching] = useState(false)

    // Today's date string for min attribute
    const today = new Date().toISOString().split('T')[0]

    // Fetch stations on mount
    useEffect(() => {
        const fetchStations = async () => {
            setStationsLoading(true)
            try {
                const TOKEN = getCookie('token') || ''
                const res = await fetch(`${BASE_API_URL}/schedule/stations`, {
                    headers: {
                        'Authorization': `Bearer ${TOKEN}`,
                        'Content-Type': 'application/json'
                    }
                })
                const result = await res.json()
                if (result.status) {
                    setStations(result.data || [])
                }
            } catch (err) {
                console.error('Failed to fetch stations:', err)
            } finally {
                setStationsLoading(false)
            }
        }
        fetchStations()
    }, [])

    // Close dropdowns on outside click
    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (departureRef.current && !departureRef.current.contains(e.target as Node)) {
                setShowDeparture(false)
            }
            if (arrivalRef.current && !arrivalRef.current.contains(e.target as Node)) {
                setShowArrival(false)
            }
            if (guestsRef.current && !guestsRef.current.contains(e.target as Node)) {
                setShowGuests(false)
            }
        }
        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [])

    // Debounced departure query
    const handleDepartureInput = useCallback((value: string) => {
        setDeparture(value)
        if (departureTimerRef.current) clearTimeout(departureTimerRef.current)
        departureTimerRef.current = setTimeout(() => {
            setDepartureQuery(value)
        }, 300)
    }, [])

    // Debounced arrival query
    const handleArrivalInput = useCallback((value: string) => {
        setArrival(value)
        if (arrivalTimerRef.current) clearTimeout(arrivalTimerRef.current)
        arrivalTimerRef.current = setTimeout(() => {
            setArrivalQuery(value)
        }, 300)
    }, [])

    // Filtered station lists
    const filteredDepartures = stations.filter(s =>
        s.toLowerCase().includes(departureQuery.toLowerCase())
    )
    const filteredArrivals = stations.filter(s =>
        s.toLowerCase().includes(arrivalQuery.toLowerCase()) &&
        s.toLowerCase() !== departure.toLowerCase()
    )

    // Swap departure and arrival
    const handleSwap = () => {
        const tempDep = departure
        const tempArr = arrival
        setDeparture(tempArr)
        setArrival(tempDep)
        setDepartureQuery(tempArr)
        setArrivalQuery(tempDep)
    }

    // Guest helpers
    const totalGuests = guests.adult + guests.child
    const updateGuest = (type: 'adult' | 'child', delta: number) => {
        setGuests(prev => {
            const newVal = prev[type] + delta
            if (type === 'adult' && newVal < 1) return prev
            if (type === 'child' && newVal < 0) return prev
            if (newVal > 9) return prev
            return { ...prev, [type]: newVal }
        })
    }

    // Validation
    const isValid =
        departure.trim() !== '' &&
        arrival.trim() !== '' &&
        departure.toLowerCase() !== arrival.toLowerCase() &&
        departureDate !== '' &&
        totalGuests >= 1

    // Handle search
    const handleSearch = () => {
        if (!isValid) return
        setSearching(true)

        const params = new URLSearchParams({
            departure: departure.trim(),
            arrival: arrival.trim(),
            date: departureDate,
            guests: totalGuests.toString()
        })

        if (roundTrip && returnDate) {
            params.set('returnDate', returnDate)
        }

        router.push(`/customer/schedule?${params.toString()}`)
    }

    // Reset return date when round trip is toggled off
    useEffect(() => {
        if (!roundTrip) {
            setReturnDate('')
        }
    }, [roundTrip])

    return (
        <div className="w-full max-w-[1222px]">
            {/* Main search bar container */}
            <div className="bg-white rounded-2xl shadow-2xl px-5 py-4 flex flex-wrap items-center gap-3">

                {/* Departure */}
                <div ref={departureRef} className="relative flex-1 min-w-[180px]">
                    <div
                        className={`h-[50px] bg-[#f3f3f5] flex items-center gap-2 px-4 rounded-xl cursor-text transition-all duration-200 border-2 ${showDeparture ? 'border-[#DE5D5B] bg-white shadow-sm' : 'border-transparent hover:border-gray-300'}`}
                        onClick={() => { setShowDeparture(true); setShowArrival(false); setShowGuests(false) }}
                    >
                        <MapPin size={18} className="text-[#DE5D5B] shrink-0" />
                        <input
                            id="search-departure"
                            placeholder="From"
                            value={departure}
                            onChange={e => { handleDepartureInput(e.target.value); setShowDeparture(true) }}
                            onFocus={() => { setShowDeparture(true); setShowArrival(false); setShowGuests(false) }}
                            className="bg-transparent text-[#29303A] placeholder-gray-400 outline-none text-sm w-full font-medium"
                            autoComplete="off"
                        />
                        {departure && (
                            <button onClick={(e) => { e.stopPropagation(); setDeparture(''); setDepartureQuery('') }} className="text-gray-400 hover:text-gray-600 transition">
                                <X size={14} />
                            </button>
                        )}
                    </div>

                    {/* Departure dropdown */}
                    {showDeparture && (
                        <div className="absolute top-[56px] left-0 w-full bg-white rounded-xl shadow-xl border border-gray-100 z-50 max-h-[240px] overflow-y-auto py-2 animate-in fade-in slide-in-from-top-2">
                            {stationsLoading ? (
                                <div className="flex items-center justify-center py-6 gap-2 text-gray-400">
                                    <Loader2 size={16} className="animate-spin" />
                                    <span className="text-sm">Loading stations...</span>
                                </div>
                            ) : filteredDepartures.length > 0 ? (
                                filteredDepartures.map(station => (
                                    <button
                                        key={station}
                                        className={`w-full text-left px-4 py-2.5 text-sm transition-colors flex items-center gap-2 ${station === departure ? 'bg-[#DE5D5B]/10 text-[#DE5D5B] font-semibold' : 'text-[#29303A] hover:bg-[#f7f7f9]'}`}
                                        onClick={() => { setDeparture(station); setDepartureQuery(station); setShowDeparture(false) }}
                                    >
                                        <MapPin size={14} className="text-gray-400 shrink-0" />
                                        {station}
                                    </button>
                                ))
                            ) : (
                                <div className="px-4 py-6 text-sm text-gray-400 text-center">No stations found</div>
                            )}
                        </div>
                    )}
                </div>

                {/* Swap button */}
                <button
                    onClick={handleSwap}
                    className="w-[40px] h-[40px] rounded-full bg-[#29303A] hover:bg-[#DE5D5B] flex items-center justify-center transition-all duration-300 hover:rotate-180 shrink-0 shadow-md"
                    title="Swap departure and arrival"
                >
                    <ArrowLeftRight size={16} className="text-white" />
                </button>

                {/* Arrival */}
                <div ref={arrivalRef} className="relative flex-1 min-w-[180px]">
                    <div
                        className={`h-[50px] bg-[#f3f3f5] flex items-center gap-2 px-4 rounded-xl cursor-text transition-all duration-200 border-2 ${showArrival ? 'border-[#DE5D5B] bg-white shadow-sm' : 'border-transparent hover:border-gray-300'}`}
                        onClick={() => { setShowArrival(true); setShowDeparture(false); setShowGuests(false) }}
                    >
                        <MapPin size={18} className="text-[#DE5D5B] shrink-0" />
                        <input
                            id="search-arrival"
                            placeholder="To"
                            value={arrival}
                            onChange={e => { handleArrivalInput(e.target.value); setShowArrival(true) }}
                            onFocus={() => { setShowArrival(true); setShowDeparture(false); setShowGuests(false) }}
                            className="bg-transparent text-[#29303A] placeholder-gray-400 outline-none text-sm w-full font-medium"
                            autoComplete="off"
                        />
                        {arrival && (
                            <button onClick={(e) => { e.stopPropagation(); setArrival(''); setArrivalQuery('') }} className="text-gray-400 hover:text-gray-600 transition">
                                <X size={14} />
                            </button>
                        )}
                    </div>

                    {/* Arrival dropdown */}
                    {showArrival && (
                        <div className="absolute top-[56px] left-0 w-full bg-white rounded-xl shadow-xl border border-gray-100 z-50 max-h-[240px] overflow-y-auto py-2">
                            {stationsLoading ? (
                                <div className="flex items-center justify-center py-6 gap-2 text-gray-400">
                                    <Loader2 size={16} className="animate-spin" />
                                    <span className="text-sm">Loading stations...</span>
                                </div>
                            ) : filteredArrivals.length > 0 ? (
                                filteredArrivals.map(station => (
                                    <button
                                        key={station}
                                        className={`w-full text-left px-4 py-2.5 text-sm transition-colors flex items-center gap-2 ${station === arrival ? 'bg-[#DE5D5B]/10 text-[#DE5D5B] font-semibold' : 'text-[#29303A] hover:bg-[#f7f7f9]'}`}
                                        onClick={() => { setArrival(station); setArrivalQuery(station); setShowArrival(false) }}
                                    >
                                        <MapPin size={14} className="text-gray-400 shrink-0" />
                                        {station}
                                    </button>
                                ))
                            ) : (
                                <div className="px-4 py-6 text-sm text-gray-400 text-center">No stations found</div>
                            )}
                        </div>
                    )}
                </div>

                {/* Divider */}
                <div className="w-px h-[36px] bg-gray-200 hidden lg:block"></div>

                {/* Date + Round Trip */}
                <div className="flex items-center gap-2 min-w-[240px]">
                    <div className="relative flex-1">
                        <div className="h-[50px] bg-[#f3f3f5] flex items-center gap-2 px-4 rounded-xl border-2 border-transparent hover:border-gray-300 transition-all duration-200">
                            <CalendarDays size={18} className="text-[#DE5D5B] shrink-0" />
                            <input
                                id="search-departure-date"
                                type="date"
                                value={departureDate}
                                min={today}
                                onChange={e => setDepartureDate(e.target.value)}
                                className="bg-transparent text-[#29303A] outline-none text-sm w-full font-medium cursor-pointer"
                            />
                        </div>
                    </div>

                    {/* Round trip toggle */}
                    <div className="flex flex-col items-center gap-1">
                        <button
                            onClick={() => setRoundTrip(!roundTrip)}
                            className={`w-[44px] h-[24px] rounded-full flex items-center px-0.5 transition-all duration-300 ${roundTrip ? 'bg-[#DE5D5B]' : 'bg-gray-300'}`}
                            title={roundTrip ? 'Disable round trip' : 'Enable round trip'}
                        >
                            <div className={`w-[20px] h-[20px] bg-white rounded-full shadow-sm transition-transform duration-300 ${roundTrip ? 'translate-x-[20px]' : 'translate-x-0'}`} />
                        </button>
                        <span className="text-[10px] text-gray-500 font-medium">Return</span>
                    </div>

                    {/* Return date (shows when round trip is ON) */}
                    {roundTrip && (
                        <div className="relative flex-1">
                            <div className="h-[50px] bg-[#f3f3f5] flex items-center gap-2 px-4 rounded-xl border-2 border-transparent hover:border-gray-300 transition-all duration-200">
                                <CalendarDays size={18} className="text-[#DE5D5B] shrink-0" />
                                <input
                                    id="search-return-date"
                                    type="date"
                                    value={returnDate}
                                    min={departureDate || today}
                                    onChange={e => setReturnDate(e.target.value)}
                                    className="bg-transparent text-[#29303A] outline-none text-sm w-full font-medium cursor-pointer"
                                />
                            </div>
                        </div>
                    )}
                </div>

                {/* Divider */}
                <div className="w-px h-[36px] bg-gray-200 hidden lg:block"></div>

                {/* Guest selector */}
                <div ref={guestsRef} className="relative min-w-[130px]">
                    <div
                        className={`h-[50px] bg-[#f3f3f5] flex items-center gap-2 px-4 rounded-xl cursor-pointer transition-all duration-200 border-2 ${showGuests ? 'border-[#DE5D5B] bg-white shadow-sm' : 'border-transparent hover:border-gray-300'}`}
                        onClick={() => { setShowGuests(!showGuests); setShowDeparture(false); setShowArrival(false) }}
                    >
                        <Users size={18} className="text-[#DE5D5B] shrink-0" />
                        <span className="text-sm text-[#29303A] font-medium">
                            {totalGuests} Guest{totalGuests !== 1 ? 's' : ''}
                        </span>
                    </div>

                    {/* Guest dropdown */}
                    {showGuests && (
                        <div className="absolute top-[56px] right-0 w-[220px] bg-white rounded-xl shadow-xl border border-gray-100 z-50 py-4 px-4">
                            {/* Adult */}
                            <div className="flex items-center justify-between mb-3">
                                <div>
                                    <p className="text-sm font-semibold text-[#29303A]">Adult</p>
                                    <p className="text-xs text-gray-400">Age 13+</p>
                                </div>
                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={() => updateGuest('adult', -1)}
                                        disabled={guests.adult <= 1}
                                        className="w-[28px] h-[28px] rounded-full border border-gray-300 flex items-center justify-center text-gray-500 hover:border-[#DE5D5B] hover:text-[#DE5D5B] disabled:opacity-30 disabled:cursor-not-allowed transition"
                                    >
                                        <Minus size={14} />
                                    </button>
                                    <span className="text-sm font-bold text-[#29303A] w-[20px] text-center">{guests.adult}</span>
                                    <button
                                        onClick={() => updateGuest('adult', 1)}
                                        disabled={guests.adult >= 9}
                                        className="w-[28px] h-[28px] rounded-full border border-gray-300 flex items-center justify-center text-gray-500 hover:border-[#DE5D5B] hover:text-[#DE5D5B] disabled:opacity-30 disabled:cursor-not-allowed transition"
                                    >
                                        <Plus size={14} />
                                    </button>
                                </div>
                            </div>

                            {/* Child */}
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-semibold text-[#29303A]">Child</p>
                                    <p className="text-xs text-gray-400">Age 2–12</p>
                                </div>
                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={() => updateGuest('child', -1)}
                                        disabled={guests.child <= 0}
                                        className="w-[28px] h-[28px] rounded-full border border-gray-300 flex items-center justify-center text-gray-500 hover:border-[#DE5D5B] hover:text-[#DE5D5B] disabled:opacity-30 disabled:cursor-not-allowed transition"
                                    >
                                        <Minus size={14} />
                                    </button>
                                    <span className="text-sm font-bold text-[#29303A] w-[20px] text-center">{guests.child}</span>
                                    <button
                                        onClick={() => updateGuest('child', 1)}
                                        disabled={guests.child >= 9}
                                        className="w-[28px] h-[28px] rounded-full border border-gray-300 flex items-center justify-center text-gray-500 hover:border-[#DE5D5B] hover:text-[#DE5D5B] disabled:opacity-30 disabled:cursor-not-allowed transition"
                                    >
                                        <Plus size={14} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Search button */}
                <button
                    id="search-button"
                    onClick={handleSearch}
                    disabled={!isValid || searching}
                    className={`h-[50px] px-6 rounded-xl flex items-center justify-center gap-2 font-semibold text-sm transition-all duration-300 shrink-0 ${isValid && !searching
                            ? 'bg-[#DE5D5B] text-white hover:bg-[#c94d4b] shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-[0.98]'
                            : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                        }`}
                >
                    {searching ? (
                        <Loader2 size={18} className="animate-spin" />
                    ) : (
                        <Search size={18} />
                    )}
                    <span>Search</span>
                </button>
            </div>

            {/* Validation hint */}
            {departure && arrival && departure.toLowerCase() === arrival.toLowerCase() && (
                <div className="mt-2 px-4 py-2 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600 flex items-center gap-2">
                    <X size={14} />
                    Departure and arrival cannot be the same station
                </div>
            )}
        </div>
    )
}

export default SearchBar
