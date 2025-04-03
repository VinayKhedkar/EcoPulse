import { Article } from '@/assets'
import Image from 'next/image'
import Link from 'next/link'

const ArticleCard = ({ title, description, image, url }) => {
    return (
        <div className="w-full h-full flex justify-center items-center p-[1rem] rounded-xl">
            <div className="relative flex flex-col gap-[1rem] flex-1 bg-white shadow-[0_0_5px_rgba(0,0,0,0.2)] rounded-xl">
                <img
                    src={image || Article}
                    // width={50}
                    // height='auto'
                    // unoptimized
                    alt={title}
                    className="w-full aspect-[16/9] rounded-t-xl"
                />
                <div className="px-[1rem] flex flex-col gap-[1rem]">
                    <h3 className="font-[900] font-secondary">{title}</h3>
                    <p>{description}</p>
                </div>
                <div className="w-full flex justify-end items-center p-[1rem]">
                    <Link
                        href={url}
                        className=" bg-gray-100 rounded-lg p-[0.5rem]"
                    >
                        Read more
                    </Link>
                </div>
            </div>
        </div>
    )
}

export default ArticleCard
