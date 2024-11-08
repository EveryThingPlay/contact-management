<script setup lang="ts">
import { PropType, ref } from 'vue';
import { useContactStore } from '@/store';
import { Contact } from '@/types/contacts';
import { useVuelidate } from '@vuelidate/core';
import {
  minLength, email, required,
} from '@vuelidate/validators';
import { phone } from '@/utils/validators';

import CInput from '@/components/CInput.vue';

const props = defineProps({
  contact: {
    type: Object as PropType<Contact>,
    default: null,
  },
  skeleton: {
    type: Boolean,
    default: false,
  },
  newContact: {
    type: Boolean,
    default: false,
  },
});

const { removeContact, updateContact, createContact } = useContactStore();

const isEditing = ref(false);
const isRemoving = ref(false);

const editingModel = ref({
  name: '',
  email: '',
  phone: '',
});

function toggleEditing() {
  if (isEditing.value === false) {
    // eslint-disable-next-line no-shadow
    const { name, email, phone } = props.contact;
    editingModel.value = { name, email, phone };
    isEditing.value = true;
  } else {
    editingModel.value = {
      name: '',
      email: '',
      phone: '',
    };
    isEditing.value = false;
  }
}

function handleEdit() {
  if (props.newContact) {
    createContact(editingModel.value);
  } else {
    updateContact({ id: props.contact.id, ...editingModel.value });
  }
}

function toggleRemove() {
  isRemoving.value = !isRemoving.value;
}

function handleRemove(id: number) {
  console.log('rem');
  removeContact(id);
  toggleRemove();
}

const rules = {
  name: {
    required,
    minLength: minLength(3),
  },
  email: {
    required,
    email,
  },
  phone: {
    required,
    phone,
  },
};
const v = useVuelidate(rules, editingModel);
</script>

<template>
  <div
    v-if="skeleton"
    class="h-32 flex flex-col items-start p-2 border-2 gap-1 rounded-lg"
  >
    <div class="h-7 w-48 skeleton" />
    <p class="h-5 w-40 skeleton" />
    <p class="h-5 w-40 skeleton" />
  </div>

  <div
    v-else
    class="flex flex-row justify-between p-2 border-2 rounded-lg gap-4"
  >
    <template v-if="isEditing || newContact">
      <div class="flex flex-col items-start gap-2">
        <CInput
          v-model="editingModel.name"
          placeholder="Name"
          class="text-xl font-medium w-full"
          :error="v.name.$invalid"
          :message="v.name.$silentErrors.map(err=>err.$message).toString()"
        />
        <CInput
          v-model="editingModel.phone"
          placeholder="Phone"
          class="text-sm text-neutral-600"
          :error="v.phone.$invalid"
          :message="v.phone.$silentErrors.map(err=>err.$message).toString()"
        />
        <CInput
          v-model="editingModel.email"
          placeholder="Email"
          class="text-sm text-neutral-600"
          :error="v.email.$invalid"
          :message="v.email.$silentErrors.map(err=>err.$message).toString()"
        />
      </div>
      <div class="flex flex-col justify-center items-stretch gap-2">
        <button
          class="text-green-700"
          :disabled="v.$silentErrors.length>0"
          @click="handleEdit"
        >
          Save
        </button>
        <button
          v-if="!newContact"
          class="text-red-700"
          @click="toggleEditing"
        >
          Cancel
        </button>
      </div>
    </template>

    <template v-else-if="contact && isRemoving">
      <div class="flex flex-col items-center w-full gap-1">
        <p class="text-sm">
          Are you sure you want to remove this contact?
        </p>
        <div class="flex flex-row mt-2 gap-4">
          <button
            class="text-red-700 text-sm"
            @click="handleRemove(contact.id)"
          >
            Yes
          </button>
          <button @click="toggleRemove">
            No
          </button>
        </div>
      </div>
    </template>

    <template v-else-if="contact">
      <div class="flex flex-col items-start gap-2">
        <h1 class="text-xl font-medium">
          {{ contact.name }}
        </h1>
        <p class="text-sm text-neutral-600">
          {{ contact.phone }}
        </p>
        <p class="text-sm text-neutral-600">
          {{ contact.email }}
        </p>
      </div>
      <div class="flex flex-col justify-center items-stretch gap-2">
        <button @click="toggleEditing">
          Edit
        </button>
        <button
          class="text-red-700"
          @click="toggleRemove"
        >
          Remove
        </button>
      </div>
    </template>
  </div>
</template>

<style scoped lang="scss">
p, h1 {
  @apply px-1 py-1
}

button {
  @apply text-sm py-2 px-2 outline outline-1 rounded-lg;

  &:disabled {
    @apply opacity-50 cursor-not-allowed;
  }
}

CInput {
  @apply outline outline-1 rounded-lg px-1 py-1;
}
</style>
