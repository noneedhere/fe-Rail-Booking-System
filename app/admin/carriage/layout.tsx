import AdminTemplate from "@/components/adminTemplates"
import MenuList from "../menuList"

export const metadata = {
   title: 'Carriages | Train Ticket System',
   description: 'Carriage management for train ticket booking system',
}

type PropsLayout = {
   children: React.ReactNode
}

const RootLayout = ({ children }: PropsLayout) => {
   return (
      <AdminTemplate title="Train Ticket System" id="carriage" menuList={MenuList}>
         {children}
      </AdminTemplate>
   )
}

export default RootLayout
