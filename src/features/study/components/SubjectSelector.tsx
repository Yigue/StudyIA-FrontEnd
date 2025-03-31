import { FolderPlus, Check, Plus } from 'lucide-react';
import { Subject } from '../types/study.types';
import { Tag } from '../../../types';
import { useState } from 'react';

interface SubjectSelectorProps {
  subjects: Subject[];
  selectedSubject: Tag | null;
  onSubjectSelect: (subject: Tag | null) => void;
}

const SubjectSelectorComponent: React.FC<SubjectSelectorProps> = ({
  subjects,
  selectedSubject,
  onSubjectSelect
}) => {
  const [showNewSubjectInput, setShowNewSubjectInput] = useState(false);
  const [newSubjectName, setNewSubjectName] = useState("");

  const handleToggleNewSubject = () => {
    setShowNewSubjectInput(!showNewSubjectInput);
  };

  const handleCreateNewSubject = async () => {
    // La implementación de creación de etiquetas se manejará en el componente padre
    if (newSubjectName.trim()) {
      // Aquí se debería implementar la lógica para crear la etiqueta
      console.log("Crear nueva materia:", newSubjectName);
      
      // Limpiamos el estado después de crear
      setNewSubjectName("");
      setShowNewSubjectInput(false);
    }
  };

  return (
  <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-600">
    <div className="flex items-center justify-between mb-4">
      <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100">Seleccionar Materia</h3>
      <button
          onClick={handleToggleNewSubject}
        className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-500"
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
            onChange={(e) => setNewSubjectName(e.target.value)}
          placeholder="Nombre de la materia"
          className="flex-1 p-2 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent dark:focus:ring-indigo-400 dark:focus:border-transparent"
        />
        <button
            onClick={handleCreateNewSubject}
            disabled={!newSubjectName.trim()}
            className={`px-4 py-2 rounded-lg transition-colors ${
              newSubjectName.trim() 
                ? 'bg-indigo-600 dark:bg-indigo-500 text-white dark:text-white hover:bg-indigo-700 dark:hover:bg-indigo-600' 
                : 'bg-gray-100 dark:bg-gray-600 text-gray-400 dark:text-gray-200 cursor-not-allowed dark:cursor-not-allowed'
            }`}
        >
          Agregar
        </button>
      </div>
    ) : (
        <div className="grid grid-cols-2 gap-2 mb-4">
          {subjects.map((subject) => (
            <button
              key={subject.id}
              onClick={() => onSubjectSelect({ 
                id: subject.id, 
                name: subject.name, 
                color: "#4f46e5", 
                user_id: "",
                created_at: new Date(),
                count: 0
              })}
              className={`p-3 rounded-lg border text-left transition-all ${
                selectedSubject?.id === subject.id
                  ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-600 dark:border-indigo-500 text-indigo-700 dark:text-indigo-400' 
                  : 'border-gray-200 dark:border-gray-600 hover:border-indigo-200 dark:hover:border-indigo-300 hover:bg-indigo-50/50 dark:hover:bg-indigo-50/50'
              }`}
            >
              <div className="flex items-center gap-2">
                {selectedSubject?.id === subject.id && (
                  <Check className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                )}
                <span>{subject.name}</span>
              </div>
            </button>
          ))}
          
          <button
            onClick={handleToggleNewSubject}
            className="p-3 rounded-lg border border-dashed border-gray-300 dark:border-gray-600 text-gray-500 dark:text-gray-200 hover:border-indigo-300 dark:hover:border-indigo-400 hover:text-indigo-600 dark:hover:text-indigo-500 flex items-center justify-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Agregar materia
          </button>
        </div>
    )}
  </div>
);
};

export default SubjectSelectorComponent;
