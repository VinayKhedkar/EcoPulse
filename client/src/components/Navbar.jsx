'use client'
import { Cart, Community, Home, Profile } from '@/assets'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

const Navbar = () => {
    const location = usePathname()
    const isActive = (path) => location === path

    return (
        <div className="max-container relative z-10 bottom-[1rem]">
            <nav className="w-full bg-white rounded-full shadow-[0_0_5px_rgba(0,0,0,0.2)] py-[1.5rem]">
                <div className="flex justify-between items-center px-[3.5rem]">
                    <Link
                        href="/"
                        className={`flex flex-col justify-center items-center gap-[0.1rem] ${
                            isActive('/') ? 'text-green' : 'opacity-50'
                        }`}
                    >
                        <svg
                            width="21"
                            height="20"
                            viewBox="0 0 21 20"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                d="M18.9487 8.66978C19.3004 9.02148 19.4865 9.45214 19.4989 9.94511V9.99826V17.1216C19.4989 18.1552 18.6541 19 17.6205 19H13.5675V14.3663C13.5675 13.3141 12.7109 12.4575 11.6587 12.4575H9.34089C8.2886 12.4575 7.43204 13.3141 7.43204 14.3663V19H3.37904C2.34541 19 1.50061 18.1552 1.50061 17.1216V9.99826C1.50061 9.4824 1.68679 9.03389 2.05091 8.67033L2.0516 8.66965L9.17033 1.54825C9.90114 0.817441 11.0953 0.817057 11.8272 1.54825C11.8273 1.54833 11.8274 1.5484 11.8274 1.54847L18.9487 8.66978Z"
                                stroke={isActive('/') ? '#007e2f' : '#939393'}
                                fill={isActive('/') ? '#007e2f' : ''}
                                strokeWidth="2"
                            />
                        </svg>

                        <p
                            className={`${
                                isActive('/') ? 'text-green' : ''
                            } font-bold tracking-wide text-gray`}
                        >
                            Home
                        </p>
                    </Link>
                    <Link
                        href="/community"
                        className={`flex flex-col justify-center items-center gap-[0.1rem] ${
                            isActive('/community') ? 'text-green' : 'opacity-50'
                        }`}
                    >
                        <svg
                            width="27"
                            height="22"
                            viewBox="0 0 27 22"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                d="M25.1654 1H1V18.1429H10.062L13.0827 21L16.1034 18.1429H25.1654V1Z"
                                stroke={
                                    isActive('/community')
                                        ? '#007e2f'
                                        : '#939393'
                                }
                                fill={isActive('/community') ? '#007e2f' : ''}
                                strokeWidth={2}
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />
                        </svg>

                        <p
                            className={`${
                                isActive('/community') ? 'text-green' : ''
                            } font-bold tracking-wide text-gray`}
                        >
                            Community
                        </p>
                    </Link>
                    <Link
                        href="/shop"
                        className={`flex flex-col justify-center items-center gap-[0.1rem] ${
                            isActive('/shop') ? 'text-green' : 'opacity-50'
                        }`}
                    >
                        <svg
                            width="22"
                            height="22"
                            viewBox="0 0 22 22"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                d="M8.27269 21.0001C8.77477 21.0001 9.18178 20.5737 9.18178 20.0477C9.18178 19.5217 8.77477 19.0953 8.27269 19.0953C7.77062 19.0953 7.3636 19.5217 7.3636 20.0477C7.3636 20.5737 7.77062 21.0001 8.27269 21.0001Z"
                                stroke={
                                    isActive('/shop') ? '#007e2f' : '#939393'
                                }
                                fill={isActive('/shop') ? '#007e2f' : ''}
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />
                            <path
                                d="M18.2727 21.0001C18.7748 21.0001 19.1818 20.5737 19.1818 20.0477C19.1818 19.5217 18.7748 19.0953 18.2727 19.0953C17.7706 19.0953 17.3636 19.5217 17.3636 20.0477C17.3636 20.5737 17.7706 21.0001 18.2727 21.0001Z"
                                fill={isActive('/shop') ? '#007e2f' : ''}
                                stroke={
                                    isActive('/shop') ? '#007e2f' : '#939393'
                                }
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />
                            <path
                                d="M1 1H4.63636L7.07273 13.7524C7.15586 14.1909 7.38355 14.5847 7.71595 14.865C8.04835 15.1454 8.46427 15.2943 8.89091 15.2857H17.7273C18.1539 15.2943 18.5698 15.1454 18.9022 14.865C19.2346 14.5847 19.4623 14.1909 19.5455 13.7524L21 5.76191H5.54545"
                                strokeWidth="2"
                                stroke={
                                    isActive('/shop') ? '#007e2f' : '#939393'
                                }
                                fill={isActive('/shop') ? '#007e2f' : ''}
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />
                        </svg>

                        <p
                            className={`${
                                isActive('/shop') ? 'text-green' : ''
                            } font-bold tracking-wide text-gray`}
                        >
                            Shop
                        </p>
                    </Link>
                    <Link
                        href="/profile"
                        className={`flex flex-col justify-center items-center gap-[0.1rem] ${
                            isActive('/profile') ? 'text-green' : 'opacity-50'
                        }`}
                    >
                        <svg
                            width="20"
                            height="22"
                            viewBox="0 0 20 22"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                d="M19 21V18.7778C19 17.5991 18.5259 16.4686 17.682 15.6351C16.8381 14.8016 15.6935 14.3334 14.5 14.3334H5.5C4.30653 14.3334 3.16193 14.8016 2.31802 15.6351C1.47411 16.4686 1 17.5991 1 18.7778V21"
                                strokeWidth={isActive('/profile') ? '0' : '2'}
                                stroke={
                                    isActive('/profile') ? '#007e2f' : '#939393'
                                }
                                fill={isActive('/profile') ? '#007e2f' : ''}
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />
                            <path
                                d="M10.0001 9.88884C12.4853 9.88884 14.5001 7.89901 14.5001 5.44442C14.5001 2.98984 12.4853 1 10.0001 1C7.51478 1 5.50006 2.98984 5.50006 5.44442C5.50006 7.89901 7.51478 9.88884 10.0001 9.88884Z"
                                strokeWidth={isActive('/profile') ? '0' : '2'}
                                stroke={
                                    isActive('/profile') ? '#007e2f' : '#939393'
                                }
                                fill={isActive('/profile') ? '#007e2f' : ''}
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />
                        </svg>

                        <p
                            className={`${
                                isActive('/profile') ? 'text-green' : ''
                            } font-bold tracking-wide text-gray`}
                        >
                            Profile
                        </p>
                    </Link>
                </div>
            </nav>
        </div>
    )
}

export default Navbar
