import { ReactNode } from "react";

interface IPropMenu {
    id: string,
    path: string,
    label: string,
}


let menuList: IPropMenu[] = [
    {
        id: `home`,
        label: `Home`,
        path: `/admin/dashboard`,
    },
    {
        id: `user`,
        label: `User`,
        path: `/admin/user`,
    },
    {
        id: `train`,
        label: `Train`,
        path: `/admin/train`,
    },
    {
        id: `seat`,
        label: `Seat`,
        path: `/admin/seat`,
    },
    {
        id: `carriage`,
        label: `Carriage`,
        path: `/admin/carriage`,
    },
    {
        id: `schedule`,
        label: `Schedule`,
        path: `/admin/schedule`,
    },
    {
        id: `purchase`,
        label: `Purchase`,
        path: `/admin/purchase`,
    },
    {
        id: `customer`,
        label: `Customer Dashboard`,
        path: `/customer/dashboard`,
    },
    {
        id: `login`,
        label: `Logout`,
        path: `/login`,
    },
]
export default menuList;