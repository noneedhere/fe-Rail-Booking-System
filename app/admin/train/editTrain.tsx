"use client"

import { Train } from "@/app/types"
import { BASE_API_URL } from "@/global"
import { put } from "@/lib/api-bridge"
import { getCookie } from "@/lib/client-cookies"
import { useRouter } from "next/navigation"
import { FormEvent, useRef, useState } from "react"
import { toast } from "react-toastify"
import { ButtonWarning, ButtonDanger, ButtonSuccess } from "@/components/button"
import { InputGroupComponent } from "@/components/inputComponent"
import Modal from "@/components/modal"
import FileInput from "@/components/FileInput"

const EditTrain = ({ selectedTrain }: { selectedTrain: Train }) => {
    const [isShow, setIsShow] = useState<boolean>(false)
    const [train, setTrain] = useState<Train>({ ...selectedTrain })
    const [file, setFile] = useState<File | null>(null)
    const router = useRouter()
    const formRef = useRef<HTMLFormElement>(null)
    const TOKEN = getCookie("token") || ""

    const openModal = () => {
        setTrain({ ...selectedTrain })
        setFile(null)
        setIsShow(true)
        if (formRef.current) formRef.current.reset()
    }

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault()
        try {
            const url = `${BASE_API_URL}/train/${train.id_train}`
            const payload = new FormData()
            payload.append("train_name", train.train_name || "")
            payload.append("description", train.description || "")

            const { data } = await put(url, payload, TOKEN)

            if (data?.status) {
                toast(data?.message, { type: "success", hideProgressBar: true })
                if (file) {
                    const pictureUrl = `${BASE_API_URL}/train/picture/${train.id_train}`
                    const picturePayload = new FormData()
                    picturePayload.append("train_picture", file)
                    await put(pictureUrl, picturePayload, TOKEN)
                }
                setIsShow(false)
                setTimeout(() => router.refresh(), 1000)
                
            } else {
                toast(data?.message || "Failed to update train", { type: "warning", hideProgressBar: true })
            }
        } catch (err) {
            console.error(err)
            toast("Something went wrong", { type: "error", hideProgressBar: true })
        }
    }

    const handleChangePicture = async () => {
        if (!file) return
        try {
            const url = `${BASE_API_URL}/train/picture/${train.id_train}`
            const payload = new FormData()
            payload.append("train_picture", file)
            const { data } = await put(url, payload, TOKEN)
            if (data?.status) {
                toast(data?.message, { hideProgressBar: true, type: `success` })
                setTimeout(() => router.refresh(), 1000)
            } else {
                toast(data?.message, { hideProgressBar: true, type: `warning` })
            }
        } catch (error) {
            console.log(error)
            toast(`Failed to update picture`, { hideProgressBar: true, type: `error` })
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
                                <strong className="font-bold text-2xl text-black">Edit Train</strong>
                                <small className="text-slate-400 text-sm">Update train information.</small>
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
                        <InputGroupComponent id="train_name" type="text" value={train.train_name ?? ""}
                            onChange={val => setTrain({ ...train, train_name: val })}
                            required={true} label="Train Name" />

                        <InputGroupComponent id="description" type="text" value={train.description ?? ""}
                            onChange={val => setTrain({ ...train, description: val })}
                            required={true} label="Description" />

                        <FileInput acceptTypes={["image/png", "image/jpeg", "image/jpg", "image/gif"]} id="train_picture"
                            label="Upload New Picture" onChange={f => setFile(f)} required={false} />
                        {file && (
                            <button type="button" onClick={handleChangePicture} className="mt-2 px-3 py-1 bg-blue-500 text-white rounded text-sm">
                                Update Picture
                            </button>
                        )}
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

export default EditTrain
