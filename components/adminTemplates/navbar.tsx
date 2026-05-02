"use client";

import Link from "next/link";
import Image from "next/image";
import { ReactNode, useEffect, useRef, useState, useCallback } from "react";
import { getCookie, removeCookie } from "@/lib/client-cookies";
import { useRouter, usePathname } from "next/navigation";
import { FaBell, FaChevronDown, FaSignOutAlt, FaUser, FaExternalLinkAlt } from "react-icons/fa";

type MenuType = {
    id: string;
    path: string;
    label: string;
};

type SidebarProps = {
    children: ReactNode;
    id: string;
    title: string;
    menuList: MenuType[];
};

const Navbar = ({ children, id, title, menuList }: SidebarProps) => {
    const router = useRouter();
    const pathname = usePathname();
    const [profilePicture, setProfilePicture] = useState<string>("/images/default-avatar.png");
    const [userName, setUserName] = useState<string>("Admin");
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const storedName = getCookie("name");
        const storedPicture = getCookie("profile_picture");

        if (storedName) {
            setUserName(decodeURIComponent(storedName));
        }
        if (storedPicture && storedPicture !== "") {
            setProfilePicture(`http://localhost:5000/profilePicture/${storedPicture}`);
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
        <div className="text-black bg-[#f8f9fb] w-full min-h-screen m-0 p-0">
            {/* Navbar */}
            <nav className="sticky top-0 z-50 w-full bg-white border-b border-gray-100 shadow-sm" role="navigation" aria-label="Admin navigation">
                <div className="w-full flex justify-between items-center px-8 py-3">
                    {/* Left: Logo */}
                    <div className="flex items-center gap-3">
                        <Link href="/admin/dashboard" className="flex items-center gap-1">
                            <span className="text-2xl font-bold text-[#29303A]">Rail</span>
                            <span className="text-2xl font-bold text-[#DE5D5B]">Way</span>
                        </Link>
                        <span className="text-[10px] font-semibold uppercase tracking-widest bg-[#DE5D5B]/10 text-[#DE5D5B] px-2 py-0.5 rounded-full">
                            Admin
                        </span>
                    </div>

                    {/* Center: Nav Links */}
                    <ul className="hidden lg:flex items-center gap-1" role="menubar">
                        {menuList.map((item, index) => {
                            const isActive = item.id === id || pathname === item.path;
                            return (
                                <li key={index} role="none">
                                    <Link
                                        href={item.path}
                                        role="menuitem"
                                        aria-current={isActive ? "page" : undefined}
                                        className={`
                                            relative px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200
                                            ${isActive
                                                ? "text-[#DE5D5B] bg-[#DE5D5B]/5"
                                                : "text-[#29303A]/70 hover:text-[#29303A] hover:bg-gray-50"
                                            }
                                        `}
                                    >
                                        {item.label}
                                        {isActive && (
                                            <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-5 h-0.5 bg-[#DE5D5B] rounded-full" />
                                        )}
                                    </Link>
                                </li>
                            );
                        })}
                    </ul>

                    {/* Right: Notification + Profile */}
                    <div className="flex items-center gap-4">
                        {/* Notification Bell */}
                        <button
                            className="relative p-2 text-gray-400 hover:text-[#29303A] hover:bg-gray-50 rounded-lg transition-all duration-200"
                            aria-label="Notifications"
                        >
                            <FaBell className="text-lg" />
                            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#DE5D5B] rounded-full ring-2 ring-white" />
                        </button>

                        {/* Divider */}
                        <div className="w-px h-8 bg-gray-200" aria-hidden="true" />

                        {/* Profile Dropdown */}
                        <div className="relative" ref={dropdownRef}>
                            <button
                                onClick={() => setDropdownOpen(!dropdownOpen)}
                                className="flex items-center gap-3 py-1.5 px-2 rounded-lg hover:bg-gray-50 transition-all duration-200"
                                aria-expanded={dropdownOpen}
                                aria-haspopup="true"
                                aria-label="User menu"
                            >
                                <div className="relative w-9 h-9 rounded-full overflow-hidden ring-2 ring-gray-100 flex-shrink-0">
                                    <Image
                                        src={profilePicture}
                                        alt=""
                                        fill
                                        className="object-cover"
                                        onError={() => setProfilePicture("/images/default-avatar.png")}
                                    />
                                </div>
                                <div className="hidden sm:flex flex-col items-start">
                                    <span className="text-sm font-semibold text-[#29303A] leading-tight">{userName}</span>
                                    <span className="text-[11px] text-gray-400 leading-tight">Administrator</span>
                                </div>
                                <FaChevronDown className={`text-xs text-gray-400 transition-transform duration-200 ${dropdownOpen ? "rotate-180" : ""}`} />
                            </button>

                            {/* Dropdown Menu */}
                            {dropdownOpen && (
                                <div
                                    className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-gray-100 py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-200"
                                    role="menu"
                                    aria-orientation="vertical"
                                >
                                    {/* User Info Header */}
                                    <div className="px-4 py-3 border-b border-gray-100">
                                        <p className="text-sm font-semibold text-[#29303A]">{userName}</p>
                                        <p className="text-xs text-gray-400 mt-0.5">Admin Panel</p>
                                    </div>

                                    {/* Menu Items */}
                                    <div className="py-1">
                                        <Link
                                            href="/admin/user"
                                            onClick={() => setDropdownOpen(false)}
                                            className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-600 hover:text-[#29303A] hover:bg-gray-50 transition-colors"
                                            role="menuitem"
                                        >
                                            <FaUser className="text-gray-400" />
                                            <span>Manage Profile</span>
                                        </Link>
                                        <Link
                                            href="/customer/dashboard"
                                            onClick={() => setDropdownOpen(false)}
                                            className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-600 hover:text-[#29303A] hover:bg-gray-50 transition-colors"
                                            role="menuitem"
                                        >
                                            <FaExternalLinkAlt className="text-gray-400" />
                                            <span>Customer View</span>
                                        </Link>
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
                </div>
            </nav>

            {/* Page Content */}
            <div className="w-full m-0 p-0">{children}</div>
        </div>
    );
};

export default Navbar;
