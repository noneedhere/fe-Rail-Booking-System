import React from 'react';
import Link from "next/link"
import { usePathname } from "next/navigation";

interface MenuItemProps {
    icon: React.ReactNode;
    label: string;
    path: string;
}

interface MenuItemProps {
    icon: React.ReactNode;
    label: string;
    path: string;
    active?: boolean;
}

const MenuItem = ({ icon, label, path, active }: MenuItemProps) => {
    const handleClick = (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
        if (path.startsWith('#')) {
            e.preventDefault();
            const el = document.querySelector(path);
            if (el) {
                el.scrollIntoView({ behavior: 'smooth' });
            }
        }
    };
    const pathname = usePathname();
    const isActive = pathname === path || (typeof window !== 'undefined' && window.location.hash === path);
    return (
        <Link href={path}>
            <a onClick={handleClick} className={`flex items-center p-2 my-2 font-bold transition-colors duration-300 hover:text-[#2fb7dd] ${isActive ? 'text-[#2fb7dd]' : 'text-black'}`}>
                <span className="mr-3">{icon}</span>
                <span className="flex-1">{label}</span>
            </a>
        </Link>
    )
}
export default MenuItem;