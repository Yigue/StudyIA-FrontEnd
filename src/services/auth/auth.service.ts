import { User } from '../../types';
import { userLoginDTO, userRegisterDTO } from '../../types/user/userRequest';
import { httpClient } from '../api/httpClient';

// La API devuelve token como string directo, no como un objeto
export async function login(userLogin: userLoginDTO) {
  return await httpClient<string, userLoginDTO>('/auth/login', {
    method: 'POST',
    data: userLogin
  });
}

export async function register(userRegister: userRegisterDTO) {
  return await httpClient<string, userRegisterDTO>('/auth/register', {
    method: 'POST',
    data: userRegister
  });
}

// La función getMe devuelve un objeto de usuario directamente
export async function getMe() {
  return await httpClient<User>('/auth/me', {
    method: 'GET'
  });
}




