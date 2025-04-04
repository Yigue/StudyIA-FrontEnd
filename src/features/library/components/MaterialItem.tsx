import React from "react";
import { Card, CardContent, CardFooter, CardHeader } from "../../../components/ui/Card";
import { Badge } from "../../../components/ui/badge";
import { Button } from "../../../components/ui/Button";
import { Trash2, Wand2 } from "lucide-react";
import { cn } from "../../../utils/cn";
import { StudyMaterial } from "@/types";
import { formatShortDate } from "../utils/dateUtils";

interface MaterialItemProps {
  material: StudyMaterial;
  isSelected?: boolean;
  onClick?: () => void;
  onDelete?: () => void;
  onGenerate?: () => void;
  isProcessing?: boolean;
}

const MAX_CONTENT_LENGTH = 100;

export const MaterialItem: React.FC<MaterialItemProps> = ({
  material,
  isSelected = false,
  onClick,
  onDelete,
  onGenerate,
  isProcessing = false,
}) => {
  // Usamos nuestra utilidad de formateo de fecha
  const formattedDate = formatShortDate(material.createdAt);
  
  // Obtener un extracto del contenido
  const getContentExcerpt = (content: string | null | undefined) => {
    if (!content) return "No hay contenido disponible";
    return content.length > MAX_CONTENT_LENGTH
      ? `${content.substring(0, MAX_CONTENT_LENGTH)}...`
      : content;
  };

  return (
    <Card
      className={cn("cursor-pointer border-l-4 transition-all", {
        "border-l-blue-500": isSelected,
        "border-l-transparent hover:border-l-gray-300": !isSelected,
      })}
      onClick={onClick}
    >
      <CardHeader className="p-4 pb-0">
        <div className="flex justify-between items-start gap-2">
          <h3 className="font-medium text-lg truncate">{material.title}</h3>
          <p className="text-xs text-gray-500 whitespace-nowrap">{formattedDate}</p>
        </div>
      </CardHeader>
      
      <CardContent className="p-4 pt-2">
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
          {getContentExcerpt(material.content)}
        </p>
        
        {material.tags && material.tags.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {material.tags.map((tag) => (
              <Badge key={tag.id} variant="outline" className="text-xs">
                {tag.name}
              </Badge>
            ))}
          </div>
        )}
      </CardContent>
      
      {(onDelete || onGenerate) && (
        <CardFooter className="p-2 pt-0 flex justify-end gap-2">
          {onGenerate && (
            <Button
              variant="outline"
              size="sm"
              className="h-8"
              onClick={(e) => {
                e.stopPropagation();
                onGenerate();
              }}
              disabled={isProcessing}
            >
              <Wand2 className="h-3.5 w-3.5 mr-1" />
              {isProcessing ? "Procesando..." : "Generar"}
            </Button>
          )}
          
          {onDelete && (
            <Button
              variant="outline"
              size="sm"
              className="h-8"
              onClick={(e) => {
                e.stopPropagation();
                onDelete();
              }}
              disabled={isProcessing}
            >
              <Trash2 className="h-3.5 w-3.5 mr-1" />
              Eliminar
            </Button>
          )}
        </CardFooter>
      )}
    </Card>
  );
}; 