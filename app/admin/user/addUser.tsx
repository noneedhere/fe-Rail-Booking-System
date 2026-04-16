"use client"

import { Role, User } from "@/app/types"
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
import FileInput from "@/components/FileInput"

const renderRoleBadge = (cat: Role): React.ReactNode => {
    if (cat === "ADMIN") {
        return (
            <span className="bg-blue-100 text-blue-800 text-sm font-semibold px-2.5 py-0.5 rounded-full dark:bg-blue-200/95 dark:text-blue-950/90">
                ADMIN
            </span>
        );
    }
    return (
        <span className="bg-purple-100 text-purple-800 text-sm font-medium me-2 px-2.5 py-0.5 rounded-full dark:bg-purple-900 dark:text-purple-300">
            CUSTOMER
        </span>
    );
};

const AddUser = () => {
    const [isShow, setIsShow] = useState<boolean>(false)
    const [user, setUser] = useState<User>({
        id_user: 0, username: ``, email: ``,
        password: ``, phone: ``, role: `` as Role
    })
    const router = useRouter()
    const TOKEN = getCookie("token") || ""
    const [file, setFile] = useState<File | null>(null)
    const formRef = useRef<HTMLFormElement>(null)
    const openModal = () => {
        setUser({
            id_user: 0, username: ``, email: ``,
            password: ``, phone: ``, role: `` as Role
        })
        setIsShow(true)
        if (formRef.current) formRef.current.reset()
    }

    const handleSubmit = async (e: FormEvent) => {
        try {
            e.preventDefault()
            const url = `${BASE_API_URL}/user/`
            const { username, email, password, phone, role } = user
            const payload = new FormData()
            payload.append("username", username || "")
            payload.append("email", email || "")
            payload.append("password", password || "")
            payload.append("phone", phone || "")
            payload.append("role", role || "")
            if (file !== null) payload.append("profile_picture", file)
            const { data } = await post(url, payload, TOKEN)
            if (data?.status) {
                setIsShow(false)
                toast(data?.message, { hideProgressBar: true, containerId: `toastUser`, type: `success` })
                setTimeout(() => router.refresh(), 1000)
            } else {
                toast(data?.message, { hideProgressBar: true, containerId: `toastUser`, type: `warning` })
            }
        } catch (error) {
            console.log(error);
            toast(`Something Wrong`, { hideProgressBar: true, containerId: `toastUser`, type: `error` })
        }
    }

    return (
        <div>
            <ToastContainer containerId={`toastUser`} />
            <ButtonSuccess type="button" onClick={() => openModal()}>
                <div className="flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                    </svg>
                    Add User
                </div>
            </ButtonSuccess>
            <Modal isShow={isShow} onClose={state => setIsShow(state)}>
                <form onSubmit={handleSubmit} ref={formRef}>
                    {/* modal header */}
                    <div className="sticky top-0 bg-white px-5 pt-5 pb-3 shadow">
                        <div className="w-full flex items-center">
                            <div className="flex flex-col">
                                <strong className="font-bold text-2xl text-black">Create New User</strong>
                                <small className="text-slate-400 text-sm">Admins can create user accounts on this page.</small>
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

                        <InputGroupComponent id={`email`} type="email" value={user.email}
                            onChange={val => setUser({ ...user, email: val })}
                            required={true} label="Email" />

                        <InputGroupComponent id={`password`} type="password" value={user.password}
                            onChange={val => setUser({ ...user, password: val })}
                            required={true} label="Password" />

                        <InputGroupComponent id={`phone`} type="text" value={user.phone}
                            onChange={val => setUser({ ...user, phone: val })}
                            required={true} label="Phone" />

                        <Select id={`role`} value={user.role} label="Role"
                            required={true} onChange={val => setUser({ ...user, role: val as Role })}>
                            <option value="">--- Select Role ---</option>
                            <option value="ADMIN">ADMIN</option>
                            <option value="CUSTOMER">CUSTOMER</option>
                        </Select>

                        <FileInput acceptTypes={["image/png", "image/jpeg", "image/jpg", "image/gif"]} id="profile_picture"
                            label="Upload Picture (Max 5MB, JPG/JPEG/PNG/GIF)" onChange={f => setFile(f)} required={false} />
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
export default AddUser
