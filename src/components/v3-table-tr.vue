<script setup>
import {defineEmits, defineProps} from 'vue';
import V3TableTd from "./v3-table-td.vue";

const emit = defineEmits([
  'click', 'dblclick', 'mouseenter', 'mouseleave', 'check',
  'cell-click', 'cell-dblclick', 'cell-mouseenter', 'cell-mouseleave'
]);

const props = defineProps({
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

const check = function (status) {
  emit('check', props.row, status);
};
</script>

<template>
  <tr ref="tr" :class="{activated: activatedRows.indexOf(row) > -1, hidden: row['_hidden_']}"
      @click="$emit('click', row)"
      @dblclick="$emit('dblclick', row)">
    <template v-for="(col, c) in cols">
      <td v-if="col['type'] === 'checkbox'" class="checkbox" :style="col['style']">
        <div>
          <input type="checkbox"
                 :checked="row['_checked_']"
                 @change="(evt) => check(evt.currentTarget.checked)"/>
        </div>
      </td>
      <td v-if="col['type'] === 'index'" class="index" :style="col.style">
        <div v-text="(idx + 1) || ''"></div>
      </td>
      <v3-table-td
          ref="td" :col="col" :row="row" :row-idx="idx" :level="level"
          :class="{data: true, 'last-fixed-left': lastLeftFixedColIdx === c}"
          @click="$emit('cell-click', row, col)"
          @dblclick="$emit('cell-dblclick', row, col)"
          @mouseenter="$emit('cell-mouseenter', row, col)"
          @mouseleave="$emit('cell-mouseleave', row, col)"/>
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
        :show-auto-width-col="showAutoWidthCol"
        :last-left-fixed-col-idx="lastLeftFixedColIdx"
        :activated-rows="activatedRows"
        :level="level + 1"
        @click="(obj) => $emit('click', obj)"
        @dblclick="(obj) => $emit('dblclick', obj)"
        @mouseenter="(obj) => $emit('mouseenter', obj)"
        @mouseleave="(obj) => $emit('mouseleave', obj)"
        @check="(obj, status) => $emit('check', obj, status)"
        @cell-click="(obj, col) => $emit('cell-click', obj, col)"
        @cell-dblclick="(obj, col) => $emit('cell-dblclick', obj, col)"
        @cell-mouseenter="(obj, col) => $emit('cell-mouseenter', obj, col)"
        @cell-mouseleave="(obj, col) => $emit('cell-mouseleave', obj, col)"/>
  </template>
</template>

<style scoped>
</style>
