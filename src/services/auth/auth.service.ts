import { User } from '../../types';
import { userLoginDTO, userRegisterDTO } from '../../types/user/userRequest';
import { httpClient } from '../api/httpClient';

interface AuthResponse {
  user: User;
  token: string;
}

export async function login(userLogin: userLoginDTO) {
  return await httpClient<AuthResponse, userLoginDTO>('/auth/login', {
    method: 'POST',
    data: userLogin
  });
}

export async function register(userRegister: userRegisterDTO) {
  return await httpClient<AuthResponse, userRegisterDTO>('/auth/register', {
    method: 'POST',
    data: userRegister
  });
}

export async function getMe(authToken: string) {
  return await httpClient<User>('/auth/me', {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${authToken}`
    }
  });
}




