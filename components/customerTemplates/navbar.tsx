"use client";

import { ReactNode, useEffect, useRef, useState, useCallback } from "react";
import { FaBell, FaGlobe, FaChevronDown, FaSignOutAlt, FaUser, FaShieldAlt, FaShoppingBag } from "react-icons/fa";
import Image from "next/image";
import Link from "next/link";
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

    const [profilePicture, setProfilePicture] = useState<string>("/images/default-avatar.png");
    const [userName, setUserName] = useState<string>("User");
    const [userRole, setUserRole] = useState<string>("");
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const isAdmin = userRole === "ADMIN";

    useEffect(() => {
        const storedProfilePicture = getCookie("profile_picture");
        const storedName = getCookie("name");
        const storedRole = getCookie("role");

        if (storedName) {
            setUserName(decodeURIComponent(storedName));
        }

        if (storedRole) {
            setUserRole(storedRole);
        }

        if (storedProfilePicture && storedProfilePicture !== "") {
            setProfilePicture(`http://localhost:5000/profilePicture/${storedProfilePicture}`);
        }
    }, []);

    // Close dropdown on outside click
    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
                setDropdownOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    // Close dropdown on ESC key
    useEffect(() => {
        const handleEsc = (e: KeyboardEvent) => {
            if (e.key === "Escape") {
                setDropdownOpen(false);
            }
        };
        document.addEventListener("keydown", handleEsc);
        return () => document.removeEventListener("keydown", handleEsc);
    }, []);

    // Close dropdown on route change
    useEffect(() => {
        setDropdownOpen(false);
    }, [pathname]);

    const handleLogout = useCallback(() => {
        removeCookie("token");
        removeCookie("name");
        removeCookie("profile_picture");
        removeCookie("role");
        removeCookie("id");
        router.push("/login");
    }, [router]);

    return (
        <div className="text-white bg-transparent min-h-screen w-full m-0 p-0">
            <nav
                className={`fixed top-0 left-0 right-0 z-50 w-full flex justify-between items-center px-8 md:px-16 py-4 m-0 transition-all duration-300 ${isPurchasePage ? 'bg-[#29303A]' : 'bg-transparent backdrop-blur-sm'}`}
                role="navigation"
                aria-label="Customer navigation"
            >
                <div className="flex items-center">
                    <Link href="/customer/dashboard">
                        <h1 className="text-3xl font-bold text-white">Rail<span className="text-[#de5d5b]">Way</span></h1>
                    </Link>
                </div>

                <div className="flex items-center gap-6 md:gap-8">
                    <Link href="/customer/dashboard" className="text-white font-medium hover:text-[#DE5D5B] transition-colors hidden md:block">
                        Home
                    </Link>

                    <Link href="/customer/schedule" className="text-white font-medium hover:text-[#DE5D5B] transition-colors hidden md:block">
                        Schedule
                    </Link>

                    <Link href="/customer/booking" className="text-white font-medium hover:text-[#DE5D5B] transition-colors hidden md:block">
                        Bookings
                    </Link>

                    <Link href="/customer/purchases" className="text-white font-medium hover:text-[#DE5D5B] transition-colors hidden md:block">
                        My Purchases
                    </Link>

                    <div className="flex items-center gap-2 text-white hover:text-[#DE5D5B] transition-colors cursor-pointer hidden md:flex">
                        <FaGlobe className="text-lg" />
                        <span className="font-medium">EN</span>
                    </div>

                    <button className="text-white hover:text-[#DE5D5B] transition-colors relative" aria-label="Notifications">
                        <FaBell className="text-xl" />
                        <span className="absolute -top-1 -right-1 bg-[#de5d5b] text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                            3
                        </span>
                    </button>

                    {/* Profile Dropdown */}
                    <div className="relative" ref={dropdownRef}>
                        <button
                            onClick={() => setDropdownOpen(!dropdownOpen)}
                            className="flex items-center gap-2 py-1 px-1 rounded-full hover:bg-white/10 transition-all duration-200"
                            aria-expanded={dropdownOpen}
                            aria-haspopup="true"
                            aria-label="User menu"
                        >
                            <div className="relative w-10 h-10 rounded-full overflow-hidden border-2 border-white/30 hover:border-[#DE5D5B] transition-colors flex-shrink-0">
                                <Image
                                    src={profilePicture}
                                    alt=""
                                    fill
                                    className="object-cover"
                                    onError={() => setProfilePicture("/images/default-avatar.png")}
                                />
                            </div>
                            <FaChevronDown className={`text-xs text-white/70 transition-transform duration-200 ${dropdownOpen ? "rotate-180" : ""}`} />
                        </button>

                        {/* Dropdown Menu */}
                        {dropdownOpen && (
                            <div
                                className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-gray-100 py-2 z-50"
                                role="menu"
                                aria-orientation="vertical"
                                style={{ animation: "fadeInDown 0.2s ease-out" }}
                            >
                                {/* User Info Header */}
                                <div className="px-4 py-3 border-b border-gray-100">
                                    <p className="text-sm font-semibold text-[#29303A]">{userName}</p>
                                    <p className="text-xs text-gray-400 mt-0.5">
                                        {isAdmin ? "Administrator" : "Customer"}
                                    </p>
                                </div>

                                {/* Menu Items */}
                                <div className="py-1">
                                    <Link
                                        href="/customer/purchases"
                                        onClick={() => setDropdownOpen(false)}
                                        className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-600 hover:text-[#29303A] hover:bg-gray-50 transition-colors"
                                        role="menuitem"
                                    >
                                        <FaShoppingBag className="text-gray-400" />
                                        <span>My Purchases</span>
                                    </Link>

                                    {/* Admin-only: Link to Admin Dashboard */}
                                    {isAdmin && (
                                        <Link
                                            href="/admin/dashboard"
                                            onClick={() => setDropdownOpen(false)}
                                            className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-600 hover:text-[#29303A] hover:bg-gray-50 transition-colors"
                                            role="menuitem"
                                        >
                                            <FaShieldAlt className="text-gray-400" />
                                            <span>Admin Dashboard</span>
                                        </Link>
                                    )}
                                </div>

                                {/* Logout */}
                                <div className="border-t border-gray-100 pt-1">
                                    <button
                                        onClick={handleLogout}
                                        className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-[#DE5D5B] hover:bg-red-50 transition-colors"
                                        role="menuitem"
                                    >
                                        <FaSignOutAlt />
                                        <span>Logout</span>
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </nav>

            <div className="w-full m-0 p-0">{children}</div>

            {/* Dropdown animation */}
            <style jsx>{`
                @keyframes fadeInDown {
                    from {
                        opacity: 0;
                        transform: translateY(-8px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
            `}</style>
        </div>
    );
};

export default Navbar;
