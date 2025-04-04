import React, { memo } from 'react';
import Sidebar from '../common/Sidebar';
import { useDashboardQuery } from '../../hooks/queries/useDashboardQuery';

interface MainLayoutProps {
  children: React.ReactNode;
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children, activeTab, setActiveTab }) => {
  const { isLoading } = useDashboardQuery();
  
  const mainContent = React.useMemo(() => {
    if (isLoading) {
      return (
        <div className="flex justify-center items-center h-screen">
          <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-gray-900 dark:border-white"></div>
        </div>
      );
    }
    return children;
  }, [isLoading, children]);
  
  return (
    <div className="flex h-screen w-full overflow-hidden bg-gray-50 dark:bg-gray-900">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      <main className="flex-1 overflow-y-auto p-4 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto space-y-4">
          {mainContent}
        </div>
      </main>
    </div>
  );
};

export default memo(MainLayout, (prevProps, nextProps) => {
  return (
    prevProps.activeTab === nextProps.activeTab &&
    prevProps.children === nextProps.children
  );
});
