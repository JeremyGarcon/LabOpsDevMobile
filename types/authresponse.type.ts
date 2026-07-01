/** Réponse de POST /auth/login */
export type LoginResponse = {
  access_token: string;
  email: string;
  username: string;
};

/** Réponse de POST /auth/register */
export type RegisterResponse = {
  id: number | string;
  firstName: string;
  name: string;
  email: string;
  role: string;
  account_checked: boolean;
  createdAt: string;
};
