'use client'
import { useState, useEffect } from 'react'
import toast from 'react-hot-toast'
import { MdOutlineBluetoothSearching } from 'react-icons/md'
import { RxCross1 } from 'react-icons/rx'

function Bluetooth({
    setBluetoothOpen,
    setServer,
    setService,
    setCharacteristic,
}) {
    const [device, setDevice] = useState(null)
    const [deviceName, setDeviceName] = useState(null)
    const [isConnected, setIsConnected] = useState(false)

    useEffect(() => {
        if (device) {
            setDeviceName(device.name)
        }
    }, [device])

    const connectToDevice = async () => {
        try {
            console.log('Requesting ESP32 Bluetooth Device...')

            const selectedDevice = await navigator.bluetooth.requestDevice({
                acceptAllDevices: true,
            })

            console.log(`Device selected: ${selectedDevice.name}`)
            setDevice(selectedDevice)
            setDeviceName(selectedDevice.name)

            if (!selectedDevice.gatt) {
                console.error('GATT not supported on this device')
                toast.error('GATT not supported on this device')
                return
            }

            const server = await selectedDevice.gatt.connect()
            setServer(server)
            console.log('Connected to ESP32 GATT Server')

            // Get Primary Service
            const service = await server.getPrimaryService(
                '12345678-1234-5678-1234-56789abcdef0'
            )
            setService(service)
            console.log('ESP32 Service retrieved')

            // Get Characteristic
            const characteristic = await service.getCharacteristic(
                'abcd1234-5678-1234-5678-abcdef123456'
            )
            setCharacteristic(characteristic)
            console.log('ESP32 Characteristic retrieved')

            // Read Initial Value from ESP32
            const value = await characteristic.readValue()
            console.log(
                'Initial Value from ESP32:',
                new TextDecoder().decode(value)
            )

            // Listen for disconnect
            selectedDevice.addEventListener(
                'gattserverdisconnected',
                onDisconnected
            )
            console.log('Listening for ESP32 disconnection')

            toast.success(`Connected to ESP32: ${selectedDevice.name}`)
        } catch (error) {
            console.error('Bluetooth connection failed:', error)
            toast.error('Failed to connect. Try again.')
        }
    }

    return (
        <div
            onClick={() => setBluetoothOpen(false)}
            className="fixed inset-0 flex items-center justify-center bg-[rgba(0,0,0,0.3)] backdrop-blur-[2px] bg-opacity-50 z-[100]"
        >
            <div
                onClick={(e) => e.stopPropagation()}
                className="flex flex-col bg-primary rounded-xl p-[1.5rem] items-center gap-[2rem] lg:w-full w-[88vw] max-container max-h-[95%]"
            >
                <div className="w-full flex justify-between items-center">
                    <h2>Connect to sensor</h2>
                    <button
                        className="cursor-pointer"
                        onClick={() => setBluetoothOpen(false)}
                    >
                        <RxCross1 size={25} />
                    </button>
                </div>
                <div className="flex flex-col justify-center items-center gap-[3rem]">
                    <div className="p-[2rem] bg-bluetooth rounded-full">
                        <MdOutlineBluetoothSearching size={70} />
                    </div>
                    <h2 className="font-normal max-w-[35rem] text-center">
                        Turn on Bluetooth from settings and make sure your
                        device is close to your sensor
                    </h2>
                    <button
                        className="bg-gray-200 py-[1rem] px-[2rem] rounded-xl"
                        onClick={connectToDevice}
                    >
                        <h3>
                            {isConnected
                                ? `Connected to ${deviceName}`
                                : 'Tap to pair with sensor'}
                        </h3>
                    </button>
                </div>
            </div>
        </div>
    )
}

export default Bluetooth
