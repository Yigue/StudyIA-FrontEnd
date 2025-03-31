import React from 'react';
import { Book, Search, Filter, RefreshCw } from 'lucide-react';

interface LibraryLayoutProps {
  isLoading?: boolean;
  error?: string | null;
  title: string;
  searchTerm?: string;
  onSearchChange?: (term: string) => void;
  onRefresh?: () => void;
  filters?: React.ReactNode;
  sidebar: React.ReactNode;
  main: React.ReactNode;
}

const LibraryLayout: React.FC<LibraryLayoutProps> = ({
  isLoading = false,
  error = null,
  title,
  searchTerm = '',
  onSearchChange,
  onRefresh,
  filters,
  sidebar,
  main
}) => {
  return (
    <div className="container mx-auto p-6">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6 gap-4">
        <div className="flex items-center">
          <div className="p-2 bg-indigo-100 text-indigo-700 rounded-lg mr-3">
            <Book className="w-5 h-5" />
          </div>
          <h1 className="text-2xl font-bold text-gray-800">{title}</h1>
          {isLoading && (
            <RefreshCw className="w-4 h-4 text-indigo-600 animate-spin ml-3" />
          )}
        </div>
        
        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
          {onSearchChange && (
            <div className="relative flex-1 min-w-[200px]">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-4 w-4 text-gray-400" />
              </div>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder="Buscar materiales..."
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>
          )}
          
          {onRefresh && (
            <button 
              onClick={onRefresh}
              className="p-2 border border-gray-200 rounded-lg hover:bg-gray-50 text-gray-600"
              title="Refrescar"
            >
              <RefreshCw className="w-5 h-5" />
            </button>
          )}
          
          {filters && (
            <div className="relative inline-block text-left">
              <button
                className="p-2 border border-gray-200 rounded-lg hover:bg-gray-50 text-gray-600 flex items-center gap-2"
              >
                <Filter className="w-5 h-5" /> 
                <span className="text-sm">Filtros</span>
              </button>
              <div className="absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-md bg-white shadow-lg border border-gray-100">
                {filters}
              </div>
            </div>
          )}
        </div>
      </div>
      
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
          {error}
        </div>
      )}
      
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-4 xl:col-span-3">
          {sidebar}
        </div>
        <div className="lg:col-span-8 xl:col-span-9">
          {main}
        </div>
      </div>
    </div>
  );
};

export default LibraryLayout; 