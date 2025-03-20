export interface AuthFormData {
  email: string;
  password: string;
}

export interface AuthError {
  type: 'error';
  message: string;
}

export interface ConnectionError {
  message: string;
}
