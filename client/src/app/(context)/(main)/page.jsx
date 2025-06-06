'use client'
import dynamic from 'next/dynamic'
import {
    Arrow,
    Article,
    Background,
    Farmer,
    Img1,
    Img3,
    Medicine,
    ReportSVG,
    Soil,
    TakePic,
} from '@/assets'
import { FaMicrochip } from 'react-icons/fa6'
import Image from 'next/image'
import React, { useEffect, useRef, useState } from 'react'
import { FiSun } from 'react-icons/fi'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Autoplay } from 'swiper/modules'
import 'swiper/css'
import { ArticleCard, WiFiConnect } from '@/components'
import { CiWifiOn } from 'react-icons/ci'
import toast from 'react-hot-toast'

const Camera = dynamic(() => import('@/components/Camera'), { ssr: false })
const ReportModal = dynamic(() => import('@/components/ReportModal'), {
    ssr: false,
})

export default function Page() {
    const [cameraOpen, setCameraOpen] = useState(false)
    const [wifiOpen, setWifiOpen] = useState(false)
    const [reportModal, setReportModal] = useState(false)
    const [articles, setArticles] = useState([])
    const [loading, setLoading] = useState(true)
    const swiperRef = useRef(null)

    const handleSlideClick = () => {
        if (swiperRef.current && swiperRef.current.swiper) {
            swiperRef.current.swiper.autoplay.stop()
            setTimeout(() => {
                swiperRef.current.swiper.autoplay.start()
            }, 10000)
        }
    }

    useEffect(() => {
        const fetchArticles = async () => {
            try {
                const response = await fetch(
                    `${process.env.NEXT_PUBLIC_API_URL}/api/articles?page=1`
                )
                const data = await response.json()

                if (!response.ok) {
                    throw new Error(data.message)
                }

                if (data.data.length !== 0) {
                    const updatedArticles = data.data.map((article) => ({
                        ...article,
                        image: article.image || Article,
                    }))

                    setArticles(updatedArticles)
                }

                setLoading(false)
            } catch (error) {
                toast.error(error.message, {
                    className: 'toast-error',
                })
            }
        }

        fetchArticles()
        console.log(articles)
    }, [])

    const handleCameraOpen = () => {
        setCameraOpen(true)
    }
    const handleWifiConnectOpen = () => {
        setWifiOpen(true)
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
            <div className=" flex flex-col gap-[2rem] py-[1rem]">
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
                                <CiWifiOn
                                    strokeWidth={1}
                                    className="w-[3rem] h-[3rem]"
                                />
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
                                    fill="rgb(0, 178, 255)"
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
                        onClick={handleWifiConnectOpen}
                        className="w-5/6 mx-auto text-center bg-[#00B2FF] py-[0.5rem] rounded-full"
                    >
                        <h2>Connect to sensor </h2>
                    </button>
                </div>
                <div className="flex flex-col gap-[1rem] w-full">
                    <h2>Latest articles on agriculture</h2>
                    <Swiper
                        ref={swiperRef}
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
                        {loading
                            ? [...Array(5)].map((_, index) => (
                                  <SwiperSlide
                                      key={index}
                                      className="w-full max-w-[400px] p-[1rem]"
                                  >
                                      <LoadingCard />
                                  </SwiperSlide>
                              ))
                            : articles.map((article, index) => (
                                  <SwiperSlide
                                      onClick={handleSlideClick}
                                      key={index}
                                      className="w-full max-w-[400px]"
                                  >
                                      <ArticleCard
                                          title={article.title}
                                          image={
                                              article.image === null
                                                  ? Article
                                                  : article.image
                                          }
                                          url={article.link}
                                          description={article.description}
                                      />
                                  </SwiperSlide>
                              ))}
                    </Swiper>
                </div>
            </div>
            {cameraOpen && (
                <Camera
                    setCameraOpen={setCameraOpen}
                    setReportModal={setReportModal}
                />
            )}
            {wifiOpen && <WiFiConnect setWiFiOpen={setWifiOpen} />}
            {reportModal && <ReportModal setReportModal={setReportModal} />}
        </>
    )
}

const LoadingCard = () => {
    return <div className="w-full h-[30rem] animate-skeleton rounded-xl"></div>
}
