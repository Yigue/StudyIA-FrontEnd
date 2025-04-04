import React from 'react';
import { StudyMaterial } from '@/types';
import { formatShortDate } from '../../features/library/utils/dateUtils';
import { FileIcon, FileTextIcon, BookOpenIcon } from 'lucide-react';

export interface MaterialItemProps {
  material: StudyMaterial;
  isSelected?: boolean;
  flashcardsCount?: number;
  summariesCount?: number;
  onClick?: () => void;
}

export const MaterialItem: React.FC<MaterialItemProps> = ({
  material,
  isSelected = false,
  flashcardsCount = 0,
  summariesCount = 0,
  onClick
}) => {
  // Determinar el icono según el tipo de material
  const getIcon = () => {
    const type = material.type || '';
    
    switch (type.toLowerCase()) {
      case 'pdf':
        return <FileIcon className="h-4 w-4 text-red-400" />;
      case 'texto':
      case 'text':
        return <FileTextIcon className="h-4 w-4 text-blue-400" />;
      default:
        return <FileTextIcon className="h-4 w-4 text-gray-400" />;
    }
  };

  // Formato seguro de la fecha
  const formattedDate = React.useMemo(() => {
    try {
      return formatShortDate(material.createdAt);
    } catch (_) {
      return 'Fecha desconocida';
    }
  }, [material.createdAt]);

  return (
    <div
      className={`p-4 border-b border-gray-700 cursor-pointer transition-colors ${
        isSelected ? 'bg-gray-700' : 'hover:bg-gray-700/50'
      }`}
      onClick={onClick}
    >
      <div className="flex items-start gap-3">
        <div className="mt-1">{getIcon()}</div>
        <div className="flex-1 min-w-0">
          <h3 className="font-medium mb-1 truncate">{material.title}</h3>
          <p className="text-xs text-gray-400">{formattedDate}</p>
          
          <div className="flex flex-wrap gap-1 mt-2">
            {flashcardsCount > 0 && (
              <span className="text-xs px-2 py-1 bg-indigo-900/50 rounded text-indigo-300 flex items-center">
                <BookOpenIcon className="h-3 w-3 mr-1" />
                {flashcardsCount} Flashcards
              </span>
            )}
            
            {summariesCount > 0 && (
              <span className="text-xs px-2 py-1 bg-emerald-900/50 rounded text-emerald-300 flex items-center">
                <FileTextIcon className="h-3 w-3 mr-1" />
                {summariesCount} Resúmenes
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}; 