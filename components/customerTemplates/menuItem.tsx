import React from 'react';
import Link from "next/link"

interface MenuItemProps {
    icon: React.ReactNode;
    label: string;
    path: string;
    active?: boolean;
}

const MenuItem = ({ icon, label, path, active }: MenuItemProps) => {
    return (
        <Link href={path} className={`flex items-center p-2 my-2 ${active ? 'text-primary' : 'text-gray'}`}>
            <span className="mr-3">{icon}</span>
            <span className="flex-1">{label}</span>
        </Link>
    );
};
export default MenuItem;

