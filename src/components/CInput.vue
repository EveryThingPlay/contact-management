<script setup lang="ts">
import { defineModel, ModelRef, PropType } from 'vue';

defineProps({
  placeholder: {
    type: String,
    default: null,
  },
  type: {
    type: String as PropType<'string'|'number'|'email'>,
    default: 'string',
  },
  error: {
    type: Boolean,
    default: false,
  },
  message: {
    type: String,
    default: null,
  },
});

const model = defineModel() as ModelRef<string>;

</script>

<template>
  <div>
    <!-- eslint-disable-next-line vuejs-accessibility/form-control-has-label -->
    <input
      v-model="model"
      :type="type"
      :placeholder="placeholder"
      :class="error? 'error': ''"
    >
    <div
      v-if="message"
      class="text-xs text-red-700 text-left"
    >
      {{ message }}
    </div>
  </div>
</template>

<style scoped lang="scss">
input {

  @apply
    px-1 py-1
    w-full
    outline outline-2 outline-neutral-200
    focus-within:outline-2
    focus-within:outline-neutral-600
    rounded-lg;

  &.error {
    @apply outline-red-600;
  }

  /* Chrome, Safari, Edge, Opera */
  &::-webkit-outer-spin-button,
  &::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }
  /* Firefox */
  &[type=number] {
    -moz-appearance: textfield;
    appearance: textfield;
  }
}
</style>
