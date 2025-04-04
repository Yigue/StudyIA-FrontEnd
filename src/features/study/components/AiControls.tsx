import { BookOpen, Loader2, PencilLine, Sparkles } from "lucide-react";


interface Props {
  mode: "both" | "summary" | "flashcards";
  setMode: (mode: "both" | "summary" | "flashcards") => void;
  onGenerateContent: () => void;
  generatingContent: boolean;
  isFormValid: boolean;
  progress: number;
  isLoading: boolean;
}

function AiControls({
  mode,
  setMode,
  onGenerateContent,
  generatingContent,
  isFormValid,
  progress,
  isLoading,
}: Props) {
  return (
    <div className="relative overflow-hidden bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm">
      <div className="px-6 py-5 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-indigo-100 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-400 rounded-lg">
              <Sparkles className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              Asistente de IA
            </h3>
          </div>
        </div>
      </div>

      <div className="p-6 space-y-4">
        <p className="text-gray-600 dark:text-gray-300">
          Deja que nuestra IA analice tu contenido y genere automáticamente
          resúmenes y flashcards para ayudarte a estudiar.
        </p>

        <div className="mt-4 space-y-3">
          <div className="flex items-center justify-between">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              ¿Qué quieres generar?
            </label>
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => setMode("both")}
              className={`px-4 py-2 text-sm font-medium rounded-md ${
                mode === "both"
                  ? "bg-indigo-100 dark:bg-indigo-900/50 text-indigo-700 dark:text-indigo-300 ring-1 ring-inset ring-indigo-700/10 dark:ring-indigo-500/20"
                  : "bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 ring-1 ring-inset ring-gray-300 dark:ring-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600"
              } inline-flex items-center gap-2`}
              disabled={generatingContent}
            >
              <Sparkles className="w-4 h-4" />
              <span>Ambos</span>
            </button>
            <button
              type="button"
              onClick={() => setMode("summary")}
              className={`px-4 py-2 text-sm font-medium rounded-md ${
                mode === "summary"
                  ? "bg-indigo-100 dark:bg-indigo-900/50 text-indigo-700 dark:text-indigo-300 ring-1 ring-inset ring-indigo-700/10 dark:ring-indigo-500/20"
                  : "bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 ring-1 ring-inset ring-gray-300 dark:ring-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600"
              } inline-flex items-center gap-2`}
              disabled={generatingContent}
            >
              <PencilLine className="w-4 h-4" />
              <span>Solo Resumen</span>
            </button>
            <button
              type="button"
              onClick={() => setMode("flashcards")}
              className={`px-4 py-2 text-sm font-medium rounded-md ${
                mode === "flashcards"
                  ? "bg-indigo-100 dark:bg-indigo-900/50 text-indigo-700 dark:text-indigo-300 ring-1 ring-inset ring-indigo-700/10 dark:ring-indigo-500/20"
                  : "bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 ring-1 ring-inset ring-gray-300 dark:ring-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600"
              } inline-flex items-center gap-2`}
              disabled={generatingContent}
            >
              <BookOpen className="w-4 h-4" />
              <span>Solo Flashcards</span>
            </button>
          </div>
        </div>

        <div className="mt-6">
          <button
            type="button"
            onClick={onGenerateContent}
            disabled={isLoading || generatingContent || !isFormValid}
            className={`w-full py-2.5 px-4 rounded-md font-medium flex items-center justify-center gap-2 ${
              isFormValid
                ? "bg-indigo-600 dark:bg-indigo-700 hover:bg-indigo-700 dark:hover:bg-indigo-600 text-white"
                : "bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed"
            } transition-colors duration-150`}
          >
            {generatingContent ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Generando contenido ({Math.round(progress)}%)...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>Generar con IA</span>
              </>
            )}
          </button>
        </div>

        {!isFormValid && (
          <p className="text-sm text-amber-600 dark:text-amber-400 mt-2">
            Por favor, completa todos los campos requeridos (título, material y
            materia) antes de generar el contenido.
          </p>
        )}
      </div>

      {/* Barra de progreso para la generación */}
      {generatingContent && (
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-200 dark:bg-gray-700">
          <div
            className="h-1 bg-indigo-600 dark:bg-indigo-500 transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      )}
    </div>
  );
}

export default AiControls;
