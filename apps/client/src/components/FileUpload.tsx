import { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, FileText, X } from 'lucide-react';
import { cn, formatFileSize } from '@/lib/utils';

interface FileUploadProps {
  label: string;
  description?: string;
  onFileSelect: (file: File | null) => void;
  file: File | null;
  accept?: string;
}

export default function FileUpload({
  label,
  description,
  onFileSelect,
  file,
  accept = '.pdf',
}: FileUploadProps) {
  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      if (acceptedFiles.length > 0) {
        onFileSelect(acceptedFiles[0]);
      }
    },
    [onFileSelect]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
    },
    maxFiles: 1,
    maxSize: 10 * 1024 * 1024, // 10MB
  });

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation();
    onFileSelect(null);
  };

  return (
    <div className="space-y-2">
      <label className="block text-sm font-semibold text-gray-700">{label}</label>
      {description && <p className="text-sm text-gray-500">{description}</p>}
      
      <div
        {...getRootProps()}
        className={cn(
          'relative border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all duration-200',
          isDragActive && 'border-blue-500 bg-blue-50 scale-[1.02]',
          file && 'border-green-500 bg-green-50',
          !isDragActive && !file && 'border-gray-300 hover:border-gray-400 hover:bg-gray-50'
        )}
      >
        <input {...getInputProps()} accept={accept} />
        
        {file ? (
          <div className="space-y-2">
            <div className="flex items-center justify-center">
              <div className="p-3 bg-green-100 rounded-full">
                <FileText className="w-8 h-8 text-green-600" />
              </div>
            </div>
            <div>
              <p className="font-medium text-gray-900">{file.name}</p>
              <p className="text-sm text-gray-500">{formatFileSize(file.size)}</p>
            </div>
            <button
              onClick={handleRemove}
              className="absolute top-2 right-2 p-1 bg-red-100 rounded-full hover:bg-red-200 transition-colors"
              aria-label="Remove file"
            >
              <X className="w-4 h-4 text-red-600" />
            </button>
          </div>
        ) : (
          <div className="space-y-2">
            <div className="flex items-center justify-center">
              <div className={cn(
                'p-3 rounded-full transition-colors',
                isDragActive ? 'bg-blue-100' : 'bg-gray-100'
              )}>
                <Upload className={cn(
                  'w-8 h-8',
                  isDragActive ? 'text-blue-600' : 'text-gray-400'
                )} />
              </div>
            </div>
            <div>
              <p className="font-medium text-gray-700">
                {isDragActive ? 'Drop your file here' : 'Drag & drop your file here'}
              </p>
              <p className="text-sm text-gray-500 mt-1">or click to browse</p>
              <p className="text-xs text-gray-400 mt-2">PDF files up to 10MB</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
