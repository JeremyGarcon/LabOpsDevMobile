import { LoginRequest, RegisterRequest } from '../types/authrequest.type';
import { User } from '../types/user.type';
import { fetchProfile, postLogin, postRegister } from '../services/api';
import { getToken, removeToken, saveToken } from '../services/authStorage';

export interface IAuthRepository {
  login(credentials: LoginRequest): Promise<User>;
  register(payload: RegisterRequest): Promise<User>;
  logout(): Promise<void>;
  restoreSession(): Promise<User | null>;
  getProfile(): Promise<User>;
}

export class AuthRepository implements IAuthRepository {
  async login(credentials: LoginRequest): Promise<User> {
    const { access_token } = await postLogin(credentials);
    if (!access_token) {
      throw new Error('Token manquant dans la réponse');
    }
    await saveToken(access_token);
    return fetchProfile();
  }

  async register(payload: RegisterRequest): Promise<User> {
    await postRegister(payload);
    return this.login({ email: payload.email, password: payload.password });
  }

  async logout(): Promise<void> {
    await removeToken();
  }

  async restoreSession(): Promise<User | null> {
    const token = await getToken();
    if (!token) return null;

    try {
      return await fetchProfile();
    } catch {
      await removeToken();
      return null;
    }
  }

  async getProfile(): Promise<User> {
    return fetchProfile();
  }
}

export const authRepository = new AuthRepository();
