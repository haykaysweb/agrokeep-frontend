import apiClient from "./apiClient";
import { type contactFormSchemaType } from "@/lib/SchemaTypes";

export const contactUsApi = async (payload: contactFormSchemaType) => {
  return apiClient.post("/contact-us", payload);
};
