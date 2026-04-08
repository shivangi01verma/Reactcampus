import api from '@/lib/axios';
import type { ContactFormData } from '@/types/siteSettings';

export const contactApi = {
  submit: async (data: ContactFormData) => {
    const res = await api.post('/public/contact', data);
    return res.data;
  },
};
