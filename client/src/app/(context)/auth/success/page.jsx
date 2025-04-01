"use client";
import { useAuth } from "@/context/AuthContext";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useEffect } from "react";
import toast from "react-hot-toast";

export default function Page() {
  const params = useSearchParams();
  const jwt = params.get("success");
  const { setUser } = useAuth();
  const router = useRouter();

  useEffect(() => {
    const getUser = async () => {
      try {
        if (jwt) {
          const response = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/api/user/me`,
            {
              method: "GET",
              headers: {
                Authorization: `Bearer ${jwt}`,
              },
            }
          );
          const data = await response.json();

          if (response.ok) {
            localStorage.setItem("jwt", jwt);
            setUser(data.data);
            router.replace("/");
          } else {
            toast.error(data.message, {
              className: "toast-error",
            });
            router.replace("/auth/login");
          }
        } else {
          toast.error("Authentication failed! Please Try again", {
            className: "toast-error",
          });
          router.replace("/auth/login");
        }
      } catch (error) {
        toast.error(error.message, {
          className: "toast-error",
        });
        router.replace("/auth/login");
      }
    };
    getUser();
  }, []);

  return <div></div>;
}
