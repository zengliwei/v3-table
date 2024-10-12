<script setup>
import {defineProps, defineEmits, computed} from 'vue';

const emit = defineEmits(['update:value', 'execute']);

const props = defineProps({
  value: {
    type: String
  },

  options: {
    type: Array
  }
});

const value = computed({
  get: () => props.value,
  set: (value) => emit('update:value', value)
});

const execute = function () {
  emit('execute');
};
</script>

<template>
  <select v-model="value" @change="execute">
    <option value=""></option>
    <option v-for="option in options" :value="option['value']" v-text="option['label']"></option>
  </select>
</template>
