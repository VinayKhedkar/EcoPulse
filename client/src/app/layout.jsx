import { AuthProvider } from "@/context/AuthContext";
import "./globals.css";
import { CameraProvider } from "@/context/CameraContext";

export const metadata = {
  applicationName: "EcoPulse",
  title: "EcoPulse - AI-powered Farming Assistant",
  description:
    "AI-powered farming assistant for smallholder farmers, providing real-time insights on crop health, pest detection, and resource optimization.",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "EcoPulse",
    startupImage: [
      {
        url: "/images/splash-640x1136.png",
        media: "(device-width: 320px) and (device-height: 568px)",
      }, // iPhone SE (1st Gen), 5, 5S
      {
        url: "/images/splash-750x1334.png",
        media: "(device-width: 375px) and (device-height: 667px)",
      }, // iPhone 6, 6S, 7, 8, SE (2nd & 3rd Gen)
      {
        url: "/images/splash-1242x2208.png",
        media: "(device-width: 414px) and (device-height: 736px)",
      }, // iPhone 6 Plus, 7 Plus, 8 Plus

      // 📱 Modern iPhones (X, 11, 12, 13, 14, 15)
      {
        url: "/images/splash-1125x2436.png",
        media: "(device-width: 375px) and (device-height: 812px)",
      }, // iPhone X, Xs, 11 Pro, 12 Mini, 13 Mini
      {
        url: "/images/splash-828x1792.png",
        media:
          "(device-width: 414px) and (device-height: 896px) and (-webkit-device-pixel-ratio: 2)",
      }, // iPhone XR, 11
      {
        url: "/images/splash-1242x2688.png",
        media:
          "(device-width: 414px) and (device-height: 896px) and (-webkit-device-pixel-ratio: 3)",
      }, // iPhone Xs Max, 11 Pro Max
      {
        url: "/images/splash-1170x2532.png",
        media: "(device-width: 390px) and (device-height: 844px)",
      }, // iPhone 12, 12 Pro, 13, 13 Pro, 14, 14 Pro
      {
        url: "/images/splash-1284x2778.png",
        media: "(device-width: 428px) and (device-height: 926px)",
      }, // iPhone 12 Pro Max, 13 Pro Max, 14 Plus
      {
        url: "/images/splash-1290x2796.png",
        media: "(device-width: 430px) and (device-height: 932px)",
      }, // iPhone 14 Pro Max, iPhone 15 Pro Max

      {
        url: "/images/splash-1179x2556.png",
        media: "(device-width: 393px) and (device-height: 852px)",
      }, // iPhone 15, 15 Pro
      {
        url: "/images/splash-1290x2796.png",
        media: "(device-width: 430px) and (device-height: 932px)",
      }, // iPhone 15 Pro Max, 14 Pro Max
    ],
  },
  formatDetection: {
    telephone: false,
  },
  manifest: "/manifest.json",
  icons: {
    icon: "/images/favicon.ico",
    apple: [
      { url: "/images/logo-120x120.png", sizes: "120x120" },
      { url: "/images/logo-152x152.png", sizes: "152x152" },
      { url: "/images/logo-167x167.png", sizes: "167x167" },
      { url: "/images/logo-180x180.png", sizes: "180x180" },
      { url: "/images/logo-192x192.png", sizes: "192x192" },
      { url: "/images/logo-256x256.png", sizes: "256x256" },
      { url: "/images/logo-384x384.png", sizes: "384x384" },
      { url: "/images/logo-512x512.png", sizes: "512x512" },
      { url: "/images/logo-1024x1024.png", sizes: "1024x1024" },
    ],
    shortcut: "/images/favicon.ico",
  },
  metadataBase: new URL("https://eco-pulse-three.vercel.app"),
  twitter: {
    card: "summary",
    site: "@EcoPulseAI",
    title: "EcoPulse - AI-powered Farming Assistant",
    description:
      "AI-powered farming assistant for smallholder farmers, providing real-time insights on crop health, pest detection, and resource optimization.",
    images: ["/images/logo-192x192.png"],
  },
  openGraph: {
    type: "website",
    url: "https://eco-pulse-three.vercel.app",
    title: "EcoPulse - AI-powered Farming Assistant",
    description:
      "AI-powered farming assistant for smallholder farmers, providing real-time insights on crop health, pest detection, and resource optimization.",
    siteName: "EcoPulse",
    images: [
      {
        url: "/images/logo-512x512.png",
        width: 512,
        height: 512,
        type: "image/png",
      },
    ],
  },
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
};

export const themeColor = "#ffffff";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <>
          <AuthProvider>
            <CameraProvider>{children}</CameraProvider>
          </AuthProvider>
        </>
      </body>
    </html>
  );
}
