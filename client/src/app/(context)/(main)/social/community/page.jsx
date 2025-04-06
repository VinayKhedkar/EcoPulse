import { Farming, Plantation } from '@/assets'
import { CommunityCard } from '@/components'
import React from 'react'
import { ImPencil } from 'react-icons/im'

export default function Page() {
    const communityData = [
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
        <div className="h-full flex flex-col gap-[2rem] py-[1rem]">
            {communityData.map((community, index) => (
                <CommunityCard
                    key={index}
                    image={community.img}
                    title={community.title}
                    description={community.description}
                />
            ))}
            <div className="flex justify-center items-center gap-[1rem] absolute bottom-[8.5rem] right-[2rem] bg-[#155efcbd] backdrop-blur-[6px] p-[1rem] rounded-full">
                <ImPencil className="text-white" size={15} />
                <h3 className="text-white font-bold">Ask Community</h3>
            </div>
        </div>
    )
}
