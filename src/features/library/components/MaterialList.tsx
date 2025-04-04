import React from "react";
import { MaterialItem } from "./MaterialItem";
import { StudyMaterial, ProcessingOptions } from "@/types";

interface MaterialListProps {
  materials: StudyMaterial[];
  selectedMaterialId?: string;
  onSelectMaterial: (material: StudyMaterial) => void;
  onDeleteMaterial?: (materialId: string) => void;
  onGenerateContent?: (material: StudyMaterial) => void;
  isProcessing?: boolean;
}

export const MaterialList: React.FC<MaterialListProps> = ({
  materials,
  selectedMaterialId,
  onSelectMaterial,
  onDeleteMaterial,
  onGenerateContent,
  isProcessing = false,
}) => {
  if (materials.length === 0) {
    return (
      <div className="text-center py-10">
        <p className="text-gray-500 dark:text-gray-400">
          No se encontraron materiales
        </p>
        <p className="text-sm text-gray-400 dark:text-gray-500 mt-2">
          Sube nuevos materiales desde la sección "Estudiar"
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-3">
      {materials.map((material) => (
        <MaterialItem
          key={material.id}
          material={material}
          isSelected={material.id === selectedMaterialId}
          onClick={() => onSelectMaterial(material)}
          onDelete={onDeleteMaterial ? () => onDeleteMaterial(material.id) : undefined}
          onGenerate={onGenerateContent ? () => onGenerateContent(material) : undefined}
          isProcessing={isProcessing}
        />
      ))}
    </div>
  );
}; 