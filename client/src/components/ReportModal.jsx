"use client";
import { useCamera } from "@/context/CameraContext";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { RxCross2 } from "react-icons/rx";
import { Base64Image, ReportModalSkeleton } from ".";
import { FaLeaf } from "react-icons/fa";
import { MdOutlineHealthAndSafety, MdOutlineSaveAlt } from "react-icons/md";
import { TbPercentage } from "react-icons/tb";
import { AiFillMedicineBox } from "react-icons/ai";
import { IoMdShare } from "react-icons/io";
import {
  base64ToFile,
  preprocessImage,
  runONNXModel,
} from "@/utils/model.util";

const ReportModal = ({ setReportModal }) => {
  const { image, setImage } = useCamera();
  const [diseaseData, setDiseaseData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (image) {
      const fetchReport = async () => {
        try {
          setIsLoading(true);
          const pngImage = base64ToFile(image, "image.png");
          const report = await runONNXModel(pngImage);

          setDiseaseData(report);
          setIsLoading(false);
        } catch (error) {
          toast.error(error.message, {
            className: "toast-error",
          });
        }
      };

      fetchReport();
    }
  }, [image]);

  const handleClose = () => {
    setDiseaseData(null);
    setImage(null);
    setReportModal(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-[5px]">
      <div className="relative w-full h-full max-container overflow-auto bg-primary shadow-lg">
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
              <div className="overflow-hidden rounded-xl border border-gray-200 shadow-sm">
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
                  <h3 className="font-medium">Diagnosis Results</h3>
                </div>

                <div className="p-[1.5rem] flex flex-col gap-[1.25rem]">
                  <div className="flex items-start gap-[0.75rem]">
                    <div className="flex items-center justify-center w-[2.5rem] h-[2.5rem] bg-green-100 rounded-full flex-shrink-0">
                      <FaLeaf className="text-green-600" size={22} />
                    </div>
                    <div>
                      <h3 className="text-gray-500 font-medium mb-[0.25rem]">
                        DISEASE IDENTIFIED
                      </h3>
                      <h3 className="font-bold text-gray-800">
                        {diseaseData?.disease || "No disease detected"}
                      </h3>
                    </div>
                  </div>
                  <div className="flex items-start gap-[0.75rem]">
                    <div className="flex items-center justify-center w-[2.5rem] h-[2.5rem] bg-blue-100 rounded-full flex-shrink-0">
                      <TbPercentage className="text-blue-600" size={18} />
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
                              width: `${(diseaseData?.confidence || 0) * 100}%`,
                            }}
                          ></div>
                        </div>
                        <p className="mt-[0.5rem] font-bold text-gray-800">
                          {diseaseData?.confidence
                            ? `${(diseaseData.confidence * 100).toFixed(2)}%`
                            : "N/A"}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-start gap-[0.75rem]">
                    <div className="flex items-center justify-center w-[2.5rem] h-[2.5rem] bg-amber-100 rounded-full flex-shrink-0">
                      <AiFillMedicineBox className="text-amber-600" size={22} />
                    </div>
                    <div>
                      <h3 className="text-gray-500 font-medium mb-[0.25rem]">
                        RECOMMENDED ACTION
                      </h3>
                      <h3 className="text-gray-800">
                        {diseaseData?.suggestion || "No specific action needed"}
                      </h3>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex gap-[1rem] mt-[1rem]">
                <button className="flex-1 py-[0.75rem] px-[1rem] bg-green-600 text-white rounded-[0.5rem] font-medium hover:bg-green-700 transition-colors">
                  <h3 className="flex justify-center items-center gap-[1rem]">
                    <MdOutlineSaveAlt size={18} />
                    <span>Save</span>
                  </h3>
                </button>
                <button className="flex-1 py-[0.75rem] px-[1rem] bg-gray-100 text-gray-800 rounded-[0.5rem] font-medium hover:bg-gray-200 transition-colors">
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
  );
};

export default ReportModal;
