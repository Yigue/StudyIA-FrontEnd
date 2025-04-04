import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../../components/ui/tabs";
import { Button } from "../../../components/ui/Button";
import { Checkbox } from "../../../components/ui/checkbox";
import { MaterialDetail } from "./MaterialDetail";
import { FlashcardList } from "./FlashcardList";
import { BookOpen, FileText, Trash2, Sparkles, ExternalLink, FileTextIcon, BrainCircuitIcon, StickyNoteIcon } from "lucide-react";
import { Flashcard, ProcessingOptions, StudyMaterial, Summary } from "@/types";

// Definiciones locales para evitar problemas de importación

interface TabsLibraryProps {
  selectedMaterial: StudyMaterial | null;
  activeTab: string;
  onTabChange: (tab: string) => void;
  materialFlashcards: Flashcard[];
  materialSummaries: Summary[];
  onDeleteMaterial?: (material: StudyMaterial) => void;
  onGenerateContent?: (material: StudyMaterial) => void;
  onViewFile?: (fileUrl: string) => void;
  handleDifficultyChange: (flashcardId: string, difficulty: number) => void;
  isProcessing?: boolean;
  processingOptions?: ProcessingOptions;
  setProcessingOptions?: (options: ProcessingOptions) => void;
  hasFlashcards?: boolean;
  hasSummaries?: boolean;
}

export const TabsLibrary: React.FC<TabsLibraryProps> = ({
  selectedMaterial,
  activeTab,
  onTabChange,
  materialFlashcards,
  materialSummaries,
  onDeleteMaterial,
  onGenerateContent,
  onViewFile,
  handleDifficultyChange,
  isProcessing = false,
  processingOptions = { generateSummary: true, generateFlashcards: true },
  setProcessingOptions,
  hasFlashcards = false,
  hasSummaries = false,
}) => {
  if (!selectedMaterial) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center p-8">
          <BookOpen className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100">
            Selecciona un material
          </h3>
          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
            Selecciona un material de la lista para ver sus detalles, flashcards y resúmenes
          </p>
        </div>
      </div>
    );
  }

  const handleTabChange = (value: string) => {
    onTabChange(value);
  };

  const hasFile = selectedMaterial.attachments && selectedMaterial.attachments.length > 0;
  const hasContent = !!selectedMaterial.content && selectedMaterial.content.length > 0;

  return (
    <div className="flex flex-col h-full">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold truncate">{selectedMaterial.title}</h2>
        
        <div className="flex items-center space-x-2">
          {/* Acciones del material */}
          {hasFile && onViewFile && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => onViewFile(selectedMaterial.attachments[0].url)}
              title="Ver archivo original"
            >
              <ExternalLink className="h-4 w-4 mr-1" />
              Ver archivo
            </Button>
          )}
          
          {onGenerateContent && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => onGenerateContent(selectedMaterial)}
              disabled={isProcessing || (!hasContent && !hasFile)}
              title="Generar flashcards y resúmenes"
            >
              <Sparkles className="h-4 w-4 mr-1" />
              Generar
            </Button>
          )}
          
          {onDeleteMaterial && (
            <Button
              variant="destructive"
              size="sm"
              onClick={() => onDeleteMaterial(selectedMaterial)}
              disabled={isProcessing}
              title="Eliminar material"
            >
              <Trash2 className="h-4 w-4 mr-1" />
              Eliminar
            </Button>
          )}
        </div>
      </div>
      
      {/* Opciones de generación cuando no está procesando */}
      {onGenerateContent && !isProcessing && setProcessingOptions && (
        <div className="mb-4 bg-gray-50 dark:bg-gray-800 p-3 rounded-md">
          <p className="text-sm font-medium mb-2">Opciones de generación:</p>
          <div className="flex flex-col space-y-2">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="generate-summaries"
                checked={processingOptions.generateSummary}
                onCheckedChange={(checked: boolean) => 
                  setProcessingOptions({
                    ...processingOptions,
                    generateSummary: checked
                  })
                }
              />
              <label
                htmlFor="generate-summaries"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Generar resúmenes
              </label>
            </div>
            
            <div className="flex items-center space-x-2">
              <Checkbox
                id="generate-flashcards"
                checked={processingOptions.generateFlashcards}
                onCheckedChange={(checked: boolean) => 
                  setProcessingOptions({
                    ...processingOptions,
                    generateFlashcards: checked
                  })
                }
              />
              <label
                htmlFor="generate-flashcards"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Generar flashcards
              </label>
            </div>
          </div>
        </div>
      )}

      <Tabs 
        value={activeTab} 
        onValueChange={handleTabChange}
        className="flex-grow flex flex-col"
      >
        <TabsList className="w-full grid grid-cols-3">
          <TabsTrigger value="content" className="flex items-center">
            <FileTextIcon className="mr-2 h-4 w-4" />
            Contenido
          </TabsTrigger>
          <TabsTrigger value="flashcards" disabled={!hasFlashcards} className="flex items-center">
            <BrainCircuitIcon className="mr-2 h-4 w-4" />
            Flashcards
          </TabsTrigger>
          <TabsTrigger value="summaries" disabled={!hasSummaries} className="flex items-center">
            <StickyNoteIcon className="mr-2 h-4 w-4" />
            Resúmenes
          </TabsTrigger>
        </TabsList>

        <TabsContent value="content" className="flex-grow overflow-auto">
          <MaterialDetail 
            material={selectedMaterial} 
            summaries={materialSummaries}
            onViewFile={onViewFile}
          />
        </TabsContent>

        <TabsContent value="flashcards" className="flex-grow overflow-auto">
          {materialFlashcards.length > 0 ? (
            <FlashcardList 
              flashcards={materialFlashcards} 
              onDifficultyChange={handleDifficultyChange} 
            />
          ) : (
            <div className="flex items-center justify-center h-full">
              <div className="text-center p-8">
                <BookOpen className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                <h3 className="text-lg font-medium">No hay flashcards disponibles</h3>
                <p className="mt-2 text-sm text-gray-500">
                  Este material aún no tiene flashcards generadas
                </p>
                {onGenerateContent && (
                  <Button
                    className="mt-4"
                    onClick={() => onGenerateContent(selectedMaterial)}
                    disabled={isProcessing}
                  >
                    <Sparkles className="h-4 w-4 mr-2" />
                    Generar flashcards
                  </Button>
                )}
              </div>
            </div>
          )}
        </TabsContent>

        <TabsContent value="summaries" className="flex-grow overflow-auto">
          {materialSummaries.length > 0 ? (
            <div className="flex flex-col space-y-4">
              {materialSummaries.map((summary) => (
                <div key={summary.id} className="flex justify-between items-center">
                  <span>{summary.title}</span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onViewFile && onViewFile(summary.fileUrl)}
                    title="Ver resúmen"
                  >
                    <ExternalLink className="h-4 w-4 mr-1" />
                    Ver
                  </Button>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex items-center justify-center h-full">
              <div className="text-center p-8">
                <BookOpen className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                <h3 className="text-lg font-medium">No hay resúmenes disponibles</h3>
                <p className="mt-2 text-sm text-gray-500">
                  Este material aún no tiene resúmenes generados
                </p>
                {onGenerateContent && (
                  <Button
                    className="mt-4"
                    onClick={() => onGenerateContent(selectedMaterial)}
                    disabled={isProcessing}
                  >
                    <Sparkles className="h-4 w-4 mr-2" />
                    Generar resúmenes
                  </Button>
                )}
              </div>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};
