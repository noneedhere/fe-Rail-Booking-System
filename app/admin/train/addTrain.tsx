"use client"

import { Train } from "@/app/types"
import { BASE_API_URL } from "@/global"
import { post } from "@/lib/api-bridge"
import { getCookie } from "@/lib/client-cookies"
import { useRouter } from "next/navigation"
import { FormEvent, useRef, useState } from "react"
import { toast, ToastContainer } from "react-toastify"
import { ButtonSuccess, ButtonDanger } from "@/components/button"
import { InputGroupComponent } from "@/components/inputComponent"
import Modal from "@/components/modal"
import FileInput from "@/components/FileInput"

const AddTrain = () => {
    const [isShow, setIsShow] = useState<boolean>(false)
    const [train, setTrain] = useState<Partial<Train>>({
        train_name: '',
        description: ''
    })
    const router = useRouter()
    const TOKEN = getCookie("token") || ""
    const [file, setFile] = useState<File | null>(null)
    const formRef = useRef<HTMLFormElement>(null)

    const openModal = () => {
        setTrain({ train_name: '', description: '' })
        setIsShow(true)
        if (formRef.current) formRef.current.reset()
    }

    const handleSubmit = async (e: FormEvent) => {
        try {
            e.preventDefault()
            const url = `${BASE_API_URL}/train/`
            const payload = new FormData()
            payload.append("train_name", train.train_name || "")
            payload.append("description", train.description || "")
            if (file) payload.append("train_picture", file)

            console.log(payload)
            const { data } = await post(url, payload, TOKEN)
            if (data?.status) {
                setIsShow(false)
                toast(data?.message, { hideProgressBar: true, containerId: `toastTrain`, type: `success` })
                setTimeout(() => router.refresh(), 1000)
            } else {
                toast(data?.message, { hideProgressBar: true, containerId: `toastTrain`, type: `warning` })
            }
        } catch (error) {
            console.log(error)
            toast(`Something went wrong`, { hideProgressBar: true, containerId: `toastTrain`, type: `error` })
        }
    }

    return (
        <div>
            <ToastContainer containerId={`toastTrain`} />
            <ButtonSuccess type="button" onClick={() => openModal()}>
                <div className="flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                    </svg>
                    Add Train
                </div>
            </ButtonSuccess>
            <Modal isShow={isShow} onClose={state => setIsShow(state)}>
                <form onSubmit={handleSubmit} ref={formRef}>
                    <div className="sticky top-0 bg-white px-5 pt-5 pb-3 shadow">
                        <div className="w-full flex items-center">
                            <div className="flex flex-col">
                                <strong className="font-bold text-2xl text-black">Add New Train</strong>
                                <small className="text-slate-400 text-sm">Create a new train with name and description.</small>
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
                        <InputGroupComponent id="train_name" type="text" value={train.train_name || ''}
                            onChange={val => setTrain({ ...train, train_name: val })}
                            required={true} label="Train Name" />

                        <InputGroupComponent id="description" type="text" value={train.description || ''}
                            onChange={val => setTrain({ ...train, description: val })}
                            required={true} label="Description" />

                        <FileInput acceptTypes={["image/png", "image/jpeg", "image/jpg", "image/gif"]} id="train_picture"
                            label="Upload Picture (Max 5MB)" onChange={f => setFile(f)} required={false} />
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
export default AddTrain
