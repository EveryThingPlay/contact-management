<script setup lang="ts">
import { useContactStore } from '@/store';
import { storeToRefs } from 'pinia';
import { computed, ref, watch } from 'vue';
import { refDebounced } from '@vueuse/core';
import ContactItem from './ContactItem.vue';
import SearchBar from './CInput.vue';

const { getContacts } = useContactStore();
const { contacts, isLoading } = storeToRefs(useContactStore());

const isAdding = ref(false);

const searchModel = ref('');
const searchModelDebounced = refDebounced(searchModel, 300);

const filteredContacts = computed(
  () => contacts.value.filter((el) => el.name.includes(searchModelDebounced.value)),
);

function handleGetContacts() {
  searchModel.value = '';
  getContacts();
}

watch(isLoading, () => { isAdding.value = false; });

</script>

<template>
  <div class="w-80">
    <SearchBar
      v-model="searchModel"
      class="w-full mb-4"
      placeholder="Search by name..."
    />
    <TransitionGroup
      name="fade"
      tag="div"
    >
      <template v-if="isLoading">
        <ContactItem skeleton />
      </template>

      <TransitionGroup
        v-else
        name="list"
        tag="div"
        class="flex flex-col gap-2 w-full"
      >
        <ContactItem
          v-for="contact in filteredContacts"
          :key="contact.id"
          :contact="contact"
        />

        <ContactItem
          v-if="isAdding"
          new-contact
        />
      </TransitionGroup>

      <div v-if="filteredContacts.length === 0">
        <p>No contacts found locally.</p>
        <button
          class="font-semibold"
          @click="handleGetContacts"
        >
          Try to generate some?
        </button>
      </div>
    </TransitionGroup>

    <button
      class="border-2 p-2 rounded-lg mt-4"
      @click="isAdding = !isAdding"
    >
      {{ isAdding ? 'Cancel' : 'Add new contact' }}
    </button>
  </div>
</template>

<style>
.list-enter-active,
.list-leave-active {
  transition: all 0.2s ease-out;
}
.list-enter-from,
.list-leave-to {
  opacity: 0;
  transform: translateX(45px);
}

.fade-enter-active,
.fade-leave-active {
  transition: all 0.2s ease-out;
}
.fade-enter-from,
.fade-leave-to {
  height: 0;
  opacity: 0;
}
</style>
