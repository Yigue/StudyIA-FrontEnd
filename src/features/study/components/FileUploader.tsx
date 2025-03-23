import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { UploadCloud, File, X, AlertCircle } from 'lucide-react';

interface FileUploaderProps {
  onFilesChange: (files: File[]) => void;
  files: File[];
}

const FileUploaderComponent: React.FC<FileUploaderProps> = ({
  onFilesChange,
  files
}) => {
  const [dragOver, setDragOver] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      if (acceptedFiles.length > 0) {
        // Verificar tamaño máximo (10MB)
        const oversizedFiles = acceptedFiles.filter(file => file.size > 10 * 1024 * 1024);
        if (oversizedFiles.length > 0) {
          setError('Algunos archivos exceden el límite de 10MB');
          return;
        }

        // Verificar tipos de archivo permitidos
        const allowedTypes = ['application/pdf', 'text/plain'];
        const invalidFiles = acceptedFiles.filter(file => !allowedTypes.includes(file.type));
        if (invalidFiles.length > 0) {
          setError('Solo se permiten archivos PDF y TXT');
          return;
        }

        setError(null);
        onFilesChange([...files, ...acceptedFiles]);
      }
    },
    [onFilesChange, files]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    onDragEnter: () => setDragOver(true),
    onDragLeave: () => setDragOver(false),
    accept: {
      'application/pdf': ['.pdf'],
      'text/plain': ['.txt']
    }
  });

  const removeFile = (index: number) => {
    const newFiles = [...files];
    newFiles.splice(index, 1);
    onFilesChange(newFiles);
  };

  return (
    <div className="space-y-4">
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all duration-200 ${
          dragOver || isDragActive
            ? 'border-indigo-400 bg-indigo-50'
            : 'border-gray-300 hover:border-indigo-300 hover:bg-indigo-50/50'
        }`}
      >
        <input {...getInputProps()} />
        <div className="flex flex-col items-center">
          <UploadCloud
            className={`w-12 h-12 mb-4 ${
              dragOver || isDragActive ? 'text-indigo-500' : 'text-gray-400'
            }`}
          />
          <p className="text-sm font-medium text-gray-700 mb-1">
            {isDragActive ? 'Suelta tus archivos aquí' : 'Arrastra y suelta tus archivos aquí'}
          </p>
          <p className="text-xs text-gray-500 mb-2">o haz clic para seleccionar</p>
          <p className="text-xs text-gray-400">PDF, TXT (máx. 10MB)</p>
        </div>
      </div>

      {error && (
        <div className="p-3 bg-red-50 rounded-lg flex items-center gap-2 text-sm text-red-600">
          <AlertCircle className="w-4 h-4" />
          <span>{error}</span>
        </div>
      )}

      {files.length > 0 && (
        <div className="mt-4">
          <h4 className="text-sm font-medium text-gray-700 mb-2">Archivos seleccionados:</h4>
          <div className="space-y-2">
            {files.map((file, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200 group hover:border-indigo-200 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-white rounded-md border border-gray-200">
                    <File className="w-4 h-4 text-gray-500" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm font-medium text-gray-700 truncate max-w-[200px]">
                      {file.name}
                    </span>
                    <span className="text-xs text-gray-500">
                      {(file.size / 1024).toFixed(1)} KB
                    </span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => removeFile(index)}
                  className="p-1.5 rounded-full text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default FileUploaderComponent;
