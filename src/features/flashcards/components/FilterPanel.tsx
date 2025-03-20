import { Filter } from 'lucide-react';
import { FlashcardFilters } from '../types/flashcards.types';

interface FilterPanelProps {
  filters: FlashcardFilters;
  onFilterChange: (key: keyof FlashcardFilters, value: string) => void;
  subjects: Array<{ id: string; name: string }>;
}

export const FilterPanel = ({ filters, onFilterChange, subjects }: FilterPanelProps) => (
  <div className="space-y-4">
    <div className="flex items-center gap-2 mb-2">
      <Filter className="w-5 h-5 text-gray-500" />
      <label className="text-sm font-medium text-gray-700">Filtros</label>
    </div>
    
    <div className="space-y-3">
      {/* Difficulty Filter */}
      <div>
        <label className="block text-sm text-gray-600 mb-1">Dificultad</label>
        <select
          value={filters.difficulty}
          onChange={(e) => onFilterChange('difficulty', e.target.value)}
          className="w-full p-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
        >
          <option value="all">Todas las dificultades</option>
          <option value="1">Muy Fácil</option>
          <option value="2">Fácil</option>
          <option value="3">Normal</option>
          <option value="4">Difícil</option>
          <option value="5">Muy Difícil</option>
        </select>
      </div>
      
      {/* Subject Filter */}
      <div>
        <label className="block text-sm text-gray-600 mb-1">Materia</label>
        <select
          value={filters.subject}
          onChange={(e) => onFilterChange('subject', e.target.value)}
          className="w-full p-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
        >
          <option value="all">Todas las materias</option>
          {subjects.map((subject) => (
            <option key={subject.id} value={subject.name}>
              {subject.name}
            </option>
          ))}
        </select>
      </div>
      
      {/* Status Filter */}
      <div>
        <label className="block text-sm text-gray-600 mb-1">Estado</label>
        <select
          value={filters.status}
          onChange={(e) => onFilterChange('status', e.target.value)}
          className="w-full p-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
        >
          <option value="all">Todos los estados</option>
          <option value="pending">Pendientes</option>
          <option value="due">Por revisar</option>
          <option value="completed">Completadas</option>
        </select>
      </div>
    </div>
  </div>
);