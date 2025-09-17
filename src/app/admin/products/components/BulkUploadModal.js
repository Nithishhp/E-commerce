'use client';

import { useState, useRef } from 'react';
import { toast } from 'react-hot-toast';
import * as XLSX from 'xlsx';

export default function BulkUploadModal({ onClose, onSuccess }) {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [previewData, setPreviewData] = useState(null);
  const [uploadResults, setUploadResults] = useState(null);
  const fileInputRef = useRef(null);
  
  const handleFileChange = async (e) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile) return;
    
    // Validate file type
    const fileType = selectedFile.type;
    const validTypes = [
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'application/octet-stream'
    ];
    
    if (!validTypes.includes(fileType)) {
      toast.error('Please select an Excel file (.xlsx or .xls)');
      return;
    }
    
    setFile(selectedFile);
    
    // Generate preview
    try {
      const buffer = await selectedFile.arrayBuffer();
      const workbook = XLSX.read(buffer, { type: 'buffer' });
      
      // Get the first worksheet
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      
      // Convert to JSON
      const data = XLSX.utils.sheet_to_json(worksheet);
      
      // Show preview of first 5 rows
      setPreviewData(data.slice(0, 5));
    } catch (error) {
      console.error('Error parsing Excel file:', error);
      toast.error('Failed to parse Excel file');
    }
  };
  
  const handleUpload = async () => {
    if (!file) {
      toast.error('Please select a file first');
      return;
    }
    
    setLoading(true);
    
    try {
      const formData = new FormData();
      formData.append('file', file);
      
      const response = await fetch('/api/products/bulk-upload', {
        method: 'POST',
        body: formData,
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || data.details || 'Failed to upload products');
      }
      
      setUploadResults(data.results);
      toast.success(`Uploaded ${data.results.success.length} products successfully`);
      
      if (data.results.errors.length > 0) {
        toast.error(`Failed to upload ${data.results.errors.length} products`);
      }
      
      if (data.results.errors.length === 0) {
        // If no errors, close modal after 2 seconds
        setTimeout(() => {
          if (onSuccess) onSuccess();
          onClose();
        }, 2000);
      }
    } catch (error) {
      console.error('Error uploading products:', error);
      toast.error(error.message || 'Failed to upload products');
    } finally {
      setLoading(false);
    }
  };
  
  const downloadTemplate = () => {
    // Create a template workbook
    const wb = XLSX.utils.book_new();
    
    // Define the template data with headers and one example row
    const templateData = [
      {
        name: 'Example Plant',
        price: 19.99,
        description: 'This is an example plant description',
        category: 'Indoor Plants',
        image: 'https://example.com/image.jpg',
        season: 'Spring,Summer',
        availability: true,
        rating: 4.5,
        reviews: 10
      }
    ];
    
    // Create worksheet
    const ws = XLSX.utils.json_to_sheet(templateData);
    
    // Add column headers
    XLSX.utils.book_append_sheet(wb, ws, 'Products');
    
    // Generate Excel file
    XLSX.writeFile(wb, 'product_upload_template.xlsx');
  };
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 text-gray-700">
      <div className="bg-white rounded-lg p-6 w-full max-w-3xl max-h-[90vh] overflow-y-auto">
        <h2 className="text-2xl font-bold mb-4">Bulk Upload Products</h2>
        
        <div className="mb-6">
          <p className="text-gray-600 mb-2">
            Upload multiple products at once using an Excel spreadsheet.
          </p>
          <button
            onClick={downloadTemplate}
            className="text-blue-600 hover:underline"
          >
            Download template spreadsheet
          </button>
        </div>
        
        <div className="mb-6">
          <div className="flex items-center space-x-2 mb-4">
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept=".xlsx,.xls"
              className="hidden"
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
              disabled={loading}
            >
              Select Excel File
            </button>
            {file && (
              <span className="text-sm text-gray-500">
                {file.name}
              </span>
            )}
          </div>
          
          {previewData && (
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-2">Preview (first 5 rows):</h3>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      {Object.keys(previewData[0]).map((header) => (
                        <th 
                          key={header}
                          className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          {header}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {previewData.map((row, index) => (
                      <tr key={index}>
                        {Object.values(row).map((value, i) => (
                          <td 
                            key={i}
                            className="px-3 py-2 whitespace-nowrap text-sm text-gray-500"
                          >
                            {typeof value === 'object' ? JSON.stringify(value) : String(value)}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
          
          {uploadResults && (
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-2">Upload Results:</h3>
              
              {uploadResults.success.length > 0 && (
                <div className="mb-4">
                  <h4 className="text-green-600 font-medium mb-1">
                    Successfully uploaded {uploadResults.success.length} products
                  </h4>
                  <ul className="text-sm text-gray-600 ml-5 list-disc">
                    {uploadResults.success.slice(0, 5).map((item) => (
                      <li key={item.id}>
                        Row {item.row}: {item.name} (ID: {item.id})
                      </li>
                    ))}
                    {uploadResults.success.length > 5 && (
                      <li>...and {uploadResults.success.length - 5} more</li>
                    )}
                  </ul>
                </div>
              )}
              
              {uploadResults.errors.length > 0 && (
                <div>
                  <h4 className="text-red-600 font-medium mb-1">
                    Failed to upload {uploadResults.errors.length} products
                  </h4>
                  <ul className="text-sm text-gray-600 ml-5 list-disc">
                    {uploadResults.errors.map((item) => (
                      <li key={item.row} className="text-red-500">
                        Row {item.row}: {item.name} - {item.error}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </div>
        
        <div className="flex justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
            disabled={loading}
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleUpload}
            className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50"
            disabled={!file || loading}
          >
            {loading ? 'Uploading...' : 'Upload Products'}
          </button>
        </div>
      </div>
    </div>
  );
}