import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { getApiErrorMessage } from '../utils/apiError';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function validateRegister(
  firstName: string,
  name: string,
  email: string,
  password: string,
  confirmPassword: string,
): string | null {
  if (!firstName.trim() || !name.trim() || !email.trim() || !password) {
    return 'Tous les champs sont requis';
  }
  if (firstName.trim().length > 100 || name.trim().length > 100) {
    return 'Prénom et nom : 100 caractères maximum';
  }
  if (!EMAIL_REGEX.test(email.trim())) {
    return 'Format email invalide';
  }
  if (password.length < 8 || password.length > 200) {
    return 'Mot de passe : entre 8 et 200 caractères';
  }
  if (password !== confirmPassword) {
    return 'Les mots de passe ne correspondent pas';
  }
  return null;
}

export function useRegisterViewModel() {
  const { register } = useAuth();
  const [firstName, setFirstName] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async () => {
    setError(null);

    const validationError = validateRegister(
      firstName,
      name,
      email,
      password,
      confirmPassword,
    );
    if (validationError) {
      setError(validationError);
      return;
    }

    setIsSubmitting(true);
    try {
      await register({
        firstName: firstName.trim(),
        name: name.trim(),
        email: email.trim(),
        password,
      });
    } catch (err) {
      setError(getApiErrorMessage(err));
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    firstName,
    setFirstName,
    name,
    setName,
    email,
    setEmail,
    password,
    setPassword,
    confirmPassword,
    setConfirmPassword,
    isSubmitting,
    error,
    handleSubmit,
  };
}
