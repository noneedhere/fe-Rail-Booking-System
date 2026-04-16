import AdminTemplate from "@/components/adminTemplates"
import MenuList from "../menuList"

export const metadata = {
    title: 'Schedules | Train Ticket System',
    description: 'Schedule management for train ticket booking system',
}

type PropsLayout = {
    children: React.ReactNode
}

const RootLayout = ({ children }: PropsLayout) => {
    return (
        <AdminTemplate title="Train Ticket System" id="schedule" menuList={MenuList}>
            {children}
        </AdminTemplate>
    )
}

export default RootLayout
