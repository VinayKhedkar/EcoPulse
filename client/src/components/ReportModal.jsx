'use client'
import { useCamera } from '@/context/CameraContext'
import { useEffect, useState, useRef } from 'react'
import toast from 'react-hot-toast'
import { RxCross2 } from 'react-icons/rx'
import { Base64Image, ReportModalSkeleton } from '.'
import { FaLeaf } from 'react-icons/fa'
import { MdOutlineSaveAlt } from 'react-icons/md'
import { TbPercentage } from 'react-icons/tb'
import { AiFillMedicineBox } from 'react-icons/ai'
import { IoMdShare } from 'react-icons/io'
import { base64ToFile, runONNXModel } from '@/utils/cropdiseasemodel.util'
import html2canvas from 'html2canvas-pro'
import jsPDF from 'jspdf'

const ReportModal = ({ setReportModal }) => {
    const { image, setImage } = useCamera()
    const [diseaseData, setDiseaseData] = useState(null)
    const [isLoading, setIsLoading] = useState(true)
    const reportRef = useRef(null)
    const imageRef = useRef(null)
    const diseaseRef = useRef(null)
    const confidenceRef = useRef(null)
    const suggestionRef = useRef(null)

    useEffect(() => {
        if (image) {
            const fetchReport = async () => {
                try {
                    setIsLoading(true)
                    const pngImage = base64ToFile(image, 'image.png')
                    const report = await runONNXModel(pngImage)

                    setDiseaseData(report)
                    setIsLoading(false)
                } catch (error) {
                    toast.error(error.message, {
                        className: 'toast-error',
                    })
                }
            }

            fetchReport()
        }
    }, [image])

    const handleClose = () => {
        setDiseaseData(null)
        setImage(null)
        setReportModal(false)
    }

    const handleSavePDF = async () => {
        const toastId = toast.loading('Generating custom PDF...')
        try {
            const doc = new jsPDF({
                unit: 'mm',
                format: 'a4',
                orientation: 'portrait',
            })

            const margins = {
                left: 15,
                right: 15,
                bottom: 20,
            }
            const pageWidth = doc.internal.pageSize.getWidth()
            const pageHeight = doc.internal.pageSize.getHeight()
            const contentWidth = pageWidth - margins.left - margins.right
            let yOffset = 15

            const logoImg = new Image()
            logoImg.src = '/images/logo.png'
            await new Promise((resolve) => {
                logoImg.onload = resolve
            })

            doc.setFillColor(255, 255, 255)
            doc.rect(0, yOffset - 5, pageWidth, 30, 'F')

            doc.addImage(logoImg, 'PNG', margins.left, yOffset, 20, 20)
            doc.setFontSize(20)
            doc.setFont('helvetica', 'bold')
            doc.setTextColor(50, 50, 50)
            doc.text('Crop Diagnosis Report', margins.left + 25, yOffset + 12)

            doc.setDrawColor(200, 200, 200)
            doc.setLineWidth(0.5)
            doc.line(
                margins.left,
                yOffset + 22,
                pageWidth - margins.left,
                yOffset + 22
            )

            yOffset += 35

            if (imageRef.current) {
                const canvas = await html2canvas(imageRef.current, {
                    scale: 2,
                    useCORS: true,
                    logging: false,
                })
                const imageData = canvas.toDataURL('image/jpeg', 1.0)

                const aspectRatio = canvas.height / canvas.width
                const imgWidth = contentWidth * 0.6
                const imgHeight = imgWidth * aspectRatio
                const horizontalOffset = (pageWidth - imgWidth) / 2

                if (yOffset + imgHeight > pageHeight - margins.bottom) {
                    doc.addPage()
                    yOffset = 15
                }

                doc.setDrawColor(200, 200, 200)
                doc.setFillColor(250, 250, 250)
                doc.roundedRect(
                    horizontalOffset - 1,
                    yOffset - 1,
                    imgWidth + 2,
                    imgHeight + 2,
                    3,
                    3,
                    'FD'
                )

                doc.addImage(
                    imageData,
                    'JPEG',
                    horizontalOffset,
                    yOffset,
                    imgWidth,
                    imgHeight
                )
                yOffset += imgHeight + 15
            }

            const currentDate = new Date().toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
            })

            if (yOffset > pageHeight - margins.bottom - 30) {
                doc.addPage()
                yOffset = 15
            }

            doc.setFontSize(9)
            doc.setFont('helvetica', 'italic')
            doc.setTextColor(100, 100, 100)
            doc.text(`Report generated: ${currentDate}`, margins.left, yOffset)
            yOffset += 15

            if (yOffset > pageHeight - margins.bottom - 50) {
                doc.addPage()
                yOffset = 15
            }

            doc.setFillColor(39, 174, 96, 0.1)
            doc.roundedRect(
                margins.left - 5,
                yOffset - 5,
                contentWidth + 10,
                12,
                3,
                3,
                'F'
            )

            doc.setFontSize(14)
            doc.setFont('helvetica', 'bold')
            doc.setTextColor(39, 174, 96)
            doc.text('Disease Identified', margins.left, yOffset + 3)
            yOffset += 15

            if (diseaseRef.current) {
                doc.setFontSize(12)
                doc.setFont('helvetica', 'normal')
                doc.setTextColor(33, 37, 41)
                const diseaseText = diseaseRef.current.innerText.trim()
                const textLines = doc.splitTextToSize(diseaseText, contentWidth)

                if (
                    yOffset + textLines.length * 7 >
                    pageHeight - margins.bottom - 20
                ) {
                    doc.addPage()
                    yOffset = 15
                }

                doc.text(textLines, margins.left, yOffset)
                yOffset += textLines.length * 7 + 10
            }

            if (yOffset > pageHeight - margins.bottom - 50) {
                doc.addPage()
                yOffset = 15
            }

            doc.setFillColor(208, 255, 212, 0.3)
            doc.roundedRect(
                margins.left - 5,
                yOffset - 5,
                contentWidth + 10,
                12,
                3,
                3,
                'F'
            )

            doc.setFontSize(14)
            doc.setFont('helvetica', 'bold')
            doc.setTextColor(39, 174, 96)
            doc.text('Confidence Level', margins.left, yOffset + 3)
            yOffset += 15

            if (confidenceRef.current) {
                doc.setFontSize(12)
                doc.setFont('helvetica', 'normal')
                doc.setTextColor(33, 37, 41)
                const confidenceText = confidenceRef.current.innerText.trim()
                doc.text(confidenceText, margins.left, yOffset)
                yOffset += 10

                if (diseaseData?.confidence) {
                    const confidencePercentage = diseaseData.confidence * 100
                    const barWidth = 120
                    const barHeight = 8

                    doc.setFillColor(240, 240, 240)
                    doc.roundedRect(
                        margins.left,
                        yOffset,
                        barWidth,
                        barHeight,
                        2,
                        2,
                        'F'
                    )

                    doc.setFillColor(46, 204, 113)

                    const filledWidth = (confidencePercentage / 100) * barWidth
                    doc.roundedRect(
                        margins.left,
                        yOffset,
                        filledWidth,
                        barHeight,
                        2,
                        2,
                        'F'
                    )

                    doc.setFontSize(10)
                    doc.setTextColor(50, 50, 50)
                    doc.setFont('helvetica', 'bold')
                    doc.text(
                        `${confidencePercentage.toFixed(1)}%`,
                        margins.left + barWidth + 5,
                        yOffset + 5.5
                    )
                }

                yOffset += 20
            }

            if (yOffset > pageHeight - margins.bottom - 50) {
                doc.addPage()
                yOffset = 15
            }

            doc.setFillColor(243, 156, 18, 0.1)
            doc.roundedRect(
                margins.left - 5,
                yOffset - 5,
                contentWidth + 10,
                12,
                3,
                3,
                'F'
            )

            doc.setFontSize(14)
            doc.setFont('helvetica', 'bold')
            doc.setTextColor(243, 156, 18)
            doc.text('Recommended Action', margins.left, yOffset + 3)
            yOffset += 15

            if (suggestionRef.current) {
                doc.setFontSize(12)
                doc.setFont('helvetica', 'normal')
                doc.setTextColor(33, 37, 41)
                const suggestionText = suggestionRef.current.innerText.trim()
                const textLines = doc.splitTextToSize(
                    suggestionText,
                    contentWidth
                )

                if (
                    yOffset + textLines.length * 7 >
                    pageHeight - margins.bottom - 20
                ) {
                    doc.addPage()
                    yOffset = 15
                }

                doc.text(textLines, margins.left, yOffset)
                yOffset += textLines.length * 7 + 15
            }

            const pageCount = doc.internal.getNumberOfPages()
            for (let i = 1; i <= pageCount; i++) {
                doc.setPage(i)

                doc.setDrawColor(200, 200, 200)
                doc.setLineWidth(0.1)
                doc.line(
                    margins.left,
                    pageHeight - margins.bottom + 5,
                    pageWidth - margins.left,
                    pageHeight - margins.bottom + 5
                )

                doc.setFontSize(8)
                doc.setTextColor(100, 100, 100)

                doc.text(
                    `Page ${i} of ${pageCount}`,
                    pageWidth / 2,
                    pageHeight - margins.bottom / 2,
                    { align: 'center' }
                )

                doc.setFontSize(7)
                doc.text(
                    '© EcoPulse 2025. All rights reserved.',
                    margins.left,
                    pageHeight - margins.bottom / 2
                )
                doc.text(
                    'eco-pulse-three.vercel.app',
                    pageWidth - margins.right,
                    pageHeight - margins.bottom / 2,
                    { align: 'right' }
                )
            }

            doc.save('Crop_Diagnosis_Report.pdf')
            toast.dismiss(toastId)
            toast.success('PDF saved successfully')
        } catch (error) {
            console.error('Error generating custom PDF:', error)
            toast.dismiss(toastId)
            toast.error('Failed to save PDF')
        }
    }

    const handleSharePDF = async () => {
        const toastId = toast.loading(
            'Generating and preparing PDF to share...'
        )
        try {
            const doc = new jsPDF({
                unit: 'mm',
                format: 'a4',
                orientation: 'portrait',
            })

            const margins = {
                left: 15,
                right: 15,
                bottom: 20,
            }
            const pageWidth = doc.internal.pageSize.getWidth()
            const pageHeight = doc.internal.pageSize.getHeight()
            const contentWidth = pageWidth - margins.left - margins.right
            let yOffset = 15

            const logoImg = new Image()
            logoImg.src = '/images/logo.png'
            await new Promise((resolve) => {
                logoImg.onload = resolve
            })

            doc.setFillColor(255, 255, 255)
            doc.rect(0, yOffset - 5, pageWidth, 30, 'F')

            doc.addImage(logoImg, 'PNG', margins.left, yOffset, 20, 20)
            doc.setFontSize(20)
            doc.setFont('helvetica', 'bold')
            doc.setTextColor(50, 50, 50)
            doc.text('Crop Diagnosis Report', margins.left + 25, yOffset + 12)

            doc.setDrawColor(200, 200, 200)
            doc.setLineWidth(0.5)
            doc.line(
                margins.left,
                yOffset + 22,
                pageWidth - margins.left,
                yOffset + 22
            )

            yOffset += 35

            if (imageRef.current) {
                const canvas = await html2canvas(imageRef.current, {
                    scale: 2,
                    useCORS: true,
                    logging: false,
                })
                const imageData = canvas.toDataURL('image/jpeg', 1.0)

                const aspectRatio = canvas.height / canvas.width
                const imgWidth = contentWidth * 0.6
                const imgHeight = imgWidth * aspectRatio
                const horizontalOffset = (pageWidth - imgWidth) / 2

                if (yOffset + imgHeight > pageHeight - margins.bottom) {
                    doc.addPage()
                    yOffset = 15
                }

                doc.setDrawColor(200, 200, 200)
                doc.setFillColor(250, 250, 250)
                doc.roundedRect(
                    horizontalOffset - 1,
                    yOffset - 1,
                    imgWidth + 2,
                    imgHeight + 2,
                    3,
                    3,
                    'FD'
                )

                doc.addImage(
                    imageData,
                    'JPEG',
                    horizontalOffset,
                    yOffset,
                    imgWidth,
                    imgHeight
                )
                yOffset += imgHeight + 15
            }

            const currentDate = new Date().toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
            })

            if (yOffset > pageHeight - margins.bottom - 30) {
                doc.addPage()
                yOffset = 15
            }

            doc.setFontSize(9)
            doc.setFont('helvetica', 'italic')
            doc.setTextColor(100, 100, 100)
            doc.text(`Report generated: ${currentDate}`, margins.left, yOffset)
            yOffset += 15

            if (yOffset > pageHeight - margins.bottom - 50) {
                doc.addPage()
                yOffset = 15
            }

            doc.setFillColor(39, 174, 96, 0.1)
            doc.roundedRect(
                margins.left - 5,
                yOffset - 5,
                contentWidth + 10,
                12,
                3,
                3,
                'F'
            )

            doc.setFontSize(14)
            doc.setFont('helvetica', 'bold')
            doc.setTextColor(39, 174, 96)
            doc.text('Disease Identified', margins.left, yOffset + 3)
            yOffset += 15

            if (diseaseRef.current) {
                doc.setFontSize(12)
                doc.setFont('helvetica', 'normal')
                doc.setTextColor(33, 37, 41)
                const diseaseText = diseaseRef.current.innerText.trim()
                const textLines = doc.splitTextToSize(diseaseText, contentWidth)

                if (
                    yOffset + textLines.length * 7 >
                    pageHeight - margins.bottom - 20
                ) {
                    doc.addPage()
                    yOffset = 15
                }

                doc.text(textLines, margins.left, yOffset)
                yOffset += textLines.length * 7 + 10
            }

            if (yOffset > pageHeight - margins.bottom - 50) {
                doc.addPage()
                yOffset = 15
            }

            doc.setFillColor(208, 255, 212, 0.3)
            doc.roundedRect(
                margins.left - 5,
                yOffset - 5,
                contentWidth + 10,
                12,
                3,
                3,
                'F'
            )

            doc.setFontSize(14)
            doc.setFont('helvetica', 'bold')
            doc.setTextColor(39, 174, 96)
            doc.text('Confidence Level', margins.left, yOffset + 3)
            yOffset += 15

            if (confidenceRef.current) {
                doc.setFontSize(12)
                doc.setFont('helvetica', 'normal')
                doc.setTextColor(33, 37, 41)
                const confidenceText = confidenceRef.current.innerText.trim()
                doc.text(confidenceText, margins.left, yOffset)
                yOffset += 10

                if (diseaseData?.confidence) {
                    const confidencePercentage = diseaseData.confidence * 100
                    const barWidth = 120
                    const barHeight = 8

                    doc.setFillColor(240, 240, 240)
                    doc.roundedRect(
                        margins.left,
                        yOffset,
                        barWidth,
                        barHeight,
                        2,
                        2,
                        'F'
                    )

                    doc.setFillColor(46, 204, 113)

                    const filledWidth = (confidencePercentage / 100) * barWidth
                    doc.roundedRect(
                        margins.left,
                        yOffset,
                        filledWidth,
                        barHeight,
                        2,
                        2,
                        'F'
                    )

                    doc.setFontSize(10)
                    doc.setTextColor(50, 50, 50)
                    doc.setFont('helvetica', 'bold')
                    doc.text(
                        `${confidencePercentage.toFixed(1)}%`,
                        margins.left + barWidth + 5,
                        yOffset + 5.5
                    )
                }

                yOffset += 20
            }

            if (yOffset > pageHeight - margins.bottom - 50) {
                doc.addPage()
                yOffset = 15
            }

            doc.setFillColor(243, 156, 18, 0.1)
            doc.roundedRect(
                margins.left - 5,
                yOffset - 5,
                contentWidth + 10,
                12,
                3,
                3,
                'F'
            )

            doc.setFontSize(14)
            doc.setFont('helvetica', 'bold')
            doc.setTextColor(243, 156, 18)
            doc.text('Recommended Action', margins.left, yOffset + 3)
            yOffset += 15

            if (suggestionRef.current) {
                doc.setFontSize(12)
                doc.setFont('helvetica', 'normal')
                doc.setTextColor(33, 37, 41)
                const suggestionText = suggestionRef.current.innerText.trim()
                const textLines = doc.splitTextToSize(
                    suggestionText,
                    contentWidth
                )

                if (
                    yOffset + textLines.length * 7 >
                    pageHeight - margins.bottom - 20
                ) {
                    doc.addPage()
                    yOffset = 15
                }

                doc.text(textLines, margins.left, yOffset)
                yOffset += textLines.length * 7 + 15
            }

            const pageCount = doc.internal.getNumberOfPages()
            for (let i = 1; i <= pageCount; i++) {
                doc.setPage(i)

                doc.setDrawColor(200, 200, 200)
                doc.setLineWidth(0.1)
                doc.line(
                    margins.left,
                    pageHeight - margins.bottom + 5,
                    pageWidth - margins.left,
                    pageHeight - margins.bottom + 5
                )

                doc.setFontSize(8)
                doc.setTextColor(100, 100, 100)

                doc.text(
                    `Page ${i} of ${pageCount}`,
                    pageWidth / 2,
                    pageHeight - margins.bottom / 2,
                    { align: 'center' }
                )

                doc.setFontSize(7)
                doc.text(
                    '© EcoPulse 2025. All rights reserved.',
                    margins.left,
                    pageHeight - margins.bottom / 2
                )
                doc.text(
                    'eco-pulse-three.vercel.app',
                    pageWidth - margins.right,
                    pageHeight - margins.bottom / 2,
                    { align: 'right' }
                )
            }

            const pdfData = doc.output('datauristring')

            if (navigator.share && navigator.canShare) {
                const pdfBlob = doc.output('blob')
                const pdfFile = new File(
                    [pdfBlob],
                    'Crop_Diagnosis_Report.pdf',
                    {
                        type: 'application/pdf',
                    }
                )

                try {
                    await navigator.share({
                        title: 'Crop Diagnosis Report',
                        text: 'Check out my crop diagnosis from EcoPulse',
                        files: [pdfFile],
                    })
                    toast.dismiss(toastId)
                    toast.success('PDF shared successfully')
                } catch (error) {
                    console.error('Error sharing PDF:', error)
                    doc.save('Crop_Diagnosis_Report.pdf')
                    toast.dismiss(toastId)
                    toast.info('PDF downloaded instead of shared')
                }
            } else {
                const mailtoLink = `mailto:?subject=Crop Diagnosis Report&body=Please find my crop diagnosis report attached.%0A%0AGenerated by EcoPulse on ${currentDate}`

                window.open(mailtoLink, '_blank')

                doc.save('Crop_Diagnosis_Report.pdf')

                toast.dismiss(toastId)
                toast.info('PDF downloaded and email client opened')
            }
        } catch (error) {
            console.error('Error generating PDF to share:', error)
            toast.dismiss(toastId)
            toast.error('Failed to share PDF')
        }
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-[5px]">
            <div
                id="report-modal"
                ref={reportRef}
                className="relative w-full h-full max-container overflow-auto bg-white shadow-lg"
            >
                <div className="sticky top-0 flex justify-between items-center p-[1.5rem] border-b border-gray-200 bg-white z-10">
                    <h2 className="text-green-700">Crop Diagnosis Report</h2>
                    <div className="flex items-center p-[0.2rem] backdrop-blur-[6px] justify-center rounded-full bg-gray-300 hover:bg-gray-200 transition-colors">
                        <button onClick={handleClose} aria-label="Close">
                            <RxCross2 className="text-gray-600" size={24} />
                        </button>
                    </div>
                </div>
                <div className="p-[1.5rem]">
                    {isLoading ? (
                        <ReportModalSkeleton />
                    ) : (
                        <div className="flex flex-col gap-[2rem]">
                            <div
                                ref={imageRef}
                                className="overflow-hidden rounded-xl border border-gray-200 shadow-sm"
                            >
                                <Base64Image
                                    base64={image}
                                    alt="Crop photo"
                                    width={500}
                                    height={500}
                                    classname="w-full h-auto object-cover"
                                />
                            </div>
                            <div className="bg-[#f8f9fa] rounded-[0.75rem] overflow-hidden shadow-sm">
                                <div className="bg-green-600 text-white p-[1rem]">
                                    <h3 className="font-medium">
                                        Diagnosis Results
                                    </h3>
                                </div>

                                <div className="p-[1.5rem] flex flex-col gap-[1.25rem]">
                                    <div className="flex items-start gap-[0.75rem]">
                                        <div className="flex items-center justify-center w-[2.5rem] h-[2.5rem] bg-green-100 rounded-full flex-shrink-0">
                                            <FaLeaf
                                                className="text-green-600"
                                                size={22}
                                            />
                                        </div>
                                        <div>
                                            <h3 className="text-gray-500 font-medium mb-[0.25rem]">
                                                DISEASE IDENTIFIED
                                            </h3>
                                            <h3
                                                ref={diseaseRef}
                                                className="font-bold text-gray-800"
                                            >
                                                {diseaseData?.disease ||
                                                    'No disease detected'}
                                            </h3>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-[0.75rem]">
                                        <div className="flex items-center justify-center w-[2.5rem] h-[2.5rem] bg-blue-100 rounded-full flex-shrink-0">
                                            <TbPercentage
                                                className="text-blue-600"
                                                size={18}
                                            />
                                        </div>
                                        <div>
                                            <p className="text-gray-500 font-medium mb-[0.25rem]">
                                                CONFIDENCE LEVEL
                                            </p>
                                            <div className="relative pt-[0.25rem]">
                                                <div className="w-full h-[0.7rem] bg-gray-400 rounded-full overflow-hidden">
                                                    <div
                                                        className="h-full bg-blue-500 rounded-full"
                                                        style={{
                                                            width: `${
                                                                (diseaseData?.confidence ||
                                                                    0) * 100
                                                            }%`,
                                                        }}
                                                    ></div>
                                                </div>
                                                <p
                                                    ref={confidenceRef}
                                                    className="mt-[0.5rem] font-bold text-gray-800"
                                                >
                                                    {diseaseData?.confidence
                                                        ? `${(
                                                              diseaseData.confidence *
                                                              100
                                                          ).toFixed(2)}%`
                                                        : 'N/A'}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-[0.75rem]">
                                        <div className="flex items-center justify-center w-[2.5rem] h-[2.5rem] bg-amber-100 rounded-full flex-shrink-0">
                                            <AiFillMedicineBox
                                                className="text-amber-600"
                                                size={22}
                                            />
                                        </div>
                                        <div>
                                            <h3 className="text-gray-500 font-medium mb-[0.25rem]">
                                                RECOMMENDED ACTION
                                            </h3>
                                            <h3
                                                ref={suggestionRef}
                                                className="text-gray-800"
                                            >
                                                {diseaseData?.suggestion ||
                                                    'No specific action needed'}
                                            </h3>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="flex gap-[1rem] mt-[1rem]">
                                <button
                                    onClick={handleSavePDF}
                                    className="flex-1 py-[0.75rem] px-[1rem] bg-green-600 text-white rounded-[0.5rem] font-medium hover:bg-green-700 transition-colors"
                                >
                                    <h3 className="flex justify-center items-center gap-[1rem]">
                                        <MdOutlineSaveAlt size={18} />
                                        <span>Save</span>
                                    </h3>
                                </button>
                                <button
                                    onClick={handleSharePDF}
                                    className="flex-1 py-[0.75rem] px-[1rem] bg-gray-100 text-gray-800 rounded-[0.5rem] font-medium hover:bg-gray-200 transition-colors"
                                >
                                    <h3 className="flex justify-center items-center gap-[1rem]">
                                        <IoMdShare size={18} />
                                        <span>Share</span>
                                    </h3>
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

export default ReportModal
