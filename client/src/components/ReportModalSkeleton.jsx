import React from "react";

export default function ReportModalSkeleton() {
  return (
    <div className="w-full h-[30rem] flex justify-center items-center">
      <div className="w-20 h-20 border-4 border-transparent text-green-400 text-4xl animate-spin flex items-center justify-center border-t-green rounded-full">
        <div className="w-16 h-16 border-4 border-transparent text-amber-400 text-2xl animate-spin flex items-center justify-center border-t-red rounded-full" />
      </div>
    </div>
  );
}
