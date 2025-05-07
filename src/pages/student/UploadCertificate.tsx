import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Upload, 
  FileText, 
  Calendar, 
  Tag, 
  AlignLeft, 
  AlertCircle,
  X,
  Check
} from 'lucide-react';
import { CertificateCategory, CertificateFormData } from '../../types';
import { useCertificates } from '../../context/CertificateContext';

const UploadCertificate: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const [formData, setFormData] = useState<Omit<CertificateFormData, 'file'>>({
    title: '',
    description: '',
    category: 'Academic' as CertificateCategory,
    issueDate: new Date().toISOString().split('T')[0]
  });
  const [formError, setFormError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  const { addNewCertificate, error, clearError } = useCertificates();

  const categories: CertificateCategory[] = [
    'Academic',
    'Co-curricular',
    'Cultural',
    'Social',
    'Sports',
    'Workshop',
    'Internship',
    'Other'
  ];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    clearError();
    setFormError('');
    
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      handleFileValidation(selectedFile);
    }
  };

  const handleFileValidation = (selectedFile: File) => {
    // Check file type
    const validTypes = ['application/pdf', 'image/jpeg', 'image/png'];
    if (!validTypes.includes(selectedFile.type)) {
      setFormError('Please upload a PDF, JPEG, or PNG file');
      return;
    }
    
    // Check file size (5MB max)
    if (selectedFile.size > 5 * 1024 * 1024) {
      setFormError('File size should be less than 5MB');
      return;
    }
    
    setFile(selectedFile);
    
    // Create preview for images
    if (selectedFile.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(selectedFile);
    } else {
      // Show a generic PDF preview
      setPreview('pdf');
    }
  };

  const handleDrag = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileValidation(e.dataTransfer.files[0]);
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleRemoveFile = () => {
    setFile(null);
    setPreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();
    setFormError('');
    
    if (!file) {
      setFormError('Please upload a certificate file');
      return;
    }
    
    if (!formData.title) {
      setFormError('Please enter a certificate title');
      return;
    }
    
    try {
      setIsSubmitting(true);
      
      await addNewCertificate({
        ...formData,
        file
      });
      
      // Show success message
      setShowSuccess(true);
      
      // Reset form after 2 seconds and redirect
      setTimeout(() => {
        setShowSuccess(false);
        navigate('/student/certificates');
      }, 2000);
      
    } catch (err) {
      console.error('Upload failed:', err);
      setFormError('Failed to upload certificate. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <div className="mb-5">
        <h1 className="text-2xl font-bold text-gray-900">Upload Certificate</h1>
        <p className="text-gray-600">Upload your academic and co-curricular achievements</p>
      </div>

      {/* Success message */}
      {showSuccess && (
        <div className="mb-6 bg-green-50 border border-green-200 rounded-md p-4 flex items-start">
          <Check className="h-5 w-5 text-green-500 mt-0.5 mr-2" />
          <div>
            <p className="text-sm font-medium text-green-800">Certificate uploaded successfully!</p>
            <p className="text-sm text-green-700 mt-1">Redirecting to your certificates...</p>
          </div>
        </div>
      )}

      {/* Error message */}
      {(formError || error) && (
        <div className="mb-6 bg-red-50 border border-red-200 rounded-md p-4 flex items-start">
          <AlertCircle className="h-5 w-5 text-red-500 mt-0.5 mr-2" />
          <p className="text-sm text-red-700">{formError || error}</p>
        </div>
      )}

      <div className="bg-white rounded-lg shadow p-6">
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* File upload section */}
            <div>
              <div 
                className={`border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center h-64 relative ${
                  dragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-gray-400'
                } ${file ? 'bg-gray-50' : ''}`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  onChange={handleFileChange}
                  accept=".pdf,.jpg,.jpeg,.png"
                  className="hidden"
                />
                
                {!file ? (
                  // Upload prompt
                  <div className="text-center">
                    <Upload className="h-10 w-10 text-gray-400 mx-auto mb-3" />
                    <p className="text-gray-700 font-medium mb-1">
                      Drag and drop your certificate or
                    </p>
                    <button
                      type="button"
                      onClick={handleUploadClick}
                      className="text-blue-600 hover:text-blue-800 font-medium"
                    >
                      Browse files
                    </button>
                    <p className="text-xs text-gray-500 mt-2">
                      Supports: PDF, JPEG, PNG (Max 5MB)
                    </p>
                  </div>
                ) : (
                  // File preview
                  <div className="w-full text-center relative">
                    {preview && preview !== 'pdf' ? (
                      <div className="h-44 mb-2 flex items-center justify-center">
                        <img
                          src={preview}
                          alt="Certificate preview"
                          className="max-h-full max-w-full object-contain rounded"
                        />
                      </div>
                    ) : (
                      <div className="h-44 mb-2 flex items-center justify-center">
                        <FileText className="h-24 w-24 text-gray-400" />
                      </div>
                    )}
                    <p className="text-sm text-gray-700 font-medium mb-1 truncate">
                      {file.name}
                    </p>
                    <p className="text-xs text-gray-500">
                      {(file.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                    
                    <button
                      type="button"
                      onClick={handleRemoveFile}
                      className="absolute top-0 right-0 p-1 bg-red-100 rounded-full text-red-600 hover:bg-red-200"
                    >
                      <X size={16} />
                    </button>
                  </div>
                )}
              </div>
            </div>
            
            {/* Form fields */}
            <div className="space-y-4">
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                  Certificate Title <span className="text-red-500">*</span>
                </label>
                <div className="mt-1 relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FileText size={16} className="text-gray-400" />
                  </div>
                  <input
                    type="text"
                    id="title"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    required
                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    placeholder="e.g., Web Development Certification"
                  />
                </div>
              </div>
              
              <div>
                <label htmlFor="category" className="block text-sm font-medium text-gray-700">
                  Category <span className="text-red-500">*</span>
                </label>
                <div className="mt-1 relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Tag size={16} className="text-gray-400" />
                  </div>
                  <select
                    id="category"
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    required
                    className="block w-full pl-10 pr-10 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  >
                    {categories.map((category) => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              
              <div>
                <label htmlFor="issueDate" className="block text-sm font-medium text-gray-700">
                  Issue Date <span className="text-red-500">*</span>
                </label>
                <div className="mt-1 relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Calendar size={16} className="text-gray-400" />
                  </div>
                  <input
                    type="date"
                    id="issueDate"
                    name="issueDate"
                    value={formData.issueDate}
                    onChange={handleChange}
                    required
                    max={new Date().toISOString().split('T')[0]}
                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  />
                </div>
              </div>
              
              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                  Description
                </label>
                <div className="mt-1 relative">
                  <div className="absolute top-3 left-3 flex items-start pointer-events-none">
                    <AlignLeft size={16} className="text-gray-400" />
                  </div>
                  <textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    rows={3}
                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    placeholder="Briefly describe your achievement"
                  ></textarea>
                </div>
              </div>
            </div>
          </div>
          
          <div className="mt-6 flex justify-end space-x-3">
            <button
              type="button"
              onClick={() => navigate('/student/certificates')}
              className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting || !file}
              className={`px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 flex items-center ${
                isSubmitting ? 'opacity-70 cursor-not-allowed' : ''
              }`}
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></div>
                  Uploading...
                </>
              ) : (
                <>
                  <Upload size={16} className="mr-2" />
                  Upload Certificate
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UploadCertificate;