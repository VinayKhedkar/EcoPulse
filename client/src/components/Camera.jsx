"use client";
import React, { useRef, useState } from "react";
import Webcam from "react-webcam";
import { RxCross2 } from "react-icons/rx";
import { GrGallery } from "react-icons/gr";
import { RiCameraSwitchLine } from "react-icons/ri";
import toast from "react-hot-toast";
import Image from "next/image";
import { FaCheck } from "react-icons/fa";
import { useRouter } from "next/navigation";
import { useCamera } from "@/context/camera.context";

export default function Camera({ setCameraOpen }) {
  const webcamRef = useRef(null);
  const fileInputRef = useRef(null);
  const { image, setImage } = useCamera();
  const [facingMode, setFacingMode] = useState("environment");
  const router = useRouter();

  const capture = () => {
    const imageSrc = webcamRef.current.getScreenshot();
    setImage(imageSrc);
    console.log(imageSrc);
    toast.success("Image captured successfully!", {
      className: "toast-success",
    });
  };

  const handleReject = () => {
    setImage(null);
  };

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setImage(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const triggerFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <div className="fixed bg-[rgba(0,0,0,0.5)] backdrop-blur-[5px] inset-0 flex flex-col gap-[3rem] items-center z-50 w-full max-container">
      <div className="w-full flex justify-end p-[1rem] text-white z-10">
        <button
          className="bg-[#0000004e] backdrop-blur-[5px] p-2 rounded-full"
          onClick={() => {
            setCameraOpen(false);
            setImage(null);
          }}
        >
          <RxCross2 size={30} />
        </button>
      </div>

      <div className="absolute inset-0">
        {!image ? (
          <Webcam
            ref={webcamRef}
            screenshotFormat="image/png"
            videoConstraints={{ facingMode }}
            className="h-full w-full object-cover"
          />
        ) : (
          <Image
            src={image}
            alt="Captured Image"
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
            onClick={() => router.push("/crop-disease")}
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
            <button className="text-white" onClick={triggerFileInput}>
              <GrGallery size={30} />
            </button>
          </div>

          <div className="p-[1rem] border-[2px] border-white rounded-full flex justify-center items-center">
            <button
              onClick={capture}
              className="w-[5rem] h-[5rem] bg-white rounded-full shadow-md"
            ></button>
          </div>

          <button
            className="text-white"
            onClick={() =>
              setFacingMode(facingMode === "user" ? "environment" : "user")
            }
          >
            <RiCameraSwitchLine size={35} />
          </button>
        </div>
      )}
    </div>
  );
}
