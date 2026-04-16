"use client";

import { ReactNode, useEffect, useState } from "react";
import { FaBell, FaGlobe } from "react-icons/fa";
import Image from "next/image";
import { getCookie, removeCookie } from "@/lib/client-cookies";
import { useRouter, usePathname } from "next/navigation";

type MenuType = {
    id: string;
    icon: ReactNode;
    path: string;
    label: string;
};

type NavbarProps = {
    children: ReactNode;
    id: string;
    title: string;
    menuList: MenuType[];
};

const Navbar = ({ children, id, title, menuList }: NavbarProps) => {
    const router = useRouter();
    const pathname = usePathname();

    const isPurchasePage = pathname.startsWith('/customer/purchases');

    const handleLogout = () => {
        removeCookie("token");
        removeCookie("name");
        removeCookie("profile_picture");
        router.push("/login");
    };
    const [profilePicture, setProfilePicture] = useState<string>("/images/default-avatar.png");
    const [userName, setUserName] = useState<string>("User");

    useEffect(() => {
        const storedProfilePicture = getCookie("profile_picture");
        const storedName = getCookie("name");

        if (storedName) {
            setUserName(storedName);
        }

        if (storedProfilePicture && storedProfilePicture !== "") {
            setProfilePicture(`http://localhost:5000/profilePicture/${storedProfilePicture}`);
        }
    }, []);

    return (
        <div className="text-white bg-transparent min-h-screen w-full m-0 p-0">
            <nav className={`fixed top-0 left-0 right-0 z-50 w-full flex justify-between items-center px-16 py-4 m-0 transition-all duration-300 ${isPurchasePage ? 'bg-[#29303A]' : 'bg-transparent backdrop-blur-sm'}`}>

                <div className="flex items-center">
                    <h1 className="text-3xl font-bold text-white">Rail<span className="text-[#de5d5b]">Way</span></h1>
                </div>

                <div className="flex items-center gap-8">
                    <a href="/customer/dashboard" className="text-white font-medium hover:text-[#DE5D5B] transition-colors">
                        Home
                    </a>

                    <a href="/customer/schedule" className="text-white font-medium hover:text-[#DE5D5B] transition-colors">
                        Schedule
                    </a>

                    <a href="/customer/booking" className="text-white font-medium hover:text-[#DE5D5B] transition-colors">
                        Bookings
                    </a>

                    <a href="/customer/purchases" className="text-white font-medium hover:text-[#DE5D5B] transition-colors">
                        My Purchases
                    </a>
                    <div className="flex items-center gap-2 text-white hover:text-[#DE5D5B] transition-colors">
                        <FaGlobe className="text-lg" />
                        <span className="font-medium">EN</span>
                    </div>

                    <button className="text-white hover:text-[#DE5D5B] transition-colors relative">
                        <FaBell className="text-xl" />
                        <span className="absolute -top-1 -right-1 bg-[#de5d5b] text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                            3
                        </span>
                    </button>

                    <div className="relative w-10 h-10 rounded-full overflow-hidden border-2  hover:border-[#DE5D5B] transition-colors cursor-pointer">
                        <Image src={profilePicture} alt={userName} fill className="object-cover" onError={() => setProfilePicture("/images/default-avatar.png")} />
                    </div>
                    <button onClick={handleLogout} className="px-4 py-2 rounded-full border border-[#DE5D5B] text-[#DE5D5B] text-sm font-medium hover:bg-[#DE5D5B] hover:text-white transition-colors">
                        Logout
                    </button>
                </div>
            </nav>

            <div className="w-full m-0 p-0">{children}</div>
        </div>
    );
};

export default Navbar;
