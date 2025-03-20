import { Type } from "lucide-react";

interface TextEditorProps {
  value: string;
  onChange: (value: string) => void;
}

export const TextEditor = ({ value, onChange }: TextEditorProps) => (
  <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
    <div className="flex items-center gap-4 mb-4">
      <div className="p-3 bg-indigo-50 rounded-lg">
        <Type className="w-6 h-6 text-indigo-600" />
      </div>
      <h3 className="text-lg font-semibold text-gray-800">O pega tu texto</h3>
    </div>
    <textarea
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder="Pega o escribe tu texto aquí..."
      className="w-full h-40 p-4 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none"
    />
  </div>
);
