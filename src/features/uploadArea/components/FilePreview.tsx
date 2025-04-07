import React, { useState, useEffect } from 'react';
import { FileText, FileType, Download, Eye, File, Info } from 'lucide-react';

interface FilePreviewProps {
  file: File;
  showPreview?: boolean;
}

/**
 * Componente que muestra una previsualización de un archivo con su metadatos
 */
const FilePreview: React.FC<FilePreviewProps> = ({ file, showPreview = true }) => {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isImage, setIsImage] = useState(false);
  const [isPdf, setIsPdf] = useState(false);
  const [isText, setIsText] = useState(false);
  const [textContent, setTextContent] = useState<string | null>(null);
  const [previewError, setPreviewError] = useState<string | null>(null);
  const [expanded, setExpanded] = useState(false);

  // Determinar tipo de archivo
  useEffect(() => {
    setIsImage(file.type.startsWith('image/'));
    setIsPdf(file.type === 'application/pdf');
    setIsText(file.type === 'text/plain');
    
    // Limpiar estado previo
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
      setPreviewUrl(null);
    }
    
    setPreviewError(null);
    setTextContent(null);
    
    // Crear URL para la previsualización
    try {
      if (isImage || isPdf) {
        const url = URL.createObjectURL(file);
        setPreviewUrl(url);
      } else if (isText && showPreview) {
        const reader = new FileReader();
        reader.onload = (e) => {
          try {
            if (e.target?.result) {
              // Truncar texto si es muy largo
              const content = e.target.result.toString();
              setTextContent(content.length > 500 ? `${content.substring(0, 500)}...` : content);
            }
          } catch {
            setPreviewError('No se pudo leer el contenido del archivo');
          }
        };
        reader.onerror = () => {
          setPreviewError('Error al leer el archivo');
        };
        reader.readAsText(file);
      }
    } catch {
      setPreviewError('No se pudo generar la previsualización');
    }
    
    // Limpieza al desmontar
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [file, isImage, isPdf, isText, showPreview, previewUrl]);

  // Formatear el tamaño del archivo
  const formatFileSize = (size: number): string => {
    if (size < 1024) {
      return `${size} bytes`;
    } else if (size < 1024 * 1024) {
      return `${(size / 1024).toFixed(1)} KB`;
    } else {
      return `${(size / (1024 * 1024)).toFixed(1)} MB`;
    }
  };

  // Obtener la fecha de última modificación
  const formatModifiedDate = (date: Date): string => {
    return date.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Renderizar icono según tipo de archivo
  const renderFileIcon = () => {
    if (isPdf) {
      return <FileType className="w-10 h-10 text-red-500 dark:text-red-400" />;
    } else if (isText) {
      return <FileText className="w-10 h-10 text-blue-500 dark:text-blue-400" />;
    }
    return <File className="w-10 h-10 text-gray-500 dark:text-gray-400" />;
  };

  // Manejar descarga
  const handleDownload = () => {
    const url = URL.createObjectURL(file);
    const a = document.createElement('a');
    a.href = url;
    a.download = file.name;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm dark:bg-gray-800 dark:border-gray-700">
      {/* Cabecera con metadatos */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-3">
          {renderFileIcon()}
          <div className="flex-1 min-w-0">
            <h3 className="text-md font-semibold text-gray-800 truncate dark:text-white">
              {file.name}
            </h3>
            <div className="flex text-xs text-gray-500 dark:text-gray-400 mt-1">
              <span className="mr-3">{formatFileSize(file.size)}</span>
              <span>{formatModifiedDate(new Date(file.lastModified))}</span>
            </div>
          </div>
          <div className="flex gap-2">
            <button 
              onClick={handleDownload}
              className="p-1.5 rounded-full text-gray-500 hover:text-indigo-500 hover:bg-indigo-50 dark:text-gray-300 dark:hover:text-indigo-400 dark:hover:bg-indigo-900/30"
              aria-label="Descargar archivo"
            >
              <Download className="w-5 h-5" />
            </button>
            {(isPdf || isImage || isText) && (
              <button 
                onClick={() => setExpanded(!expanded)}
                className="p-1.5 rounded-full text-gray-500 hover:text-indigo-500 hover:bg-indigo-50 dark:text-gray-300 dark:hover:text-indigo-400 dark:hover:bg-indigo-900/30"
                aria-label={expanded ? "Ocultar previsualización" : "Mostrar previsualización"}
              >
                <Eye className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>
      </div>
      
      {/* Previsualización */}
      {showPreview && expanded && (
        <div className="border-t border-gray-200 dark:border-gray-700">
          {previewError ? (
            <div className="p-4 text-sm text-red-500 flex items-center gap-2 dark:text-red-400">
              <Info className="w-4 h-4" />
              {previewError}
            </div>
          ) : isImage && previewUrl ? (
            <div className="p-4 bg-white dark:bg-gray-800">
              <img src={previewUrl} alt={file.name} className="w-full rounded-md border border-gray-100 dark:border-gray-700" />
            </div>
          ) : isPdf && previewUrl ? (
            <div className="p-4 bg-white dark:bg-gray-800">
              <div className="w-full h-[400px] rounded-md border border-gray-100 overflow-hidden dark:border-gray-700 bg-white">
                <iframe 
                  src={`${previewUrl}#toolbar=0`} 
                  title={file.name} 
                  className="w-full h-full"
                />
              </div>
            </div>
          ) : isText && textContent ? (
            <div className="p-4 bg-white dark:bg-gray-800">
              <pre className="text-xs bg-gray-50 p-3 rounded-md overflow-auto max-h-[200px] text-gray-800 dark:bg-gray-900 dark:text-gray-300 dark:border dark:border-gray-700">
                {textContent}
              </pre>
            </div>
          ) : (
            <div className="p-4 text-sm text-gray-500 flex items-center gap-2 dark:text-gray-400">
              <Info className="w-4 h-4" />
              No hay previsualización disponible para este tipo de archivo
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default FilePreview; 