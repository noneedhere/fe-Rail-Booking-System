import AdminTemplate from "@/components/adminTemplates"
import MenuList from "../menuList"

export const metadata = {
   title: 'Seats | Train Ticket System',
   description: 'Seat management for train ticket booking system',
}

type PropsLayout = {
   children: React.ReactNode
}

const RootLayout = ({ children }: PropsLayout) => {
   return (
      <AdminTemplate title="Train Ticket System" id="seat" menuList={MenuList}>
         {children}
      </AdminTemplate>
   )
}

export default RootLayout
