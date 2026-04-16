export const metadata = {
    title: 'Login | Reil',
    description: 'Praktikum SMK Telkom Malang',
}

type PropsLayout = {
    children: React.ReactNode
}

const RootLayout = ({ children }: PropsLayout) => {
    return (
        <div>{children}</div>
    )
}

export default RootLayout
