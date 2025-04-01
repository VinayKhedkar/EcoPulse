import React from "react";

export default function Loader() {
  return (
    <div className="w-full h-svh flex justify-center items-center relative bg-transparent z-[10000]">
      <div className="w-20 h-20 border-4 border-transparent text-green-300 text-4xl animate-spin flex items-center justify-center border-t-green rounded-full">
        <div className="w-16 h-16 border-4 border-transparent text-amber-300 text-2xl animate-spin flex items-center justify-center border-t-red rounded-full" />
      </div>
    </div>
  );
}
