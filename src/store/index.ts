import { defineStore } from 'pinia';
import mockContacts from '@/mocks/contacts';
import { type Contact, type ContactForm } from '@/types/contacts';
import { useLocalStorage } from '@vueuse/core';

function delay(ms:number) {
  // eslint-disable-next-line no-promise-executor-return
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// eslint-disable-next-line import/prefer-default-export
export const useContactStore = defineStore('contacts', {

  state: () => ({
    contacts: useLocalStorage('contacts', [] as Contact[]),
    isLoading: false,
  }),

  actions: {
    getContacts() {
      this.isLoading = true;
      delay(2000).then(() => { this.contacts = mockContacts; this.isLoading = false; });
    },

    createContact(contact: ContactForm) {
      this.isLoading = true;
      delay(400).then(() => {
        this.contacts.push({ id: Date.now(), ...contact });
        this.isLoading = false;
      });
    },

    removeContact(id: number) {
      this.isLoading = true;
      delay(400).then(() => {
        this.contacts = this.contacts.filter((el) => el.id !== id);
        this.isLoading = false;
      });
    },

    updateContact(contact: Contact) {
      this.isLoading = true;
      delay(400).then(() => {
        const index = this.contacts.findIndex((el) => el.id === contact.id);
        this.contacts[index] = contact;
        this.isLoading = false;
      });
    },
  },
});
