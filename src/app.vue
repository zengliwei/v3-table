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
  {
    field: 'name', title: 'Name', width: 240, sort: true, expandable: true, fixed: 'left',
    filter: {type: 'text', op: 'like'}
  },
  {
    field: 'age', title: 'Age', width: 100, align: 'center', sort: true,
    filter: {type: 'text', op: 'like'}
  },
  {
    field: 'gender', title: 'Gender', width: 100, align: 'center', sort: true,
    renderer: (row, col) => genderOpts.find(opt => opt.value === row[col['field']]).label,
    filter: {type: 'select', params: {options: genderOpts}}
  },
  {
    field: 'mobile', title: 'Mobile', width: 160, sort: true,
    filter: {type: 'text', op: 'like'}
  },
  {
    field: 'email', title: 'E-mail', width: 260, sort: true,
    filter: {type: 'text', op: 'like'}
  },
  {
    type: 'actions',
    width: 100,
    actions: [
      {label: 'Edit', handle: (row) => console.log('Edit', row)},
      {label: 'Delete', handle: (row) => console.log('Delete', row)}
    ]
  }
];

const toolbarActions = [
  {label: 'Add', handle: (activatedRows) => console.log('Add', activatedRows)},
  {label: 'Delete', handle: (activatedRows) => console.log('Delete', activatedRows)}
];
</script>

<template>
  <v3-table
      :columns="columns"
      :filter-types="filterTypes"
      :toolbar-actions="toolbarActions"
      src-url="data.json"
      height="calc(100vh - 10rem)"/>
</template>
