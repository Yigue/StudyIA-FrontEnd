import { useInfiniteQuery } from '@tanstack/react-query';
import * as materialService from '../../services/studyMaterial/studyMaterialService';
import { ApiResponse, Params, StudyMaterial } from '@/types';

interface MaterialsResponse {
  data: StudyMaterial[];
  meta: {
    page: number;
    pages: number;
    limit: number;
    total: number;
  };
}

/**
 * Hook para paginación infinita de materiales con soporte completo para filtrado
 */
export const useMaterialsInfiniteQuery = (filters: Params = {}) => {
  return useInfiniteQuery<ApiResponse<StudyMaterial[]>, Error, ApiResponse<StudyMaterial[]>, [string, string, Params], number>({
    queryKey: ['materials', 'infinite', filters],
    queryFn: ({ pageParam }) => 
      materialService.getAllStudyMaterials({ ...filters, page: pageParam, limit: 10 }),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      const meta = lastPage.meta;
      return meta?.page < meta?.pages ? meta.page + 1 : undefined;
    },
    select: (data) => ({
      pages: data.pages,
      pageParams: data.pageParams,
      // Aplanar los resultados para facilitar el uso
      materials: data.pages.flatMap(page => page.data || [])
    }),
    staleTime: 1 * 60 * 1000, // 1 minuto (menor que la consulta normal)
  });
}; 