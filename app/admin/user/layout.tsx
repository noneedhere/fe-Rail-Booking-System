import AdminTemplate from "@/components/adminTemplates"
import MenuList from "../menuList"

export const metadata = {
   title: 'Users | Train Ticket System',
   description: 'User management for train ticket booking system',
}

type PropsLayout = {
   children: React.ReactNode
}

const RootLayout = ({ children }: PropsLayout) => {
   return (
      <AdminTemplate title="Train Ticket System" id="user" menuList={MenuList}>
         {children}
      </AdminTemplate>
   )
}

export default RootLayout
