import { FaHome, FaHandshake, FaMapMarkedAlt, FaInfoCircle, FaTicketAlt, FaSignOutAlt, FaReceipt } from 'react-icons/fa'

interface IPropMenu {
    id: string,
    icon: React.ReactNode,
    path: string,
    label: string
}

let menuList: IPropMenu[] = [
    {
        id: `home`,
        icon: <FaHome />,
        label: `Home`,
        path: `/customer/dashboard#section1`,
    },
    {
        id: `ourAdvantages`,
        icon: <FaHandshake />,
        label: `Our Advantages`,
        path: `/customer/dashboard#ourAdvantages`,
    },
    {
        id: `ourPatners`,
        icon: <FaHandshake />,
        label: `Our Patners`,
        path: `/customer/dashboard#ourPatners`,
    },
    {
        id: `popularDestination`,
        icon: <FaMapMarkedAlt />,
        label: `Popular Destination`,
        path: `/customer/dashboard#section3`,
    },
    {
        id: `footer`,
        icon: <FaInfoCircle />,
        label: `Footer`,
        path: `/customer/dashboard#footer`,
    },
    {
        id: `schedule`,
        icon: <FaTicketAlt />,
        label: `Schedule`,
        path: `/customer/schedule`,
    },
    {
        id: `booking`,
        icon: <FaTicketAlt />,
        label: `Book Ticket`,
        path: `/customer/booking`,
    },
    {
        id: `purchases`,
        icon: <FaReceipt />,
        label: `My Purchases`,
        path: `/customer/purchases`,
    },
    {
        id: `login`,
        icon: <FaSignOutAlt />,
        label: `Logout`,
        path: `/login`,
    },
]
export default menuList

