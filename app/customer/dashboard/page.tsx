'use client'

import React, { useEffect, useState } from 'react';
import { Train, TramFront, TrainFront, Search, Users, ArrowLeftRight, ArrowRight, Link } from 'lucide-react'
import BlurText from '@/components/animation/blurText/page';
import { Instagram, Twitter, Phone, Mail } from 'lucide-react'
import { ArrowUpRight } from 'lucide-react'

const DashboardPage = () => {
    const [activeTrain, setActiveTrain] = useState('whoosh')
    const [roundTrip, setRoundTrip] = useState(false)
    const handleAnimationComplete = () => {
        console.log('Animation completed!');
    };
    const trainVideoMap: Record<string, string> = {
        whoosh: "Whoosh.mp4",
        local: "Local.mp4",
        lrt: "LRT.mp4",
        express: "Express.mp4",
    }
    const trainTextMap: Record<
        string,
        { highlight: string; line1: string; line2: string }
    > = {
        whoosh: {
            highlight: "Fast",
            line1: "Travel",
            line2: "With Whoosh",
        },
        local: {
            highlight: "Easy",
            line1: "Local",
            line2: "Daily Journey",
        },
        lrt: {
            highlight: "Smart",
            line1: "Way",
            line2: "Urban Transportation",
        },
        express: {
            highlight: "Best",
            line1: "Way",
            line2: "Premium Experience",
        },
    }

    const [activeDestination, setActiveDestination] = useState(0)

    const useCountUp = (end: number, duration = 1500) => {
        const [count, setCount] = useState(0)

        useEffect(() => {
            let start = 0
            const increment = end / (duration / 16)

            const timer = setInterval(() => {
                start += increment
                if (start >= end) {
                    setCount(end)
                    clearInterval(timer)
                } else {
                    setCount(Math.floor(start))
                }
            }, 16)

            return () => clearInterval(timer)
        }, [end, duration])

        return count
    }
    const StatsItem = ({
        value,
        label,
        suffix = "",
    }: {
        value: number
        label: string
        suffix?: string
    }) => {
        const count = useCountUp(value)

        return (
            <div className="flex flex-col items-center text-center">
                <div className="text-[56px] font-bold text-[#DE5D5B] leading-none">
                    {count}{suffix}
                </div>
                <div className="mt-3 text-gray-600 text-lg">
                    {label}
                </div>
            </div>
        )
    }

    return (
        <div>
            {/* section 1 */}
            <div id='home' className='relative w-full h-[650px] flex items-center justify-start p-20'>
                <video key={activeTrain} autoPlay loop muted playsInline className="absolute top-0 left-0 w-full h-full object-cover">
                    <source src={`/videos/${trainVideoMap[activeTrain]}`} type="video/mp4" />
                </video>

                <div className="w-1/2 text-white min-w-[750px] px-20 relative z-20">
                    <h1 className='text-6xl pt-20 font-bold leading-tight flex flex-wrap gap-2'>
                        <BlurText key={`${activeTrain}-highlight`} text={trainTextMap[activeTrain].highlight} delay={300} animateBy="words" direction="top" className="text-[#DE5D5B]" />
                        <BlurText key={`${activeTrain}-line1`} text={trainTextMap[activeTrain].line1} delay={600} animateBy="words" direction="top" />
                        <BlurText key={`${activeTrain}-line2`} text={trainTextMap[activeTrain].line2} delay={900} animateBy="words" direction="top" />
                    </h1>

                    <div className="mt-[70px] flex gap-4">
                        {[
                            { id: 'whoosh', label: 'Whoosh', icon: TrainFront },
                            { id: 'local', label: 'Local', icon: Train },
                            { id: 'lrt', label: 'LRT', icon: TramFront },
                            { id: 'express', label: 'Express', icon: TrainFront },
                        ].map(item => {
                            const Icon = item.icon
                            const active = activeTrain === item.id

                            return (
                                <button
                                    key={item.id}
                                    onClick={() => setActiveTrain(item.id)}
                                    className={`w-[134px] h-[47px] rounded-full flex items-center justify-center gap-2 text-sm font-medium transition ${active ? 'bg-[#DE5D5B] text-white' : 'bg-white text-black hover:bg-[#DE5D5B] hover:text-white'}`}>
                                    <Icon size={18} />
                                    {item.label}
                                </button>
                            )
                        })}
                    </div>

                    <div className="mt-[25px] w-[1222px] h-[100px] bg-[#ffffff] rounded-xl flex items-center px-[68px] gap-4">

                        <div className="w-[245px] h-[50px] bg-[#c9c9c9ca] flex items-center gap-2 px-4 rounded-lg">
                            <Search size={18} className='text-black' />
                            <input placeholder="Choose Departure" className="bg-transparent text-black outline-none text-sm w-full" />
                        </div>

                        <div className="w-[245px] h-[50px] bg-[#c9c9c9ca] flex items-center gap-2 px-4 rounded-lg">
                            <Search size={18} className='text-black' />
                            <input placeholder="Choose Arrival" className="bg-transparent text-black outline-none text-sm w-full" />
                        </div>

                        <div className="w-[398px] h-[50px] bg-[#c9c9c9ca] flex items-center justify-between px-6 rounded-lg">
                            <div className="flex items-center gap-2 text-sm">
                                <ArrowLeftRight size={18} className='text-black' />
                                <span className='text-gray-600'>Departure</span>
                                <span className='text-gray-600'>|</span>
                                <span className='text-gray-600'>Return</span>
                            </div>

                            <button onClick={() => setRoundTrip(!roundTrip)} className={`w-[50px] h-[26px] rounded-full flex items-center px-1 transition ${roundTrip ? 'bg-[#DE5D5B]' : 'bg-gray-900'}`}>
                                <div className={`w-[18px] h-[18px] bg-white rounded-full transition ${roundTrip ? 'translate-x-[22px]' : ''}`} />
                            </button>
                        </div>

                        <div className="w-[163px] h-[50px] bg-[#c9c9c9ca] flex items-center gap-2 px-4 rounded-lg cursor-pointer">
                            <Users size={18} className='text-black' />
                            <span className="text-sm text-gray-600">Guest</span>
                        </div>

                        <div className="w-[57px] h-[50px] bg-[#DE5D5B] rounded-lg flex items-center justify-center cursor-pointer">
                            <Search size={20} className="text-white" />
                        </div>
                    </div>
                </div>
            </div>

            {/* section 2 */}
            <section id='section2' className="w-full bg-white py-20">
                <div className="max-w-7xl mx-auto px-20">

                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-12">
                        <StatsItem value={125000} label="Passengers Served" suffix="+" />
                        <StatsItem value={120} label="Active Routes" />
                        <StatsItem value={86} label="Train Fleets" />
                        <StatsItem value={10} label="Years of Service" suffix="+" />
                    </div>
                </div>
            </section>

            {/* section 3 */}
            <div id='section3' className="w-full px-30 py-24 bg-slate-100">

                <div className="flex items-center justify-between">
                    <h2 className="text-[54px] font-bold text-[#DE5D5B]">
                        Popular Destination
                    </h2>

                    <button className="flex items-center gap-2 text-[#DE5D5B] text-[20px] font-medium hover:opacity-80 transition">
                        View All
                        <ArrowRight size={20} />
                    </button>
                </div>

                <div className="mt-12 flex gap-6">

                    {[
                        "/images/Destination/Denpasar.jpg",
                        "/images/Destination/Malang.jpg",
                        "/images/Destination/Yogyakarta.jpg",
                        "/images/Destination/Tangerang.jpg",
                    ].map((img, index) => {
                        const isActive = activeDestination === index

                        return (
                            <div key={index} onClick={() => setActiveDestination(index)}
                                className={`h-[432px] rounded-xl hover:brightness-50 overflow-hidden cursor-pointer transition-all duration-500 ease-in-out ${isActive ? "w-[680px] grayscale-0" : "w-[190px] grayscale"}`}
                            >
                                <img src={img} alt="destination" className="w-full h-full object-cover" />
                            </div>
                        )
                    })}
                </div>
            </div>

            {/* section 4 */}
            <div id='section4' className="relative w-full bg-white py-24">

                <div className="grid grid-cols-2 items-stretch">

                    <div className="relative">
                        <img src="/images/Our Partners/ourpartner.jpg" alt="Our Partners" className="w-[788px] h-[455px] object-cover absolute bottom-0 left-0 rounded-tr-[32px] " />
                    </div>

                    <div className="flex flex-col justify-center items-center">
                        <h2 className="text-[54px] font-bold text-[#DE5D5B] mb-12">
                            Our Partners
                        </h2>

                        <div className="grid grid-cols-4 gap-8">
                            {Array.from({ length: 12 }).map((_, index) => (
                                <div key={index} className="w-[80px] h-[80px] flex items-center justify-center">
                                    <img src={`/images/Our Partners/partner${index + 1}.jpg`} alt={`Partner ${index + 1}`} className="w-full h-full object-contain" />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* FOOTER */}
            <footer id='footer' className="w-full bg-[#29303A] text-white py-20">
                <div className="max-w-7xl mx-auto px-5 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-16">

                    {/* BRAND */}
                    <div className="flex flex-col gap-6">
                        <h3 className="text-4xl font-bold">
                            <span className="text-white">Rail</span>
                            <span className="text-[#DE5D5B]">Way</span>
                        </h3>

                        <div className="flex gap-4">
                            {[Twitter, Instagram, Phone].map((Icon, i) => (
                                <div
                                    key={i}
                                    className="w-10 h-10 flex items-center justify-center rounded-full border border-white cursor-pointer hover:text-[#DE5D5B] hover:border-[#DE5D5B] transition"
                                >
                                    <Icon size={18} />
                                </div>
                            ))}
                        </div>

                        <div className="text-sm text-gray-300 leading-relaxed">
                            <p>Customer Service : +62 8125 2375 524</p>
                            <p>Email : noneedhere@gmail.com</p>
                        </div>
                    </div>

                    {/* EXPLORE */}
                    <div className="flex flex-col gap-5">
                        <h4 className="text-xl font-semibold">Explore</h4>
                        {[
                            { label: 'Home', target: '#home' },
                            { label: 'Stats', target: '#section2' },
                            { label: 'Destination', target: '#section3' },
                            { label: 'Partners', target: '#section4' },
                            { label: 'Booking', href: '/customer/schedule' },
                        ].map((item, index) => (
                            <div key={index} className="flex flex-row items-center">

                                <p
                                    className="text-[16px] text-gray-300 hover:text-[#DE5D5B] cursor-pointer transition"
                                    onClick={() => {
                                        if (item.target) {
                                            const el = document.querySelector(item.target)
                                            if (el) el.scrollIntoView({ behavior: 'smooth' })
                                        }
                                        if (item.href) {
                                            window.location.href = item.href
                                        }
                                    }}
                                >
                                    {item.label}
                                </p>
                            </div>
                        ))}
                    </div>

                    <div className="flex flex-col gap-5">
                        <h4 className="text-xl font-semibold">Support</h4>
                        {[
                            { label: 'Help', target: '#help' },
                            { label: 'Privacy Policy', target: '#privacy-policy' },
                            { label: 'Terms & Conditions', target: '#terms-conditions' },
                            { label: 'FAQs', href: '/customer/faqs' },
                        ].map((item, index) => (
                            <div key={index} className="flex flex-row items-center">

                                <p
                                    className="text-[16px] text-gray-300 hover:text-[#DE5D5B] cursor-pointer transition"
                                    onClick={() => {
                                        if (item.target) {
                                            const el = document.querySelector(item.target)
                                            if (el) el.scrollIntoView({ behavior: 'smooth' })
                                        }
                                        if (item.href) {
                                            window.location.href = item.href
                                        }
                                    }}
                                >
                                    {item.label}
                                </p>
                            </div>
                        ))}
                    </div>
                    {/* SUPPORT */}
                    <div className="flex flex-col gap-4">
                        <h4 className="text-xl font-semibold">Support</h4>
                        {['Help', 'Privacy Policy', 'Terms & Conditions', 'FAQs'].map(item => (
                            <span
                                key={item}
                                className="text-gray-300 cursor-pointer hover:text-[#DE5D5B] transition"
                            >
                                {item}
                            </span>
                        ))}
                    </div>

                    {/* PAYMENT METHOD */}
                    <div className="flex flex-col gap-6">
                        <h4 className="text-xl font-semibold">Payment Method</h4>

                        <div className="flex items-center gap-2">
                            {Array.from({ length: 6 }).map((_, i) => (
                                <div key={i} className="w-[40px] h-[40px] bg-white rounded flex items-center justify-center hover:scale-105 transition">
                                    <img src={`/images/Footer/Logo${i + 1}.jpg`} alt={`payment-${i + 1}`} className="w-[28px] h-[28px] object-contain" />
                                </div>
                            ))}
                        </div>
                    </div>

                </div>
            </footer>
        </div>
    );
};

export default DashboardPage;