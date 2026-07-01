/** Corps de POST /auth/login */
export type LoginRequest = {
  email: string;
  password: string;
};

/**
 * Corps de POST /auth/register
 * Contraintes serveur :
 * - firstName : string, 1–100 caractères
 * - name      : string, 1–100 caractères
 * - password  : string, 8–200 caractères
 * - email     : format email valide
 */
export type RegisterRequest = {
  firstName: string;
  name: string;
  password: string;
  email: string;
};
