export interface Kereta {
    id: number
    nama: string
    kelas: string
}

export interface Jadwal {
    id: number
    kereta_id: number
    berangkat: string
    tujuan: string
    tanggal: string
    harga: number
}

export interface Transaksi {
    id: number
    tanggal: string
    total: number
}

export interface Kereta {
    id: number
    nama: string
    kelas: string
}

export interface Gerbong {
    id: number
    nama: string
    kereta_id: number
    kereta_nama?: string
}

export interface Kursi {
    id: number
    nomor: string
    gerbong_id: number
    gerbong_nama?: string
}

export interface Jadwal {
    id: number
    kereta_id: number
    tanggal: string
    berangkat: string
    tujuan: string
    harga: number
    kereta_nama?: string
}

export interface Booking {
    id: number
    jadwal_id: number
    kursi_id: number
    nama_penumpang: string
    tanggal_pesan: string
    kursi_nomor?: string
}

export interface RekapBulanan {
    bulan: string // contoh: 2026-02
    total: number
}

export interface BookingList {
    id: number
    nama_penumpang: string
    kereta_nama: string
    tanggal: string
    kursi_nomor: string
}