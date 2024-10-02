<script setup>
import {defineProps, defineEmits, computed} from 'vue';

const emit = defineEmits('update:value');

const props = defineProps(['value']);

const value = computed({
  get: () => props.value,
  set: (value) => emit('update:value', value)
});
</script>

<template>
  <select v-model="value"></select>
</template>
