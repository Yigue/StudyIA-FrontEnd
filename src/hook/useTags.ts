import { useTagsStore } from "../store/tags.store";

export const useTags = () => {
  const { tags, currentTag, isLoading, error } = useTagsStore();
  
  return {
    tags,
    currentTag,
    isLoading,
    error,
  };
};

export const useTagsActions = () => {
  const { 
    getAllTags,
    createTag,
    updateTag,
    deleteTag,
    setCurrentTag,
    clearError 
  } = useTagsStore();
  
  return {
    getAllTags,
    createTag,
    updateTag,
    deleteTag,
    setCurrentTag,
    clearError,
  };
};

export const useTagsStatus = () => useTagsStore(state => ({
  isLoading: state.isLoading,
  currentTag: state.currentTag
}));
