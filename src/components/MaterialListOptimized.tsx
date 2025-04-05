import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  useMaterialsQuery, 
  useDeleteMaterial 
} from '../hooks/queries/useMaterialsQuery';
import { StudyMaterial, Tag } from '@/types';
import { Search, Filter, Trash2, Eye, Plus, ArrowLeft, ArrowRight, Loader2 } from 'lucide-react';
import { useMaterialsInfiniteQuery } from '../hooks/queries/useMaterialsInfinite';

interface MaterialListProps {
  withPagination?: boolean;
  withInfiniteScroll?: boolean;
}

/**
 * Componente optimizado para mostrar una lista de materiales
 * Soporta:
 * - Búsqueda por título
 * - Filtrado por tipo y etiquetas
 * - Paginación o carga infinita
 * - Acciones de vista y eliminación
 */
const MaterialListOptimized: React.FC<MaterialListProps> = ({ 
  withPagination = true,
  withInfiniteScroll = false
}) => {
  const navigate = useNavigate();
  
  // Estados para filtros y búsqueda
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [page, setPage] = useState(1);
  const [typeFilter, setTypeFilter] = useState<string | null>(null);
  
  // Construir parámetros de consulta
  const queryParams = useMemo(() => {
    const params: Record<string, any> = { page };
    
    if (searchTerm) {
      params.search = searchTerm;
    }
    
    if (selectedTags.length > 0) {
      params.tags = selectedTags.join(',');
    }
    
    if (typeFilter) {
      params.type = typeFilter;
    }
    
    return params;
  }, [searchTerm, selectedTags, typeFilter, page]);
  
  // React Query Hooks
  const { 
    data: materials = [], 
    isLoading, 
    error, 
    refetch 
  } = useMaterialsQuery(queryParams);
  
  const infiniteQuery = useMaterialsInfiniteQuery(queryParams);
  
  const deleteMutation = useDeleteMaterial();
  
  // Manejar la eliminación de un material
  const handleDelete = async (id: string) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar este material?')) {
      try {
        await deleteMutation.mutateAsync(id);
      } catch (error) {
        console.error('Error al eliminar material:', error);
      }
    }
  };
  
  // Manejar la visualización de un material
  const handleView = (id: string) => {
    navigate(`/material/${id}`);
  };
  
  // Calcular datos para la paginación
  const totalPages = 10; // Obtener desde la respuesta de la API
  
  // Renderizar loading state
  if (isLoading) {
    return (
      <div className="flex justify-center items-center p-8">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
      </div>
    );
  }
  
  // Renderizar error state
  if (error) {
    return (
      <div className="p-4 bg-red-50 text-red-600 rounded-lg">
        Error al cargar materiales: {error instanceof Error ? error.message : 'Error desconocido'}
      </div>
    );
  }
  
  // Determinar qué materiales mostrar
  const materialsToShow = withInfiniteScroll 
    ? infiniteQuery.data?.pages.flatMap(page => page.data || []) || []
    : materials;
  
  return (
    <div className="bg-white shadow-sm rounded-lg p-6">
      {/* Barra de búsqueda y filtros */}
      <div className="mb-6 flex flex-col md:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar materiales..."
            className="pl-10 w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          />
        </div>
        
        <div className="flex gap-2">
          <button 
            onClick={() => setTypeFilter(typeFilter === 'text' ? null : 'text')}
            className={`px-3 py-2 rounded-lg flex items-center ${
              typeFilter === 'text' 
                ? 'bg-indigo-100 text-indigo-700 border border-indigo-300' 
                : 'bg-gray-100 text-gray-700 border border-gray-300'
            }`}
          >
            <Filter className="w-4 h-4 mr-1" />
            Texto
          </button>
          
          <button 
            onClick={() => setTypeFilter(typeFilter === 'pdf' ? null : 'pdf')}
            className={`px-3 py-2 rounded-lg flex items-center ${
              typeFilter === 'pdf' 
                ? 'bg-indigo-100 text-indigo-700 border border-indigo-300' 
                : 'bg-gray-100 text-gray-700 border border-gray-300'
            }`}
          >
            <Filter className="w-4 h-4 mr-1" />
            PDF
          </button>
          
          <button 
            onClick={() => setTypeFilter(typeFilter === 'url' ? null : 'url')}
            className={`px-3 py-2 rounded-lg flex items-center ${
              typeFilter === 'url' 
                ? 'bg-indigo-100 text-indigo-700 border border-indigo-300' 
                : 'bg-gray-100 text-gray-700 border border-gray-300'
            }`}
          >
            <Filter className="w-4 h-4 mr-1" />
            URL
          </button>
        </div>
      </div>
      
      {/* Lista de materiales */}
      {materialsToShow.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-500">No se encontraron materiales</p>
          <button 
            onClick={() => navigate('/study')}
            className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-lg flex items-center mx-auto"
          >
            <Plus className="w-4 h-4 mr-2" />
            Crear nuevo material
          </button>
        </div>
      ) : (
        <div className="divide-y divide-gray-200">
          {materialsToShow.map((material: StudyMaterial) => (
            <div key={material.id} className="py-4 flex items-center justify-between">
              <div>
                <h3 className="font-medium text-gray-900">{material.title}</h3>
                <p className="text-sm text-gray-500">
                  {material.description || 'Sin descripción'}
                </p>
                {material.tags && material.tags.length > 0 && (
                  <div className="mt-1 flex gap-1">
                    {material.tags.map((tag: Tag) => (
                      <span 
                        key={tag.id} 
                        className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-indigo-100 text-indigo-800"
                        onClick={() => {
                          const tagId = tag.id;
                          setSelectedTags(prev => 
                            prev.includes(tagId) 
                              ? prev.filter(id => id !== tagId) 
                              : [...prev, tagId]
                          );
                        }}
                      >
                        {tag.name}
                      </span>
                    ))}
                  </div>
                )}
              </div>
              
              <div className="flex gap-2">
                <button 
                  onClick={() => handleView(material.id)}
                  className="p-2 text-indigo-600 hover:text-indigo-800"
                >
                  <Eye className="w-5 h-5" />
                </button>
                <button 
                  onClick={() => handleDelete(material.id)}
                  className="p-2 text-red-600 hover:text-red-800"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
      
      {/* Paginación */}
      {withPagination && !withInfiniteScroll && (
        <div className="mt-4 flex justify-between items-center">
          <button
            disabled={page <= 1}
            onClick={() => setPage(prev => Math.max(prev - 1, 1))}
            className={`flex items-center px-3 py-2 rounded ${
              page <= 1 
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <ArrowLeft className="w-4 h-4 mr-1" />
            Anterior
          </button>
          
          <span className="text-sm text-gray-500">
            Página {page} de {totalPages}
          </span>
          
          <button
            disabled={page >= totalPages}
            onClick={() => setPage(prev => prev + 1)}
            className={`flex items-center px-3 py-2 rounded ${
              page >= totalPages 
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Siguiente
            <ArrowRight className="w-4 h-4 ml-1" />
          </button>
        </div>
      )}
      
      {/* Botón de carga infinita */}
      {withInfiniteScroll && infiniteQuery.hasNextPage && (
        <div className="mt-4 flex justify-center">
          <button
            onClick={() => infiniteQuery.fetchNextPage()}
            disabled={infiniteQuery.isFetchingNextPage}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg flex items-center mx-auto"
          >
            {infiniteQuery.isFetchingNextPage ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <Plus className="w-4 h-4 mr-2" />
            )}
            Cargar más
          </button>
        </div>
      )}
    </div>
  );
};

export default MaterialListOptimized; 