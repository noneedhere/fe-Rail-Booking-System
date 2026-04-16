import { User } from "@/app/types";
import { BASE_API_URL, BASE_IMAGE_PROFILE } from "@/global";
import { AlertInfo } from "@/components/alert";
import Image from 'next/image';
import AddUser from "./addUser";
import DeleteUser from "./deleteUser";
import EditUser from "./editUser";
import axios from "axios";
import { cookies } from "next/headers";

export const getUser = async (search?: string): Promise<User[] | undefined> => {
    const token = (await cookies()).get("token")?.value;

    if (!token) {
        console.error("No token found in cookies.");
        return undefined;
    }

    try {
        const response = await axios.get(`${BASE_API_URL}/user/`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
            params: search ? { search } : undefined
        });
        return response.data?.status ? response.data.data : undefined;
    } catch (error: any) {
        if (error.response) {
            console.error("API response error:", error.response.status, error.response.data);
        } else {
            console.error("Error fetching user:", error.message || error);
        }
        return undefined;
    }
};

const renderRoleBadge = (role: string): React.ReactNode => {
    if (role === "ADMIN") {
        return (
            <span className="bg-blue-100 text-blue-800 text-sm font-semibold px-2.5 py-0.5 rounded-full dark:bg-blue-200/95 dark:text-blue-950/90">
                ADMIN
            </span>
        );
    }
    return (
        <span className="bg-purple-100 text-purple-800 text-sm font-medium px-2.5 py-0.5 rounded-full dark:bg-purple-900 dark:text-purple-300">
            CUSTOMER
        </span>
    );
};

const UserPage = async ({ searchParams }: { searchParams: Promise<{ [key: string]: string | string[] | undefined }> }) => {
    const params = await searchParams;
    const search = params.search ? params.search.toString() : undefined;
    const users: User[] = await getUser(search) ?? [];

    return (
        <div className="m-2 bg-white rounded-lg border-t-4 border-t-slate-200 p-3 shadow-md text-slate-700">
            <h4 className="text-2xl text-[#de5d5b] mb-2">User Data</h4>
            <p className="text-sm text-secondary mb-4">
                This page displays user data, allowing admins to view details,
                search, and manage users by adding, editing, or deleting them.
            </p>
            <div className="flex justify-end items-end mb-4">
                <div className="ml-4">
                    <AddUser />
                </div>
            </div>
            {
                users.length === 0 ?
                    <AlertInfo title="Information">
                        No data available
                    </AlertInfo>
                    :
                    <div className="m-2">
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Picture</th>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Username</th>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                                        <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {users.map((data, index) => (
                                        <tr key={`user-${index}`}>
                                            <td className="px-4 py-3 whitespace-nowrap">
                                                <Image
                                                    width={40}
                                                    height={40}
                                                    src={data.profile_picture ? `http://localhost:5000/profilePicture/${data.profile_picture}` : '/default-avatar.png'}
                                                    className="rounded-full overflow-hidden"
                                                    alt={data.username}
                                                    unoptimized
                                                />
                                            </td>
                                            <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                                                {data.username}
                                            </td>
                                            <td className="px-4 py-3 whitespace-nowrap">
                                                {renderRoleBadge(data.role)}
                                            </td>
                                            <td className="px-4 py-3 whitespace-nowrap text-right">
                                                <div className="flex gap-1 justify-end">
                                                    <EditUser selectedUser={data} />
                                                    <DeleteUser selectedUser={data} />
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
            }
        </div>
    )
}
export default UserPage
