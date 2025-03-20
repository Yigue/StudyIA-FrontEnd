import { Brain, Loader2 } from "lucide-react";

interface AIAssistantProps {
  isAnalyzing: boolean;
  disabled: boolean;
  onAnalyze: () => void;
}

export const AIAssistant = ({
  isAnalyzing,
  disabled,
  onAnalyze,
}: AIAssistantProps) => (
  <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
    <div className="flex items-center gap-4 mb-4">
      <div className="p-3 bg-indigo-50 rounded-lg">
        <Brain className="w-6 h-6 text-indigo-600" />
      </div>
      <h3 className="text-lg font-semibold text-gray-800">Asistente IA</h3>
    </div>
    <p className="text-gray-600 mb-4">
      Sube documentos o pega texto, y la IA te ayudará a crear resúmenes y
      flashcards personalizadas.
    </p>
    <button
      onClick={onAnalyze}
      disabled={disabled || isAnalyzing}
      className={`w-full px-4 py-2 rounded-lg flex items-center justify-center gap-2 transition-colors ${
        disabled
          ? "bg-gray-300 cursor-not-allowed"
          : isAnalyzing
          ? "bg-indigo-500 cursor-wait"
          : "bg-indigo-600 hover:bg-indigo-700"
      } text-white`}
    >
      {isAnalyzing ? (
        <>
          <Loader2 className="w-5 h-5 animate-spin" />
          Analizando...
        </>
      ) : (
        "Iniciar Análisis"
      )}
    </button>
  </div>
);
