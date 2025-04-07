import { useState, useCallback, ChangeEvent, FormEvent } from 'react';

export type ValidationFunction<T> = (value: T) => string | null;

export type FieldValidators<T> = {
  [K in keyof T]?: ValidationFunction<T[K]>;
};

export interface FormOptions<T> {
  initialValues: T;
  validators?: FieldValidators<T>;
  onSubmit?: (values: T) => void | Promise<void>;
}

export interface FormState<T> {
  values: T;
  errors: Partial<Record<keyof T, string | null>>;
  touched: Partial<Record<keyof T, boolean>>;
  isSubmitting: boolean;
  isValid: boolean;
}

/**
 * Hook personalizado para manejar formularios con validación
 * 
 * @param options Opciones del formulario (valores iniciales, validadores, función onSubmit)
 * @returns Objeto con métodos y estado del formulario
 */
export function useForm<T extends Record<string, unknown>>({
  initialValues,
  validators = {},
  onSubmit
}: FormOptions<T>) {
  const [formState, setFormState] = useState<FormState<T>>({
    values: initialValues,
    errors: {},
    touched: {},
    isSubmitting: false,
    isValid: true
  });
  
  // Valida un campo específico
  const validateField = useCallback(
    (name: keyof T, value: T[keyof T]): string | null => {
      const validator = validators[name];
      return validator ? validator(value) : null;
    },
    [validators]
  );
  
  // Valida todos los campos del formulario
  const validateForm = useCallback((): boolean => {
    const errors: Partial<Record<keyof T, string | null>> = {};
    let isValid = true;
    
    Object.keys(formState.values).forEach((key) => {
      const fieldName = key as keyof T;
      const error = validateField(fieldName, formState.values[fieldName]);
      
      if (error) {
        errors[fieldName] = error;
        isValid = false;
      } else {
        errors[fieldName] = null;
      }
    });
    
    setFormState((prev) => ({
      ...prev,
      errors,
      isValid
    }));
    
    return isValid;
  }, [formState.values, validateField]);
  
  // Actualiza un campo del formulario
  const handleChange = useCallback(
    (
      e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
    ) => {
      const { name, value, type } = e.target;
      const fieldName = name as keyof T;
      
      // Manejo especial para campos de tipo checkbox
      let fieldValue: unknown;
      if (type === 'checkbox' && 'checked' in e.target) {
        fieldValue = (e.target as HTMLInputElement).checked;
      } else {
        fieldValue = value;
      }
      
      setFormState((prev) => {
        // Actualizar el valor
        const newValues = {
          ...prev.values,
          [fieldName]: fieldValue
        };
        
        // Validar el campo
        const error = validateField(fieldName, fieldValue as T[keyof T]);
        
        // Marcar como tocado
        const newTouched = {
          ...prev.touched,
          [fieldName]: true
        };
        
        // Actualizar errores
        const newErrors = {
          ...prev.errors,
          [fieldName]: error
        };
        
        // Verificar si el formulario es válido
        const isFormValid = Object.values(newErrors).every(
          (err) => err === null || err === undefined
        );
        
        return {
          values: newValues,
          errors: newErrors,
          touched: newTouched,
          isSubmitting: prev.isSubmitting,
          isValid: isFormValid
        };
      });
    },
    [validateField]
  );
  
  // Establece un valor programáticamente
  const setValue = useCallback(
    (fieldName: keyof T, value: T[keyof T]) => {
      setFormState((prev) => {
        // Actualizar el valor
        const newValues = {
          ...prev.values,
          [fieldName]: value
        };
        
        // Validar el campo
        const error = validateField(fieldName, value);
        
        // Actualizar errores
        const newErrors = {
          ...prev.errors,
          [fieldName]: error
        };
        
        // Verificar si el formulario es válido
        const isFormValid = Object.values(newErrors).every(
          (err) => err === null || err === undefined
        );
        
        return {
          ...prev,
          values: newValues,
          errors: newErrors,
          isValid: isFormValid
        };
      });
    },
    [validateField]
  );
  
  // Establece múltiples valores programáticamente
  const setValues = useCallback(
    (newValues: Partial<T>) => {
      setFormState((prev) => {
        // Combinar valores anteriores con nuevos
        const updatedValues = {
          ...prev.values,
          ...newValues
        };
        
        // Validar todos los campos
        const errors: Partial<Record<keyof T, string | null>> = {};
        let isValid = true;
        
        Object.keys(updatedValues).forEach((key) => {
          const fieldName = key as keyof T;
          const error = validateField(fieldName, updatedValues[fieldName]);
          
          if (error) {
            errors[fieldName] = error;
            isValid = false;
          } else {
            errors[fieldName] = null;
          }
        });
        
        return {
          ...prev,
          values: updatedValues,
          errors,
          isValid
        };
      });
    },
    [validateField]
  );
  
  // Marca un campo como tocado
  const setTouched = useCallback(
    (fieldName: keyof T, isTouched: boolean = true) => {
      setFormState((prev) => ({
        ...prev,
        touched: {
          ...prev.touched,
          [fieldName]: isTouched
        }
      }));
    },
    []
  );
  
  // Marca todos los campos como tocados
  const touchAll = useCallback(() => {
    const touched: Partial<Record<keyof T, boolean>> = {};
    
    Object.keys(formState.values).forEach((key) => {
      const fieldName = key as keyof T;
      touched[fieldName] = true;
    });
    
    setFormState((prev) => ({
      ...prev,
      touched
    }));
  }, [formState.values]);
  
  // Resetea el formulario
  const resetForm = useCallback(() => {
    setFormState({
      values: initialValues,
      errors: {},
      touched: {},
      isSubmitting: false,
      isValid: true
    });
  }, [initialValues]);
  
  // Maneja el envío del formulario
  const handleSubmit = useCallback(
    async (e?: FormEvent) => {
      if (e) {
        e.preventDefault();
      }
      
      // Marcar todos los campos como tocados
      touchAll();
      
      // Validar el formulario
      const isValid = validateForm();
      
      if (isValid && onSubmit) {
        setFormState((prev) => ({
          ...prev,
          isSubmitting: true
        }));
        
        try {
          await onSubmit(formState.values);
        } finally {
          setFormState((prev) => ({
            ...prev,
            isSubmitting: false
          }));
        }
      }
    },
    [formState.values, onSubmit, touchAll, validateForm]
  );
  
  return {
    // Estado
    values: formState.values,
    errors: formState.errors,
    touched: formState.touched,
    isSubmitting: formState.isSubmitting,
    isValid: formState.isValid,
    
    // Métodos
    handleChange,
    handleSubmit,
    setValue,
    setValues,
    setTouched,
    touchAll,
    resetForm,
    validateForm
  };
}

export default useForm; 