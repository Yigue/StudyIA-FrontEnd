import { User } from "../../types";
import { httpClient } from "../api/httpClient";



export async function login(userLogin:User) {
  return httpClient<User>(`/auth/login`, {
    method: "POST",
    data:userLogin
  });
}
export async function register(userRegister:User) {
  return httpClient<User>(`/auth/login`, {
    method: "POST",
    data:userRegister
  });
}

export async function getMe(authToken:string) {
  return httpClient<User>(`/auth/me`, {
    method: "GET",
    headers:{
      Authorization: authToken,
    }
  });
}




