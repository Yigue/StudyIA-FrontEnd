import React, { useState, useEffect, useRef } from 'react';
import { ChevronDown } from 'lucide-react';
import { cn } from '../../lib/utils';

export interface DropdownItemProps {
  /**
   * ID único del elemento
   */
  id: string | number;
  /**
   * Texto o componente a mostrar
   */
  label: React.ReactNode;
  /**
   * Icono opcional
   */
  icon?: React.ReactNode;
  /**
   * Indica si el elemento está deshabilitado
   */
  disabled?: boolean;
  /**
   * Acción a ejecutar al hacer clic
   */
  onClick?: () => void;
  /**
   * Clase adicional para el elemento
   */
  className?: string;
}

export interface DropdownProps {
  /**
   * Texto del botón que despliega el menú
   */
  buttonText?: React.ReactNode;
  /**
   * Icono opcional para el botón
   */
  buttonIcon?: React.ReactNode;
  /**
   * Elementos del menú desplegable
   */
  items: DropdownItemProps[];
  /**
   * Indica si debe mostrarse una flecha en el botón
   */
  showArrow?: boolean;
  /**
   * Clase adicional para el contenedor
   */
  className?: string;
  /**
   * Clase adicional para el botón
   */
  buttonClassName?: string;
  /**
   * Clase adicional para el menú desplegable
   */
  menuClassName?: string;
  /**
   * Posición del menú respecto al botón
   */
  position?: 'bottom-left' | 'bottom-right' | 'top-left' | 'top-right';
  /**
   * Ancho del menú desplegable
   */
  width?: 'auto' | 'full';
  /**
   * Indica si el botón debe ocupar todo el ancho disponible
   */
  fullWidth?: boolean;
  /**
   * Contenido personalizado para el botón del dropdown
   */
  customButton?: React.ReactNode;
}

const Dropdown: React.FC<DropdownProps> = ({
  buttonText = 'Opciones',
  buttonIcon,
  items = [],
  showArrow = true,
  className,
  buttonClassName,
  menuClassName,
  position = 'bottom-left',
  width = 'auto',
  fullWidth = false,
  customButton,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  
  // Maneja el clic en el botón del dropdown
  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };
  
  // Cierra el dropdown al hacer clic fuera de él
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  
  // Mapeo de posiciones
  const positionClasses = {
    'bottom-left': 'top-full left-0 mt-1',
    'bottom-right': 'top-full right-0 mt-1',
    'top-left': 'bottom-full left-0 mb-1',
    'top-right': 'bottom-full right-0 mb-1',
  };
  
  // Mapeo de anchos
  const widthClasses = {
    'auto': 'min-w-[12rem]',
    'full': 'w-full',
  };
  
  return (
    <div 
      className={cn(
        'relative inline-block',
        fullWidth && 'w-full',
        className
      )}
      ref={dropdownRef}
    >
      {/* Botón personalizado o predeterminado */}
      {customButton ? (
        <div onClick={toggleDropdown} className="cursor-pointer">
          {customButton}
        </div>
      ) : (
        <button
          type="button"
          onClick={toggleDropdown}
          className={cn(
            'flex items-center justify-between px-4 py-2 text-sm font-medium rounded-md border border-gray-300 bg-white dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-primary-500',
            fullWidth && 'w-full',
            buttonClassName
          )}
        >
          <div className="flex items-center">
            {buttonIcon && <span className="mr-2">{buttonIcon}</span>}
            <span>{buttonText}</span>
          </div>
          {showArrow && (
            <ChevronDown 
              className={cn(
                'ml-2 h-4 w-4 transition-transform',
                isOpen && 'transform rotate-180'
              )} 
            />
          )}
        </button>
      )}
      
      {/* Menú desplegable */}
      {isOpen && (
        <div
          className={cn(
            'absolute z-10 bg-white dark:bg-gray-800 rounded-md shadow-lg py-1 border border-gray-200 dark:border-gray-700',
            positionClasses[position],
            widthClasses[width],
            menuClassName
          )}
        >
          <ul className="divide-y divide-gray-100 dark:divide-gray-700">
            {items.map((item) => (
              <li key={item.id}>
                <button
                  className={cn(
                    'flex items-center w-full px-4 py-2 text-sm text-left hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:bg-gray-50 dark:focus:bg-gray-700',
                    item.disabled && 'opacity-50 cursor-not-allowed',
                    item.className
                  )}
                  onClick={() => {
                    if (!item.disabled && item.onClick) {
                      item.onClick();
                      setIsOpen(false);
                    }
                  }}
                  disabled={item.disabled}
                >
                  {item.icon && <span className="mr-2">{item.icon}</span>}
                  {item.label}
                </button>
              </li>
            ))}
            {items.length === 0 && (
              <li className="px-4 py-2 text-sm text-gray-500 dark:text-gray-400">
                No hay opciones disponibles
              </li>
            )}
          </ul>
        </div>
      )}
    </div>
  );
};

export default Dropdown; 