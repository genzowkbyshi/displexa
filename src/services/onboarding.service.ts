import { apiClient } from '@/lib/api-client';

export interface OnboardingRegisterRequest {
  firstName?: string;
  lastName?: string;
  email?: string;
  password?: string;
}

export interface OnboardingVerifyRequest {
  challengeId: string;
  verificationCode?: string;
}

export interface OnboardingCompanyRequest {
  name?: string;
  slug?: string;
  phone?: string;
}

export interface OnboardingPackageRequest {
  packageId?: string;
  billingCycle?: string;
}

export async function onboardingSession(): Promise<any> {
  const response = await apiClient.post<any>('/onboarding/session', {});
  return response;
}

export async function onboardingRegister(payload: OnboardingRegisterRequest): Promise<any> {
  const response = await apiClient.post<any>('/onboarding/register', payload);
  return response;
}

export async function onboardingVerify(payload: OnboardingVerifyRequest): Promise<any> {
  const response = await apiClient.post<any>('/onboarding/verify', payload);
  return response;
}

export async function onboardingCompany(payload: OnboardingCompanyRequest): Promise<any> {
  const response = await apiClient.post<any>('/onboarding/company', payload);
  return response;
}

export async function getOnboardingPackages(): Promise<any> {
  const response = await apiClient.get<any>('/onboarding/packages');
  return response;
}

export async function onboardingPackage(payload: OnboardingPackageRequest): Promise<any> {
  const response = await apiClient.post<any>('/onboarding/package', payload);
  return response;
}
