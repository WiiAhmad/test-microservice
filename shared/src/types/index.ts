export type ApiResponse<T = any> = {
  message: string;
  success: boolean;
  data?: T;
}
