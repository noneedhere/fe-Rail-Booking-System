"use client"

import { Carriage, Train } from "@/app/types"
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

const EditCarriage = ({ selectedCarriage, trains }: { selectedCarriage: Carriage; trains: Train[] }) => {
    const [isShow, setIsShow] = useState<boolean>(false)
    const [carriage, setCarriage] = useState<Carriage>({ ...selectedCarriage })
    const router = useRouter()
    const formRef = useRef<HTMLFormElement>(null)
    const TOKEN = getCookie("token") || ""

    const openModal = () => {
        setCarriage({ ...selectedCarriage })
        setIsShow(true)
        if (formRef.current) formRef.current.reset()
    }

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault()
        try {
            const url = `${BASE_API_URL}/carriage/${carriage.id_carriage}`
            const payload = new FormData()
            payload.append("carriage_name", carriage.carriage_name || "")
            payload.append("carriage_category", carriage.carriage_category || "ECONOMY")
            payload.append("id_train", String(carriage.id_train || 0))

            const { data } = await put(url, payload, TOKEN)

            if (data?.status) {
                toast(data?.message, { containerId: "toastCarriage", type: "success", hideProgressBar: true })
                setIsShow(false)
                setTimeout(() => router.refresh(), 1000)
            } else {
                toast(data?.message || "Failed to update carriage", { containerId: "toastCarriage", type: "warning", hideProgressBar: true })
            }
        } catch (err) {
            console.error(err)
            toast("Something went wrong", { containerId: "toastCarriage", type: "error", hideProgressBar: true })
        }
    }

    return (
        <div>
            <ToastContainer containerId="toastCarriage" />
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
                                <strong className="font-bold text-2xl text-black">Edit Carriage</strong>
                                <small className="text-slate-400 text-sm">Changing category will regenerate all seats.</small>
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
                        <InputGroupComponent id="carriage_name" type="text" value={carriage.carriage_name ?? ""}
                            onChange={val => setCarriage({ ...carriage, carriage_name: val })}
                            required={true} label="Carriage Name" />

                        <Select id="id_train" value={String(carriage.id_train || '')} label="Select Train"
                            required={true} onChange={val => setCarriage({ ...carriage, id_train: Number(val) })}>
                            <option value="">--- Select Train ---</option>
                            {trains.map(train => (
                                <option key={train.id_train} value={train.id_train}>{train.train_name}</option>
                            ))}
                        </Select>

                        <Select id="carriage_category" value={carriage.carriage_category || 'ECONOMY'} label="Category"
                            required={true} onChange={val => setCarriage({ ...carriage, carriage_category: val as Carriage['carriage_category'] })}>
                            <option value="ECONOMY">ECONOMY (40 seats)</option>
                            <option value="BUSINESS">BUSINESS (10 seats)</option>
                            <option value="EXECUTIVE">EXECUTIVE (20 seats)</option>
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

export default EditCarriage
