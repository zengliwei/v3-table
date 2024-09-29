<script setup>
import {defineProps, defineEmits, ref, watch} from 'vue';

defineEmits(['click', 'dblclick', 'mouseenter', 'mouseleave']);

const props = defineProps({
  col: {
    type: Object,
    required: true
  },

  row: {
    type: Object,
    required: true
  },

  lastLeftFixedColIdx: {
    type: Number,
    default: -1
  },

  level: {
    type: Number,
    default: 0
  },

  tipEmptyValue: {
    type: String,
    default: '-'
  }
});

const renderContent = function (row, col) {
  let html = (col['renderer'] && col['renderer'] instanceof Function)
      ? col['renderer'](row, col)
      : row[col['code']];
  if ([undefined, null, ''].indexOf(html) > -1) {
    html = props.tipEmptyValue;
  }
  return html;
};

const renderExpandedRow = function (row) {
  if (!row['children']) return;
  row['children'].forEach(child => {
    child['_hidden_'] = !row['_expanded_'];
    renderExpandedRow(child);
  });
};

const collapseRow = function (row) {
  if (!row['children']) return;
  row['children'].forEach(child => {
    child['_hidden_'] = true;
    collapseRow(child);
  });
};

const expand = async function (row) {
  row['_expanded_'] = !row['_expanded_'];
  if (row['_expanded_']) {
    if (!row['children'] && props.col['srcGetChildren'] instanceof Function) {
      row['_loading_'] = true;
      row['children'] = await props.col['srcGetChildren'](row);
      row['_loading_'] = false;
    }
    renderExpandedRow(row);
  } else {
    collapseRow(row);
  }
}
</script>

<template>
  <td v-if="col['type'] === 'data' && !col['hidden']"
      :class="col['cssClass']" :style="col['style']"
      @click="$emit('click')"
      @dblclick="$emit('dblclick')"
      @mouseenter="$emit('mouseenter')"
      @mouseleave="$emit('mouseleave')">
    <div>
      <div v-if="col['expandable']"
           :class="`v3-table-cell-lv lv${level}`">
        <span
            v-if="row['children']"
            :class="{
              'v3-table-cell-expander': true,
              'loading': row['_loading_'],
              'expanded': row['_expanded_']
            }"
            @click.prevent.stop="expand(row)"></span>
      </div>
      <div v-if="col['tpl']" class="flex-fill" :v-slot="col['tpl']"></div>
      <div v-else class="flex-fill" v-html="renderContent(row, col)"></div>
    </div>
  </td>
</template>
