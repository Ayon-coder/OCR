import React, { useState } from 'react';
import axios from 'axios';
import { Github, Sun, Moon } from 'lucide-react';
import UploadBox from './components/UploadBox';
import ResultCard from './components/ResultCard';
import Loader from './components/Loader';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export default function App() {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [darkMode, setDarkMode] = useState(false);
  const [history, setHistory] = useState([]);

  const handleUpload = async (file) => {
    setIsLoading(true);
    setError(null);
    setResult(null);

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await axios.post(`${API_URL}/upload`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        timeout: 120000, // 2 minutes timeout
      });

      setResult(response.data);

      // Add to history
      setHistory((prev) => [
        {
          timestamp: new Date().toLocaleTimeString(),
          filename: file.name,
          medicines: response.data.cleaned_prescription?.medicines || [],
        },
        ...prev.slice(0, 9), // Keep last 10
      ]);

      console.log('Response:', response.data);
    } catch (err) {
      if (err.response?.data?.error) {
        setError(err.response.data.error);
      } else if (err.message === 'timeout') {
        setError('Request timeout. The image might be too large or the server is busy.');
      } else {
        setError(
          err.response?.status === 413
            ? 'File too large. Please upload an image under 10MB.'
            : `Error: ${err.message}`
        );
      }
      console.error('Upload error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownloadPdf = async (data) => {
    try {
      const response = await axios.post(`${API_URL}/download-pdf`, data, {
        responseType: 'blob',
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'prescription.pdf');
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
    } catch (err) {
      alert('Failed to download PDF: ' + err.message);
    }
  };

  const bgClass = darkMode ? 'bg-gray-900' : 'bg-gradient-to-br from-blue-50 to-indigo-50';
  const textClass = darkMode ? 'text-white' : 'text-gray-900';

  return (
    <div className={`min-h-screen ${bgClass} transition-colors duration-300`}>
      {/* Header */}
      <header className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white'} border-b border-gray-200 sticky top-0 z-50 shadow-sm`}>
        <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center text-white font-bold">
              Rx
            </div>
            <div>
              <h1 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                PrescriptionOCR
              </h1>
              <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                AI-Powered Prescription Digitizer
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setDarkMode(!darkMode)}
              className={`p-2 rounded-lg transition-colors ${
                darkMode
                  ? 'bg-gray-700 text-yellow-400 hover:bg-gray-600'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {darkMode ? <Sun size={20} /> : <Moon size={20} />}
            </button>
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className={`p-2 rounded-lg transition-colors ${
                darkMode
                  ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <Github size={20} />
            </a>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Upload Section */}
          <div className="lg:col-span-3 space-y-8">
            {/* Welcome Section */}
            {!result && (
              <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-2xl shadow-lg p-8`}>
                <h2 className={`text-3xl font-bold ${textClass} mb-4`}>
                  Transform Your Prescriptions
                </h2>
                <p className={`${darkMode ? 'text-gray-300' : 'text-gray-600'} mb-6`}>
                  Upload a photo of a handwritten prescription. Our AI will extract the text and clean it up for you.
                </p>

                <div className="grid grid-cols-3 gap-4 mb-6">
                  <div className={`${darkMode ? 'bg-gray-700' : 'bg-blue-50'} p-4 rounded-lg`}>
                    <div className="text-2xl font-bold text-blue-600 mb-2">1</div>
                    <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      Upload Image
                    </p>
                  </div>
                  <div className={`${darkMode ? 'bg-gray-700' : 'bg-blue-50'} p-4 rounded-lg`}>
                    <div className="text-2xl font-bold text-blue-600 mb-2">2</div>
                    <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      Extract with OCR
                    </p>
                  </div>
                  <div className={`${darkMode ? 'bg-gray-700' : 'bg-blue-50'} p-4 rounded-lg`}>
                    <div className="text-2xl font-bold text-blue-600 mb-2">3</div>
                    <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      Clean & Download
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Upload Box */}
            {!isLoading && !result && <UploadBox onUpload={handleUpload} isLoading={isLoading} />}

            {/* Loader */}
            {isLoading && (
              <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-2xl shadow-lg p-12`}>
                <Loader />
              </div>
            )}

            {/* Error Message */}
            {error && (
              <div className="bg-red-100 border-2 border-red-400 rounded-lg p-6">
                <h3 className="font-bold text-red-800 mb-2">Error</h3>
                <p className="text-red-700">{error}</p>
                <button
                  onClick={() => setError(null)}
                  className="mt-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
                >
                  Dismiss
                </button>
              </div>
            )}

            {/* Results */}
            {result && !isLoading && (
              <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-2xl shadow-lg p-8`}>
                <ResultCard
                  rawText={result.raw_ocr_text}
                  cleanedData={result.cleaned_prescription}
                  onDownloadPdf={handleDownloadPdf}
                />
                <button
                  onClick={() => setResult(null)}
                  className="mt-6 w-full px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-semibold"
                >
                  Process Another Prescription
                </button>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            {/* Info Card */}
            <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-2xl shadow-lg p-6 mb-6`}>
              <h3 className={`font-bold text-lg mb-4 ${textClass}`}>Features</h3>
              <ul className={`space-y-3 text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                <li className="flex items-start gap-2">
                  <span className="text-blue-500 font-bold">✓</span>
                  <span>Fast OCR processing</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-500 font-bold">✓</span>
                  <span>AI-powered cleaning</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-500 font-bold">✓</span>
                  <span>PDF download</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-500 font-bold">✓</span>
                  <span>Copy to clipboard</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-500 font-bold">✓</span>
                  <span>Dark mode</span>
                </li>
              </ul>
            </div>

            {/* History */}
            {history.length > 0 && (
              <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-2xl shadow-lg p-6`}>
                <h3 className={`font-bold text-lg mb-4 ${textClass}`}>Recent</h3>
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {history.map((item, idx) => (
                    <div
                      key={idx}
                      className={`p-3 rounded-lg ${
                        darkMode ? 'bg-gray-700' : 'bg-gray-50'
                      } text-sm`}
                    >
                      <p className={`font-medium ${textClass}`}>
                        {item.medicines.length} medicines
                      </p>
                      <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                        {item.timestamp}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border-t mt-12 py-6`}>
        <div className="max-w-6xl mx-auto px-4 text-center">
          <p className={`${darkMode ? 'text-gray-400' : 'text-gray-600'} text-sm`}>
            Made with ❤️ for healthcare professionals. Powered by PaddleOCR & Groq API.
          </p>
        </div>
      </footer>
    </div>
  );
}
