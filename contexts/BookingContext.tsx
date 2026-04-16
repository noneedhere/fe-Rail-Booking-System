'use client';

import React, { createContext, useContext, useReducer, ReactNode } from 'react';
import {
    BookingState,
    BookingAction,
    SeatMappingData,
    SeatSelection,
} from '@/app/types/seatMapping';

const initialState: BookingState = {
    scheduleId: null,
    scheduleData: null,
    selectedCarriageId: null,
    selectedSeats: [],
    step: 'schedule',
};

function bookingReducer(state: BookingState, action: BookingAction): BookingState {
    switch (action.type) {
        case 'SET_SCHEDULE':
            return {
                ...state,
                scheduleId: action.payload.scheduleId,
                scheduleData: action.payload.data,
                selectedCarriageId: null,
                selectedSeats: [],
                step: 'carriage',
            };

        case 'SELECT_CARRIAGE':
            return {
                ...state,
                selectedCarriageId: action.payload,
                selectedSeats: [], // Clear seats when switching carriage
                step: 'seats',
            };

        case 'TOGGLE_SEAT': {
            const seat = action.payload;
            const exists = state.selectedSeats.find(s => s.id_seat === seat.id_seat);

            if (exists) {
                // Remove seat
                return {
                    ...state,
                    selectedSeats: state.selectedSeats.filter(s => s.id_seat !== seat.id_seat),
                };
            } else {
                // Add seat (max 10)
                if (state.selectedSeats.length >= 10) {
                    return state; // Don't add more than 10
                }
                return {
                    ...state,
                    selectedSeats: [...state.selectedSeats, seat],
                };
            }
        }

        case 'GO_BACK':
            switch (state.step) {
                case 'seats':
                    return {
                        ...state,
                        selectedCarriageId: null,
                        selectedSeats: [],
                        step: 'carriage',
                    };
                case 'carriage':
                    return {
                        ...state,
                        scheduleId: null,
                        scheduleData: null,
                        selectedCarriageId: null,
                        selectedSeats: [],
                        step: 'schedule',
                    };
                case 'confirm':
                    return {
                        ...state,
                        step: 'seats',
                    };
                default:
                    return state;
            }

        case 'CONFIRM':
            return {
                ...state,
                step: 'confirm',
            };

        case 'RESET':
            return initialState;

        default:
            return state;
    }
}

interface BookingContextType {
    state: BookingState;
    dispatch: React.Dispatch<BookingAction>;
    setSchedule: (scheduleId: number, data: SeatMappingData) => void;
    selectCarriage: (carriageId: number) => void;
    toggleSeat: (seat: SeatSelection) => void;
    goBack: () => void;
    confirmBooking: () => void;
    resetBooking: () => void;
    getTotalPrice: () => number;
    getSelectedCarriage: () => import('@/app/types/seatMapping').CarriageMappingData | undefined;
}

const BookingContext = createContext<BookingContextType | null>(null);

export function BookingProvider({ children }: { children: ReactNode }) {
    const [state, dispatch] = useReducer(bookingReducer, initialState);

    const setSchedule = (scheduleId: number, data: SeatMappingData) => {
        dispatch({ type: 'SET_SCHEDULE', payload: { scheduleId, data } });
    };

    const selectCarriage = (carriageId: number) => {
        dispatch({ type: 'SELECT_CARRIAGE', payload: carriageId });
    };

    const toggleSeat = (seat: SeatSelection) => {
        dispatch({ type: 'TOGGLE_SEAT', payload: seat });
    };

    const goBack = () => {
        dispatch({ type: 'GO_BACK' });
    };

    const confirmBooking = () => {
        dispatch({ type: 'CONFIRM' });
    };

    const resetBooking = () => {
        dispatch({ type: 'RESET' });
    };

    const getTotalPrice = (): number => {
        return state.selectedSeats.reduce((total, seat) => total + seat.price, 0);
    };

    const getSelectedCarriage = () => {
        if (!state.scheduleData || !state.selectedCarriageId) return undefined;
        return state.scheduleData.carriages.find(c => c.id_carriage === state.selectedCarriageId);
    };

    return (
        <BookingContext.Provider
            value={{
                state,
                dispatch,
                setSchedule,
                selectCarriage,
                toggleSeat,
                goBack,
                confirmBooking,
                resetBooking,
                getTotalPrice,
                getSelectedCarriage,
            }}
        >
            {children}
        </BookingContext.Provider>
    );
}

export function useBooking() {
    const context = useContext(BookingContext);
    if (!context) {
        throw new Error('useBooking must be used within a BookingProvider');
    }
    return context;
}
