import { FileUp } from 'lucide-react';
import { useRef } from 'react';

interface FileUploaderProps {
  dragActive: boolean;
  onDrag: (e: React.DragEvent) => void;
  onDrop: (e: React.DragEvent) => void;
  onFileSelect: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const FileUploader = ({
  dragActive,
  onDrag,
  onDrop,
  onFileSelect
}: FileUploaderProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  return (
    <div
      className={`border-2 border-dashed rounded-xl p-8 flex flex-col items-center justify-center min-h-[200px] transition-colors ${
        dragActive ? 'border-indigo-500 bg-indigo-50' : 'border-gray-300'
      }`}
      onDragEnter={onDrag}
      onDragLeave={onDrag}
      onDragOver={onDrag}
      onDrop={onDrop}
    >
      <FileUp className="w-12 h-12 text-gray-400 mb-4" />
      <p className="text-lg text-gray-600 text-center mb-2">
        Arrastra y suelta tus documentos aquí
      </p>
      <p className="text-sm text-gray-500 text-center mb-4">
        o haz clic para seleccionar archivos
      </p>
      <input
        ref={fileInputRef}
        type="file"
        multiple
        className="hidden"
        onChange={onFileSelect}
      />
      <button 
        onClick={() => fileInputRef.current?.click()}
        className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
      >
        Subir Archivos
      </button>
    </div>
  );
};
