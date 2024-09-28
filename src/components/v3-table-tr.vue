<script setup>
import {defineEmits, defineProps} from 'vue';
import V3TableTd from "./v3-table-td.vue";

defineEmits(['click', 'db-click']);

defineProps({
  idx: {
    type: Number
  },

  row: {
    type: Object,
    required: true
  },

  cols: {
    type: Array,
    required: true
  },

  rowActions: {
    type: Array,
    default: () => []
  },

  showAutoWidthCol: {
    type: Boolean,
    default: false
  },

  lastLeftFixedColIdx: {
    type: Number,
    default: -1
  },

  activatedRows: {
    type: Array,
    default: () => []
  },

  level: {
    type: Number,
    default: 0
  }
});

const check = function () {
  console.log('check');
};
</script>

<template>
  <tr ref="tr" :class="{activated: activatedRows.indexOf(row) > -1, hidden: row['_hidden_']}"
      @click="$emit('click', row)"
      @db-click="$emit('db-click', row)">
    <template v-for="(col, c) in cols">
      <td v-if="col['type'] === 'checkbox'" class="checkbox" :style="col['style']">
        <div><input type="checkbox" @click="check"/></div>
      </td>
      <td v-if="col['type'] === 'index'" class="index" :style="col.style">
        <div v-text="idx + 1"></div>
      </td>
      <v3-table-td ref="td" :col="col" :row="row" :row-idx="idx"
                   :class="{data: true, 'last-fixed-left': lastLeftFixedColIdx === c}"></v3-table-td>
    </template>
    <td v-if="showAutoWidthCol"></td>
    <td v-if="rowActions.length > 0" class="actions">
      <div></div>
    </td>
  </tr>
  <template v-if="row['children']">
    <v3-table-tr
        v-for="child in row['children']"
        :row="child"
        :cols="cols"
        :row-actions="rowActions"
        :show-auto-width-cols="showAutoWidthCol"
        :last-left-fixed-col-idx="lastLeftFixedColIdx"
        :activated-rows="activatedRows"
        :level="level + 1"
        @click="(obj) => $emit('click', obj)"
        @db-click="(obj) => $emit('db-click', obj)"></v3-table-tr>
  </template>
</template>

<style scoped>
</style>
