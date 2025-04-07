import React, { useState, useRef, useEffect } from 'react';
import { X, Check, ChevronDown } from 'lucide-react';

interface Option {
  label: string;
  value: string;
}

interface MultiSelectProps {
  options: Option[];
  value?: string[];
  onChange: (value: string[]) => void;
  placeholder?: string;
  className?: string;
}

export const MultiSelect: React.FC<MultiSelectProps> = ({
  options,
  value = [],
  onChange,
  placeholder = 'Seleccionar...',
  className = ''
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Cerrar el dropdown cuando se hace clic fuera
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Alternar la selección de una opción
  const toggleOption = (optionValue: string) => {
    const newValue = value.includes(optionValue)
      ? value.filter(v => v !== optionValue)
      : [...value, optionValue];
    
    onChange(newValue);
  };

  // Obtener las etiquetas de los valores seleccionados
  const selectedLabels = options
    .filter(option => value.includes(option.value))
    .map(option => option.label);

  return (
    <div 
      className={`relative ${className}`}
      ref={containerRef}
    >
      <div
        className="flex min-h-[40px] w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background cursor-pointer"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex flex-wrap gap-1">
          {selectedLabels.length > 0 ? (
            selectedLabels.map((label, i) => (
              <span 
                key={i} 
                className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-primary/10 text-primary"
              >
                {label}
                <X 
                  className="ml-1 h-3 w-3 cursor-pointer" 
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleOption(options.find(o => o.label === label)?.value || '');
                  }} 
                />
              </span>
            ))
          ) : (
            <span className="text-muted-foreground">{placeholder}</span>
          )}
        </div>
        <ChevronDown className="h-4 w-4 opacity-50" />
      </div>
      
      {isOpen && (
        <div className="absolute z-10 w-full mt-1 bg-popover text-popover-foreground shadow-md rounded-md border border-border overflow-hidden">
          <div className="max-h-[200px] overflow-y-auto">
            {options.map((option) => (
              <div
                key={option.value}
                className={`flex items-center px-3 py-2 cursor-pointer hover:bg-accent hover:text-accent-foreground ${
                  value.includes(option.value) ? 'bg-accent/50' : ''
                }`}
                onClick={() => toggleOption(option.value)}
              >
                <div className={`h-4 w-4 mr-2 flex items-center justify-center rounded-sm border ${
                  value.includes(option.value) ? 'bg-primary border-primary text-primary-foreground' : 'border-primary/50'
                }`}>
                  {value.includes(option.value) && <Check className="h-3 w-3" />}
                </div>
                <span>{option.label}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default MultiSelect; 