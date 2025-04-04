import React from "react";
import { Button } from "../../../components/ui/Button";
import { Plus, BookOpen } from "lucide-react";

export const MaterialsHeader: React.FC = () => {
  return (
    <header className="p-4 border-b border-gray-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
      <div className="flex items-center">
        <div className="bg-indigo-900/30 p-2 rounded-md mr-3">
          <BookOpen className="h-5 w-5 text-indigo-400" />
        </div>
        <h1 className="text-xl font-bold">Biblioteca de Materiales</h1>
      </div>
      
      <div className="flex space-x-2 w-full md:w-auto">
        <Button 
          variant="default" 
          className="bg-indigo-600 hover:bg-indigo-700 w-full md:w-auto"
        >
          <Plus className="h-4 w-4 mr-2" />
          Nuevo Material
        </Button>
        <Button 
          variant="outline" 
          className="border-gray-700 text-gray-200 hover:bg-gray-800 w-full md:w-auto"
        >
          <BookOpen className="h-4 w-4 mr-2" />
          Explorar Flashcards
        </Button>
      </div>
    </header>
  );
}; 