import React from 'react';
import { Book, Brain, Layout, Settings, LayoutGrid } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab }) => {
  const navigate = useNavigate();
  const menuItems = [
    { id: 'dashboard', icon: Layout, label: 'Dashboard' },
    { id: 'study', icon: Brain, label: 'Estudiar' },
    { id: 'library', icon: Book, label: 'Biblioteca' },
    { id: 'flashcards', icon: LayoutGrid, label: 'Flashcards' },
    { id: 'settings', icon: Settings, label: 'Ajustes' },
  ];

  return (
    <div className="w-64 bg-white border-r border-gray-200 p-4">
      <div className="flex items-center gap-2 mb-8">
        <Brain className="w-8 h-8 text-indigo-600" />
        <h1 className="text-xl font-bold text-gray-800">SmartStudy</h1>
      </div>
      <nav>
        {menuItems.map((item) => (
          <button
            key={item.id} // Añadimos la key usando el id único de cada item
            onClick={() => {
              setActiveTab(item.id);
              navigate(`/${item.id}`);
            }}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg mb-2 ${
              activeTab === item.id
                ? 'bg-indigo-50 text-indigo-600'
                : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            <item.icon className="w-5 h-5" />
            <span className="font-medium">{item.label}</span>
          </button>
        ))}
      </nav>
    </div>
  );
};

export default Sidebar;
