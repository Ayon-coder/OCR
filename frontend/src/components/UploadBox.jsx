import React, { useState, useRef } from 'react';
import { Upload, X } from 'lucide-react';

export default function UploadBox({ onUpload, isLoading }) {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef(null);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const droppedFile = e.dataTransfer.files[0];
      handleFile(droppedFile);
    }
  };

  const handleFile = (selectedFile) => {
    const validTypes = ['image/png', 'image/jpeg', 'image/jpg', 'image/gif', 'image/bmp', 'image/webp'];
    
    if (!validTypes.includes(selectedFile.type)) {
      alert('Please upload a valid image file (PNG, JPG, GIF, BMP, or WEBP)');
      return;
    }

    if (selectedFile.size > 10 * 1024 * 1024) {
      alert('File size must be less than 10MB');
      return;
    }

    setFile(selectedFile);

    // Create preview
    const reader = new FileReader();
    reader.onload = (e) => {
      setPreview(e.target.result);
    };
    reader.readAsDataURL(selectedFile);
  };

  const handleInputChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleUpload = () => {
    if (!file) {
      alert('Please select an image first');
      return;
    }
    onUpload(file);
  };

  const handleClear = () => {
    setFile(null);
    setPreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div
        className={`relative rounded-2xl border-2 border-dashed transition-all duration-300 p-8 ${
          dragActive
            ? 'border-blue-500 bg-blue-50'
            : 'border-gray-300 bg-gray-50 hover:border-blue-400'
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        {!preview ? (
          <div className="text-center">
            <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <p className="text-xl font-semibold text-gray-700 mb-2">
              Drag and drop your prescription image
            </p>
            <p className="text-gray-500 mb-4">or</p>
            <button
              onClick={() => fileInputRef.current?.click()}
              className="inline-block px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-medium"
              disabled={isLoading}
            >
              Browse Files
            </button>
            <p className="text-sm text-gray-500 mt-4">
              Supported formats: PNG, JPG, GIF, BMP, WEBP (Max 10MB)
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="relative">
              <img
                src={preview}
                alt="Preview"
                className="w-full max-h-96 object-cover rounded-lg border border-gray-300"
              />
              {!isLoading && (
                <button
                  onClick={handleClear}
                  className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition-colors"
                >
                  <X size={20} />
                </button>
              )}
            </div>
            <div className="flex gap-3">
              <button
                onClick={handleUpload}
                disabled={isLoading}
                className={`flex-1 px-6 py-3 bg-blue-500 text-white rounded-lg font-semibold transition-colors ${
                  isLoading
                    ? 'bg-blue-400 cursor-not-allowed'
                    : 'hover:bg-blue-600'
                }`}
              >
                {isLoading ? 'Processing...' : 'Upload & Process'}
              </button>
              <button
                onClick={handleClear}
                disabled={isLoading}
                className={`px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg font-semibold transition-colors ${
                  isLoading
                    ? 'opacity-50 cursor-not-allowed'
                    : 'hover:border-gray-400 hover:bg-gray-50'
                }`}
              >
                Clear
              </button>
            </div>
          </div>
        )}
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleInputChange}
        className="hidden"
        disabled={isLoading}
      />
    </div>
  );
}
