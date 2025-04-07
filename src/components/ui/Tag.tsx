import React from 'react';

interface TagProps {
  text?: string;
  children?: React.ReactNode;
  onRemove?: () => void;
  onDelete?: () => void;
  color?: 'default' | 'primary' | 'success' | 'warning' | 'danger';
  variant?: 'solid' | 'outline' | 'light';
  className?: string;
}

export const Tag: React.FC<TagProps> = ({
  text,
  children,
  onRemove,
  onDelete,
  color = 'default',
  variant = 'solid',
  className = '',
}) => {
  // Usar onDelete si está disponible, sino usar onRemove
  const handleDelete = onDelete || onRemove;
  
  const getColorClasses = () => {
    const colorVariants = {
      default: {
        solid: 'bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-gray-200',
        outline: 'bg-transparent border border-gray-300 text-gray-800 dark:border-gray-600 dark:text-gray-200',
        light: 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200'
      },
      primary: {
        solid: 'bg-indigo-500 text-white dark:bg-indigo-600',
        outline: 'bg-transparent border border-indigo-500 text-indigo-700 dark:border-indigo-400 dark:text-indigo-300',
        light: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-300'
      },
      success: {
        solid: 'bg-green-500 text-white dark:bg-green-600',
        outline: 'bg-transparent border border-green-500 text-green-700 dark:border-green-400 dark:text-green-300',
        light: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
      },
      warning: {
        solid: 'bg-yellow-500 text-white dark:bg-yellow-600',
        outline: 'bg-transparent border border-yellow-500 text-yellow-700 dark:border-yellow-400 dark:text-yellow-300',
        light: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300'
      },
      danger: {
        solid: 'bg-red-500 text-white dark:bg-red-600',
        outline: 'bg-transparent border border-red-500 text-red-700 dark:border-red-400 dark:text-red-300',
        light: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300'
      }
    };
    
    return colorVariants[color][variant];
  };

  return (
    <div
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getColorClasses()} ${className}`}
    >
      {text || children}
      {handleDelete && (
        <button
          type="button"
          onClick={handleDelete}
          className="ml-1.5 inline-flex items-center justify-center w-4 h-4 rounded-full hover:bg-gray-200 hover:bg-opacity-50 dark:hover:bg-gray-600 dark:hover:bg-opacity-50 focus:outline-none"
        >
          <svg
            className="w-3 h-3"
            fill="currentColor"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fillRule="evenodd"
              d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
              clipRule="evenodd"
            />
          </svg>
        </button>
      )}
    </div>
  );
};

export default Tag; 