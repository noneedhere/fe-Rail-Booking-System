"use client"

import { Schedule, ScheduleStatus, Train } from "@/app/types"
import { BASE_API_URL } from "@/global"
import { post } from "@/lib/api-bridge"
import { getCookie } from "@/lib/client-cookies"
import { useRouter } from "next/navigation"
import { FormEvent, useRef, useState } from "react"
import { toast, ToastContainer } from "react-toastify"
import { ButtonSuccess, ButtonDanger } from "@/components/button"
import { InputGroupComponent } from "@/components/inputComponent"
import Modal from "@/components/modal"
import Select from "@/components/select"

const AddSchedule = ({ trains }: { trains: Train[] }) => {
    const [isShow, setIsShow] = useState<boolean>(false)
    const [schedule, setSchedule] = useState<Partial<Schedule>>({
        schedule_name: '',
        departure: '',
        destination: '',
        departure_date: '',
        arrival_date: '',
        price: 0,
        id_train: 0
    })
    const [dateErrors, setDateErrors] = useState<{ departure?: string; arrival?: string }>({})
    const router = useRouter()
    const TOKEN = getCookie("token") || ""
    const formRef = useRef<HTMLFormElement>(null)

    const openModal = () => {
        setSchedule({
            schedule_name: '',
            departure: '',
            destination: '',
            departure_date: '',
            arrival_date: '',
            price: 0,
            id_train: 0
        })
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
        const arrError = schedule.arrival_date ? validateArrivalDate(schedule.arrival_date, val) : undefined
        setDateErrors({ departure: depError, arrival: arrError })
    }

    // Handle arrival date change with validation
    const handleArrivalDateChange = (val: string) => {
        setSchedule({ ...schedule, arrival_date: val })
        const arrError = validateArrivalDate(val, schedule.departure_date || '')
        setDateErrors(prev => ({ ...prev, arrival: arrError }))
    }

    const handleSubmit = async (e: FormEvent) => {
        try {
            e.preventDefault()

            // Validate dates before submission
            const depError = validateDepartureDate(schedule.departure_date || '')
            const arrError = validateArrivalDate(schedule.arrival_date || '', schedule.departure_date || '')
            if (depError || arrError) {
                setDateErrors({ departure: depError, arrival: arrError })
                toast('Please fix the date errors before submitting', { hideProgressBar: true, containerId: `toastSchedule`, type: `warning` })
                return
            }

            const url = `${BASE_API_URL}/schedule/`
            const payload = JSON.stringify({
                schedule_name: schedule.schedule_name || "",
                departure: schedule.departure || "",
                destination: schedule.destination || "",
                departure_date: (schedule.departure_date || ""),
                arrival_date: (schedule.arrival_date || ""),
                price: parseFloat(String(schedule.price)) || 0,
                id_train: Number(schedule.id_train) || 0
            })

            const { data } = await post(url, payload, TOKEN)
            if (data?.status) {
                setIsShow(false)
                toast(data?.message, { hideProgressBar: true, containerId: `toastSchedule`, type: `success` })
                setTimeout(() => router.refresh(), 1000)
            } else {
                toast(data?.message, { hideProgressBar: true, containerId: `toastSchedule`, type: `warning` })
            }
        } catch (error) {
            console.log(error)
            toast(`Something went wrong`, { hideProgressBar: true, containerId: `toastSchedule`, type: `error` })
        }
    }

    return (
        <div>
            <ToastContainer containerId={`toastSchedule`} />
            <ButtonSuccess type="button" onClick={() => openModal()}>
                <div className="flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                    </svg>
                    Add Schedule
                </div>
            </ButtonSuccess>
            <Modal isShow={isShow} onClose={state => setIsShow(state)}>
                <form onSubmit={handleSubmit} ref={formRef}>
                    <div className="sticky top-0 bg-white px-5 pt-5 pb-3 shadow">
                        <div className="w-full flex items-center">
                            <div className="flex flex-col">
                                <strong className="font-bold text-2xl text-black">Add New Schedule</strong>
                                <small className="text-slate-400 text-sm">Create a new train schedule.</small>
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
                        <InputGroupComponent id="schedule_name" type="text" value={schedule.schedule_name || ''}
                            onChange={val => setSchedule({ ...schedule, schedule_name: val })}
                            required={true} label="Schedule Name" />

                        <Select id="id_train" value={String(schedule.id_train || '')} label="Select Train"
                            required={true} onChange={val => setSchedule({ ...schedule, id_train: Number(val) })}>
                            <option value="">--- Select Train ---</option>
                            {trains.map(train => (
                                <option key={train.id_train} value={train.id_train}>{train.train_name}</option>
                            ))}
                        </Select>

                        <InputGroupComponent id="departure" type="text" value={schedule.departure || ''}
                            onChange={val => setSchedule({ ...schedule, departure: val })}
                            required={true} label="Departure Station" />

                        <InputGroupComponent id="destination" type="text" value={schedule.destination || ''}
                            onChange={val => setSchedule({ ...schedule, destination: val })}
                            required={true} label="Destination Station" />

                        <InputGroupComponent id="departure_date" type="datetime-local" value={schedule.departure_date || ''}
                            onChange={handleDepartureDateChange}
                            required={true} label="Departure Date & Time" />
                        {dateErrors.departure && (
                            <div className="-mt-1 mb-2 p-2 bg-red-50 border border-red-200 rounded text-red-600 text-sm flex items-center gap-2">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" />
                                </svg>
                                {dateErrors.departure}
                            </div>
                        )}

                        <InputGroupComponent id="arrival_date" type="datetime-local" value={schedule.arrival_date || ''}
                            onChange={handleArrivalDateChange}
                            required={true} label="Arrival Date & Time" />
                        {dateErrors.arrival && (
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
                    </div>

                    <div className="w-full p-5 flex rounded-b-2xl shadow">
                        <div className="flex ml-auto gap-2">
                            <ButtonDanger type="button" onClick={() => setIsShow(false)}>
                                Cancel
                            </ButtonDanger>
                            <ButtonSuccess type="submit">
                                Save
                            </ButtonSuccess>
                        </div>
                    </div>
                </form>
            </Modal>
        </div>
    )
}
export default AddSchedule
