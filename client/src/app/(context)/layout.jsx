import { AuthProvider } from "@/context/AuthContext";
import React from "react";
import { Toaster } from "react-hot-toast";

export default function layout({ children }) {
  return (
    <>
      <Toaster
        position="top-center"
        reverseOrder={false}
        toastOptions={{
          success: {
            iconTheme: {
              secondary: "#fff",
            },
          },
          error: {
            iconTheme: {
              secondary: "#fff",
            },
          },
          style: {
            padding: "1rem",
            borderRadius: "0.8rem",
            fontSize: "1.4rem",
          },
        }}
      />
      {children}
    </>
  );
}
