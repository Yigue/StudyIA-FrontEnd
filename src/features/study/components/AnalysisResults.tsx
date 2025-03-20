import { BookOpen, LayoutGrid } from 'lucide-react';
import { AnalysisResult } from '../types/study.types';

interface AnalysisResultsProps {
  result: AnalysisResult;
}

 const AnalysisResultsComponent = ({ result }: AnalysisResultsProps) => (
  <>
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
      <div className="flex items-center gap-4 mb-4">
        <div className="p-3 bg-indigo-50 rounded-lg">
          <BookOpen className="w-6 h-6 text-indigo-600" />
        </div>
        <h3 className="text-lg font-semibold text-gray-800">Resumen</h3>
      </div>
      <p className="text-gray-600 whitespace-pre-line">
        {result.summary}
      </p>
    </div>

    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
      <div className="flex items-center gap-4 mb-4">
        <div className="p-3 bg-indigo-50 rounded-lg">
          <LayoutGrid className="w-6 h-6 text-indigo-600" />
        </div>
        <h3 className="text-lg font-semibold text-gray-800">Flashcards</h3>
      </div>
      <div className="space-y-4">
        {result.flashcards.map((flashcard, index) => (
          <div key={index} className="p-4 bg-gray-50 rounded-lg">
            <p className="font-medium text-gray-800 mb-2">P: {flashcard.question}</p>
            <p className="text-gray-600">R: {flashcard.answer}</p>
          </div>
        ))}
      </div>
    </div>
  </>
);
export default AnalysisResultsComponent;