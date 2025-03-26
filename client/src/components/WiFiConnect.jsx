'use client'
import { useState, useEffect } from 'react'
import toast from 'react-hot-toast'
import { CiWifiOn } from 'react-icons/ci'
import { CiWifiOff } from 'react-icons/ci'
import { RxCross1 } from 'react-icons/rx'

const WS_URL = 'ws://YOUR_ESP32_IP:81'
const API_URL = 'http://YOUR_ESP32_IP/get-data'

function WiFiConnect({ setWiFiOpen }) {
    const [isConnected, setIsConnected] = useState(false)
    const [sensorData, setSensorData] = useState(null)
    const [storedData, setStoredData] = useState(null)

    useEffect(() => {
        const socket = new WebSocket(WS_URL)

        socket.onopen = () => {
            console.log('Connected to ESP32 WebSocket')
            setIsConnected(true)
            toast.success('Connected to sensor via Wi-Fi!')
        }

        socket.onmessage = (event) => {
            try {
                const data = JSON.parse(event.data)
                setSensorData(data)
            } catch (error) {
                console.error('Error parsing WebSocket data:', error)
            }
        }

        socket.onclose = () => {
            console.log('WebSocket Disconnected')
            setIsConnected(false)
            toast.error('Disconnected from sensor.')
        }

        return () => {
            socket.close()
        }
    }, [])

    const fetchStoredData = async () => {
        try {
            const response = await fetch(API_URL)
            if (!response.ok) throw new Error('Failed to fetch data')
            const data = await response.json()
            setStoredData(data)
            toast.success('Fetched stored data!')
        } catch (error) {
            console.error('Error fetching stored sensor data:', error)
            toast.error('Failed to fetch stored data.')
        }
    }

    return (
        <div
            onClick={() => setWiFiOpen(false)}
            className="fixed inset-0 flex items-center justify-center bg-[rgba(0,0,0,0.3)] backdrop-blur-[2px] bg-opacity-50 z-[100]"
        >
            <div
                onClick={(e) => e.stopPropagation()}
                className="flex flex-col bg-primary rounded-xl p-[1.5rem] items-center gap-[2rem] lg:w-full w-[88vw] max-container max-h-[95%]"
            >
                <div className="w-full flex justify-between items-center">
                    <h2>Connect to Sensor</h2>
                    <button
                        className="cursor-pointer"
                        onClick={() => setWiFiOpen(false)}
                    >
                        <RxCross1 size={25} />
                    </button>
                </div>

                {isConnected ? (
                    <div className="flex flex-col justify-center items-center gap-[2rem]">
                        <CiWifiOn size={50} className="text-green-500" />
                        <h2 className="text-center">Connected to Sensor</h2>
                        <div className="p-2 bg-gray-200 rounded-md">
                            {JSON.stringify(sensorData, null, 2)}
                        </div>
                    </div>
                ) : (
                    <div className="flex flex-col justify-center items-center gap-[2rem]">
                        <CiWifiOff size={50} className="text-red-500" />
                        <h2 className="font-normal max-w-[35rem] text-center">
                            Ensure your device is connected to{' '}
                            <span className="font-bold bg-green-300 rounded-xl px-[0.5rem]">
                                ESP32_sensor
                            </span>{' '}
                            wifi (Password&nbsp;:&nbsp;
                            <span className="font-bold bg-green-300 rounded-xl px-[0.5rem]">
                                12345678
                            </span>
                            ) to connect.
                        </h2>
                        <button
                            className="bg-gray-200 py-[1rem] px-[2rem] rounded-xl"
                            onClick={fetchStoredData}
                        >
                            <h3>Fetch Stored Data</h3>
                        </button>

                        {storedData && (
                            <pre className="p-2 bg-gray-200 rounded-md">
                                {JSON.stringify(storedData, null, 2)}
                            </pre>
                        )}
                    </div>
                )}
            </div>
        </div>
    )
}

export default WiFiConnect
