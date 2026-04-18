'use client'

import React, { useEffect, useState } from 'react';
import { Schedule } from '@/app/types';
import { getCookie } from '@/lib/client-cookies';
import { BASE_API_URL } from '@/global';

export default function AboutUsPage() {
    return (
        <div>
            <div id='aboutus' className='relative w-full h-[650px] flex items-center justify-center p-20'>
                <img src="/images/dashboardFoto.png" alt="" className='absolute top-0 left-0 w-full h-full object-cover' />

                <div className="text-white min-w-[750px] px-20 relative items-center justify-center flex flex-col z-20">
                    <h1 className='text-6xl pt-20 font-bold'>
                        About Us
                    </h1>
                    <p>Learn more about our company and what we do</p>
                </div>
            </div>

            <section className="w-full bg-[#F1F2F6] py-10 flex justify-center">
                <div className="w-[80%] bg-white rounded-xl shadow-md px-10 py-6 flex items-center justify-between">

                    {/* LEFT - QR CODE */}
                    <div className="flex items-center gap-6">
                        <div className="w-32 h-32">
                            <img
                                src="/images/About Us/scan.png"
                                alt="QR Code"
                                className="w-full h-full object-contain"
                            />
                        </div>

                        {/* TEXT */}
                        <div className="flex flex-col">
                            <h3 className="text-xl font-semibold text-[#DE5D5B]">
                                Scan to get our free app
                            </h3>
                            <p className="text-gray-500 text-sm max-w-md">
                                Use our app to get live travel updates and book mobile tickets
                                for trains, buses, flights, and ferries.
                            </p>
                        </div>
                    </div>

                    <hr className="w-0.5 h-full bg-[#DE5D5B]" />

                    {/* RIGHT - RATINGS */}
                    <div className="flex gap-x-24">
                        {/* App Store */}
                        <div className="flex flex-col">
                            <h4 className="font-semibold text-[#DE5D5B]">App Store</h4>
                            <div className="flex items-center gap-1 text-yellow-400">
                                ⭐⭐⭐⭐⭐
                                <span className="text-gray-700 text-sm ml-1">4.9</span>
                            </div>
                            <p className="text-gray-400 text-xs">42K ratings</p>
                        </div>

                        {/* Google Play */}
                        <div className="flex flex-col">
                            <h4 className="font-semibold text-[#DE5D5B]">Google Play</h4>
                            <div className="flex items-center gap-1 text-yellow-400">
                                ⭐⭐⭐⭐⭐
                                <span className="text-gray-700 text-sm ml-1">4.6</span>
                            </div>
                            <p className="text-gray-400 text-xs">136K reviews</p>
                        </div>
                    </div>
                </div>
            </section>

            <section className="w-full bg-[#F1F2F6] py-16 flex flex-col items-center">

                {/* MENU */}
                <div className="flex flex-wrap justify-center gap-6 mb-10">
                    {[
                        "Cheap Train Tickets",
                        "Train Types",
                        "Trains in Europe",
                        "Global Train Travel",
                        "FAQs"
                    ].map((item, index) => (
                        <button
                            key={index}
                            className="px-8 py-3 border border-gray-300 rounded-lg text-sm text-gray-700 hover:bg-gray-300 transition"
                        >
                            {item}
                        </button>
                    ))}
                </div>

                {/* CONTENT */}
                <div className="max-w-3xl text-center px-6">
                    <h2 className="text-3xl md:text-4xl font-bold text-[#1D2B53] mb-6">
                        Discover the World by Train
                    </h2>

                    <p className="text-gray-600 text-sm md:text-base leading-relaxed mb-6">
                        Travel across cities and countries easily using modern train networks.
                        Train journeys offer comfort, speed, and an enjoyable travel experience.
                    </p>

                    <div className="text-left mt-6">
                        <h3 className="font-semibold text-[#1D2B53] mb-2">
                            Popular Routes
                        </h3>

                        <ul className="list-disc pl-5 text-gray-600 text-sm space-y-2">
                            <li>
                                <span className="font-medium text-[#1D2B53]">Paris to Milan:</span>{" "}
                                A popular route connecting France and Italy.
                            </li>
                            <li>
                                <span className="font-medium text-[#1D2B53]">Berlin to Paris:</span>{" "}
                                Long-distance travel across major European cities.
                            </li>
                        </ul>
                    </div>

                    <h2 className="text-2xl md:text-3xl font-bold text-[#1D2B53] mt-10">
                        How to Get Cheap Train Tickets
                    </h2>

                    <p className="text-gray-600 text-sm mt-4">
                        Plan ahead, compare prices, and choose flexible schedules to get the best deals.
                    </p>
                </div>
            </section>
        </div>
    )
}