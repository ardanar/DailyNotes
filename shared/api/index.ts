// Shared API katmanının tüm export'ları
// Bu dosya sayesinde diğer yerlerde şöyle import edebiliriz:
// import { apiClient, ApiError } from '@/shared/api';

export { default as axiosInstance } from './axiosInstance';
export { apiClient } from './apiClient';
export type { ApiResponse, ApiError, PaginatedResponse, BackendErrorResponse, ValidationErrorDetail } from './types';

