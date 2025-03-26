'use client'
import React, { useEffect, useRef, useState } from 'react'
import { RxCross2 } from 'react-icons/rx'
import { GrGallery } from 'react-icons/gr'
import { RiCameraSwitchLine } from 'react-icons/ri'
import toast from 'react-hot-toast'

export default function Camera({ setCameraOpen, setCapturedImage }) {
    const videoRef = useRef(null)
    const [facingMode, setFacingMode] = useState('environment')
    const [image, setImage] = useState(null)

    useEffect(() => {
        startCamera(facingMode)

        return () => stopCamera()
    }, [facingMode])

    const startCamera = async (mode) => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({
                video: { facingMode: mode },
            })
            if (videoRef.current) {
                videoRef.current.srcObject = stream
            }
            toast.success('Camera started successfully', {
                className: 'toast-success',
            })
        } catch (error) {
            toast.error('Failed to start camera', { className: 'toast-error' })
            setCameraOpen(false)
        }
    }

    const stopCamera = () => {
        if (videoRef.current?.srcObject) {
            videoRef.current.srcObject
                .getTracks()
                .forEach((track) => track.stop())
        }
    }

    const takePhoto = () => {
        if (!videoRef.current) return
        const canvas = document.createElement('canvas')
        const context = canvas.getContext('2d')
        canvas.width = videoRef.current.videoWidth
        canvas.height = videoRef.current.videoHeight
        context.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height)
        const imageData = canvas.toDataURL('image/png')
        setImage(imageData)
        setCapturedImage(imageData)
    }

    const handleFileUpload = (event) => {
        const file = event.target.files[0]
        if (file) {
            const reader = new FileReader()
            reader.onload = (e) => {
                setImage(e.target.result)
                setCapturedImage(e.target.result)
            }
            reader.readAsDataURL(file)
        }
    }

    return (
        <div className="fixed inset-0 flex flex-col justify-between items-center z-50 w-full max-container">
            <div className="absolute top-0 right-0 w-full flex justify-between p-4 text-white z-10">
                <button
                    className="bg-[#0000004e] backdrop-blur-[1px] p-2 rounded-full"
                    onClick={() => setCameraOpen(false)}
                >
                    <RxCross2 size={25} />
                </button>
            </div>

            <div className="absolute inset-0">
                {!image ? (
                    <video
                        ref={videoRef}
                        autoPlay
                        playsInline
                        className="h-full w-full object-cover"
                    ></video>
                ) : (
                    <img
                        src={image}
                        alt="Captured"
                        className="h-full w-full object-cover"
                    />
                )}
            </div>

            <div className="absolute bottom-0 w-full flex justify-evenly gap-[2rem] p-[2rem] z-10 bg-[#0000004e] backdrop-blur-[1px]">
                <label className="flex items-center">
                    <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleFileUpload}
                    />
                    <button className="text-white">
                        <GrGallery size={30} />
                    </button>
                </label>

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
        </div>
    )
}
