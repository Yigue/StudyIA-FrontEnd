import { BookOpen, FileText } from "lucide-react";
import { MaterialDetail } from "./MaterialDetail";
import { FlashcardReview } from "./FlashcardReview";
import { Flashcard, StudyMaterial, Summary } from "../../../types";

interface Props {
  selectedMaterial: StudyMaterial | null;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  materialFlashcards: Flashcard[];
  materialSummaries: Summary[];
  handleDifficultyChange: (flashcardId: string, difficulty: number) => Promise<void>;
}

function TabsLibrary({
  selectedMaterial,
  activeTab,
  setActiveTab,
  materialFlashcards,
  materialSummaries,
  handleDifficultyChange,
}: Props) {
  const Content = selectedMaterial ? (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
      <Tabs>
        <TabsList className="border-b border-gray-200 dark:border-gray-700 w-full p-0 h-auto flex">
          <TabsTrigger
            className={`px-6 py-3 flex items-center gap-2 ${
              activeTab === "material"
                ? "border-b-2 border-indigo-600 text-indigo-700 dark:border-indigo-400 dark:text-indigo-400"
                : "text-gray-500 dark:text-gray-400"
            }`}
            onClick={() => setActiveTab("material")}
          >
            <BookOpen className="w-4 h-4" />
            <span>Material</span>
          </TabsTrigger>

          <TabsTrigger
            className={`px-6 py-3 flex items-center gap-2 ${
              activeTab === "flashcards"
                ? "border-b-2 border-indigo-600 text-indigo-700 dark:border-indigo-400 dark:text-indigo-400"
                : "text-gray-500 dark:text-gray-400"
            }`}
            disabled={materialFlashcards.length === 0}
            onClick={() => setActiveTab("flashcards")}
          >
            <FileText className="w-4 h-4" />
            <span>Flashcards ({materialFlashcards.length})</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent className="p-6" isActive={activeTab === "material"}>
          <MaterialDetail
            material={selectedMaterial}
            selectedSummary={materialSummaries}
          />
        </TabsContent>

        <TabsContent className="p-6" isActive={activeTab === "flashcards"}>
          {materialFlashcards.length > 0 ? (
            <FlashcardReview
              flashcards={materialFlashcards}
              onDifficultyChange={handleDifficultyChange}
            />
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-500 dark:text-gray-400">
                No hay flashcards disponibles para este material.
              </p>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  ) : (
    <div className="flex flex-col items-center justify-center py-12 px-6 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
      <BookOpen className="w-16 h-16 text-gray-300 dark:text-gray-600 mb-4" />
      <h3 className="text-xl text-gray-700 dark:text-gray-300 font-medium mb-2">
        Selecciona un material
      </h3>
      <p className="text-gray-500 dark:text-gray-400 text-center max-w-md">
        Haz clic en un material de la lista para ver sus detalles, resúmenes y
        flashcards.
      </p>
    </div>
  );

  return <>{Content}</>;
}

export default TabsLibrary;

const Tabs: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  return <div>{children}</div>;
};

const TabsList: React.FC<{
  className: string;
  children: React.ReactNode;
}> = ({ className, children }) => {
  return <div className={className}>{children}</div>;
};

const TabsTrigger: React.FC<{
  className: string;
  disabled?: boolean;
  children: React.ReactNode;
  onClick?: () => void;
}> = ({ className, disabled, children, onClick }) => {
  return (
    <button className={className} disabled={disabled} onClick={onClick}>
      {children}
    </button>
  );
};

const TabsContent: React.FC<{
  className: string;
  isActive: boolean;
  children: React.ReactNode;
}> = ({ className, isActive, children }) => {
  if (!isActive) return null;
  return <div className={className}>{children}</div>;
};
