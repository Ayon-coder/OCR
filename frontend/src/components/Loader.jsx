import React from 'react';

export default function Loader() {
  return (
    <div className="flex flex-col items-center justify-center space-y-4">
      <div className="relative w-16 h-16">
        <div className="absolute inset-0 rounded-full border-4 border-gray-200"></div>
        <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-blue-500 animate-spin"></div>
      </div>
      <div className="text-center">
        <p className="text-lg font-semibold text-gray-800">Processing your prescription...</p>
        <p className="text-sm text-gray-500 mt-2">
          Extracting text and cleaning data using AI
        </p>
      </div>

      {/* Progress steps */}
      <div className="mt-6 space-y-3 w-64">
        <div className="flex items-center gap-3">
          <div className="flex-shrink-0 w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
            ✓
          </div>
          <span className="text-gray-700">Analyzing image</span>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex-shrink-0 w-8 h-8 bg-blue-400 rounded-full flex items-center justify-center text-white animate-pulse">
            ◐
          </div>
          <span className="text-gray-700">Extracting text with OCR</span>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex-shrink-0 w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center text-white">
            ◯
          </div>
          <span className="text-gray-500">Cleaning and structuring</span>
        </div>
      </div>
    </div>
  );
}
