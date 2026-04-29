// Seat Mapping Types

export interface SeatMappingResponse {
    status: boolean;
    data: SeatMappingData;
    message: string;
}

export interface SeatMappingData {
    schedule: ScheduleInfo;
    train: TrainInfo;
    summary: SeatSummary;
    carriages: CarriageMappingData[];
}

export interface ScheduleInfo {
    id_schedule: number;
    schedule_name: string;
    departure: string;
    destination: string;
    departure_date: string;
    arrival_date: string;
    base_price: number;
    status: string;
}

export interface TrainInfo {
    id_train: number;
    train_name: string;
}

export interface SeatSummary {
    total_seats: number;
    available_seats: number;
    booked_seats: number;
}

export interface CarriageMappingData {
    id_carriage: number;
    carriage_name: string;
    carriage_category: 'EXECUTIVE' | 'BUSINESS' | 'ECONOMY';
    quota: number;
    price_multiplier: number;
    seat_price: number;
    layout: LayoutConfig;
    seats: SeatData[];
}

export interface LayoutConfig {
    columns: number;
    rows: number;
    aisle_after: number;
}

export interface SeatData {
    id_seat: number;
    seat_num: string;
    row: number;
    col: number;
    status: 'AVAILABLE' | 'BOOKED' | 'HELD' | 'HELD_BY_ME';
}

// Booking state types
export type BookingStep = 'schedule' | 'carriage' | 'seats' | 'confirm';

export interface SeatSelection {
    id_seat: number;
    seat_num: string;
    carriage_id: number;
    carriage_name: string;
    carriage_category: string;
    price: number;
}

export interface BookingState {
    scheduleId: number | null;
    scheduleData: SeatMappingData | null;
    selectedCarriageId: number | null;
    selectedSeats: SeatSelection[];
    step: BookingStep;
}

export type BookingAction =
    | { type: 'SET_SCHEDULE'; payload: { scheduleId: number; data: SeatMappingData } }
    | { type: 'SELECT_CARRIAGE'; payload: number }
    | { type: 'TOGGLE_SEAT'; payload: SeatSelection }
    | { type: 'GO_BACK' }
    | { type: 'CONFIRM' }
    | { type: 'RESET' };

// Purchase request types
export interface PurchaseRequest {
    id_schedule: number;
    buyer_name?: string;
    buyer_email?: string;
    buyer_phone?: string;
    seat_ids: number[];
}
