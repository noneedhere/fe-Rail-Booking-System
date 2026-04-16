import AdminTemplate from "@/components/adminTemplates";
import menuList from "../menuList";

export const metadata = {
    title: 'Dashboard | Train Ticket System',
    description: 'Admin dashboard for train ticket booking system',
};

type PropsLayout = {
    children: React.ReactNode;
};

const RootLayout = ({ children }: PropsLayout) => {
    return (
        <AdminTemplate title="Train Ticket System" id="home" menuList={menuList}>
            {children}
        </AdminTemplate>
    )
}

export default RootLayout;