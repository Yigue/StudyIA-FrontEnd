import React, { useState } from 'react';
import { FileText, BookOpen, Share2, Copy, Check, Download, ExternalLink } from 'lucide-react';
import { AnalysisResult } from '../types/study.types';

interface AnalysisResultsProps {
  result: AnalysisResult;
}

const AnalysisResultsComponent: React.FC<AnalysisResultsProps> = ({ result }) => {
  const [activeTab, setActiveTab] = useState<'summary' | 'flashcards'>('summary');
  const [copied, setCopied] = useState(false);

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = (content: string, filename: string) => {
    const element = document.createElement('a');
    const file = new Blob([content], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = filename;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      {/* Tabs */}
      <div className="flex border-b border-gray-200">
        <button
          className={`py-4 px-6 font-medium flex items-center gap-2 ${
            activeTab === 'summary' 
              ? 'text-indigo-600 border-b-2 border-indigo-600' 
              : 'text-gray-500 hover:text-gray-700'
          }`}
          onClick={() => setActiveTab('summary')}
        >
          <FileText className="w-5 h-5" />
          Resumen
        </button>
        <button
          className={`py-4 px-6 font-medium flex items-center gap-2 ${
            activeTab === 'flashcards' 
              ? 'text-indigo-600 border-b-2 border-indigo-600' 
              : 'text-gray-500 hover:text-gray-700'
          }`}
          onClick={() => setActiveTab('flashcards')}
        >
          <BookOpen className="w-5 h-5" />
          Flashcards
        </button>
      </div>

      {/* Content */}
      <div className="p-6">
        {activeTab === 'summary' ? (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold text-gray-800">Resumen del Contenido</h3>
              <div className="flex gap-2">
                <button 
                  onClick={() => handleCopy(result.summary)}
                  className="p-2 text-gray-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-full transition-colors"
                  title="Copiar resumen"
                >
                  {copied ? <Check className="w-5 h-5 text-green-500" /> : <Copy className="w-5 h-5" />}
                </button>
                <button 
                  onClick={() => handleDownload(result.summary, 'resumen.txt')}
                  className="p-2 text-gray-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-full transition-colors"
                  title="Descargar como TXT"
                >
                  <Download className="w-5 h-5" />
                </button>
              </div>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg">
              <p className="text-gray-700 whitespace-pre-line">{result.summary}</p>
            </div>
            <div className="flex justify-between items-center text-sm text-gray-500">
              <span>{result.summary.length} caracteres</span>
              <div>
                <a 
                  href="#" 
                  className="text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
                  onClick={(e) => {
                    e.preventDefault();
                    handleCopy(window.location.href);
                  }}
                >
                  <Share2 className="w-4 h-4" /> 
                  Compartir
                </a>
              </div>
            </div>
          </div>
        ) : (
          <div>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-800">Flashcards Generadas</h3>
              <a 
                href="/flashcards" 
                className="text-indigo-600 hover:text-indigo-800 text-sm flex items-center gap-1"
              >
                <ExternalLink className="w-4 h-4" /> 
                Ver todas las flashcards
              </a>
            </div>
            <div className="space-y-4">
              {result.flashcards.map((flashcard, index) => (
                <div 
                  key={index} 
                  className="p-4 border border-gray-200 rounded-lg hover:border-indigo-200 hover:shadow-sm transition-all"
                >
                  <h4 className="font-medium text-gray-800 mb-2">Pregunta {index + 1}:</h4>
                  <p className="text-gray-700 mb-3">{flashcard.question}</p>
                  <div className="pt-3 border-t border-gray-100">
                    <h4 className="font-medium text-gray-800 mb-2">Respuesta:</h4>
                    <p className="text-gray-700">{flashcard.answer}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AnalysisResultsComponent;