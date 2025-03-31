import React from 'react';
import { cn } from '../../lib/utils';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * Variante de la tarjeta
   */
  variant?: 'default' | 'outline' | 'elevated' | 'filled';
  /**
   * Indica si la tarjeta debe ser interactiva (con efecto hover)
   */
  interactive?: boolean;
  /**
   * Indica si la tarjeta debe tener bordes redondeados
   */
  rounded?: 'none' | 'sm' | 'md' | 'lg' | 'full';
  /**
   * Clase adicional para la tarjeta
   */
  className?: string;
  /**
   * Contenido de la tarjeta
   */
  children: React.ReactNode;
  /**
   * Indica si la tarjeta debe tener relleno
   */
  noPadding?: boolean;
}

export const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ 
    className, 
    variant = 'default', 
    interactive = false, 
    rounded = 'md',
    noPadding = false,
    children, 
    ...props 
  }, ref) => {
    // Mapeo de variantes
    const variantStyles = {
      default: 'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700',
      outline: 'border border-gray-200 dark:border-gray-700 bg-transparent',
      elevated: 'bg-white dark:bg-gray-800 shadow-lg border-none',
      filled: 'bg-gray-100 dark:bg-gray-700 border-none',
    };
    
    // Mapeo de bordes redondeados
    const roundedStyles = {
      none: 'rounded-none',
      sm: 'rounded-sm',
      md: 'rounded-md',
      lg: 'rounded-lg',
      full: 'rounded-xl',
    };
    
    return (
      <div
        ref={ref}
        className={cn(
          variantStyles[variant],
          roundedStyles[rounded],
          !noPadding && 'p-4',
          interactive && 'transition-all duration-200 hover:shadow-md',
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Card.displayName = 'Card';

export interface CardHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * Clase adicional para el encabezado
   */
  className?: string;
  /**
   * Contenido del encabezado
   */
  children: React.ReactNode;
}

export const CardHeader = React.forwardRef<HTMLDivElement, CardHeaderProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn('mb-4', className)}
        {...props}
      >
        {children}
      </div>
    );
  }
);

CardHeader.displayName = 'CardHeader';

export interface CardTitleProps extends React.HTMLAttributes<HTMLHeadingElement> {
  /**
   * Clase adicional para el título
   */
  className?: string;
  /**
   * Contenido del título
   */
  children: React.ReactNode;
  /**
   * Nivel de encabezado
   */
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
}

export const CardTitle = React.forwardRef<HTMLHeadingElement, CardTitleProps>(
  ({ className, as = 'h3', children, ...props }, ref) => {
    const Component = as;
    
    return (
      <Component
        ref={ref}
        className={cn(
          'text-lg font-semibold leading-none tracking-tight text-gray-900 dark:text-gray-50',
          className
        )}
        {...props}
      >
        {children}
      </Component>
    );
  }
);

CardTitle.displayName = 'CardTitle';

export interface CardDescriptionProps extends React.HTMLAttributes<HTMLParagraphElement> {
  /**
   * Clase adicional para la descripción
   */
  className?: string;
  /**
   * Contenido de la descripción
   */
  children: React.ReactNode;
}

export const CardDescription = React.forwardRef<HTMLParagraphElement, CardDescriptionProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <p
        ref={ref}
        className={cn('text-sm text-gray-500 dark:text-gray-400', className)}
        {...props}
      >
        {children}
      </p>
    );
  }
);

CardDescription.displayName = 'CardDescription';

export interface CardContentProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * Clase adicional para el contenido
   */
  className?: string;
  /**
   * Contenido principal
   */
  children: React.ReactNode;
}

export const CardContent = React.forwardRef<HTMLDivElement, CardContentProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn('', className)}
        {...props}
      >
        {children}
      </div>
    );
  }
);

CardContent.displayName = 'CardContent';

export interface CardFooterProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * Clase adicional para el pie
   */
  className?: string;
  /**
   * Contenido del pie
   */
  children: React.ReactNode;
}

export const CardFooter = React.forwardRef<HTMLDivElement, CardFooterProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn('mt-4 flex items-center pt-0', className)}
        {...props}
      >
        {children}
      </div>
    );
  }
);

CardFooter.displayName = 'CardFooter'; 