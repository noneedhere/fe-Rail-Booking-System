'use client'

import React, { useEffect, useState } from 'react';
import { Schedule } from '@/app/types';
import { getCookie } from '@/lib/client-cookies';
import { BASE_API_URL } from '@/global';

export default function FAQsPage() {
    return (
        <div id='faqs' className='relative w-full h-[650px] flex items-center justify-start p-20 bg-black'>
            <h1>FAQs</h1>
        </div>
    )
}