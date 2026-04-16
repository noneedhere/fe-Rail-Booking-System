// types.ts

export type Role = 'CUSTOMER' | 'ADMIN';

export interface User {
    id_user: number;
    username: string;
    email: string;
    password: string;
    phone: string;
    address?: string;
    profile_picture?: string;
    role: Role;
}

// Train types
export type TrainStatus = 'ACTIVE' | 'AVAILABLE';

export interface Train {
    id_train: number;
    train_name: string;
    description: string;
    train_picture?: string;
    train_status?: TrainStatus;
    carriage?: Carriage[];
}

export interface Carriage {
    id_carriage: number;
    carriage_name: string;
    carriage_category: 'ECONOMY' | 'EXECUTIVE' | 'BUSINESS';
    quota: number;
    id_train: number;
    seat?: Seat[];
    train?: {
        id_train: number;
        train_name: string;
        train_status?: TrainStatus;
    };
}

export interface Seat {
    id_seat: number;
    seat_num: string;
    id_carriage: number;
    carriage?: {
        id_carriage: number;
        carriage_name: string;
        quota: number;
        train?: {
            id_train: number;
            train_name: string;
            train_status?: TrainStatus;
        };
    };
}

// Schedule types
export type ScheduleStatus = 'ACTIVED' | 'FINISHED' | 'CANCELLED';

export interface Schedule {
    id_schedule: number;
    schedule_name: string;
    departure: string;
    destination: string;
    departure_date: string;
    arrival_date: string;
    price: number;
    quota_total?: number;
    status: ScheduleStatus;
    id_train: number;
    train?: Train;
}

// Purchase types
export interface Purchase {
    id_ticketpurchase: number;
    purchase_date: string;
    buyer_name: string;
    buyer_email: string;
    buyer_phone: string;
    total_price: number;
    id_user: number;
    id_schedule: number;
    schedule?: Schedule;
    user?: { id_user: number; username: string; email: string; phone: string };
    purchase_detail?: PurchaseDetail[];
}

export interface PurchaseDetail {
    id_purchasedetail: number;
    buyer_name: string;
    buyer_email: string;
    buyer_phone: string;
    total_price: number;
    id_seat: number;
    seat?: {
        seat_num: string;
        carriage?: {
            carriage_name: string;
            carriage_category: string;
        };
    };
}

// Schedule lock state for UI
export interface ComponentLockState {
    isLocked: boolean;
    reason?: string;
}

// Server time response
export interface ServerTime {
    timestamp: string;
    timezone: string;
    unix: number;
}

// Helper to check if schedule is locked (active and ongoing)
export function isScheduleLocked(schedule: Schedule): ComponentLockState {
    if (schedule.status !== 'ACTIVED') {
        return { isLocked: false };
    }
    return {
        isLocked: true,
        reason: 'Schedule is active. Only name, price, and status can be modified.'
    };
}

// Helper to check if train is locked (has active status)
export function isTrainLocked(train: Train): ComponentLockState {
    if (train.train_status !== 'ACTIVE') {
        return { isLocked: false };
    }
    return {
        isLocked: true,
        reason: 'Train is currently in an active schedule and cannot be deleted.'
    };
}

// Helper to check if carriage is locked (parent train is active)
export function isCarriageLocked(carriage: Carriage): ComponentLockState {
    if (carriage.train?.train_status !== 'ACTIVE') {
        return { isLocked: false };
    }
    return {
        isLocked: true,
        reason: 'Carriage belongs to a train in an active schedule and cannot be deleted.'
    };
}

// Helper to check if seat is locked (parent train is active)
export function isSeatLocked(seat: Seat): ComponentLockState {
    if (seat.carriage?.train?.train_status !== 'ACTIVE') {
        return { isLocked: false };
    }
    return {
        isLocked: true,
        reason: 'Seat belongs to a train in an active schedule and cannot be deleted.'
    };
}
