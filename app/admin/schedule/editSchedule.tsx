"use client"

import { Schedule, ScheduleStatus, Train, isScheduleLocked } from "@/app/types"
import { BASE_API_URL } from "@/global"
import { put } from "@/lib/api-bridge"
import { getCookie } from "@/lib/client-cookies"
import { useRouter } from "next/navigation"
import { FormEvent, useRef, useState } from "react"
import { toast, ToastContainer } from "react-toastify"
import { ButtonWarning, ButtonDanger, ButtonSuccess } from "@/components/button"
import { InputGroupComponent } from "@/components/inputComponent"
import Modal from "@/components/modal"
import Select from "@/components/select"

const EditSchedule = ({ selectedSchedule, trains }: { selectedSchedule: Schedule, trains: Train[] }) => {
    const [isShow, setIsShow] = useState<boolean>(false)
    const [schedule, setSchedule] = useState<Schedule>({ ...selectedSchedule })
    const [dateErrors, setDateErrors] = useState<{ departure?: string; arrival?: string }>({})
    const router = useRouter()
    const formRef = useRef<HTMLFormElement>(null)
    const TOKEN = getCookie("token") || ""

    const formatDateForInput = (dateStr: string) => {
        if (!dateStr) return "";

        const date = new Date(dateStr);

        date.setHours(date.getHours() + 7);

        return date.toISOString().slice(0, 16);
    };

    const openModal = () => {
        setSchedule({ ...selectedSchedule })
        setDateErrors({})
        setIsShow(true)
        if (formRef.current) formRef.current.reset()
    }

    // Validate departure date against current time
    const validateDepartureDate = (dateStr: string): string | undefined => {
        if (!dateStr) return undefined
        const departureDate = new Date(dateStr)
        const now = new Date()
        if (departureDate <= now) {
            return "Departure date must be after the current date"
        }
        return undefined
    }

    // Validate arrival date against departure date
    const validateArrivalDate = (arrivalStr: string, departureStr: string): string | undefined => {
        if (!arrivalStr || !departureStr) return undefined
        const arrivalDate = new Date(arrivalStr)
        const departureDate = new Date(departureStr)
        if (arrivalDate <= departureDate) {
            return "Arrival date must be after the departure date"
        }
        return undefined
    }

    // Handle departure date change with validation
    const handleDepartureDateChange = (val: string) => {
        setSchedule({ ...schedule, departure_date: val })
        const depError = validateDepartureDate(val)
        const arrError = schedule.arrival_date ? validateArrivalDate(formatDateForInput(schedule.arrival_date), val) : undefined
        setDateErrors({ departure: depError, arrival: arrError })
    }

    // Handle arrival date change with validation
    const handleArrivalDateChange = (val: string) => {
        setSchedule({ ...schedule, arrival_date: val })
        const arrError = validateArrivalDate(val, formatDateForInput(schedule.departure_date))
        setDateErrors(prev => ({ ...prev, arrival: arrError }))
    }

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault()
        try {
            // Validate dates before submission (only if schedule is not locked)
            if (!isScheduleLocked(selectedSchedule).isLocked) {
                const depError = validateDepartureDate(formatDateForInput(schedule.departure_date))
                const arrError = validateArrivalDate(formatDateForInput(schedule.arrival_date), formatDateForInput(schedule.departure_date))
                if (depError || arrError) {
                    setDateErrors({ departure: depError, arrival: arrError })
                    toast('Please fix the date errors before submitting', { containerId: "toastSchedule", type: "warning", hideProgressBar: true })
                    return
                }
            }

            const url = `${BASE_API_URL}/schedule/${schedule.id_schedule}`
            const payload = JSON.stringify({
                schedule_name: schedule.schedule_name || "",
                departure_date: (schedule.departure_date || ""),
                arrival_date: (schedule.arrival_date || ""),
                price: parseFloat(String(schedule.price)) || 0,
                status: schedule.status || ""
            })

            const { data } = await put(url, payload, TOKEN)

            if (data?.status) {
                toast(data?.message, { containerId: "toastSchedule", type: "success", hideProgressBar: true })
                setIsShow(false)
                setTimeout(() => router.refresh(), 1000)
            } else {
                toast(data?.message || "Failed to update schedule", { containerId: "toastSchedule", type: "warning", hideProgressBar: true })
            }
        } catch (err) {
            console.error(err)
            toast("Something went wrong", { containerId: "toastSchedule", type: "error", hideProgressBar: true })
        }
    }

    return (
        <div>
            <ToastContainer containerId="toastSchedule" />
            <ButtonWarning type="button" onClick={openModal}>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-4">
                    <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
                </svg>
            </ButtonWarning>

            <Modal isShow={isShow} onClose={state => setIsShow(state)}>
                <form ref={formRef} onSubmit={handleSubmit}>
                    <div className="sticky top-0 bg-white px-5 pt-5 pb-3 shadow">
                        <div className="w-full flex items-center">
                            <div className="flex flex-col">
                                <strong className="font-bold text-2xl text-black">Edit Schedule</strong>
                                <small className="text-slate-400 text-sm">Update schedule information.</small>
                            </div>
                            <div className="ml-auto">
                                <button type="button" className="text-slate-400" onClick={() => setIsShow(false)}>
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="p-5 text-black">
                        <InputGroupComponent id="schedule_name" type="text" value={schedule.schedule_name ?? ""}
                            onChange={val => setSchedule({ ...schedule, schedule_name: val })}
                            required={true} label="Schedule Name" />

                        <div className="mb-3 p-3 bg-gray-100 rounded">
                            <p className="text-sm text-gray-600"><strong>Route:</strong> {schedule.departure} → {schedule.destination}</p>
                            <p className="text-sm text-gray-600"><strong>Train ID:</strong> {schedule.id_train}</p>
                        </div>

                        {isScheduleLocked(selectedSchedule).isLocked && (
                            <div className="mb-4 p-3 bg-amber-50 border border-amber-200 rounded-lg">
                                <div className="flex items-center gap-2 text-amber-700">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z" />
                                    </svg>
                                    <span className="text-sm font-medium">Schedule is Active</span>
                                </div>
                                <p className="text-xs text-amber-600 mt-1">Date and time fields are locked. Only name, price, and status can be modified.</p>
                            </div>
                        )}

                        <InputGroupComponent id="departure_date" type="datetime-local" value={formatDateForInput(schedule.departure_date)}
                            onChange={handleDepartureDateChange}
                            required={true} label="Departure Date & Time"
                            disabled={isScheduleLocked(selectedSchedule).isLocked} />
                        {dateErrors.departure && !isScheduleLocked(selectedSchedule).isLocked && (
                            <div className="-mt-1 mb-2 p-2 bg-red-50 border border-red-200 rounded text-red-600 text-sm flex items-center gap-2">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" />
                                </svg>
                                {dateErrors.departure}
                            </div>
                        )}

                        <InputGroupComponent id="arrival_date" type="datetime-local" value={formatDateForInput(schedule.arrival_date)}
                            onChange={handleArrivalDateChange}
                            required={true} label="Arrival Date & Time"
                            disabled={isScheduleLocked(selectedSchedule).isLocked} />
                        {dateErrors.arrival && !isScheduleLocked(selectedSchedule).isLocked && (
                            <div className="-mt-1 mb-2 p-2 bg-red-50 border border-red-200 rounded text-red-600 text-sm flex items-center gap-2">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" />
                                </svg>
                                {dateErrors.arrival}
                            </div>
                        )}

                        <InputGroupComponent id="price" type="number" value={String(schedule.price || '')}
                            onChange={val => setSchedule({ ...schedule, price: Number(val) })}
                            required={true} label="Base Price (IDR)" />

                        <Select id="status" value={schedule.status} label="Status"
                            required={true} onChange={val => setSchedule({ ...schedule, status: val as ScheduleStatus })}>
                            <option value="ACTIVED">ACTIVED</option>
                            <option value="FINISHED">FINISHED</option>
                            <option value="CANCELLED">CANCELLED</option>
                        </Select>
                    </div>

                    <div className="w-full p-5 flex rounded-b-2xl shadow">
                        <div className="flex ml-auto gap-2">
                            <ButtonDanger type="button" onClick={() => setIsShow(false)}>Cancel</ButtonDanger>
                            <ButtonSuccess type="submit">Save</ButtonSuccess>
                        </div>
                    </div>
                </form>
            </Modal>
        </div>
    )
}

export default EditSchedule
