import { Article } from '@/assets'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
import { LuReply } from 'react-icons/lu'
import { CiBookmark } from 'react-icons/ci'

export default function CommunityCard({ image, title, description, url }) {
    return (
        <div className="w-full h-full flex justify-center items-center p-[1rem] rounded-xl">
            <div className="relative flex flex-col gap-[1rem] flex-1 bg-white shadow-[0_0_5px_rgba(0,0,0,0.2)] rounded-xl">
                <div className="relative w-full aspect-[16/9] rounded-t-xl overflow-hidden">
                    <Image
                        src={image || Article}
                        alt={title}
                        fill
                        className="object-cover"
                    />
                </div>
                <div className="p-[1rem] flex flex-col gap-[1rem]">
                    <h3 className="font-[900] font-secondary">{title}</h3>
                    <p>{description}</p>
                </div>
                <div className="p-[1rem] flex justify-between items-center w-full">
                    <div className='flex justify-center gap-[0.5rem] items-center bg-gray-200 p-[0.5rem] rounded-xl'>
                        <LuReply className="text-gray-400" size={18} />
                        <h3 className='text-gray-400 text-[1.3rem]'>Reply</h3>
                    </div>
                    <CiBookmark
                        className="text-gray-400"
                        strokeWidth={1}
                        size={23}
                    />
                </div>
            </div>
        </div>
    )
}
