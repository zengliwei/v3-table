<script setup>
import v3Table from './components/v3-table.vue'

let genderOpts = [
  {value: 'male', label: 'Male'},
  {value: 'female', label: 'Female'}
];

let columns = [
  {type: 'checkbox'},
  {type: 'index'},
  {field: 'name', title: 'Name', width: 100, fixed: 'left', filter: {type: 'text'}},
  {field: 'age', title: 'Age', width: 80, align: 'right', filter: {type: 'text'}},
  {field: 'gender', title: 'Gender', width: 80, filter: {type: 'select', opts: genderOpts}},
  {field: 'mobile', title: 'Mobile', width: 160, filter: {type: 'text'}},
  {field: 'email', title: 'E-mail', width: 180, filter: {type: 'text'}}
];

let filterTypes = {
  select: {
    props: {}
  }
};

let data = [
  {name: 'John Doe', age: 27, gender: 'male', mobile: '123-456-7890', email: 'john.doe@test.com'},
  {name: 'Jack Lee', age: 25, gender: 'male', mobile: '423-456-7890', email: 'jack.lee@test.com'}
];
</script>

<template>
  <v3-table :columns="columns"
            :filter-types="filterTypes"
            :selectable="true"
            :show-index-number="true"/>
</template>

<style scoped>
</style>
