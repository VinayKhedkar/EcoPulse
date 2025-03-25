'use client'
import { usePathname } from 'next/navigation'

const Header = () => {
    const location = usePathname()

    const formatPath = (path) => {
        if (path === '/') return 'Home'

        return path.charAt(1).toUpperCase() + path.slice(2)
    }

    return (
        <>
            <div className="border-b border-gray-100 shadow-sm w-full bg-primary">
                <div className="max-container">
                    <div className="flex justify-between items-center py-[1rem]">
                        <h1>{formatPath(location)}</h1>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Header
