"use client"

import { Seat, Carriage } from "@/app/types"
import { BASE_API_URL } from "@/global"
import { put } from "@/lib/api-bridge"
import { getCookie } from "@/lib/client-cookies"
import { useRouter } from "next/navigation"
import { FormEvent, useRef, useState } from "react"
import { toast } from "react-toastify"
import { ButtonWarning, ButtonDanger, ButtonSuccess } from "@/components/button"
import { InputGroupComponent } from "@/components/inputComponent"
import Modal from "@/components/modal"
import Select from "@/components/select"

const EditSeat = ({ selectedSeat, carriages }: { selectedSeat: Seat; carriages: Carriage[] }) => {
    const [isShow, setIsShow] = useState<boolean>(false)
    const [seat, setSeat] = useState<Seat>({ ...selectedSeat })
    const router = useRouter()
    const formRef = useRef<HTMLFormElement>(null)
    const TOKEN = getCookie("token") || ""

    const openModal = () => {
        setSeat({ ...selectedSeat })
        setIsShow(true)
        if (formRef.current) formRef.current.reset()
    }

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault()
        try {
            const url = `${BASE_API_URL}/seat/${seat.id_seat}`
            const payload = new FormData()
            payload.append("seat_num", seat.seat_num || "")
            payload.append("id_carriage", String(seat.id_carriage || 0))

            const { data } = await put(url, payload, TOKEN)

            if (data?.status) {
                toast(data?.message, { type: "success", hideProgressBar: true })
                setIsShow(false)
                setTimeout(() => router.refresh(), 1000)
            } else {
                toast(data?.message || "Failed to update seat", { type: "warning", hideProgressBar: true })
            }
        } catch (err) {
            console.error(err)
            toast("Something went wrong", { type: "error", hideProgressBar: true })
        }
    }

    return (
        <div>
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
                                <strong className="font-bold text-2xl text-black">Edit Seat</strong>
                                <small className="text-slate-400 text-sm">Update seat information.</small>
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
                        <InputGroupComponent id="seat_num" type="text" value={seat.seat_num ?? ""}
                            onChange={val => setSeat({ ...seat, seat_num: val })}
                            required={true} label="Seat Number" />

                        <Select id="id_carriage" value={String(seat.id_carriage || '')} label="Select Carriage"
                            required={true} onChange={val => setSeat({ ...seat, id_carriage: Number(val) })}>
                            <option value="">--- Select Carriage ---</option>
                            {carriages.map(carriage => (
                                <option key={carriage.id_carriage} value={carriage.id_carriage}>
                                    {carriage.carriage_name} ({carriage.carriage_category})
                                </option>
                            ))}
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

export default EditSeat
