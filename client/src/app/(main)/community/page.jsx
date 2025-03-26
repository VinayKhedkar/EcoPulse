import { Notification } from '@/assets'
import Image from 'next/image'
import React from 'react'
import { ImPencil } from 'react-icons/im'

export default function page() {
    return (
        <div className="relative h-full flex flex-col gap-[2rem] px-[1rem] py-[1rem]">
            <header className="flex flex-col justify-between items-center gap-[1rem]">
                <div className="flex justify-between items-center w-full">
                    <h1 className="text-green font-extrabold font-">
                        Community
                    </h1>
                    <div className="flex items-center bg-green-200 p-[1rem] rounded-full">
                        <Image
                            src={Notification}
                            width={15}
                            height={15}
                            alt="notification icon"
                        />
                    </div>
                </div>
            </header>
            <div className="flex justify-center items-center gap-[1rem] absolute bottom-[1rem] right-[0.5rem] bg-blue-600 p-[1rem] rounded-full">
                <ImPencil className="text-white" size={15} />
                <h3 className="text-white font-bold">Ask Community</h3>
            </div>
        </div>
    )
}
