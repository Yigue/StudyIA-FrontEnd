import { Search } from 'lucide-react';

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
}

export const SearchBar = ({ value, onChange }: SearchBarProps) => (
  <div>
    <div className="flex items-center gap-2 mb-2">
      <Search className="w-5 h-5 text-gray-500 dark:text-gray-400" />
      <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
        Buscar
      </label>
    </div>
    <input
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder="Buscar en flashcards..."
      className="input-base w-full"
    />
  </div>
);
