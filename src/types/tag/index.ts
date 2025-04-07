export interface Tag {
  id: string;
  name: string;
  color: string;
  count?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface TagCreateDTO {
  name: string;
  color?: string;
}

export interface TagUpdateDTO {
  name?: string;
  color?: string;
}