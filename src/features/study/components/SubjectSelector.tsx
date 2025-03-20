import { FolderPlus } from 'lucide-react';
import { Subject } from '../types/study.types';

interface SubjectSelectorProps {
  subjects: Subject[];
  selectedSubject: string;
  showNewSubjectInput: boolean;
  newSubjectName: string;
  onSubjectSelect: (id: string) => void;
  onNewSubjectNameChange: (name: string) => void;
  onToggleNewSubject: () => void;
  onCreateNewSubject: () => void;
}

export const SubjectSelector = ({
  subjects,
  selectedSubject,
  showNewSubjectInput,
  newSubjectName,
  onSubjectSelect,
  onNewSubjectNameChange,
  onToggleNewSubject,
  onCreateNewSubject
}: SubjectSelectorProps) => (
  <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
    <div className="flex items-center justify-between mb-4">
      <h3 className="text-lg font-semibold text-gray-800">Seleccionar Materia</h3>
      <button
        onClick={onToggleNewSubject}
        className="flex items-center gap-2 text-indigo-600 hover:text-indigo-700"
      >
        <FolderPlus className="w-5 h-5" />
        Nueva Materia
      </button>
    </div>

    {showNewSubjectInput ? (
      <div className="flex gap-2 mb-4">
        <input
          type="text"
          value={newSubjectName}
          onChange={(e) => onNewSubjectNameChange(e.target.value)}
          placeholder="Nombre de la materia"
          className="flex-1 p-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
        />
        <button
          onClick={onCreateNewSubject}
          className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
        >
          Agregar
        </button>
      </div>
    ) : (
      <select
        value={selectedSubject}
        onChange={(e) => onSubjectSelect(e.target.value)}
        className="w-full p-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
      >
        <option value="">Selecciona una materia</option>
        {subjects.map((subject) => (
          <option key={subject.id} value={subject.id}>
            {subject.name}
          </option>
        ))}
      </select>
    )}
  </div>
);
