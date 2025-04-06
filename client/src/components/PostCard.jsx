'use client'
import { Plantation } from '@/assets'
import Image from 'next/image'
import { useState } from 'react'
import { AiFillHeart } from 'react-icons/ai'
import { CiBookmark } from 'react-icons/ci'
import { FaRegComment } from 'react-icons/fa6'
import { FiHeart, FiSend } from 'react-icons/fi'
import { BsBookmarkFill } from 'react-icons/bs'

function PostCard({ img, title, description }) {
    const [liked, setLiked] = useState(false)
    const [isBookmarked, setIsBookmarked] = useState(false)

    const handleLike = () => {
        setLiked((prev) => !prev)
    }

    const handleBookmark = () => {
        setIsBookmarked((prev) => !prev)
    }

    return (
        <div className="w-full h-full flex justify-center p-[0.2rem] items-center rounded-xl">
            <div className="relative flex flex-col gap-[1rem] flex-1 bg-white shadow-[0_0_5px_rgba(0,0,0,0.2)] rounded-xl">
                <Image
                    src={img || Plantation}
                    width={50}
                    height={50}
                    alt={title}
                    className="w-full aspect-[16/7] rounded-t-xl"
                />
                <div className="px-[1rem] pb-[1rem] flex flex-col gap-[1rem]">
                    <h3 className="font-[900] font-secondary">{title}</h3>
                    <p>{description}</p>
                </div>
                <div className="flex justify-between items-center px-[1rem] py-[1rem] rounded-b-xl">
                    <div className="flex justify-center gap-[1rem] items-center">
                        {liked ? (
                            <AiFillHeart
                                onClick={handleLike}
                                className="text-red-500"
                                size={23}
                            />
                        ) : (
                            <FiHeart
                                onClick={handleLike}
                                className="text-gray-400"
                                size={23}
                            />
                        )}
                        <FaRegComment
                            className="text-gray-400 scale-x-[-1]"
                            strokeWidth={1}
                            size={23}
                        />
                        <FiSend className="text-gray-400" size={23} />
                    </div>
                    {isBookmarked ? (
                        <BsBookmarkFill
                            onClick={handleBookmark}
                            className="text-blue-500"
                            size={23}
                        />
                    ) : (
                        <CiBookmark
                            onClick={handleBookmark}
                            className="text-gray-400"
                            size={23}
                        />
                    )}
                </div>
            </div>
        </div>
    )
}

export default PostCard
