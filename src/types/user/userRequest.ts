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
// export interface userDTO {
//   id: string;
//   email: string;
//   full_name: string | null;
//   avatar_url: string | null;
//   settings: UserSettings;
//   created_at: Date;
//   updated_at: Date;
// }