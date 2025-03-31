import React from 'react';
import { Sparkles, Lightbulb } from 'lucide-react';

const AIAssistant: React.FC = () => {
  return (
    <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm">
      <div className="px-6 py-5 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-indigo-100 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-400 rounded-lg">
            <Lightbulb className="w-5 h-5" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            Consejos para mejores resultados
          </h3>
        </div>
      </div>

      <div className="p-6">
        <div className="space-y-4">
          <p className="text-gray-600 dark:text-gray-300">
            Sigue estas recomendaciones para obtener mejores resultados de la IA:
          </p>
          
          <ul className="space-y-2 text-gray-600 dark:text-gray-300">
            <li className="flex items-start gap-2">
              <Sparkles className="w-4 h-4 text-indigo-500 mt-1 flex-shrink-0" />
              <span>Proporciona títulos descriptivos para mejorar la calidad de los resúmenes.</span>
            </li>
            <li className="flex items-start gap-2">
              <Sparkles className="w-4 h-4 text-indigo-500 mt-1 flex-shrink-0" />
              <span>Para archivos PDF, asegúrate de que el texto sea seleccionable (no imágenes).</span>
            </li>
            <li className="flex items-start gap-2">
              <Sparkles className="w-4 h-4 text-indigo-500 mt-1 flex-shrink-0" />
              <span>Los mejores resultados se obtienen con documentos de 1-10 páginas de longitud.</span>
            </li>
            <li className="flex items-start gap-2">
              <Sparkles className="w-4 h-4 text-indigo-500 mt-1 flex-shrink-0" />
              <span>Elige la materia correcta para proporcionar contexto al algoritmo de IA.</span>
            </li>
            <li className="flex items-start gap-2">
              <Sparkles className="w-4 h-4 text-indigo-500 mt-1 flex-shrink-0" />
              <span>Si ingresas texto directamente, asegúrate de que esté bien estructurado.</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default AIAssistant;
