import { useState } from 'react';
import { UserFormData, VerificationState } from '../types/type';

export const useAuthForm = (initialData: UserFormData) => {
  const [form, setForm] = useState<UserFormData>(initialData);
  
  const updateField = (field: keyof UserFormData) => (value: string) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  return { form, updateField };
};