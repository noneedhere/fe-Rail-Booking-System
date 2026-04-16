"use client"

import { BASE_API_URL } from "@/global"
import { storeCookie } from "@/lib/client-cookies"
import axios from "axios"
import { useRouter } from "next/navigation"
import { FormEvent, useState } from "react"
import { toast, ToastContainer } from "react-toastify"
import { Icon } from '@iconify/react';

const RegisterPage = () => {
    const [username, setUsername] = useState<string>("")
    const [email, setEmail] = useState<string>("")
    const [password, setPassword] = useState<string>("")
    const router = useRouter()

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();

        try {
            const response = await axios.post(
                `${BASE_API_URL}/auth/register`,
                { username, email, password, role: "CUSTOMER" },
                { headers: { "Content-Type": "application/json" } }
            );

            const data = response.data;

            if (data.status) {
                toast(data.message, {
                    containerId: "toastLogin",
                    type: "success",
                    autoClose: 1000,
                    hideProgressBar: true,
                });

                storeCookie("token", data.token);
                storeCookie("id", String(data.data.id_user));
                storeCookie("name", data.data.username);
                storeCookie("role", data.data.role);

                setTimeout(() => {
                    // Always redirect to customer dashboard since role is always CUSTOMER
                    router.replace("/customer/dashboard");
                }, 1000);
            } else {
                toast("Registration failed. Please try again.", {
                    hideProgressBar: true,
                    containerId: "toastRegister",
                    type: "error",
                    autoClose: 2000
                });
            }
        } catch (error: any) {
            const errorMessage = error.response?.data?.message || "Registration failed. Email might already be registered.";
            toast(errorMessage, {
                containerId: "toastRegister",
                type: "error",
                autoClose: 2000,
            });
        }
    };

    return (
        <div className="min-h-screen flex bg-white font-[Poppins]">
            <ToastContainer containerId="toastRegister" />
            <div className="flex-1 flex flex-col justify-center px-[80px]">

                {/* Title */}
                <div className="flex flex-col justify-center">
                    <div className="flex justify-center">
                        <h1 className="text-[64px] font-bold leading-tight">
                            <span className="text-[#29303A]">Create </span>
                            <span className="ml-2 text-[#DE5D5B]">Account</span>
                        </h1>
                    </div>
                </div>

                <form
                    onSubmit={handleSubmit}
                    className="mt-[87px] w-full max-w-[420px] mx-auto"
                >
                    {/* USERNAME */}
                    <div>
                        <label className="block text-sm text-[#29303A] mb-[6px]">
                            Username
                        </label>

                        <div className="flex items-center border border-gray-400 rounded-lg px-4 py-3">
                            <input
                                type="text"
                                placeholder="Username"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                required
                                className="ml-3 w-full outline-none text-sm text-gray-900"
                            />
                            <Icon
                                icon="solar:user-bold-duotone"
                                width="24"
                                height="24"
                                className="text-gray-400"
                            />
                        </div>
                    </div>

                    {/* EMAIL */}
                    <div className="mt-[20px]">
                        <label className="block text-sm text-[#29303A] mb-[6px]">
                            Email
                        </label>

                        <div className="flex items-center border border-gray-400 rounded-lg px-4 py-3">
                            <input
                                type="email"
                                placeholder="Email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                className="ml-3 w-full outline-none text-sm text-gray-900"
                            />
                            <Icon
                                icon="ic:baseline-email"
                                width="24"
                                height="24"
                                className="text-gray-400"
                            />
                        </div>
                    </div>

                    {/* PASSWORD */}
                    <div className="mt-[20px]">
                        <label className="block text-sm text-[#29303A] mb-[6px]">
                            Password
                        </label>

                        <div className="flex items-center border border-gray-400 rounded-lg px-4 py-3">
                            <input
                                type="password"
                                placeholder="Password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                className="w-full outline-none text-sm text-gray-900"
                            />
                            <Icon
                                icon="mdi:hide-outline"
                                width="24"
                                height="24"
                                className="text-gray-400 cursor-pointer"
                            />
                        </div>
                    </div>

                    {/* LOGIN LINK */}
                    <div className="mt-2 text-center">
                        <span className="text-sm text-[#A0A0A0]">Already have an account? </span>
                        <span
                            onClick={() => router.push('/login')}
                            className="text-sm text-[#DE5D5B] font-bold cursor-pointer hover:underline"
                        >
                            Sign in
                        </span>
                    </div>

                    {/* SUBMIT BUTTON */}
                    <button
                        type="submit"
                        className="mt-[20px] w-full bg-[#DE5D5B] text-white py-3 rounded-lg font-semibold hover:opacity-90 transition"
                    >
                        Register
                    </button>
                </form>
            </div>

            {/* RIGHT SECTION */}
            <div className="flex-1 flex items-center justify-center p-[20px]">
                <img
                    src="/images/loginFoto.png"
                    alt="Register Photo"
                    className="w-[658px] max-h-screen object-cover rounded-xl"
                />
            </div>
        </div>
    );
}

export default RegisterPage