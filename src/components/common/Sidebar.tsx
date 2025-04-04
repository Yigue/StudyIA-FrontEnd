import React from "react";
import { useNavigate } from "react-router-dom";
import { LayoutDashboard, Book, Settings, LogOut, Brain } from "lucide-react";
import ThemeToggle from "../ui/ThemeToggle";
import { useAuth } from "../../hooks/useAuth";

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab }) => {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const menuItems = [
    { id: "dashboard", icon: LayoutDashboard, label: "Dashboard" },
    { id: "study", icon: Brain, label: "Estudiar" },
    { id: "library", icon: Book, label: "Biblioteca" },
    { id: "flashcards", icon: LayoutDashboard, label: "Flashcards" },
    { id: "settings", icon: Settings, label: "Ajustes" },
  ];

  const handleTabClick = (tab: string) => {
    setActiveTab(tab);
    navigate(`/${tab}`);
  };

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <div
      className={`w-64  bg-white border-gray-200   dark:bg-gray-900 dark:border-gray-700' border-r p-4 transition-colors duration-200 flex flex-col h-full`}
    >
      <div className="flex items-center gap-2 mb-8">
        <Brain className={`w-8 h-8 dark:text-indigo-400' text-indigo-600`} />
        <h1 className={`text-xl font-bold dark:text-white text-gray-800`}>
          StudyIA
        </h1>
      </div>

      <nav className="flex-1">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => handleTabClick(item.id)}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg mb-2 ${
              activeTab === item.id
                ?  "dark:bg-indigo-900/50 dark:text-indigo-300 bg-indigo-50 text-indigo-600"
                :  "dark:text-gray-300 dark:hover:bg-gray-800 text-gray-600 hover:bg-gray-50"
            } transition-colors duration-200`}
          >
            <item.icon className="w-5 h-5" />
            <span className="font-medium">{item.label}</span>
          </button>
        ))}
      </nav>

      <div className="mt-auto pt-4 border-t border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between mb-4">
          <div
            className={`text-sm dark:text-gray-400 text-gray-500`}
          >
            Configuración
          </div>
          <ThemeToggle className="!p-1.5" />
        </div>

        <button
          onClick={handleLogout}
          className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg
             dark:bg-red-900/20 dark:text-red-300 dark:hover:bg-red-900/30 
             bg-red-50 text-red-600 hover:bg-red-100
         transition-colors duration-200`}
        >
          <LogOut className="w-5 h-5" />
          <span className="font-medium">Cerrar sesión</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
