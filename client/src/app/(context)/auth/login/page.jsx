"use client";
import { Logo } from "@/assets";
import Image from "next/image";
import React, { useState } from "react";
import { FcGoogle } from "react-icons/fc";

export default function Page() {
  const [buttonClicked, setButtonClicked] = useState(false);

  const handleGoogleLogin = () => {
    setButtonClicked(true);
    window.open(
      `${process.env.NEXT_PUBLIC_API_URL}/oauth/login/google`,
      "_self"
    );
  };
  return (
    <div className="w-full h-svh flex items-center justify-center bg-white">
      <div className="flex flex-col items-center justify-center gap-[2rem] bg-primary shadow-lg rounded-xl p-[3rem]">
        <div className="flex justify-center items-center gap-[2rem] p-[rem] h-fit">
          <Image
            src={Logo}
            alt="Logo"
            width={200}
            height={1000}
            className="w-[15rem] h-[15rem]"
          />
          <div className="h-[10rem] w-[3px] bg-gray-800"></div>
          <div>
            <h1 className=" font-bold text-left text-gray-500">
              Smart&nbsp;Farming,
              <br />
              Healthy&nbsp;Crops,
              <br />
              Brighter&nbsp;Future.
            </h1>
          </div>
        </div>
        <button
          className={`flex gap-[0.5rem] cursor-pointer items-center justify-center text-white h-[4.5rem] px-[1.5rem] rounded-lg bg-[#2f2f2f]  ${
            buttonClicked ? "opacity-50 " : "hover:bg-[#0e0202]"
          }`}
          onClick={handleGoogleLogin}
        >
          <FcGoogle size={25} />
          <h3>Sign&nbsp;in&nbsp;with&nbsp;Google</h3>
        </button>
      </div>
    </div>
  );
}
