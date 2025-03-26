import { Arrow, Article, Community1, Farming, Img1, Notification, Plantation } from '@/assets'
import { ArrowRightIcon } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
import { IoMdSearch } from 'react-icons/io'
import { MdKeyboardDoubleArrowRight } from 'react-icons/md'

export default function page() {
    return (
        <div className="h-full flex flex-col gap-[2rem] px-[1rem] py-[1rem]">
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
                <div className="flex justify-between items-center gap-[0.5rem] w-full p-[1rem] border-[2px] border-gray rounded-full">
                    <IoMdSearch className="w-[2rem] h-[2rem]" />
                    <input
                        type="text"
                        placeholder="Search for latest articles, posts, products..."
                        className="flex-1 w-full text-[1.5rem]"
                    />
                </div>
            </header>
            <div className="flex flex-col">
                <div className="w-full p-[1rem] h-full">
                    <Link href='/social/articles' className="flex flex-col rounded-xl bg-[#d0ffd4]">
                        <Image
                            src={Farming}
                            alt="Farm"
                            className="w-full aspect-[16/7] rounded-t-xl"
                        />
                        <div className="w-full flex justify-between items-center gap-[1rem] p-[1rem] rounded-full">
                            <h3 className="font-bold text-[#2E7D32] text-[1.4rem] font-secondary">
                                Read Articles
                            </h3>
                            <MdKeyboardDoubleArrowRight
                                className="text-[#2E7D32]"
                                size={24}
                            />
                        </div>
                    </Link>
                </div>
                <div className="w-full p-[1rem] h-full">
                    <Link href='/social/community' className="flex flex-col rounded-xl bg-[#FFF8E1]">
                        <Image
                            src={Community1}
                            alt="Community"
                            className="w-full aspect-[16/7] rounded-t-xl"
                        />
                        <div className="w-full flex justify-between items-center gap-[1rem] p-[1rem] rounded-full">
                            <h3 className="font-bold text-[#D84315] text-[1.4rem] font-secondary">
                                View Community
                            </h3>
                            <MdKeyboardDoubleArrowRight
                                className="text-[#D84315]"
                                size={24}
                            />
                        </div>
                    </Link>
                </div>
                <div className="w-full p-[1rem] h-full">
                    <Link href='/social/posts' className="flex flex-col rounded-xl bg-[#E3F2FD]">
                        <Image
                            src={Plantation}
                            alt="Plantation"
                            className="w-full aspect-[16/7] rounded-t-xl"
                        />
                        <div className="w-full flex justify-between items-center gap-[1rem] p-[1rem] rounded-full">
                            <h3 className="font-bold text-[#1565C0] text-[1.4rem] font-secondary">
                                Post about your Plantation
                            </h3>
                            <MdKeyboardDoubleArrowRight
                                className="text-[#1565C0]"
                                size={24}
                            />
                        </div>
                    </Link>
                </div>
            </div>
        </div>
    )
}
