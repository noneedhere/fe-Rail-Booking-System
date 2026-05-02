"use client"

import { Role, User } from "@/app/types"
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
import FileInput from "@/components/FileInput"

const EditUser = ({ selectedUser }: { selectedUser: User }) => {
    const [isShow, setIsShow] = useState<boolean>(false)
    const [user, setUser] = useState<User>({ ...selectedUser })
    const [newPassword, setNewPassword] = useState<string>("")
    const router = useRouter()
    const TOKEN = getCookie("token") || ""
    const [file, setFile] = useState<File | null>(null)
    const formRef = useRef<HTMLFormElement>(null)

    const openModal = () => {
        setUser({ ...selectedUser })
        setNewPassword("")
        setIsShow(true)
        if (formRef.current) formRef.current.reset()
    }

    const handleSubmit = async (e: FormEvent) => {
        try {
            e.preventDefault()
            const url = `${BASE_API_URL}/user/${user.id_user}`
            const { username, phone, address, role } = user
            const payload = new FormData()
            payload.append("username", username || "")
            if (phone) payload.append("phone", phone)
            if (address) payload.append("address", address)
            if (newPassword) payload.append("password", newPassword)
            payload.append("role", role || "")
            const { data } = await put(url, payload, TOKEN)
            if (data?.status) {
                // If there's a new picture file, upload it after updating user data
                if (file) {
                    const pictureUrl = `${BASE_API_URL}/user/picture/${user.id_user}`
                    const picturePayload = new FormData()
                    picturePayload.append("profile_picture", file)
                    await put(pictureUrl, picturePayload, TOKEN)
                }
                setIsShow(false)
                toast(data?.message, { hideProgressBar: true, type: `success`, autoClose: 2000 })
                setTimeout(() => router.refresh(), 1000)
            } else {
                toast(data?.message, { hideProgressBar: true, type: `warning`, autoClose: 2000 })
            }
        } catch (error) {
            console.log(error);
            toast(`Something Wrong`, { hideProgressBar: true, type: `error`, autoClose: 2000 })
        }
    }

    const handleChangePicture = async () => {
        if (!file) return
        try {
            const url = `${BASE_API_URL}/user/picture/${user.id_user}`
            const payload = new FormData()
            payload.append("profile_picture", file)
            const { data } = await put(url, payload, TOKEN)
            if (data?.status) {
                toast(data?.message, { hideProgressBar: true, type: `success`, autoClose: 2000 })
                setTimeout(() => router.refresh(), 1000)
            } else {
                toast(data?.message, { hideProgressBar: true, type: `warning`, autoClose: 2000 })
            }
        } catch (error) {
            console.log(error);
            toast(`Failed to update picture`, { hideProgressBar: true, type: `error`, autoClose: 2000 })
        }
    }

    return (
        <div>
            <ButtonWarning type="button" onClick={() => openModal()}>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-4">
                    <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
                </svg>
            </ButtonWarning>
            <Modal isShow={isShow} onClose={state => setIsShow(state)}>
                <form onSubmit={handleSubmit} ref={formRef}>
                    {/* modal header */}
                    <div className="sticky top-0 bg-white px-5 pt-5 pb-3 shadow">
                        <div className="w-full flex items-center">
                            <div className="flex flex-col">
                                <strong className="font-bold text-2xl text-black">Update User</strong>
                                <small className="text-slate-400 text-sm">Admins can update user information on this page.</small>
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
                    {/* end modal header */}

                    {/* modal body */}
                    <div className="p-5 text-black">
                        <InputGroupComponent id={`username`} type="text" value={user.username}
                            onChange={val => setUser({ ...user, username: val })}
                            required={true} label="Username" />

                        <InputGroupComponent id={`phone`} type="text" value={user.phone}
                            onChange={val => setUser({ ...user, phone: val })}
                            required={false} label="Phone" />

                        <InputGroupComponent id={`address`} type="text" value={user.address || ""}
                            onChange={val => setUser({ ...user, address: val })}
                            required={false} label="Address" />

                        <InputGroupComponent id={`password`} type="password" value={newPassword}
                            onChange={val => setNewPassword(val)}
                            required={false} label="New Password (leave blank to keep current)" />

                        <Select id={`role`} value={user.role} label="Role"
                            required={true} onChange={val => setUser({ ...user, role: val as Role })}>
                            <option value="">--- Select Role ---</option>
                            <option value="ADMIN">ADMIN</option>
                            <option value="CUSTOMER">CUSTOMER</option>
                        </Select>

                        <FileInput acceptTypes={["image/png", "image/jpeg", "image/jpg", "image/gif"]} id="profile_picture"
                            label="Upload New Picture (Max 5MB, JPG/JPEG/PNG/GIF)" onChange={f => setFile(f)} required={false} />
                        {file && (
                            <button type="button" onClick={handleChangePicture} className="mt-2 px-3 py-1 bg-blue-500 text-white rounded text-sm">
                                Update Picture
                            </button>
                        )}
                    </div>
                    {/* end modal body */}

                    {/* modal footer */}
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
                    {/* end modal footer */}
                </form>
            </Modal>
        </div>
    )
}
export default EditUser
