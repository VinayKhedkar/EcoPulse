"use client";
import { usePathname, useRouter } from "next/navigation";
import { FaArrowLeft } from "react-icons/fa6";
import { IoIosNotificationsOutline, IoMdSearch } from "react-icons/io";

const Header = () => {
  const path = usePathname();
  const location = path.split("/")[1];
  const router = useRouter();

  const formatPath = (path) => {
    if (path === "") return "Home";

    return path;
  };

  return (
    <div className="w-full h-fit flex relative z-10 justify-center items-center bg-white shadow-sm">
      <div className="max-container flex flex-col gap-[1rem] bg-primary py-[1rem]">
        <div className="flex justify-between items-center py-[1rem]">
          <h1 className="text-green capitalize">{formatPath(location)}</h1>
          {location !== "/profile" && (
            <div className="flex items-center bg-green-200 p-[1rem] rounded-full">
              <IoIosNotificationsOutline
                strokeWidth={5}
                size={20}
                alt="hero"
                className="text-green"
              />
            </div>
          )}
        </div>
        {location !== "/profile" && (
          <div className="flex justify-between items-center gap-[1rem] w-full p-[1rem] border-[2px] border-gray rounded-full">
            <IoMdSearch className="w-[2rem] h-[2rem]" />
            <input
              type="text"
              placeholder="Search..."
              className="flex-1 w-full text-[1.5rem]"
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default Header;
