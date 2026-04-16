"use client"

import { Seat, Carriage } from "@/app/types"
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

const AddSeat = ({ carriages }: { carriages: Carriage[] }) => {
    const [isShow, setIsShow] = useState<boolean>(false)
    const [seat, setSeat] = useState<Partial<Seat>>({
        seat_num: '',
        id_carriage: 0
    })
    const router = useRouter()
    const TOKEN = getCookie("token") || ""
    const formRef = useRef<HTMLFormElement>(null)

    const openModal = () => {
        setSeat({ seat_num: '', id_carriage: 0 })
        setIsShow(true)
        if (formRef.current) formRef.current.reset()
    }

    const handleSubmit = async (e: FormEvent) => {
        try {
            e.preventDefault()
            const url = `${BASE_API_URL}/seat/`
            const payload = new FormData()
            payload.append("seat_num", seat.seat_num || "")
            payload.append("id_carriage", String(seat.id_carriage || 0))

            const { data } = await post(url, payload, TOKEN)
            if (data?.status) {
                setIsShow(false)
                toast(data?.message, { hideProgressBar: true, containerId: `toastSeat`, type: `success` })
                setTimeout(() => router.refresh(), 1000)
            } else {
                toast(data?.message, { hideProgressBar: true, containerId: `toastSeat`, type: `warning` })
            }
        } catch (error) {
            console.log(error)
            toast(`Something went wrong`, { hideProgressBar: true, containerId: `toastSeat`, type: `error` })
        }
    }

    return (
        <div>
            <ToastContainer containerId={`toastSeat`} />
            <ButtonSuccess type="button" onClick={() => openModal()}>
                <div className="flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                    </svg>
                    Add Seat
                </div>
            </ButtonSuccess>
            <Modal isShow={isShow} onClose={state => setIsShow(state)}>
                <form onSubmit={handleSubmit} ref={formRef}>
                    <div className="sticky top-0 bg-white px-5 pt-5 pb-3 shadow">
                        <div className="w-full flex items-center">
                            <div className="flex flex-col">
                                <strong className="font-bold text-2xl text-black">Add New Seat</strong>
                                <small className="text-slate-400 text-sm">Create a new seat for a carriage.</small>
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
                        <InputGroupComponent id="seat_num" type="text" value={seat.seat_num || ''}
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
export default AddSeat
