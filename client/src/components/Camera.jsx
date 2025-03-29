"use client";
import React, { useEffect, useRef, useState } from "react";
import Webcam from "react-webcam";
import { RxCross2 } from "react-icons/rx";
import { GrGallery } from "react-icons/gr";
import { RiCameraSwitchLine } from "react-icons/ri";
import { FaCheck } from "react-icons/fa";
import Image from "next/image";
import { useCamera } from "@/context/camera.context";
import { Base64Image, ReportModal } from ".";

const CameraLoader = () => (
  <div className="flex justify-center items-center h-full w-full">
    <div className="w-16 h-16 border-4 border-gray-300 border-t-blue-500 rounded-full animate-spin"></div>
  </div>
);

export default function Camera({ setCameraOpen, setReportModal }) {
  const webcamRef = useRef(null);
  const fileInputRef = useRef(null);
  const { image, setImage } = useCamera();
  const [facingMode, setFacingMode] = useState("environment");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (image) {
      setImage(null);
    }
  }, []);

  const capture = () => {
    const imageSrc = webcamRef.current.getScreenshot();
    setImage(imageSrc);
  };

  const handleReject = () => {
    setLoading(true);
    setImage(null);
  };

  const handleFileUpload = (event) => {
    const file = event.target.files[0];

    if (!file) return;

    console.log(file.type);

    if (!file.type.startsWith("image/")) {
      toast.error("Only image files are allowed!", {
        className: "toast-error",
      });
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const base64String = e.target.result;

      if (!base64String.startsWith("data:image")) {
        toast.error("Invalid image format!", { className: "toast-error" });
        return;
      }

      setImage(base64String);
    };

    reader.readAsDataURL(file);
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
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
        {loading && <CameraLoader />}
        {!image ? (
          <Webcam
            ref={webcamRef}
            videoConstraints={{ facingMode }}
            className="h-full w-full object-cover"
            onUserMedia={() => setLoading(false)}
          />
        ) : (
          <Base64Image
            base64={image}
            width={500}
            height={500}
            alt="Crop photo"
            classname={"w-full h-full object-cover"}
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
              setReportModal(true);
              setCameraOpen(false);
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
