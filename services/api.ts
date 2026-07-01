import axios from 'axios';
import { SearchResult, Product } from '../types/searchresult.type';
import { ProductResponse } from '../types/productreponse.type';
import { LoginRequest, RegisterRequest } from '../types/authrequest.type';
import { LoginResponse, RegisterResponse } from '../types/authresponse.type';
import { User } from '../types/user.type';
import { getToken, removeToken } from './authStorage';

const offApi = axios.create({
  baseURL: 'https://world.openfoodfacts.org',
  timeout: 10000,
});

const offV2Api = axios.create({
  baseURL: 'https://world.openfoodfacts.org/api/v2/',
  timeout: 10000,
});

export const labOpsApi = axios.create({
  baseURL: 'https://api.labops.fr',
  timeout: 10000,
});

let onUnauthorized: (() => void) | null = null;

export function setOnUnauthorized(callback: () => void): void {
  onUnauthorized = callback;
}

labOpsApi.interceptors.request.use(async (config) => {
  const token = await getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

labOpsApi.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      await removeToken();
      onUnauthorized?.();
    }
    return Promise.reject(error);
  },
);

export function normalizeUser(
  raw: Partial<User> & { id?: string | number; username?: string },
): User {
  return {
    id: String(raw.id ?? ''),
    email: raw.email ?? '',
    firstName: raw.firstName ?? '',
    name: raw.name ?? raw.username ?? '',
    role: raw.role,
    account_checked: raw.account_checked,
    createdAt: raw.createdAt,
  };
}

export async function postLogin(credentials: LoginRequest): Promise<LoginResponse> {
  const { data } = await labOpsApi.post<LoginResponse>('/auth/login', credentials);
  return data;
}

export async function postRegister(payload: RegisterRequest): Promise<RegisterResponse> {
  const { data } = await labOpsApi.post<RegisterResponse>('/auth/register', payload);
  return data;
}

export async function fetchProfile(): Promise<User> {
  const { data } = await labOpsApi.get<
    Partial<User> & { id?: string | number; username?: string }
  >('/auth/profile');
  return normalizeUser(data);
}

export async function searchProducts(term: string): Promise<SearchResult> {
  const { data } = await offApi.get<SearchResult>('/cgi/search.pl', {
    params: {
      action: 'process',
      json: true,
      page_size: 20,
      fields: 'code,product_name,brands,nutriscore_grade,image_url',
      ...(term ? { search_terms: term } : {}),
    },
  });
  return data;
}

export async function fetchProduct(code: string): Promise<Product> {
  const { data } = await offV2Api.get<ProductResponse>(`product/${code}`);
  return data.product;
}
