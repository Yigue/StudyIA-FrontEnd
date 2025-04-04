import React, { useState } from "react";
import {
  BookOpen,
  FileText,
  Calendar,
  Tag as TagIcon,
  ChevronRight,
} from "lucide-react";
import { StudyMaterial, Summary } from "../../../types";
import { Tag } from "../../../types/tag/tag";

interface MaterialDetailProps {
  material: StudyMaterial;
  selectedSummary: Summary[] | null;
}

export const MaterialDetail: React.FC<MaterialDetailProps> = ({
  material,
  selectedSummary,
}) => {
  const [activeTab, setActiveTab] = useState<"content" | "summary">("content");

  // Formatear la fecha de creación
  const formatDate = (dateString: Date) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("es-ES", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
      {/* Encabezado del material */}
      <div className="bg-indigo-50 dark:bg-indigo-900/20 p-6">
        <div className="flex items-center gap-4 mb-3">
          <div className="p-3 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
            <BookOpen className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
              {material.title}
            </h3>
            <div className="flex items-center text-sm text-gray-600 dark:text-gray-400 mt-1">
              <Calendar className="w-4 h-4 mr-1" />
              <span>{formatDate(new Date(material.createdAt))}</span>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 mt-4">
          {material.tags?.map((tag, index) => (
            <div
              key={index}
              className="px-3 py-1 bg-white dark:bg-gray-800 rounded-full text-xs text-indigo-700 dark:text-indigo-400 font-medium flex items-center"
            >
              <TagIcon className="w-3 h-3 mr-1" />
              {typeof tag === "string" ? tag : (tag as Tag).name}
            </div>
          ))}
        </div>
      </div>

      {/* Pestañas */}
      <div className="flex border-b border-gray-200 dark:border-gray-700">
        <button
          className={`py-3 px-5 font-medium flex items-center ${
            activeTab === "content"
              ? "text-indigo-600 dark:text-indigo-400 border-b-2 border-indigo-600 dark:border-indigo-400"
              : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
          }`}
          onClick={() => setActiveTab("content")}
        >
          <FileText className="w-4 h-4 mr-2" />
          Contenido
        </button>
        <button
          className={`py-3 px-5 font-medium flex items-center ${
            activeTab === "summary"
              ? "text-indigo-600 dark:text-indigo-400 border-b-2 border-indigo-600 dark:border-indigo-400"
              : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
          }`}
          onClick={() => setActiveTab("summary")}
        >
          <ChevronRight className="w-4 h-4 mr-2" />
          Resumen
        </button>
      </div>

      {/* Contenido según la pestaña activa */}
      <div className="p-6">
        {activeTab === "content" ? (
          <div className="prose dark:prose-invert max-w-none">
            <p className="text-gray-700 dark:text-gray-300 whitespace-pre-line">
              {material.content}
            </p>

            {material.file_url && (
              <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg border border-gray-200 dark:border-gray-700">
                <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Archivo adjunto
                </h4>
                <a
                  href={material.file_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-indigo-600 dark:text-indigo-400 hover:underline text-sm flex items-center"
                >
                  <FileText className="w-4 h-4 mr-1" />
                  Ver documento original
                </a>
              </div>
            )}
          </div>
        ) : (
          <div className="prose dark:prose-invert max-w-none">
            {selectedSummary && selectedSummary.length > 0 ? (
              <div className="space-y-6">
                {selectedSummary.map((summary, index) => (
                  <div
                    key={index}
                    className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg border border-gray-200 dark:border-gray-700"
                  >
                    <h4 className="text-gray-800 dark:text-gray-200 font-medium mb-2">
                      Resumen {index + 1}
                    </h4>
                    <p className="text-gray-700 dark:text-gray-300 whitespace-pre-line">
                      {summary.summary_text}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center p-6 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                <p className="text-gray-600 dark:text-gray-400">
                  No hay resúmenes disponibles para este material.
                </p>
                <p className="text-gray-500 dark:text-gray-500 text-sm mt-2">
                  Puedes generar un resumen desde la sección de estudio.
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
