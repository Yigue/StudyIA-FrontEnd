import { AlertCircle } from "lucide-react";

import { SubjectSelector } from "./components/SubjectSelector";
import { FileUploader } from "./components/FileUploader";
import { FilesList } from "./components/FilesList";
import { TextEditor } from "./components/TextEditor";
import { AIAssistant } from "./components/AIAssistant";
import  AnalysisResultsComponent  from "./components/AnalysisResults";
// import { useMaterials } from "../../hook/useMaterials";

const StudyAreaPage = () => {
  // const {  error,isLoading,currentMaterial} =useMaterials()

  return (
    <div className="p-8">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Área de Estudio</h2>

      {/* {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-3">
          <AlertCircle className="w-5 h-5 text-red-600" />
          <p className="text-red-600">{error}</p>
        </div>
      )}

      {currentMaterial && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-3">
          <AlertCircle className="w-5 h-5 text-green-600" />
          <p className="text-green-600">{currentMaterial}</p>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-4">
          <SubjectSelector {...state.subject} {...handlers.subject} />
          <FileUploader {...state.fileUpload} {...handlers.fileUpload} />
          {state.files.length > 0 && (
            <FilesList files={state.files} onRemoveFile={handlers.removeFile} />
          )}
          <TextEditor value={state.text} onChange={handlers.setText} />
        </div>

        <div className="space-y-6">
          <AIAssistant
            isAnalyzing={state.isAnalyzing}
            disabled={!state.text.trim() || !state.isAnalyzing}
            onAnalyze={handlers.handleAnalysis}
          />

          {analysisResult && <AnalysisResultsComponent result={analysisResult} />} */}
        {/* </div> */}
      {/* </div> */}
    </div>
  );
};

export default StudyAreaPage;
