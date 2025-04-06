'use client'

import React, { useEffect, useState, useRef } from 'react'
import toast from 'react-hot-toast'
import { RxCross2 } from 'react-icons/rx'
import { MdOutlineSaveAlt } from 'react-icons/md'
import { IoMdShare } from 'react-icons/io'
import { WiHumidity } from 'react-icons/wi'
import { GiThermometerScale } from 'react-icons/gi'
import { PiPlantFill } from 'react-icons/pi'
import { AiOutlineLoading3Quarters } from 'react-icons/ai'
import { preProcessData, runONNXSensorModel } from '@/utils/sensormodel.util'
import { Loader } from '.'
import jsPDF from 'jspdf'
import html2canvas from 'html2canvas-pro'

function SensorReport({
    setSensorReport,
    webSocket,
    setWifiopen,
    setIsConnected,
}) {
    const [countdown, setCountdown] = useState(10)
    const [isLoading, setIsLoading] = useState(false)
    const [report, setReport] = useState(null)
    const [sensorData, setSensorData] = useState(null)
    const reportRef = useRef(null)

    useEffect(() => {
        let timer
        const collectedData = []

        const socketHandler = (event) => {
            try {
                if (!event.data.trim().startsWith('{')) return
                const data = JSON.parse(event.data)
                if (typeof data === 'object' && data !== null) {
                    collectedData.push(data)
                }
            } catch (err) {
                toast.error('Data parse error')
            }
        }

        const startCollection = async () => {
            if (!webSocket || webSocket.readyState !== WebSocket.OPEN) {
                toast.error('Sensor not connected')
                return
            }
            webSocket.addEventListener('message', socketHandler)

            timer = setInterval(() => {
                setCountdown((prev) => {
                    if (prev <= 1) {
                        clearInterval(timer)
                        webSocket.removeEventListener('message', socketHandler)
                        handleModelRun(collectedData)
                    }
                    return prev - 1
                })
            }, 1000)
        }

        const handleModelRun = async (data) => {
            setIsLoading(true)
            const modelInput = preProcessData(data)
            setSensorData(modelInput)
            const result = await runONNXSensorModel(modelInput)
            setReport(result)
            setIsLoading(false)
        }

        startCollection()

        return () => {
            clearInterval(timer)
            webSocket.removeEventListener('message', socketHandler)
        }
    }, [])

    const handleClose = () => {
        if (webSocket) {
            webSocket.close()
        }
        setIsConnected(false)
        setWifiopen(false)
        setSensorReport(false)
        setReport(null)
        setSensorData(null)
        setCountdown(10)
    }

    const handleSharePdf = async () => {
        const toastId = toast.loading('Preparing report for sharing...')

        try {
            const doc = new jsPDF({
                unit: 'mm',
                format: 'a4',
                orientation: 'portrait',
            })

            const pageWidth = doc.internal.pageSize.getWidth()
            const pageHeight = doc.internal.pageSize.getHeight()
            const margin = 10
            const footerHeight = 20
            const headerHeight = 35
            const maxImageHeight = pageHeight - headerHeight - footerHeight

            const logo = new Image()
            logo.src = '/images/logo.png'
            await new Promise((res) => (logo.onload = res))

            doc.addImage(logo, 'PNG', margin, 15, 20, 20)
            doc.setFont('helvetica', 'bold')
            doc.setFontSize(20)
            doc.setTextColor(40, 40, 40)
            doc.text('Sensor Diagnosis Report', margin + 25, 28)

            doc.setDrawColor(200)
            doc.setLineWidth(0.5)
            doc.line(margin, headerHeight, pageWidth - margin, headerHeight)

            const sensorElement = reportRef.current
            if (!sensorElement) throw new Error('Sensor report not found')

            const cloned = sensorElement.cloneNode(true)
            cloned.style.padding = '2rem'
            cloned.style.background = 'white'

            const hidden = document.createElement('div')
            hidden.style.position = 'fixed'
            hidden.style.left = '-9999px'
            hidden.appendChild(cloned)
            document.body.appendChild(hidden)

            const canvas = await html2canvas(cloned, {
                scale: 2,
                useCORS: true,
            })
            document.body.removeChild(hidden)

            const imgData = canvas.toDataURL('image/png', 1.0)
            const imgProps = {
                width: pageWidth - margin * 2,
                height:
                    (canvas.height / canvas.width) * (pageWidth - margin * 2),
            }

            if (imgProps.height > maxImageHeight) {
                imgProps.height = maxImageHeight
                imgProps.width = (canvas.width / canvas.height) * maxImageHeight
            }

            const imgX = (pageWidth - imgProps.width) / 2
            const imgY = headerHeight + 5
            doc.addImage(
                imgData,
                'PNG',
                imgX,
                imgY,
                imgProps.width,
                imgProps.height
            )

            doc.setDrawColor(220)
            doc.line(
                margin,
                pageHeight - footerHeight + 5,
                pageWidth - margin,
                pageHeight - footerHeight + 5
            )

            doc.setFontSize(9)
            doc.setFont('helvetica', 'italic')
            doc.setTextColor(100)

            const timestamp = new Date().toLocaleString('en-US', {
                dateStyle: 'long',
                timeStyle: 'short',
            })

            doc.text(`Generated: ${timestamp}`, margin, pageHeight - 7)
            doc.text(`Page 1 of 1`, pageWidth / 2, pageHeight - 7, {
                align: 'center',
            })
            doc.text(
                'eco-pulse-three.vercel.app',
                pageWidth - margin,
                pageHeight - 7,
                { align: 'right' }
            )

            const pdfBlob = doc.output('blob')

            const file = new File([pdfBlob], 'Sensor_Report.pdf', {
                type: 'application/pdf',
            })

            if (navigator.canShare && navigator.canShare({ files: [file] })) {
                await navigator.share({
                    title: 'Sensor Diagnosis Report',
                    text: 'Here is your crop sensor diagnosis report.',
                    files: [file],
                })
                toast.dismiss(toastId)
                toast.success('Report shared successfully!')
            } else {
                toast.dismiss(toastId)
                toast.error('Sharing is not supported on this device.')
            }
        } catch (err) {
            console.error(err)
            toast.dismiss(toastId)
            toast.error('Failed to share report.')
        }
    }

    const handleSensorPDFDownload = async () => {
        const toastId = toast.loading('Generating sensor report PDF...')

        try {
            const doc = new jsPDF({
                unit: 'mm',
                format: 'a4',
                orientation: 'portrait',
            })

            const pageWidth = doc.internal.pageSize.getWidth()
            const pageHeight = doc.internal.pageSize.getHeight()
            const margin = 15
            const footerHeight = 20
            const headerHeight = 35
            const maxImageHeight = pageHeight - headerHeight - footerHeight

            const logo = new Image()
            logo.src = '/images/logo.png'
            await new Promise((res) => (logo.onload = res))

            doc.addImage(logo, 'PNG', margin, 15, 20, 20)
            doc.setFont('helvetica', 'bold')
            doc.setFontSize(20)
            doc.setTextColor(40, 40, 40)
            doc.text('Sensor Diagnosis Report', margin + 25, 28)

            doc.setDrawColor(200)
            doc.setLineWidth(0.5)
            doc.line(margin, headerHeight, pageWidth - margin, headerHeight)

            const sensorElement = reportRef.current
            if (!sensorElement)
                throw new Error('Sensor report element not found')

            const cloned = sensorElement.cloneNode(true)
            cloned.style.padding = '2rem'
            cloned.style.background = 'white'

            const hidden = document.createElement('div')
            hidden.style.position = 'fixed'
            hidden.style.left = '-9999px'
            hidden.appendChild(cloned)
            document.body.appendChild(hidden)

            const canvas = await html2canvas(cloned, {
                scale: 2,
                useCORS: true,
            })

            document.body.removeChild(hidden)

            const imgData = canvas.toDataURL('image/png', 1.0)
            const imgProps = {
                width: pageWidth - margin * 2,
                height:
                    (canvas.height / canvas.width) * (pageWidth - margin * 2),
            }

            if (imgProps.height > maxImageHeight) {
                imgProps.height = maxImageHeight
                imgProps.width = (canvas.width / canvas.height) * maxImageHeight
            }

            const imgX = (pageWidth - imgProps.width) / 2
            const imgY = headerHeight + 5

            doc.addImage(
                imgData,
                'PNG',
                imgX,
                imgY,
                imgProps.width,
                imgProps.height
            )

            doc.setDrawColor(220)
            doc.line(
                margin,
                pageHeight - footerHeight + 5,
                pageWidth - margin,
                pageHeight - footerHeight + 5
            )

            doc.setFontSize(9)
            doc.setFont('helvetica', 'italic')
            doc.setTextColor(100)

            const timestamp = new Date().toLocaleString('en-US', {
                dateStyle: 'long',
                timeStyle: 'short',
            })

            doc.text(`Generated: ${timestamp}`, margin, pageHeight - 7)
            doc.text(`Page 1 of 1`, pageWidth / 2, pageHeight - 7, {
                align: 'center',
            })
            doc.text(
                'eco-pulse-three.vercel.app',
                pageWidth - margin,
                pageHeight - 7,
                { align: 'right' }
            )

            doc.save('Sensor_Diagnosis_Report.pdf')
            toast.dismiss(toastId)
            toast.success('PDF saved successfully')
        } catch (err) {
            console.error(err)
            toast.dismiss(toastId)
            toast.error('PDF generation failed')
        }
    }

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-[5px]">
            <div className="relative flex flex-col gap-[2rem] w-full h-full bg-white shadow-xl p-[2rem] max-container">
                <div
                    data-hide-in-pdf="true"
                    className="no-print sticky top-0 flex justify-between items-center bg-white z-10 pb-4 border-b"
                >
                    <h2 className="text-green-700">Plant Stress Report</h2>
                    <button
                        onClick={handleClose}
                        className="text-gray-600 hover:text-gray-800"
                    >
                        <RxCross2 size={24} />
                    </button>
                </div>

                <div>
                    {isLoading ? (
                        <Loader />
                    ) : report ? (
                        <div className="flex flex-col gap-[2rem]">
                            <div
                                ref={reportRef}
                                className="flex flex-col gap-[2rem]"
                            >
                                <div className="flex flex-col gap-[2rem]">
                                    <ReportCard
                                        icon={
                                            <WiHumidity
                                                size={28}
                                                className="text-blue-500"
                                            />
                                        }
                                        title="Humidity"
                                        value={`${sensorData.Humidity}%`}
                                    />
                                    <ReportCard
                                        icon={
                                            <GiThermometerScale
                                                size={24}
                                                className="text-red-500"
                                            />
                                        }
                                        title="Temperature"
                                        value={`${sensorData.DHT_Temperature}°C`}
                                    />
                                    <ReportCard
                                        icon={
                                            <PiPlantFill
                                                size={24}
                                                className="text-green-500"
                                            />
                                        }
                                        title="Soil Moisture"
                                        value={`${sensorData.Soil_Moisture}%`}
                                    />
                                    <ReportCard
                                        icon={
                                            <span className="text-amber-500 font-bold text-xl">
                                                ⚠️
                                            </span>
                                        }
                                        title="Stress Level"
                                        value={report.stress}
                                    />
                                </div>

                                <div className="bg-[#f8f9fa] rounded-xl p-[1.5rem] shadow-sm flex flex-col gap-[2rem]">
                                    <div className="flex flex-col">
                                        <h3 className="text-green-700 font-semibold mb-2">
                                            Soil Health Status
                                        </h3>
                                        <h3 className="text-gray-700 font-medium mb-2">
                                            {report.status}
                                        </h3>
                                    </div>
                                    <div className="flex flex-col gap-[0.5rem]">
                                        <h3 className="text-gray-500 font-semibold">
                                            Suggestions
                                        </h3>
                                        <ul className="list-disc pl-5 text-gray-600 marker:text-black">
                                            {report?.suggestion.map(
                                                (item, index) => (
                                                    <li
                                                        key={index}
                                                        className=""
                                                    >
                                                        <h3>{item}</h3>
                                                    </li>
                                                )
                                            )}
                                        </ul>
                                    </div>
                                </div>
                            </div>
                            <div
                                data-hide-in-pdf="true"
                                className="flex gap-[1rem] no-print"
                            >
                                <button
                                    onClick={handleSensorPDFDownload}
                                    className="flex-1 p-[1rem] bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
                                >
                                    <div className="flex justify-center items-center gap-2">
                                        <MdOutlineSaveAlt size={20} />{' '}
                                        <h3>Save</h3>
                                    </div>
                                </button>
                                <button
                                    onClick={handleSharePdf}
                                    className="flex-1 p-[1rem] bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition"
                                >
                                    <div className="flex justify-center items-center gap-2">
                                        <IoMdShare size={20} /> <h3>Share</h3>
                                    </div>
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div className="flex items-center justify-center h-full">
                            <h3 className="text-gray-600 font-medium">
                                Collecting data...{' '}
                                <span className="font-bold">{countdown}s</span>
                            </h3>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

const ReportCard = ({ icon, title, value }) => (
    <div className="flex items-center gap-[1rem] bg-gray-100 rounded-xl p-[1rem] shadow-sm">
        <div className="p-[1rem] rounded-full bg-white shadow-inner">
            {icon}
        </div>
        <div>
            <h3 className="text-gray-500">{title}</h3>
            <h3 className="text-gray-900 font-semibold">{value}</h3>
        </div>
    </div>
)

export default SensorReport
