'use client'

import React, { useEffect, useState } from 'react';
import { getCookie } from '@/lib/client-cookies';

const HomePage = () => {
    const [userName, setName] = useState<string>("");

    useEffect(() => {
        const name = getCookie("name");
        setName(name ? decodeURIComponent(name) : "");
    }, []);

    return (
        <div className="w-full min-h-[300px] flex flex-col items-center justify-center" style={{ minHeight: "80vh" }}>
            <div className="flex flex-col items-center justify-center text-center">
                <h1 className="text-8xl font-bold text-[#DE5D5B]">
                    Selamat Datang
                </h1>
                <h2 className='m-10 text-7xl font-bold text-[#29303A]'>
                    {userName}
                </h2>
            </div>
        </div>
    );
};

export default HomePage;