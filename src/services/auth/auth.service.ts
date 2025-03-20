import { User } from "../../types";
import { userRegisterDTO } from "../../types/user/userRequest";
import { httpClient } from "../api/httpClient";

interface LoginRequest {
  email: string;
  password: string;
}

interface AuthResponse {
  user: User;
  token: string;
}

export async function login(userLogin: LoginRequest) {
  return await httpClient<AuthResponse, LoginRequest>(`/auth/login`, {
    method: "POST",
    data: userLogin
  });
}

export async function register(userRegister: userRegisterDTO) {
  return await httpClient<AuthResponse, userRegisterDTO>(`/auth/register`, {
    method: "POST",
    data: userRegister
  });
}

export async function getMe(authToken: string) {
  return await httpClient<User>(`/auth/me`, {
    method: "GET",
    headers: {
      Authorization: authToken,
    }
  });
}




