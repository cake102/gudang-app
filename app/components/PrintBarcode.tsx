// components/PrintBarcode.tsx
import React, { useEffect, useRef } from "react";
import JsBarcode from "jsbarcode";

type PrintBarcodeProps = {
  value: string;
  onImageReady?: (dataUrl: string) => void;
};

const PrintBarcode = ({ value, onImageReady }: PrintBarcodeProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (canvasRef.current && value) {
      JsBarcode(canvasRef.current, value, {
        format: "CODE128",
        width: 2,
        height: 60,
        displayValue: true,
      });
      if (onImageReady) {
        setTimeout(() => {
          const dataUrl = canvasRef.current?.toDataURL();
          if (dataUrl) onImageReady(dataUrl);
        }, 100); // beri delay agar barcode sudah ter-render
      }
    }
  }, [value, onImageReady]);

  return (
    <div className="flex flex-col items-center">
      <canvas ref={canvasRef} />
      <div className="text-center mt-2 text-xs text-gray-500 break-all">{value}</div>
    </div>
  );
};

export default PrintBarcode;
