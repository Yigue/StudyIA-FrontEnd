import { Book } from 'lucide-react';
import { StudyMaterial } from '../types/library.types';

interface MaterialsListProps {
  materials: StudyMaterial[];
  selectedMaterial: StudyMaterial | null;
  onSelectMaterial: (material: StudyMaterial) => void;
}

export const MaterialsList = ({ materials, selectedMaterial, onSelectMaterial }: MaterialsListProps) => (
  <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
    <div className="flex items-center gap-4 mb-4">
      <div className="p-3 bg-indigo-50 rounded-lg">
        <Book className="w-6 h-6 text-indigo-600" />
      </div>
      <h3 className="text-lg font-semibold text-gray-800">Materiales</h3>
    </div>
    <div className="space-y-3">
      {materials.map((material) => (
        <button
          key={material.id}
          onClick={() => onSelectMaterial(material)}
          className={`w-full p-4 rounded-lg text-left transition-colors ${
            selectedMaterial?.id === material.id
              ? 'bg-indigo-50 border border-indigo-100'
              : 'bg-gray-50 hover:bg-gray-100 border border-gray-100'
          }`}
        >
          <h4 className="font-medium text-gray-800">{material.title}</h4>
          <p className="text-sm text-gray-600">{material.subject.name}</p>
          <p className="text-xs text-gray-500 mt-1">
            {new Date(material.created_at).toLocaleDateString()}
          </p>
        </button>
      ))}
    </div>
  </div>
);
