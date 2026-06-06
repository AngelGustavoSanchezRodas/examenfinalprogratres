export interface Message {
  Cod_Mensaje?: number;
  Cod_Sala?: number;
  Login_Emisor: string;
  Contenido: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
}
