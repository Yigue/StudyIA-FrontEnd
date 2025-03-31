import React from 'react';
import { LucideIcon } from 'lucide-react';

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  change?: number;
  color: 'indigo' | 'blue' | 'green' | 'yellow' | 'red' | 'purple';
}

// Mapeo de colores para los diferentes elementos según el color principal
const colorStyles = {
  indigo: {
    bgLight: 'bg-indigo-50 dark:bg-indigo-900/30',
    textIcon: 'text-indigo-600 dark:text-indigo-400',
    hoverBg: 'hover:bg-indigo-100 dark:hover:bg-indigo-900/50',
  },
  blue: {
    bgLight: 'bg-blue-50 dark:bg-blue-900/30',
    textIcon: 'text-blue-600 dark:text-blue-400',
    hoverBg: 'hover:bg-blue-100 dark:hover:bg-blue-900/50',
  },
  green: {
    bgLight: 'bg-green-50 dark:bg-green-900/30',
    textIcon: 'text-green-600 dark:text-green-400',
    hoverBg: 'hover:bg-green-100 dark:hover:bg-green-900/50',
  },
  yellow: {
    bgLight: 'bg-amber-50 dark:bg-amber-900/30',
    textIcon: 'text-amber-600 dark:text-amber-400',
    hoverBg: 'hover:bg-amber-100 dark:hover:bg-amber-900/50',
  },
  red: {
    bgLight: 'bg-red-50 dark:bg-red-900/30',
    textIcon: 'text-red-600 dark:text-red-400',
    hoverBg: 'hover:bg-red-100 dark:hover:bg-red-900/50',
  },
  purple: {
    bgLight: 'bg-purple-50 dark:bg-purple-900/30',
    textIcon: 'text-purple-600 dark:text-purple-400',
    hoverBg: 'hover:bg-purple-100 dark:hover:bg-purple-900/50',
  },
};

export const StatsCard: React.FC<StatsCardProps> = ({ 
  title, 
  value, 
  icon: Icon, 
  color = 'indigo',
  change 
}) => {
  const styles = colorStyles[color];
  
  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 transition-all duration-300 hover:shadow-md">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">{title}</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{value}</p>
          
          {change !== undefined && (
            <div className="mt-1">
              <span className={`text-xs font-medium ${
                change > 0 
                  ? 'text-green-600 dark:text-green-400' 
                  : change < 0 
                    ? 'text-red-600 dark:text-red-400' 
                    : 'text-gray-500 dark:text-gray-400'
              }`}>
                {change > 0 ? '+' : ''}{change}% desde la semana pasada
              </span>
            </div>
          )}
        </div>
        
        <div className={`p-3 rounded-lg ${styles.bgLight} ${styles.hoverBg} transition-all duration-300 hover:scale-110`}>
          <Icon className={`w-6 h-6 ${styles.textIcon}`} />
        </div>
      </div>
    </div>
  );
};
