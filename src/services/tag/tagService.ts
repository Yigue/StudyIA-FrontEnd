import { Tag } from "../../types";
import { httpClient } from "../api/httpClient";



export async function createTag(tagData:Tag) {
  return httpClient<Tag>(`/tag`, {
    method: "POST",
    data:tagData
  });
}
export async function updateTag(tagData:Tag) {
  return httpClient<Tag>(`/tag/${tagData.id}`, {
    method: "PUT",
    data:tagData
  });
}

export async function getAllTag(authToken:string) {
  return httpClient<Tag>(`/tag`, {
    method: "GET",
    headers:{
      Authorization: authToken,
    }
  });
}
export async function deleteTag(authToken:string) {
  return httpClient<Tag>(`/tag`, {
    method: "DELETE",
    headers:{
      Authorization: authToken,
    }
  });
}




