import AdminTemplate from "@/components/adminTemplates"
import MenuList from "../menuList"

export const metadata = {
    title: 'Purchases | Train Ticket System',
    description: 'View all ticket purchases',
}

type PropsLayout = {
    children: React.ReactNode
}

const RootLayout = ({ children }: PropsLayout) => {
    return (
        <AdminTemplate title="Train Ticket System" id="purchase" menuList={MenuList}>
            {children}
        </AdminTemplate>
    )
}

export default RootLayout
