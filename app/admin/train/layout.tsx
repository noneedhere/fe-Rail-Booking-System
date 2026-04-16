import AdminTemplate from "@/components/adminTemplates"
import MenuList from "../menuList"

export const metadata = {
   title: 'Trains | Train Ticket System',
   description: 'Train management for train ticket booking system',
}

type PropsLayout = {
   children: React.ReactNode
}

const RootLayout = ({ children }: PropsLayout) => {
   return (
      <AdminTemplate title="Train Ticket System" id="train" menuList={MenuList}>
         {children}
      </AdminTemplate>
   )
}

export default RootLayout
