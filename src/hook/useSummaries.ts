import { useSummariesStore } from "../store/summaries.store";

export const useSummaries = () => {
  const { summaries, currentSummary, isLoading, error } = useSummariesStore();
  
  return {
    summaries,
    currentSummary,
    isLoading,
    error,
  };
};

export const useSummariesActions = () => {
  const { 
    getAllSummaries,
    getSummaryById,
    getSummariesByMaterial,
    createSummary,
    updateSummary,
    deleteSummary,
    setCurrentSummary,
    clearError 
  } = useSummariesStore();
  
  return {
    getAllSummaries,
    getSummaryById,
    getSummariesByMaterial,
    createSummary,
    updateSummary,
    deleteSummary,
    setCurrentSummary,
    clearError,
  };
};

export const useSummariesStatus = () => useSummariesStore(state => ({
  isLoading: state.isLoading,
  currentSummary: state.currentSummary
}));
