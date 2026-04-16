"use client";

import Link from "next/link";
import { ReactNode } from "react";
import './navbar.css';

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
    return (
        <div className="text-black bg-white w-full m-0 p-0">
            {/* Navbar section */}
            <nav className="w-full flex justify-between items-center px-16 py-4 m-0 shadow-sm">
                <div className="flex items-center">
                    <Link href="/admin/dashboard" className="text-2xl font-bold text-[#DE5D5B]">
                        {title}
                    </Link>
                </div>
                <ul className="flex gap-10 ml-10 px-16">
                    {menuList.map((item, index) => (
                        <li key={index} className="relative group">
                            <Link
                                href={item.path}
                                className="text-black uppercase font-bold hover:text-[#DE5D5B] transition-colors"
                            >
                                {item.label}
                            </Link>
                            <span
                                className={`absolute left-0 bottom-[-5px] h-[3px] w-0 bg-[#DE5D5B] group-hover:w-full transition-all duration-500 ${item.id === id ? "w-full" : ""
                                    }`}
                            ></span>
                        </li>
                    ))}
                </ul>
            </nav>
            {/* End navbar section */}

            <div className="w-full m-0 p-0">{children}</div>
        </div>
    );
};

export default Navbar;
