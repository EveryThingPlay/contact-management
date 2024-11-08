export interface Contact {
  id: number;
  name: string;
  email: string;
  phone: string
}

export type ContactForm = Omit<Contact, 'id'>
