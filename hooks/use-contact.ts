import { useMutation, UseMutationResult } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";

interface ContactFormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

interface ContactResponse {
  success: boolean;
  message: string;
}

const submitContactForm = async (
  formData: ContactFormData
): Promise<ContactResponse> => {
  const { data } = await axios.post<ContactResponse>("/api/contact", formData);
  return data;
};

export const useContact = (): UseMutationResult<
  ContactResponse,
  AxiosError,
  ContactFormData,
  unknown
> => {
  return useMutation({
    mutationFn: submitContactForm,
    mutationKey: ["contact-form"],
    retry: 1,
    onError: (error) => {
      // Log errors to your error monitoring service
      console.error("Contact form submission failed:", error);
    },
  });
};
