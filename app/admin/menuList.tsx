import { ReactNode } from "react";

interface IPropMenu {
    id: string,
    path: string,
    label: string,
}


let menuList: IPropMenu[] = [
    {
        id: `home`,
        label: `Dashboard`,
        path: `/admin/dashboard`,
    },
    {
        id: `user`,
        label: `Users`,
        path: `/admin/user`,
    },
    {
        id: `train`,
        label: `Trains`,
        path: `/admin/train`,
    },
    {
        id: `carriage`,
        label: `Carriages`,
        path: `/admin/carriage`,
    },
    {
        id: `seat`,
        label: `Seats`,
        path: `/admin/seat`,
    },
    {
        id: `schedule`,
        label: `Schedules`,
        path: `/admin/schedule`,
    },
    {
        id: `purchase`,
        label: `Purchases`,
        path: `/admin/purchase`,
    },
]
export default menuList;