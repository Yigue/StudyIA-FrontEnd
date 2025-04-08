import React, { useState, useEffect } from "react";
import { useNavigate } from "@tanstack/react-router";
import { motion, AnimatePresence } from "framer-motion";
import { 
  LayoutDashboard, 
  Book, 
  Settings, 
  LogOut, 
  Brain, 
  Layers, 
  FileBarChart,
  Play,
  GraduationCap,
  Timer,
  Clock,
  Award,
  ChevronDown,
  ChevronRight,
  Menu,
  X
} from "lucide-react";
import ThemeToggle from "../ui/ThemeToggle";
import { useAuth } from "../../hooks/useAuth";

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

// Interfaz para ítems del menú
interface MenuItem {
  id: string;
  icon: React.ElementType;
  label: string;
  path?: string;
  children?: MenuItem[];
  color?: string;
}

const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab }) => {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [expandedGroups, setExpandedGroups] = useState<string[]>(['study']);
  const [isOpen, setIsOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Detectar tamaño de pantalla
  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    // Verificar tamaño inicial
    checkIfMobile();
    
    // Listener para cambios de tamaño
    window.addEventListener('resize', checkIfMobile);
    
    return () => {
      window.removeEventListener('resize', checkIfMobile);
    };
  }, []);

  // Cerrar sidebar en modo móvil después de navegar
  useEffect(() => {
    if (isMobile) {
      setIsOpen(false);
    } else {
      setIsOpen(true);
    }
  }, [isMobile, activeTab]);

  // Estructura mejorada del menú
  const menuItems: MenuItem[] = [
    { id: "dashboard", icon: LayoutDashboard, label: "Dashboard", path: "/dashboard" },
    { 
      id: "study", 
      icon: GraduationCap, 
      label: "Estudiar",
      children: [
        { id: "standard", icon: Play, label: "Modo Estándar", path: "/sesion" },
        { id: "pomodoro", icon: Timer, label: "Modo Pomodoro", path: "/sesion?mode=pomodoro", color: "text-red-500" },
        { id: "exam", icon: Clock, label: "Modo Examen", path: "/sesion?mode=exam", color: "text-amber-500" },
        { id: "daily_challenge", icon: Award, label: "Desafío Diario", path: "/sesion?mode=daily_challenge", color: "text-green-500" }
      ]
    },
    { id: "flashcards", icon: Layers, label: "Flashcards", path: "/flashcards" },
    { id: "analytics", icon: FileBarChart, label: "Analíticas", path: "/analytics" },
    { id: "upload", icon: Brain, label: "Cargar Material", path: "/study" },
    { id: "library", icon: Book, label: "Biblioteca", path: "/library" },
    { id: "settings", icon: Settings, label: "Ajustes", path: "/settings" },
  ];

  const handleTabClick = (item: MenuItem) => {
    if (item.children) {
      // Si es un grupo, expandir/colapsar
      toggleGroup(item.id);
    } else if (item.path) {
      // Si es un ítem con ruta, navegar
      setActiveTab(item.id);
      navigate({ to: item.path });
      if (isMobile) setIsOpen(false);
    }
  };

  const toggleGroup = (groupId: string) => {
    setExpandedGroups(prev => 
      prev.includes(groupId) 
        ? prev.filter(id => id !== groupId) 
        : [...prev, groupId]
    );
  };

  const handleLogout = () => {
    logout();
    navigate({ to: '/' });
  };
  
  // Renderizar ítems de menú con soporte para grupos
  const renderMenuItems = (items: MenuItem[]) => {
    return items.map((item) => (
      <div key={item.id} className="mb-1">
        {/* Ítem principal (o cabecera de grupo) */}
        <button
          onClick={() => handleTabClick(item)}
          className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg ${
            (!item.children && activeTab === item.id)
              ? "dark:bg-indigo-900/50 dark:text-indigo-300 bg-indigo-50 text-indigo-600"
              : "dark:text-gray-300 dark:hover:bg-gray-800 text-gray-600 hover:bg-gray-50"
          } transition-colors duration-200`}
        >
          <item.icon className={`w-5 h-5 ${item.color || ''}`} />
          <span className="font-medium flex-grow text-left">{item.label}</span>
          {item.children && (
            expandedGroups.includes(item.id) ? 
              <ChevronDown className="w-4 h-4" /> : 
              <ChevronRight className="w-4 h-4" />
          )}
        </button>
        
        {/* Subítems si es un grupo y está expandido */}
        {item.children && expandedGroups.includes(item.id) && (
          <div className="ml-4 pl-2 mt-1 border-l-2 border-gray-200 dark:border-gray-700">
            {item.children.map(child => (
              <button
                key={child.id}
                onClick={() => {
                  setActiveTab(child.id);
                  if (child.path) navigate({ to: child.path });
                  if (isMobile) setIsOpen(false);
                }}
                className={`w-full flex items-center gap-3 px-4 py-2 rounded-lg mb-1 ${
                  activeTab === child.id
                    ? "dark:bg-indigo-900/50 dark:text-indigo-300 bg-indigo-50 text-indigo-600"
                    : "dark:text-gray-300 dark:hover:bg-gray-800 text-gray-600 hover:bg-gray-50"
                } transition-colors duration-200`}
              >
                <child.icon className={`w-4 h-4 ${child.color || ''}`} />
                <span className="font-medium text-sm">{child.label}</span>
              </button>
            ))}
          </div>
        )}
      </div>
    ));
  };

  // Botón de menú móvil
  const MobileMenuButton = () => (
    <button 
      onClick={() => setIsOpen(!isOpen)}
      className="md:hidden fixed top-4 left-4 z-50 p-2 rounded-lg bg-white dark:bg-gray-800 shadow-md border border-gray-200 dark:border-gray-700"
    >
      {isOpen ? 
        <X className="w-6 h-6 text-gray-800 dark:text-gray-200" /> : 
        <Menu className="w-6 h-6 text-gray-800 dark:text-gray-200" />
      }
    </button>
  );

  // Overlay para cerrar el menú al hacer clic afuera (solo en móvil)
  const Overlay = () => (
    <AnimatePresence>
      {isOpen && isMobile && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setIsOpen(false)}
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
        />
      )}
    </AnimatePresence>
  );

  return (
    <>
      <MobileMenuButton />
      <Overlay />
      
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ x: isMobile ? -320 : 0, opacity: isMobile ? 0 : 1 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -320, opacity: 0 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className={`
              w-64 bg-white border-gray-200 dark:bg-gray-900 dark:border-gray-700 border-r 
              p-4 flex flex-col h-full z-50
              ${isMobile ? 'fixed left-0 top-0 bottom-0 shadow-xl' : ''}
            `}
          >
            <div className="flex items-center gap-2 mb-8">
              <Brain className={`w-8 h-8 dark:text-indigo-400 text-indigo-600`} />
              <h1 className={`text-xl font-bold dark:text-white text-gray-800`}>
                StudyIA
              </h1>
            </div>

            <nav className="flex-1 overflow-y-auto">
              {renderMenuItems(menuItems)}
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
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Sidebar;
