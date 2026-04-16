"use client"

import { Train, isTrainLocked } from "@/app/types"
import { BASE_API_URL } from "@/global"
import { drop } from "@/lib/api-bridge"
import { getCookie } from "@/lib/client-cookies"
import { useRouter } from "next/navigation"
import { FormEvent, useState } from "react"
import { toast, ToastContainer } from "react-toastify"
import { ButtonDanger, ButtonSuccess } from "@/components/button"
import Modal from "@/components/modal"

const DeleteTrain = ({ selectedTrain }: { selectedTrain: Train }) => {
    const [isShow, setIsShow] = useState<boolean>(false)
    const router = useRouter()
    const TOKEN = getCookie("token") || ""

    const openModal = () => {
        setIsShow(true)
    }

    const handleSubmit = async (e: FormEvent) => {
        try {
            e.preventDefault()
            const url = `${BASE_API_URL}/train/${selectedTrain.id_train}`
            const { data } = await drop(url, TOKEN)
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

    const lockState = isTrainLocked(selectedTrain);
    const isLocked = lockState.isLocked;

    return (
        <div>
            <ToastContainer containerId={`toastTrain`} />
            <div className="relative group">
                <ButtonDanger
                    type="button"
                    onClick={() => !isLocked && openModal()}
                    className={isLocked ? 'opacity-50 cursor-not-allowed' : ''}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-4">
                        <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                    </svg>
                </ButtonDanger>
                {isLocked && (
                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-50">
                        Cannot delete train in active schedule
                    </div>
                )}
            </div>
            <Modal isShow={isShow} onClose={state => setIsShow(state)}>
                <form onSubmit={handleSubmit}>
                    <div className="sticky top-0 bg-white px-5 pt-5 pb-3 shadow">
                        <div className="w-full flex items-center">
                            <div className="flex flex-col">
                                <strong className="font-bold text-2xl text-black">Delete Train</strong>
                                <small className="text-slate-400 text-sm">This action cannot be undone.</small>
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
                        Are you sure you want to delete train <strong>{selectedTrain.train_name}</strong>?
                        <p className="text-sm text-gray-500 mt-2">
                            This will also delete all carriages and seats associated with this train.
                        </p>
                    </div>

                    <div className="w-full p-5 flex rounded-b-2xl shadow">
                        <div className="flex ml-auto gap-2">
                            <ButtonSuccess type="button" onClick={() => setIsShow(false)}>
                                Cancel
                            </ButtonSuccess>
                            <ButtonDanger type="submit">
                                Delete
                            </ButtonDanger>
                        </div>
                    </div>
                </form>
            </Modal>
        </div>
    )
}
export default DeleteTrain
