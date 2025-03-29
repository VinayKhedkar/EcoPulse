"use client";
import { useState, useEffect } from "react";
import Image from "next/image";

const Base64Image = ({
  base64,
  alt = "Image",
  width = 500,
  height = 500,
  classname,
}) => {
  const [imageSrc, setImageSrc] = useState(null);

  useEffect(() => {
    if (!base64) return;

    if (base64.startsWith("data:image")) {
      const byteCharacters = atob(base64.split(",")[1]);
      const byteNumbers = new Array(byteCharacters.length)
        .fill(null)
        .map((_, i) => byteCharacters.charCodeAt(i));
      const byteArray = new Uint8Array(byteNumbers);
      const blob = new Blob([byteArray], { type: "image/png" });
      const blobUrl = URL.createObjectURL(blob);

      setImageSrc(blobUrl);

      return () => URL.revokeObjectURL(blobUrl);
    }
  }, [base64]);

  if (!imageSrc) return <p>Loading image...</p>;

  return (
    <Image
      src={imageSrc}
      alt={alt}
      width={width}
      height={height}
      className={classname}
    />
  );
};

export default Base64Image;
