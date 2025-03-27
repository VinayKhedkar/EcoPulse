'use client'
import React, { useEffect, useRef, useState } from 'react'
import { RxCross2 } from 'react-icons/rx'
import { GrGallery } from 'react-icons/gr'
import { RiCameraSwitchLine } from 'react-icons/ri'
import toast from 'react-hot-toast'
import Image from 'next/image'
import { FaCheck } from 'react-icons/fa'
import { useRouter } from 'next/navigation'
import { CameraLoader } from '.'
import { useCamera } from '@/context/camera.context'

export default function Camera({ setCameraOpen, setCapturedImage }) {
    const videoRef = useRef(null)
    const fileInputRef = useRef(null)
    const [facingMode, setFacingMode] = useState('environment')
    const { image, setImage } = useCamera()
    const [loading, setLoading] = useState(false)
    const router = useRouter()

    useEffect(() => {
        startCamera(facingMode)

        return () => stopCamera()
    }, [facingMode])

    const startCamera = async (mode) => {
        try {
            setLoading(true)
            stopCamera()
            const stream = await navigator.mediaDevices.getUserMedia({
                video: { facingMode: mode },
            })
            if (videoRef.current) {
                videoRef.current.srcObject = stream
            }
            setLoading(false)
        } catch (error) {
            toast.error('Failed to start camera', { className: 'toast-error' })
            setCameraOpen(false)
            setLoading(false)
        }
    }

    const stopCamera = () => {
        if (videoRef.current?.srcObject) {
            videoRef.current.srcObject
                .getTracks()
                .forEach((track) => track.stop())
            videoRef.current.srcObject = null
        }
    }

    const takePhoto = async () => {
        if (!videoRef.current) return
        const canvas = document.createElement('canvas')
        const context = canvas.getContext('2d')
        canvas.width = videoRef.current.videoWidth
        canvas.height = videoRef.current.videoHeight
        context.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height)
        const imageData = canvas.toDataURL('image/png')
        setImage(imageData)
        setCapturedImage(imageData)
        stopCamera()
    }

    const handleFileUpload = (event) => {
        const file = event.target.files[0]
        if (file) {
            const reader = new FileReader()
            reader.onload = (e) => {
                setImage(e.target.result)
                setCapturedImage(e.target.result)
                stopCamera()
            }
            reader.readAsDataURL(file)
        }
    }

    const handleReject = () => {
        setImage(null)
        stopCamera()
        startCamera(facingMode)
    }

    const triggerFileInput = () => {
        if (fileInputRef.current) {
            fileInputRef.current.click()
        }
    }

    return (
        <div className="fixed bg-[rgba(0,0,0,0.5)] backdrop-blur-[5px] inset-0 flex flex-col gap-[3rem] items-center z-50 w-full max-container">
            <div className="w-full flex justify-between p-4 text-white z-10">
                <button
                    className="bg-[#0000004e] backdrop-blur-[4px] p-2 rounded-full"
                    onClick={() => {
                        setCameraOpen(false)
                        stopCamera()
                        setImage(null)
                    }}
                >
                    <RxCross2 size={25} />
                </button>
            </div>

            <div className="absolute inset-0">
                {loading ? (
                    <CameraLoader />
                ) : !image ? (
                    <video
                        ref={videoRef}
                        autoPlay
                        playsInline
                        className="h-full w-full object-cover"
                    ></video>
                ) : (
                    <Image
                        src={image}
                        alt="Captured crop image"
                        width={500}
                        height={500}
                        className="h-full object-cover"
                    />
                )}
            </div>

            {image ? (
                <div className="absolute bottom-0 w-full flex justify-center gap-[10rem] p-[2rem] z-10 bg-[#0000004e] backdrop-blur-[1px]">
                    <button
                        className="text-[#D84315] bg-[#FFF8E1] p-[1.5rem] rounded-full"
                        onClick={handleReject}
                    >
                        <RxCross2 strokeWidth={1.5} size={35} />
                    </button>
                    <button
                        className="text-[#2E7D32] bg-[#d0ffd4] p-[1.5rem] rounded-full"
                        onClick={() => {
                            router.push('/crop-disease')
                            toast.success('Image captured successfully!', {
                                className: 'toast-success',
                            })
                        }}
                    >
                        <FaCheck size={35} />
                    </button>
                </div>
            ) : (
                <div className="absolute bottom-0 w-full flex justify-evenly gap-[2rem] p-[2rem] z-10 bg-[#0000004e] backdrop-blur-[1px]">
                    <div className="flex items-center">
                        <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={handleFileUpload}
                        />
                        <button 
                            className="text-white"
                            onClick={triggerFileInput}
                        >
                            <GrGallery size={30} />
                        </button>
                    </div>

                    <div className="p-[1rem] border-[2px] border-white rounded-full flex justify-center items-center">
                        <button
                            onClick={takePhoto}
                            className="w-[5rem] h-[5rem] bg-white rounded-full shadow-md"
                        ></button>
                    </div>

                    <button
                        className="text-white"
                        onClick={() =>
                            setFacingMode(
                                facingMode === 'user' ? 'environment' : 'user'
                            )
                        }
                    >
                        <RiCameraSwitchLine size={35} />
                    </button>
                </div>
            )}
        </div>
    )
}