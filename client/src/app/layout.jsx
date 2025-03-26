import { Toaster } from 'react-hot-toast'
import './globals.css'
export const metadata = {
    title: 'EcoPulse - Your Crop Health Assistant',
    description:
        'EcoPulse is a crop health assistant that helps you monitor your crops and provides you with insights to improve your yield.',
}

export default function RootLayout({ children }) {
    return (
        <html lang="en">
            <body>
                <Toaster
                    position="top-center"
                    reverseOrder={false}
                    toastOptions={{
                        success: {
                            iconTheme: {
                                secondary: '#fff',
                            },
                        },
                        error: {
                            iconTheme: {
                                secondary: '#fff',
                            },
                        },
                        style: {
                            padding: '1rem',
                            borderRadius: '0.8rem',
                            fontSize: '1.4rem',
                        },
                    }}
                />
                {children}
            </body>
        </html>
    )
}
