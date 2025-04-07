import React, { useState, useCallback, useEffect, useMemo } from 'react';
import { useMaterialsQuery, useDeleteMaterial } from '../../hooks/queries/useMaterialsQuery';
import { Link } from '@tanstack/react-router';
import { Params } from '@/types';

// Componente de filtro para materiales
const MaterialFilter: React.FC<{
  currentFilters: Params;
  onFilterChange: (filters: Partial<Params>) => void;
}> = ({ currentFilters, onFilterChange }) => {
  const [searchTerm, setSearchTerm] = useState(currentFilters.search || '');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    onFilterChange({ search: searchTerm });
  };

  return (
    <div className="flex gap-4 mb-4 flex-wrap">
      <form onSubmit={handleSearch} className="flex flex-1 min-w-[280px]">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Buscar materiales..."
          className="flex-1 p-2 border rounded-l"
        />
        <button type="submit" className="px-4 bg-blue-600 text-white rounded-r">
          Buscar
        </button>
      </form>
      
      <select
        value={currentFilters.type || ''}
        onChange={(e) => onFilterChange({ type: e.target.value })}
        className="p-2 border rounded"
      >
        <option value="">Todos los tipos</option>
        <option value="pdf">PDF</option>
        <option value="text">Texto</option>
        <option value="url">URL</option>
      </select>
    </div>
  );
};

// Componente de elemento individual de material
const MaterialItem: React.FC<{
  material: any;
  onDelete: (id: string) => void;
}> = ({ material, onDelete }) => {
  const handleDelete = () => {
    if (window.confirm('¿Estás seguro de que deseas eliminar este material?')) {
      onDelete(material.id);
    }
  };

  return (
    <div className="p-4 border rounded mb-2 flex justify-between items-center bg-white">
      <div>
        <h3 className="text-lg font-semibold">{material.title}</h3>
        <p className="text-gray-600 text-sm">{material.description}</p>
        <div className="flex gap-2 mt-2">
          {material.tags?.map((tag: any) => (
            <span key={tag.id} className="px-2 py-1 bg-gray-100 text-xs rounded">
              {tag.name}
            </span>
          ))}
        </div>
      </div>
      <div className="flex gap-2">
        <Link
          to={`/materials/${material.id}`}
          className="px-3 py-1 bg-blue-600 text-white rounded text-sm"
        >
          Ver
        </Link>
        <button
          onClick={handleDelete}
          className="px-3 py-1 bg-red-600 text-white rounded text-sm"
        >
          Eliminar
        </button>
      </div>
    </div>
  );
};

// Componente de paginación
const Pagination: React.FC<{
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}> = ({ currentPage, totalPages, onPageChange }) => {
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <div className="flex justify-center gap-2 mt-4">
      <button
        disabled={currentPage === 1}
        onClick={() => onPageChange(currentPage - 1)}
        className="px-3 py-1 border rounded disabled:opacity-50"
      >
        Anterior
      </button>
      
      {pages.map(page => (
        <button
          key={page}
          onClick={() => onPageChange(page)}
          className={`px-3 py-1 border rounded ${
            currentPage === page ? 'bg-blue-600 text-white' : ''
          }`}
        >
          {page}
        </button>
      ))}
      
      <button
        disabled={currentPage === totalPages}
        onClick={() => onPageChange(currentPage + 1)}
        className="px-3 py-1 border rounded disabled:opacity-50"
      >
        Siguiente
      </button>
    </div>
  );
};

// Componente principal de lista de materiales
const MaterialList: React.FC = () => {
  const [filters, setFilters] = useState<Params>({
    page: 1,
    limit: 10,
  });

  // Utilizar React Query para obtener la lista de materiales
  const { 
    data: materials, 
    isLoading, 
    isError, 
    error, 
    isFetching 
  } = useMaterialsQuery(filters);

  // Utilizar React Query para eliminar materiales
  const deleteMutation = useDeleteMaterial();

  const handleFilterChange = useCallback((newFilters: Partial<Params>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  }, []);

  const handlePageChange = useCallback((page: number) => {
    setFilters(prev => ({ ...prev, page }));
  }, []);

  const handleDelete = useCallback((id: string) => {
    deleteMutation.mutate(id);
  }, [deleteMutation]);

  if (isLoading) {
    return (
      <div className="flex justify-center p-8">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="p-4 bg-red-100 border border-red-400 text-red-700 rounded mb-4">
        <h3 className="font-bold">Error</h3>
        <p>{error instanceof Error ? error.message : 'Ha ocurrido un error al cargar los materiales'}</p>
      </div>
    );
  }

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Materiales de Estudio</h2>
        <Link
          to="/materials/new"
          className="px-4 py-2 bg-green-600 text-white rounded"
        >
          Nuevo Material
        </Link>
      </div>

      <MaterialFilter currentFilters={filters} onFilterChange={handleFilterChange} />

      {/* Indicador de carga durante refetch */}
      {isFetching && !isLoading && (
        <div className="p-2 mb-4 bg-blue-50 text-blue-600 rounded text-sm">
          Actualizando datos...
        </div>
      )}

      {/* Lista de materiales */}
      {materials && materials.length > 0 ? (
        <div>
          {materials.map((material) => (
            <MaterialItem 
              key={material.id} 
              material={material} 
              onDelete={handleDelete} 
            />
          ))}
          
          <Pagination
            currentPage={filters.page || 1}
            totalPages={Math.ceil((filters.totalItems || 0) / (filters.limit || 10))}
            onPageChange={handlePageChange}
          />
        </div>
      ) : (
        <div className="p-8 text-center bg-gray-50 rounded">
          <p className="text-gray-600">No se encontraron materiales de estudio.</p>
          <Link
            to="/materials/new"
            className="mt-2 inline-block px-4 py-2 bg-blue-600 text-white rounded"
          >
            Crear Nuevo Material
          </Link>
        </div>
      )}
    </div>
  );
};

export default MaterialList; 