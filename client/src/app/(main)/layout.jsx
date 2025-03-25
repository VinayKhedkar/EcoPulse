import { Header, Navbar } from '@/components'

const layout = ({ children }) => {
    return (
        <main className="flex flex-col h-svh gap-[1rem]">
            <div className="max-container flex-1 overflow-auto bg-primary">{children}</div>
            <Navbar />
        </main>
    )
}

export default layout
