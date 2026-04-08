import { useMutation } from '@tanstack/react-query';
import { contactApi } from '../services/contactApi';
import type { ContactFormData } from '@/types/siteSettings';

export function useSubmitContact() {
  return useMutation({
    mutationFn: (data: ContactFormData) => contactApi.submit(data),
  });
}
