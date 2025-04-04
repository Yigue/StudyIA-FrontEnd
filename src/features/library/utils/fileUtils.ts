import { 
  File,
  FileImage,
  FileVideo,
  FileType,
  FileCode,
  LucideIcon
} from "lucide-react";

/**
 * Determina el ícono adecuado según la extensión del archivo
 * 
 * @param fileName Nombre del archivo con extensión
 * @returns Componente Lucide Icon correspondiente al tipo de archivo
 */
export const getFileIcon = (fileName?: string): LucideIcon => {
  if (!fileName) return File;
  
  const ext = fileName.split('.').pop()?.toLowerCase() || '';
  
  switch (ext) {
    // Imágenes
    case 'jpg':
    case 'jpeg':
    case 'png':
    case 'gif':
    case 'svg':
    case 'webp':
      return FileImage;
      
    // Videos
    case 'mp4':
    case 'webm':
    case 'mov':
    case 'avi':
      return FileVideo;
      
    // Documentos
    case 'pdf':
    case 'doc':
    case 'docx':
    case 'xls':
    case 'xlsx':
    case 'csv':
    case 'ppt':
    case 'pptx':
      return FileType;
      
    // Código
    case 'js':
    case 'ts':
    case 'jsx':
    case 'tsx':
    case 'html':
    case 'css':
    case 'py':
    case 'java':
    case 'c':
    case 'cpp':
    case 'json':
    case 'xml':
      return FileCode;
      
    // Por defecto
    default:
      return File;
  }
};

/**
 * Formatea el tamaño de archivo a KB, MB, etc.
 * 
 * @param sizeInBytes Tamaño en bytes
 * @param fallback Texto a mostrar si el tamaño es undefined
 * @returns Texto formateado con unidades
 */
export const formatFileSize = (sizeInBytes?: number, fallback: string = 'N/A'): string => {
  if (sizeInBytes === undefined || sizeInBytes === null) {
    return fallback;
  }
  
  // Menos de 1KB
  if (sizeInBytes < 1024) {
    return `${sizeInBytes} B`;
  }
  
  // KB
  if (sizeInBytes < 1024 * 1024) {
    return `${(sizeInBytes / 1024).toFixed(2)} KB`;
  }
  
  // MB
  if (sizeInBytes < 1024 * 1024 * 1024) {
    return `${(sizeInBytes / (1024 * 1024)).toFixed(2)} MB`;
  }
  
  // GB
  return `${(sizeInBytes / (1024 * 1024 * 1024)).toFixed(2)} GB`;
}; 