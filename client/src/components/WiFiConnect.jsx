'use client'
import { useState } from 'react'
import toast from 'react-hot-toast'
import { CiWifiOn } from 'react-icons/ci'
import { CiWifiOff } from 'react-icons/ci'
import { RxCross1 } from 'react-icons/rx'
import { SensorReport } from '.'

const WS_URL = 'ws://192.168.4.1:80'
const API_URL = 'http://192.168.4.1:80'

function WiFiConnect({ setWiFiOpen }) {
    const [isConnected, setIsConnected] = useState(false)
    const [sensorData, setSensorData] = useState(null)
    const [webSocket, setWebSocket] = useState(null)
    const [sensorReport, setSensorReport] = useState(false)

    const handleConnect = () => {
        const socket = new WebSocket(WS_URL)
        setWebSocket(socket)

        socket.onopen = () => {
            console.log('Connected to ESP32 WebSocket')
            setIsConnected(true)
            toast.success('Connected to sensor via Wi-Fi!')
        }

        socket.onmessage = (event) => {
            try {
                const data = event.data
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
    }

    return (
        <>
            <div
                onClick={() => setWiFiOpen(false)}
                className="fixed inset-0 flex items-center justify-center bg-[rgba(0,0,0,0.3)] backdrop-blur-[2px] bg-opacity-50 z-[100]"
            >
                <div
                    onClick={(e) => e.stopPropagation()}
                    className="flex flex-col bg-primary rounded-xl p-[1.5rem] items-center gap-[2rem] lg:w-full w-[88vw] max-container max-h-[95%]"
                >
                    <div className="w-full flex justify-between items-center">
                        <h2>Soil Diagnosis</h2>
                        <button
                            className="cursor-pointer"
                            onClick={() => setWiFiOpen(false)}
                        >
                            <RxCross1 size={25} />
                        </button>
                    </div>

                    {isConnected ? (
                        <div className="flex flex-col justify-center items-center gap-[2rem]">
                            <CiWifiOn size={75} className="text-green-500" />
                            <h2 className="text-center">Connected to Sensor</h2>
                            <h2 className="text-center font-normal max-w-[40rem]">
                                Device connected to sensor. Please insert your
                                sensor into the soil and click on the button
                                below to start diagnosis.
                            </h2>
                            <button
                                className="bg-[#00b2ff] text-white rounded-md p-[1rem] px-[1.5rem] cursor-pointer transition duration-200"
                                onClick={() => setSensorReport(true)}
                            >
                                <h3>Start Diagnosis</h3>
                            </button>
                        </div>
                    ) : (
                        <div className="flex flex-col justify-center items-center gap-[2rem]">
                            <CiWifiOff size={75} className="text-red-500" />
                            <h2 className="font-normal max-w-[40rem] text-center">
                                Connect your device to{' '}
                                <span className="font-bold bg-green-300 rounded-xl px-[0.5rem]">
                                    ESP32_Sensor
                                </span>{' '}
                                WiFi (Password&nbsp;:&nbsp;
                                <span className="font-bold bg-green-300 rounded-xl px-[0.5rem]">
                                    12345678
                                </span>
                                ). After connecting to the WiFi, click on the
                                button given below to establish connection
                            </h2>

                            <button
                                className="bg-[#00b2ff] text-white rounded-md p-[1rem] px-[1.5rem] cursor-pointer transition duration-200"
                                onClick={handleConnect}
                            >
                                <h3 className="font-semibold tracking-wide uppercase">
                                    Connect
                                </h3>
                            </button>
                        </div>
                    )}
                </div>
            </div>
            {sensorReport && (
                <SensorReport
                    setSensorReport={setSensorReport}
                    webSocket={webSocket}
                    setWifiopen={setWiFiOpen}
                    setIsConnected={setIsConnected}
                />
            )}
        </>
    )
}

export default WiFiConnect
