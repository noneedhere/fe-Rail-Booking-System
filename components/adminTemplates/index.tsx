"use client"

import { ReactNode, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getCookie } from "@/lib/client-cookies";
import Sidebar from "./navbar";

type MenuType = {
    id: string,
    path: string,
    label: string
}

type AdminProp = {
    children: ReactNode,
    id: string,
    title: string,
    menuList: MenuType[]
}

/**
 * AdminTemplate - Layout wrapper for admin pages
 * 
 * Security Note:
 * - Server-side protection is handled by Next.js middleware (/middleware.ts)
 * - This client-side check is for UX only (prevents content flash)
 * - The middleware validates tokens with backend before this component renders
 */
const AdminTemplate = ({ children, id, title, menuList }: AdminProp) => {
    const router = useRouter();
    const [isReady, setIsReady] = useState<boolean>(false);

    useEffect(() => {
        // Client-side check for UX (prevents flash of content)
        // Actual security is enforced by middleware.ts
        const token = getCookie("token");
        const role = getCookie("role");

        if (!token) {
            router.replace("/login");
            return;
        }

        if (role !== "ADMIN") {
            router.replace("/access-denied");
            return;
        }

        // If we reach here, user is authenticated and authorized
        // (middleware already verified this server-side)
        setIsReady(true);
    }, [router]);

    // Show loading state while client catches up with middleware decision
    if (!isReady) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gray-50">
                <div className="flex flex-col items-center gap-3">
                    <div className="w-8 h-8 border-4 border-[#DE5D5B] border-t-transparent rounded-full animate-spin"></div>
                    <span className="text-gray-500 text-sm">Loading...</span>
                </div>
            </div>
        );
    }

    return (
        <div className="">
            <Sidebar menuList={menuList} title={title} id={id}>
                {children}
            </Sidebar>
        </div>
    )
}

export default AdminTemplate

