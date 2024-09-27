<script setup>
import v3Table from './components/v3-table.vue'

let genderOpts = [
  {value: 'male', label: 'Male'},
  {value: 'female', label: 'Female'}
];

let filterTypes = {
  select: {
    props: {}
  }
};

let columns = [
  {type: 'checkbox'},
  {type: 'index'},
  {field: 'name', title: 'Name', width: 100, sort: true, fixed: 'left', filter: {type: 'text'}},
  {field: 'age', title: 'Age', width: 100, align: 'right', sort: true, filter: {type: 'text'}},
  {field: 'gender', title: 'Gender', width: 100, sort: true, filter: {type: 'select', opts: genderOpts}},
  {field: 'mobile', title: 'Mobile', width: 160, sort: true, filter: {type: 'text'}},
  {field: 'email', title: 'E-mail', width: 180, sort: true, filter: {type: 'text'}}
];

let data = [
  {name: 'John Doe', age: 27, gender: 'male', mobile: '123-456-7890', email: 'john.doe@test.com'},
  {name: 'Jack Lee', age: 25, gender: 'male', mobile: '423-456-7890', email: 'jack.lee@test.com'}
];

const rowClick = (row) => {
  console.log('rowClick', row);
};

const rowDbClick = (row) => {
  console.log('rowDbClick', row);
};
</script>

<template>
  <v3-table :columns="columns"
            :filter-types="filterTypes"
            :data="data"
            @row-click="rowClick"
            @row-db-click="rowDbClick"/>
</template>

<style scoped>
</style>
