import React, { useState, useMemo } from 'react';
import { ChevronDown, CalendarDays, Tag as TagIcon } from 'lucide-react';
import { StudyMaterial } from '../../../types';
import { Tag } from '../../../types/tag/tag';

interface MaterialsListProps {
  materials: StudyMaterial[];
  onSelectMaterial: (material: StudyMaterial) => void;
}

export const MaterialsList: React.FC<MaterialsListProps> = ({
  materials,
  onSelectMaterial,
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
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      } else {
        return a.title.localeCompare(b.title);
      }
    });
  }, [materials, selectedTag, sortBy]);

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="p-4 border-b border-gray-100">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-800">Mis Materiales</h3>
          <div className="flex space-x-2">
            <div className="relative">
              <button
                className="px-3 py-1.5 text-sm bg-gray-50 hover:bg-gray-100 rounded-lg flex items-center gap-1 text-gray-700"
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
                  ? 'bg-indigo-50 text-indigo-700'
                  : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
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
                    ? 'bg-indigo-50 text-indigo-700'
                    : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
                }`}
                onClick={() => setSelectedTag(tag.name)}
              >
                <TagIcon className="w-3 h-3" />
                <span>{tag.name}</span>
                <span className="text-xs text-gray-500 ml-1">({tag.count})</span>
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="divide-y divide-gray-100 max-h-[600px] overflow-y-auto">
        {filteredMaterials.length > 0 ? (
          filteredMaterials.map((material) => (
            <div
              key={material.id}
              className="p-4 hover:bg-gray-50 cursor-pointer transition-colors"
              onClick={() => onSelectMaterial(material)}
            >
              <h4 className="font-medium text-gray-800 mb-1">{material.title}</h4>
              <div className="flex items-center text-xs text-gray-500 mb-2">
                <CalendarDays className="w-3 h-3 mr-1" />
                <span>
                  {new Date(material.created_at).toLocaleDateString('es-ES', {
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
                        className="px-2 py-0.5 bg-gray-50 rounded-full text-xs text-gray-600"
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
          <div className="p-6 text-center text-gray-500">
            <p>No se encontraron materiales</p>
            {selectedTag && (
              <button
                className="text-indigo-600 text-sm mt-2 hover:underline"
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
