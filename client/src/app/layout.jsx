import './globals.css'
export const metadata = {
    title: 'EcoPulse - Your Crop Health Assistant',
    description:
        'EcoPulse is a crop health assistant that helps you monitor your crops and provides you with insights to improve your yield.',
}

export default function RootLayout({ children }) {
    return (
        <html lang="en">
            <body>{children}</body>
        </html>
    )
}
