'use client'

import { useRouter } from 'next/navigation';
import { getCookie } from '@/lib/client-cookies';
import { Icon } from '@iconify/react';

/**
 * Access Denied Page (403 Forbidden)
 * 
 * Shown when a user tries to access a route they don't have permission for.
 * For example: Customer trying to access /admin routes
 */
export default function AccessDeniedPage() {
    const router = useRouter();
    const role = getCookie('role');

    const handleGoBack = () => {
        // Redirect based on role
        if (role === 'ADMIN') {
            router.push('/admin/dashboard');
        } else if (role === 'CUSTOMER') {
            router.push('/customer/dashboard');
        } else {
            router.push('/login');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-gray-50 to-gray-100 font-[Poppins]">
            <div className="text-center p-10">
                {/* Icon */}
                <div className="flex justify-center mb-6">
                    <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center">
                        <Icon
                            icon="solar:lock-keyhole-bold-duotone"
                            width="48"
                            height="48"
                            className="text-[#DE5D5B]"
                        />
                    </div>
                </div>

                {/* Error Code */}
                <h1 className="text-8xl font-bold text-[#DE5D5B] mb-4">
                    403
                </h1>

                {/* Title */}
                <h2 className="text-3xl font-semibold text-[#29303A] mb-2">
                    Access Denied
                </h2>

                {/* Description */}
                <p className="text-gray-500 mb-8 max-w-md mx-auto">
                    You don&apos;t have permission to access this page.
                    Please contact your administrator if you believe this is an error.
                </p>

                {/* Action Buttons */}
                <div className="flex gap-4 justify-center">
                    <button
                        onClick={() => router.back()}
                        className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition flex items-center gap-2"
                    >
                        <Icon icon="solar:arrow-left-linear" width="20" height="20" />
                        Go Back
                    </button>

                    <button
                        onClick={handleGoBack}
                        className="px-6 py-3 bg-[#DE5D5B] text-white rounded-lg font-medium hover:opacity-90 transition flex items-center gap-2"
                    >
                        <Icon icon="solar:home-2-bold" width="20" height="20" />
                        Go to Dashboard
                    </button>
                </div>
            </div>
        </div>
    );
}
