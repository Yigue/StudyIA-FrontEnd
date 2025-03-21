import { BookOpen } from 'lucide-react';
import { StudyMaterial } from '../../../types';


interface MaterialDetailProps {
  material: StudyMaterial;
}

export const MaterialDetail = ({ material }: MaterialDetailProps) => (
  <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
    <div className="flex items-center gap-4 mb-4">
      <div className="p-3 bg-indigo-50 rounded-lg">
        <BookOpen className="w-6 h-6 text-indigo-600" />
      </div>
      <div>
        <h3 className="text-lg font-semibold text-gray-800">{material.title}</h3>
        <p className="text-sm text-gray-600">{material.title}</p>
      </div>
    </div>
    <div className="prose max-w-none">
      <h4 className="text-gray-800 font-medium mb-2">Resumen</h4>
      <p className="text-gray-600 whitespace-pre-line">{material.summary}</p>
    </div>
  </div>
);
