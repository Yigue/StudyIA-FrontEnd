import React, { useState, useMemo } from 'react';
import { ChevronDown, CalendarDays, Tag as TagIcon, Loader2 } from 'lucide-react';
import { StudyMaterial } from '../../../types/studyMaterial/studyMaterial';
import { Tag } from '../../../types/tag';

interface MaterialsListProps {
  materials: StudyMaterial[];
  onSelectMaterial: (material: StudyMaterial) => void;
  isLoading?: boolean;
}

export const MaterialsList: React.FC<MaterialsListProps> = ({
  materials,
  onSelectMaterial,
  isLoading = false,
}) => {
  const [sortBy, setSortBy] = useState<'date' | 'title'>('date');
  const [selectedTag, setSelectedTag] = useState<string | null>(null);

  // Extraer tags únicos de los materiales
  const uniqueTags = useMemo(() => {
    const tagsMap = new Map<string, number>();

    materials.forEach((material) => {
      if (material.tags && material.tags.length > 0) {
        material.tags.forEach((tag) => {
          const tagName = typeof tag === 'string' ? tag : (tag as Tag).name;
          const count = tagsMap.get(tagName) || 0;
          tagsMap.set(tagName, count + 1);
        });
      }
    });

    return Array.from(tagsMap).map(([name, count]) => ({ name, count }));
  }, [materials]);

  // Filtrar y ordenar materiales
  const filteredMaterials = useMemo(() => {
    // Primero filtrar por tag si hay alguno seleccionado
    const result = selectedTag
      ? materials.filter((material) => {
          if (!material.tags) return false;
          return material.tags.some((tag) => {
            const tagName = typeof tag === 'string' ? tag : (tag as Tag).name;
            return tagName === selectedTag;
          });
        })
      : materials;

    // Luego ordenar según criterio
    return result.sort((a, b) => {
      if (sortBy === 'date') {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      } else {
        return a.title.localeCompare(b.title);
      }
    });
  }, [materials, selectedTag, sortBy]);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
      <div className="p-4 border-b border-gray-100 dark:border-gray-700">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
            Mis Materiales
            {isLoading && (
              <Loader2 className="w-4 h-4 ml-2 inline animate-spin text-indigo-600" />
            )}
          </h3>
          <div className="flex space-x-2">
            <div className="relative">
              <button
                className="px-3 py-1.5 text-sm bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 rounded-lg flex items-center gap-1 text-gray-700 dark:text-gray-300"
                onClick={() => setSortBy(sortBy === 'date' ? 'title' : 'date')}
              >
                {sortBy === 'date' ? (
                  <>
                    <CalendarDays className="w-4 h-4" />
                    <span>Por fecha</span>
                  </>
                ) : (
                  <>
                    <span>Por título</span>
                  </>
                )}
                <ChevronDown className="w-3 h-3" />
              </button>
            </div>
          </div>
        </div>

        {uniqueTags.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-2">
            <button
              className={`px-3 py-1 text-xs rounded-full flex items-center ${
                selectedTag === null
                  ? 'bg-indigo-50 dark:bg-indigo-900/50 text-indigo-700 dark:text-indigo-300'
                  : 'bg-gray-50 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600'
              }`}
              onClick={() => setSelectedTag(null)}
            >
              Todos
            </button>
            {uniqueTags.map((tag) => (
              <button
                key={tag.name}
                className={`px-3 py-1 text-xs rounded-full flex items-center gap-1 ${
                  selectedTag === tag.name
                    ? 'bg-indigo-50 dark:bg-indigo-900/50 text-indigo-700 dark:text-indigo-300'
                    : 'bg-gray-50 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600'
                }`}
                onClick={() => setSelectedTag(tag.name)}
              >
                <TagIcon className="w-3 h-3" />
                <span>{tag.name}</span>
                <span className="text-xs text-gray-500 dark:text-gray-400 ml-1">({tag.count})</span>
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="divide-y divide-gray-100 dark:divide-gray-700 max-h-[600px] overflow-y-auto">
        {isLoading ? (
          <div className="p-6 flex justify-center items-center">
            <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
            <span className="ml-3 text-gray-600 dark:text-gray-400">Cargando materiales...</span>
          </div>
        ) : filteredMaterials.length > 0 ? (
          filteredMaterials.map((material) => (
            <div
              key={material.id}
              className="p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 cursor-pointer transition-colors"
              onClick={() => onSelectMaterial(material)}
            >
              <h4 className="font-medium text-gray-800 dark:text-gray-200 mb-1">{material.title}</h4>
              <div className="flex items-center text-xs text-gray-500 dark:text-gray-400 mb-2">
                <CalendarDays className="w-3 h-3 mr-1" />
                <span>
                  {new Date(material.createdAt).toLocaleDateString('es-ES', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                  })}
                </span>
              </div>
              
              {material.tags && material.tags.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-2">
                  {material.tags.map((tag, index) => {
                    const tagName = typeof tag === 'string' ? tag : (tag as Tag).name;
                    return (
                      <span
                        key={index}
                        className="px-2 py-0.5 bg-gray-50 dark:bg-gray-700 rounded-full text-xs text-gray-600 dark:text-gray-300"
                      >
                        {tagName}
                      </span>
                    );
                  })}
                </div>
              )}
            </div>
          ))
        ) : (
          <div className="p-6 text-center text-gray-500 dark:text-gray-400">
            <p>No se encontraron materiales</p>
            {selectedTag && (
              <button
                className="text-indigo-600 dark:text-indigo-400 text-sm mt-2 hover:underline"
                onClick={() => setSelectedTag(null)}
              >
                Mostrar todos los materiales
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
