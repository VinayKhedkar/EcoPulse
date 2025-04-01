import {
  Arrow,
  Article,
  Community1,
  Farming,
  Img1,
  Notification,
  Plantation,
} from "@/assets";
import { ArrowRightIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { MdKeyboardDoubleArrowRight } from "react-icons/md";

export default function page() {
  return (
    <div className="h-full flex flex-col gap-[2rem] px-[1rem] py-[1rem]">
      <div className="flex flex-col">
        <div className="w-full p-[1rem] h-full">
          <Link
            href="/social/articles"
            className="flex flex-col rounded-xl bg-[#d0ffd4]"
          >
            <Image
              src={Farming}
              alt="Farm"
              className="w-full aspect-[16/7] rounded-t-xl"
            />
            <div className="w-full flex justify-between items-center gap-[1rem] p-[1rem] rounded-full">
              <h3 className="font-bold text-[#2E7D32] text-[1.4rem] font-secondary">
                Read Articles
              </h3>
              <MdKeyboardDoubleArrowRight
                className="text-[#2E7D32]"
                size={24}
              />
            </div>
          </Link>
        </div>
        <div className="w-full p-[1rem] h-full">
          <Link
            href="/social/community"
            className="flex flex-col rounded-xl bg-[#FFF8E1]"
          >
            <Image
              src={Community1}
              alt="Community"
              className="w-full aspect-[16/7] rounded-t-xl"
            />
            <div className="w-full flex justify-between items-center gap-[1rem] p-[1rem] rounded-full">
              <h3 className="font-bold text-[#D84315] text-[1.4rem] font-secondary">
                View Community
              </h3>
              <MdKeyboardDoubleArrowRight
                className="text-[#D84315]"
                size={24}
              />
            </div>
          </Link>
        </div>
        <div className="w-full p-[1rem] h-full">
          <Link
            href="/social/posts"
            className="flex flex-col rounded-xl bg-[#E3F2FD]"
          >
            <Image
              src={Plantation}
              alt="Plantation"
              className="w-full aspect-[16/7] rounded-t-xl"
            />
            <div className="w-full flex justify-between items-center gap-[1rem] p-[1rem] rounded-full">
              <h3 className="font-bold text-[#1565C0] text-[1.4rem] font-secondary">
                Post about your Plantation
              </h3>
              <MdKeyboardDoubleArrowRight
                className="text-[#1565C0]"
                size={24}
              />
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}
