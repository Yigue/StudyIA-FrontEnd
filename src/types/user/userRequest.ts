export interface userLoginDTO {
  email: string;
  password: string;
}

export interface userRegisterDTO {
  email: string;
  password: string;
  nombre: string;
  role_id: string;
}


export interface AuthResponse {
  id: string;
  email: string;
  nombre: string;
  created_at: string;
  updated_at: string;
  role_id: string;
  isEmailVerified: boolean;
  accessToken: string;
  refreshToken: string;
 
}

export interface ResetPasswordDTO {
  password: string;
}

export interface ForgotPasswordDTO {
  email: string;
}

export interface UpdateProfileDTO {
  name?: string;
  email?: string;
}

export interface ChangePasswordDTO {
  currentPassword: string;
  newPassword: string;
}

// export interface userDTO {
//   id: string;
//   email: string;
//   full_name: string | null;
//   avatar_url: string | null;
//   settings: UserSettings;
//   created_at: Date;
//   updated_at: Date;
// }
