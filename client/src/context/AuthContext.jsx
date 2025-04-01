"use client";

import { Loader } from "@/components";
import { useRouter } from "next/navigation";
import { createContext, useContext, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { FaSheetPlastic } from "react-icons/fa6";

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const checkUserLoggedIn = async () => {
      const token = localStorage.getItem("jwt");
      try {
        if (token) {
          const response = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/api/user/me`,
            {
              method: "GET",
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
          const data = await response.json();
          if (response.ok) {
            setUser(data.data);
            router.replace("/");
          } else {
            toast.error(data.message, { className: "toast-error" });
            router.replace("/auth/login");
          }

          setLoading(false);
        } else {
          router.replace("/auth/login");
          setLoading(false);
        }
      } catch (error) {
        toast.error(error.message, { className: "toast-error" });
        router.replace("/auth/login");
        setLoading(false);
      }
    };
    checkUserLoggedIn();
  }, []);

  const logout = () => {
    setLoading(true);
    localStorage.removeItem("jwt");
    setUser(null);
    setLoading(false);
  };

  return (
    <AuthContext.Provider value={{ user, setUser, logout }}>
      {loading ? <Loader /> : children}
    </AuthContext.Provider>
  );
};

const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export { AuthProvider, useAuth };
