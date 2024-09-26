<script setup>
import v3Table from './components/v3-table.vue'

let genderOpts = [
  {value: 'male', label: 'Male'},
  {value: 'female', label: 'Female'}
];

let columns = [
  {field: 'name', title: 'Name', width: 100, filter: {type: 'text'}},
  {field: 'age', title: 'Age', width: 80, filter: {type: 'text'}},
  {field: 'gender', title: 'Gender', width: 80, filter: {type: 'select', opts: genderOpts}},
  {field: 'mobile', title: 'Mobile', width: 160, filter: {type: 'text'}},
  {field: 'email', title: 'E-mail', width: 180, filter: {type: 'text'}}
];

let filterTypes = {
  select: {
    props: {}
  }
};
</script>

<template>
  <v3-table :columns="columns"
            :filter-types="filterTypes"
            :selectable="true"
            :show-index-number="true"/>
</template>

<style scoped>
</style>
