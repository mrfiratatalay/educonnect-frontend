import axios from "axios";
import type { User } from "@/types";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:5160";

const authApi = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
});

export interface LoginInput {
  email: string;
  password: string;
}

export interface RegisterInput {
  fullName: string;
  email: string;
  password: string;
  universityId: string;
  department: string;
  year: number;
}

export interface EmailVerificationChallenge {
  email: string;
  verificationExpiresAtUtc: string;
  canResendAtUtc: string;
  message: string;
}

export interface VerifyEmailInput {
  email: string;
  code: string;
}

export interface ForgotPasswordInput {
  email: string;
}

export interface UniversityOption {
  id: string;
  name: string;
  city: string;
  domain: string;
}

export interface AuthSession {
  accessToken: string;
  expiresAtUtc: string;
  user: User;
}

export async function login(request: LoginInput) {
  const response = await authApi.post<AuthSession>("/api/auth/login", request);
  return response.data;
}

export async function register(request: RegisterInput) {
  const response = await authApi.post<EmailVerificationChallenge>("/api/auth/register", request);
  return response.data;
}

export async function verifyEmail(request: VerifyEmailInput) {
  const response = await authApi.post<{ message: string }>("/api/auth/verify-email", request);
  return response.data;
}

export async function resendEmailVerification(email: string) {
  const response = await authApi.post<EmailVerificationChallenge>("/api/auth/resend-verification", { email });
  return response.data;
}

export async function refreshSession() {
  const response = await authApi.post<AuthSession>("/api/auth/refresh");
  return response.data;
}

export async function logout() {
  await authApi.post("/api/auth/logout");
}

export async function forgotPassword(request: ForgotPasswordInput) {
  await authApi.post("/api/auth/forgot-password", request);
}

export async function getUniversities() {
  const response = await authApi.get<UniversityOption[]>("/api/universities");
  return response.data;
}

export function getApiErrorMessage(error: unknown) {
  if (axios.isAxiosError(error)) {
    const detail = error.response?.data?.detail;
    const message = error.response?.data?.message;

    if (typeof detail === "string" && detail.length > 0) {
      return detail;
    }

    if (typeof message === "string" && message.length > 0) {
      return message;
    }
  }

  if (error instanceof Error && error.message.length > 0) {
    return error.message;
  }

  return "Beklenmeyen bir hata olustu.";
}
