"use client";
import { usePathname, useRouter } from "next/navigation";
import { FaArrowLeft } from "react-icons/fa6";
import { IoIosNotificationsOutline, IoMdSearch } from "react-icons/io";

const Header = () => {
  const location = usePathname();
  const router = useRouter();

  const formatPath = (path) => {
    if (path === "/") return "Home";

    return path.charAt(1).toUpperCase() + path.slice(2);
  };

  return (
    <div className="max-container flex flex-col gap-[1rem] z-10 bg-primary">
      <div className="flex justify-between items-center py-[1rem]">
        <div className="flex justify-center items-center gap-[1rem]">
          {location !== "/" && (
            <button
              onClick={() => router.back()}
              className="flex items-center bg-green-200 p-[0.8rem] rounded-full"
            >
              <FaArrowLeft strokeWidth={0.5} className="text-green" size={18} />
            </button>
          )}
          <h1 className="text-green">{formatPath(location)}</h1>
        </div>
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
  );
};

export default Header;
