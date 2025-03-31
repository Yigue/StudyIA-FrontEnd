export interface TagCreateDTO {
  name: string;
  color?: string; // Código de color hexadecimal
}

export interface TagUpdateDTO {
  name?: string;
  color?: string;
}


