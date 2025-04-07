import React, { useState, useCallback, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import { UploadCloud, File, X, AlertCircle, CheckCircle, FileText, FileType } from 'lucide-react';
import FilePreview from './FilePreview';

interface FileUploaderProps {
  onFilesChange: (files: File[]) => void;
  files: File[];
  isUploading?: boolean;
  uploadProgress?: number;
  disabled?: boolean;
  maxFileSizeMB?: number;
}

const FileUploaderComponent: React.FC<FileUploaderProps> = ({
  onFilesChange,
  files,
  isUploading = false,
  uploadProgress = 0,
  disabled = false,
  maxFileSizeMB = 10
}) => {
  const [dragOver, setDragOver] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fileValidationStatus, setFileValidationStatus] = useState<{[key: string]: 'valid' | 'invalid' | 'validating'}>({});
  const [showFileDetails, setShowFileDetails] = useState(false);

  // Lista de tipos MIME permitidos
  const allowedTypes = ['application/pdf', 'text/plain'];
  const maxFileSize = maxFileSizeMB * 1024 * 1024; // Convertir a bytes

  // Validar archivos cuando cambian
  useEffect(() => {
    const validateFiles = async () => {
      const newStatus: {[key: string]: 'valid' | 'invalid' | 'validating'} = {};
      
      for (const file of files) {
        // Marcar como validando inicialmente
        newStatus[file.name] = 'validating';
        
        // Verificar tamaño
        if (file.size > maxFileSize) {
          newStatus[file.name] = 'invalid';
          continue;
        }
        
        // Verificar tipo
        if (!allowedTypes.includes(file.type)) {
          newStatus[file.name] = 'invalid';
          continue;
        }
        
        // Si pasa todas las validaciones
        newStatus[file.name] = 'valid';
      }
      
      setFileValidationStatus(newStatus);
      
      // Si hay archivos válidos, mostrar detalles
      const hasValidFiles = files.length > 0 && 
        Object.values(newStatus).some(status => status === 'valid');
      
      setShowFileDetails(hasValidFiles);
    };
    
    validateFiles();
  }, [files, maxFileSize]);

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      if (acceptedFiles.length > 0) {
        // Verificar tamaño máximo
        const oversizedFiles = acceptedFiles.filter(file => file.size > maxFileSize);
        if (oversizedFiles.length > 0) {
          setError(`Algunos archivos exceden el límite de ${maxFileSizeMB}MB`);
          return;
        }

        // Verificar tipos de archivo permitidos
        const invalidFiles = acceptedFiles.filter(file => !allowedTypes.includes(file.type));
        if (invalidFiles.length > 0) {
          setError('Solo se permiten archivos PDF y TXT');
          return;
        }

        setError(null);
        onFilesChange([...files, ...acceptedFiles]);
      }
    },
    [onFilesChange, files, maxFileSize, maxFileSizeMB]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    onDragEnter: () => setDragOver(true),
    onDragLeave: () => setDragOver(false),
    accept: {
      'application/pdf': ['.pdf'],
      'text/plain': ['.txt']
    },
    disabled: disabled || isUploading
  });

  const removeFile = (index: number) => {
    const newFiles = [...files];
    newFiles.splice(index, 1);
    onFilesChange(newFiles);
  };

  // Renderizar icono según tipo de archivo
  const renderFileIcon = (file: File) => {
    if (file.type === 'application/pdf') {
      return <FileType className="w-4 h-4 text-red-500" />;
    } else if (file.type === 'text/plain') {
      return <FileText className="w-4 h-4 text-blue-500" />;
    }
    return <File className="w-4 h-4 text-gray-500" />;
  };

  // Renderizar estado de validación
  const renderValidationStatus = (fileName: string) => {
    const status = fileValidationStatus[fileName];
    
    if (status === 'validating') {
      return (
        <div className="flex items-center gap-1 text-yellow-500">
          <div className="w-3 h-3 rounded-full border-2 border-yellow-500 border-t-transparent animate-spin"></div>
          <span className="text-xs">Validando...</span>
        </div>
      );
    } else if (status === 'valid') {
      return (
        <div className="flex items-center gap-1 text-green-500">
          <CheckCircle className="w-3 h-3" />
          <span className="text-xs">Válido</span>
        </div>
      );
    } else if (status === 'invalid') {
      return (
        <div className="flex items-center gap-1 text-red-500">
          <AlertCircle className="w-3 h-3" />
          <span className="text-xs">Inválido</span>
        </div>
      );
    }
    
    return null;
  };

  // Renderizar la vista previa o lista simple de archivos
  const renderFilesList = () => {
    if (showFileDetails && !isUploading) {
      return (
        <div className="space-y-4">
          {files.map((file, index) => (
            fileValidationStatus[file.name] === 'valid' && (
              <div key={index} className="relative">
                <FilePreview file={file} />
                <button
                  type="button"
                  onClick={() => removeFile(index)}
                  disabled={isUploading}
                  className="absolute top-2 right-2 p-1.5 rounded-full bg-white text-red-500 hover:bg-red-50 shadow-sm"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            )
          ))}
        </div>
      );
    }

    return (
      <div className="space-y-2">
        {files.map((file, index) => (
          <div
            key={index}
            className={`flex items-center justify-between p-3 rounded-lg border group
              ${fileValidationStatus[file.name] === 'valid' 
                ? 'bg-green-50/50 border-green-200 hover:border-green-300' 
                : fileValidationStatus[file.name] === 'invalid'
                  ? 'bg-red-50/50 border-red-200 hover:border-red-300'
                  : 'bg-gray-50 border-gray-200 hover:border-indigo-200'
              } transition-colors`}
          >
            <div className="flex items-center gap-3 flex-1 min-w-0">
              <div className="p-2 bg-white rounded-md border border-gray-200">
                {renderFileIcon(file)}
              </div>
              <div className="flex flex-col flex-1 min-w-0">
                <span className="text-sm font-medium text-gray-700 truncate max-w-full">
                  {file.name}
                </span>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-500">
                    {(file.size / 1024).toFixed(1)} KB
                  </span>
                  {renderValidationStatus(file.name)}
                </div>
              </div>
            </div>
            <button
              type="button"
              onClick={() => removeFile(index)}
              disabled={isUploading}
              className={`p-1.5 rounded-full text-gray-400 
                ${isUploading 
                  ? 'opacity-50 cursor-not-allowed' 
                  : 'hover:text-red-500 hover:bg-red-50'} 
                transition-colors`}
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="space-y-4">
      {files.length === 0 && (
        <div
          {...getRootProps()}
          className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all duration-200 ${
            disabled ? 'opacity-60 cursor-not-allowed bg-gray-100' :
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
            <p className="text-xs text-gray-400">PDF, TXT (máx. {maxFileSizeMB}MB)</p>
          </div>
        </div>
      )}

      {files.length > 0 && (
        <div className="flex flex-col">
          {/* Botón para agregar más archivos */}
          <button
            {...getRootProps()}
            disabled={disabled || isUploading}
            className={`mb-4 py-2 px-4 border-2 border-dashed rounded-lg flex items-center justify-center gap-2 ${
              disabled || isUploading 
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed border-gray-200 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-600'
                : 'text-indigo-600 hover:bg-indigo-50 border-indigo-200 hover:border-indigo-300 dark:text-indigo-400 dark:border-indigo-700 dark:hover:border-indigo-600 dark:hover:bg-indigo-900/20'
            }`}
          >
            <input {...getInputProps()} />
            <UploadCloud className="w-4 h-4" />
            <span className="text-sm font-medium">Agregar más archivos</span>
          </button>
          
          {/* Lista de archivos */}
          {renderFilesList()}
        </div>
      )}

      {error && (
        <div className="p-3 bg-red-50 rounded-lg flex items-center gap-2 text-sm text-red-600">
          <AlertCircle className="w-4 h-4" />
          <span>{error}</span>
        </div>
      )}

      {/* Barra de progreso para archivos en carga */}
      {isUploading && uploadProgress > 0 && (
        <div className="mt-4">
          <div className="flex justify-between text-sm text-gray-600 mb-1">
            <span>Subiendo archivos...</span>
            <span>{uploadProgress}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-600">
            <div
              className="bg-indigo-600 h-2.5 rounded-full transition-all duration-300"
              style={{ width: `${uploadProgress}%` }}
            ></div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FileUploaderComponent;
