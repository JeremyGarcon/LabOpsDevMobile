/** Utilisateur LabOps (register, profile) */
export type User = {
  id: string;
  email: string;
  firstName: string;
  name: string;
  role?: string;
  account_checked?: boolean;
  createdAt?: string;
};
