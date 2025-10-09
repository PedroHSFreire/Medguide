export interface Doctor {
  id?: string;
  name: string;
  email: string;
  created?: string;
  CRM: number;
}
export interface Pacient {
  id?: string;
  name: string;
  email: string;
  created?: string;
}
export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}
