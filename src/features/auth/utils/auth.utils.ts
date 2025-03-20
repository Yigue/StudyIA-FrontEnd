export const validatePassword = (password: string): string | null => {
  if (password.length < 6) {
    return 'La contraseña debe tener al menos 6 caracteres';
  }
  return null;
};

export const getErrorMessage = (error: { message: string }): string => {
  if (error.message.includes('Failed to fetch')) {
    return 'Error de conexión. Por favor, verifica tu conexión a internet.';
  } else if (error.message.includes('Invalid login credentials')) {
    return 'Correo electrónico o contraseña incorrectos';
  } else if (error.message.includes('Email not confirmed')) {
    return 'Por favor, confirma tu correo electrónico';
  } else if (error.message.includes('User already registered')) {
    return 'Este correo electrónico ya está registrado';
  } else if (error.message.includes('Invalid email')) {
    return 'Por favor, ingresa un correo electrónico válido';
  }
  return 'Ha ocurrido un error';
};
