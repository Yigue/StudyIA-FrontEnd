import React from "react";
import { Loader2 } from "lucide-react";

interface ProcessingIndicatorProps {
  progress: number;
}

export const ProcessingIndicator: React.FC<ProcessingIndicatorProps> = ({ 
  progress = 0 
}) => {
  return (
    <div className="fixed bottom-4 right-4 bg-gray-800/90 backdrop-blur-sm shadow-xl rounded-lg p-4 max-w-xs border border-gray-700">
      <div className="flex items-center mb-2">
        <Loader2 className="h-5 w-5 text-indigo-400 animate-spin mr-3" />
        <div>
          <div className="font-medium">Procesando material</div>
          <div className="text-xs text-gray-400">Esto puede tardar unos minutos</div>
        </div>
      </div>
      
      <div className="mt-3">
        <div className="flex justify-between text-xs mb-1">
          <span>Progreso</span>
          <span className="text-indigo-400">{progress}%</span>
        </div>
        <div className="w-full bg-gray-700 rounded-full h-2">
          <div 
            className="bg-indigo-500 h-2 rounded-full transition-all duration-300 ease-in-out" 
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      </div>
    </div>
  );
}; 