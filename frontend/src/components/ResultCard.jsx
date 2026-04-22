import React from 'react';
import { Copy, Download, AlertCircle } from 'lucide-react';

export default function ResultCard({ rawText, cleanedData, onDownloadPdf }) {
  const [copied, setCopied] = React.useState(null);
  const [activeTab, setActiveTab] = React.useState('raw');

  const copyToClipboard = (text, type) => {
    navigator.clipboard.writeText(text);
    setCopied(type);
    setTimeout(() => setCopied(null), 2000);
  };

  const medicines = cleanedData?.medicines || [];
  const notes = cleanedData?.notes || '';
  const error = cleanedData?.error;

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      {/* Tabs */}
      <div className="flex gap-4 border-b border-gray-200">
        <button
          onClick={() => setActiveTab('raw')}
          className={`px-4 py-3 font-semibold transition-colors ${
            activeTab === 'raw'
              ? 'text-blue-600 border-b-2 border-blue-600'
              : 'text-gray-600 hover:text-gray-800'
          }`}
        >
          Raw OCR Text
        </button>
        <button
          onClick={() => setActiveTab('cleaned')}
          className={`px-4 py-3 font-semibold transition-colors ${
            activeTab === 'cleaned'
              ? 'text-blue-600 border-b-2 border-blue-600'
              : 'text-gray-600 hover:text-gray-800'
          }`}
        >
          Cleaned Prescription
        </button>
      </div>

      {/* Raw Text Tab */}
      {activeTab === 'raw' && (
        <div className="bg-white rounded-lg border border-gray-200 p-6 space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold text-gray-800">Raw OCR Output</h3>
            <button
              onClick={() => copyToClipboard(rawText, 'raw')}
              className="flex items-center gap-2 px-3 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition-colors"
            >
              <Copy size={18} />
              {copied === 'raw' ? 'Copied!' : 'Copy'}
            </button>
          </div>
          <div className="bg-gray-50 p-4 rounded border border-gray-200 max-h-64 overflow-y-auto whitespace-pre-wrap font-mono text-sm text-gray-700">
            {rawText || 'No text extracted'}
          </div>
        </div>
      )}

      {/* Cleaned Text Tab */}
      {activeTab === 'cleaned' && (
        <div className="bg-white rounded-lg border border-gray-200 p-6 space-y-6">
          {error ? (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 flex gap-3">
              <AlertCircle className="text-yellow-600 flex-shrink-0" size={20} />
              <div>
                <p className="font-semibold text-yellow-800">Processing Note</p>
                <p className="text-yellow-700">{error}</p>
              </div>
            </div>
          ) : null}

          {medicines.length > 0 && (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold text-gray-800">Medicines</h3>
                <button
                  onClick={() => onDownloadPdf({ medicines, notes })}
                  className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                >
                  <Download size={18} />
                  Download PDF
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-blue-50 border-b border-gray-200">
                      <th className="px-4 py-3 text-left font-semibold text-gray-700">Medicine</th>
                      <th className="px-4 py-3 text-left font-semibold text-gray-700">Dosage</th>
                      <th className="px-4 py-3 text-left font-semibold text-gray-700">Schedule</th>
                    </tr>
                  </thead>
                  <tbody>
                    {medicines.map((med, idx) => (
                      <tr
                        key={idx}
                        className={`border-b border-gray-200 ${
                          idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'
                        } hover:bg-blue-50 transition-colors`}
                      >
                        <td className="px-4 py-3 text-gray-800 font-medium">{med.name}</td>
                        <td className="px-4 py-3 text-gray-700">{med.dosage}</td>
                        <td className="px-4 py-3 text-gray-700">{med.schedule}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <button
                onClick={() =>
                  copyToClipboard(
                    medicines.map(m => `${m.name} - ${m.dosage} - ${m.schedule}`).join('\n'),
                    'medicines'
                  )
                }
                className="flex items-center gap-2 px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition-colors"
              >
                <Copy size={18} />
                {copied === 'medicines' ? 'Copied!' : 'Copy Medicines'}
              </button>
            </div>
          )}

          {notes && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h4 className="font-semibold text-blue-900 mb-2">Notes</h4>
              <p className="text-blue-800">{notes}</p>
            </div>
          )}

          {medicines.length === 0 && !error && (
            <div className="text-center py-8 text-gray-500">
              <p>No medicines detected. Please check the raw text above.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
