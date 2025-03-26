'use client'
import dynamic from 'next/dynamic'
import {
    Arrow,
    Article,
    Background,
    Farmer,
    Img1,
    Img2,
    Img3,
    Medicine,
    Notification,
    ReportSVG,
    Soil,
    TakePic,
} from '@/assets'
import { IoMdSearch } from 'react-icons/io'
import { MdOutlineBluetoothSearching } from 'react-icons/md'
import { FaMicrochip } from 'react-icons/fa6'
import Image from 'next/image'
import React, { useState, useEffect } from 'react'
import { FiSun } from 'react-icons/fi'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Autoplay } from 'swiper/modules'
import 'swiper/css'
import Link from 'next/link'
import { ArticleCard } from '@/components'

const Camera = dynamic(() => import('@/components/Camera'), { ssr: false })

export default function Page() {
    const articlesInfo = [
        {
            title: '6 Innovative Agriculture Technology in 2023',
            description:
                'Agriculture technology is constantly evolving, and it’s important for farmers to stay up-to-date on the latest advancements. Here are six innovative agriculture technologies that are expected to make a big impact in 2023.',
            image: Img1,
            url: 'https://medium.com/%40DiggerInsights/6-innovative-agriculture-technology-in-2023-e188a02b1fc3',
        },
        {
            title: 'Regenerative Agriculture and Soil Carbon" by Deniz Dutton',
            description:
                'The author provides an overview of regenerative agriculture practices and their impact on soil carbon sequestration.',
            image: null,
            url: 'https://medium.com/%40deniz.dutton/the-good-the-bad-and-the-complicated-regenerative-agriculture-and-soil-carbon-d3fe62297a88',
        },
        {
            title: 'V Spehar of FoodFarmacy',
            description:
                ' How They Are Helping to Address the Problem of People Having Limited Access to Healthy & Affordable Food Options" by Martita Mestey',
            image: Img3,
            url: 'https://medium.com/authority-magazine/food-deserts-v-spehar-of-foodfarmacy-on-how-they-are-helping-to-address-the-problem-of-people-dd1465289c1f',
        },
    ]

    const [cameraOpen, setCameraOpen] = useState(false)
    const [bluetoothOpen, setBluetoothOpen] = useState(false)
    const [capturedImage, setCapturedImage] = useState(null)

    const handleCameraOpen = () => {
        setCameraOpen(true)
    }
    const handleBluetoothOpen = () => {
        setBluetoothOpen(true)
    }

    const getOrdinalSuffix = (day) => {
        if (day >= 11 && day <= 13) return `${day}th`
        const lastDigit = day % 10
        return `${day}${['th', 'st', 'nd', 'rd'][lastDigit] || 'th'}`
    }

    const options = { month: 'long' }
    const month = new Date().toLocaleDateString('en-IN', options)
    const day = new Date().getDate()
    const formattedDate = `${month} ${getOrdinalSuffix(day)}`

    return (
        <>
            <div className=" flex flex-col gap-[2rem] px-[1rem] py-[1rem]">
                <header className="flex flex-col justify-between items-center gap-[1rem]">
                    <div className="flex justify-between items-center w-full">
                        <h1 className="text-green font-extrabold font-">
                            Home
                        </h1>
                        <div className="flex items-center bg-green-200 p-[1rem] rounded-full">
                            <Image
                                src={Notification}
                                width={15}
                                height={15}
                                alt="hero"
                            />
                        </div>
                    </div>
                    <div className="flex justify-between items-center gap-[1rem] w-full p-[1rem] border-[2px] border-gray rounded-full">
                        <IoMdSearch className="w-[2rem] h-[2rem]" />
                        <input
                            type="text"
                            placeholder="Search..."
                            className="flex-1 w-full text-[1.5rem]"
                        />
                    </div>
                </header>
                <div className="flex gap-[1rem] py-[1rem] px-[2rem] border-[2px] border-gray rounded-[2.3rem] bg-[#FFF0D3] relative">
                    <div className="flex flex-col gap-[1rem]">
                        <h1 className="font-tertiary font-[500] tracking-wider">
                            Today, {formattedDate}
                        </h1>
                        <div className="flex items-center gap-[1rem]">
                            <div className="flex items-center justify-center gap-[1rem]">
                                <FiSun className="w-[2.5rem] h-[2.5rem] fill-yellow-300" />
                                <p className="text-[2rem] font-tertiary font-[500] tracking-wider">
                                    25&deg;C
                                </p>
                            </div>
                            <div className="h-3/4 w-[0.2rem] bg-black"></div>
                            <div>
                                <h2 className="font-tertiary font-[500] tracking-wider">
                                    Clear
                                </h2>
                            </div>
                        </div>
                    </div>
                    <Image
                        src={Farmer}
                        width={100}
                        height={100}
                        alt="farmer"
                        className="relative top-[1rem] left-[2rem] z-50"
                    />
                    <Image
                        src={Background}
                        width={200}
                        height={200}
                        alt="farmer"
                        className="absolute bottom-0 w-full left-0 z-10"
                    />
                </div>
                <div className="bg-[#5CDAD9] p-[1.5rem] rounded-xl flex flex-col gap-[1.5rem]">
                    <h2>Diagnose your crop</h2>
                    <div className="flex justify-center items-center gap-[1rem]">
                        <div className="flex flex-col gap-[1rem] items-center text-center">
                            <Image
                                src={TakePic}
                                width={50}
                                height={50}
                                alt="Picture icon"
                                className="w-[5rem] h-[5rem]"
                            />
                            <h3>Take a picture</h3>
                        </div>
                        <Image
                            src={Arrow}
                            width={50}
                            height={50}
                            alt="arrow icon"
                            className="w-[2.5rem] h-[2.5rem]"
                        />
                        <div className="flex flex-col gap-[1rem] items-center text-center">
                            <Image
                                src={ReportSVG}
                                width={50}
                                height={50}
                                alt=""
                                className="w-[5rem] h-[5rem]"
                            />
                            <h3>See diagnosis</h3>
                        </div>
                        <Image
                            src={Arrow}
                            width={50}
                            height={50}
                            alt="arrow icon"
                            className="w-[2.5rem] h-[2.5rem]"
                        />
                        <div className="flex flex-col gap-[1rem] items-center text-center">
                            <Image
                                src={Medicine}
                                width={28}
                                height={28}
                                alt=""
                                className="w-[5rem] h-[5rem]"
                            />
                            <h3>Get Medicine</h3>
                        </div>
                    </div>
                    <button
                        onClick={handleCameraOpen}
                        className="w-5/6 mx-auto text-center bg-[#00B2FF] py-[0.5rem] rounded-full"
                    >
                        <h2>Take a Photo</h2>
                    </button>
                </div>
                <div className="bg-green-400 p-[1.5rem] rounded-xl flex flex-col gap-[2.2rem]">
                    <h2>Diagnose plant stress</h2>
                    <div className="flex justify-center items-center gap-[1rem]">
                        <div className="flex flex-col gap-[1rem] items-center text-center">
                            <div className="flex items-center justify-center bg-blue-400 rounded-full p-[1rem]">
                                <MdOutlineBluetoothSearching className="w-[3rem] h-[3rem]" />
                            </div>
                            <h3>Connect to sensor</h3>
                        </div>
                        <Image
                            src={Arrow}
                            width={50}
                            height={50}
                            alt="arrow icon"
                            className="w-[2.5rem] h-[2.5rem]"
                        />
                        <div className="flex flex-col gap-[1rem] items-center text-center">
                            <div className="flex relative">
                                <Image
                                    src={Soil}
                                    width={55}
                                    height={55}
                                    alt="Soil"
                                />
                                <FaMicrochip
                                    fill="oklch(0.707 0.165 254.624)"
                                    strokeWidth={18}
                                    stroke="#000"
                                    className="w-[3.2rem] h-[3.2rem] absolute top-[60%] left-1/2 -translate-x-1/2 -translate-y-1/2"
                                />
                            </div>

                            <h3>Insert chip in the soil</h3>
                        </div>
                        <Image
                            src={Arrow}
                            width={50}
                            height={50}
                            alt="arrow icon"
                            className="w-[2.5rem] h-[2.5rem]"
                        />
                        <div className="flex flex-col gap-[1rem] items-center text-center">
                            <Image
                                src={ReportSVG}
                                width={50}
                                height={50}
                                alt=""
                                className="w-[5rem] h-[5rem]"
                            />
                            <h3>See diagnosis</h3>
                        </div>
                    </div>
                    <button
                        onClick={handleBluetoothOpen}
                        className="w-5/6 mx-auto text-center bg-[#00B2FF] py-[0.5rem] rounded-full"
                    >
                        <h2>Connect to sensor </h2>
                    </button>
                </div>
                <div className="flex flex-col gap-[1rem] w-full">
                    <h2>Latest articles on agriculture</h2>
                    <Swiper
                        spaceBetween={10}
                        slidesPerView={1}
                        modules={[Autoplay]}
                        autoplay={{
                            delay: 2500,
                            disableOnInteraction: false,
                        }}
                        speed={800}
                        className="w-full max-w-full h-[100%] overflow-hidden"
                    >
                        {articlesInfo.map((article, index) => (
                            <SwiperSlide
                                key={index}
                                className="w-auto max-w-[400px]"
                            >
                                <ArticleCard {...article} />
                            </SwiperSlide>
                        ))}
                    </Swiper>
                </div>
            </div>
            {cameraOpen && (
                <Camera
                    setCameraOpen={setCameraOpen}
                    setCapturedImage={setCapturedImage}
                />
            )}
        </>
    )
}
