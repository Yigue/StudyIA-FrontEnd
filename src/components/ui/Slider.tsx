import React, { useState, useEffect, useRef } from 'react';

interface SliderProps {
  min: number;
  max: number;
  step?: number;
  value: number;
  onChange: (value: number) => void;
  className?: string;
}

export const Slider: React.FC<SliderProps> = ({
  min,
  max,
  step = 1,
  value,
  onChange,
  className = '',
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const sliderRef = useRef<HTMLDivElement>(null);

  const getValueFromPosition = (position: number): number => {
    if (!sliderRef.current) return min;
    
    const rect = sliderRef.current.getBoundingClientRect();
    const percentage = Math.max(0, Math.min(1, (position - rect.left) / rect.width));
    
    // Calcular el valor basado en el porcentaje, considerando el paso
    const rawValue = min + percentage * (max - min);
    const steppedValue = Math.round(rawValue / step) * step;
    
    return Math.max(min, Math.min(max, steppedValue));
  };

  const handleDrag = (clientX: number) => {
    if (!isDragging) return;
    
    const newValue = getValueFromPosition(clientX);
    onChange(newValue);
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    handleDrag(e.clientX);
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      handleDrag(e.clientX);
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging]);

  // Calcular el porcentaje del valor actual
  const percentage = ((value - min) / (max - min)) * 100;

  return (
    <div 
      ref={sliderRef}
      className={`relative h-5 w-full touch-none ${className}`}
      onMouseDown={handleMouseDown}
    >
      <div className="absolute h-1 bg-gray-200 dark:bg-gray-700 rounded-full top-2 left-0 right-0">
        <div 
          className="absolute h-1 bg-indigo-600 dark:bg-indigo-400 rounded-full top-0 left-0"
          style={{ width: `${percentage}%` }}
        />
        <div 
          className="absolute h-4 w-4 rounded-full bg-white border-2 border-indigo-600 dark:border-indigo-400 top-1/2 -translate-y-1/2 cursor-pointer shadow-md"
          style={{ left: `${percentage}%`, transform: "translate(-50%, -50%)" }}
        />
      </div>
    </div>
  );
};

export default Slider; 