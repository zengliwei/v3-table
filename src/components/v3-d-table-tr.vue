<script setup>
import {defineEmits, defineProps} from 'vue';
import V3DTableTd from './v3-d-table-td.vue';
import V3DTableActions from './v3-d-table-actions.vue';

const emit = defineEmits([
  'check', 'click', 'dblclick', 'mouseenter', 'mouseleave',
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

  showAutoWidthCol: {
    type: Boolean,
    default: false
  },

  emptyValue: {
    type: String,
    default: '-'
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

const rebuildActions = function (actions, row) {
  return actions.map((action) => {
    return {
      label: action['label'],
      canShow: action['canShow'],
      handle: action['handle'],
      params: [row]
    };
  });
};
</script>

<template>
  <tr ref="tr" :class="{activated: row['_activated_'], hidden: row['_hidden_']}"
      @click="$emit('click', row)"
      @dblclick="$emit('dblclick', row)">
    <template v-for="(col, c) in cols">
      <td v-if="col['type'] === 'checkbox'" class="checkbox" :style="col['style']">
        <div>
          <input type="checkbox" :checked="row['_activated_']"
                 @click.stop
                 @change="(evt) => check(evt.currentTarget.checked)"/>
        </div>
      </td>
      <td v-if="col['type'] === 'index'" class="index" :style="col.style">
        <div v-text="(idx + 1) || ''"></div>
      </td>
      <td v-if="col['type'] === 'actions'" class="actions" :style="col.style">
        <div>
          <v3-d-table-actions :actions="rebuildActions(col['actions'], row)"/>
        </div>
      </td>
      <v3-d-table-td
          ref="td"
          :col="col"
          :row="row"
          :row-idx="idx"
          :level="level"
          :empty-value="emptyValue"
          :class="{data: true, 'last-fixed-left': lastLeftFixedColIdx === c}"
          @click="$emit('cell-click', row, col)"
          @dblclick="$emit('cell-dblclick', row, col)"
          @mouseenter="$emit('cell-mouseenter', row, col)"
          @mouseleave="$emit('cell-mouseleave', row, col)"/>
    </template>
    <td v-if="showAutoWidthCol"></td>
  </tr>
  <template v-if="row['children'] && row['_expanded_']">
    <v3-d-table-tr
        v-for="child in row['children']"
        :row="child"
        :cols="cols"
        :show-auto-width-col="showAutoWidthCol"
        :empty-value="emptyValue"
        :last-left-fixed-col-idx="lastLeftFixedColIdx"
        :activated-rows="activatedRows"
        :level="level + 1"
        @check="(obj, status) => $emit('check', obj, status)"
        @click="(obj) => $emit('click', obj)"
        @dblclick="(obj) => $emit('dblclick', obj)"
        @mouseenter="(obj) => $emit('mouseenter', obj)"
        @mouseleave="(obj) => $emit('mouseleave', obj)"
        @cell-click="(obj, col) => $emit('cell-click', obj, col)"
        @cell-dblclick="(obj, col) => $emit('cell-dblclick', obj, col)"
        @cell-mouseenter="(obj, col) => $emit('cell-mouseenter', obj, col)"
        @cell-mouseleave="(obj, col) => $emit('cell-mouseleave', obj, col)"/>
  </template>
</template>
