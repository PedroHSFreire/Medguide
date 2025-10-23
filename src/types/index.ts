export interface Doctor {
  id?: string;
  name: string;
  email: string;
  CRM: number;
  specialty: string;
  password: string;
  cpf: string;
  created?: string;
}
export interface Pacient {
  id?: string;
  name: string;
  email: string;
  password: string;
  cpf: string;
  created?: string;
}
export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}
