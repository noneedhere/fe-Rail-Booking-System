"use client"

import { ReactNode, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getCookie } from "@/lib/client-cookies";
import Navbar from "./navbar";

type MenuType = {
    id: string,
    icon: ReactNode
    path: string,
    label: string
}

type ManagerProp = {
    children: ReactNode,
    id: string,
    title: string,
    menuList: MenuType[]
}

/**
 * CustomerTemplate - Layout wrapper for customer pages
 * 
 * Security Note:
 * - Server-side protection is handled by Next.js middleware (/middleware.ts)
 * - Both ADMIN and CUSTOMER roles can access customer pages
 * - This client-side check is for UX only (prevents content flash)
 */
const CustomerTemplate = ({ children, id, title, menuList }: ManagerProp) => {
    const router = useRouter();
    const [isReady, setIsReady] = useState<boolean>(false);

    useEffect(() => {
        // Client-side check for UX (prevents flash of content)
        // Actual security is enforced by middleware.ts
        const token = getCookie("token");

        if (!token) {
            router.replace("/login");
            return;
        }

        // Both ADMIN and CUSTOMER can access customer pages
        // Middleware already verified authentication server-side
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
            <Navbar menuList={menuList} title={title} id={id}>
                {children}
            </Navbar>
        </div>
    )
}

export default CustomerTemplate

