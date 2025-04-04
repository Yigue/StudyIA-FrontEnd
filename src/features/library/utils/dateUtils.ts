import { format, isValid, parseISO } from "date-fns";
import { es } from "date-fns/locale";

/**
 * Formatea una fecha ISO al formato especificado con seguridad
 * 
 * @param dateString Fecha en formato ISO
 * @param formatString Formato date-fns a aplicar
 * @param fallback Texto a mostrar en caso de error
 * @returns Fecha formateada o fallback en caso de error
 */
export const formatDate = (
  dateString: string, 
  formatString: string = "d MMM yyyy", 
  fallback: string = "Fecha desconocida"
): string => {
  if (!dateString) return fallback;
  
  try {
    const date = parseISO(dateString);
    if (!isValid(date)) {
      return fallback;
    }
    return format(date, formatString, { locale: es });
  } catch (error) {
    console.error("Error al formatear fecha:", error);
    return fallback;
  }
};

/**
 * Utilidades para el formato y validación de fechas
 */

/**
 * Formatea una fecha para mostrarla en formato corto (ej: 01 ene 2023)
 * @param dateString - Cadena de texto con la fecha en formato ISO o timestamp
 * @returns Fecha formateada en formato corto
 */
export const formatShortDate = (dateString?: string | number | Date): string => {
  if (!dateString) return 'Fecha desconocida';
  
  try {
    const date = new Date(dateString);
    
    // Verificar que la fecha sea válida
    if (isNaN(date.getTime())) {
      return 'Fecha desconocida';
    }
    
    // Formato: 01 ene 2023
    const day = date.getDate().toString().padStart(2, '0');
    const month = getMonthShortName(date.getMonth());
    const year = date.getFullYear();
    
    return `${day} ${month} ${year}`;
  } catch {
    return 'Fecha desconocida';
  }
};

/**
 * Formatea una fecha para mostrarla en formato largo (ej: 01 de enero de 2023)
 * @param dateString - Cadena de texto con la fecha en formato ISO o timestamp
 * @returns Fecha formateada en formato largo
 */
export const formatLongDate = (dateString?: string | number | Date): string => {
  if (!dateString) return 'Fecha desconocida';
  
  try {
    const date = new Date(dateString);
    
    // Verificar que la fecha sea válida
    if (isNaN(date.getTime())) {
      return 'Fecha desconocida';
    }
    
    // Formato: 01 de enero de 2023
    const day = date.getDate().toString().padStart(2, '0');
    const month = getMonthName(date.getMonth());
    const year = date.getFullYear();
    
    return `${day} de ${month} de ${year}`;
  } catch {
    return 'Fecha desconocida';
  }
};

/**
 * Formatea una fecha para mostrarla con hora (ej: 01 ene 2023, 14:30)
 * @param dateString - Cadena de texto con la fecha en formato ISO o timestamp
 * @returns Fecha formateada con hora
 */
export const formatDateWithTime = (dateString?: string | number | Date): string => {
  if (!dateString) return 'Fecha desconocida';
  
  try {
    const date = new Date(dateString);
    
    // Verificar que la fecha sea válida
    if (isNaN(date.getTime())) {
      return 'Fecha desconocida';
    }
    
    // Formato: 01 ene 2023, 14:30
    const day = date.getDate().toString().padStart(2, '0');
    const month = getMonthShortName(date.getMonth());
    const year = date.getFullYear();
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    
    return `${day} ${month} ${year}, ${hours}:${minutes}`;
  } catch {
    return 'Fecha desconocida';
  }
};

/**
 * Obtiene el nombre corto del mes en español
 * @param monthIndex - Índice del mes (0-11)
 * @returns Nombre corto del mes en español
 */
const getMonthShortName = (monthIndex: number): string => {
  const months = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'];
  return months[monthIndex];
};

/**
 * Obtiene el nombre completo del mes en español
 * @param monthIndex - Índice del mes (0-11)
 * @returns Nombre completo del mes en español
 */
const getMonthName = (monthIndex: number): string => {
  const months = [
    'enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio',
    'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'
  ];
  return months[monthIndex];
}; 