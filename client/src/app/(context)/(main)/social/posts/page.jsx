import { Farming, Plantation } from '@/assets'
import { PostCard } from '@/components'
import React from 'react'
import { BsPlus } from 'react-icons/bs'
import { ImPencil } from 'react-icons/im'

export default function Page() {
    const postData = [
        {
            img: Plantation,
            title: 'The Secret Life of Earthworms',
            description:
                'How these tiny creatures boost soil health and improve crop yield.',
        },
        {
            img: Farming,
            title: 'Banana Trees: More Than Just Bananas',
            description:
                'Discover the surprising uses of banana trees beyond fruit production.',
        },
        {
            img: Plantation,
            title: 'Moonlight Farming: Does It Work?',
            description:
                'Exploring the ancient technique of nighttime planting for better growth.',
        },
        {
            img: Farming,
            title: 'AI in Agriculture: The Future is Now',
            description:
                'How artificial intelligence is revolutionizing modern farming practices.',
        },
        {
            img: Plantation,
            title: 'The Secret Life of Earthworms',
            description:
                'How these tiny creatures boost soil health and improve crop yield.',
        },
    ]
    return (
        <>
            <div className="h-full flex flex-col gap-[2rem] py-[1rem]">
                {postData.map((post, index) => (
                    <PostCard
                        key={index}
                        img={post.img}
                        title={post.title}
                        description={post.description}
                    />
                ))}
                <div className="flex justify-center items-center gap-[0.5rem] absolute bottom-[8.5rem] right-[2.5rem] bg-[#7bf1a8be] backdrop-blur-[6px] p-[1rem] rounded-full">
                    <BsPlus
                        className="text-green"
                        strokeWidth={1.5}
                        size={18}
                    />
                    <h3 className="text-green font-bold">Create Post</h3>
                </div>
            </div>
        </>
    )
}
