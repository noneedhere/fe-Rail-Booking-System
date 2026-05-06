"use client"

import { Carriage, Train } from "@/app/types"
import { BASE_API_URL } from "@/global"
import { post } from "@/lib/api-bridge"
import { getCookie } from "@/lib/client-cookies"
import { useRouter } from "next/navigation"
import { FormEvent, useRef, useState } from "react"
import { toast } from "react-toastify"
import { ButtonSuccess, ButtonDanger } from "@/components/button"
import { InputGroupComponent } from "@/components/inputComponent"
import Modal from "@/components/modal"
import Select from "@/components/select"

const AddCarriage = ({ trains }: { trains: Train[] }) => {
    const [isShow, setIsShow] = useState<boolean>(false)
    const [carriage, setCarriage] = useState<Partial<Carriage>>({
        carriage_name: '',
        carriage_category: 'ECONOMY',
        id_train: 0
    })
    const router = useRouter()
    const TOKEN = getCookie("token") || ""
    const formRef = useRef<HTMLFormElement>(null)

    const openModal = () => {
        setCarriage({ carriage_name: '', carriage_category: 'ECONOMY', id_train: 0 })
        setIsShow(true)
        if (formRef.current) formRef.current.reset()
    }

    const handleSubmit = async (e: FormEvent) => {
        try {
            e.preventDefault()
            const url = `${BASE_API_URL}/carriage/`
            const payload = new FormData()
            payload.append("carriage_name", carriage.carriage_name || "")
            payload.append("carriage_category", carriage.carriage_category || "ECONOMY")
            payload.append("id_train", String(carriage.id_train || 0))

            const { data } = await post(url, payload, TOKEN)
            if (data?.status) {
                setIsShow(false)
                toast(data?.message, { hideProgressBar: true, type: `success` })
                setTimeout(() => router.refresh(), 1000)
            } else {
                toast(data?.message, { hideProgressBar: true, type: `warning` })
            }
        } catch (error) {
            console.log(error)
            toast(`Something went wrong`, { hideProgressBar: true, type: `error` })
        }
    }

    return (
        <div>
            <ButtonSuccess type="button" onClick={() => openModal()}>
                <div className="flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                    </svg>
                    Add Carriage
                </div>
            </ButtonSuccess>
            <Modal isShow={isShow} onClose={state => setIsShow(state)}>
                <form onSubmit={handleSubmit} ref={formRef}>
                    <div className="sticky top-0 bg-white px-5 pt-5 pb-3 shadow">
                        <div className="w-full flex items-center">
                            <div className="flex flex-col">
                                <strong className="font-bold text-2xl text-black">Add New Carriage</strong>
                                <small className="text-slate-400 text-sm">Create a new carriage with auto-generated seats.</small>
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
                        <InputGroupComponent id="carriage_name" type="text" value={carriage.carriage_name || ''}
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
export default AddCarriage
