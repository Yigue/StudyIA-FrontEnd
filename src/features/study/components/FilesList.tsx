import { Upload, X } from 'lucide-react';

interface FilesListProps {
  files: File[];
  onRemoveFile: (index: number) => void;
}

export const FilesList = ({ files, onRemoveFile }: FilesListProps) => (
  <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
    <h4 className="font-medium text-gray-800 mb-3">Archivos seleccionados:</h4>
    <div className="space-y-2">
      {files.map((file, index) => (
        <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
          <div className="flex items-center gap-2">
            <Upload className="w-4 h-4 text-gray-500" />
            <span className="text-sm text-gray-700">{file.name}</span>
          </div>
          <button
            onClick={() => onRemoveFile(index)}
            className="text-gray-500 hover:text-red-500 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ))}
    </div>
  </div>
);
