<script setup>
import {defineProps, defineEmits, computed} from 'vue';

const emit = defineEmits(['update:value', 'execute']);

const props = defineProps({
  value: {
    type: String
  }
});

const value = computed({
  get: () => props.value,
  set: (value) => emit('update:value', value)
});

const execute = function (evt) {
  if (evt.code === 'Enter') {
    emit('execute');
  }
};
</script>

<template>
  <input type="text" v-model="value" @keyup="execute"/>
</template>

<style>
</style>
